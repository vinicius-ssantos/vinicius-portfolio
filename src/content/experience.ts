import type { Experience } from "./types";

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
        pt: "Desenho e implemento endpoints REST em Java/Spring para os fluxos de autenticação e proteção de conta, usando Redis para cache/sessão e SQL para persistência.",
        en: "Design and implement REST endpoints in Java/Spring for authentication and account-protection flows, using Redis for cache/session and SQL for persistence.",
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
        pt: "Implementei e mantive telas em JSF/MVC, com foco em usabilidade e consistência entre módulos do sistema.",
        en: "Implemented and maintained JSF/MVC screens, focusing on usability and consistency across system modules.",
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
