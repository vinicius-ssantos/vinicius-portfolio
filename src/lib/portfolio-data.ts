/**
 * Centralized data for the portfolio.
 * Pulled from the user's actual CV (curriculo_vinicius_desenvolvedor_v6_pt.pdf)
 * plus real GitHub repos (vinicius-ssantos).
 */

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  problem: string;
  approach: string[];
  stack: string[];
  role: string;
  highlights: string[];
  repoUrl: string;
  liveUrl?: string;
  updatedAt: string;
  featured?: boolean;
};

export type Experience = {
  period: string;
  company: string;
  role: string;
  summary: string;
  bullets: string[];
  stack: string[];
  current?: boolean;
};

export type Education = {
  period: string;
  institution: string;
  degree: string;
};

export const profile = {
  name: "Vinicius de Oliveira Santos",
  shortName: "Vinicius Santos",
  handle: "vinicius-ssantos",
  role: "Backend Software Engineer",
  company: "UOL",
  location: "São Paulo, SP — Brazil",
  locationShort: "São Paulo, BR",
  email: "viniciusoli2020@gmail.com",
  phone: "+55 (11) 91676-2083",
  languages: ["PT (native)", "EN (intermediate)"],
  // Pitch aligned with CV summary, expanded for portfolio tone
  pitch:
    "Backend Software Engineer at UOL, working on authentication, authorization and account-protection flows. I focus on reliability, delivery quality and production stability — the kind of work where small mistakes have outsized consequences.",
  longPitch:
    "Backend Software Engineer with experience in APIs, integrations and security-critical services. I work with a focus on reliability, delivery quality and production stability — building and evolving the kind of systems where small mistakes have outsized consequences. My day-to-day at UOL involves hardening authentication and account-protection flows, standardizing contracts between services, and sustaining CI/CD pipelines on Kubernetes so releases stay boring.",
  careerPath:
    "My path into backend was unusual: I started in QA at Autbank in 2021, automating API tests with RestAssured and JMeter. Two years later I moved into the developer seat at the same company, and in 2024 I joined UOL to work on the authentication and account-protection layer that millions of Brazilians rely on daily. The QA years still shape how I write code — I think in terms of failure modes first, happy paths second.",
  philosophy:
    "I keep a public GitHub with 52 repositories because I believe in shipping in the open — half-finished experiments included. The most ambitious one is personal-platform-infra, a GitOps-style infrastructure repo that runs my personal platform of MCP servers and BFFs across local + VPS environments. If you want to know how I think, the commit history is a more honest résumé than any PDF.",
  stats: [
    { label: "Years in backend & QA", value: "5+" },
    { label: "Public repositories", value: "52" },
    { label: "GitHub contributions / yr", value: "777" },
  ],
  links: {
    github: "https://github.com/vinicius-ssantos",
    linkedin: "https://www.linkedin.com/in/vinicius-oliveira-7ba1bb204/",
    cv: "/cv-vinicius-santos.pdf",
  },
};

// Stack aligned with CV's "Competências Técnicas" section
export const stack = {
  Backend: ["Java", "Kotlin", "Node.js", "Spring", "REST APIs", "Microservices"],
  Quality: ["JUnit", "Mockito", "TDD", "SOLID", "Design Patterns"],
  Data: ["SQL Server", "MySQL", "PostgreSQL", "SQLite", "MongoDB", "Firebase / Firestore", "Redis"],
  DevOps: ["Git", "SVN", "CI/CD", "Jenkins", "Kubernetes", "Docker", "AWS (EC2, S3)"],
  Infrastructure: ["Traefik", "Cloudflare", "Ansible", "Just", "GHCR", "SOPS + age"],
  Methods: ["Scrum", "Kanban"],
  Languages: ["Portuguese (native)", "English (intermediate)"],
};

export const experience: Experience[] = [
  {
    period: "08/2024 — Present",
    company: "UOL",
    role: "Software Engineer (Backend)",
    summary:
      "Developing and evolving APIs and integrations for critical authentication, authorization and account-protection flows.",
    bullets: [
      "Evolve APIs and integrations powering critical authentication, authorization and account-protection flows.",
      "Standardize service contracts and refine business rules to reduce integration failures across teams.",
      "Strengthen quality with unit and integration tests, lowering regression on critical changes.",
      "Sustain CI/CD pipelines and Kubernetes operations to keep releases stable across QA and production.",
    ],
    stack: ["Java", "Spring", "REST APIs", "SQL", "Redis", "JUnit", "Jenkins", "CI/CD", "Kubernetes", "Git"],
    current: true,
  },
  {
    period: "01/2023 — 01/2024",
    company: "Autbank — Projetos e Consultoria",
    role: "Systems Developer Analyst",
    summary:
      "Evolved frontend and backend features with a focus on functional integrity and operational efficiency.",
    bullets: [
      "Evolved frontend and backend features with focus on functional integrity and operational efficiency.",
      "Implemented backend improvements in Java and adjusted data integrations across legacy systems.",
      "Worked closely with QA to translate test findings into durable fixes.",
    ],
    stack: ["Java", "JSF", "Tomcat", "MVC", "Maven", "HTML", "CSS", "SQL Server"],
  },
  {
    period: "09/2021 — 01/2023",
    company: "Autbank — Projetos e Consultoria",
    role: "QA Analyst",
    summary:
      "Planned and executed functional, regression and performance tests, with API test automation.",
    bullets: [
      "Planned and executed functional, regression and performance tests across the product suite.",
      "Automated API and integration validations to widen coverage and increase release predictability.",
      "Built the QA foundation that later made my transition into backend development smoother.",
    ],
    stack: ["JMeter", "SoapUI", "Postman", "RestAssured", "Java", "JavaScript"],
  },
];

