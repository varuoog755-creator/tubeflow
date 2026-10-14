import { NextRequest, NextResponse } from "next/server";
import { getSession, setSessionCookie, createSessionToken } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("email", session.email)
      .maybeSingle();

    const { data: workspace } = await supabaseAdmin
      .from("workspaces")
      .select("*")
      .eq("id", session.workspaceId)
      .maybeSingle();

    const authHeader = request.headers.get("authorization");
    let token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7).trim() : null;
    if (!token) {
      token = await createSessionToken(session);
    }

    const response = NextResponse.json({
      authenticated: true,
      token,
      user: {
        id: session.userId,
        email: session.email,
        fullName: profile?.full_name || session.fullName,
        avatarUrl: profile?.avatar_url || session.avatarUrl,
        workspace: workspace || {
          id: session.workspaceId,
          name: `${session.fullName}'s Workspace`,
          plan: "free",
        },
      },
    });

    if (token) {
      setSessionCookie(response, token);
    }

    return response;
  } catch (error: unknown) {
    console.error("Session fetch error:", error);
    return NextResponse.json({ error: "Failed to verify session" }, { status: 500 });
  }
}
