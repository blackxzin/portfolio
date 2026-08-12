"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";

const PANEL_WIDTH = 636;

const SPRING = { type: "spring", duration: 1.4, bounce: 0.38 } as const;

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: "0%", opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
};

const sectionConfigs = [
  { id: "about", title: "Sobre" },
  { id: "skills", title: "Habilidades" },
  { id: "competencies", title: "Competências" },
  { id: "journey", title: "Metas" },
  { id: "projects", title: "Projetos" },
  { id: "contact", title: "Contato" },
] as const;

const langColors: Record<string, string> = {
  Python: "#3572A5",
  JavaScript: "#f7df1e",
  CSS: "#1572b6",
  HTML: "#e34f26",
  Java: "#b07219",
  TypeScript: "#3178c6",
};

const CACHE_KEY = "lg-repos-cache-v1";
const CACHE_TTL = 1000 * 60 * 60; // 1h

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { at: number; repos: Repo[] };
    if (Date.now() - parsed.at > CACHE_TTL) return null;
    return parsed.repos;
  } catch {
    return null;
  }
}

function writeCache(repos: Repo[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), repos }));
  } catch {
    /* quota / disabled storage: ignore */
  }
}

export default function PortfolioPage() {
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => setMounted(true), []);

  const goTo = useCallback((index: number) => {
    setDirection(index > active ? 1 : -1);
    setActive(index);
  }, [active]);

  const next = useCallback(() => goTo((active + 1) % sectionConfigs.length), [active, goTo]);
  const prev = useCallback(() => goTo((active - 1 + sectionConfigs.length) % sectionConfigs.length), [active, goTo]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const threshold = 40;
    if (info.offset.x < -threshold) next();
    else if (info.offset.x > threshold) prev();
  };

  if (!mounted) return <div className="w-screen h-screen bg-[#0a0a0b]" />;

  const current = sectionConfigs[active];

  // tela de apresentação: nome + CTA "entrar" — vira a página 1 do portfolio
  if (!introDone) {
    return (
      <div
        className="relative w-screen h-screen overflow-hidden bg-[#0a0a0b] text-[#f1f1f3] font-sans select-none"
      >
        <div className="absolute inset-0">
          <IntroPoster />
        </div>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-5 px-6 text-center">
          <motion.img
            src="/avatar.png"
            alt="Avatar"
            initial={{ opacity: 0, y: -40, scale: 0.7 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-24 w-24 rounded-full border-2 border-[#7c3aed]/50 shadow-[0_0_60px_rgba(124,58,237,0.35)]"
          />
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: "easeOut" }}
            className="text-5xl font-black tracking-tight md:text-7xl"
          >
            LUCAS <span className="text-[#a78bfa]">GABRIEL</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.55 }}
            className="text-sm font-medium tracking-[0.3em] text-[#a6a7b3] uppercase"
          >
            Desenvolvedor Full Stack · Automação · Eng. de Software
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.85 }}
            onClick={() => setIntroDone(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="pointer-events-auto mt-2 rounded-full bg-[#7c3aed] px-8 py-3 text-sm font-bold text-white shadow-[0_0_40px_rgba(124,58,237,0.5)] transition hover:bg-[#6d28d9]"
          >
            Entrar no portfólio →
          </motion.button>
        </div>
        <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[11px] text-[#5b5c68]">
          Portfólio · Lucas Gabriel
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-screen h-screen overflow-hidden bg-[#0a0a0b] text-[#f1f1f3] font-sans select-none gel"
    >
      {/* fundo: véu translúcido global + embeds sketchfab por seção (visíveis) */}
      <div className="pointer-events-none absolute inset-0 bg-black/60" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#0a0a0b] to-transparent" />
      <div className="pointer-events-none absolute inset-0">
        <SectionBackdrop active={active} />
      </div>

      <AnimatePresence custom={direction} mode="popLayout">
        <motion.section
          key={current.id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={SPRING}
          drag={active === 1 || active === 2 ? false : "x"}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          className={"absolute inset-0 flex items-center justify-center px-6 pt-20 pb-10 md:px-12 md:pt-24" + (active === 1 || active === 2 ? " pointer-events-none" : "")}
        >
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: [0.95, 1.05, 0.98, 1.01, 1] }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            className="max-w-5xl w-full gel"
          >
            {active === 0 && <AboutPanel />}
            {active === 1 && <SkillsPanel />}
            {active === 2 && <CompetenciesPanel />}
            {active === 3 && <JourneyPanel />}
            {active === 4 && <ProjectsPanel />}
            {active === 5 && <ContactPanel />}
          </motion.div>
        </motion.section>
      </AnimatePresence>

      <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-white/5 bg-gradient-to-b from-[#0a0a0b] via-[#0a0a0b]/85 to-transparent px-6 py-4 md:px-12">
        <div className="flex items-center gap-3">
          <img src="/avatar.png" alt="Avatar" className="h-9 w-9 rounded-full border border-white/10 bg-white/5 object-cover" />
          <div className="min-w-0">
            <h2 className="text-xs font-extrabold tracking-widest text-[#f1f1f3]">LUCAS GABRIEL</h2>
          <p className="text-[11px] font-medium text-[#5b5c68]">
            <Typewriter words={["Desenvolvedor Full Stack", "Automação · Docker · n8n", "Eng. de Software", "Integração de APIs"]} />
          </p>
            </div>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#34d399]/30 bg-[#34d399]/10 px-3 py-1 text-[10px] font-semibold text-[#34d399]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#34d399] opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#34d399]" />
            </span>
            Disponível para estágio
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
          {sectionConfigs.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => goTo(idx)}
                            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                idx === active ? "bg-[#7c3aed] text-white shadow-lg" : "text-[#a6a7b3] hover:text-[#a78bfa]"
              }`}
            >
              {item.title}
            </button>
          ))}
        </nav>

        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="md:hidden flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#16161a]/60 text-sm text-[#f1f1f3]"
          aria-label="Menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={prev}
            className="rounded-full border border-white/10 bg-[#16161a]/60 px-4 py-2 text-xs font-semibold text-[#f1f1f3] hover:border-[#7c3aed]/60 hover:text-[#a78bfa] transition glass"
          >
            ← Anterior
          </button>
          <button
            onClick={next}
            className="rounded-full border border-white/10 bg-[#16161a]/60 px-4 py-2 text-xs font-semibold text-[#f1f1f3] hover:border-[#7c3aed]/60 hover:text-[#a78bfa] transition glass"
          >
            Próxima →
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-1/2 top-16 z-50 flex -translate-x-1/2 flex-col items-center gap-1 rounded-2xl border border-white/10 bg-[#16161a]/90 px-3 py-3 backdrop-blur-xl md:hidden"
          >
            {sectionConfigs.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => { goTo(idx); setMenuOpen(false); }}
                className={`w-40 rounded-full px-4 py-2 text-xs font-semibold transition ${
                  idx === active ? "bg-[#7c3aed] text-white" : "text-[#a6a7b3] hover:text-[#a78bfa]"
                }`}
              >
                {item.title}
              </button>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>

      <div className="absolute bottom-20 left-4 z-50 flex flex-col items-center gap-2 md:bottom-5 md:left-8 md:flex-row md:gap-3">
          {[
            { href: "https://github.com/blackxzin", icon: "⌨" },
            { href: "https://www.linkedin.com/in/lucas-gabriel-787b19334/", icon: "💼" },
            { href: "mailto:lucasgabriel4331@gmail.com", icon: "✉" },
          ].map((s) => (
            <a
              key={s.href}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#16161a]/60 text-sm text-[#a6a7b3] transition hover:border-[#7c3aed]/60 hover:text-[#a78bfa]"
              aria-label={s.icon}
            >
              {s.icon}
            </a>
          ))}
        </div>

        <div className="absolute bottom-5 left-0 right-0 z-50 flex items-center justify-center gap-2 px-6">
        {sectionConfigs.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => goTo(idx)}
            aria-label={item.title}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === active ? "w-6 bg-[#7c3aed]" : "w-2 bg-white/20 hover:bg-white/40"
            }`}
          />
        ))}
        <span className="ml-3 text-[11px] font-semibold text-[#5b5c68]">← →</span>
      </div>
    </div>
  );
}

