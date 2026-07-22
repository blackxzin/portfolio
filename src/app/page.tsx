"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

export default function PortfolioPage() {
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);

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

  return (
    <div
      ref={containerRef}
      className="relative w-screen h-screen overflow-hidden bg-[#0a0a0b] text-[#f1f1f3] font-sans select-none gel"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 left-1/2 h-[720px] w-[720px] -translate-x-1/2 rounded-full bg-[#7c3aed]/[0.08] blur-[140px]" />
        <div className="absolute top-[20%] -left-48 h-[420px] w-[420px] rounded-full bg-[#34d399]/[0.05] blur-[110px]" />

        <FloatingIcon src="/icon-browser.png" x={86} y={14} rotation={-12} size={110} />
        <FloatingIcon src="/icon-gear.png" x={8} y={72} rotation={18} size={95} />
        <FloatingIcon src="/icon-db.png" x={78} y={32} rotation={-10} size={100} />
        <FloatingIcon src="/icon-terminal.png" x={16} y={26} rotation={14} size={90} />
        <FloatingIcon src="/icon-key.png" x={84} y={78} rotation={-16} size={85} />
        <FloatingIcon src="/icon-component.png" x={18} y={78} rotation={8} size={90} />
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
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          className="absolute inset-0 flex items-center justify-center px-6 md:px-12"
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
            {active === 3 && <ProjectsPanel />}
            {active === 4 && <ContactPanel />}
          </motion.div>
        </motion.section>
      </AnimatePresence>

      <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 md:px-12">
        <div className="flex items-center gap-3">
          <img src="/avatar.png" alt="Avatar" className="h-9 w-9 rounded-full border border-white/10 bg-white/5 object-cover" />
          <div>
            <h2 className="text-xs font-extrabold tracking-widest text-[#f1f1f3]">LUCAS GABRIEL</h2>
            <p className="text-[11px] font-medium text-[#5b5c68]">Desenvolvedor Full Stack</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
          {sectionConfigs.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => goTo(idx)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                idx === active ? "bg-[#7c3aed] text-white shadow-lg" : "text-[#9394a0] hover:text-[#a78bfa]"
              }`}
            >
              {item.title}
            </button>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={prev}
            className="rounded-full border border-white/10 bg-[#16161a]/60 px-4 py-2 text-xs font-semibold text-[#f1f1f3] hover:border-[#7c3aed]/60 hover:text-[#a78bfa] transition glass gel-mild"
          >
            ← Anterior
          </button>
          <button
            onClick={next}
            className="rounded-full border border-white/10 bg-[#16161a]/60 px-4 py-2 text-xs font-semibold text-[#f1f1f3] hover:border-[#7c3aed]/60 hover:text-[#a78bfa] transition glass gel-mild"
          >
            Próxima →
          </button>
        </div>
      </header>

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
};

function PanelShell({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-[#f1f1f3]">
        <span className="text-[#a78bfa]">&gt;</span> {title}
      </h2>
      {subtitle ? <p className="mt-2 text-sm text-[#5b5c68]">{subtitle}</p> : null}
      <div className="mt-8">{children}</div>
    </div>
  );
}

function AboutPanel() {
  return (
    <PanelShell title="Sobre mim" subtitle="Conheça mais sobre minha trajetória">
      <FadeIn index={0} className="rounded-2xl border border-white/5 bg-[#16161a] p-6 md:p-8 glass gel-mild">
        <p className="text-[15px] leading-relaxed text-[#9394a0]">
          Olá, eu sou <strong className="text-[#f1f1f3]">Lucas Gabriel</strong>, estudante de{" "}
          <strong className="text-[#f1f1f3]">Análise e Desenvolvimento de Sistemas</strong> e apaixonado por tecnologia.
          Minha jornada começou com a curiosidade de entender como as coisas funcionam e evoluiu para o desejo de criar soluções que impactam pessoas.
        </p>
        <p className="mt-4 text-[15px] leading-relaxed text-[#9394a0]">
          Sou focado em desenvolver <strong className="text-[#f1f1f3]">soluções modernas, funcionais e eficientes</strong>,
          sempre buscando aprimorar minhas habilidades técnicas e acompanhar as tendências do mercado.
          Movido por desafios e aprendizado constante, transformo ideias em projetos reais com dedicação.
        </p>
        <p className="mt-4 text-[15px] leading-relaxed text-[#9394a0]">
          Este portfólio apresenta minha evolução na área, demonstrando na prática meu comprometimento em construir uma carreira sólida no desenvolvimento de software.
        </p>
      </FadeIn>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {[
          { label: "🎓 Formação", value: "Análise e Desenvolvimento de Sistemas" },
          { label: "💻 Foco", value: "Desenvolvimento Full Stack" },
          { label: "🎯 Objetivo", value: "Primeira oportunidade em TI" },
          { label: "📍 Localização", value: "Brasil" },
        ].map((item, idx) => (
          <FadeIn key={item.label} index={idx + 1} className="rounded-2xl border border-white/5 bg-[#16161a] p-5 transition hover:bg-[#1c1c21] hover:border-white/10 glass gel-mild">
            <div className="text-[11px] font-semibold uppercase tracking-widest text-[#a78bfa]">{item.label}</div>
            <div className="mt-1 text-sm font-medium text-[#f1f1f3]">{item.value}</div>
          </FadeIn>
        ))}
      </div>

      <FadeIn index={5} className="mt-6 rounded-2xl border border-white/5 bg-[#16161a] p-6 md:p-8 glass gel-mild">
        <h3 className="text-base font-semibold text-[#f1f1f3]">
          <span className="text-[#a78bfa]">&gt;</span> Objetivo Profissional
        </h3>
        <p className="mt-3 text-[15px] leading-relaxed text-[#9394a0]">
          Busco minha <strong className="text-[#f1f1f3]">primeira oportunidade na área de tecnologia</strong>, onde possa aplicar
          meus conhecimentos, adquirir experiência prática e contribuir com resultados através do
          desenvolvimento de soluções inteligentes e inovadoras.
        </p>
      </FadeIn>
    </PanelShell>
  );
}

function SkillsPanel() {
  return (
    <PanelShell title="Habilidades Técnicas" subtitle="Tecnologias e linguagens que utilizo">
      <FadeIn index={0} className="flex flex-wrap gap-2">
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
        ].map((skill) => (
          <span
            key={skill.name}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#16161a] px-4 py-2 text-xs font-medium text-[#9394a0] transition hover:border-[#7c3aed]/60 hover:bg-[#1c1c21] hover:text-[#a78bfa] hover:-translate-y-0.5 glass gel-mild"
          >
            <span className="h-2 w-2 rounded-full" style={{ background: skill.color }} />
            {skill.name}
          </span>
        ))}
      </FadeIn>
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
          { icon: "📚", title: "Aprendizado Rápido", desc: "Facilidade em aprender novas tecnologias e frameworks" },
        ].map((item, idx) => (
          <FadeIn
            key={item.title}
            index={idx}
            className="group rounded-2xl border border-white/5 bg-[#16161a] p-6 transition hover:bg-[#1c1c21] hover:border-white/10 glass gel-mild"
          >
            <div className="mb-4 text-3xl">{item.icon}</div>
            <h3 className="text-sm font-semibold text-[#f1f1f3] transition group-hover:text-[#a78bfa]">{item.title}</h3>
            <p className="mt-1 text-[13px] leading-relaxed text-[#9394a0]">{item.desc}</p>
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

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("https://api.github.com/users/blackxzin/repos?sort=updated&per_page=10");
        const data = (await res.json()) as Repo[];
        if (!cancelled) setRepos(data);
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
      <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
        {loading && Array.from({ length: 4 }).map((_, idx) => <Skeleton key={idx} />)}

        {error && (
          <p className="col-span-full text-sm text-[#5b5c68]">
            {error}{" "}
            <a href="https://github.com/blackxzin?tab=repositories" target="_blank" rel="noopener noreferrer" className="text-[#a78bfa] underline">
              Ver no GitHub ↗
            </a>
          </p>
        )}

        {repos?.map((repo, idx) => (
          <FadeIn
            key={repo.name}
            index={idx}
            className="group rounded-2xl border border-white/5 bg-[#16161a] p-5 transition hover:bg-[#1c1c21] hover:border-white/10 glass gel-mild"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-semibold text-[#f1f1f3] transition group-hover:text-[#a78bfa]">{repo.name}</h3>
              <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#5b5c68] transition hover:text-[#a78bfa]">
                Repo ↗
              </a>
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-[#9394a0]">{repo.description || "Sem descrição ainda."}</p>
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
            href={contact.href}
            target={contact.href.startsWith("http") ? "_blank" : undefined}
            rel={contact.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-[#16161a] p-5 transition hover:bg-[#1c1c21] hover:border-white/10 glass gel-mild"
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
  ...props
}: {
  children: React.ReactNode;
  index?: number;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

function Skeleton() {
  return <div className="h-40 animate-pulse rounded-2xl border border-white/5 bg-[#16161a]" />;
}

function FloatingIcon({ src, x, y, rotation, size = 90, delay = 0 }: { src: string; x: number; y: number; rotation: number; size?: number; delay?: number }) {
  return (
    <motion.img
      src={src}
      alt=""
      className="pointer-events-none absolute opacity-[0.12]"
      style={{ left: `${x}%`, top: `${y}%`, width: size }}
      initial={{ rotate: rotation }}
      animate={{ y: [0, -8, 0], rotate: [rotation, rotation + 3, rotation - 2, rotation] }}
      transition={{ duration: 6, ease: "easeInOut", repeat: Infinity, delay }}
    />
  );
}
