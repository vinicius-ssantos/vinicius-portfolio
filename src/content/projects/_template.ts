import type { Project } from "../types";

/**
 * Template for adding a new project (e.g. AccountShield, FlagForge).
 *
 * Not imported anywhere — copy this file, rename it, fill in real content,
 * then add the export to `./index.ts`'s `projects` array.
 *
 * Minimum bar before setting `visible: true` on an in-development project:
 * a defined problem, a consistent README, an initial architecture, public
 * activity (commits/releases), and a clear next milestone. Until then,
 * keep `visible: false` — an empty or promise-only card does more harm
 * than not showing the project at all.
 *
 * Every field below is either required (no comment) or optional (comment
 * explains when to include it). Never invent numbers for `metrics` —
 * only use values you can point to (a public dashboard, a CI badge, repo
 * insights).
 */
export const exampleProject: Project = {
  slug: "example-project",
  name: "example-project",
  tagline: {
    pt: "Uma frase curta descrevendo o que o projeto faz",
    en: "One short sentence describing what the project does",
  },
  description: {
    pt: "Um parágrafo explicando a arquitetura e o escopo geral.",
    en: "A paragraph explaining the architecture and overall scope.",
  },
  problem: {
    pt: "Qual problema real este projeto resolve, e por quê.",
    en: "What real problem this project solves, and why.",
  },
  approach: [
    {
      pt: "Uma decisão técnica concreta e o motivo dela.",
      en: "One concrete technical decision and why it was made.",
    },
  ],
  stack: ["Java", "Spring"],
  role: {
    pt: "Projeto pessoal — autor único",
    en: "Personal project — sole author",
  },
  highlights: [
    {
      pt: "Um resultado ou capacidade verificável.",
      en: "One verifiable outcome or capability.",
    },
  ],
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

  // architectureNotes: [
  //   { pt: "Decisão de arquitetura 1.", en: "Architecture decision 1." },
  // ],

  // metrics: [
  //   { label: { pt: "Cobertura de testes", en: "Test coverage" }, value: "82%" },
  // ],

  // testingStrategy: {
  //   pt: "Como o projeto é testado (unitário, integração, contract, etc).",
  //   en: "How the project is tested (unit, integration, contract, etc).",
  // },

  // observability: {
  //   pt: "O que é monitorado e como (logs, métricas, tracing).",
  //   en: "What's monitored and how (logs, metrics, tracing).",
  // },

  // limitations: [
  //   { pt: "Uma limitação conhecida e honesta.", en: "One honest known limitation." },
  // ],

  // nextSteps: [
  //   { pt: "O próximo marco planejado.", en: "The next planned milestone." },
  // ],
};
