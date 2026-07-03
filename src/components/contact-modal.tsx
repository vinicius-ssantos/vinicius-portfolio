"use client";

import { useState } from "react";
import { Mail, Phone, Linkedin, Github, Copy, Check, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { profile } from "@/lib/portfolio-data";
import { useLanguage } from "@/lib/language-context";

type ContactModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ContactModal({ open, onOpenChange }: ContactModalProps) {
  const { t } = useLanguage();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = async (value: string, field: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 1500);
    } catch {
      // Clipboard API not available; silently fail
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-mono text-lg text-primary">
            {t.contactModal.title}
          </DialogTitle>
          <DialogDescription className="leading-relaxed">
            {t.contactModal.subtitle}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          {/* Email */}
          <ContactRow
            icon={<Mail className="h-4 w-4" />}
            label={t.contactModal.emailLabel}
            value={profile.email}
            onCopy={() => handleCopy(profile.email, "email")}
            copied={copiedField === "email"}
            copiedLabel={t.contactModal.copied}
            copyLabel={t.contactModal.copy}
          />

          {/* Phone */}
          <ContactRow
            icon={<Phone className="h-4 w-4" />}
            label={t.contactModal.phoneLabel}
            value={profile.phone}
            onCopy={() => handleCopy(profile.phone, "phone")}
            copied={copiedField === "phone"}
            copiedLabel={t.contactModal.copied}
            copyLabel={t.contactModal.copy}
          />

          {/* LinkedIn */}
          <ContactRow
            icon={<Linkedin className="h-4 w-4" />}
            label={t.contactModal.linkedinLabel}
            value="linkedin.com/in/vinicius-oliveira-7ba1bb204"
            href={profile.links.linkedin}
            external
          />

          {/* GitHub */}
          <ContactRow
            icon={<Github className="h-4 w-4" />}
            label={t.contactModal.githubLabel}
            value="github.com/vinicius-ssantos"
            href={profile.links.github}
            external
          />
        </div>

        <div className="mt-4 border-t border-border/60 pt-4">
          <p className="mb-2 text-center font-mono text-xs uppercase tracking-wider text-muted-foreground">
            {t.contactModal.orText}
          </p>
          <Button asChild className="w-full">
            <a href={`mailto:${profile.email}?subject=Portfolio%20contact%20—%20Vinicius%20Santos`}>
              <Mail className="mr-2 h-4 w-4" />
              {t.contactModal.openEmailClient}
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
  external,
  onCopy,
  copied,
  copiedLabel,
  copyLabel,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
  onCopy?: () => void;
  copied?: boolean;
  copiedLabel?: string;
  copyLabel?: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-border/60 bg-secondary/30 p-3">
      <div className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="block truncate text-sm font-medium text-foreground hover:text-primary"
          >
            {value}
          </a>
        ) : (
          <div className="truncate text-sm font-medium text-foreground">{value}</div>
        )}
      </div>
      {onCopy && (
        <button
          type="button"
          onClick={onCopy}
          aria-label={copied ? copiedLabel : copyLabel}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-primary" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>
      )}
      {external && (
        <ExternalLink className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
      )}
    </div>
  );
}
