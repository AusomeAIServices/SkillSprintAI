import { NextResponse } from "next/server";
import { createCurrentAttempt, getCurrentAttempt } from "@/server/attempt-repository";
import { demoModeEnabled } from "@/server/demo-guard";

export const runtime = "nodejs";

export async function GET() {
  if (!demoModeEnabled()) return NextResponse.json({ error: "local_demo_disabled" }, { status: 503 });
  return NextResponse.json({ attempt: getCurrentAttempt() }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST() {
  if (!demoModeEnabled()) return NextResponse.json({ error: "local_demo_disabled" }, { status: 503 });
  return NextResponse.json({ attempt: createCurrentAttempt() }, { headers: { "Cache-Control": "no-store" } });
}
