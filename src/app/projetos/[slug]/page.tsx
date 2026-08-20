import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Scramble from "@/components/Scramble";
import { profile } from "@/content/profile";
import { caseStudies, findCaseStudy, repoUrl } from "@/content/projects";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return caseStudies.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = findCaseStudy(slug);

  if (!project) return { title: "Projeto não encontrado" };

  return {
    title: project.name,
    description: project.tagline,
    alternates: { canonical: `/projetos/${project.slug}` },
    openGraph: {
      title: `${project.name} — ${profile.name}`,
      description: project.tagline,
      url: `/projetos/${project.slug}`,
      type: "article",
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = findCaseStudy(slug);

  if (!project) notFound();

  const index = caseStudies.findIndex((item) => item.slug === project.slug);
  const next = caseStudies[(index + 1) % caseStudies.length];

  return (
    <main className="shell max-w-[900px] py-20 md:py-28">
      <Link href="/#projetos" className="label link-underline">
        ← Todos os projetos
      </Link>

      <header className="mt-12" data-reveal>
        <p className="label font-[family-name:var(--font-mono)]">
          <span style={{ color: "var(--signal)" }}>$</span>{" "}
          <Scramble text={`cat ~/projetos/${project.slug}/CASE.md`} />
        </p>

        <h1 className="mt-6" style={{ fontSize: "var(--step-title)" }}>
          {project.name}
        </h1>

        <p
          className="mt-5 max-w-[54ch]"
          style={{ fontSize: "var(--step-lead)", color: "var(--paper-dim)", lineHeight: 1.45 }}
        >
          {project.tagline}
        </p>

        <dl className="mt-10 grid gap-x-10 gap-y-5 sm:grid-cols-2">
          <div>
            <dt className="label">Status</dt>
            <dd className="m-0 mt-1 flex items-center gap-2 text-[0.95rem]">
              {project.status === "em desenvolvimento" ? (
                <span className="status-dot" aria-hidden="true" />
              ) : null}
              {project.status}
            </dd>
          </div>
          <div>
            <dt className="label">Papel</dt>
            <dd className="m-0 mt-1 text-[0.95rem]">{project.role}</dd>
          </div>
        </dl>

        <ul className="mt-8 m-0 flex list-none flex-wrap gap-x-4 gap-y-2 p-0">
          {project.stack.map((tech) => (
            <li
              key={tech}
              className="font-[family-name:var(--font-mono)] text-[0.85rem]"
              style={{ color: "var(--paper-faint)" }}
            >
              {tech}
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap gap-6 pt-8" style={{ borderTop: "1px solid var(--line)" }}>
          <a
            href={repoUrl(project.repo)}
            target="_blank"
            rel="noopener noreferrer"
            className="label link-underline"
            style={{ color: "var(--signal)" }}
          >
            Ver o código no GitHub ↗
          </a>
        </div>
      </header>

      {project.cover ? (
        <figure className="mt-16 m-0" data-reveal>
          <Image
            src={project.cover}
            alt={`Interface do projeto ${project.name}`}
            width={1600}
            height={900}
            className="h-auto w-full"
            style={{ border: "1px solid var(--line)" }}
          />
        </figure>
      ) : null}

      <section className="mt-20" data-reveal>
        <h2 className="label" style={{ color: "var(--signal)" }}>
          O problema
        </h2>
        <p className="mt-5 max-w-[62ch]" style={{ fontSize: "var(--step-lead)", lineHeight: 1.5 }}>
          {project.problem}
        </p>
      </section>

      <section className="mt-20" data-reveal>
        <h2 className="label" style={{ color: "var(--signal)" }}>
          Como resolvi
        </h2>
        <div className="mt-5 max-w-[68ch]">
          {project.approach.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="mt-0 mb-6 last:mb-0" style={{ color: "var(--paper-dim)" }}>
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {project.diagram ? (
        <section className="mt-20" data-reveal>
          <h2 className="label" style={{ color: "var(--signal)" }}>
            Fluxo
          </h2>
          <pre
            className="mt-5 overflow-x-auto p-6 text-[0.8rem] leading-relaxed"
            style={{
              background: "var(--ink-sunken)",
              border: "1px solid var(--line)",
              color: "var(--paper-dim)",
              fontFamily: "var(--font-mono), ui-monospace, monospace",
            }}
          >
            {project.diagram}
          </pre>
        </section>
      ) : null}

      <section className="mt-20" data-reveal>
        <h2 className="label" style={{ color: "var(--signal)" }}>
          Decisões técnicas
        </h2>
        <ol className="mt-5 m-0 list-none p-0">
          {project.decisions.map((decision, i) => (
            <li
              key={decision.title}
              className="grid gap-3 py-7 md:grid-cols-12 md:gap-10"
              style={{ borderTop: "1px solid var(--line)" }}
            >
              <div className="label md:col-span-1" style={{ color: "var(--signal)" }}>
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="md:col-span-4 text-[1.125rem] leading-snug">{decision.title}</h3>
              <p className="md:col-span-7 m-0" style={{ color: "var(--paper-dim)" }}>
                {decision.body}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-20" data-reveal>
        <h2 className="label" style={{ color: "var(--signal)" }}>
          O que dá para verificar
        </h2>
        <dl className="mt-5 m-0 grid gap-x-10 sm:grid-cols-2">
          {project.evidence.map((item) => (
            <div key={item.label} className="py-4" style={{ borderTop: "1px solid var(--line)" }}>
              <dt className="label">{item.label}</dt>
              <dd className="m-0 mt-1 text-[0.95rem]" style={{ color: "var(--paper-dim)" }}>
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-20" data-reveal>
        <h2 className="label" style={{ color: "var(--signal)" }}>
          O que eu tirei disso
        </h2>
        <p
          className="mt-5 max-w-[62ch]"
          style={{ fontSize: "var(--step-lead)", lineHeight: 1.5 }}
        >
          {project.learned}
        </p>
      </section>

      <nav
        className="mt-24 flex flex-wrap items-baseline justify-between gap-6 pt-8"
        style={{ borderTop: "1px solid var(--line)" }}
        aria-label="Navegação entre projetos"
      >
        <Link href="/#contato" className="label link-underline">
          Falar comigo →
        </Link>
        <Link href={`/projetos/${next.slug}`} className="label link-underline">
          Próximo: {next.name} →
        </Link>
      </nav>
    </main>
  );
}
