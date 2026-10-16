import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: tickets, error } = await supabaseAdmin
      .from("support_tickets")
      .select("*")
      .eq("user_email", session.email)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch support tickets error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, tickets: tickets || [] });
  } catch (err: unknown) {
    console.error("Support tickets GET handler error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { subject, category, priority, message } = body;

    if (!subject?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "Subject and problem description are required" },
        { status: 400 }
      );
    }

    // Generate readable ticket number like BRH-7821
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const ticketNumber = `BRH-${randomSuffix}`;

    const { data: newTicket, error: ticketError } = await supabaseAdmin
      .from("support_tickets")
      .insert({
        workspace_id: session.workspaceId,
        user_id: session.userId,
        user_email: session.email,
        user_name: session.fullName || session.email.split("@")[0],
        ticket_number: ticketNumber,
        subject: subject.trim(),
        category: category || "other",
        priority: priority || "normal",
        status: "open",
        message: message.trim(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (ticketError || !newTicket) {
      console.error("Create ticket error:", ticketError);
      return NextResponse.json({ error: ticketError?.message || "Failed to create ticket" }, { status: 500 });
    }

    // Record initial message in ticket messages thread
    await supabaseAdmin.from("support_ticket_messages").insert({
      ticket_id: newTicket.id,
      sender_type: "customer",
      sender_name: session.fullName || session.email.split("@")[0],
      sender_email: session.email,
      message: message.trim(),
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      ticket: newTicket,
      message: "Ticket created successfully. Our team will review and reply shortly.",
    });
  } catch (err: unknown) {
    console.error("Support ticket POST handler error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
