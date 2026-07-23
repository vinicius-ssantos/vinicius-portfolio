import type { Lang } from "@/lib/i18n";
import type { ProjectMeta, ProjectText } from "../types";

export const sentinelLedgerMeta: ProjectMeta = {
  slug: "sentinel-ledger",
  name: "Sentinel Ledger",
  stack: [
    "Java 25",
    "Spring Boot 4.1",
    "Spring Modulith 2.1",
    "Spring Security 7.1",
    "PostgreSQL",
    "RabbitMQ",
    "Flyway",
    "Testcontainers",
    "Micrometer",
    "OpenTelemetry",
    "WireMock",
    "k6",
  ],
  repoUrl: "https://github.com/vinicius-ssantos/sentinel-ledger",
  image: "/projects/sentinel-ledger.svg",
  updatedAt: "2026-07-23",
  status: "development",
  visible: true,
  links: {
    docs: "https://github.com/vinicius-ssantos/sentinel-ledger/tree/main/docs",
  },
};

const pt: ProjectText = {
  tagline:
    "Orquestração de pagamentos simulados com ledger imutável, idempotência persistente e reconciliação auditável",
  description:
    "Sistema educacional de portfólio que modela criação, autorização, captura e estorno de pagamentos contra um PSP determinístico simulado. A arquitetura começa como monólito modular e concentra a complexidade onde ela realmente importa: verdade financeira, concorrência, recuperação de incerteza, publicação confiável de eventos e evidência operacional reproduzível.",
  problem:
    "Uma API de pagamentos parece simples quando cada chamada acontece uma vez e sempre retorna uma resposta. O problema real aparece com retries, operações concorrentes, timeouts depois que o provedor aceitou a requisição, mensagens duplicadas e divergência entre o estado interno e o PSP. O projeto explora como preservar uma verdade financeira explicável nesses cenários sem fingir semântica exatamente uma vez no transporte.",
  approach: [
    "Spring Modulith mantém payments, ledger, idempotency, reconciliation, audit, outbox, messaging e webhooks como módulos explícitos, com dependências e pacotes internos verificados no build.",
    "A autorização persiste um estado pendente antes de chamar o PSP simulado fora da transação PostgreSQL; timeout vira estado incerto explícito, nunca sucesso ou falha presumidos.",
    "Idempotência persistente combina chave, fingerprint do payload e resposta armazenada para reproduzir o mesmo resultado e rejeitar reutilização da chave com conteúdo diferente.",
    "O ledger de partidas dobradas é append-only, exige débitos e créditos balanceados e usa triggers PostgreSQL para impedir alterações; correções geram transações compensatórias.",
    "Reconciliação compara evidências locais e do provedor, deduplica casos duráveis por fingerprint e exige um operador autenticado para registrar uma resolução auditada.",
    "Captura e estorno gravam estado, lançamento contábil, auditoria e intenção de publicação de forma atômica; o outbox é despachado depois por um ciclo separado.",
    "RabbitMQ oferece retries limitados e DLQ, enquanto webhooks HMAC-SHA256 incluem timestamp, identidade de entrega e proteção contra replay.",
  ],
  role: "Projeto pessoal educacional — autor único",
  highlights: [
    "24 invariantes de domínio, contabilidade, recuperação, mensageria, segurança e observabilidade documentadas com pontos de enforcement e evidência esperada",
    "Capturas e estornos parciais preservam limites monetários e lançam novas transações balanceadas sem reescrever o histórico",
    "Incerteza do PSP permanece rastreável até lookup, callback ou reconciliação fornecer evidência suficiente para resolução",
    "Timeline de pagamento correlaciona mudanças de estado, auditoria, resultados do provedor, lançamentos no ledger e entregas de webhook",
    "O main está com os checks automatizados verdes e o fluxo canônico de validação é reproduzível com Maven, Docker e Testcontainers",
  ],
  architectureNotes: [
    "PostgreSQL é a fonte de verdade para pagamentos, idempotência, ledger, auditoria, reconciliação, outbox e histórico de webhooks.",
    "Nenhuma transação de banco permanece aberta durante uma chamada ao PSP simulado.",
    "Mudanças financeiras locais relevantes agrupam estado, ledger e auditoria na mesma transação; publicação assíncrona usa transactional outbox.",
    "A entrega pode ocorrer mais de uma vez, mas idempotência, claim concorrente e deduplicação impedem que o efeito de negócio seja aplicado duas vezes.",
    "RabbitMQ é opcional e fica desligado por padrão na suíte principal para que os testes não dependam de um broker externo.",
  ],
  metrics: [
    { label: "Invariantes explícitas", value: "24" },
    { label: "Moeda do MVP", value: "BRL" },
    { label: "PSPs reais", value: "0" },
  ],
  testingStrategy:
    "O comando canônico ./mvnw verify valida regras monetárias e de estado, propriedades do ledger balanceado, PostgreSQL real via Testcontainers, migrações Flyway, limites do Spring Modulith, contratos HTTP, falhas do PSP simulado, colisão e replay de idempotência, concorrência de captura/estorno, deduplicação de reconciliação e cenários focados com k6. O Docker é requisito para a suíte de integração.",
  observability:
    "Cada requisição recebe ou propaga X-Correlation-Id, os logs de console são JSON estruturado e resultados de autorização, captura, estorno, reconciliação, outbox e webhooks são expostos como métricas Micrometer com cardinalidade controlada em /actuator/prometheus. Dashboards e alertas ficam versionados como código. Tracing distribuído ainda não está implementado.",
  limitations: [
    "Projeto educacional: não processa pagamentos reais e não deve ser usado como infraestrutura financeira.",
    "O MVP trabalha com um merchant, BRL e um único PSP simulado; não inclui antifraude, chargeback, assinaturas, split ou múltiplas moedas/provedores.",
    "Não há implantação pública nem interface operacional pronta; a demonstração atual é executada localmente pela API e pelo runbook.",
    "Tracing distribuído e a operação visual de investigação permanecem planejados.",
    "A resolução de reconciliação protege contra efeito duplicado, mas ainda retorna conflito no retry em vez de reproduzir uma resposta persistida por chave de idempotência.",
  ],
  nextSteps: [
    "Adicionar tracing distribuído e correlacionar spans de API, PostgreSQL, PSP simulado, broker e webhook.",
    "Construir uma Ops UI focada em timeline, casos de reconciliação e evidências, sem transformar o projeto em um checkout comercial.",
    "Consolidar golden demo e relatório de benchmark com ambiente, método, invariantes verificadas e limitações reproduzíveis.",
    "Avaliar implantação pública somente após hardening, evidência operacional e definição explícita do escopo não produtivo.",
  ],
};

