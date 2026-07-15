import { yearsSince, type LocalizedText, type StatItem } from "./types";

// Career start date — September 2021 = first day at Autbank as QA Analyst.
// Used to compute years of experience dynamically (see `yearsSince`).
const CAREER_START = "2021-09-01";

// Fixed-length tuple: StatsBar reads indices 0-2 by design (years, repos, contributions).
const profileStats: [StatItem, StatItem, StatItem] = [
  {
    label: { pt: "Anos em backend & QA", en: "Years in backend & QA" },
    value: yearsSince(CAREER_START),
  },
  { label: { pt: "Repositórios públicos", en: "Public repositories" }, value: "53" },
  { label: { pt: "Contribuições / ano", en: "GitHub contributions / yr" }, value: "3733" },
];

export const profile = {
  name: "Vinicius de Oliveira Santos",
  shortName: "Vinicius Santos",
  handle: "vinicius-ssantos",
  role: { pt: "Engenheiro de Software Backend", en: "Backend Software Engineer" } as LocalizedText,
  company: "UOL",
  location: { pt: "São Paulo, SP — Brasil", en: "São Paulo, SP — Brazil" } as LocalizedText,
  locationShort: "São Paulo, BR",
  email: "viniciusoli2020@gmail.com",
  phone: "+55 (11) 91676-2083",
  languages: ["PT (nativo)", "EN (intermediário)"],
  // Career start date — used to compute years of experience dynamically.
  // September 2021 = first day at Autbank as QA Analyst.
  careerStart: CAREER_START,
  pitch: {
    pt: "Engenheiro de Software Backend na UOL, trabalhando em fluxos de autenticação, autorização e proteção de conta. Foco em confiabilidade, qualidade de entrega e estabilidade em produção — o tipo de trabalho onde pequenos erros têm consequências grandes.",
    en: "Backend Software Engineer at UOL, working on authentication, authorization and account-protection flows. I focus on reliability, delivery quality and production stability — the kind of work where small mistakes have outsized consequences.",
  } as LocalizedText,
  longPitch: {
    pt: "Engenheiro de Software Backend com experiência em APIs, integrações e serviços críticos de segurança. Atuo com foco em confiabilidade, qualidade de entrega e estabilidade em produção — construindo e evoluindo o tipo de sistema onde pequenos erros têm consequências grandes. Meu dia a dia na UOL envolve endurecer fluxos de autenticação e proteção de conta, padronizar contratos entre serviços e sustentar pipelines de CI/CD em Kubernetes para que releases fiquem entediantes.",
    en: "Backend Software Engineer with experience in APIs, integrations and security-critical services. I work with a focus on reliability, delivery quality and production stability — building and evolving the kind of systems where small mistakes have outsized consequences. My day-to-day at UOL involves hardening authentication and account-protection flows, standardizing contracts between services, and sustaining CI/CD pipelines on Kubernetes so releases stay boring.",
  } as LocalizedText,
  careerPath: {
    pt: "Meu caminho até backend foi incomum: comecei em QA na Autbank em 2021, automatizando testes de API com RestAssured e JMeter. Dois anos depois, mudei para a cadeira de desenvolvedor na mesma empresa, e em 2024 entrei na UOL para trabalhar na camada de autenticação e proteção de conta que milhões de brasileiros usam diariamente. Os anos de QA ainda moldam como escrevo código — penso primeiro em modos de falha, depois em caminhos felizes.",
    en: "My path into backend was unusual: I started in QA at Autbank in 2021, automating API tests with RestAssured and JMeter. Two years later I moved into the developer seat at the same company, and in 2024 I joined UOL to work on the authentication and account-protection layer that millions of Brazilians rely on daily. The QA years still shape how I write code — I think in terms of failure modes first, happy paths second.",
  } as LocalizedText,
  philosophy: {
    pt: "Mantenho um GitHub público com dezenas de repositórios porque acredito em shipping aberto — experimentos pela metade incluídos. O mais ambicioso é o personal-platform-infra, um repositório de infraestrutura estilo GitOps que roda minha plataforma pessoal de MCP servers e BFFs em ambientes local + VPS. Se você quer saber como eu penso, o histórico de commits é um currículo mais honesto do que qualquer PDF.",
    en: "I keep a public GitHub with dozens of repositories because I believe in shipping in the open — half-finished experiments included. The most ambitious one is personal-platform-infra, a GitOps-style infrastructure repo that runs my personal platform of MCP servers and BFFs across local + VPS environments. If you want to know how I think, the commit history is a more honest résumé than any PDF.",
  } as LocalizedText,
  currentlyLearning: [
    {
      topic: { pt: "MCP Servers", en: "MCP Servers" },
      detail: {
        pt: "Construindo e operando MCP servers no cluster k3s pessoal",
        en: "Building and operating MCP servers on my personal k3s cluster",
      },
    },
    {
      topic: { pt: "Spring Cloud", en: "Spring Cloud" },
      detail: {
        pt: "Estudando padrões de microserviços: service discovery, gateway, circuit breakers",
        en: "Studying microservices patterns: service discovery, gateway, circuit breakers",
      },
    },
    {
      topic: { pt: "GitOps + KEDA", en: "GitOps + KEDA" },
      detail: {
        pt: "Autoscaling orientado a eventos no Kubernetes com KEDA",
        en: "Event-driven autoscaling on Kubernetes with KEDA",
      },
    },
  ] as { topic: LocalizedText; detail: LocalizedText }[],
  stats: profileStats,
  links: {
    github: "https://github.com/vinicius-ssantos",
    linkedin: "https://www.linkedin.com/in/vinicius-oliveira-7ba1bb204/",
    cv: "/cv-vinicius-santos.pdf",
  },
};
