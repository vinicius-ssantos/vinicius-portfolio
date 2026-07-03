import { profile } from "./portfolio-data";

export type ContributionDay = {
  date: string;
  count: number;
};

export type GitHubStats = {
  publicRepos: number;
  contributions: number;
  weeks: ContributionDay[][];
};

const FALLBACK: GitHubStats = {
  publicRepos: Number(profile.stats[1].value) || 53,
  contributions: Number(profile.stats[2].value) || 3733,
  weeks: [],
};

const REVALIDATE_SECONDS = 60 * 60 * 24;

const QUERY = /* GraphQL */ `
  query UserProfile($login: String!) {
    user(login: $login) {
      repositories(privacy: PUBLIC, ownerAffiliations: [OWNER]) {
        totalCount
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

export async function getGitHubStats(): Promise<GitHubStats> {
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
      calendar?.weeks?.map((w: { contributionDays?: { date: string; contributionCount: number }[] }) =>
        (w.contributionDays ?? []).map((d) => ({
          date: d.date,
          count: d.contributionCount,
        }))
      ) ?? [];

    return {
      publicRepos: user.repositories?.totalCount ?? FALLBACK.publicRepos,
      contributions: calendar?.totalContributions ?? FALLBACK.contributions,
      weeks,
    };
  } catch {
    return FALLBACK;
  }
}

export function formatStat(n: number): string {
  if (n >= 1000) {
    const k = n / 1000;
    return `${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}k`;
  }
  return String(n);
}
