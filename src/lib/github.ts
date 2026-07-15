import { cache } from "react";
import { profile } from "@/content";

export type ContributionDay = {
  date: string;
  count: number;
};

export type LanguageStat = {
  name: string;
  percentage: number;
  color: string;
};

export type GitHubStats = {
  publicRepos: number;
  contributions: number;
  weeks: ContributionDay[][];
  languages: LanguageStat[];
  /**
   * True only when this data actually came from the GitHub API this
   * request. False for every fallback path (missing token, non-OK
   * response, malformed payload, network error) — callers must not
   * label fallback numbers as "live".
   */
  isLive: boolean;
};

const FALLBACK: GitHubStats = {
  publicRepos: Number(profile.stats[2]?.value) || 53,
  contributions: 3733,
  weeks: [],
  languages: [],
  isLive: false,
};

const REVALIDATE_SECONDS = 60 * 60 * 24;

const QUERY = /* GraphQL */ `
  query UserProfile($login: String!) {
    user(login: $login) {
      repositories(
        first: 50
        privacy: PUBLIC
        ownerAffiliations: [OWNER]
        isFork: false
        orderBy: { field: STARGAZERS, direction: DESC }
      ) {
        totalCount
        nodes {
          languages(first: 8, orderBy: { field: SIZE, direction: DESC }) {
            edges {
              size
              node {
                name
                color
              }
            }
          }
        }
      }
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
    }
  }
`;

type LangEdge = { size: number; node: { name: string; color: string } };

function aggregateLanguages(nodes: { languages?: { edges?: LangEdge[] } }[]): LanguageStat[] {
  const totals = new Map<string, { size: number; color: string }>();

  for (const repo of nodes) {
    for (const edge of repo.languages?.edges ?? []) {
      const existing = totals.get(edge.node.name);
      if (existing) {
        existing.size += edge.size;
      } else {
        totals.set(edge.node.name, { size: edge.size, color: edge.node.color || "#6b7280" });
      }
    }
  }

  const grandTotal = Array.from(totals.values()).reduce((sum, l) => sum + l.size, 0);

  return Array.from(totals.entries())
    .map(([name, { size, color }]) => ({
      name,
      percentage: grandTotal > 0 ? (size / grandTotal) * 100 : 0,
      color,
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 8);
}

export const getGitHubStats = cache(async (): Promise<GitHubStats> => {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return FALLBACK;

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: QUERY, variables: { login: profile.handle } }),
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!res.ok) return FALLBACK;

    const json = await res.json();
    const user = json?.data?.user;
    if (!user) return FALLBACK;

    const calendar = user.contributionsCollection?.contributionCalendar;
    const weeks: ContributionDay[][] =
      calendar?.weeks?.map(
        (w: { contributionDays?: { date: string; contributionCount: number }[] }) =>
          (w.contributionDays ?? []).map((d) => ({
            date: d.date,
            count: d.contributionCount,
          })),
      ) ?? [];

    const languages = aggregateLanguages(user.repositories?.nodes ?? []);

    return {
      publicRepos: user.repositories?.totalCount ?? FALLBACK.publicRepos,
      contributions: calendar?.totalContributions ?? FALLBACK.contributions,
      weeks,
      languages,
      isLive: true,
    };
  } catch {
    return FALLBACK;
  }
});

export function formatStat(n: number): string {
  if (n >= 1000) {
    const k = n / 1000;
    return `${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}k`;
  }
  return String(n);
}
