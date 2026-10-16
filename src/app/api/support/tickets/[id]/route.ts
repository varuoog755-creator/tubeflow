import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { isAdmin } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession(request);
    if (!session?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: ticketId } = await params;
    const adminUser = isAdmin(session.email);

    // Fetch ticket
    let query = supabaseAdmin.from("support_tickets").select("*").eq("id", ticketId);
    if (!adminUser) {
      query = query.eq("user_email", session.email);
    }

    const { data: ticket, error: ticketErr } = await query.maybeSingle();
    if (ticketErr || !ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // Fetch conversation thread
    const { data: messages, error: msgErr } = await supabaseAdmin
      .from("support_ticket_messages")
      .select("*")
      .eq("ticket_id", ticketId)
      .order("created_at", { ascending: true });

    if (msgErr) {
      console.error("Fetch ticket messages error:", msgErr);
    }

    return NextResponse.json({
      success: true,
      ticket,
      messages: messages || [],
    });
  } catch (err: unknown) {
    console.error("Support ticket detail GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession(request);
    if (!session?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: ticketId } = await params;
    const adminUser = isAdmin(session.email);
    const body = await request.json().catch(() => ({}));
    const { status, admin_notes } = body;

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (status) {
      updates.status = status;
      if (status === "resolved" || status === "closed") {
        updates.resolved_at = new Date().toISOString();
      }
    }

    if (adminUser && admin_notes !== undefined) {
      updates.admin_notes = admin_notes;
    }

    let updateQuery = supabaseAdmin
      .from("support_tickets")
      .update(updates)
      .eq("id", ticketId);

    if (!adminUser) {
      updateQuery = updateQuery.eq("user_email", session.email);
    }

    const { data: updatedTicket, error } = await updateQuery.select().single();
    if (error || !updatedTicket) {
      return NextResponse.json({ error: error?.message || "Failed to update ticket" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      ticket: updatedTicket,
    });
  } catch (err: unknown) {
    console.error("Support ticket PATCH error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
