import { NextResponse } from "next/server";
import { getLatestArtifact, getReviews } from "@/server/attempt-repository";
import { demoModeEnabled } from "@/server/demo-guard";

export const runtime = "nodejs";

export async function GET() {
  if (!demoModeEnabled()) return NextResponse.json({ error: "local_demo_disabled" }, { status: 503 });
  const artifact = getLatestArtifact();
  return NextResponse.json({ artifact, reviews: getReviews() }, { headers: { "Cache-Control": "no-store" } });
}
