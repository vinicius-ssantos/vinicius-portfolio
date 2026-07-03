/**
 * Centralized data for the portfolio.
 * All text content has { pt, en } pairs for bilingual support.
 * Pulled from the user's actual CV + real GitHub repos (vinicius-ssantos).
 */

import type { Lang } from "./translations";

export type { Lang };
export type LocalizedText = { pt: string; en: string };

export type Project = {
  slug: string;
  name: string;
  tagline: LocalizedText;
  description: LocalizedText;
  problem: LocalizedText;
  approach: LocalizedText[];
  stack: string[];
  role: LocalizedText;
  highlights: LocalizedText[];
  repoUrl: string;
  liveUrl?: string;
  image?: string;
  updatedAt: string;
  featured?: boolean;
};

export type Experience = {
  period: string;
  company: string;
  role: LocalizedText;
  summary: LocalizedText;
  bullets: LocalizedText[];
  stack: string[];
  current?: boolean;
};

export type Education = {
  period: LocalizedText;
  institution: string;
  degree: LocalizedText;
};

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
  languages: ["PT (nativo)", "EN (profissional)"],
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
    pt: "Mantenho um GitHub público com 52 repositórios porque acredito em shipping aberto — experimentos pela metade incluídos. O mais ambicioso é o personal-platform-infra, um repositório de infraestrutura estilo GitOps que roda minha plataforma pessoal de MCP servers e BFFs em ambientes local + VPS. Se você quer saber como eu penso, o histórico de commits é um currículo mais honesto do que qualquer PDF.",
    en: "I keep a public GitHub with 52 repositories because I believe in shipping in the open — half-finished experiments included. The most ambitious one is personal-platform-infra, a GitOps-style infrastructure repo that runs my personal platform of MCP servers and BFFs across local + VPS environments. If you want to know how I think, the commit history is a more honest résumé than any PDF.",
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
  stats: [
    { label: { pt: "Anos em backend & QA", en: "Years in backend & QA" }, value: "5" },
    { label: { pt: "Repositórios públicos", en: "Public repositories" }, value: "53" },
    { label: { pt: "Contribuições / ano", en: "GitHub contributions / yr" }, value: "3733" },
  ],
  links: {
    github: "https://github.com/vinicius-ssantos",
    linkedin: "https://www.linkedin.com/in/vinicius-oliveira-7ba1bb204/",
    cv: "/cv-vinicius-santos.pdf",
  },
};

// Stack categories stay the same in both languages (tech terms are universal)
export const stack = {
  Backend: ["Java", "Kotlin", "Node.js", "Spring", "REST APIs", "Microservices"],
  Quality: ["JUnit", "Mockito", "TDD", "SOLID", "Design Patterns"],
  Data: ["SQL Server", "MySQL", "PostgreSQL", "SQLite", "MongoDB", "Firebase / Firestore", "Redis"],
  DevOps: ["Git", "SVN", "CI/CD", "Jenkins", "Kubernetes", "Docker", "AWS (EC2, S3)"],
  Infrastructure: ["Traefik", "Cloudflare", "Ansible", "Just", "GHCR", "SOPS + age"],
  Methods: ["Scrum", "Kanban"],
  Languages: [
    { pt: "Português (nativo)", en: "Portuguese (native)" },
    { pt: "Inglês (profissional)", en: "English (professional working)" },
  ],
};

