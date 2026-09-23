import { NextResponse } from "next/server";
import { completeAttempt } from "@/server/attempt-repository";
import { demoModeEnabled } from "@/server/demo-guard";

export const runtime = "nodejs";

export async function POST(_request: Request, context: { params: Promise<{ attemptId: string }> }) {
  if (!demoModeEnabled()) return NextResponse.json({ error: "local_demo_disabled" }, { status: 503 });
  const { attemptId } = await context.params;
  const result = completeAttempt(attemptId);
  if (result.kind === "missing") return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (result.kind === "incomplete") return NextResponse.json({ error: "lesson_incomplete" }, { status: 400 });
  return NextResponse.json({ attempt: result.attempt, artifact: result.artifact }, { headers: { "Cache-Control": "no-store" } });
}
