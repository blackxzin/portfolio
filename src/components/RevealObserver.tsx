"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Um único observer, reaplicado a cada troca de rota.
 * Qualquer elemento com [data-reveal] ganha data-inview="true" ao entrar na tela
 * — a transição em si é CSS. Assim as seções continuam Server Components.
 *
 * Este componente mora no layout raiz e não remonta entre páginas — navegação
 * client-side (Link/router.push) troca o conteúdo mas mantém o mesmo efeito
 * vivo. Sem o pathname como dependência, o observer nunca veria os elementos
 * da página seguinte e eles ficariam presos em opacity:0.
 */
export default function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-inview])");

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
  }, [pathname]);

  return null;
}
