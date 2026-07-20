import type { Lang } from "@/lib/i18n";
import type { ExperienceMeta } from "./types";

export const experienceMeta: ExperienceMeta[] = [
  {
    id: "uol",
    startDate: "2024-08-01",
    company: "UOL",
    stack: [
      "Java",
      "Spring",
      "REST APIs",
      "SQL",
      "Redis",
      "JUnit",
      "Jenkins",
      "CI/CD",
      "Kubernetes",
      "Git",
    ],
    current: true,
  },
  {
    id: "autbank-dev",
    startDate: "2023-01-01",
    endDate: "2024-01-01",
    company: "Autbank — Projetos e Consultoria",
    stack: ["Java", "JSF", "Tomcat", "MVC", "Maven", "HTML", "CSS", "SQL Server"],
  },
  {
    id: "autbank-qa",
    startDate: "2021-09-01",
    endDate: "2023-01-01",
    company: "Autbank — Projetos e Consultoria",
    stack: ["JMeter", "SoapUI", "Postman", "RestAssured", "Java", "JavaScript"],
  },
];

type ExperienceText = { role: string; summary: string; bullets: string[] };
type ExperienceId = (typeof experienceMeta)[number]["id"];

const experienceTextPt: Record<ExperienceId, ExperienceText> = {
  uol: {
    role: "Engenheiro de Software (Backend)",
    summary:
      "Desenvolvimento e evolução de APIs e integrações para fluxos críticos de autenticação, autorização e proteção de conta.",
    bullets: [
      "Desenho e implemento endpoints REST em Java/Spring para os fluxos de autenticação e proteção de conta — a camada que protege o login de milhões de usuários — usando Redis para cache/sessão e SQL para persistência.",
      "Padronizo contratos entre serviços consumidos por múltiplos times e refino regras de negócio para reduzir falhas de integração antes que cheguem à produção.",
      "Fortaleço a qualidade com testes unitários e de integração nos fluxos de autenticação, reduzindo regressão em mudanças que afetam login e segurança de conta.",
      "Sustento pipelines de CI/CD e operações em Kubernetes para manter releases estáveis em QA e produção, mesmo com mudanças frequentes em serviços críticos.",
    ],
  },
  "autbank-dev": {
    role: "Analista Desenvolvedor de Sistemas",
    summary:
      "Evolução de funcionalidades de frontend e backend com foco em integridade funcional e eficiência operacional.",
    bullets: [
      "Implementei e mantive telas em JSF/MVC, priorizando usabilidade e comportamento consistente entre os módulos usados no dia a dia pelos times internos.",
      "Implementei melhorias de backend em Java e ajustes em integrações de dados entre sistemas legados, reduzindo inconsistências entre módulos dependentes.",
      "Atuei próximo ao QA para traduzir achados de teste em correções duráveis, encurtando o ciclo entre identificar um problema e corrigi-lo na origem.",
    ],
  },
  "autbank-qa": {
    role: "Analista de Testes",
    summary:
      "Planejamento e execução de testes funcionais, regressivos e de performance, com automação de testes de API.",
    bullets: [
      "Planejei e executei testes funcionais, regressivos e de performance em toda a suíte de produtos financeiros, onde falhas não detectadas têm custo alto.",
      "Automatizei validações de API e integração para ampliar cobertura e aumentar previsibilidade de release.",
      "Construí a base de QA que depois tornou minha transição para backend mais suave.",
    ],
  },
};

const experienceTextEn: Record<ExperienceId, ExperienceText> = {
  uol: {
    role: "Software Engineer (Backend)",
    summary:
      "Developing and evolving APIs and integrations for critical authentication, authorization and account-protection flows.",
    bullets: [
      "Design and implement REST endpoints in Java/Spring for authentication and account-protection flows — the layer that guards login for millions of users — using Redis for cache/session and SQL for persistence.",
      "Standardize service contracts consumed by multiple teams and refine business rules to catch integration failures before they reach production.",
      "Strengthen quality with unit and integration tests on the authentication flows, lowering regression on changes that affect login and account security.",
      "Sustain CI/CD pipelines and Kubernetes operations to keep releases stable across QA and production, even with frequent changes to critical services.",
    ],
  },
  "autbank-dev": {
    role: "Systems Developer Analyst",
    summary:
      "Evolved frontend and backend features with a focus on functional integrity and operational efficiency.",
    bullets: [
      "Implemented and maintained JSF/MVC screens, prioritizing usability and consistent behavior across the modules internal teams relied on daily.",
      "Implemented backend improvements in Java and adjusted data integrations across legacy systems, reducing inconsistencies between dependent modules.",
      "Worked closely with QA to translate test findings into durable fixes, shortening the cycle between spotting an issue and fixing it at the source.",
    ],
  },
  "autbank-qa": {
    role: "QA Analyst",
    summary:
      "Planned and executed functional, regression and performance tests, with API test automation.",
    bullets: [
      "Planned and executed functional, regression and performance tests across the financial product suite, where undetected failures carry a high cost.",
      "Automated API and integration validations to widen coverage and increase release predictability.",
      "Built the QA foundation that later made my transition into backend development smoother.",
    ],
  },
};

export function getExperience(lang: Lang): (ExperienceMeta & ExperienceText)[] {
  const text = lang === "pt" ? experienceTextPt : experienceTextEn;
  // Non-null assertion: `text` has an entry for every id in experienceMeta
  // by construction (both records are keyed by the same ExperienceId union).
  return experienceMeta.map((meta) => ({ ...meta, ...text[meta.id as ExperienceId]! }));
}
