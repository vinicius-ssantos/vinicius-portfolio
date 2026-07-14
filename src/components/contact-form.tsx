"use client";

import { useState } from "react";
import { Send, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { translations } from "@/lib/translations";

type T = typeof translations.en;

export function ContactForm({ t }: { t: T }) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSent(true);
        toast({ title: t.contactModal.formSuccess });
      } else {
        toast({ title: t.contactModal.formError, variant: "destructive" });
      }
    } catch {
      toast({ title: t.contactModal.formError, variant: "destructive" });
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 p-6 text-center">
        <CheckCircle2 className="h-8 w-8 text-primary" />
        <p className="text-sm text-foreground">{t.contactModal.formSuccess}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label htmlFor="cf-name" className="sr-only">
          {t.contactModal.formName}
        </label>
        <input
          id="cf-name"
          name="name"
          type="text"
          required
          maxLength={100}
          placeholder={t.contactModal.formName}
          className="w-full rounded-md border border-border/60 bg-secondary/30 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/30"
        />
      </div>
      <div>
        <label htmlFor="cf-email" className="sr-only">
          {t.contactModal.formEmail}
        </label>
        <input
          id="cf-email"
          name="email"
          type="email"
          required
          maxLength={200}
          placeholder={t.contactModal.formEmail}
          className="w-full rounded-md border border-border/60 bg-secondary/30 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/30"
        />
      </div>
      <div>
        <label htmlFor="cf-message" className="sr-only">
          {t.contactModal.formMessage}
        </label>
        <textarea
          id="cf-message"
          name="message"
          required
          maxLength={5000}
          rows={4}
          placeholder={t.contactModal.formMessage}
          className="w-full resize-none rounded-md border border-border/60 bg-secondary/30 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/30"
        />
      </div>
      <Button type="submit" disabled={sending} className="w-full">
        {sending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t.contactModal.formSending}
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            {t.contactModal.formSend}
          </>
        )}
      </Button>
    </form>
  );
}
