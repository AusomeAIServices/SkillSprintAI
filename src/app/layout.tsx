import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SkillSprint AI — one useful skill in 15 minutes",
  description: "Learn practical AI skills in short daily sessions and save evidence of what you can do.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
