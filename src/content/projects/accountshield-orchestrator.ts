import type { Lang } from "@/lib/i18n";
import type { ProjectMeta, ProjectText } from "../types";

export const accountShieldOrchestratorMeta: ProjectMeta = {
  slug: "accountshield-orchestrator",
  name: "AccountShield Orchestrator",
  stack: [
    "Java 25",
    "Spring Boot 4.1",
    "Spring Modulith 2.1",
    "PostgreSQL 17",
    "Flyway",
    "Testcontainers",
    "Micrometer",
    "Prometheus",
    "Grafana",
    "OpenAPI",
    "Docker Compose",
    "GitHub Actions",
  ],
  repoUrl: "https://github.com/vinicius-ssantos/accountshield-orchestrator",
  image: "/projects/accountshield-orchestrator.svg",
  updatedAt: "2026-07-23",
  status: "development",
  visible: true,
  links: {
    docs: "https://github.com/vinicius-ssantos/accountshield-orchestrator/tree/main/docs",
  },
};

const pt: ProjectText = {
  tagline:
    "Decisões explicáveis de proteção de contas com políticas versionadas, step-up simulado e recuperação auditável",
  description:
    "Plataforma backend educacional que recebe eventos sensíveis de conta, normaliza sinais de risco e decide se a operação deve ser permitida, desafiada, bloqueada temporariamente ou encaminhada para recuperação. O projeto concentra-se em orquestração, explicabilidade, idempotência, máquinas de estado, replay e evidência operacional — não em substituir um provedor de identidade nem proteger contas reais.",
  problem:
    "Autenticação não termina quando uma senha está correta. Login em dispositivo novo, troca de credencial, recuperação e ações privilegiadas exigem decisões consistentes, justificáveis e reproduzíveis mesmo diante de retries, políticas em evolução e falhas parciais. O AccountShield explora como coordenar essas decisões sem armazenar senhas, emitir tokens de produção ou alegar uma precisão antifraude inexistente.",
  approach: [
    "Um monólito modular separa protection, risk, policy, challenge, recovery, audit, outbox e simulation; Spring Modulith e testes de arquitetura verificam os limites entre módulos.",
    "Sinais normalizados alimentam um score determinístico e contribuições ordenadas, produzindo ALLOW, REQUIRE_STEP_UP, TEMPORARILY_BLOCK ou START_RECOVERY com razões explícitas.",
    "Políticas são versionadas e imutáveis depois de ativadas; cada decisão registra a versão usada, e shadow evaluation compara uma candidata sem efeitos operacionais.",
    "A idempotência persistente reutiliza a decisão em retries sequenciais equivalentes e rejeita colisões de fingerprint; a prova concorrente completa permanece uma área parcial documentada.",
    "Challenges possuem propósito, expiração, orçamento de tentativas e consumo único, usando modos TOTP, e-mail e WebAuthn simulados para demonstração local.",
    "START_RECOVERY emite uma autorização imutável, expira em 15 minutos e pode ser consumida uma vez para iniciar uma máquina de estados com gates de risco, atraso ou revisão manual.",
    "Decisões e evidências são append-only no PostgreSQL, enquanto eventos são gravados em transactional outbox e publicados por um relay simulado separado.",
  ],
  role: "Projeto pessoal educacional — autor único",
  highlights: [
    "Quatro resultados de proteção distintos preservam a diferença entre permitir, exigir step-up, bloquear temporariamente e iniciar recuperação",
    "Política, algoritmo, razões, score, timestamps e correlação permanecem associados ao trace histórico para consulta e replay",
    "Dez ADRs registram decisões sobre monólito modular, PostgreSQL, idempotência, challenges, recuperação, replay, políticas, rate limiting, outbox e trust boundaries",
    "O catálogo público separa capacidades implementadas, parciais, planejadas e adiadas para impedir que backlog seja apresentado como feature pronta",
    "O main possui checks automatizados verdes e um ambiente Docker Compose reproduzível com API, PostgreSQL, Prometheus, Grafana e Swagger UI",
  ],
  architectureNotes: [
    "PostgreSQL é a fonte de verdade para decisões, políticas, idempotência, challenges, recuperação, autorizações, auditoria e outbox.",
    "O rate limiting atual é em memória e adequado somente ao demo de instância única; roteamento por cliente e distribuição continuam planejados.",
    "Audit trail serve como evidência histórica, mas não como autoridade para iniciar recuperação; essa permissão pertence à RecoveryAuthorization.",
    "Providers externos são portas substituíveis, porém as implementações atuais são simuladas e não carregam garantias de segurança de produção.",
    "O relay do outbox é funcional como baseline, mas claiming multi-instância, backoff com jitter e dead letters ainda não foram entregues.",
  ],
  metrics: [
    { label: "ADRs publicados", value: "10" },
    { label: "Resultados de proteção", value: "4" },
    { label: "Providers reais", value: "0" },
  ],
  testingStrategy:
    "O fluxo canônico ./mvnw verify cobre regras de domínio, limites do Spring Modulith, migrações Flyway, contexto Spring e integrações com PostgreSQL real via Testcontainers. O catálogo de features registra 181 testes no baseline auditado, e a CI também constrói a imagem Docker e publica relatórios de diagnóstico quando uma verificação falha.",
  observability:
    "Decisões, challenges, recuperação, políticas e outbox possuem logs estruturados e métricas Micrometer expostas para Prometheus; o Compose provisiona um dashboard Grafana. Correlation IDs acompanham a evidência operacional. Tracing distribuído com OpenTelemetry ainda está planejado e não é apresentado como capacidade concluída.",
  limitations: [
    "Projeto educacional: não deve ser usado como mecanismo principal de proteção para contas reais, autenticação, transações financeiras ou workloads regulados.",
    "A API ainda não possui autenticação e RBAC para endpoints sensíveis; autorização administrativa com step-up também permanece planejada.",
    "TOTP, e-mail e WebAuthn são simulados localmente, sem segredos, entrega ou garantias de providers de produção.",
    "Idempotência e recuperação têm proteção persistente, mas provas concorrentes multi-thread e optimistic locking ainda estão parciais ou planejadas.",
    "Não há tracing distribuído, benchmark de capacidade publicado, backup/restore drill nem release 1.0 reproduzível.",
    "Não existe implantação pública ou console operacional no main; a fundação frontend está fora do escopo desta publicação até ser mergeada.",
  ],
  nextSteps: [
    "Adicionar autenticação, RBAC e step-up fresco para operações privilegiadas antes de qualquer exposição além do laboratório local.",
    "Fechar as provas de concorrência para idempotência, challenge e recuperação com PostgreSQL e Testcontainers.",
    "Evoluir o outbox com claiming atômico, backoff, dead letters e contratos externos minimizados e versionados.",
    "Implementar tracing distribuído e consolidar SLOs, benchmark, backup/restore e cenários de falha reproduzíveis.",
    "Publicar o console operacional somente depois que a base frontend e o BFF estiverem incorporados ao main e protegidos pelo mesmo threat model.",
  ],
};

