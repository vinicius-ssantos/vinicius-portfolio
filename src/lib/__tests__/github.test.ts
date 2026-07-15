import { describe, it, expect, afterEach, vi } from "vitest";

// getGitHubStats is wrapped in React's cache(), which memoizes per module
// instance. Each scenario needs a fresh module (vi.resetModules +
// dynamic import) so one test's result can't leak into another's.
async function loadGetGitHubStats() {
  vi.resetModules();
  const mod = await import("@/lib/github");
  return mod.getGitHubStats;
}

describe("getGitHubStats", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("returns isLive: false when GITHUB_TOKEN is not set", async () => {
    vi.stubEnv("GITHUB_TOKEN", "");
    const getGitHubStats = await loadGetGitHubStats();

    const stats = await getGitHubStats();

    expect(stats.isLive).toBe(false);
  });

  it("returns isLive: false when the GitHub API responds with a non-OK status", async () => {
    vi.stubEnv("GITHUB_TOKEN", "test-token");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, json: async () => ({}) }));
    const getGitHubStats = await loadGetGitHubStats();

    const stats = await getGitHubStats();

    expect(stats.isLive).toBe(false);
  });

  it("returns isLive: false when the fetch throws", async () => {
    vi.stubEnv("GITHUB_TOKEN", "test-token");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network error")));
    const getGitHubStats = await loadGetGitHubStats();

    const stats = await getGitHubStats();

    expect(stats.isLive).toBe(false);
  });

  it("returns isLive: true and the fetched data when the API call succeeds", async () => {
    vi.stubEnv("GITHUB_TOKEN", "test-token");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          data: {
            user: {
              repositories: { totalCount: 42, nodes: [] },
              contributionsCollection: {
                contributionCalendar: { totalContributions: 999, weeks: [] },
              },
            },
          },
        }),
      }),
    );
    const getGitHubStats = await loadGetGitHubStats();

    const stats = await getGitHubStats();

    expect(stats.isLive).toBe(true);
    expect(stats.publicRepos).toBe(42);
    expect(stats.contributions).toBe(999);
  });
});