type Repo = {
  language: string;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  readme?: string;
};

function readmeFirstLine(raw: string): string {
  const text = raw
    .split("\n")
    .map((l) => l.replace(/^\s*#+\s*/, "").replace(/^[-*]\s*/, "").trim())
    .filter((l) => l && !/^(!\[|https?:\/\/)/.test(l))
    .find((l) => l.length > 10);
  return text?.slice(0, 140) || "";
}

function PanelShell({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-[#f1f1f3]">
        <span className="text-[#a78bfa]">&gt;</span> {title}
      </h2>
      {subtitle ? <p className="mt-2 text-sm text-[#5b5c68]">{subtitle}</p> : null}
      <div className="mt-8">{children}</div>
    </div>
  );
}

function Typewriter({ words, typingMs = 70, pauseMs = 1600 }: { words: string[]; typingMs?: number; pauseMs?: number }) {
  const [i, setI] = useState(0);
  const [sub, setSub] = useState(0);
  const [del, setDel] = useState(false);

  useEffect(() => {
    const word = words[i % words.length];
    if (!del && sub === word.length) {
      const t = setTimeout(() => setDel(true), pauseMs);
      return () => clearTimeout(t);
    }
    if (del && sub === 0) {
      setDel(false);
      setI((p) => p + 1);
      return;
    }
    const t = setTimeout(() => setSub(sub + (del ? -1 : 1)), del ? 35 : typingMs);
    return () => clearTimeout(t);
  }, [sub, del, i, words, typingMs, pauseMs]);

  return (
    <span className="text-[#a78bfa]">
      {words[i % words.length].slice(0, sub)}
      <span className="animate-pulse">▌</span>
    </span>
  );
}

// embeds sketchfab por seção (pointer-events-none — não bloqueiam o conteúdo)
const SECTION_EMBEDS: Record<string, { url: string; topPct: number; heightPct: number; dim?: number }> = {
  // ui_* zerados + dnt=1: sem VR, ajuda, inspetor, tela cheia, anotações,
  // barra de animação, botão parar/fullscreen — só o 3D girando
  // heightPct/topPct: iframe maior que a tela corta a barra do sketchfab por baixo
  journey: {
    // Rubik's Cube — estilo padrão dos outros
    url: "https://sketchfab.com/models/7472d2f875fc43bd9ddac4a611cd80ce/embed?autospin=1&autostart=1&preload=1&transparent=1&ui_controls=0&ui_infos=0&ui_help=0&ui_inspector=0&ui_settings=0&ui_vr=0&ui_annotations=0&ui_stop=0&ui_fadeout=1&ui_theme=dark&dnt=1",
    topPct: -14,
    heightPct: 128,
  },
  about: {
    // Windows 98 — escurecido pra não roubar atenção dos textos
    url: "https://sketchfab.com/models/5e328170783f46cdac1aa67ee739a1da/embed?autostart=1&preload=1&transparent=1&ui_controls=0&ui_infos=0&ui_help=0&ui_inspector=0&ui_settings=0&ui_vr=0&ui_annotations=0&ui_stop=0&ui_fadeout=1&ui_theme=dark&dnt=1",
    topPct: -14,
    heightPct: 128,
    dim: 0.45,
  },
  projects: {
    // Low poly Retro computer — anotações ciclam sozinhas (annotation_cycle=3), UI limpa
    url: "https://sketchfab.com/models/0393d9b0d3b8499e927a50b31eb38ba9/embed?autostart=1&annotations_visible=0&preload=1&annotation=1&annotation_cycle=3&transparent=1&ui_controls=0&ui_infos=0&ui_help=0&ui_inspector=0&ui_settings=0&ui_vr=0&ui_stop=0&ui_fadeout=1&ui_theme=dark&dnt=1",
    topPct: -14,
    heightPct: 128,
  },
  competencies: {
    // Earth hologram — com filtro escurecedor separado (mais opaco que os demais)
    url: "https://sketchfab.com/models/87072288fb234226b9a3f02ae674a310/embed?autospin=1&autostart=1&preload=1&ui_controls=0&ui_infos=0&ui_help=0&ui_inspector=0&ui_settings=0&ui_vr=0&ui_annotations=0&ui_stop=0&ui_fadeout=1&ui_theme=dark&dnt=1",
    topPct: -14,
    heightPct: 128,
    dim: 0.45,
  },
  contact: {
    url: "https://sketchfab.com/models/eb88f06b4bc342d6bfa99e7608f1d7be/embed?autospin=1&autostart=1&preload=1&transparent=1&ui_controls=0&ui_infos=0&ui_help=0&ui_inspector=0&ui_settings=0&ui_vr=0&ui_annotations=0&ui_stop=0&ui_fadeout=1&ui_theme=dark&dnt=1",
    topPct: -14,
    heightPct: 128,
  },
  skills: {
    url: "https://sketchfab.com/models/aac6cfe455a846cdbe8c88f04ec89820/embed?autospin=1&autostart=1&preload=1&transparent=1&ui_controls=0&ui_infos=0&ui_help=0&ui_inspector=0&ui_settings=0&ui_vr=0&ui_annotations=0&ui_stop=0&ui_fadeout=1&ui_theme=dark&dnt=1",
    topPct: 8,
    heightPct: 100,
  },
};

// fundo da intro: modelo Tentacle (sketchfab, museudocomputador) girando atrás do nome
const INTRO_EMBED =
  "https://sketchfab.com/models/3f288cc3ace24294b628fdd0381ffab3/embed?autospin=1&autostart=1&preload=1&transparent=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_hint=0&ui_help=0&ui_settings=0&ui_vr=0&ui_annotations=0&ui_theme=dark&dnt=1";

function IntroPoster() {
  return (
    <div className="relative h-full w-full" style={{ background: "radial-gradient(ellipse 90% 70% at 50% 42%, #7c3aed20, transparent 70%)" }}>
      <iframe
        src={INTRO_EMBED}
        className="pointer-events-none absolute inset-0 h-full w-full opacity-70"
        allow="autoplay; fullscreen; xr-spatial-tracking"
        allowFullScreen
        title="Day of the Tentacle - Museu do Computador"
      />
    </div>
  );
}

// fundo por seção: embed montado apenas na seção ativa (troca via state)
const hideStyle = { visibility: "hidden" as const };

// heap de visita: seções já vistas ficam montadas (voltar = instantâneo);
// as não vistas sobem só na 1ª visita e pré-baixam a vizinha em silêncio
function visitHeap(): Set<string> {
  if (typeof window === "undefined") return new Set();
  if (!(window as unknown as { __skfHeap?: Set<string> }).__skfHeap) {
    (window as unknown as { __skfHeap: Set<string> }).__skfHeap = new Set();
  }
  return (window as unknown as { __skfHeap: Set<string> }).__skfHeap;
}

function SectionBackdrop({ active }: { active: number }) {
  const id = sectionConfigs[active].id;
  const mountedRef = useRef<Set<string>>(null as unknown as Set<string>);
  if (!mountedRef.current) mountedRef.current = visitHeap();

  // estado derivado: re-render quando monta algo novo
  const [mounted, setMounted] = useState<Set<string>>(() => mountedRef.current);

  useEffect(() => {
    const heap = mountedRef.current;
    if (!heap.has(id)) {
      heap.add(id);
      setMounted(heap);
    } else {
      // id já estava no heap: força re-render mesmo assim (voltar à seção)
      setMounted(heap);
    }
    // pré-baixa o vizinho (próximo na rota do slide)
    const idx = sectionConfigs.findIndex((s) => s.id === id);
    const nextId = sectionConfigs[(idx + 1) % sectionConfigs.length].id;
    if (SECTION_EMBEDS[nextId] && !heap.has(nextId)) {
      heap.add(nextId);
      setMounted(heap);
    }
  }, [id]);

  const order = useMemo(() => Object.keys(SECTION_EMBEDS), []);

  return (
    <>
      {/* embeds já visitados ficam montados (carregam 1x); alterna por opacidade —
          voltar pra uma seção é instantâneo, nenhuma recarga de sketchfab */}
      {order.map((secId) => {
        if (!mounted.has(secId)) return null;
        const conf = SECTION_EMBEDS[secId];
        return (
          <div
            key={secId}
            className={`absolute inset-0 overflow-hidden transition-opacity duration-500 ${
              secId === id ? "opacity-100" : "opacity-0"
            }`}
            style={secId === id ? undefined : hideStyle}
          >
            {/* tamanho > 100% corta a barra de controles do sketchfab pra fora da tela;
                transparent=1 deixa o fundo da página aparecer nas bordas */}
            <iframe
              key={secId}
              src={conf.url}
              className="pointer-events-none absolute left-0 w-full"
              style={{
                top: `${conf.topPct}%`,
                height: `${conf.heightPct}%`,
                opacity: conf.dim ?? 0.6,
              }}
              allow="autoplay; fullscreen; xr-spatial-tracking"
              allowFullScreen
              title={`Fundo ${secId}`}
            />
            {/* escurece mais quando a seção pede (destaque pros textos) */}
            {conf.dim ? (
              <div className="pointer-events-none absolute inset-0" style={{ background: "rgba(10,10,11,0.35)" }} />
            ) : null}
          </div>
        );
      })}
    </>
  );
}

function AboutPanel() {
  return (
    <PanelShell title="Sobre mim" subtitle="Conheça mais sobre minha trajetória">
      <FadeIn index={0} className="rounded-2xl border border-white/5 bg-[#16161a] p-6 md:p-8 glass">
        <p className="text-[15px] leading-relaxed text-[#a6a7b3]">
          Olá, eu sou <strong className="text-[#f1f1f3]">Lucas Gabriel</strong>, estudante de{" "}
          <strong className="text-[#f1f1f3]">Análise e Desenvolvimento de Sistemas</strong> (ADS) na UniCesumar,
          com foco em <strong className="text-[#f1f1f3]">Engenharia de Software</strong> e automação de processos.
        </p>
        <p className="mt-4 text-[15px] leading-relaxed text-[#a6a7b3]">
          Atualmente desenvolvo projetos práticos de <strong className="text-[#f1f1f3]">lógica de programação, arquitetura de software,
          integração de APIs, containerização (Docker) e automação com n8n</strong> — sempre aplicando boas práticas usadas no mercado.
        </p>
        <p className="mt-4 text-[15px] leading-relaxed text-[#a6a7b3]">
          Tenho facilidade de aprender, comprometimento com <strong className="text-[#f1f1f3]">código limpo</strong> e interesse genuíno em
          <strong className="text-[#f1f1f3]"> automação e integração entre sistemas</strong>.
        </p>
      </FadeIn>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {[
          { label: "🎓 Formação", value: "ADS · UniCesumar" },
          { label: "💻 Foco", value: "Eng. de Software · Automação" },
          { label: "🎯 Buscando", value: "1ª oportunidade em TI (estágio)" },
          { label: "📍 Localização", value: "Brasil" },
        ].map((item, idx) => (
          <FadeIn key={item.label} index={idx + 1} className="rounded-2xl border border-white/5 bg-[#16161a] p-5 transition hover:bg-[#1c1c21] hover:border-white/10 glass">
            <div className="text-[11px] font-semibold uppercase tracking-widest text-[#a78bfa]">{item.label}</div>
            <div className="mt-1 text-sm font-medium text-[#f1f1f3]">{item.value}</div>
          </FadeIn>
        ))}
      </div>

      <FadeIn index={5} className="mt-6 rounded-2xl border border-white/5 bg-[#16161a] p-6 md:p-8 glass">
        <h3 className="text-base font-semibold text-[#f1f1f3]">
          <span className="text-[#a78bfa]">&gt;</span> Objetivo Profissional
        </h3>
        <p className="mt-3 text-[15px] leading-relaxed text-[#a6a7b3]">
          Busco minha <strong className="text-[#f1f1f3]">primeira oportunidade de estágio em TI</strong> para aplicar na prática
          o que aprendo em teoria, evoluir profissionalmente e contribuir com soluções de qualidade para um time real.
        </p>
      </FadeIn>
    </PanelShell>
  );
}

const skillLevels: Record<string, 1 | 2 | 3 | 4 | 5> = {
  Java: 4,
  Python: 4,
  JavaScript: 3,
  TypeScript: 3,
  HTML5: 5,
  CSS3: 4,
  SQL: 3,
  Git: 3,
  GitHub: 3,
  "Lógica de Programação": 5,
  "Desenvolvimento Web": 4,
  "Banco de Dados": 3,
  "Automação": 4,
  "APIs REST": 4,
};

const levelLabels: Record<number, string> = {
  1: "Exemplo",
  2: "Básico",
  3: "Intermediário",
  4: "Bom",
  5: "Avançado",
};

function SkillsPanel() {
  return (
    <PanelShell title="Habilidades Técnicas" subtitle="Tecnologias e linguagens que utilizo">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[
          { name: "Java", color: "#f89820" },
          { name: "Python", color: "#3572A5" },
          { name: "JavaScript", color: "#f7df1e" },
          { name: "TypeScript", color: "#3178c6" },
          { name: "HTML5", color: "#e34f26" },
          { name: "CSS3", color: "#1572b6" },
          { name: "SQL", color: "#7c3aed" },
          { name: "Git", color: "#f05032" },
          { name: "GitHub", color: "#181717" },
          { name: "Lógica de Programação", color: "#34d399" },
          { name: "Desenvolvimento Web", color: "#a78bfa" },
          { name: "Banco de Dados", color: "#336791" },
          { name: "Automação", color: "#f97316" },
          { name: "APIs REST", color: "#22d3ee" },
        ].map((skill, idx) => {
          const level = skillLevels[skill.name] ?? 3;
          return (
            <FadeIn
              key={skill.name}
              index={idx}
              className="group rounded-2xl border border-white/5 bg-[#16161a] p-4 transition hover:bg-[#1c1c21] hover:border-white/10 glass"
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#f1f1f3] transition group-hover:text-[#a78bfa]"
                  style={{ color: "inherit" }}
                >
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: skill.color, boxShadow: `0 0 8px ${skill.color}` }} />
                  {skill.name}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#5b5c68]">
                  {levelLabels[level]}
                </span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${level * 20}%` }}
                  transition={{ delay: 0.2 + idx * 0.05, duration: 0.8, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${skill.color}99, ${skill.color})`, boxShadow: `0 0 12px ${skill.color}66` }}
                />
              </div>
            </FadeIn>
          );
        })}
      </div>
    </PanelShell>
  );
}

