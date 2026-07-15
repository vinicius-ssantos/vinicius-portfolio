// Stack categories stay the same in both languages (tech terms are universal).
// Split into "professional" (used on the job, per CV) and "personal" (side
// projects / experimentation) so the "few tools, deeply" pitch in the Stack
// section description doesn't read as a contradiction of the full tool list.
export const stack = {
  professional: {
    Backend: ["Java", "Spring", "REST APIs", "Microservices"],
    Quality: ["JUnit", "Mockito", "TDD", "SOLID", "Design Patterns"],
    Data: ["SQL Server", "MySQL", "Redis"],
    DevOps: ["Git", "SVN", "CI/CD", "Jenkins", "Kubernetes", "AWS (EC2, S3)"],
    Methods: ["Scrum", "Kanban"],
  },
  personal: {
    Backend: ["Kotlin", "Node.js"],
    Data: ["PostgreSQL", "SQLite", "MongoDB", "Firebase / Firestore"],
    Infrastructure: ["Docker", "Traefik", "Cloudflare", "Ansible", "Just", "GHCR", "SOPS + age"],
  },
  Languages: [
    { pt: "Português (nativo)", en: "Portuguese (native)" },
    { pt: "Inglês (intermediário)", en: "English (intermediate)" },
  ],
};
