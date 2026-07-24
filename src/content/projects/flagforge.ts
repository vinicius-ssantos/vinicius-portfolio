import type { Lang } from "@/lib/i18n";
import type { ProjectMeta, ProjectText } from "../types";

export const flagForgeMeta: ProjectMeta = {
  slug: "flagforge",
  name: "FlagForge",
  stack: [
    "Java 25",
    "Spring Boot 4.1",
    "Spring Modulith 2.1",
    "Spring Data JDBC",
    "PostgreSQL 17",
    "Flyway",
    "Testcontainers",
    "ArchUnit",
    "Docker Compose",
    "GitHub Actions",
  ],
  repoUrl: "https://github.com/vinicius-ssantos/flagforge",
  image: "/projects/flagforge.svg",
  updatedAt: "2026-07-16",
  status: "development",
  visible: true,
  links: {
    docs: "https://github.com/vinicius-ssantos/flagforge/tree/main/docs",
  },
};

const pt: ProjectText = {
  tagline:
    "Fundação arquitetural para uma plataforma de feature flags com limites modulares e persistência verificáveis",
  description:
    "Projeto educacional em estágio M0 que estabelece a base executável de uma futura plataforma de progressive delivery. O estado atual inclui uma Control API Spring Boot, build Maven multi-módulo, PostgreSQL/Flyway, verificação de arquitetura e execução local reproduzível. Avaliação de flags, tenants, targeting, rollout, cache, SDK e console permanecem marcos posteriores e não são apresentados como concluídos.",
  problem:
    "Equipes precisam separar deployment de release sem transformar flags em configuração improvisada, regras de autorização ou estado impossível de auditar. O FlagForge foi projetado para explorar avaliação determinística, publicação imutável, isolamento entre organizações e distribuição de configuração, mas começa deliberadamente pela fundação que tornará essas capacidades testáveis antes de implementá-las.",
  approach: [
    "O repositório usa Java 25, Spring Boot 4.1 e Maven multi-módulo; hoje há uma aplicação executável, a Control API, com health e info expostos pelo Actuator.",
    "Spring Modulith e ArchUnit verificam ciclos e acessos indevidos a pacotes internos; uma fixture intencionalmente inválida comprova que essas violações realmente fazem os testes falharem.",
    "PostgreSQL é a fonte de verdade escolhida e o baseline Flyway cria o schema da aplicação; a migração atual ainda não contém tabelas de tenants, projetos, ambientes ou flags.",
    "A documentação separa logicamente Control Plane e Evaluation Plane sem criar microserviços prematuros; ambos devem começar no mesmo runtime e só se separar mediante evidência operacional.",
    "Seis ADRs registram decisões sobre monólito modular, planos lógicos, snapshots imutáveis, multi-tenancy por linha, cache em camadas e Spring Data JDBC.",
    "Snapshots completos, avaliação determinística, OpenFeature, Caffeine, Redis e transactional outbox são direções arquiteturais documentadas, não funcionalidades disponíveis no main atual.",
  ],
  role: "Projeto pessoal educacional — autor único",
  highlights: [
    "Build reproduzível exige JDK 25 e Maven Wrapper 3.9.11 por regras do Maven Enforcer",
    "Testes geram diagramas e canvases do Spring Modulith e protegem os futuros limites dos módulos",
    "Integração com PostgreSQL real via Testcontainers valida o histórico Flyway e impede startup quando o checksum da migração diverge",
    "Roadmap M0–M4 define resultados e critérios de saída para evaluator, publicação segura, distribuição e progressive delivery",
    "O main auditado possui CI verde e instruções documentadas para verificar o build, iniciar PostgreSQL e executar a Control API",
  ],
  architectureNotes: [
    "O estágio atual possui um único runtime Spring Boot e um único PostgreSQL; não há Redis, cache local, Evaluation API ou serviços distribuídos.",
    "A separação entre Control Plane e Evaluation Plane é lógica e serve como contrato de evolução, não como topologia implantada.",
    "O schema inicial contém apenas o namespace flagforge; o modelo de domínio documentado ainda não foi materializado em tabelas ou endpoints.",
    "Multi-tenancy por organization_id, snapshots imutáveis e consistência eventual são decisões aceitas para os próximos marcos, ainda sem fluxo de negócio executável.",
    "A aplicação usa graceful shutdown e restringe o Actuator a health e info, sem expor detalhes sensíveis do ambiente.",
  ],
  metrics: [
    { label: "ADRs publicados", value: "6" },
    { label: "Aplicações executáveis", value: "1" },
    { label: "Evaluators implementados", value: "0" },
  ],
  testingStrategy:
    "O comando canônico sh ./mvnw --batch-mode verify executa testes de contexto Spring, endpoint de health, limites do Spring Modulith, regras ArchUnit e integração com PostgreSQL 17 por Testcontainers. A suíte valida a migração a partir de banco vazio e demonstra que um checksum Flyway adulterado impede a inicialização. Ainda não existem testes de avaliação, rollout, tenant isolation, cache ou concorrência porque esses fluxos não foram implementados.",
  observability:
    "A base atual expõe somente /actuator/health e /actuator/info, incluindo probes, build, Java e sistema operacional sem detalhes de ambiente. Graceful shutdown está configurado. Métricas de avaliação, tracing OpenTelemetry, propagação de versões e monitoramento de cache/outbox permanecem planejados.",
  limitations: [
    "O projeto está em M0/Foundation e ainda não permite criar, publicar ou avaliar uma feature flag.",
    "Não há organizações, usuários, RBAC, API keys, projetos, ambientes, flags, regras, segmentos ou isolamento de tenant executável.",
    "Caffeine, Redis, invalidação, reconciliation, transactional outbox e last-known-good snapshot não estão implementados.",
    "Não existe Java SDK, provider OpenFeature, Evaluation API, web console ou Evaluation Playground.",
    "Não há benchmark de latência, throughput, propagação ou escala; nenhuma promessa de baixa latência ou alta disponibilidade é feita.",
    "O repositório não representa um serviço SaaS pronto nem deve ser usado para controlar releases reais neste estágio.",
  ],
  nextSteps: [
    "Entregar o M1 com organizações, projetos, ambientes, flags booleanas e avaliação determinística coberta por vetores fixos.",
    "Implementar autenticação, RBAC e testes negativos de isolamento antes de expor recursos multi-tenant.",
    "Adicionar publicação de snapshots imutáveis, optimistic concurrency, auditoria e rollback no M2.",
    "Introduzir cache, outbox, invalidação e OpenFeature somente depois que o evaluator PostgreSQL estiver correto e mensurável.",
    "Publicar métricas e benchmarks apenas com ambiente, dataset, comandos, percentis e limitações reproduzíveis.",
  ],
};