export const education: Education[] = [
  {
    period: "Postgraduate",
    institution: "Faculdade Impacta",
    degree: "Full Stack Developer — Postgraduate",
  },
  {
    period: "2022",
    institution: "FATEC Ferraz de Vasconcelos",
    degree: "Análise e Desenvolvimento de Sistemas",
  },
];

export const projects: Project[] = [
  {
    slug: "personal-platform-infra",
    name: "personal-platform-infra",
    tagline: "GitOps-style infra for a personal platform of MCP servers and BFFs",
    description:
      "Centralized infrastructure repository managing two environments — local (Windows 11 + WSL2) and VPS (Ubuntu + k3s) — from a single source of truth. No application code, no Dockerfiles: upstream repos publish images to GHCR, this repo consumes them.",
    problem:
      "Running multiple side-project services across two machines (local dev + VPS) without turning into a part-time SRE. The challenge: keep environments reproducible, secrets safe, and still be able to rebuild either host from zero in an afternoon.",
    approach: [
      "Two deployment targets — Docker Compose for fast local iteration, k3s single-node on the VPS — driven from the same Justfile.",
      "Three namespaces per cluster (mcp / bff / vos / monitoring) keep blast radius small and let routing rules stay readable.",
      "Traefik handles ingress on the VPS; Cloudflare provides DNS, TLS, Access and Tunnel in front of it.",
      "Secrets are sealed with SOPS + age — never plaintext in Git, never mounted as raw env vars.",
      "Every deployment starts with replicas: 0 and scales up on demand via just wake-* commands, keeping the VPS quiet by default.",
      "20 Architecture Decision Records (ADRs) live in the repo — every non-trivial choice has a documented context, decision and consequences.",
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
    role: "Personal project — sole author and operator",
    highlights: [
      "Rebuilds from zero on a fresh VPS or workstation in under an afternoon",
      "20 ADRs documenting trade-offs (image pinning, storage retention, secret rotation)",
      "Per-service runbooks with health endpoints, port contracts and break-glass procedures",
      "Smoke tests for every service — `just smoke-all-sh` validates the whole stack in <60s",
    ],
    repoUrl: "https://github.com/vinicius-ssantos/personal-platform-infra",
    updatedAt: "2026-07-02",
    featured: true,
  },
  {
    slug: "springcloud",
    name: "SpringCloud",
    tagline: "Microservices ecosystem for credit card evaluation in Java + Spring Cloud",
    description:
      "Study-grade implementation of a microservices architecture simulating a credit card evaluation ecosystem. Independent services for customers, cards and credit evaluation, glued together with Eureka, an API Gateway, RabbitMQ and Keycloak.",
    problem:
      "Build a realistic microservices setup that exercises the patterns you actually see in production: service discovery, gateway routing, sync + async communication, OAuth2-protected resources, observability — without skipping the hard parts.",
    approach: [
      "Eureka Server registers every microservice; gateway uses discovery to route by service name.",
      "Spring Cloud Gateway exposes a single entry point on :8080 with discovery-locator enabled.",
      "RabbitMQ carries the asynchronous card-issuance flow (queue: emissao-cartoes) — sync HTTP for reads, async for writes.",
      "Keycloak on :8081 issues JWTs; the gateway acts as OAuth2 resource server and forwards tokens downstream.",
      "H2 in-memory persistence per service keeps the demo self-contained; OpenAPI + Actuator endpoints for free.",
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
    role: "Personal project — sole author",
    highlights: [
      "4 independent services + 1 gateway + 1 discovery server",
      "Full OAuth2/JWT flow with Keycloak as IdP",
      "Both sync (REST) and async (RabbitMQ) communication patterns",
      "Documented endpoints for customers, cards and credit evaluation",
    ],
    repoUrl: "https://github.com/vinicius-ssantos/SpringCloud",
    updatedAt: "2026-04-27",
    featured: true,
  },
  {
    slug: "api-rest-aplicativo-cars",
    name: "api_rest_aplicativo_cars",
    tagline: "RESTful API in Kotlin + Spring Boot for a transportation service",
    description:
      "RESTful API to manage travel requests for a transportation app. Drivers, passengers and travel requests modeled as domain entities with proper package separation between domain, interfaces and mapping layers.",
    problem:
      "Provide the backend for a native Android Kotlin app that books rides. The API needed to be straightforward for the mobile team to consume, with clean DTOs, mappers and a domain layer that stays independent of the HTTP surface.",
    approach: [
      "DDD-ish package layout: domain (entities + services), interfaces (controllers + DTOs), mapping (entity ↔ DTO converters).",
      "Spring Boot + Spring Data JPA on top of H2 for zero-config local runs.",
      "Gradle as the build tool — Kotlin DSL kept concise.",
      "Driver, Passenger and TravelRequest as first-class domain entities; every interaction goes through service-layer methods.",
      "Unit + integration tests included — `gradle test` runs the full suite.",
    ],
    stack: [
      "Kotlin",
      "Spring Boot",
      "Spring Data JPA",
      "Hibernate",
      "H2",
      "Gradle",
    ],
    role: "Personal project — sole author",
    highlights: [
      "Clean separation of domain / interfaces / mapping",
      "Entities: Driver, Passenger, TravelRequest",
      "Documented endpoints for travel request lifecycle",
      "MIT-licensed, ready to fork",
    ],
    repoUrl: "https://github.com/vinicius-ssantos/api_rest_aplicativo_cars",
    updatedAt: "2024-08-10",
    featured: true,
  },
];
