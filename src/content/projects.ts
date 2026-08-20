import { GITHUB_USER } from "@/content/profile";

export type ProjectStatus = "v1 completa" | "release pública" | "em desenvolvimento" | "arquivado";

export interface Decision {
  readonly title: string;
  readonly body: string;
}

export interface Evidence {
  readonly label: string;
  readonly value: string;
}

export interface CaseStudy {
  /** Segmento da URL em /projetos/[slug]. */
  readonly slug: string;
  /** Nome do repositório no GitHub. */
  readonly repo: string;
  readonly name: string;
  readonly tagline: string;
  readonly status: ProjectStatus;
  readonly role: string;
  /** Resumo curto — usado no card da home. */
  readonly summary: string;
  /** Caminho em /public. Opcional: o card cai num bloco tipográfico sem ela. */
  readonly cover?: string;
  readonly stack: readonly string[];
  /** Por que o projeto existe. */
  readonly problem: string;
  /** Como foi resolvido — um parágrafo por ideia. */
  readonly approach: readonly string[];
  /** Diagrama em texto puro, no espírito do README. */
  readonly diagram?: string;
  readonly decisions: readonly Decision[];
  /** Fatos verificáveis: testes, CI, releases. */
  readonly evidence: readonly Evidence[];
  readonly learned: string;
}