function CompetenciesPanel() {
  return (
    <PanelShell title="Competências" subtitle="Capacidades desenvolvidas">
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[
          { icon: "🚀", title: "Desenvolvimento Web", desc: "Criação de aplicações web modernas e responsivas" },
          { icon: "🧠", title: "Lógica de Programação", desc: "Resolução de problemas complexos com algoritmos eficientes" },
          { icon: "🐍", title: "Python", desc: "Desenvolvimento de scripts e automações" },
          { icon: "☕", title: "Java", desc: "Programação orientada a objetos e aplicações robustas" },
          { icon: "🗄️", title: "Banco de Dados", desc: "Modelagem e consultas SQL para gestão de dados" },
          { icon: "🐳", title: "Docker", desc: "Conteinerização de aplicações para ambientes consistentes e portáteis" },
          { icon: "🔁", title: "n8n", desc: "Automação de fluxos de trabalho conectando serviços e APIs" },
          { icon: "🤖", title: "LLMs / IA", desc: "Integração de modelos de linguagem para automações e agentes inteligentes" },
          { icon: "📚", title: "Aprendizado Rápido", desc: "Facilidade em aprender novas tecnologias e frameworks" },
        ].map((item, idx) => (
          <FadeIn
            key={item.title}
            index={idx}
            className="group rounded-2xl border border-white/5 bg-[#16161a] p-6 transition hover:bg-[#1c1c21] hover:border-white/10 glass"
          >
            <div className="mb-4 text-3xl">{item.icon}</div>
            <h3 className="text-sm font-semibold text-[#f1f1f3] transition group-hover:text-[#a78bfa]">{item.title}</h3>
            <p className="mt-1 text-[13px] leading-relaxed text-[#a6a7b3]">{item.desc}</p>
          </FadeIn>
        ))}
      </div>
    </PanelShell>
  );
}

