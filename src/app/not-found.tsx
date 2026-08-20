import Link from "next/link";

export default function NotFound() {
  return (
    <div className="shell flex min-h-[100svh] flex-col justify-center gap-8">
      <div>
        <span className="label" style={{ color: "var(--signal)" }}>
          404
        </span>
        <h1 className="mt-4" style={{ fontSize: "var(--step-title)" }}>
          Essa página não existe.
        </h1>
        <p className="mt-4 max-w-[52ch]" style={{ color: "var(--paper-dim)" }}>
          O link pode estar quebrado ou a página foi movida. Volta pro início.
        </p>
      </div>

      <div className="pt-6" style={{ borderTop: "1px solid var(--line)" }}>
        <Link href="/" className="label link-underline">
          ← Voltar ao site
        </Link>
      </div>
    </div>
  );
}
