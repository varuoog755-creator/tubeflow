import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { createSessionToken, setSessionCookie } from "@/lib/session";

import { isAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const origin = request.nextUrl.origin;
    const { searchParams } = new URL(request.url);
    const rawEmail = searchParams.get("email") || "govinda755rock755@gmail.com";
    const email = rawEmail.toLowerCase().trim();
    const isUserAdmin = isAdmin(email);
    
    const defaultName = isUserAdmin 
      ? "Govinda Admin" 
      : email === "himalayanpine8@gmail.com" 
      ? "Himalayan Pine" 
      : email.split("@")[0];
    const name = searchParams.get("name") || defaultName;
    const redirectParam = searchParams.get("redirect");

    // 1. Check or create Profile
    let userId: string;
    const { data: existingProfile } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingProfile) {
      userId = existingProfile.id;
    } else {
      userId = crypto.randomUUID();
      await supabaseAdmin.from("profiles").insert({
        id: userId,
        email,
        full_name: name,
        updated_at: new Date().toISOString(),
      });
    }

    // 2. Check or create Workspace
    let workspaceId: string;
    const { data: existingWorkspace } = await supabaseAdmin
      .from("workspaces")
      .select("id")
      .eq("owner_id", userId)
      .maybeSingle();

    if (existingWorkspace) {
      workspaceId = existingWorkspace.id;
    } else {
      workspaceId = crypto.randomUUID();
      const slug = `${email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`;
      await supabaseAdmin.from("workspaces").insert({
        id: workspaceId,
        name: `${name}'s Workspace`,
        slug,
        owner_id: userId,
        plan: isUserAdmin ? "scale" : "growth",
        plan_status: "active",
      });

      await supabaseAdmin.from("workspace_members").insert({
        workspace_id: workspaceId,
        user_id: userId,
        role: "owner",
      });
    }

    // 3. Ensure YouTube Channel exists for this user
    const { data: existingChannel } = await supabaseAdmin
      .from("youtube_channels")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    let channelId = existingChannel?.id;
    if (!channelId) {
      const channelDbId = crypto.randomUUID();
      const isGovinda = email === "govinda755rock755@gmail.com";
      await supabaseAdmin.from("youtube_channels").insert({
        id: channelDbId,
        user_id: userId,
        workspace_id: workspaceId,
        channel_id: isGovinda ? "UC_GovindaAdmin_Official" : "UC_HimalayanPine_Official",
        channel_title: isGovinda ? "Govinda Official Media" : "Himalayan Pine Studio",
        custom_url: isGovinda ? "@govinda_admin" : "@himalayanpine",
        thumbnail_url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=150&auto=format&fit=crop&q=80",
        subscriber_count: isGovinda ? 85400 : 24800,
        video_count: isGovinda ? 128 : 52,
        view_count: isGovinda ? 1420000 : 489200,
        access_token: "demo_channel_token",
        refresh_token: "demo_channel_refresh",
        is_active: true,
      });
      channelId = channelDbId;
    }

    // 4. Create Signed Session JWT Token
    const sessionToken = await createSessionToken({
      userId,
      email,
      fullName: name,
      avatarUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=150&auto=format&fit=crop&q=80",
      workspaceId,
    });

    const destination = redirectParam
      ? redirectParam.startsWith("http")
        ? redirectParam
        : `${origin}${redirectParam.startsWith("/") ? redirectParam : `/${redirectParam}`}`
      : `${origin}/dashboard?authenticated=true`;

    const response = NextResponse.redirect(destination);
    setSessionCookie(response, sessionToken);

    // Backward-compatibility cookie
    response.cookies.set("tf_user_email", email, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return response;
  } catch (error: unknown) {
    console.error("Customer direct login error:", error);
    return NextResponse.redirect(`${request.nextUrl.origin}/login?error=customer_login_failed`);
  }
}
