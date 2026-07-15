// Shared env var manifest for check-env.mjs and sync-env-example.mjs.
// Every var used by the app should be listed here with its fallback behavior.
export const ENV_VARS = [
  {
    name: "GITHUB_TOKEN",
    required: false,
    note: "GitHub stats will fall back to hardcoded values",
  },
  {
    name: "VERCEL_TOKEN",
    required: false,
    note: "only needed for `npm run deploy` / `npm run deploy:prod`",
  },
  {
    name: "NEXT_PUBLIC_SITE_URL",
    required: false,
    note: "defaults to the Vercel preview URL — set it in production for correct canonical URLs",
  },
  {
    name: "RESEND_API_KEY",
    required: false,
    note: "the contact form will return 503 and direct users to email directly",
  },
  {
    name: "RESEND_FROM_EMAIL",
    required: false,
    note: "defaults to the onboarding@resend.dev sandbox sender — set to a verified domain address in production",
  },
];
