import type { Lang } from "@/lib/i18n";
import type { ProjectMeta, ProjectText } from "../types";

/**
 * Template for adding a new project (e.g. AccountShield, FlagForge).
 *
 * Not imported anywhere — copy this file, rename it, fill in real content,
 * then add both to `./index.ts`: the meta object to `projectMetas` and the
 * getter to `projectGetters`.
 *
 * Minimum bar before setting `visible: true` on an in-development project:
 * a defined problem, a consistent README, an initial architecture, public
 * activity (commits/releases), and a clear next milestone. Until then,
 * keep `visible: false` — an empty or promise-only card does more harm
 * than not showing the project at all.
 *
 * Neutral fields (dates, URLs, stack, flags) live once in `exampleProjectMeta`.
 * Translatable fields live once per locale below — never invent numbers for
 * `metrics`, only use values you can point to (a public dashboard, a CI
 * badge, repo insights).
 */
export const exampleProjectMeta: ProjectMeta = {
  slug: "example-project",
  name: "example-project",
  stack: ["Java", "Spring"],
  repoUrl: "https://github.com/vinicius-ssantos/example-project",
  updatedAt: "2026-01-01", // ISO date, bump manually when content changes

  // --- Optional fields below — omit entirely rather than leaving empty ---

  // liveUrl: "https://example-project.example.com",
  // image: "/projects/example-project.png",
  // featured: true, // only one project should be featured at a time

  status: "development", // "development" | "beta" | omit once stable
  visible: false, // flip to true only once the project meets the bar above

  // links: {
  //   demo: "https://example-project.example.com",
  //   docs: "https://example-project.example.com/docs",
  //   openApi: "https://example-project.example.com/swagger",
  //   video: "https://youtube.com/watch?v=...",
  // },
};

const pt: ProjectText = {
  tagline: "Uma frase curta descrevendo o que o projeto faz",
  description: "Um parágrafo explicando a arquitetura e o escopo geral.",
  problem: "Qual problema real este projeto resolve, e por quê.",
  approach: ["Uma decisão técnica concreta e o motivo dela."],
  role: "Projeto pessoal — autor único",
  highlights: ["Um resultado ou capacidade verificável."],

  // architectureNotes: ["Decisão de arquitetura 1."],
  // metrics: [{ label: "Cobertura de testes", value: "82%" }],
  // testingStrategy: "Como o projeto é testado (unitário, integração, contract, etc).",
  // observability: "O que é monitorado e como (logs, métricas, tracing).",
  // limitations: ["Uma limitação conhecida e honesta."],
  // nextSteps: ["O próximo marco planejado."],
};

const en: ProjectText = {
  tagline: "One short sentence describing what the project does",
  description: "A paragraph explaining the architecture and overall scope.",
  problem: "What real problem this project solves, and why.",
  approach: ["One concrete technical decision and why it was made."],
  role: "Personal project — sole author",
  highlights: ["One verifiable outcome or capability."],

  // architectureNotes: ["Architecture decision 1."],
  // metrics: [{ label: "Test coverage", value: "82%" }],
  // testingStrategy: "How the project is tested (unit, integration, contract, etc).",
  // observability: "What's monitored and how (logs, metrics, tracing).",
  // limitations: ["One honest known limitation."],
  // nextSteps: ["The next planned milestone."],
};

const text: Record<Lang, ProjectText> = { pt, en };

export function getExampleProject(lang: Lang) {
  return { ...exampleProjectMeta, ...text[lang] };
}
