export const NAV_SECTION_IDS = ["experience", "stack", "projects", "case-study", "about"] as const;

export type NavSectionId = (typeof NAV_SECTION_IDS)[number];