export const caseStudies: readonly CaseStudy[] = [
  {
    slug: "cybersecurity-ai",
    repo: "cyber-assitente",
    name: "Cybersecurity AI",
    tagline: "Assistente de segurança defensiva com IA local e aprovação humana obrigatória",
    status: "em desenvolvimento",
    role: "Projeto solo — arquitetura, backend, camada de segurança e interface",
    summary:
      "Assistente de segurança defensiva para Linux rodando IA local via Ollama. Agentes especializados escolhem a ferramenta certa, explicam o resultado em português e exigem aprovação humana antes de qualquer varredura ativa.",
    stack: ["Python 3.12", "FastAPI", "Ollama", "SSE", "SQLite", "Electron", "faster-whisper"],
    problem:
      "Ferramenta de auditoria conectada a um LLM é uma péssima ideia se o modelo puder executar sozinho. Um prompt mal interpretado vira varredura em rede de terceiro, captura de tráfego indevida ou comando destrutivo. Eu queria a conveniência de pedir em português — sem entregar o gatilho para o modelo.",
    approach: [
      "O orquestrador classifica a intenção da mensagem e decide qual ferramenta usar. Ferramentas de leitura (interfaces, rotas, DNS, portas locais, serviços systemd, logs, uso de CPU e disco) executam direto. Ferramentas de auditoria ativa — nmap, captura de pacotes, OSINT — param e abrem um modal de aprovação com o comando exato que será executado.",
      "Aprovar executa e o LLM interpreta o resultado real. Negar não roda nada. Ninguém decidir em cinco minutos expira a ação. Os três caminhos ficam registrados em log estruturado e no SQLite.",
      "Em paralelo, uma Safety Layer independente do modelo aplica denylist absoluta (rm, dd, mkfs, shutdown) e bloqueio permanente de ferramentas ofensivas (masscan, sqlmap, metasploit, hydra). Nenhuma execução passa por shell — argv direto, sem espaço para injeção — com timeout rígido e saída sanitizada de segredos.",
      "Um watcher roda a cada cinco minutos comparando o estado do sistema com o anterior: porta nova escutando vira alerta, porta nova entre dois scans do mesmo host vira alerta, disco acima do limite vira alerta. Resultado de OSINT com CPF é purgado automaticamente depois do prazo de retenção, por LGPD.",
    ],
    diagram: `input → sanitize → Orchestrator (classifica intenção)
     → decide ferramenta (+ args)
     → risco moderado? → PEDE CONFIRMAÇÃO humana
          ├─ aprovar → executa → LLM explica o resultado real
          └─ negar   → nada roda (tudo fica registrado)
     → leitura segura → executa → LLM explica
     → stream SSE para o chat
     → persistência SQLite`,
    decisions: [
      {
        title: "IA local em vez de API de terceiro",
        body: "O assistente lê log, saída de scan e configuração de rede da minha máquina. Mandar isso para uma API externa é vazar superfície de ataque para fora. Roda um DeepHat-V1-7B via Ollama — mais lento que um modelo grande de API, e o dado nunca sai do host.",
      },
      {
        title: "Confirmação humana como parte da arquitetura, não como aviso",
        body: "Não é um alerta que o usuário clica sem ler. É uma fila de aprovações com estados explícitos (pendente, aprovado, negado, expirado) que a ferramenta consulta antes de rodar. Sem registro aprovado, a execução simplesmente não acontece.",
      },
      {
        title: "Nunca passar por shell",
        body: "O executor recebe argv como lista e chama o binário direto. Isso elimina toda a classe de injeção por metacaractere, que é exatamente o risco quando um LLM monta os argumentos.",
      },
      {
        title: "Três modos de operação",
        body: "SAFE_MODE alterna entre 'safe' (só leitura), 'assisted' (leitura mais confirmação) e 'advanced'. Quem instala escolhe o quanto de autonomia quer dar antes de qualquer coisa rodar.",
      },
    ],
    evidence: [
      { label: "Testes", value: "pytest — validação de entrada, Safety Layer e fluxo de aprovação" },
      { label: "CI", value: "GitHub Actions roda a suíte a cada push e PR" },
      { label: "Cobre", value: "allowlist, denylist, flag-injection, sanitização de segredos" },
      { label: "Fases", value: "1, 2, 5 concluídas · 6 parcial" },
    ],
    learned:
      "Escrever a camada de segurança antes das ferramentas mudou o projeto inteiro. Quando a regra é 'nada executa sem registro aprovado', cada ferramenta nova nasce dentro do trilho em vez de precisar ser contida depois. O caro não foi implementar a confirmação — foi decidir que ela era inegociável.",
  },
  {
    slug: "cyberhub-ai",
    repo: "cyber-Hub",
    name: "CyberHub AI",
    tagline: "Monorepo de automação e threat intel — API, dashboard, bot e workflows agendados",
    status: "v1 completa",
    role: "Projeto solo — ADR, monorepo, API, dashboard, bot e infraestrutura",
    summary:
      "Central de automação e threat intel: dashboard em Next.js, API em NestJS, bot de Discord, workflows n8n e consultas a NVD, CISA KEV, VirusTotal, AbuseIPDB e Shodan. Arquitetura documentada em ADR antes da primeira linha de código.",
    stack: ["NestJS", "Next.js 14", "PostgreSQL 16", "Prisma", "Redis", "BullMQ", "n8n", "discord.js"],
    problem:
      "Acompanhar CVE nova, boletim da CISA e reputação de IP significa abrir cinco abas e repetir a mesma consulta todo dia. Eu queria uma central que puxasse tudo sozinha, guardasse histórico e me avisasse — com a IA explicando o que a vulnerabilidade significa em português, não colando o texto do NVD.",
    approach: [
      "Monorepo pnpm com turborepo: três aplicações (dashboard Next.js, API NestJS, bot Discord) sobre quatro pacotes compartilhados (database, shared, types, utils). O bot nunca fala com o banco — consome a mesma API que o dashboard, autenticado por API key.",
      "Duas camadas de job com responsabilidades separadas: BullMQ sobre Redis para trabalho interno da aplicação, como gerar relatório em PDF; n8n para orquestração externa agendada, como o cron diário que puxa a CISA KEV. O n8n devolve os dados para a API por webhook assinado com HMAC.",
      "Acesso a dados sempre via Repository. O service não conhece o Prisma. Isso mantém a regra de negócio testável e deixa a troca de ORM como problema de uma camada só.",
      "A camada de IA é um Strategy: o AIService fala com uma interface, e o provider concreto (Hermes no Ollama por padrão) é escolhido por configuração. Sem o Ollama de pé, existe fallback offline em vez de erro na cara do usuário.",
    ],
    diagram: `apps/
  dashboard/   Next.js — painel, métricas, CVEs, intel
  api/         NestJS + Fastify — auth/RBAC, jobs, IA, intel
  discord-bot/ discord.js — consome a API via x-api-key
packages/
  database/    Prisma schema + repositories
  shared/      logger, config, erros de domínio
  types/       DTOs e schemas zod compartilhados
n8n/
  workflows/   cve-daily, news-daily (cron → HMAC → API)`,
    decisions: [
      {
        title: "ADR antes de código",
        body: "Escrevi o Architecture Decision Record completo — quase trinta mil caracteres — antes de implementar. Cada escolha ficou registrada com alternativa considerada e motivo. Seis meses depois eu ainda sei por que o BullMQ e o n8n coexistem em vez de um substituir o outro.",
      },
      {
        title: "NestJS com adapter Fastify",
        body: "Precisava de módulos, injeção de dependência e RBAC maduros sem montar tudo à mão. O Fastify no lugar do Express foi para não pagar overhead de HTTP à toa.",
      },
      {
        title: "BullMQ e n8n resolvendo coisas diferentes",
        body: "Job que pertence à aplicação e precisa de retry, prioridade e acesso ao domínio fica no BullMQ. Orquestração externa agendada, que muda mais que o código, fica em workflow n8n versionado em JSON — dá para editar sem redeploy.",
      },
      {
        title: "Webhook n8n assinado com HMAC",
        body: "O gateway que recebe os dados do n8n fica exposto. Assinatura HMAC garante que só o meu workflow consegue escrever no banco por ali.",
      },
    ],
    evidence: [
      { label: "Roadmap", value: "Fases 0 a 6 concluídas — do ADR ao dashboard completo" },
      { label: "CI", value: "GitHub Actions com typecheck e build via turbo em PR e push" },
      { label: "Deploy", value: "docker-compose.prod.yml — api, bot, postgres, redis, n8n, ollama" },
      { label: "Auth", value: "JWT access e refresh em cookie httpOnly, RBAC e API key" },
    ],
    learned:
      "O ADR foi o que mais rendeu. Escrever a decisão antes obrigou a comparar alternativa de verdade em vez de pegar a primeira que funcionasse — e cortou pela metade o tempo que eu costumava perder refazendo escolha já tomada. Hoje começo qualquer projeto grande assim.",
  },
  {
    slug: "jobpilot-ai",
    repo: "JOBPILOT_AI",
    name: "JobPilot AI",
    tagline: "Copiloto de carreira com busca semântica e seis provedores de LLM intercambiáveis",
    status: "v1 completa",
    role: "Projeto solo — backend, frontend, workers, testes e deploy",
    summary:
      "Busca vagas em seis fontes externas, faz matching semântico com pgvector e gera carta e currículo sob medida através de seis provedores de LLM que se trocam por configuração.",
    stack: ["FastAPI", "Next.js 14", "PostgreSQL + pgvector", "Celery", "Redis", "Docker", "Fernet"],
    problem:
      "Procurar estágio é trabalho repetitivo: abrir seis sites, reler a mesma vaga, reescrever a mesma carta trocando o nome da empresa. É exatamente o tipo de tarefa que eu acho que não deveria ser feita à mão — então automatizei enquanto procurava.",
    approach: [
      "Backend em FastAPI dividido em módulos por domínio: auth, jobs, resume, applications, ai, analytics, search. Cada módulo isola sua regra e expõe a rota — a estrutura segue Clean Architecture para o service não depender do detalhe de infraestrutura.",
      "Busca de vagas em seis fontes externas mais busca semântica local: as vagas são indexadas como embeddings no pgvector, então 'automação de processos' encontra vaga escrita como 'RPA' — coisa que busca por palavra-chave nunca acha.",
      "Scraping, matching, análise ATS e envio de email rodam em Celery com Redis como broker. A requisição HTTP devolve na hora e o trabalho pesado acontece no worker — sem timeout de request esperando o LLM responder.",
      "As chaves de API dos provedores ficam criptografadas com Fernet no banco, nunca em texto puro, e os resultados de LLM são cacheados no Redis por uma hora para não pagar duas vezes pela mesma análise.",
    ],
    diagram: `LLMService (aplicação)
    │
    ▼
LLMProvider (interface de domínio)
    │
    ├── OpenAI      ├── Anthropic   ├── Gemini
    ├── Ollama      ├── NVIDIA NIM  └── OpenRouter
    │
Factory escolhe o provider pela configuração do usuário`,
    decisions: [
      {
        title: "Strategy para os provedores de LLM",
        body: "Seis provedores atrás de uma interface só. Trocar de modelo é configuração, não refatoração — e em desenvolvimento eu uso a NVIDIA NIM, que é gratuita, sem mudar uma linha do código de aplicação.",
      },
      {
        title: "pgvector em vez de banco vetorial separado",
        body: "As vagas já estavam no Postgres. Subir Pinecone ou Qdrant significaria manter dois bancos sincronizados para ganhar performance que, nessa escala, não faz diferença nenhuma.",
      },
      {
        title: "Celery para tudo que demora",
        body: "Scraping de seis fontes e chamada de LLM não cabem no ciclo de uma requisição. Vão para a fila, o usuário recebe resposta imediata e a notificação chega quando termina.",
      },
      {
        title: "Chave de API criptografada com Fernet",
        body: "O usuário cadastra a própria chave dos provedores. Guardar isso em texto puro seria transformar um vazamento de banco em vazamento de credencial de terceiro.",
      },
    ],
    evidence: [
      { label: "Testes", value: "47 testes em pytest — auth, IA, OAuth, busca semântica, notificações" },
      { label: "CI", value: "GitHub Actions" },
      { label: "Infra", value: "docker compose com 6 serviços · 20 tabelas · migrations Alembic" },
      { label: "Deploy", value: "guias prontos para Coolify e Railway" },
    ],
    learned:
      "Foi onde aprendi a diferença entre 'funciona na minha máquina' e 'outra pessoa consegue subir'. Os 47 testes vieram de bugs reais que eu quebrei e reintroduzi — cada teste é uma cicatriz. E escrever guia de deploy me obrigou a admitir todas as variáveis de ambiente que eu tinha deixado hardcoded.",
  },
  {
    slug: "linuxdesk",
    repo: "LinuxDesk",
    name: "LinuxDesk",
    tagline: "Segundo monitor por Wi-Fi: streaming H.264 de Linux para Android com baixa latência",
    status: "release pública",
    role: "Projeto solo, aberto a contribuições — servidor Python e cliente Android",
    summary:
      "Transforma um tablet Android em segundo monitor de um PC Linux pela rede local. Captura em X11 ou Wayland, encode H.264, transporte por WebSocket e decode por MediaCodec no aparelho.",
    stack: ["Python", "Kotlin", "FFmpeg", "H.264", "WebSocket", "MediaCodec", "TLS"],
    problem:
      "Eu tinha um tablet parado e queria usar como segundo monitor no Linux. As soluções existentes ou eram pagas, ou só espelhavam a tela principal, ou não funcionavam em Wayland. Espelhar é fácil; monitor de verdade — com área de trabalho própria — é outro problema.",
    approach: [
      "O servidor captura a tela, encoda em H.264 com preset ultrafast e tune zerolatency, separa o stream Annex-B em NAL units individuais e envia cada uma como mensagem binária no WebSocket. O cliente Android alimenta o MediaCodec e desenha em tela cheia.",
      "O backend de captura é detectado sozinho: x11grab no X11, grim via wlr-screencopy no Wayland — testado no Hyprland. Sem configuração manual para escolher.",
      "Para segundo monitor de verdade, o servidor cria um monitor virtual headless no compositor e transmite só o conteúdo dele. O tablet vira uma área de trabalho separada em vez de uma cópia da tela principal.",
      "A latência foi trabalho de detalhe acumulado: ajuste de bitrate e resolução de encode, GOP curto, Nagle desativado no socket, e correção de ghosting no reconector do decoder. O broadcast envia a todos os clientes em paralelo — um aparelho lento não segura mais os outros.",
    ],
    diagram: `┌──────────────────────────┐
│         Linux PC          │
│  Captura (X11 / Wayland)   │
│         ↓                  │
│  Encode H.264 (ffmpeg)      │
│         ↓                   │
│  WebSocket (NAL units)       │
└────────────┬─────────────────┘
             │ Wi-Fi / LAN
             ▼
┌──────────────────────────┐
│      Android / Tablet     │
│  Decode (MediaCodec)       │
│         ↓                  │
│  Tela cheia + áudio AAC     │
└──────────────────────────┘`,
    decisions: [
      {
        title: "WebSocket em vez de WebRTC",
        body: "WebRTC resolveria NAT traversal e controle de congestionamento, mas o cenário é rede local. Pagar a complexidade de signaling e ICE para um caso onde os dois lados se enxergam direto não se justificava.",
      },
      {
        title: "TLS com trust-on-first-use",
        body: "Certificado autoassinado com pinning de fingerprint no Android, no mesmo modelo de host key do SSH. Emitir certificado válido para IP de rede local não é prático — TOFU dá proteção real contra man-in-the-middle depois do primeiro pareamento.",
      },
      {
        title: "Comparação de token timing-safe",
        body: "A autenticação por token compartilhado compara em tempo constante. Detalhe pequeno, mas comparação ingênua vazaria o token por diferença de tempo de resposta.",
      },
      {
        title: "Input remoto: bloqueado e documentado",
        body: "Investiguei controlar mouse e teclado do PC pelo tablet. Esbarra em acesso root que este ambiente não tem. Deixei registrado no README como investigado e bloqueado, em vez de anunciar no roadmap uma coisa que não vai sair.",
      },
    ],
    evidence: [
      { label: "Testes", value: "pytest no servidor — parsing de NAL units, auth, broadcast" },
      { label: "CI", value: "GitHub Actions compila o APK a cada push" },
      { label: "Distribuição", value: "APK pronto nas releases do GitHub" },
      { label: "Validação", value: "testado ponta a ponta em aparelho real" },
    ],
    learned:
      "Latência não caiu com uma solução — caiu com seis pequenas somadas. Foi a primeira vez que precisei medir antes de otimizar, porque cada palpite meu sobre a origem do atraso estava errado. Também foi onde aprendi que 'não vou fazer, e o motivo é este' é uma entrada de README melhor que silêncio.",
  },
] as const;

export interface SideProject {
  readonly repo: string;
  readonly name: string;
  readonly summary: string;
  readonly stack: readonly string[];
}

/** Projetos menores: entram na lista, não ganham página própria. */
export const sideProjects: readonly SideProject[] = [
  {
    repo: "projeto-n8n",
    name: "Pipeline n8n + Discord",
    summary:
      "Stack de automação em docker-compose: n8n orquestrando os fluxos, API própria em FastAPI e bot de Discord como interface. Schema versionado com migrations.",
    stack: ["n8n", "FastAPI", "Discord.js", "Docker Compose"],
  },
  {
    repo: "shimeji-ia-",
    name: "Shimeji IA",
    summary:
      "Assistente de desktop que vive na tela como pet virtual e faz code review por visão computacional. Arquitetura reescrita para ser assíncrona e thread-safe.",
    stack: ["Python", "Tkinter", "Groq", "Llama 3"],
  },
] as const;

export function repoUrl(repo: string): string {
  return `https://github.com/${GITHUB_USER}/${repo}`;
}

export function findCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((project) => project.slug === slug);
}
