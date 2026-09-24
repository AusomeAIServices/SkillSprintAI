import type { Metadata } from "next";
import { GenAiIntro } from "@/components/gen-ai-intro";

export const metadata: Metadata = { title: "Gen AI Introduction · SkillSprint AI", description: "Four short, source-linked lessons about generative AI, chat, prompting, and context." };
export default function GenAiIntroductionPage() { return <GenAiIntro />; }