function JourneyPanel() {
  const stages = [
    {
      id: "estagio",
      title: "Estágio — meu primeiro passo",
      badge: "Agora",
      accent: "#BFE3FF",
      desc: "Estou terminando minha graduação em ADS e buscando o primeiro estágio na área. Quero aplicar o que estudo na prática: acompanhar tarefas, corrigir bugs, entender o fluxo de código, participar de dailies e evoluir todo dia.",
    },
    {
      id: "junior",
      title: "Desenvolvedor Júnior",
      tag: "Próximo passo",
      acronym: "Júnior",
      desc: "Na sequência, quero entregar features pontuais com apoio, fazer testes, revisar PRs pequenos e crescer com code review e atendimento de chamados.",
    },
    {
      id: "pleno",
      title: "Desenvolvedor Pleno / Sênior",
      tag: "Meta de longo prazo",
      accent: "#E3C6FF",
      desc: "A expectativa é liderar entregas, definir soluções técnicas, antecipar riscos e mentorar colegas, cuidando da qualidade sem perder velocidade.",
    },
  ];

  return (
    <PanelShell title="Metas de Carreira" subtitle="Onde quero chegar — evolução que pretendo trilhar na área">
      <div className="flex flex-col gap-4">
        {stages.map((stage, idx) => (
          <FadeIn
            key={stage.id}
            index={idx}
            className="rounded-2xl border border-white/5 bg-[#16161a] p-5 transition hover:border-white/10 glass"
            style={{ borderLeft: `3px solid ${stage.accent}` }}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-[#f1f1f3]">{stage.title}</h3>
              <span className="rounded-full border border-white/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-[#a78bfa]">
                {stage.badge}
              </span>
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-[#a6a7b3]">{stage.desc}</p>
          </FadeIn>
        ))}
      </div>
    </PanelShell>
  );
}

function ProjectsPanel() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = true;
  const [repos, setRepos] = useState<Repo[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [lang, setLang] = useState("all");

  const languages = useMemo(
    () => Array.from(new Set((repos ?? []).map((r) => r.language).filter(Boolean))) as string[],
    [repos]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (repos ?? []).filter(
      (r) => (lang === "all" || r.language === lang) && (!q || (r.name + " " + (r.description || "")).toLowerCase().includes(q))
    );
  }, [repos, query, lang]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      const cached = readCache();
      if (cached) {
        setRepos(cached);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("https://api.github.com/users/blackxzin/repos?sort=updated&per_page=10");
        const data = (await res.json()) as Repo[];

        // Busca descrição do README para repos sem description na API
        const withReadme = await Promise.all(
          data.map(async (repo) => {
            if (repo.description) return repo;
            try {
              const r = await fetch(`https://api.github.com/repos/blackxzin/${repo.name}/readme`, {
                headers: { Accept: "application/vnd.github.raw+json" },
              });
              if (!r.ok) return repo;
              const line = readmeFirstLine(await r.text());
              return line ? { ...repo, readme: line } : repo;
            } catch {
              return repo;
            }
          })
        );

        if (!cancelled) {
          setRepos(withReadme);
          writeCache(withReadme);
        }
      } catch {
        if (!cancelled) setError("Erro ao carregar projetos.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <PanelShell title="Projetos" subtitle="Repositorios do GitHub">
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#5b5c68]">🔍</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar projeto..."
            className="w-full rounded-full border border-white/10 bg-[#16161a] py-2 pl-8 pr-3 text-xs text-[#f1f1f3] outline-none transition placeholder:text-[#5b5c68] focus:border-[#7c3aed]/60"
          />
        </div>
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          className="rounded-full border border-white/10 bg-[#16161a] px-3 py-2 text-xs text-[#f1f1f3] outline-none transition focus:border-[#7c3aed]/60"
        >
          <option value="all">Todas linguagens</option>
          {languages.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>

      <div className="project-scroll mt-4 grid max-h-[50vh] grid-cols-1 content-start gap-4 overflow-y-auto pr-1 md:max-h-[54vh] md:grid-cols-2">
        {loading && Array.from({ length: 4 }).map((_, idx) => <Skeleton key={idx} />)}

        {!loading && repos?.length === 0 && (
          <p className="col-span-full text-sm text-[#5b5c68]">Nenhum repositório encontrado.</p>
        )}

        {error && (
          <p className="col-span-full text-sm text-[#5b5c68]">
            {error}{" "}
            <a href="https://github.com/blackxzin?tab=repositories" target="_blank" rel="noopener noreferrer" className="text-[#a78bfa] underline">
              Ver no GitHub ↗
            </a>
          </p>
        )}

        {filtered.length === 0 && !loading && !error && (
          <p className="col-span-full text-sm text-[#5b5c68]">Nenhum projeto encontrado.</p>
        )}

        {filtered.map((repo, idx) => (
          <FadeIn
            key={repo.name}
            index={idx}
            className="group rounded-2xl border border-white/5 bg-[#16161a] p-5 transition hover:bg-[#1c1c21] hover:border-white/10 glass"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-semibold text-[#f1f1f3] transition group-hover:text-[#a78bfa]">{repo.name}</h3>
              <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#5b5c68] transition hover:text-[#a78bfa]">
                Repo ↗
              </a>
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-[#a6a7b3]">{repo.description || repo.readme || "Sem descrição ainda."}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] text-[#5b5c68]">
              {repo.language ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: langColors[repo.language] || "#666" }} />
                  {repo.language}
                </span>
              ) : null}
              {repo.stargazers_count > 0 ? <span>⭐ {repo.stargazers_count}</span> : null}
              {repo.forks_count > 0 ? <span>🍴 {repo.forks_count}</span> : null}
              <span>Atualizado: {new Date(repo.updated_at).toLocaleDateString("pt-BR")}</span>
            </div>
          </FadeIn>
        ))}
      </div>
    </PanelShell>
  );
}

function ContactPanel() {
  return (
    <PanelShell title="Contato" subtitle="Vamos conversar? Estou aberto a oportunidades de estágio">
      <FadeIn index={0} className="rounded-2xl border border-[#7c3aed]/30 bg-gradient-to-r from-[#7c3aed]/15 to-[#34d399]/10 p-6 glass">
        <p className="text-[15px] leading-relaxed text-[#f1f1f3]">
          Busco <strong>estágio em Desenvolvimento de Software, Back-end, Análise de Sistemas, Automação de Processos ou Suporte Técnico</strong>.
          Se você procura alguém dedicado para crescer junto com o time, vamos conversar!
        </p>
        <a
          href="https://wa.me/5514996112048"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#7c3aed] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6d28d9]"
        >
          💬 Chamar no WhatsApp
        </a>
      </FadeIn>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        {[
          { label: "Email", value: "lucasgabriel4331@gmail.com", href: "mailto:lucasgabriel4331@gmail.com", icon: "✉" },
          { label: "WhatsApp", value: "(14) 99611-2048", href: "https://wa.me/5514996112048", icon: "💬" },
          { label: "GitHub", value: "github.com/blackxzin", href: "https://github.com/blackxzin", icon: "⌨" },
          { label: "LinkedIn", value: "Lucas Gabriel", href: "https://www.linkedin.com/in/lucas-gabriel-787b19334/", icon: "💼" },
        ].map((contact, idx) => (
          <FadeIn
            key={contact.label}
            index={idx}
            role="link"
            tabIndex={0}
            onClick={() => window.open(contact.href, contact.href.startsWith("http") ? "_blank" : "_self")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                window.open(contact.href, contact.href.startsWith("http") ? "_blank" : "_self");
              }
            }}
            className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-white/5 bg-[#16161a] p-5 transition hover:bg-[#1c1c21] hover:border-white/10 glass"
          >
            <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-white/5 bg-[#0a0a0b] text-lg">
              {contact.icon}
            </span>
            <div>
              <div className="text-[11px] uppercase tracking-widest text-[#5b5c68]">{contact.label}</div>
              <div className="mt-0.5 text-sm font-medium text-[#f1f1f3] transition group-hover:text-[#a78bfa]">{contact.value}</div>
            </div>
          </FadeIn>
        ))}
      </div>
    </PanelShell>
  );
}

function FadeIn({
  children,
  index = 0,
  className = "",
  onClick,
  onKeyDown,
  role,
  tabIndex,
  style,
}: {
  children: React.ReactNode;
  index?: number;
  className?: string;
  onClick?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  role?: string;
  tabIndex?: number;
  style?: React.CSSProperties;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
      onClick={onClick}
      onKeyDown={onKeyDown}
      role={role}
      tabIndex={tabIndex}
      style={style}
    >
      {children}
    </motion.div>
  );
}

function Skeleton() {
  return <div className="h-40 animate-pulse rounded-2xl border border-white/5 bg-[#16161a]" />;
}