const en: ProjectText = {
  tagline:
    "Simulated payment orchestration with an immutable ledger, persistent idempotency and auditable reconciliation",
  description:
    "An educational portfolio system that models payment-intent creation, authorization, capture and refund against a deterministic simulated PSP. The architecture starts as a modular monolith and puts complexity where it matters: financial truth, concurrency, uncertainty recovery, reliable event publication and reproducible operational evidence.",
  problem:
    "A payment API looks simple when every call happens once and always returns a response. The real problem starts with retries, concurrent operations, timeouts after the provider accepted a request, duplicate messages and divergence between internal and PSP state. The project explores how to preserve explainable financial truth in those scenarios without pretending the transport provides exactly-once semantics.",
  approach: [
    "Spring Modulith keeps payments, ledger, idempotency, reconciliation, audit, outbox, messaging and webhooks as explicit modules whose dependencies and internal packages are verified during the build.",
    "Authorization persists a pending state before calling the simulated PSP outside the PostgreSQL transaction; a timeout becomes explicit uncertainty, never guessed success or failure.",
    "Persistent idempotency combines a key, payload fingerprint and stored response to replay the same outcome and reject reuse of the key with different content.",
    "The double-entry ledger is append-only, requires balanced debit and credit totals and uses PostgreSQL triggers to block mutation; corrections create compensating transactions.",
    "Reconciliation compares local and provider evidence, deduplicates durable cases by fingerprint and requires a separately authenticated operator to record an audited resolution.",
    "Capture and refund atomically persist state, ledger posting, audit evidence and publication intent; a separate outbox lifecycle dispatches the event afterwards.",
    "RabbitMQ provides bounded retries and a DLQ, while HMAC-SHA256 webhooks carry a timestamp, delivery identity and replay protection.",
  ],
  role: "Educational personal project — sole author",
  highlights: [
    "24 documented domain, accounting, recovery, messaging, security and observability invariants with enforcement points and expected proof",
    "Full and partial capture/refund preserve monetary limits and append balanced transactions without rewriting history",
    "PSP uncertainty remains traceable until lookup, callback or reconciliation supplies enough evidence for resolution",
    "The payment timeline correlates state changes, audit evidence, provider outcomes, ledger postings and webhook deliveries",
    "The main branch has green automated checks and a reproducible Maven, Docker and Testcontainers validation flow",
  ],
  architectureNotes: [
    "PostgreSQL is the source of truth for payments, idempotency, ledger, audit, reconciliation, outbox and webhook history.",
    "No database transaction remains open while the simulated PSP is called.",
    "Relevant local financial changes group state, ledger and audit in one transaction; asynchronous publication uses a transactional outbox.",
    "Delivery may happen more than once, but idempotency, concurrent claiming and deduplication prevent the business effect from being applied twice.",
    "RabbitMQ is optional and disabled by default in the main suite so tests do not depend on an external broker.",
  ],
  metrics: [
    { label: "Explicit invariants", value: "24" },
    { label: "MVP currency", value: "BRL" },
    { label: "Real PSPs", value: "0" },
  ],
  testingStrategy:
    "The canonical ./mvnw verify command validates monetary and state rules, balanced-ledger properties, real PostgreSQL through Testcontainers, Flyway migrations, Spring Modulith boundaries, HTTP contracts, simulated PSP failures, idempotency collision/replay, concurrent capture/refund, reconciliation deduplication and focused k6 scenarios. Docker is required for the integration suite.",
  observability:
    "Every request receives or propagates X-Correlation-Id, console logs are structured JSON, and authorization, capture, refund, reconciliation, outbox and webhook outcomes are exposed as cardinality-safe Micrometer metrics at /actuator/prometheus. Dashboards and alerts are versioned as code. Distributed tracing is not implemented yet.",
  limitations: [
    "Educational project: it does not process real payments and must not be used as financial infrastructure.",
    "The MVP supports one merchant, BRL and one simulated PSP; it excludes antifraud, chargebacks, subscriptions, split payments and multiple currencies/providers.",
    "There is no public deployment or finished operations interface; the current demonstration runs locally through the API and runbook.",
    "Distributed tracing and the visual investigation workflow remain planned.",
    "Reconciliation resolution prevents duplicate effects, but a retry still returns a conflict instead of replaying an idempotency-key-backed stored response.",
  ],
  nextSteps: [
    "Add distributed tracing and correlate API, PostgreSQL, simulated PSP, broker and webhook spans.",
    "Build an investigation-focused Ops UI for timelines, reconciliation cases and evidence rather than a commercial checkout.",
    "Consolidate a golden demo and benchmark report with reproducible environment, method, invariant checks and limitations.",
    "Consider public deployment only after hardening, operational evidence and an explicit non-production scope.",
  ],
};

const text: Record<Lang, ProjectText> = { pt, en };

export function getSentinelLedger(lang: Lang) {
  return { ...sentinelLedgerMeta, ...text[lang]! };
}
