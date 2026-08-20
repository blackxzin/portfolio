"use client";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="label link-underline"
      style={{ color: "var(--signal)" }}
    >
      Baixar / imprimir PDF ↓
    </button>
  );
}
