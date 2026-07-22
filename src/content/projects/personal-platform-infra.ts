import type { Lang } from "@/lib/i18n";
import type { ProjectMeta, ProjectText } from "../types";

export const personalPlatformInfraMeta: ProjectMeta = {
  slug: "personal-platform-infra",
  name: "personal-platform-infra",
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
  repoUrl: "https://github.com/vinicius-ssantos/personal-platform-infra",
  image: "/projects/personal-platform-infra.png",
  updatedAt: "2026-07-02",
  featured: true,
};

const pt: ProjectText = {
  tagline: "Infra estilo GitOps para uma plataforma pessoal de MCP servers e BFFs",
  description:
    "Repositório centralizado de infraestrutura gerenciando dois ambientes — local (Windows 11 + WSL2) e VPS (Ubuntu + k3s) — a partir de uma única fonte da verdade. Sem código de aplicação, sem Dockerfiles: repositórios upstream publicam imagens no GHCR, e este repositório apenas as consome.",
  problem:
    "Rodar múltiplos serviços pessoais em duas máquinas (desenvolvimento local + VPS) sem virar um SRE de meio período. O desafio: manter ambientes reprodutíveis, segredos protegidos e ainda conseguir reconstruir qualquer host do zero em uma tarde.",
  approach: [
    "Dois alvos de deploy — Docker Compose para iteração local rápida, k3s single-node na VPS — driven do mesmo Justfile.",
    "Quatro namespaces por cluster (mcp / bff / vos / monitoring) mantêm blast radius pequeno e regras de routing legíveis.",
    "Traefik cuida do ingress na VPS; Cloudflare provê DNS, TLS, Access e Tunnel na frente.",
    "Secrets selados com SOPS + age — nunca plaintext no Git, nunca montados como env vars cruas.",
    "Todo deployment nasce com replicas: 0 e sobe sob demanda via comandos just wake-*, mantendo a VPS silenciosa por padrão.",
    "20 Architecture Decision Records (ADRs) vivem no repositório — toda escolha não-trivial tem contexto, decisão e consequências documentadas.",
  ],
  role: "Projeto pessoal — autor e operador único",
  highlights: [
    "Rebuilds do zero em VPS ou workstation nova em menos de uma tarde",
    "20 ADRs documentando trade-offs (image pinning, retenção de storage, rotação de secrets)",
    "Runbooks por serviço com health endpoints, contratos de porta e procedimentos break-glass",
    "Smoke tests validam toda a stack em menos de 60 segundos",
  ],
  caseStudy: {
    lessonsLearned:
      "Construir uma plataforma pessoal me forçou a fazer trade-offs que não aparecem em tutoriais. Fixar tags de imagem por digest é mais chato do que sempre usar a versão mais recente (latest), mas é a única forma de saber exatamente o que está rodando. SOPS + age adicionam fricção à rotação de segredos, mas significam que posso publicar o repositório publicamente sem vazar nada. A maior lição: documentação escrita para você mesmo daqui a seis meses é a única que realmente é lida — então os ADRs são escritos como uma conversa com esse eu futuro.",
    architectureLabel: "arquitetura / dois ambientes, uma fonte da verdade",
    // Cada technologies/tradeoffs abaixo é rastreável a um ADR ou ao
    // architecture.md do próprio repositório personal-platform-infra —
    // nada aqui foi deduzido da stack geral do projeto.
    architecture: {
      nodes: [
        {
          id: "wsl2",
          group: "local",
          label: "Windows 11 + WSL2",
          detail: "Ambiente de desenvolvimento local no Windows via WSL2.",
          technologies: ["WSL2 Ubuntu", "Docker Desktop"],
        },
        {
          id: "compose",
          group: "local",
          label: "Docker Compose",
          detail: "Orquestra os serviços localmente para iteração rápida.",
          technologies: ["Docker Compose"],
          tradeoffs: [
            "Overhead mínimo ao custo de baixa paridade com o k3s — mantido como caminho alternativo para iteração rápida (ADR 0005).",
          ],
        },
        {
          id: "k3d",
          group: "local",
          label: "k3d (validação k8s)",
          detail: "Cluster k3d local para validar manifests antes da VPS.",
          technologies: ["k3d", "Kustomize"],
          tradeoffs: [
            "Escolhido sobre kind e minikube pela paridade com o k3s da VPS (mesmo runtime); custa ~200–400MB e exige Docker rodando (ADR 0005).",
          ],
        },
        {
          id: "cloudflare",
          group: "edge",
          label: "Cloudflare",
          detail: "DNS, TLS, Access e Tunnel na frente da VPS.",
          technologies: ["Cloudflare DNS", "Cloudflare Tunnel", "Terraform"],
          tradeoffs: [
            "Camada única de rede: TLS automático sem Certbot ou cert-manager, aceitando vendor lock-in e ~10ms de latência de proxy (ADR 0009).",
          ],
        },
        {
          id: "vps",
          group: "vps",
          label: "Ubuntu + k3s (single-node)",
          detail: "Host único rodando k3s; expõe a porta 80 ao Traefik.",
          technologies: ["Ubuntu (Hetzner)", "k3s"],
          tradeoffs: [
            "Single-node sem HA: ponto único de falha aceito por ~US$5–10/mês vs US$30+ de um cluster multi-nó (ADR 0013).",
            "Deployments nascem com replicas: 0 e acordam sob demanda — custo proporcional ao uso real (ADR 0001).",
          ],
        },
        {
          id: "traefik",
          group: "vps",
          label: "Traefik ingress",
          detail: "Roteia cada requisição ao serviço certo por hostname.",
          technologies: ["Traefik", "KEDA HTTP Add-on"],
          tradeoffs: [
            "Ingress nativo do k3s — zero instalação extra; TLS fica no proxy Cloudflare e o Traefik recebe HTTP puro na porta 80 (ADRs 0005/0009).",
            "Requisições passam pelo interceptor do KEDA, que acorda serviços dormindo em replicas: 0 (ADR 0016).",
          ],
        },
        {
          id: "namespaces",
          group: "vps",
          label: "namespaces: mcp / bff / vos / monitoring",
          detail: "Quatro namespaces isolam o blast radius por domínio.",
          tradeoffs: [
            "Isolamento por domínio funcional prepara RBAC e NetworkPolicy granulares (ADR 0010).",
            "Chamadas entre namespaces exigem FQDN completo — custo aceito do isolamento (ADR 0010).",
          ],
        },
      ],
      edges: [
        { from: "cloudflare", to: "vps" },
        { from: "vps", to: "traefik" },
        { from: "traefik", to: "namespaces" },
      ],
    },
  },
};

