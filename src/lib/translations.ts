/**
 * UI translations for PT and EN.
 * Content translations (jobs, projects, etc.) live in src/content/
 * with { pt, en } pairs on each text field.
 */
import type { Locale } from "./i18n";

// `Lang` is an alias, not a second definition — `Locale` in `src/lib/i18n.ts`
// is the single source of truth for the pt/en value set.
export type Lang = Locale;

const en = {
  a11y: {
    skipToContent: "Skip to content",
    loading: "Loading…",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    menuTitle: "Navigation menu",
  },
  notFound: {
    eyebrow: "404 — error",
    title: "Page not found",
    description: "The page you're looking for doesn't exist or has been moved.",
    back: "Back to portfolio",
  },
  errorPage: {
    eyebrow: "Error",
    title: "Something went wrong",
    description:
      "An unexpected error occurred while rendering the page. Try reloading — if it persists, please let me know via the contact options.",
    errorId: "Error ID",
    tryAgain: "Try again",
  },
  themeToggle: {
    toLight: "Switch to light theme",
    toDark: "Switch to dark theme",
  },
  nav: {
    home: "Home",
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
    seeProjects: "View projects",
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
    formTitle: "Send a message",
    formName: "Your name",
    formEmail: "Your email",
    formMessage: "Message",
    formSend: "Send message",
    formSending: "Sending...",
    formSuccess: "Message sent! I'll get back to you soon.",
    formError: "Something went wrong. Please try emailing me directly.",
  },
  stats: {
    heatmapLess: "Less",
    heatmapMore: "More",
    heatmapTitle: "contributions in the last year",
  },
  experience: {
    eyebrow: "// experience",
    title: "Where I've worked",
    description:
      "In software and QA since 2021, focused on backend since 2023 — across financial software and large-scale internet services. The path matters as much as the destination.",
    current: "Current",
    present: "Present",
  },
  stack: {
    eyebrow: "// stack",
    title: "Tools I reach for",
    description:
      "At work I keep the toolkit narrow and go deep. Side projects are where I go wide and experiment.",
    professionalTitle: "Day to day (on the job)",
    personalTitle: "Side projects & experimentation",
    languagesLabel: "Most used languages",
    languagesLive: "Live from GitHub",
  },
  projects: {
    eyebrow: "// selected work",
    title: "Three projects, three different problems",
    description:
      "Personal projects I build to study patterns I can't always reach at work. Picked for depth, not for showcase value.",
    mostRecent: "Most recent",
    viewDetails: "View case file",
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
    updated: "Updated",
    local: "Local",
    vps: "VPS",
    trafficFlow: "traffic flow",
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
    showPhone: "Show phone",
    hidePhone: "Hide phone",
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
};

// `pt` is checked against `Translation` (derived from `en`) so the two
// locales stay structurally equivalent at compile time — a missing or
// mistyped key in either one is a type error, not a silent runtime gap.
export type Translation = typeof en;

const pt: Translation = {
  a11y: {
    skipToContent: "Pular para o conteúdo",
    loading: "Carregando…",
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
    menuTitle: "Menu de navegação",
  },
  notFound: {
    eyebrow: "404 — erro",
    title: "Página não encontrada",
    description: "A página que você procura não existe ou foi movida.",
    back: "Voltar ao portfólio",
  },
  errorPage: {
    eyebrow: "Erro",
    title: "Algo deu errado",
    description:
      "Ocorreu um erro inesperado ao renderizar a página. Tente recarregar — se persistir, por favor me avise pelas opções de contato.",
    errorId: "ID do erro",
    tryAgain: "Tentar novamente",
  },
  themeToggle: {
    toLight: "Mudar para tema claro",
    toDark: "Mudar para tema escuro",
  },
  nav: {
    home: "Início",
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
    seeProjects: "Ver projetos",
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
    formTitle: "Enviar uma mensagem",
    formName: "Seu nome",
    formEmail: "Seu email",
    formMessage: "Mensagem",
    formSend: "Enviar mensagem",
    formSending: "Enviando...",
    formSuccess: "Mensagem enviada! Responderei em breve.",
    formError: "Algo deu errado. Tente me enviar um email diretamente.",
  },
  stats: {
    heatmapLess: "Menos",
    heatmapMore: "Mais",
    heatmapTitle: "contribuições no último ano",
  },
  experience: {
    eyebrow: "// experiência",
    title: "Onde já trabalhei",
    description:
      "Em software e QA desde 2021, com foco em backend desde 2023 — entre software financeiro e serviços de internet em larga escala. O caminho importa tanto quanto o destino.",
    current: "Atual",
    present: "Presente",
  },
  stack: {
    eyebrow: "// stack",
    title: "Ferramentas que uso",
    description:
      "No trabalho mantenho o toolkit enxuto e vou fundo. Em projetos pessoais é onde experimento e vou largo.",
    professionalTitle: "No dia a dia (profissional)",
    personalTitle: "Projetos pessoais & experimentação",
    languagesLabel: "Linguagens mais usadas",
    languagesLive: "Ao vivo do GitHub",
  },
  projects: {
    eyebrow: "// trabalhos selecionados",
    title: "Três projetos, três problemas diferentes",
    description:
      "Projetos pessoais que construo para estudar padrões que nem sempre alcanço no trabalho. Escolhidos por profundidade, não para vitrine.",
    mostRecent: "Mais recente",
    viewDetails: "Ver dossiê",
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
    updated: "Atualizado",
    local: "Local",
    vps: "VPS",
    trafficFlow: "fluxo de tráfego",
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
    showPhone: "Mostrar telefone",
    hidePhone: "Esconder telefone",
  },
  footer: {
    builtWith: "Construído com Next.js.",
  },
  projectDetail: {
    backToPortfolio: "Voltar ao portfólio",
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
      "Esse projeto não existe ou foi movido. Volte ao portfólio para ver todos.",
  },
};

export const translations: Record<Locale, Translation> = { en, pt };
