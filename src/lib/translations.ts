/**
 * UI translations for PT and EN.
 * Content translations (jobs, projects, etc.) live in portfolio-data.ts
 * with { pt, en } pairs on each text field.
 */

export type Lang = "pt" | "en";

export const translations = {
  en: {
    a11y: {
      skipToContent: "Skip to content",
    },
    nav: {
      experience: "Experience",
      stack: "Stack",
      projects: "Projects",
      caseStudy: "Case study",
      about: "About",
    },
    hero: {
      badge: "Backend Engineer @ UOL · São Paulo, BR",
      getInTouch: "Get in touch",
      downloadCV: "Download CV",
      seeExperience: "See experience",
    },
    contactModal: {
      title: "Let's talk",
      subtitle:
        "I'm open to backend & platform roles, contract work, and conversations about distributed systems, k8s operations, or MCP server architecture.",
      emailLabel: "Email",
      phoneLabel: "Phone",
      linkedinLabel: "LinkedIn",
      githubLabel: "GitHub",
      copy: "Copy",
      copied: "Copied!",
      openEmailClient: "Open email client",
      orText: "or",
    },
    stats: {
      yearsLabel: "Years in backend & QA",
      reposLabel: "Public repositories",
      contribsLabel: "GitHub contributions / yr",
      heatmapLess: "Less",
      heatmapMore: "More",
      heatmapTitle: "contributions in the last year",
    },
    experience: {
      eyebrow: "// experience",
      title: "Where I've worked",
      description:
        "Started in QA, grew into backend. Five years across financial software and large-scale internet services — the path matters as much as the destination.",
      current: "Current",
    },
    stack: {
      eyebrow: "// stack",
      title: "Tools I reach for",
      description:
        "A focused toolkit shaped by production work. I'd rather know five tools deeply than twenty shallowly.",
    },
    projects: {
      eyebrow: "// selected work",
      title: "Three projects, three different problems",
      description:
        "Personal projects I build to study patterns I can't always reach at work. Picked for depth, not for showcase value.",
      mostRecent: "Most recent",
      viewRepository: "View repository",
    },
    caseStudy: {
      eyebrow: "// case study",
      deepDiveTitle: "Deep dive:",
      problem: "The problem",
      approach: "The approach",
      outcomes: "Outcomes",
      stack: "Stack",
      lessonsLearned: "Lessons learned",
      openRepo: "Open repo",
      role: "Personal project — sole author and operator",
      updated: "Updated",
      lessonsText:
        "Building a personal platform forced me to make trade-offs that don't show up in tutorials. Pinning image tags by digest is more annoying than tracking latest, but it's the only way to know exactly what's running. SOPS + age adds friction to secret rotation, but means I can publish the repo publicly without leaking anything. The biggest lesson: documentation that you write for yourself six months from now is the only documentation that actually gets read — so the ADRs are written like a conversation with that future me.",
      architectureLabel: "architecture / two environments, one source of truth",
      local: "Local",
      vps: "VPS",
      localNodes: [
        "Windows 11 + WSL2",
        "Docker Compose",
        "k3d (k8s validation)",
      ],
      vpsNodes: [
        "Ubuntu + k3s (single-node)",
        "Traefik ingress",
        "namespaces: mcp / bff / vos / monitoring",
      ],
      flowText:
        "Cloudflare DNS + TLS + Access + Tunnel  →  VPS :80 → Traefik  →  services",
    },
    education: {
      eyebrow: "// education",
      title: "Academic background",
      description:
        "A technical foundation followed by a deliberate full-stack postgraduate — to round out the backend focus.",
    },
    about: {
      eyebrow: "// about",
      title: "A bit more about me",
      careerPath: "Career path",
      howIThink: "How I think",
      currently: "Currently",
      currentlyLearning: "Currently learning",
      currentlyItems: {
        role: "Software Engineer at UOL — auth & account protection",
        runningCluster: "Running a personal k3s cluster on a VPS",
        studying: "Studying Spring Cloud patterns and MCP servers",
      },
    },
    footer: {
      builtWith: "Built with Next.js.",
    },
    projectDetail: {
      backToPortfolio: "Back to portfolio",
      eyebrow: "// case file",
      taglineLabel: "Summary",
      problemLabel: "The problem",
      approachLabel: "The approach",
      outcomesLabel: "Outcomes",
      roleLabel: "Role",
      stackLabel: "Stack",
      updatedLabel: "Last updated",
      openRepo: "Open repository",
      notFound: "Project not found",
      notFoundDescription:
        "This project doesn't exist or has been moved. Head back to the portfolio to see all of them.",
    },
  },

  pt: {
    a11y: {
      skipToContent: "Pular para o conteúdo",
    },
    nav: {
      experience: "Experiência",
      stack: "Stack",
      projects: "Projetos",
      caseStudy: "Case study",
      about: "Sobre",
    },
    hero: {
      badge: "Engenheiro Backend @ UOL · São Paulo, BR",
      getInTouch: "Entrar em contato",
      downloadCV: "Baixar CV",
      seeExperience: "Ver experiência",
    },
    contactModal: {
      title: "Vamos conversar",
      subtitle:
        "Estou aberto a vagas de backend & plataforma, trabalho como contratado, e conversas sobre sistemas distribuídos, operação de k8s, ou arquitetura de MCP servers.",
      emailLabel: "Email",
      phoneLabel: "Telefone",
      linkedinLabel: "LinkedIn",
      githubLabel: "GitHub",
      copy: "Copiar",
      copied: "Copiado!",
      openEmailClient: "Abrir cliente de email",
      orText: "ou",
    },
    stats: {
      yearsLabel: "Anos em backend & QA",
      reposLabel: "Repositórios públicos",
      contribsLabel: "Contribuições / ano no GitHub",
      heatmapLess: "Menos",
      heatmapMore: "Mais",
      heatmapTitle: "contribuições no último ano",
    },
    experience: {
      eyebrow: "// experiência",
      title: "Onde já trabalhei",
      description:
        "Comecei em QA, cresci em backend. Cinco anos entre software financeiro e serviços de internet em larga escala — o caminho importa tanto quanto o destino.",
      current: "Atual",
    },
    stack: {
      eyebrow: "// stack",
      title: "Ferramentas que uso",
      description:
        "Um toolkit focado, moldado por trabalho em produção. Prefiro conhecer cinco ferramentas a fundo do que vinte superficialmente.",
    },
    projects: {
      eyebrow: "// trabalhos selecionados",
      title: "Três projetos, três problemas diferentes",
      description:
        "Projetos pessoais que construo para estudar padrões que nem sempre alcanço no trabalho. Escolhidos por profundidade, não para vitrine.",
      mostRecent: "Mais recente",
      viewRepository: "Ver repositório",
    },
    caseStudy: {
      eyebrow: "// case study",
      deepDiveTitle: "Mergulho profundo:",
      problem: "O problema",
      approach: "A abordagem",
      outcomes: "Resultados",
      stack: "Stack",
      lessonsLearned: "Lições aprendidas",
      openRepo: "Abrir repo",
      role: "Projeto pessoal — autor e operador único",
      updated: "Atualizado",
      lessonsText:
        "Construir uma plataforma pessoal me forçou a fazer trade-offs que não aparecem em tutoriais. Pinjar tags de imagem por digest é mais chato que tracking latest, mas é a única forma de saber exatamente o que está rodando. SOPS + age adiciona fricção à rotação de secrets, mas significa que posso publicar o repo publicamente sem vazar nada. A maior lição: documentação escrita para você mesmo daqui a seis meses é a única que realmente é lida — então os ADRs são escritos como uma conversa com esse eu futuro.",
      architectureLabel: "arquitetura / dois ambientes, uma fonte da verdade",
      local: "Local",
      vps: "VPS",
      localNodes: [
        "Windows 11 + WSL2",
        "Docker Compose",
        "k3d (validação k8s)",
      ],
      vpsNodes: [
        "Ubuntu + k3s (single-node)",
        "Traefik ingress",
        "namespaces: mcp / bff / vos / monitoring",
      ],
      flowText:
        "Cloudflare DNS + TLS + Access + Tunnel  →  VPS :80 → Traefik  →  serviços",
    },
    education: {
      eyebrow: "// formação",
      title: "Formação acadêmica",
      description:
        "Uma base técnica seguida de uma pós-graduação deliberada em full stack — para complementar o foco em backend.",
    },
    about: {
      eyebrow: "// sobre",
      title: "Um pouco mais sobre mim",
      careerPath: "Trajetória",
      howIThink: "Como penso",
      currently: "Atualmente",
      currentlyLearning: "Estudando agora",
      currentlyItems: {
        role: "Software Engineer na UOL — auth & proteção de conta",
        runningCluster: "Rodando um cluster k3s pessoal em uma VPS",
        studying: "Estudando padrões Spring Cloud e MCP servers",
      },
    },
    footer: {
      builtWith: "Construído com Next.js.",
    },
    projectDetail: {
      backToPortfolio: "Voltar ao portfolio",
      eyebrow: "// dossiê",
      taglineLabel: "Resumo",
      problemLabel: "O problema",
      approachLabel: "A abordagem",
      outcomesLabel: "Resultados",
      roleLabel: "Papel",
      stackLabel: "Stack",
      updatedLabel: "Última atualização",
      openRepo: "Abrir repositório",
      notFound: "Projeto não encontrado",
      notFoundDescription:
        "Esse projeto não existe ou foi movido. Volte ao portfolio para ver todos.",
    },
  },
};

export type Translation = (typeof translations)["en"];
export type TranslationKeys = Translation;