const en: ProjectText = {
  tagline: "GitOps-style infra for a personal platform of MCP servers and BFFs",
  description:
    "Centralized infrastructure repository managing two environments — local (Windows 11 + WSL2) and VPS (Ubuntu + k3s) — from a single source of truth. No application code, no Dockerfiles: upstream repos publish images to GHCR, this repo consumes them.",
  problem:
    "Running multiple side-project services across two machines (local dev + VPS) without turning into a part-time SRE. The challenge: keep environments reproducible, secrets safe, and still be able to rebuild either host from zero in an afternoon.",
  approach: [
    "Two deployment targets — Docker Compose for fast local iteration, k3s single-node on the VPS — driven from the same Justfile.",
    "Four namespaces per cluster (mcp / bff / vos / monitoring) keep blast radius small and let routing rules stay readable.",
    "Traefik handles ingress on the VPS; Cloudflare provides DNS, TLS, Access and Tunnel in front of it.",
    "Secrets are sealed with SOPS + age — never plaintext in Git, never mounted as raw env vars.",
    "Every deployment starts with replicas: 0 and scales up on demand via just wake-* commands, keeping the VPS quiet by default.",
    "20 Architecture Decision Records (ADRs) live in the repo — every non-trivial choice has a documented context, decision and consequences.",
  ],
  role: "Personal project — sole author and operator",
  highlights: [
    "Rebuilds from zero on a fresh VPS or workstation in under an afternoon",
    "20 ADRs documenting trade-offs (image pinning, storage retention, secret rotation)",
    "Per-service runbooks with health endpoints, port contracts and break-glass procedures",
    "Smoke tests validate the whole stack in under 60 seconds",
  ],
  caseStudy: {
    lessonsLearned:
      "Building a personal platform forced me to make trade-offs that don't show up in tutorials. Pinning image tags by digest is more annoying than tracking latest, but it's the only way to know exactly what's running. SOPS + age adds friction to secret rotation, but means I can publish the repo publicly without leaking anything. The biggest lesson: documentation that you write for yourself six months from now is the only documentation that actually gets read — so the ADRs are written like a conversation with that future me.",
    architectureLabel: "architecture / two environments, one source of truth",
    // Every technologies/tradeoffs entry below traces to an ADR or to
    // architecture.md in the personal-platform-infra repository itself —
    // nothing here was inferred from the project's overall stack list.
    architecture: {
      nodes: [
        {
          id: "wsl2",
          group: "local",
          label: "Windows 11 + WSL2",
          detail: "Local development environment on Windows via WSL2.",
          technologies: ["WSL2 Ubuntu", "Docker Desktop"],
        },
        {
          id: "compose",
          group: "local",
          label: "Docker Compose",
          detail: "Orchestrates services locally for fast iteration.",
          technologies: ["Docker Compose"],
          tradeoffs: [
            "Minimal overhead at the cost of low parity with k3s — kept as the alternative path for fast iteration (ADR 0005).",
          ],
        },
        {
          id: "k3d",
          group: "local",
          label: "k3d (k8s validation)",
          detail: "Local k3d cluster to validate manifests before the VPS.",
          technologies: ["k3d", "Kustomize"],
          tradeoffs: [
            "Chosen over kind and minikube for parity with the VPS's k3s (same runtime); costs ~200–400MB and needs Docker running (ADR 0005).",
          ],
        },
        {
          id: "cloudflare",
          group: "edge",
          label: "Cloudflare",
          detail: "DNS, TLS, Access and Tunnel in front of the VPS.",
          technologies: ["Cloudflare DNS", "Cloudflare Tunnel", "Terraform"],
          tradeoffs: [
            "Single network layer: automatic TLS with no Certbot or cert-manager, accepting vendor lock-in and ~10ms of proxy latency (ADR 0009).",
          ],
        },
        {
          id: "vps",
          group: "vps",
          label: "Ubuntu + k3s (single-node)",
          detail: "Single host running k3s; exposes port 80 to Traefik.",
          technologies: ["Ubuntu (Hetzner)", "k3s"],
          tradeoffs: [
            "Single-node, no HA: a single point of failure accepted at ~US$5–10/month vs US$30+ for a multi-node cluster (ADR 0013).",
            "Deployments start at replicas: 0 and wake on demand — resource cost proportional to real use (ADR 0001).",
          ],
        },
        {
          id: "traefik",
          group: "vps",
          label: "Traefik ingress",
          detail: "Routes every request to the right service by hostname.",
          technologies: ["Traefik", "KEDA HTTP Add-on"],
          tradeoffs: [
            "k3s's native ingress — zero extra install; TLS stays at the Cloudflare proxy and Traefik receives plain HTTP on port 80 (ADRs 0005/0009).",
            "Requests pass through KEDA's interceptor, which wakes services sleeping at replicas: 0 (ADR 0016).",
          ],
        },
        {
          id: "namespaces",
          group: "vps",
          label: "namespaces: mcp / bff / vos / monitoring",
          detail: "Four namespaces keep blast radius small per domain.",
          tradeoffs: [
            "Functional-domain isolation lays the ground for granular RBAC and NetworkPolicy (ADR 0010).",
            "Cross-namespace calls require the full FQDN — an accepted cost of the isolation (ADR 0010).",
          ],
        },
      ],
      edges: [
        { from: "cloudflare", to: "vps" },
        { from: "vps", to: "traefik" },
        { from: "traefik", to: "namespaces" },
      ],
    },
  },
};

const text: Record<Lang, ProjectText> = { pt, en };

export function getPersonalPlatformInfra(lang: Lang) {
  return { ...personalPlatformInfraMeta, ...text[lang]! };
}
