import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import { GITHUB_USER, sections } from "@/content/profile";
import { caseStudies, repoUrl, sideProjects } from "@/content/projects";
import { fetchRepos, LANGUAGE_COLORS, summarize } from "@/lib/github";

const meta = sections[3];
const PROFILE_URL = `https://github.com/${GITHUB_USER}?tab=repositories`;
const OTHERS_LIMIT = 8;
const listed = new Set(
  [...caseStudies, ...sideProjects].map((project) => project.repo.toLowerCase())
);

function formatDate(iso: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("pt-BR", { month: "short", year: "numeric" });
}

/** Server Component: os repositórios chegam no HTML, o navegador não fala com a API. */
export default async function Projects() {
  const repos = await fetchRepos();
  const stats = summarize(repos);
  const others = repos
    .filter((repo) => !listed.has(repo.name.toLowerCase()))
    .slice(0, OTHERS_LIMIT);

  return (
    <section id={meta.id} className="shell py-24 md:py-36">
      <SectionHeading
        index={meta.index}
        title="Código que resolve problemas"
        command={meta.command}
        aside={meta.title}
      />

      {stats ? (
        <div className="mt-14" data-reveal>
          <dl className="m-0 flex flex-wrap gap-x-12 gap-y-4">
            <div>
              <dt className="label">Repositórios próprios</dt>
              <dd className="m-0 mt-1 font-[family-name:var(--font-mono)] text-[1.5rem]">
                {stats.ownRepos}
              </dd>
            </div>
            <div>
              <dt className="label">Estrelas recebidas</dt>
              <dd className="m-0 mt-1 font-[family-name:var(--font-mono)] text-[1.5rem]">
                {stats.totalStars}
              </dd>
            </div>
            <div>
              <dt className="label">Último push</dt>
              <dd className="m-0 mt-1 font-[family-name:var(--font-mono)] text-[1.5rem]">
                {formatDate(stats.lastPush)}
              </dd>
            </div>
          </dl>

          {/* proporção real de linguagens entre os repositórios classificados */}
          <div
            className="mt-8 flex h-1.5 w-full overflow-hidden"
            role="img"
            aria-label={`Distribuição de linguagens: ${stats.languages
              .map((item) => `${item.language} ${item.percent}%`)
              .join(", ")}`}
          >
            {stats.languages.map((item) => (
              <span
                key={item.language}
                style={{
                  width: `${item.percent}%`,
                  background: LANGUAGE_COLORS[item.language] ?? "var(--paper-faint)",
                }}
              />
            ))}
          </div>

          <ul className="mt-4 m-0 flex list-none flex-wrap gap-x-6 gap-y-2 p-0">
            {stats.languages.map((item) => (
              <li key={item.language} className="label flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ background: LANGUAGE_COLORS[item.language] ?? "var(--paper-faint)" }}
                />
                {item.language} {item.percent}%
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <ul className="project-grid mt-16 m-0 list-none p-0">
        {caseStudies.map((project, i) => (
          <li
            key={project.slug}
            className={`project-card d${Math.min(i + 1, 4)}`}
            style={{ borderTop: "1px solid var(--line)" }}
            data-reveal
          >
            <Link
              href={`/projetos/${project.slug}`}
              className="project-card-link scan-hover group"
            >
              <div className="md:col-span-4">
                <span className="label" style={{ color: "var(--signal)" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 text-[1.375rem] transition-colors group-hover:text-white">
                  {project.name}
                </h3>
                <span className="label mt-2 flex items-center gap-2">
                  {project.status === "em desenvolvimento" ? (
                    <span className="status-dot" aria-hidden="true" />
                  ) : null}
                  {project.status}
                </span>
              </div>

              <p className="md:col-span-5 m-0 max-w-[56ch]" style={{ color: "var(--paper-dim)" }}>
                {project.summary}
              </p>

              <div className="md:col-span-3 flex flex-col items-start gap-2 md:items-end">
                <ul className="m-0 flex list-none flex-wrap gap-x-3 gap-y-1 p-0 md:justify-end">
                  {project.stack.slice(0, 4).map((tech) => (
                    <li
                      key={tech}
                      className="font-[family-name:var(--font-mono)] text-[0.8rem]"
                      style={{ color: "var(--paper-faint)" }}
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
                <span className="label transition-colors group-hover:text-[color:var(--signal)]">
                  ler o case →
                </span>
              </div>
            </Link>
          </li>
        ))}

        {sideProjects.map((project) => (
          <li key={project.repo} style={{ borderTop: "1px solid var(--line)" }} data-reveal>
            <a
              href={repoUrl(project.repo)}
              target="_blank"
              rel="noopener noreferrer"
              className="scan-hover group grid gap-4 py-8 md:grid-cols-12 md:gap-10"
            >
              <div className="md:col-span-4">
                <h3 className="text-[1.375rem] transition-colors group-hover:text-white">
                  {project.name}
                </h3>
              </div>

              <p className="md:col-span-5 m-0 max-w-[56ch]" style={{ color: "var(--paper-dim)" }}>
                {project.summary}
              </p>

              <div className="md:col-span-3 flex flex-col items-start gap-2 md:items-end">
                <ul className="m-0 flex list-none flex-wrap gap-x-3 gap-y-1 p-0 md:justify-end">
                  {project.stack.map((tech) => (
                    <li
                      key={tech}
                      className="font-[family-name:var(--font-mono)] text-[0.8rem]"
                      style={{ color: "var(--paper-faint)" }}
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
                <span className="label transition-colors group-hover:text-[color:var(--signal)]">
                  ver código ↗
                </span>
              </div>
            </a>
          </li>
        ))}
      </ul>

      {others.length > 0 ? (
        <div className="mt-20" data-reveal>
          <p className="label font-[family-name:var(--font-mono)]">
            <span style={{ color: "var(--signal)" }}>$</span> ls ~/projetos/outros
          </p>

          <ul className="mt-6 m-0 list-none p-0">
            {others.map((repo) => (
              <li key={repo.name} style={{ borderTop: "1px solid var(--line)" }}>
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="scan-hover group flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4"
                >
                  <span className="font-[family-name:var(--font-mono)] text-[0.95rem] transition-colors group-hover:text-white">
                    {repo.name}
                  </span>
                  <span className="label flex items-center gap-2">
                    {repo.language ? (
                      <>
                        <span
                          aria-hidden="true"
                          className="inline-block h-2 w-2 rounded-full"
                          style={{ background: LANGUAGE_COLORS[repo.language] ?? "var(--paper-faint)" }}
                        />
                        {repo.language}
                      </>
                    ) : null}
                    {repo.stars > 0 ? <span>· {repo.stars}★</span> : null}
                    <span>· {formatDate(repo.updatedAt)}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div
        className="mt-2 flex justify-end pt-6"
        style={{ borderTop: "1px solid var(--line)" }}
        data-reveal
      >
        <a href={PROFILE_URL} target="_blank" rel="noopener noreferrer" className="label link-underline">
          Todos os repositórios ↗
        </a>
      </div>
    </section>
  );
}
