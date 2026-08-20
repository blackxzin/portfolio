"use client";

import { useEffect, useState } from "react";

const CHAR_MS = 55;

interface TypeLineProps {
  prompt: string;
  command: string;
  className?: string;
}

/** Linha de terminal: o prompt aparece pronto, o comando é digitado. */
export default function TypeLine({ prompt, command, className }: TypeLineProps) {
  const [typed, setTyped] = useState("");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTyped(command);
      return;
    }

    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setTyped(command.slice(0, i));
      if (i >= command.length) window.clearInterval(id);
    }, CHAR_MS);

    return () => window.clearInterval(id);
  }, [command]);

  return (
    <span className={className}>
      <span style={{ color: "var(--signal)" }}>{prompt}</span> {typed}
      <span className="caret" aria-hidden="true" />
    </span>
  );
}
