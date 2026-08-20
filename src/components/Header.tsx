"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { profile, sections } from "@/content/profile";

const SPY_OFFSET = 0.35; // fração da altura da janela usada como linha de leitura

export default function Header() {
  const [activeId, setActiveId] = useState<string>(sections[0].id);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let pending = false;

    const read = () => {
      pending = false;
      setScrolled(window.scrollY > 24);

      const line = window.innerHeight * SPY_OFFSET;
      let current = sections[0].id;

      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el && el.getBoundingClientRect().top <= line) current = section.id;
      }

      setActiveId(current);
    };

    const onScroll = () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(read);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    read();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-colors duration-300"
      style={{
        background: scrolled ? "color-mix(in srgb, var(--ink) 88%, transparent)" : "transparent",
        borderBottom: `1px solid ${scrolled ? "var(--line)" : "transparent"}`,
        backdropFilter: scrolled ? "blur(10px)" : "none",
      }}
    >
      <div className="shell flex h-16 items-center justify-between gap-6">
        <a href="#topo" className="label !text-[color:var(--paper)] !tracking-[0.22em]">
          {profile.name.split(" ")[0]}
          <span style={{ color: "var(--signal)" }}>.</span>
        </a>

        <nav aria-label="Seções" className="hidden md:flex items-center gap-1">
          {sections.map((section) => {
            const isActive = section.id === activeId;
            return (
              <a
                key={section.id}
                href={`#${section.id}`}
                aria-current={isActive ? "true" : undefined}
                className="label nav-link px-3 py-2 transition-colors"
                style={{ color: isActive ? "var(--paper)" : undefined }}
              >
                <span style={{ color: isActive ? "var(--signal)" : "var(--paper-faint)" }}>
                  {section.index}
                </span>{" "}
                {section.title}
              </a>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-6">
          <Link href="/curriculo" className="label link-underline">
            Currículo
          </Link>
          <span className="label flex items-center gap-2" style={{ color: "var(--signal)" }}>
            <span className="status-dot" aria-hidden="true" />
            {profile.status}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="menu-mobile"
          className="label md:hidden px-3 py-2"
          style={{ color: "var(--paper)" }}
        >
          {menuOpen ? "Fechar" : "Menu"}
        </button>
      </div>

      {menuOpen ? (
        <nav
          id="menu-mobile"
          aria-label="Seções"
          className="md:hidden"
          style={{ borderTop: "1px solid var(--line)", background: "var(--ink)" }}
        >
          <div className="shell flex flex-col py-2">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={() => setMenuOpen(false)}
                className="label py-3"
                style={{ color: section.id === activeId ? "var(--paper)" : undefined }}
              >
                <span style={{ color: "var(--signal)" }}>{section.index}</span> {section.title}
              </a>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
