import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const fetchMock = vi.fn();

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
  vi.stubEnv("GITHUB_TOKEN", "test-token");
});

afterEach(() => {
  fetchMock.mockReset();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

function jsonResponse(body: unknown, ok = true) {
  return { ok, json: () => Promise.resolve(body) } as Response;
}

async function freshModule() {
  vi.resetModules();
  return import("@/lib/github-repos");
}

describe("parseGitHubRepoUrl", () => {
  it("parses a standard github.com URL", async () => {
    const { parseGitHubRepoUrl } = await freshModule();
    expect(parseGitHubRepoUrl("https://github.com/vinicius-ssantos/springcloud")).toEqual({
      owner: "vinicius-ssantos",
      name: "springcloud",
    });
  });

  it("parses a URL with a trailing slash", async () => {
    const { parseGitHubRepoUrl } = await freshModule();
    expect(parseGitHubRepoUrl("https://github.com/vinicius-ssantos/springcloud/")).toEqual({
      owner: "vinicius-ssantos",
      name: "springcloud",
    });
  });

  it("returns null for a non-GitHub URL", async () => {
    const { parseGitHubRepoUrl } = await freshModule();
    expect(parseGitHubRepoUrl("https://gitlab.com/x/y")).toBeNull();
  });

  it("returns null for a malformed URL", async () => {
    const { parseGitHubRepoUrl } = await freshModule();
    expect(parseGitHubRepoUrl("not-a-url")).toBeNull();
  });
});

describe("getProjectRepositorySnapshots", () => {
  it("returns an empty object for an empty repo list without calling fetch", async () => {
    const { getProjectRepositorySnapshots } = await freshModule();
    const result = await getProjectRepositorySnapshots([]);
    expect(result).toEqual({});
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns non-live fallbacks for every repo when GITHUB_TOKEN is missing, without calling fetch", async () => {
    vi.unstubAllEnvs();
    const { getProjectRepositorySnapshots } = await freshModule();

    const result = await getProjectRepositorySnapshots([{ owner: "o", name: "a" }]);

    expect(result["o/a"]).toMatchObject({ isLive: false, owner: "o", name: "a" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("batches multiple repos into a single aliased GraphQL request", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({
        data: {
          repo0: { url: "https://github.com/o/a", isArchived: false },
          repo1: { url: "https://github.com/o/b", isArchived: false },
        },
      }),
    );
    const { getProjectRepositorySnapshots } = await freshModule();

    const result = await getProjectRepositorySnapshots([
      { owner: "o", name: "a" },
      { owner: "o", name: "b" },
    ]);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(init.body as string);
    expect(body.query).toContain("repo0: repository(owner:");
    expect(body.query).toContain("repo1: repository(owner:");
    expect(result["o/a"]?.isLive).toBe(true);
    expect(result["o/b"]?.isLive).toBe(true);
  });

  it("maps a full repo response to a live snapshot with languages, release, and license", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({
        data: {
          repo0: {
            url: "https://github.com/o/a",
            isArchived: false,
            pushedAt: "2026-01-01T00:00:00Z",
            updatedAt: "2026-01-02T00:00:00Z",
            defaultBranchRef: { name: "main" },
            primaryLanguage: { name: "Java", color: "#b07219" },
            languages: {
              edges: [
                { size: 300, node: { name: "Java", color: "#b07219" } },
                { size: 100, node: { name: "Dockerfile", color: "#384d54" } },
              ],
            },
            releases: {
              nodes: [{ tagName: "v1.2.0", publishedAt: "2026-01-01T00:00:00Z", url: "https://x" }],
            },
            licenseInfo: { name: "MIT License", spdxId: "MIT" },
            stargazerCount: 12,
            issues: { totalCount: 3 },
          },
        },
      }),
    );
    const { getProjectRepositorySnapshots } = await freshModule();

    const result = await getProjectRepositorySnapshots([{ owner: "o", name: "a" }]);

    expect(result["o/a"]).toMatchObject({
      isLive: true,
      isArchived: false,
      defaultBranch: "main",
      primaryLanguage: { name: "Java", color: "#b07219" },
      latestRelease: { tag: "v1.2.0" },
      license: { name: "MIT License", spdxId: "MIT" },
      stars: 12,
      openIssues: 3,
    });
    expect(result["o/a"]?.languages).toEqual([
      { name: "Java", color: "#b07219", percentage: 75 },
      { name: "Dockerfile", color: "#384d54", percentage: 25 },
    ]);
  });

  it("handles a repo with no release and no license", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({
        data: {
          repo0: { url: "https://github.com/o/a", isArchived: false, releases: { nodes: [] } },
        },
      }),
    );
    const { getProjectRepositorySnapshots } = await freshModule();

    const result = await getProjectRepositorySnapshots([{ owner: "o", name: "a" }]);

    expect(result["o/a"]?.latestRelease).toBeUndefined();
    expect(result["o/a"]?.license).toBeUndefined();
    expect(result["o/a"]?.isLive).toBe(true);
  });

  it("marks an archived repo as archived without treating it as an error", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ data: { repo0: { url: "https://github.com/o/a", isArchived: true } } }),
    );
    const { getProjectRepositorySnapshots } = await freshModule();

    const result = await getProjectRepositorySnapshots([{ owner: "o", name: "a" }]);

    expect(result["o/a"]).toMatchObject({ isLive: true, isArchived: true });
  });

  it("falls back to a non-live snapshot for a repo GitHub returns null for (deleted/renamed/inaccessible)", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({
        data: {
          repo0: { url: "https://github.com/o/a", isArchived: false },
          repo1: null,
        },
      }),
    );
    const { getProjectRepositorySnapshots } = await freshModule();

    const result = await getProjectRepositorySnapshots([
      { owner: "o", name: "a" },
      { owner: "o", name: "missing" },
    ]);

    expect(result["o/a"]?.isLive).toBe(true);
    expect(result["o/missing"]).toMatchObject({ isLive: false, owner: "o", name: "missing" });
  });

  it("falls back for every repo on a non-OK HTTP response (e.g. rate limited)", async () => {
    fetchMock.mockResolvedValue(jsonResponse({}, false));
    const { getProjectRepositorySnapshots } = await freshModule();

    const result = await getProjectRepositorySnapshots([{ owner: "o", name: "a" }]);

    expect(result["o/a"]).toMatchObject({ isLive: false });
  });

  it("falls back for every repo when the response has no data (malformed payload)", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ errors: [{ message: "boom" }] }));
    const { getProjectRepositorySnapshots } = await freshModule();

    const result = await getProjectRepositorySnapshots([{ owner: "o", name: "a" }]);

    expect(result["o/a"]).toMatchObject({ isLive: false });
  });

  it("falls back for every repo on a network error", async () => {
    fetchMock.mockRejectedValue(new Error("network down"));
    const { getProjectRepositorySnapshots } = await freshModule();

    const result = await getProjectRepositorySnapshots([{ owner: "o", name: "a" }]);

    expect(result["o/a"]).toMatchObject({ isLive: false });
  });

  it("never marks a fallback snapshot as live", async () => {
    fetchMock.mockRejectedValue(new Error("network down"));
    const { getProjectRepositorySnapshots } = await freshModule();

    const result = await getProjectRepositorySnapshots([{ owner: "o", name: "a" }]);

    expect(result["o/a"]?.isLive).toBe(false);
  });
});
