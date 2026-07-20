"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { Send, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useTurnstile } from "@/hooks/use-turnstile";
import { trackEvent } from "@/lib/analytics";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

export function ContactForm() {
  const t = useTranslations("contactModal");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  // Captured once, at the render where the form first becomes interactive —
  // the server rejects submissions that arrive faster than a human could
  // plausibly fill the form.
  const [renderedAt] = useState(() => Date.now());
  const { toast } = useToast();
  const { resolvedTheme } = useTheme();
  const {
    containerRef: turnstileRef,
    token: turnstileToken,
    reset: resetTurnstile,
  } = useTurnstile(TURNSTILE_SITE_KEY, resolvedTheme === "dark" ? "dark" : "light");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!turnstileToken) return;
    setSending(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
      website: formData.get("website"), // honeypot — must stay empty
      renderedAt,
      turnstileToken,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSent(true);
        // No name/email/message here — a confirmation that a send
        // succeeded, nothing about who sent it or what it said.
        trackEvent("contact_form_success");
        toast({ title: t("formSuccess") });
      } else {
        // Turnstile tokens are single-use — get a fresh one for the retry,
        // regardless of which check actually rejected the submission.
        resetTurnstile();
        if (res.status === 429) {
          toast({ title: t("formRateLimited"), variant: "destructive" });
        } else {
          toast({ title: t("formError"), variant: "destructive" });
        }
      }
    } catch {
      resetTurnstile();
      toast({ title: t("formError"), variant: "destructive" });
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 p-6 text-center">
        <CheckCircle2 className="h-8 w-8 text-primary" />
        <p className="text-sm text-foreground">{t("formSuccess")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Honeypot — invisible and out of the accessibility tree, so real
          visitors (including screen reader users) never see or fill it.
          Bots that blindly fill every field trip the server-side check. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
        <label htmlFor="cf-website">Website</label>
        <input id="cf-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div>
        <label htmlFor="cf-name" className="sr-only">
          {t("formName")}
        </label>
        <input
          id="cf-name"
          name="name"
          type="text"
          required
          maxLength={100}
          placeholder={t("formName")}
          className="w-full rounded-md border border-border/60 bg-secondary/30 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/30"
        />
      </div>
      <div>
        <label htmlFor="cf-email" className="sr-only">
          {t("formEmail")}
        </label>
        <input
          id="cf-email"
          name="email"
          type="email"
          required
          maxLength={200}
          placeholder={t("formEmail")}
          className="w-full rounded-md border border-border/60 bg-secondary/30 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/30"
        />
      </div>
      <div>
        <label htmlFor="cf-message" className="sr-only">
          {t("formMessage")}
        </label>
        <textarea
          id="cf-message"
          name="message"
          required
          maxLength={5000}
          rows={4}
          placeholder={t("formMessage")}
          className="w-full resize-none rounded-md border border-border/60 bg-secondary/30 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/30"
        />
      </div>
      {TURNSTILE_SITE_KEY && (
        <div role="group" aria-label={t("formChallenge")} ref={turnstileRef} />
      )}
      <Button
        type="submit"
        disabled={sending || (Boolean(TURNSTILE_SITE_KEY) && !turnstileToken)}
        className="w-full"
      >
        {sending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t("formSending")}
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            {t("formSend")}
          </>
        )}
      </Button>
    </form>
  );
}
