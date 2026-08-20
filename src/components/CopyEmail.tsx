"use client";

import { useState } from "react";

const FEEDBACK_MS = 2000;

interface CopyEmailProps {
  email: string;
}

/** Copia o email e confirma na hora. Falhou o clipboard, cai no mailto. */
export default function CopyEmail({ email }: CopyEmailProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), FEEDBACK_MS);
    } catch {
      // clipboard indisponível (contexto inseguro ou permissão negada)
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="label link-underline"
      style={{ color: copied ? "var(--signal)" : undefined }}
    >
      {copied ? "copiado ✓" : "copiar"}
    </button>
  );
}
