"use client";

import { useParams } from "next/navigation";
import MainScrollContainer from "@/components/MainScrollContainer/MainScrollContainer";
import { notFound } from "next/navigation";

const VALID_SECTIONS = ["about", "skills-certs", "projects", "experience", "domains"];

export default function SectionPage() {
  const params = useParams();
  const slug = params.section as string;

  // Unknown section fallback
  if (slug && !VALID_SECTIONS.includes(slug)) {
    notFound();
  }

  return (
    <main className="scene-layer">
      <MainScrollContainer />
    </main>
  );
}
