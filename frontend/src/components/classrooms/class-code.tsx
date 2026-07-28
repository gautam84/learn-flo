"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClassCodeProps {
  code: string;
  className?: string;
}

/**
 * Shows a classroom's join code with a copy button. Safe to render inside a <Link>:
 * the copy click is stopped before it reaches the parent.
 */
export function ClassCode({ code, className }: ClassCodeProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {
      // Clipboard can be blocked (insecure origin, denied permission) - the code is
      // on screen either way, so there is nothing useful to say here.
    }
  };

  return (
    <span className={cn("inline-flex items-center gap-2 text-sm", className)}>
      <span className="text-muted-foreground">Class code</span>
      <code className="rounded bg-muted px-2 py-1 font-mono tracking-widest">{code}</code>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "Class code copied" : "Copy class code"}
        className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        {copied ? (
          <Check className="size-4 text-green-600" />
        ) : (
          <Copy className="size-4" />
        )}
      </button>
      {copied && <span className="text-xs text-muted-foreground">Copied</span>}
    </span>
  );
}
