import type { Project } from "../types";

export const personalPlatformInfra: Project = {
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
      pt: "Quatro namespaces por cluster (mcp / bff / vos / monitoring) mantêm blast radius pequeno e regras de routing legíveis.",
      en: "Four namespaces per cluster (mcp / bff / vos / monitoring) keep blast radius small and let routing rules stay readable.",
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
  caseStudy: {
    lessonsLearned: {
      pt: "Construir uma plataforma pessoal me forçou a fazer trade-offs que não aparecem em tutoriais. Pinjar tags de imagem por digest é mais chato que tracking latest, mas é a única forma de saber exatamente o que está rodando. SOPS + age adiciona fricção à rotação de secrets, mas significa que posso publicar o repo publicamente sem vazar nada. A maior lição: documentação escrita para você mesmo daqui a seis meses é a única que realmente é lida — então os ADRs são escritos como uma conversa com esse eu futuro.",
      en: "Building a personal platform forced me to make trade-offs that don't show up in tutorials. Pinning image tags by digest is more annoying than tracking latest, but it's the only way to know exactly what's running. SOPS + age adds friction to secret rotation, but means I can publish the repo publicly without leaking anything. The biggest lesson: documentation that you write for yourself six months from now is the only documentation that actually gets read — so the ADRs are written like a conversation with that future me.",
    },
    architectureLabel: {
      pt: "arquitetura / dois ambientes, uma fonte da verdade",
      en: "architecture / two environments, one source of truth",
    },
    localNodes: [
      { pt: "Windows 11 + WSL2", en: "Windows 11 + WSL2" },
      { pt: "Docker Compose", en: "Docker Compose" },
      { pt: "k3d (validação k8s)", en: "k3d (k8s validation)" },
    ],
    vpsNodes: [
      { pt: "Ubuntu + k3s (single-node)", en: "Ubuntu + k3s (single-node)" },
      { pt: "Traefik ingress", en: "Traefik ingress" },
      {
        pt: "namespaces: mcp / bff / vos / monitoring",
        en: "namespaces: mcp / bff / vos / monitoring",
      },
    ],
    flowText: {
      pt: "Cloudflare DNS + TLS + Access + Tunnel  →  VPS :80 → Traefik  →  serviços",
      en: "Cloudflare DNS + TLS + Access + Tunnel  →  VPS :80 → Traefik  →  services",
    },
  },
};
