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
    localNodes: ["Windows 11 + WSL2", "Docker Compose", "k3d (validação k8s)"],
    vpsNodes: [
      "Ubuntu + k3s (single-node)",
      "Traefik ingress",
      "namespaces: mcp / bff / vos / monitoring",
    ],
    flowText: "Cloudflare DNS + TLS + Access + Tunnel  →  VPS :80 → Traefik  →  serviços",
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
    localNodes: ["Windows 11 + WSL2", "Docker Compose", "k3d (k8s validation)"],
    vpsNodes: [
      "Ubuntu + k3s (single-node)",
      "Traefik ingress",
      "namespaces: mcp / bff / vos / monitoring",
    ],
    flowText: "Cloudflare DNS + TLS + Access + Tunnel  →  VPS :80 → Traefik  →  services",
  },
};

const text: Record<Lang, ProjectText> = { pt, en };

export function getPersonalPlatformInfra(lang: Lang) {
  return { ...personalPlatformInfraMeta, ...text[lang]! };
}
