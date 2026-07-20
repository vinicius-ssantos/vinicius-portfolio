import type { Lang } from "@/lib/i18n";
import type { EducationMeta } from "./types";

export const educationMeta: EducationMeta[] = [
  { id: "impacta", institution: "Faculdade Impacta" },
  { id: "fatec", institution: "FATEC Ferraz de Vasconcelos" },
];

type EducationText = { period: string; degree: string };
type EducationId = (typeof educationMeta)[number]["id"];

const educationTextPt: Record<EducationId, EducationText> = {
  impacta: { period: "Pós-graduação", degree: "Pós-graduação em Full Stack Developer" },
  fatec: { period: "2022", degree: "Análise e Desenvolvimento de Sistemas" },
};

const educationTextEn: Record<EducationId, EducationText> = {
  impacta: { period: "Postgraduate", degree: "Full Stack Developer — Postgraduate" },
  fatec: { period: "2022", degree: "Systems Analysis and Development" },
};

export function getEducation(lang: Lang): (EducationMeta & EducationText)[] {
  const text = lang === "pt" ? educationTextPt : educationTextEn;
  // Non-null assertion: `text` has an entry for every id in educationMeta by
  // construction (both records are keyed by the same EducationId union).
  return educationMeta.map((meta) => ({ ...meta, ...text[meta.id as EducationId]! }));
}
