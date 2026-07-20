import { yearsSince } from "./types";
import type { Lang } from "@/lib/i18n";

// Career start date — September 2021 = first day at Autbank as QA Analyst.
// Used to compute years of experience dynamically (see `yearsSince`).
const CAREER_START = "2021-09-01";

// Must match the Autbank "Analista Desenvolvedor de Sistemas" startDate in
// experience.ts — the point the day-to-day work shifted from QA to development.
const BACKEND_START = "2023-01-01";

/**
 * Neutral profile fields — locale-independent, safe to import anywhere
 * (including src/app/api/contact/route.ts, which has no `lang` in scope).
 * Translatable fields (role, pitch, bio, currently-learning items, stat
 * labels) live in `profileText` below, resolved per-locale via `getProfile`.
 */
export const profile = {
  name: "Vinicius de Oliveira Santos",
  shortName: "Vinicius Santos",
  handle: "vinicius-ssantos",
  company: "UOL",
  locationShort: "São Paulo, BR",
  email: "viniciusoli2020@gmail.com",
  // Deliberately shipped in the client bundle, same as the rest of this
  // file — it's already public on the downloadable CV PDF, so hiding it
  // behind a server round-trip would add complexity without actually
  // protecting anything. The reveal-phone.tsx click-to-show UI is a casual
  // deterrent against dumb scrapers, not a real access control.
  phone: "+55 (11) 91676-2083",
  languages: ["PT (nativo)", "EN (intermediário)"],
  // Career start date — used to compute years of experience dynamically.
  // September 2021 = first day at Autbank as QA Analyst.
  careerStart: CAREER_START,
  // Neutral stat values (dates computed once at module load, plus a
  // manually-maintained repo count) — src/lib/github.ts reads statValues[2]
  // as the fallback when the live GitHub API call isn't available. Labels
  // for these are translatable and live in profileText below.
  statValues: [yearsSince(CAREER_START), yearsSince(BACKEND_START), "53"] as [
    string,
    string,
    string,
  ],
  links: {
    github: "https://github.com/vinicius-ssantos",
    linkedin: "https://www.linkedin.com/in/vinicius-oliveira-7ba1bb204/",
    cv: "/cv-vinicius-santos.pdf",
  },
};

type CurrentlyLearningItem = { topic: string; detail: string };

type ProfileText = {
  role: string;
  location: string;
  pitch: string;
  longPitch: string;
  careerPath: string;
  philosophy: string;
  currentlyLearning: CurrentlyLearningItem[];
  statLabels: [string, string, string];
};

const profileTextPt: ProfileText = {
  role: "Engenheiro de Software Backend",
  location: "São Paulo, SP — Brasil",
  pitch:
    "Engenheiro de Software Backend na UOL, especializado em Java, Spring e serviços críticos de autenticação e proteção de contas. Construo APIs e integrações com foco em segurança, confiabilidade, testes e estabilidade em produção.",
  longPitch:
    "Engenheiro de Software Backend com experiência em APIs, integrações e serviços críticos de segurança. Atuo com foco em confiabilidade, qualidade de entrega e estabilidade em produção — construindo e evoluindo o tipo de sistema onde pequenos erros têm consequências grandes. Meu dia a dia na UOL envolve endurecer fluxos de autenticação e proteção de conta, padronizar contratos entre serviços e sustentar pipelines de CI/CD em Kubernetes para que releases fiquem entediantes.",
  careerPath:
    "Meu caminho até backend foi incomum: comecei em QA na Autbank em 2021, automatizando testes de API com RestAssured e JMeter. Dois anos depois, mudei para a cadeira de desenvolvedor na mesma empresa, e em 2024 entrei na UOL para trabalhar na camada de autenticação e proteção de conta que milhões de brasileiros usam diariamente. Os anos de QA ainda moldam como escrevo código — penso primeiro em modos de falha, depois em caminhos felizes.",
  philosophy:
    "Mantenho um GitHub público com dezenas de repositórios porque acredito em construir em público — experimentos pela metade incluídos. O mais ambicioso é o personal-platform-infra, um repositório de infraestrutura estilo GitOps que roda minha plataforma pessoal de MCP servers e BFFs em ambientes local + VPS. Se você quer saber como eu penso, o histórico de commits é um currículo mais honesto do que qualquer PDF.",
  currentlyLearning: [
    { topic: "MCP Servers", detail: "Construindo e operando MCP servers no cluster k3s pessoal" },
    {
      topic: "Spring Cloud",
      detail: "Estudando padrões de microserviços: service discovery, gateway, circuit breakers",
    },
    { topic: "GitOps + KEDA", detail: "Autoscaling orientado a eventos no Kubernetes com KEDA" },
  ],
  statLabels: ["Anos em software & QA", "Anos em backend", "Repositórios públicos"],
};

const profileTextEn: ProfileText = {
  role: "Backend Software Engineer",
  location: "São Paulo, SP — Brazil",
  pitch:
    "Backend Software Engineer at UOL, specialized in Java, Spring, and critical authentication and account-protection services. I build APIs and integrations with a focus on security, reliability, testing, and production stability.",
  longPitch:
    "Backend Software Engineer with experience in APIs, integrations and security-critical services. I work with a focus on reliability, delivery quality and production stability — building and evolving the kind of systems where small mistakes have outsized consequences. My day-to-day at UOL involves hardening authentication and account-protection flows, standardizing contracts between services, and sustaining CI/CD pipelines on Kubernetes so releases stay boring.",
  careerPath:
    "My path into backend was unusual: I started in QA at Autbank in 2021, automating API tests with RestAssured and JMeter. Two years later I moved into the developer seat at the same company, and in 2024 I joined UOL to work on the authentication and account-protection layer that millions of Brazilians rely on daily. The QA years still shape how I write code — I think in terms of failure modes first, happy paths second.",
  philosophy:
    "I keep a public GitHub with dozens of repositories because I believe in shipping in the open — half-finished experiments included. The most ambitious one is personal-platform-infra, a GitOps-style infrastructure repo that runs my personal platform of MCP servers and BFFs across local + VPS environments. If you want to know how I think, the commit history is a more honest résumé than any PDF.",
  currentlyLearning: [
    {
      topic: "MCP Servers",
      detail: "Building and operating MCP servers on my personal k3s cluster",
    },
    {
      topic: "Spring Cloud",
      detail: "Studying microservices patterns: service discovery, gateway, circuit breakers",
    },
    { topic: "GitOps + KEDA", detail: "Event-driven autoscaling on Kubernetes with KEDA" },
  ],
  statLabels: ["Years in software & QA", "Years in backend", "Public repositories"],
};

export function getProfile(lang: Lang) {
  const text = lang === "pt" ? profileTextPt : profileTextEn;
  return {
    ...profile,
    ...text,
    stats: profile.statValues.map((value, i) => ({ label: text.statLabels[i], value })) as [
      { label: string; value: string },
      { label: string; value: string },
      { label: string; value: string },
    ],
  };
}