const en: ProjectText = {
  tagline:
    "Explainable account-protection decisions with versioned policies, simulated step-up and auditable recovery",
  description:
    "An educational backend platform that receives security-sensitive account events, normalizes risk signals and decides whether an operation should be allowed, challenged, temporarily blocked or routed into recovery. The project focuses on orchestration, explainability, idempotency, state machines, replay and operational evidence — not on replacing an identity provider or protecting real accounts.",
  problem:
    "Authentication does not end when a password is correct. A login from a new device, credential change, recovery attempt or privileged action needs a consistent, explainable and reproducible decision despite retries, evolving policies and partial failures. AccountShield explores how to coordinate those decisions without storing passwords, issuing production tokens or claiming unproven fraud-detection accuracy.",
  approach: [
    "A modular monolith separates protection, risk, policy, challenge, recovery, audit, outbox and simulation; Spring Modulith and architecture tests verify the boundaries between modules.",
    "Normalized signals feed deterministic scoring and ordered contributions, producing ALLOW, REQUIRE_STEP_UP, TEMPORARILY_BLOCK or START_RECOVERY with explicit reasons.",
    "Policies are versioned and immutable after activation; each decision records the version used, and shadow evaluation compares a candidate without operational side effects.",
    "Persistent idempotency reuses the decision for equivalent sequential retries and rejects fingerprint collisions; complete concurrent proof remains a documented partial area.",
    "Challenges carry a purpose, expiry, attempt budget and single-use consumption while simulated TOTP, e-mail and WebAuthn modes support the local demonstration.",
    "START_RECOVERY emits an immutable authorization that expires after 15 minutes and can be consumed once to start a risk-gated state machine with delay or manual review.",
    "Decisions and evidence are append-only in PostgreSQL, while events are stored in a transactional outbox and published by a separate simulated relay.",
  ],
  role: "Educational personal project — sole author",
  highlights: [
    "Four distinct protection outcomes preserve the difference between allowing, requiring step-up, temporarily blocking and starting recovery",
    "Policy, algorithm, reasons, score, timestamps and correlation remain attached to the historical trace for queries and replay",
    "Ten ADRs record decisions about the modular monolith, PostgreSQL, idempotency, challenges, recovery, replay, policies, rate limiting, outbox and trust boundaries",
    "The public feature catalog separates implemented, partial, planned and deferred capabilities so backlog is not presented as delivered functionality",
    "The main branch has green automated checks and a reproducible Docker Compose environment with the API, PostgreSQL, Prometheus, Grafana and Swagger UI",
  ],
  architectureNotes: [
    "PostgreSQL is the source of truth for decisions, policies, idempotency, challenges, recovery, authorizations, audit and outbox records.",
    "The current rate limiter is in-memory and suitable only for the single-instance demo; client routing and distribution remain planned.",
    "The audit trail is historical evidence rather than recovery authority; permission to start recovery belongs to RecoveryAuthorization.",
    "External providers are replaceable ports, but current implementations are simulated and carry no production security guarantees.",
    "The outbox relay is a functional baseline, while multi-instance claiming, jittered backoff and dead letters have not been delivered yet.",
  ],
  metrics: [
    { label: "Published ADRs", value: "10" },
    { label: "Protection outcomes", value: "4" },
    { label: "Real providers", value: "0" },
  ],
  testingStrategy:
    "The canonical ./mvnw verify flow covers domain rules, Spring Modulith boundaries, Flyway migrations, the Spring context and integrations with real PostgreSQL through Testcontainers. The feature catalog records 181 tests in the audited baseline, and CI also builds the Docker image and publishes diagnostic reports when verification fails.",
  observability:
    "Decisions, challenges, recovery, policies and outbox activity have structured logs and Micrometer metrics exposed to Prometheus; Docker Compose provisions a Grafana dashboard. Correlation IDs accompany operational evidence. Distributed OpenTelemetry tracing remains planned and is not presented as a delivered capability.",
  limitations: [
    "Educational project: it must not be used as the primary protection mechanism for real accounts, authentication, financial transactions or regulated workloads.",
    "The API does not yet have authentication and RBAC for sensitive endpoints; administrative fresh step-up authorization also remains planned.",
    "TOTP, e-mail and WebAuthn are simulated locally without production provider secrets, delivery or guarantees.",
    "Idempotency and recovery have persistent protections, but multi-thread concurrency proofs and optimistic locking remain partial or planned.",
    "There is no distributed tracing, published capacity benchmark, backup/restore drill or reproducible 1.0 release.",
    "There is no public deployment or operator console on main; the frontend foundation remains outside this publication until it is merged.",
  ],
  nextSteps: [
    "Add authentication, RBAC and fresh step-up for privileged operations before exposing the system beyond the local laboratory.",
    "Complete PostgreSQL and Testcontainers concurrency proofs for idempotency, challenge and recovery flows.",
    "Evolve the outbox with atomic claiming, backoff, dead letters and minimized, versioned external contracts.",
    "Implement distributed tracing and consolidate SLOs, benchmarks, backup/restore and reproducible failure scenarios.",
    "Publish the operator console only after the frontend foundation and BFF are merged into main and protected by the same threat model.",
  ],
};

const text: Record<Lang, ProjectText> = { pt, en };

export function getAccountShieldOrchestrator(lang: Lang) {
  return { ...accountShieldOrchestratorMeta, ...text[lang]! };
}
