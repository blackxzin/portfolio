import SectionHeading from "@/components/SectionHeading";
import { GITHUB_USER, sections } from "@/content/profile";
import { fetchRepos, LANGUAGE_COLORS } from "@/lib/github";

const meta = sections[3];
const PROFILE_URL = `https://github.com/${GITHUB_USER}?tab=repositories`;

function formatDate(iso: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("pt-BR", { month: "short", year: "numeric" });
}

/** Server Component: os repositórios chegam no HTML, o navegador não fala com a API. */
export default async function Projects() {
  const repos = await fetchRepos();

  return (
    <section id={meta.id} className="shell py-24 md:py-36">
      <SectionHeading index={meta.index} title="O que já saiu da minha máquina" aside={meta.title} />

      {repos.length === 0 ? (
        <p className="mt-14" style={{ color: "var(--paper-dim)" }} data-reveal>
          Não consegui carregar os repositórios agora.{" "}
          <a href={PROFILE_URL} target="_blank" rel="noopener noreferrer" className="link-underline">
            Ver direto no GitHub ↗
          </a>
        </p>
      ) : (
        <ul className="mt-14 m-0 list-none p-0">
          {repos.map((repo, i) => (
            <li
              key={repo.name}
              className={`d${Math.min(i + 1, 4)}`}
              style={{ borderTop: "1px solid var(--line)" }}
              data-reveal
            >
              {/* linha inteira clicável, sem virar card com borda e sombra */}
              <a
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid gap-3 py-7 md:grid-cols-12 md:gap-10"
              >
                <div className="md:col-span-4">
                  <h3 className="text-[1.25rem] transition-colors group-hover:text-white font-[family-name:var(--font-mono)] tracking-tight">
                    {repo.name}
                  </h3>
                </div>

                <p className="md:col-span-5 m-0 max-w-[52ch]" style={{ color: "var(--paper-dim)" }}>
                  {repo.description ?? "Sem descrição no repositório."}
                </p>

                <div className="md:col-span-3 flex items-start justify-between gap-4">
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
                  </span>
                  <span className="label transition-colors group-hover:text-[color:var(--signal)]">
                    {formatDate(repo.updatedAt)} ↗
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}

      <div
        className="mt-2 flex justify-end pt-6"
        style={{ borderTop: "1px solid var(--line)" }}
        data-reveal
      >
        <a
          href={PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="label link-underline"
        >
          Todos os repositórios ↗
        </a>
      </div>
    </section>
  );
}
