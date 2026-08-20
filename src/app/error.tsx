"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="shell flex min-h-[100svh] flex-col justify-center gap-8">
      <div>
        <span className="label" style={{ color: "var(--signal)" }}>
          Erro
        </span>
        <h1 className="mt-4" style={{ fontSize: "var(--step-title)" }}>
          Algo quebrou.
        </h1>
        <p className="mt-4 max-w-[52ch]" style={{ color: "var(--paper-dim)" }}>
          Não foi possível carregar essa página agora.
        </p>
      </div>

      <div className="pt-6" style={{ borderTop: "1px solid var(--line)" }}>
        <button type="button" onClick={reset} className="label link-underline">
          Tentar de novo ↻
        </button>
      </div>
    </div>
  );
}
