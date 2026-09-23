import { NextResponse } from "next/server";
import { toLearnerLesson } from "@/modules/learning/lesson";
import { demoModeEnabled } from "@/server/demo-guard";

export const runtime = "nodejs";

export async function GET() {
  if (!demoModeEnabled()) return NextResponse.json({ error: "local_demo_disabled" }, { status: 503 });
  return NextResponse.json(toLearnerLesson(), { headers: { "Cache-Control": "no-store" } });
}
