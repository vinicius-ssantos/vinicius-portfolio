import { cache } from "react";

export type ProjectRepositorySnapshot = {
  owner: string;
  name: string;
  url: string;
  isLive: boolean;
  isArchived: boolean;
  pushedAt?: string;
  updatedAt?: string;
  defaultBranch?: string;
  primaryLanguage?: { name: string; color?: string };
  languages?: { name: string; percentage: number; color?: string }[];
  latestRelease?: { tag: string; publishedAt: string; url: string };
  license?: { name: string; spdxId?: string };
  stars?: number;
  openIssues?: number;
};

const REVALIDATE_SECONDS = 60 * 60 * 24;

/** Extracts { owner, name } from a github.com repo URL, or null if it doesn't match. */
export function parseGitHubRepoUrl(url: string): { owner: string; name: string } | null {
  const match = /^https:\/\/github\.com\/([^/]+)\/([^/]+?)\/?$/.exec(url);
  if (!match) return null;
  const [, owner, name] = match;
  if (!owner || !name) return null;
  return { owner, name };
}

/**
 * Canonical key for a repo in the map `getProjectRepositorySnapshots`
 * returns. Not the project's `slug` — a project's slug and its repo's name
 * often differ in case or punctuation (e.g. slug "springcloud" vs. repo
 * "SpringCloud"), so callers must derive this the same way on both sides
 * (`repoKey(parseGitHubRepoUrl(project.repoUrl))`), not assume slug === name.
 */
export function repoKey(ref: { owner: string; name: string }): string {
  return `${ref.owner}/${ref.name}`;
}

function fallbackSnapshot(owner: string, name: string): ProjectRepositorySnapshot {
  return {
    owner,
    name,
    url: `https://github.com/${owner}/${name}`,
    isLive: false,
    isArchived: false,
  };
}

type RawRepoNode = {
  url: string;
  isArchived: boolean;
  isDisabled?: boolean;
  pushedAt?: string;
  updatedAt?: string;
  defaultBranchRef?: { name: string } | null;
  primaryLanguage?: { name: string; color?: string } | null;
  languages?: { edges?: { size: number; node: { name: string; color?: string } }[] } | null;
  releases?: { nodes?: { tagName: string; publishedAt: string; url: string }[] } | null;
  licenseInfo?: { name: string; spdxId?: string } | null;
  stargazerCount?: number;
  issues?: { totalCount: number } | null;
} | null;

function toSnapshot(owner: string, name: string, node: RawRepoNode): ProjectRepositorySnapshot {
  if (!node) return fallbackSnapshot(owner, name);

  const languageEdges = node.languages?.edges ?? [];
  const totalSize = languageEdges.reduce((sum, e) => sum + e.size, 0);
  const languages = languageEdges
    .map((e) => ({
      name: e.node.name,
      color: e.node.color,
      percentage: totalSize > 0 ? (e.size / totalSize) * 100 : 0,
    }))
    .sort((a, b) => b.percentage - a.percentage);

  const latestReleaseNode = node.releases?.nodes?.[0];

  return {
    owner,
    name,
    url: node.url,
    isLive: true,
    isArchived: node.isArchived,
    pushedAt: node.pushedAt,
    updatedAt: node.updatedAt,
    defaultBranch: node.defaultBranchRef?.name,
    primaryLanguage: node.primaryLanguage
      ? { name: node.primaryLanguage.name, color: node.primaryLanguage.color }
      : undefined,
    languages: languages.length > 0 ? languages : undefined,
    latestRelease: latestReleaseNode
      ? {
          tag: latestReleaseNode.tagName,
          publishedAt: latestReleaseNode.publishedAt,
          url: latestReleaseNode.url,
        }
      : undefined,
    license: node.licenseInfo
      ? { name: node.licenseInfo.name, spdxId: node.licenseInfo.spdxId }
      : undefined,
    stars: node.stargazerCount,
    openIssues: node.issues?.totalCount,
  };
}

const REPO_FIELDS = /* GraphQL */ `
  url
  isArchived
  pushedAt
  updatedAt
  defaultBranchRef {
    name
  }
  primaryLanguage {
    name
    color
  }
  languages(first: 8, orderBy: { field: SIZE, direction: DESC }) {
    edges {
      size
      node {
        name
        color
      }
    }
  }
  releases(first: 1, orderBy: { field: CREATED_AT, direction: DESC }) {
    nodes {
      tagName
      publishedAt
      url
    }
  }
  licenseInfo {
    name
    spdxId
  }
  stargazerCount
  issues(states: OPEN) {
    totalCount
  }
`;

/**
 * Fetches one GraphQL query aliasing every requested repo (repo0, repo1, ...)
 * instead of one request per repo — GitHub's GraphQL API has no native
 * "batch by owner/name list" field, so aliasing is the standard way to
 * avoid N round trips. Deduplicated per render via React's `cache()`, same
 * pattern as `getGitHubStats` in ./github.ts.
 *
 * Every requested repo gets a snapshot back, even on total failure — the
 * failure path returns `isLive: false` fallbacks so callers never have to
 * branch on "did the fetch itself fail" vs. "this one repo 404'd".
 */
export const getProjectRepositorySnapshots = cache(
  async (
    repos: { owner: string; name: string }[],
  ): Promise<Record<string, ProjectRepositorySnapshot>> => {
    const fallback = () =>
      Object.fromEntries(repos.map((r) => [repoKey(r), fallbackSnapshot(r.owner, r.name)]));

    if (repos.length === 0) return {};

    const token = process.env.GITHUB_TOKEN;
    if (!token) return fallback();

    const aliases = repos
      .map(
        (
          r,
          i,
        ) => `repo${i}: repository(owner: ${JSON.stringify(r.owner)}, name: ${JSON.stringify(r.name)}) {
      ${REPO_FIELDS}
    }`,
      )
      .join("\n");
    const query = /* GraphQL */ `query ProjectRepos {\n${aliases}\n}`;

    try {
      const res = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
        next: { revalidate: REVALIDATE_SECONDS },
      });

      if (!res.ok) return fallback();

      const json = await res.json();
      const data = json?.data;
      if (!data) return fallback();

      const result: Record<string, ProjectRepositorySnapshot> = {};
      repos.forEach((r, i) => {
        result[repoKey(r)] = toSnapshot(r.owner, r.name, data[`repo${i}`] ?? null);
      });
      return result;
    } catch {
      return fallback();
    }
  },
);