export const experience: Experience[] = [
  {
    period: "08/2024 — Presente",
    company: "UOL",
    role: {
      pt: "Engenheiro de Software (Backend)",
      en: "Software Engineer (Backend)",
    },
    summary: {
      pt: "Desenvolvimento e evolução de APIs e integrações para fluxos críticos de autenticação, autorização e proteção de conta.",
      en: "Developing and evolving APIs and integrations for critical authentication, authorization and account-protection flows.",
    },
    bullets: [
      {
        pt: "Evoluo APIs e integrações que sustentam fluxos críticos de autenticação, autorização e proteção de conta.",
        en: "Evolve APIs and integrations powering critical authentication, authorization and account-protection flows.",
      },
      {
        pt: "Padronizo contratos entre serviços e refino regras de negócio para reduzir falhas de integração entre times.",
        en: "Standardize service contracts and refine business rules to reduce integration failures across teams.",
      },
      {
        pt: "Fortaleço a qualidade com testes unitários e de integração, reduzindo regressão em mudanças críticas.",
        en: "Strengthen quality with unit and integration tests, lowering regression on critical changes.",
      },
      {
        pt: "Sustento pipelines de CI/CD e operações em Kubernetes para manter releases estáveis em QA e produção.",
        en: "Sustain CI/CD pipelines and Kubernetes operations to keep releases stable across QA and production.",
      },
    ],
    stack: ["Java", "Spring", "REST APIs", "SQL", "Redis", "JUnit", "Jenkins", "CI/CD", "Kubernetes", "Git"],
    current: true,
  },
  {
    period: "01/2023 — 01/2024",
    company: "Autbank — Projetos e Consultoria",
    role: {
      pt: "Analista Desenvolvedor de Sistemas",
      en: "Systems Developer Analyst",
    },
    summary: {
      pt: "Evolução de funcionalidades de frontend e backend com foco em integridade funcional e eficiência operacional.",
      en: "Evolved frontend and backend features with a focus on functional integrity and operational efficiency.",
    },
    bullets: [
      {
        pt: "Evoluí funcionalidades de frontend e backend com foco em integridade funcional e eficiência operacional.",
        en: "Evolved frontend and backend features with focus on functional integrity and operational efficiency.",
      },
      {
        pt: "Implementei melhorias de backend em Java e ajustes em integrações de dados entre sistemas legados.",
        en: "Implemented backend improvements in Java and adjusted data integrations across legacy systems.",
      },
      {
        pt: "Trabalhei próximo ao QA para traduzir achados de teste em correções duráveis.",
        en: "Worked closely with QA to translate test findings into durable fixes.",
      },
    ],
    stack: ["Java", "JSF", "Tomcat", "MVC", "Maven", "HTML", "CSS", "SQL Server"],
  },
  {
    period: "09/2021 — 01/2023",
    company: "Autbank — Projetos e Consultoria",
    role: {
      pt: "Analista de Testes",
      en: "QA Analyst",
    },
    summary: {
      pt: "Planejamento e execução de testes funcionais, regressivos e de performance, com automação de testes de API.",
      en: "Planned and executed functional, regression and performance tests, with API test automation.",
    },
    bullets: [
      {
        pt: "Planejei e executei testes funcionais, regressivos e de performance em toda a suíte de produtos.",
        en: "Planned and executed functional, regression and performance tests across the product suite.",
      },
      {
        pt: "Automatizei validações de API e integração para ampliar cobertura e aumentar previsibilidade de release.",
        en: "Automated API and integration validations to widen coverage and increase release predictability.",
      },
      {
        pt: "Construí a base de QA que depois tornou minha transição para backend mais suave.",
        en: "Built the QA foundation that later made my transition into backend development smoother.",
      },
    ],
    stack: ["JMeter", "SoapUI", "Postman", "RestAssured", "Java", "JavaScript"],
  },
];

export const education: Education[] = [
  {
    period: { pt: "Pós-graduação", en: "Postgraduate" },
    institution: "Faculdade Impacta",
    degree: {
      pt: "Pós-graduação em Full Stack Developer",
      en: "Full Stack Developer — Postgraduate",
    },
  },
  {
    period: { pt: "2022", en: "2022" },
    institution: "FATEC Ferraz de Vasconcelos",
    degree: {
      pt: "Análise e Desenvolvimento de Sistemas",
      en: "Systems Analysis and Development",
    },
  },
];

