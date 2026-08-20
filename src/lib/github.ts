import { GITHUB_USER } from "@/content/profile";

export interface Repo {
  readonly name: string;
  readonly url: string;
  readonly language: string | null;
  readonly stars: number;
  readonly updatedAt: string;
}

interface GitHubRepoResponse {
  name?: unknown;
  html_url?: unknown;
  language?: unknown;
  stargazers_count?: unknown;
  updated_at?: unknown;
  fork?: unknown;
}

const REVALIDATE_SECONDS = 3600;

/** Valida a resposta da API: campos ausentes ou com tipo errado descartam o repositório. */
function toRepo(raw: GitHubRepoResponse): Repo | null {
  if (typeof raw.name !== "string" || typeof raw.html_url !== "string") return null;
  if (raw.fork === true) return null;
  // repositório de perfil (nome igual ao usuário) só contém o README do GitHub
  if (raw.name.toLowerCase() === GITHUB_USER.toLowerCase()) return null;

  return {
    name: raw.name,
    url: raw.html_url,
    language: typeof raw.language === "string" ? raw.language : null,
    stars: typeof raw.stargazers_count === "number" ? raw.stargazers_count : 0,
    updatedAt: typeof raw.updated_at === "string" ? raw.updated_at : "",
  };
}

/**
 * Busca os repositórios públicos no build/servidor e revalida de hora em hora.
 * O cliente recebe HTML pronto — nenhuma chamada à API do GitHub no navegador.
 * Falha de rede retorna lista vazia; a página mostra o link direto para o perfil.
 * Devolve a lista completa: quem exibe decide quantos mostrar.
 */
export async function fetchRepos(): Promise<readonly Repo[]> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=100`,
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

    return data
      .map((item) => toRepo(item as GitHubRepoResponse))
      .filter((repo): repo is Repo => repo !== null);
  } catch (error: unknown) {
    console.error("Falha ao buscar repositórios do GitHub:", error);
    return [];
  }
}

export interface LanguageShare {
  readonly language: string;
  readonly repos: number;
  readonly percent: number;
}

export interface GitHubStats {
  readonly ownRepos: number;
  readonly totalStars: number;
  readonly lastPush: string;
  readonly languages: readonly LanguageShare[];
}

const TOP_LANGUAGES = 6;

/**
 * Números agregados a partir dos repositórios públicos.
 * Só conta o que a API devolve — nada é estimado ou arredondado para cima.
 */
export function summarize(repos: readonly Repo[]): GitHubStats | null {
  if (repos.length === 0) return null;

  const counts = new Map<string, number>();
  for (const repo of repos) {
    if (!repo.language) continue;
    counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1);
  }

  const classified = [...counts.values()].reduce((sum, count) => sum + count, 0);

  const languages = [...counts.entries()]
    .map(([language, count]) => ({
      language,
      repos: count,
      percent: Math.round((count / classified) * 100),
    }))
    .sort((a, b) => b.repos - a.repos)
    .slice(0, TOP_LANGUAGES);

  const lastPush = repos
    .map((repo) => repo.updatedAt)
    .filter(Boolean)
    .sort()
    .at(-1);

  return {
    ownRepos: repos.length,
    totalStars: repos.reduce((sum, repo) => sum + repo.stars, 0),
    lastPush: lastPush ?? "",
    languages,
  };
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
