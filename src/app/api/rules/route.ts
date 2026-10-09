import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";
import {
  evaluateRuleMatch,
  renderReply,
  validateCtaUrl,
  validateReplyTemplate,
} from "@/lib/reply-engine";
import { detectIntent } from "@/lib/intent";

export const dynamic = "force-dynamic";

// Helper: resolve user profile and workspace
async function getAuthenticatedUser(request: NextRequest) {
  const session = await getSession();
  const email = session?.email;
  if (!email) return null;

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("id, email, full_name")
    .eq("email", email)
    .maybeSingle();

  if (!profile) return null;

  const { data: workspace } = await supabaseAdmin
    .from("workspaces")
    .select("id, owner_id")
    .eq("owner_id", profile.id)
    .maybeSingle();

  const { data: channels } = await supabaseAdmin
    .from("youtube_channels")
    .select("id, channel_id, channel_title")
    .eq("user_id", profile.id);

  const channelIds = (channels || []).map((c) => c.id);

  return {
    profile,
    workspace,
    channels: channels || [],
    channelIds,
  };
}

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthenticatedUser(request);
    if (!auth) {
      return NextResponse.json({ rules: [] }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const ruleId = searchParams.get("id");

    if (ruleId) {
      // Fetch single rule + execution history
      let ruleQuery = supabaseAdmin
        .from("trigger_rules")
        .select("*, youtube_channels(channel_title)")
        .eq("id", ruleId);
      if (auth.workspace?.id) {
        ruleQuery = ruleQuery.or(`workspace_id.eq.${auth.workspace.id},channel_id.in.(${auth.channelIds.length ? auth.channelIds.join(",") : "00000000-0000-0000-0000-000000000000"})`);
      } else {
        ruleQuery = ruleQuery.in("channel_id", auth.channelIds.length ? auth.channelIds : ["00000000-0000-0000-0000-000000000000"]);
      }
      const { data: rule } = await ruleQuery.maybeSingle();

      if (!rule) {
        return NextResponse.json({ error: "Rule not found" }, { status: 404 });
      }

      const { data: executions } = await supabaseAdmin
        .from("processed_comments")
        .select("*")
        .eq("matched_rule_id", ruleId)
        .in("channel_id", auth.channelIds.length ? auth.channelIds : ["00000000-0000-0000-0000-000000000000"])
        .order("created_at", { ascending: false })
        .limit(20);

      return NextResponse.json({ rule, executions: executions || [] });
    }

    // List rules scoped to workspace or user's channels
    let query = supabaseAdmin
      .from("trigger_rules")
      .select("*, youtube_channels(channel_title)")
      .order("created_at", { ascending: false });

    if (auth.workspace?.id) {
      query = query.or(`workspace_id.eq.${auth.workspace.id},channel_id.in.(${auth.channelIds.length > 0 ? auth.channelIds.join(",") : "00000000-0000-0000-0000-000000000000"})`);
    } else if (auth.channelIds.length > 0) {
      query = query.in("channel_id", auth.channelIds);
    }

    const { data: rules, error } = await query;

    if (error) {
      console.error("Rules fetch query error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ rules: rules || [] });
  } catch (error: unknown) {
    console.error("Fetch rules error:", error);
    return NextResponse.json({ error: "Failed to fetch rules" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthenticatedUser(request);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body;

    // ACTION: DRY-RUN TEST
    if (action === "test_dry_run") {
      const {
        testCommentText,
        testAuthorName,
        keywords,
        negativeKeywords,
        matchType,
        keywordMatchOperator,
        intentCategory,
        replyTemplate,
        ctaUrl,
      } = body;

      if (!testCommentText) {
        return NextResponse.json(
          { error: "Test comment text is required for dry-run simulation" },
          { status: 400 }
        );
      }

      const detected = detectIntent(testCommentText);
      const evalResult = evaluateRuleMatch(
        {
          keywords: Array.isArray(keywords)
            ? keywords
            : (keywords || "").split(",").map((k: string) => k.trim()),
          negativeKeywords: Array.isArray(negativeKeywords)
            ? negativeKeywords
            : (negativeKeywords || "").split(",").map((k: string) => k.trim()),
          matchType: matchType || "contains",
          keywordMatchOperator: keywordMatchOperator || "ANY",
          intentCategory: intentCategory || "ALL",
        },
        testCommentText,
        detected.category
      );

      let renderedPreview = null;
      if (evalResult.matched && replyTemplate) {
        renderedPreview = renderReply(replyTemplate, {
          authorName: testAuthorName || "TestViewer",
          channelTitle: auth.channels[0]?.channel_title || "My YouTube Channel",
          ctaUrl: ctaUrl || "https://tubeflow.in/preview",
        });
      }

      return NextResponse.json({
        success: true,
        evaluation: evalResult,
        detectedIntent: detected,
        renderedPreview,
      });
    }

    // ACTION: DUPLICATE RULE
    if (action === "duplicate") {
      const { ruleId } = body;
      if (!ruleId) {
        return NextResponse.json({ error: "Source ruleId required" }, { status: 400 });
      }

      const { data: original } = await supabaseAdmin
        .from("trigger_rules")
        .select("*")
        .eq("id", ruleId)
        .maybeSingle();

      if (
        original &&
        original.workspace_id !== auth.workspace?.id &&
        !auth.channelIds.includes(original.channel_id)
      ) {
        return NextResponse.json({ error: "Original rule not found" }, { status: 404 });
      }

      if (!original) {
        return NextResponse.json({ error: "Original rule not found" }, { status: 404 });
      }

      const { data: duplicated, error: dupErr } = await supabaseAdmin
        .from("trigger_rules")
        .insert({
          ...original,
          id: undefined,
          name: `${original.name} (Copy)`,
          is_active: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select("*")
        .single();

      if (dupErr) {
        return NextResponse.json({ error: dupErr.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, rule: duplicated });
    }

    // ACTION: CREATE RULE
    const {
      name,
      keywords,
      negativeKeywords,
      matchType,
      keywordMatchOperator,
      targetMode,
      targetVideoIds,
      targetVideoId,
      campaignType,
      replyTemplates,
      ctaUrl,
      intentCategory,
      delaySeconds,
      channelId,
    } = body;

    if (!name || !keywords || !replyTemplates || replyTemplates.length === 0) {
      return NextResponse.json(
        { error: "Rule name, keywords, and at least one reply template are required" },
        { status: 400 }
      );
    }

    // Validation: CTA URL
    const urlValidation = validateCtaUrl(ctaUrl);
    if (!urlValidation.valid) {
      return NextResponse.json({ error: urlValidation.error }, { status: 400 });
    }

    // Validation: Template Spintax & Variables
    const templateArray = Array.isArray(replyTemplates) ? replyTemplates : [replyTemplates];
    for (const t of templateArray) {
      const templateVal = validateReplyTemplate(t);
      if (!templateVal.valid) {
        return NextResponse.json({ error: templateVal.error }, { status: 400 });
      }
    }

    const keywordList = Array.isArray(keywords)
      ? keywords
      : keywords.split(",").map((k: string) => k.trim().toUpperCase()).filter(Boolean);

    const negativeList = Array.isArray(negativeKeywords)
      ? negativeKeywords
      : (negativeKeywords || "")
          .split(",")
          .map((k: string) => k.trim().toUpperCase())
          .filter(Boolean);

    const resolvedVideoIds = Array.isArray(targetVideoIds)
      ? targetVideoIds
      : targetVideoId
      ? [targetVideoId]
      : [];

    // Selected channel or fallback to user's first channel
    if (channelId && !auth.channelIds.includes(channelId)) {
      return NextResponse.json({ error: "Channel not found for this workspace" }, { status: 404 });
    }
    const targetChannelId = channelId || auth.channels[0]?.id || null;

    const insertPayload: Record<string, unknown> = {
      workspace_id: auth.workspace?.id || null,
      channel_id: targetChannelId,
      name: name.trim(),
      keywords: keywordList,
      negative_keywords: negativeList,
      match_type: matchType || "contains",
      keyword_match_operator: (keywordMatchOperator || "ANY").toUpperCase(),
      target_mode: targetMode || "all",
      target_video_ids: resolvedVideoIds,
      reply_templates: templateArray,
      cta_url: ctaUrl?.trim() || null,
      intent_category: intentCategory || "ALL",
      delay_seconds: parseInt(delaySeconds || "0", 10),
      is_active: true,
    };

    let { data: newRule, error: insertErr } = await supabaseAdmin
      .from("trigger_rules")
      .insert(insertPayload)
      .select("*")
      .single();

    // Fallbacks if columns have not been migrated to DB yet
    if (insertErr && insertErr.message.includes("target_video_ids")) {
      delete insertPayload.target_video_ids;
      const retry = await supabaseAdmin
        .from("trigger_rules")
        .insert(insertPayload)
        .select("*")
        .single();
      newRule = retry.data;
      insertErr = retry.error;
    }

    if (insertErr && insertErr.message.includes("keyword_match_operator")) {
      delete insertPayload.keyword_match_operator;
      const retry = await supabaseAdmin
        .from("trigger_rules")
        .insert(insertPayload)
        .select("*")
        .single();
      newRule = retry.data;
      insertErr = retry.error;
    }

    if (insertErr) {
      return NextResponse.json({ error: insertErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, rule: newRule });
  } catch (error: unknown) {
    console.error("Create rule error:", error);
    return NextResponse.json({ error: "Failed to create trigger rule" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await getAuthenticatedUser(request);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      id,
      name,
      keywords,
      negativeKeywords,
      matchType,
      keywordMatchOperator,
      targetMode,
      targetVideoIds,
      targetVideoId,
      campaignType,
      replyTemplates,
      ctaUrl,
      intentCategory,
      delaySeconds,
      channelId,
      is_active,
    } = body;

    if (!id) {
      return NextResponse.json({ error: "Rule ID is required" }, { status: 400 });
    }

    // Validate CTA URL if provided
    if (ctaUrl) {
      const urlValidation = validateCtaUrl(ctaUrl);
      if (!urlValidation.valid) {
        return NextResponse.json({ error: urlValidation.error }, { status: 400 });
      }
    }

    // Validate templates if provided
    if (replyTemplates) {
      const templateArray = Array.isArray(replyTemplates) ? replyTemplates : [replyTemplates];
      for (const t of templateArray) {
        const val = validateReplyTemplate(t);
        if (!val.valid) {
          return NextResponse.json({ error: val.error }, { status: 400 });
        }
      }
    }

    const updatePayload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (name !== undefined) updatePayload.name = name.trim();
    if (keywords !== undefined) {
      updatePayload.keywords = Array.isArray(keywords)
        ? keywords
        : keywords.split(",").map((k: string) => k.trim().toUpperCase()).filter(Boolean);
    }
    if (negativeKeywords !== undefined) {
      updatePayload.negative_keywords = Array.isArray(negativeKeywords)
        ? negativeKeywords
        : negativeKeywords.split(",").map((k: string) => k.trim().toUpperCase()).filter(Boolean);
    }
    if (matchType !== undefined) updatePayload.match_type = matchType;
    if (keywordMatchOperator !== undefined)
      updatePayload.keyword_match_operator = keywordMatchOperator.toUpperCase();
    if (targetMode !== undefined) updatePayload.target_mode = targetMode;
    if (targetVideoIds !== undefined) {
      updatePayload.target_video_ids = Array.isArray(targetVideoIds) ? targetVideoIds : [targetVideoIds];
    } else if (targetVideoId !== undefined) {
      updatePayload.target_video_ids = [targetVideoId];
    }
    if (replyTemplates !== undefined) {
      updatePayload.reply_templates = Array.isArray(replyTemplates)
        ? replyTemplates
        : [replyTemplates];
    }
    if (ctaUrl !== undefined) updatePayload.cta_url = ctaUrl ? ctaUrl.trim() : null;
    if (intentCategory !== undefined) updatePayload.intent_category = intentCategory;
    if (delaySeconds !== undefined) updatePayload.delay_seconds = parseInt(delaySeconds, 10);
    if (channelId !== undefined) updatePayload.channel_id = channelId;
    if (is_active !== undefined) updatePayload.is_active = is_active;

    let { data: updated, error } = await supabaseAdmin
      .from("trigger_rules")
      .update(updatePayload)
      .eq("id", id)
      .or(auth.workspace?.id ? `workspace_id.eq.${auth.workspace.id},channel_id.in.(${auth.channelIds.length ? auth.channelIds.join(",") : "00000000-0000-0000-0000-000000000000"})` : `channel_id.in.(${auth.channelIds.length ? auth.channelIds.join(",") : "00000000-0000-0000-0000-000000000000"})`)
      .select("*")
      .single();

    if (error && error.message.includes("target_video_ids")) {
      delete updatePayload.target_video_ids;
      const retry = await supabaseAdmin
        .from("trigger_rules")
        .update(updatePayload)
        .eq("id", id)
        .or(auth.workspace?.id ? `workspace_id.eq.${auth.workspace.id},channel_id.in.(${auth.channelIds.length ? auth.channelIds.join(",") : "00000000-0000-0000-0000-000000000000"})` : `channel_id.in.(${auth.channelIds.length ? auth.channelIds.join(",") : "00000000-0000-0000-0000-000000000000"})`)
        .select("*")
        .single();
      updated = retry.data;
      error = retry.error;
    }

    if (error && error.message.includes("keyword_match_operator")) {
      delete updatePayload.keyword_match_operator;
      const retry = await supabaseAdmin
        .from("trigger_rules")
        .update(updatePayload)
        .eq("id", id)
        .or(auth.workspace?.id ? `workspace_id.eq.${auth.workspace.id},channel_id.in.(${auth.channelIds.length ? auth.channelIds.join(",") : "00000000-0000-0000-0000-000000000000"})` : `channel_id.in.(${auth.channelIds.length ? auth.channelIds.join(",") : "00000000-0000-0000-0000-000000000000"})`)
        .select("*")
        .single();
      updated = retry.data;
      error = retry.error;
    }

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, rule: updated });
  } catch (error: unknown) {
    console.error("Update rule error:", error);
    return NextResponse.json({ error: "Failed to update rule" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = await getAuthenticatedUser(request);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, is_active } = body;

    if (!id) {
      return NextResponse.json({ error: "Rule ID required" }, { status: 400 });
    }

    const { data: updated, error } = await supabaseAdmin
      .from("trigger_rules")
      .update({ is_active, updated_at: new Date().toISOString() })
      .eq("id", id)
      .or(auth.workspace?.id ? `workspace_id.eq.${auth.workspace.id},channel_id.in.(${auth.channelIds.length ? auth.channelIds.join(",") : "00000000-0000-0000-0000-000000000000"})` : `channel_id.in.(${auth.channelIds.length ? auth.channelIds.join(",") : "00000000-0000-0000-0000-000000000000"})`)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, rule: updated });
  } catch (error: unknown) {
    console.error("Toggle rule status error:", error);
    return NextResponse.json({ error: "Failed to update rule status" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = await getAuthenticatedUser(request);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Rule ID required" }, { status: 400 });
    }

    await supabaseAdmin.from("trigger_rules").delete().eq("id", id)
      .or(auth.workspace?.id ? `workspace_id.eq.${auth.workspace.id},channel_id.in.(${auth.channelIds.length ? auth.channelIds.join(",") : "00000000-0000-0000-0000-000000000000"})` : `channel_id.in.(${auth.channelIds.length ? auth.channelIds.join(",") : "00000000-0000-0000-0000-000000000000"})`);
    return NextResponse.json({ success: true, message: "Rule deleted successfully" });
  } catch (error: unknown) {
    console.error("Delete rule error:", error);
    return NextResponse.json({ error: "Failed to delete rule" }, { status: 500 });
  }
}