export const projects: Project[] = [
  {
    slug: "personal-platform-infra",
    name: "personal-platform-infra",
    tagline: {
      pt: "Infra estilo GitOps para uma plataforma pessoal de MCP servers e BFFs",
      en: "GitOps-style infra for a personal platform of MCP servers and BFFs",
    },
    description: {
      pt: "Repositório centralizado de infraestrutura gerenciando dois ambientes — local (Windows 11 + WSL2) e VPS (Ubuntu + k3s) — a partir de uma única fonte da verdade. Sem código de aplicação, sem Dockerfiles: repositórios upstream publicam imagens no GHCR, este repo consome.",
      en: "Centralized infrastructure repository managing two environments — local (Windows 11 + WSL2) and VPS (Ubuntu + k3s) — from a single source of truth. No application code, no Dockerfiles: upstream repos publish images to GHCR, this repo consumes them.",
    },
    problem: {
      pt: "Rodar múltiplos serviços side-project em duas máquinas (dev local + VPS) sem virar um SRE meio período. O desafio: manter ambientes reprodutíveis, secrets seguras e ainda conseguir rebuildar qualquer host do zero em uma tarde.",
      en: "Running multiple side-project services across two machines (local dev + VPS) without turning into a part-time SRE. The challenge: keep environments reproducible, secrets safe, and still be able to rebuild either host from zero in an afternoon.",
    },
    approach: [
      {
        pt: "Dois alvos de deploy — Docker Compose para iteração local rápida, k3s single-node na VPS — driven do mesmo Justfile.",
        en: "Two deployment targets — Docker Compose for fast local iteration, k3s single-node on the VPS — driven from the same Justfile.",
      },
      {
        pt: "Três namespaces por cluster (mcp / bff / vos / monitoring) mantêm blast radius pequeno e regras de routing legíveis.",
        en: "Three namespaces per cluster (mcp / bff / vos / monitoring) keep blast radius small and let routing rules stay readable.",
      },
      {
        pt: "Traefik cuida do ingress na VPS; Cloudflare provê DNS, TLS, Access e Tunnel na frente.",
        en: "Traefik handles ingress on the VPS; Cloudflare provides DNS, TLS, Access and Tunnel in front of it.",
      },
      {
        pt: "Secrets selados com SOPS + age — nunca plaintext no Git, nunca montados como env vars cruas.",
        en: "Secrets are sealed with SOPS + age — never plaintext in Git, never mounted as raw env vars.",
      },
      {
        pt: "Todo deployment nasce com replicas: 0 e sobe sob demanda via comandos just wake-*, mantendo a VPS silenciosa por padrão.",
        en: "Every deployment starts with replicas: 0 and scales up on demand via just wake-* commands, keeping the VPS quiet by default.",
      },
      {
        pt: "20 Architecture Decision Records (ADRs) vivem no repo — toda escolha não-trivial tem contexto, decisão e consequências documentadas.",
        en: "20 Architecture Decision Records (ADRs) live in the repo — every non-trivial choice has a documented context, decision and consequences.",
      },
    ],
    stack: [
      "Kubernetes (k3s)",
      "Docker",
      "Traefik",
      "Cloudflare",
      "Ansible",
      "Just",
      "SOPS + age",
      "Loki",
      "KEDA",
      "GHCR",
    ],
    role: {
      pt: "Projeto pessoal — autor e operador único",
      en: "Personal project — sole author and operator",
    },
    highlights: [
      {
        pt: "Rebuilds do zero em VPS ou workstation nova em menos de uma tarde",
        en: "Rebuilds from zero on a fresh VPS or workstation in under an afternoon",
      },
      {
        pt: "20 ADRs documentando trade-offs (image pinning, retenção de storage, rotação de secrets)",
        en: "20 ADRs documenting trade-offs (image pinning, storage retention, secret rotation)",
      },
      {
        pt: "Runbooks por serviço com health endpoints, contratos de porta e procedimentos break-glass",
        en: "Per-service runbooks with health endpoints, port contracts and break-glass procedures",
      },
      {
        pt: "Smoke tests validam toda a stack em menos de 60 segundos",
        en: "Smoke tests validate the whole stack in under 60 seconds",
      },
    ],
    repoUrl: "https://github.com/vinicius-ssantos/personal-platform-infra",
    image: "/projects/personal-platform-infra.png",
    updatedAt: "2026-07-02",
    featured: true,
  },
  {
    slug: "springcloud",
    name: "SpringCloud",
    tagline: {
      pt: "Ecossistema de microserviços para avaliação de cartão de crédito em Java + Spring Cloud",
      en: "Microservices ecosystem for credit card evaluation in Java + Spring Cloud",
    },
    description: {
      pt: "Implementação nível estudo de uma arquitetura de microserviços simulando um ecossistema de avaliação de cartão de crédito. Serviços independentes para clientes, cartões e avaliação de crédito, unidos com Eureka, API Gateway, RabbitMQ e Keycloak.",
      en: "Study-grade implementation of a microservices architecture simulating a credit card evaluation ecosystem. Independent services for customers, cards and credit evaluation, glued together with Eureka, an API Gateway, RabbitMQ and Keycloak.",
    },
    problem: {
      pt: "Construir um setup realista de microserviços que exercite os padrões que você realmente vê em produção: service discovery, gateway routing, comunicação sync + async, recursos protegidos por OAuth2, observabilidade — sem pular as partes difíceis.",
      en: "Build a realistic microservices setup that exercises the patterns you actually see in production: service discovery, gateway routing, sync + async communication, OAuth2-protected resources, observability — without skipping the hard parts.",
    },
    approach: [
      {
        pt: "Eureka Server registra cada microserviço; gateway usa discovery para rotear por nome de serviço.",
        en: "Eureka Server registers every microservice; gateway uses discovery to route by service name.",
      },
      {
        pt: "Spring Cloud Gateway expõe um único ponto de entrada em :8080 com discovery-locator habilitado.",
        en: "Spring Cloud Gateway exposes a single entry point on :8080 with discovery-locator enabled.",
      },
      {
        pt: "RabbitMQ carrega o fluxo assíncrono de emissão de cartões — sync HTTP para leituras, async para escritas.",
        en: "RabbitMQ carries the asynchronous card-issuance flow (queue: emissao-cartoes) — sync HTTP for reads, async for writes.",
      },
      {
        pt: "Keycloak em :8081 emite JWTs; o gateway atua como OAuth2 resource server e encaminha tokens downstream.",
        en: "Keycloak on :8081 issues JWTs; the gateway acts as OAuth2 resource server and forwards tokens downstream.",
      },
      {
        pt: "Persistência H2 in-memory por serviço mantém o demo self-contained; OpenAPI + Actuator de graça.",
        en: "H2 in-memory persistence per service keeps the demo self-contained; OpenAPI + Actuator endpoints for free.",
      },
    ],
    stack: [
      "Java 11",
      "Spring Boot 2.6.5",
      "Spring Cloud 2021.0.1",
      "Spring Cloud Netflix Eureka",
      "Spring Cloud Gateway",
      "Spring Security OAuth2",
      "RabbitMQ",
      "Keycloak",
      "H2",
      "Maven",
      "Lombok",
    ],
    role: {
      pt: "Projeto pessoal — autor único",
      en: "Personal project — sole author",
    },
    highlights: [
      {
        pt: "4 serviços independentes + 1 gateway + 1 discovery server",
        en: "4 independent services + 1 gateway + 1 discovery server",
      },
      {
        pt: "Fluxo completo OAuth2/JWT com Keycloak como IdP",
        en: "Full OAuth2/JWT flow with Keycloak as IdP",
      },
      {
        pt: "Padrões de comunicação tanto sync (REST) quanto async (RabbitMQ)",
        en: "Both sync (REST) and async (RabbitMQ) communication patterns",
      },
      {
        pt: "Endpoints documentados para clientes, cartões e avaliação de crédito",
        en: "Documented endpoints for customers, cards and credit evaluation",
      },
    ],
    repoUrl: "https://github.com/vinicius-ssantos/SpringCloud",
    image: "/projects/springcloud.png",
    updatedAt: "2026-04-27",
    featured: true,
  },
  {
    slug: "api-rest-aplicativo-cars",
    name: "api_rest_aplicativo_cars",
    tagline: {
      pt: "API RESTful em Kotlin + Spring Boot para um serviço de transporte",
      en: "RESTful API in Kotlin + Spring Boot for a transportation service",
    },
    description: {
      pt: "API RESTful para gerenciar pedidos de viagem de um app de transporte. Motoristas, passageiros e pedidos de viagem modelados como entidades de domínio com separação adequada de pacotes entre domain, interfaces e camadas de mapping.",
      en: "RESTful API to manage travel requests for a transportation app. Drivers, passengers and travel requests modeled as domain entities with proper package separation between domain, interfaces and mapping layers.",
    },
    problem: {
      pt: "Prover o backend para um app Android nativo em Kotlin que reserva corridas. A API precisava ser direta para o time mobile consumir, com DTOs limpos, mappers e uma camada de domínio que ficasse independente da superfície HTTP.",
      en: "Provide the backend for a native Android Kotlin app that books rides. The API needed to be straightforward for the mobile team to consume, with clean DTOs, mappers and a domain layer that stays independent of the HTTP surface.",
    },
    approach: [
      {
        pt: "Layout de pacotes estilo DDD: domain (entidades + serviços), interfaces (controllers + DTOs), mapping (conversores entity ↔ DTO).",
        en: "DDD-ish package layout: domain (entities + services), interfaces (controllers + DTOs), mapping (entity ↔ DTO converters).",
      },
      {
        pt: "Spring Boot + Spring Data JPA em cima de H2 para runs locais zero-config.",
        en: "Spring Boot + Spring Data JPA on top of H2 for zero-config local runs.",
      },
      {
        pt: "Gradle como build tool — Kotlin DSL mantido conciso.",
        en: "Gradle as the build tool — Kotlin DSL kept concise.",
      },
      {
        pt: "Driver, Passenger e TravelRequest como entidades de domínio first-class; toda interação passa por métodos da service-layer.",
        en: "Driver, Passenger and TravelRequest as first-class domain entities; every interaction goes through service-layer methods.",
      },
      {
        pt: "Testes unitários + de integração incluídos — `gradle test` roda a suite completa.",
        en: "Unit + integration tests included — `gradle test` runs the full suite.",
      },
    ],
    stack: [
      "Kotlin",
      "Spring Boot",
      "Spring Data JPA",
      "Hibernate",
      "H2",
      "Gradle",
    ],
    role: {
      pt: "Projeto pessoal — autor único",
      en: "Personal project — sole author",
    },
    highlights: [
      {
        pt: "Separação limpa de domain / interfaces / mapping",
        en: "Clean separation of domain / interfaces / mapping",
      },
      {
        pt: "Entidades: Driver, Passenger, TravelRequest",
        en: "Entities: Driver, Passenger, TravelRequest",
      },
      {
        pt: "Endpoints documentados para o ciclo de vida do pedido de viagem",
        en: "Documented endpoints for travel request lifecycle",
      },
      {
        pt: "Licenciado sob MIT, pronto para fork",
        en: "MIT-licensed, ready to fork",
      },
    ],
    repoUrl: "https://github.com/vinicius-ssantos/api_rest_aplicativo_cars",
    image: "/projects/api-rest-cars.png",
    updatedAt: "2024-08-10",
    featured: true,
  },
];

// Helper to pick localized text
export function t(text: LocalizedText, lang: Lang): string {
  return text[lang];
}
