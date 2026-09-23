import { NextResponse } from "next/server";
import { z } from "zod";
import { lesson } from "@/modules/learning/lesson";
import { submitAssessment } from "@/server/attempt-repository";
import { demoModeEnabled } from "@/server/demo-guard";

export const runtime = "nodejs";
const assessmentSchema = z.object({
  answers: z.record(z.string(), z.string()),
  rubric: z.record(z.string(), z.number().int().min(0).max(2)),
}).strict();

export async function POST(request: Request, context: { params: Promise<{ attemptId: string }> }) {
  if (!demoModeEnabled()) return NextResponse.json({ error: "local_demo_disabled" }, { status: 503 });
  const parsed = assessmentSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  const rubricIds = new Set(lesson.rubric.map((item) => item.id));
  const answerIds = new Set(lesson.quiz.map((item) => item.id));
  if (Object.keys(parsed.data.rubric).length !== rubricIds.size || Object.keys(parsed.data.rubric).some((id) => !rubricIds.has(id)) ||
      Object.keys(parsed.data.answers).length !== answerIds.size || Object.keys(parsed.data.answers).some((id) => !answerIds.has(id))) {
    return NextResponse.json({ error: "incomplete_assessment" }, { status: 400 });
  }
  const { attemptId } = await context.params;
  const result = submitAssessment({ id: attemptId, ...parsed.data });
  if (result.kind === "missing") return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (result.kind !== "ok") return NextResponse.json({ error: "invalid_assessment" }, { status: 400 });
  return NextResponse.json({ attempt: result.attempt }, { headers: { "Cache-Control": "no-store" } });
}