const en: ProjectText = {
  tagline:
    "Architecture foundation for a feature-flag platform with verifiable modular boundaries and persistence",
  description:
    "An educational M0-stage project establishing the executable foundation of a future progressive-delivery platform. The current state includes a Spring Boot Control API, multi-module Maven build, PostgreSQL/Flyway, architecture verification and reproducible local execution. Flag evaluation, tenants, targeting, rollout, caching, SDKs and the console remain later milestones and are not presented as delivered.",
  problem:
    "Teams need to separate deployment from release without turning flags into improvised configuration, authorization rules or unauditable state. FlagForge is designed to explore deterministic evaluation, immutable publication, organization isolation and configuration distribution, but deliberately begins with the foundation that will make those capabilities testable before implementing them.",
  approach: [
    "The repository uses Java 25, Spring Boot 4.1 and a multi-module Maven build; today it contains one executable application, the Control API, with Actuator health and info endpoints.",
    "Spring Modulith and ArchUnit verify cycles and illegal access to internal packages; a deliberately invalid fixture proves those violations actually fail the tests.",
    "PostgreSQL is the selected source of truth and the Flyway baseline creates the application schema; the current migration does not contain tenant, project, environment or flag tables yet.",
    "Documentation logically separates the Control Plane and Evaluation Plane without creating premature microservices; both are intended to begin in one runtime and split only with operational evidence.",
    "Six ADRs record decisions about the modular monolith, logical planes, immutable snapshots, row-based multi-tenancy, layered caching and Spring Data JDBC.",
    "Complete snapshots, deterministic evaluation, OpenFeature, Caffeine, Redis and a transactional outbox are documented architecture directions rather than functionality available on current main.",
  ],
  role: "Educational personal project — sole author",
  highlights: [
    "The reproducible build requires JDK 25 and Maven Wrapper 3.9.11 through Maven Enforcer rules",
    "Tests generate Spring Modulith diagrams and canvases while protecting future module boundaries",
    "Real PostgreSQL integration through Testcontainers validates Flyway history and prevents startup when a migration checksum diverges",
    "The M0–M4 roadmap defines outcomes and exit criteria for the evaluator, safe publishing, distribution and progressive delivery",
    "The audited main branch has green CI and documented commands to verify the build, start PostgreSQL and run the Control API",
  ],
  architectureNotes: [
    "The current stage has one Spring Boot runtime and one PostgreSQL database; there is no Redis, local cache, Evaluation API or distributed service.",
    "The Control Plane and Evaluation Plane split is logical and serves as an evolution contract rather than a deployed topology.",
    "The initial schema contains only the flagforge namespace; the documented domain model has not been materialized as tables or endpoints.",
    "Row-based multi-tenancy, immutable snapshots and eventual consistency are accepted decisions for later milestones without an executable business flow yet.",
    "The application uses graceful shutdown and limits Actuator exposure to health and info without exposing sensitive environment details.",
  ],
  metrics: [
    { label: "Published ADRs", value: "6" },
    { label: "Executable applications", value: "1" },
    { label: "Implemented evaluators", value: "0" },
  ],
  testingStrategy:
    "The canonical sh ./mvnw --batch-mode verify command runs Spring context tests, the health endpoint, Spring Modulith boundaries, ArchUnit rules and PostgreSQL 17 integration through Testcontainers. The suite validates migration from an empty database and proves that a tampered Flyway checksum prevents startup. Evaluation, rollout, tenant-isolation, caching and concurrency tests do not exist yet because those flows have not been implemented.",
  observability:
    "The current foundation exposes only /actuator/health and /actuator/info, including probes, build, Java and operating-system information without environment details. Graceful shutdown is configured. Evaluation metrics, OpenTelemetry tracing, version propagation and cache/outbox monitoring remain planned.",
  limitations: [
    "The project is at M0/Foundation and cannot create, publish or evaluate a feature flag yet.",
    "There are no executable organizations, users, RBAC, API keys, projects, environments, flags, rules, segments or tenant isolation.",
    "Caffeine, Redis, invalidation, reconciliation, transactional outbox and last-known-good snapshots are not implemented.",
    "There is no Java SDK, OpenFeature provider, Evaluation API, web console or Evaluation Playground.",
    "There are no latency, throughput, propagation or scale benchmarks; no low-latency or high-availability claim is made.",
    "The repository is not a ready SaaS service and must not control real releases at this stage.",
  ],
  nextSteps: [
    "Deliver M1 with organizations, projects, environments, boolean flags and deterministic evaluation covered by fixed vectors.",
    "Implement authentication, RBAC and negative isolation tests before exposing multi-tenant resources.",
    "Add immutable snapshot publication, optimistic concurrency, audit and rollback in M2.",
    "Introduce caching, outbox, invalidation and OpenFeature only after the PostgreSQL evaluator is correct and measurable.",
    "Publish metrics and benchmarks only with a reproducible environment, dataset, commands, percentiles and limitations.",
  ],
};

const text: Record<Lang, ProjectText> = { pt, en };

export function getFlagForge(lang: Lang) {
  return { ...flagForgeMeta, ...text[lang]! };
}
