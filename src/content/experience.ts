import type { Experience } from "./types";

export const experience: Experience[] = [
  {
    startDate: "2024-08-01",
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
        pt: "Desenho e implemento endpoints REST em Java/Spring para os fluxos de autenticação e proteção de conta — a camada que protege o login de milhões de usuários — usando Redis para cache/sessão e SQL para persistência.",
        en: "Design and implement REST endpoints in Java/Spring for authentication and account-protection flows — the layer that guards login for millions of users — using Redis for cache/session and SQL for persistence.",
      },
      {
        pt: "Padronizo contratos entre serviços consumidos por múltiplos times e refino regras de negócio para reduzir falhas de integração antes que cheguem à produção.",
        en: "Standardize service contracts consumed by multiple teams and refine business rules to catch integration failures before they reach production.",
      },
      {
        pt: "Fortaleço a qualidade com testes unitários e de integração nos fluxos de autenticação, reduzindo regressão em mudanças que afetam login e segurança de conta.",
        en: "Strengthen quality with unit and integration tests on the authentication flows, lowering regression on changes that affect login and account security.",
      },
      {
        pt: "Sustento pipelines de CI/CD e operações em Kubernetes para manter releases estáveis em QA e produção, mesmo com mudanças frequentes em serviços críticos.",
        en: "Sustain CI/CD pipelines and Kubernetes operations to keep releases stable across QA and production, even with frequent changes to critical services.",
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
    startDate: "2023-01-01",
    endDate: "2024-01-01",
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
        pt: "Implementei e mantive telas em JSF/MVC, priorizando usabilidade e comportamento consistente entre os módulos usados no dia a dia pelos times internos.",
        en: "Implemented and maintained JSF/MVC screens, prioritizing usability and consistent behavior across the modules internal teams relied on daily.",
      },
      {
        pt: "Implementei melhorias de backend em Java e ajustes em integrações de dados entre sistemas legados, reduzindo inconsistências entre módulos dependentes.",
        en: "Implemented backend improvements in Java and adjusted data integrations across legacy systems, reducing inconsistencies between dependent modules.",
      },
      {
        pt: "Atuei próximo ao QA para traduzir achados de teste em correções duráveis, encurtando o ciclo entre identificar um problema e corrigi-lo na origem.",
        en: "Worked closely with QA to translate test findings into durable fixes, shortening the cycle between spotting an issue and fixing it at the source.",
      },
    ],
    stack: ["Java", "JSF", "Tomcat", "MVC", "Maven", "HTML", "CSS", "SQL Server"],
  },
  {
    startDate: "2021-09-01",
    endDate: "2023-01-01",
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
        pt: "Planejei e executei testes funcionais, regressivos e de performance em toda a suíte de produtos financeiros, onde falhas não detectadas têm custo alto.",
        en: "Planned and executed functional, regression and performance tests across the financial product suite, where undetected failures carry a high cost.",
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
