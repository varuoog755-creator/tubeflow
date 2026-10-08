import { NextResponse } from "next/server";
import { getAuthUrl } from "@/lib/youtube";

export async function GET() {
  try {
    const url = getAuthUrl();
    return NextResponse.redirect(url);
  } catch (error: unknown) {
    console.error("Auth initiation failed:", error);
    return NextResponse.json(
      { error: "Failed to initialize Google authentication" },
      { status: 500 }
    );
  }
}
