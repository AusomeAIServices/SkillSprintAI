import Link from "next/link";
import { notFound } from "next/navigation";
import { findPath, learningPaths } from "@/modules/learning/pathways";
import { PathPlayer } from "@/components/path-player";
import { ThemePicker } from "@/components/theme-picker";

export function generateStaticParams() { return learningPaths.map((path) => ({ slug: path.slug })); }

export default async function PathPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const path = findPath(slug);
  if (!path) notFound();
  return <><header className="topbar"><Link className="brand" href="/"><span className="brand-mark" aria-hidden="true">S</span>SkillSprint AI</Link><div className="topbar-right"><ThemePicker /><Link className="back-link" href="/">← <span className="back-label">Main menu</span></Link></div></header><PathPlayer path={path} /></>;
}
