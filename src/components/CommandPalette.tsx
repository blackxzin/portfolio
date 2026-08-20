"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { contacts, sections } from "@/content/profile";
import { caseStudies } from "@/content/projects";

interface Command {
  readonly id: string;
  readonly label: string;
  readonly hint: string;
  readonly run: () => void;
}

const EMAIL = contacts[0].value;

/** Paleta de comandos: Ctrl+K / Cmd+K. Navegação por teclado sem depender do mouse. */
export default function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setCursor(0);
    previousFocus.current?.focus();
  }, []);

  const go = useCallback(
    (href: string) => {
      close();
      router.push(href);
    },
    [close, router]
  );

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard bloqueado (contexto inseguro, permissão negada): abre o cliente de email
      window.location.href = `mailto:${EMAIL}`;
    }
    close();
  }, [close]);

  const commands: readonly Command[] = useMemo(
    () => [
      ...sections.map((section) => ({
        id: `secao-${section.id}`,
        label: section.title,
        hint: "seção",
        run: () => go(`/#${section.id}`),
      })),
      ...caseStudies.map((project) => ({
        id: `projeto-${project.slug}`,
        label: project.name,
        hint: "case study",
        run: () => go(`/projetos/${project.slug}`),
      })),
      {
        id: "curriculo",
        label: "Currículo",
        hint: "página",
        run: () => go("/curriculo"),
      },
      {
        id: "copiar-email",
        label: "Copiar email",
        hint: EMAIL,
        run: () => {
          void copyEmail();
        },
      },
      ...contacts.slice(1).map((contact) => ({
        id: `contato-${contact.label}`,
        label: contact.label,
        hint: contact.value,
        run: () => {
          close();
          window.open(contact.href, "_blank", "noopener,noreferrer");
        },
      })),
    ],
    [close, copyEmail, go]
  );

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return commands;
    return commands.filter(
      (command) =>
        command.label.toLowerCase().includes(term) || command.hint.toLowerCase().includes(term)
    );
  }, [commands, query]);

  useEffect(() => {
    let pendingG = false;
    let pendingGTimer = 0;

    const isTypingTarget = (target: EventTarget | null) =>
      target instanceof HTMLElement &&
      (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);

    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        previousFocus.current = document.activeElement as HTMLElement;
        setOpen((value) => !value);
        return;
      }

      if (open || isTypingTarget(event.target)) return;

      // atalho "g" + letra — no espírito de gmail/github, sem interferir em digitação normal
      if (event.key.toLowerCase() === "g" && !event.ctrlKey && !event.metaKey && !event.altKey) {
        pendingG = true;
        window.clearTimeout(pendingGTimer);
        pendingGTimer = window.setTimeout(() => {
          pendingG = false;
        }, 800);
        return;
      }

      if (!pendingG) return;
      pendingG = false;
      window.clearTimeout(pendingGTimer);

      const destinations: Record<string, string> = {
        p: "/#projetos",
        c: "/#contato",
        s: "/#sobre",
        h: "/#topo",
      };

      const href = destinations[event.key.toLowerCase()];
      if (href) {
        event.preventDefault();
        router.push(href);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(pendingGTimer);
    };
  }, [open, router]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    setCursor(0);
  }, [query]);

  if (!open) {
    return copied ? <CopiedToast /> : <PaletteHint onOpen={() => setOpen(true)} />;
  }

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setCursor((value) => (results.length === 0 ? 0 : (value + 1) % results.length));
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setCursor((value) => (results.length === 0 ? 0 : (value - 1 + results.length) % results.length));
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      results[cursor]?.run();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh]"
      style={{ background: "color-mix(in srgb, var(--ink-sunken) 80%, transparent)" }}
      onClick={close}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Paleta de comandos"
        className="w-full max-w-[540px]"
        style={{ background: "var(--ink-raised)", border: "1px solid var(--line-strong)" }}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className="flex items-center gap-3 px-4 py-3"
          style={{ borderBottom: "1px solid var(--line)" }}
        >
          <span className="label" style={{ color: "var(--signal)" }}>
            $
          </span>
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder="ir para, abrir, copiar…"
            aria-label="Buscar comando"
            className="w-full bg-transparent text-[0.95rem] outline-none"
            style={{ color: "var(--paper)", fontFamily: "var(--font-mono), ui-monospace, monospace" }}
          />
          <kbd className="label hidden sm:block">esc</kbd>
        </div>

        {results.length === 0 ? (
          <p className="label m-0 px-4 py-6">nenhum comando encontrado</p>
        ) : (
          <ul className="m-0 max-h-[46vh] list-none overflow-y-auto p-0">
            {results.map((command, i) => (
              <li key={command.id}>
                <button
                  type="button"
                  onMouseEnter={() => setCursor(i)}
                  onClick={command.run}
                  className="flex w-full items-baseline justify-between gap-4 px-4 py-3 text-left"
                  style={{ background: i === cursor ? "var(--signal-dim)" : "transparent" }}
                >
                  <span className="text-[0.95rem]" style={{ color: "var(--paper)" }}>
                    {command.label}
                  </span>
                  <span className="label truncate">{command.hint}</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        <p
          className="label m-0 flex flex-wrap justify-between gap-2 px-4 py-2"
          style={{ borderTop: "1px solid var(--line)" }}
        >
          <span>↑↓ navegar · ⏎ abrir</span>
          <span>g p / g c / g s / g h — atalhos rápidos</span>
        </p>
      </div>
    </div>
  );
}

function PaletteHint({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="no-print fixed bottom-5 right-5 z-40 hidden px-3 py-2 transition-colors md:block"
      style={{ background: "var(--ink-raised)", border: "1px solid var(--line)" }}
      aria-label="Abrir paleta de comandos"
    >
      <span className="label">ctrl + k</span>
    </button>
  );
}

function CopiedToast() {
  return (
    <div
      className="fixed bottom-5 right-5 z-40 px-3 py-2"
      style={{ background: "var(--ink-raised)", border: "1px solid var(--signal)" }}
      role="status"
    >
      <span className="label" style={{ color: "var(--signal)" }}>
        email copiado ✓
      </span>
    </div>
  );
}
