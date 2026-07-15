"use client";

import { Github, Linkedin, Mail } from "lucide-react";
import { profile } from "@/content";
import type { Translation } from "@/lib/translations";

export function SiteFooter({ t, onContactOpen }: { t: Translation; onContactOpen: () => void }) {
  return (
    <footer className="mt-auto border-t border-border/60">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm sm:flex-row sm:px-6">
        <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground text-[10px] font-bold">
            VS
          </span>
          <span>
            © {new Date().getFullYear()} {profile.name}. {t.footer.builtWith}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onContactOpen}
            aria-label="E-mail"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Mail className="h-4 w-4" />
          </button>
          <a
            href={profile.links.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Github className="h-4 w-4" />
          </a>
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Linkedin className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
