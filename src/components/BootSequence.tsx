"use client";

import { useEffect, useState } from "react";
import { profile } from "@/content/profile";

const STORAGE_KEY = "boot-seen";
const LINE_MS = 140;
const HOLD_MS = 450;
const FADE_MS = 400;

const LINES = [
  "iniciando sessão…",
  `usuário: ${profile.handle}`,
  "carregando seções… ok",
  "verificando integridade… ok",
  `status: ${profile.status.toLowerCase()}`,
] as const;

type Phase = "skip" | "typing" | "hold" | "fading" | "done";

/** Abertura única por sessão — decorativa, nunca atrasa conteúdo real. */
export default function BootSequence() {
  const [phase, setPhase] = useState<Phase>("typing");
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = window.sessionStorage.getItem(STORAGE_KEY);

    if (reduced || seen) {
      setPhase("skip");
      return;
    }

    window.sessionStorage.setItem(STORAGE_KEY, "1");

    const timers: number[] = [];
    LINES.forEach((_, i) => {
      timers.push(window.setTimeout(() => setVisibleLines(i + 1), i * LINE_MS));
    });

    timers.push(
      window.setTimeout(() => setPhase("hold"), LINES.length * LINE_MS + HOLD_MS)
    );
    timers.push(
      window.setTimeout(
        () => setPhase("fading"),
        LINES.length * LINE_MS + HOLD_MS + 50
      )
    );
    timers.push(
      window.setTimeout(
        () => setPhase("done"),
        LINES.length * LINE_MS + HOLD_MS + 50 + FADE_MS
      )
    );

    return () => timers.forEach((id) => window.clearTimeout(id));
  }, []);

  if (phase === "skip" || phase === "done") return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[200] flex items-center justify-center px-6"
      style={{
        background: "var(--ink)",
        opacity: phase === "fading" ? 0 : 1,
        transition: `opacity ${FADE_MS}ms var(--ease)`,
        pointerEvents: phase === "fading" ? "none" : "auto",
      }}
    >
      <pre
        className="m-0 text-[0.85rem] leading-relaxed"
        style={{ color: "var(--paper-dim)", fontFamily: "var(--font-mono), ui-monospace, monospace" }}
      >
        {LINES.slice(0, visibleLines).map((line, i) => (
          <span key={line} className="block">
            <span style={{ color: "var(--signal)" }}>›</span> {line}
            {i === visibleLines - 1 ? <span className="caret" /> : null}
          </span>
        ))}
      </pre>
    </div>
  );
}
