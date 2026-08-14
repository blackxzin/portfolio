"use client";

import { useEffect } from "react";

/**
 * Um único observer para a página inteira.
 * Qualquer elemento com [data-reveal] ganha data-inview="true" ao entrar na tela
 * — a transição em si é CSS. Assim as seções continuam Server Components.
 */
export default function RevealObserver() {
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>("[data-reveal]");

    // sem IntersectionObserver (navegador antigo): mostra tudo, não esconde conteúdo
    if (!("IntersectionObserver" in window)) {
      targets.forEach((el) => el.setAttribute("data-inview", "true"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-inview", "true");
          observer.unobserve(entry.target); // revela uma vez só
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
    );

    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return null;
}
