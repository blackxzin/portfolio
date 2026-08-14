import { GITHUB_USER } from "@/content/profile";

export interface Repo {
  readonly name: string;
  readonly description: string | null;
  readonly url: string;
  readonly language: string | null;
  readonly stars: number;
  readonly updatedAt: string;
}

interface GitHubRepoResponse {
  name?: unknown;
  description?: unknown;
  html_url?: unknown;
  language?: unknown;
  stargazers_count?: unknown;
  updated_at?: unknown;
  fork?: unknown;
}

const REPO_LIMIT = 6;
const REVALIDATE_SECONDS = 3600;

/** Valida a resposta da API: campos ausentes ou com tipo errado descartam o repositório. */
function toRepo(raw: GitHubRepoResponse): Repo | null {
  if (typeof raw.name !== "string" || typeof raw.html_url !== "string") return null;
  if (raw.fork === true) return null;
  // repositório de perfil (nome igual ao usuário) só contém o README do GitHub
  if (raw.name.toLowerCase() === GITHUB_USER.toLowerCase()) return null;

  return {
    name: raw.name,
    description: typeof raw.description === "string" ? raw.description : null,
    url: raw.html_url,
    language: typeof raw.language === "string" ? raw.language : null,
    stars: typeof raw.stargazers_count === "number" ? raw.stargazers_count : 0,
    updatedAt: typeof raw.updated_at === "string" ? raw.updated_at : "",
  };
}

const SUMMARY_MAX_CHARS = 150;

/** Primeira linha de prosa do README: sem títulos, badges, links soltos ou HTML. */
function summarizeReadme(markdown: string): string | null {
  const line = markdown
    .split("\n")
    .map((raw) => raw.replace(/^#+\s*/, "").replace(/^[-*>]\s*/, "").trim())
    .find(
      (candidate) =>
        candidate.length > 20 &&
        !candidate.startsWith("![") &&
        !candidate.startsWith("<") &&
        !/^https?:\/\//.test(candidate) &&
        !/^\[!\[/.test(candidate)
    );

  if (!line) return null;

  const clean = line.replace(/[*_`]/g, "").trim();
  return clean.length > SUMMARY_MAX_CHARS ? `${clean.slice(0, SUMMARY_MAX_CHARS).trimEnd()}…` : clean;
}

async function withReadmeFallback(repo: Repo): Promise<Repo> {
  if (repo.description) return repo;

  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${repo.name}/readme`, {
      headers: { Accept: "application/vnd.github.raw+json" },
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return repo;

    const summary = summarizeReadme(await res.text());
    return summary ? { ...repo, description: summary } : repo;
  } catch {
    // README indisponível não invalida o repositório; a linha só fica sem resumo
    return repo;
  }
}

/**
 * Busca os repositórios públicos no build/servidor e revalida de hora em hora.
 * O cliente recebe HTML pronto — nenhuma chamada à API do GitHub no navegador.
 * Falha de rede retorna lista vazia; a página mostra o link direto para o perfil.
 */
export async function fetchRepos(): Promise<readonly Repo[]> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=20`,
      {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: REVALIDATE_SECONDS },
      }
    );

    if (!res.ok) {
      console.error(`GitHub API respondeu ${res.status} para o usuário ${GITHUB_USER}`);
      return [];
    }

    const data: unknown = await res.json();
    if (!Array.isArray(data)) {
      console.error("GitHub API retornou um corpo inesperado (esperado: array)");
      return [];
    }

    const repos = data
      .map((item) => toRepo(item as GitHubRepoResponse))
      .filter((repo): repo is Repo => repo !== null)
      .slice(0, REPO_LIMIT);

    // repositório sem description ainda pode ter uma primeira linha útil no README
    return Promise.all(repos.map(withReadmeFallback));
  } catch (error: unknown) {
    console.error("Falha ao buscar repositórios do GitHub:", error);
    return [];
  }
}

export const LANGUAGE_COLORS: Readonly<Record<string, string>> = {
  Python: "#3572A5",
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Java: "#b07219",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Dockerfile: "#384d54",
};
