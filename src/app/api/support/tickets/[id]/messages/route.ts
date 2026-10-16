import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { isAdmin } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(
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
    const { message } = body;

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Verify access to ticket
    let ticketQuery = supabaseAdmin.from("support_tickets").select("id, status").eq("id", ticketId);
    if (!adminUser) {
      ticketQuery = ticketQuery.eq("user_email", session.email);
    }

    const { data: ticket, error: ticketErr } = await ticketQuery.maybeSingle();
    if (ticketErr || !ticket) {
      return NextResponse.json({ error: "Ticket not found or access denied" }, { status: 404 });
    }

    const senderType = adminUser ? "admin" : "customer";
    const senderName = adminUser ? "BigRedHub Support Team" : (session.fullName || session.email.split("@")[0]);

    // Insert message into thread
    const { data: newMsg, error: msgErr } = await supabaseAdmin
      .from("support_ticket_messages")
      .insert({
        ticket_id: ticketId,
        sender_type: senderType,
        sender_name: senderName,
        sender_email: session.email,
        message: message.trim(),
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (msgErr || !newMsg) {
      return NextResponse.json({ error: msgErr?.message || "Failed to post message" }, { status: 500 });
    }

    // If admin replies, update status to 'in_progress' or keep as is if not resolved
    const ticketUpdates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    if (adminUser && ticket.status === "open") {
      ticketUpdates.status = "in_progress";
    }

    await supabaseAdmin.from("support_tickets").update(ticketUpdates).eq("id", ticketId);

    return NextResponse.json({
      success: true,
      message: newMsg,
    });
  } catch (err: unknown) {
    console.error("Support message POST error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
