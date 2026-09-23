import { NextResponse } from "next/server";
import { z } from "zod";
import { STEP_IDS, type LearnerDraft, type StepId } from "@/modules/learning/types";
import { getAttempt, updateAttempt } from "@/server/attempt-repository";
import { demoModeEnabled } from "@/server/demo-guard";

export const runtime = "nodejs";
const patchSchema = z.object({
  expectedRowVersion: z.number().int().positive(),
  currentStep: z.enum(STEP_IDS).optional(),
  draftPatch: z.object({
    prompt: z.string().max(5000).optional(), correctedPlan: z.string().max(10000).optional(),
    sourceCheck: z.string().max(5000).optional(), unknowns: z.string().max(5000).optional(),
    reflection: z.string().max(3000).optional(), rubric: z.record(z.string(), z.number().int().min(0).max(2)).optional(),
    quizAnswers: z.record(z.string(), z.string()).optional(),
  }).strict().optional(),
}).strict();

export async function GET(_request: Request, context: { params: Promise<{ attemptId: string }> }) {
  if (!demoModeEnabled()) return NextResponse.json({ error: "local_demo_disabled" }, { status: 503 });
  const { attemptId } = await context.params;
  const attempt = getAttempt(attemptId);
  if (!attempt) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ attempt }, { headers: { "Cache-Control": "no-store" } });
}

export async function PATCH(request: Request, context: { params: Promise<{ attemptId: string }> }) {
  if (!demoModeEnabled()) return NextResponse.json({ error: "local_demo_disabled" }, { status: 503 });
  const { attemptId } = await context.params;
  const parsed = patchSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  const result = updateAttempt({
    id: attemptId, expectedRowVersion: parsed.data.expectedRowVersion,
    currentStep: parsed.data.currentStep as StepId | undefined,
    draftPatch: parsed.data.draftPatch as Partial<LearnerDraft> | undefined,
  });
  if (result.kind === "missing") return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (result.kind === "conflict") return NextResponse.json({ error: "version_conflict", attempt: result.attempt }, { status: 409 });
  if (result.kind !== "ok") return NextResponse.json({ error: "attempt_not_editable" }, { status: 409 });
  return NextResponse.json({ attempt: result.attempt }, { headers: { "Cache-Control": "no-store" } });
}
