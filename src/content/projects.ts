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
    "slug": "jobpilot-ai",
    "repo": "jobpilot-ai",
    "name": "JobPilot AI",
    "tagline": "Busca de vagas, análise de currículo e acompanhamento de candidaturas em uma plataforma.",
    "status": "em desenvolvimento",
    "role": "Projeto pessoal — desenvolvimento e integração de funcionalidades",
    "stack": [
      "Python",
      "FastAPI",
      "Next.js",
      "PostgreSQL",
      "Celery",
      "Redis",
      "Docker"
    ],
    "summary": "Plataforma de carreira com busca semântica, análise de compatibilidade e organização de candidaturas. Integra diferentes provedores de IA e oferece um analisador local para funcionar sem chave de API.",
    "problem": "A busca por oportunidades envolve reunir vagas, comparar requisitos e acompanhar candidaturas em várias ferramentas. O projeto concentra esse processo em um fluxo único.",
    "approach": [
      "A API em FastAPI reúne autenticação, vagas, currículos, agenda e candidaturas. O frontend em Next.js apresenta o pipeline e as análises em uma interface integrada.",
      "Workers Celery executam ingestão de vagas, análises e notificações em segundo plano. PostgreSQL mantém os dados e Redis apoia filas e cache.",
      "A análise pode usar um provedor de LLM ou um analisador local. A busca usa embeddings de API compatível ou vetorização local, com ranqueamento em NumPy. A demonstração pública utiliza dados capturados; upload, chat e coleta externa dependem do backend."
    ],
    "decisions": [
      {
        "title": "Provedores intercambiáveis",
        "body": "A integração suporta OpenAI, Anthropic, Gemini, NVIDIA NIM, Ollama e OpenRouter. As chaves são criptografadas com Fernet antes da persistência."
      },
      {
        "title": "Operação sem chave de API",
        "body": "O analisador local calcula compatibilidade e compõe textos com os dados disponíveis. Ele permite explorar o produto com resultados mais simples que os de um LLM."
      }
    ],
    "evidence": [
      {
        "label": "Demonstração",
        "value": "Interface navegável com dados de demonstração documentada no README."
      },
      {
        "label": "Qualidade",
        "value": "README documenta testes de backend e CI com lint, build e gate de cobertura."
      },
      {
        "label": "Infraestrutura",
        "value": "Docker Compose, migrations e guias de implantação."
      },
      {
        "label": "Autenticação",
        "value": "Login, sessões e integração com LinkedIn OAuth."
      }
    ],
    "learned": "O projeto reúne prática de APIs, processamento assíncrono e integração com IA. O principal desafio de engenharia é manter as funções essenciais utilizáveis mesmo quando um provedor externo não está configurado."
  },
  {
    "slug": "cyberhub-ai",
    "repo": "cyber-Hub",
    "name": "CyberHub AI",
    "tagline": "Dashboard, automação e inteligência de ameaças conectados por uma API.",
    "status": "em desenvolvimento",
    "role": "Projeto pessoal — desenvolvimento e integração de funcionalidades",
    "stack": [
      "NestJS",
      "Next.js",
      "PostgreSQL",
      "Prisma",
      "Redis",
      "BullMQ",
      "n8n",
      "Ollama"
    ],
    "summary": "Central full stack que reúne consultas de segurança, relatórios e alertas. Conecta dashboard web, bot de Discord e workflows n8n a uma API NestJS, com IA local para contextualizar informações.",
    "problem": "Consultar vulnerabilidades, reputação de endereços e notícias em fontes diferentes dificulta acompanhar o histórico e organizar alertas. A proposta é reunir essas informações e automatizar consultas recorrentes.",
    "approach": [
      "O monorepo separa dashboard Next.js, API NestJS/Fastify e bot de Discord. Pacotes compartilhados organizam tipos, banco de dados e utilitários.",
      "As integrações consultam NVD, CISA e serviços de inteligência de ameaças. Workflows n8n executam rotinas externas e a fila BullMQ processa tarefas internas, como relatórios.",
      "A camada de IA usa Ollama para explicar informações em português. Decisões e alternativas de arquitetura são registradas em ADR. O repositório mantém o projeto identificado como em desenvolvimento."
    ],
    "decisions": [
      {
        "title": "API como ponto de integração",
        "body": "Dashboard e bot consomem a mesma API, concentrando regras de negócio e controle de acesso."
      },
      {
        "title": "Filas e workflows com papéis distintos",
        "body": "BullMQ cuida de jobs da aplicação; n8n organiza integrações agendadas. Webhooks usam assinatura HMAC."
      }
    ],
    "evidence": [
      {
        "label": "Arquitetura",
        "value": "ADR e estrutura do monorepo documentados."
      },
      {
        "label": "Acesso",
        "value": "JWT em cookie httpOnly, RBAC e autenticação por API key."
      },
      {
        "label": "CI",
        "value": "Workflow de typecheck e build."
      },
      {
        "label": "Operação",
        "value": "Docker Compose e configuração de serviços documentados."
      }
    ],
    "learned": "O projeto exercita organização de monorepos, autenticação e comunicação entre serviços. A documentação das decisões torna mais claro como cada componente contribui para o sistema."
  },
  {
    "slug": "code-analyzer-ai",
    "repo": "code-analyzer-ai",
    "name": "Code Analyzer AI",
    "tagline": "API Java para revisão de código assistida por IA local.",
    "status": "em desenvolvimento",
    "role": "Projeto pessoal — desenvolvimento e integração de funcionalidades",
    "stack": [
      "Java",
      "Spring Boot",
      "WebFlux",
      "Ollama",
      "SSE",
      "OpenAPI"
    ],
    "summary": "API REST em Java e Spring Boot que recebe código, identifica a linguagem e gera sugestões sobre qualidade, segurança e manutenção. Usa Ollama e oferece respostas em streaming com SSE.",
    "problem": "Revisar código envolve identificar problemas e explicar possíveis melhorias. O projeto transforma essa análise em uma API que pode ser integrada a outras ferramentas de desenvolvimento.",
    "approach": [
      "Controllers recebem as requisições e serviços separam detecção de linguagem, análise e comunicação com o Ollama. DTOs organizam entradas, resultados e erros.",
      "As respostas apresentam problemas, severidades e sugestões de alteração. Um endpoint SSE transmite a saída progressivamente, enquanto Swagger/OpenAPI documenta o contrato da API.",
      "As avaliações são sugestões geradas por um modelo de linguagem e precisam de revisão humana; não substituem testes ou análise estática."
    ],
    "decisions": [
      {
        "title": "IA local com Ollama",
        "body": "Permite executar a análise com um modelo no ambiente configurado pelo desenvolvedor."
      },
      {
        "title": "Serviços e contratos separados",
        "body": "A divisão entre controller, DTOs e serviços facilita entender o fluxo e alterar integrações."
      }
    ],
    "evidence": [
      {
        "label": "API",
        "value": "Endpoints de análise, streaming, detecção de linguagem e health check."
      },
      {
        "label": "Documentação",
        "value": "Swagger/OpenAPI e exemplos de requisição no README."
      },
      {
        "label": "Stack",
        "value": "Java 17, Spring Boot e WebFlux."
      },
      {
        "label": "Erros",
        "value": "Handler global e exceções específicas para integração com IA."
      }
    ],
    "learned": "O projeto aplica fundamentos de Java e Spring em um serviço integrado a LLMs, com atenção a contratos de API, tratamento de falhas e entrega progressiva de respostas."
  },
  {
    "slug": "shimeji-ia",
    "repo": "shimeji-ia-",
    "name": "Shimeji IA",
    "tagline": "Assistente de desktop com voz, memória e análise de tela.",
    "status": "em desenvolvimento",
    "role": "Projeto pessoal — desenvolvimento e integração de funcionalidades",
    "stack": [
      "Python",
      "Tkinter",
      "Groq",
      "Threading",
      "pytest"
    ],
    "summary": "Assistente visual de desktop que combina comandos de voz, notas, alarmes e integração com IA. Analisa a tela, auxilia na revisão de código e permite adicionar habilidades em Python.",
    "problem": "Comandos simples, lembretes e dúvidas de programação interrompem o fluxo de trabalho. A proposta é oferecer um assistente acessível na própria área de trabalho.",
    "approach": [
      "A aplicação separa interface, comandos, memória, voz e integração com IA em módulos. Funções básicas ficam disponíveis sem depender de um modelo remoto.",
      "Voz, alarmes e tarefas demoradas trabalham fora da thread da interface. Um despachante encaminha atualizações para o laço principal do Tkinter.",
      "A análise de tela usa captura e modelos de visão. O modo de demonstração permite observar um roteiro sem rede ou microfone; funcionalidades de IA dependem da configuração do provedor."
    ],
    "decisions": [
      {
        "title": "Interface atualizada na thread principal",
        "body": "Workers publicam ações para o despachante, evitando acesso direto a widgets Tkinter."
      },
      {
        "title": "Lógica testável sem janela",
        "body": "Comandos, memória e cálculo são separados da interface, facilitando a validação automatizada."
      }
    ],
    "evidence": [
      {
        "label": "Demonstração",
        "value": "Modo --demo, GIF e capturas disponíveis no repositório."
      },
      {
        "label": "Testes",
        "value": "Suíte pytest e relatório de cobertura documentados no README."
      },
      {
        "label": "Extensão",
        "value": "Habilidades carregadas a partir de módulos Python."
      },
      {
        "label": "Segurança",
        "value": "Validação de comandos e auto-modificação desativada por padrão."
      }
    ],
    "learned": "A aplicação conecta concorrência, interface gráfica e serviços de IA. A separação entre lógica e interface é essencial para manter o desktop responsivo e tornar o comportamento testável."
  },
  {
    "slug": "cybersecurity-ai",
    "repo": "cybersecurity-assistant",
    "name": "Cybersecurity AI",
    "tagline": "Assistente de cibersegurança para estudos e auditorias em ambientes autorizados.",
    "status": "em desenvolvimento",
    "role": "Projeto pessoal — desenvolvimento e integração de funcionalidades",
    "stack": [
      "Python",
      "FastAPI",
      "Ollama",
      "SQLite",
      "SSE",
      "Electron"
    ],
    "summary": "Assistente para Linux com agentes de IA, diagnóstico de sistema e ferramentas de auditoria. Reúne chat, voz, dashboard e registros de execução, com modos configuráveis de operação.",
    "problem": "Interpretar saídas de ferramentas e acompanhar o estado do sistema exige alternar entre terminal, documentação e relatórios. O assistente integra essas tarefas em uma interface contextual.",
    "approach": [
      "FastAPI expõe chat em streaming, ferramentas e dados do sistema. Agentes especializados organizam pedidos e usam modelos locais ou provedores configuráveis para interpretar resultados.",
      "No modo assistido, ações de auditoria ativa passam por aprovação humana. O projeto também oferece modos de leitura e avançado; o comportamento depende da configuração. O escopo de alvos é opcional e deve ser configurado para o uso pretendido.",
      "A aplicação mantém logs, memória em SQLite e alertas de monitoramento. O overlay em Electron conecta a personagem à interação por voz e ao estado do sistema. O README ressalta que o projeto ainda não é estável para produção."
    ],
    "decisions": [
      {
        "title": "Modos de operação explícitos",
        "body": "A distinção entre leitura, assistência e modo avançado deixa a autonomia dependente da configuração, sem apresentar a aprovação como garantia universal."
      },
      {
        "title": "Registro e acompanhamento",
        "body": "Histórico de ferramentas, alertas e relatórios permitem acompanhar o que ocorreu durante a utilização."
      }
    ],
    "evidence": [
      {
        "label": "Demonstração",
        "value": "Demo estática documentada; não executa ferramentas no navegador."
      },
      {
        "label": "Testes",
        "value": "Suíte de testes e gate de cobertura documentados."
      },
      {
        "label": "Interface",
        "value": "Chat SSE, dashboard e overlay de desktop."
      },
      {
        "label": "Estado",
        "value": "Em desenvolvimento ativo; utilização em ambientes próprios ou autorizados."
      }
    ],
    "learned": "O projeto explora orquestração de agentes, integração com ferramentas e interação em tempo real. Também evidencia a importância de documentar corretamente permissões, limites e modos de execução."
  },
  {
    "slug": "linuxdesk",
    "repo": "LinuxDesk",
    "name": "LinuxDesk",
    "tagline": "Streaming de tela do Linux para Android pela rede local.",
    "status": "em desenvolvimento",
    "role": "Projeto pessoal — desenvolvimento e integração de funcionalidades",
    "stack": [
      "Python",
      "Kotlin",
      "FFmpeg",
      "WebSocket",
      "H.264",
      "MediaCodec"
    ],
    "summary": "Transforma um dispositivo Android em tela para um PC Linux. Integra captura em X11 ou Wayland, transmissão por WebSocket e decodificação no Android, com suporte a monitor virtual no Hyprland.",
    "problem": "Reutilizar um tablet como monitor exige capturar, transmitir e exibir vídeo com estabilidade. O projeto explora esse fluxo em Linux e Android pela rede local.",
    "approach": [
      "O servidor Python captura a tela e usa FFmpeg para codificar vídeo H.264. Os dados são agrupados em frames completos antes de seguir pelo WebSocket.",
      "O cliente Kotlin utiliza MediaCodec para exibir o vídeo. Filas independentes por cliente impedem que uma conexão lenta bloqueie os demais dispositivos.",
      "No Hyprland, um monitor virtual permite estender a área de trabalho. Token e TLS são opcionais; áudio tem suporte experimental e controle remoto de mouse e teclado continua pendente."
    ],
    "decisions": [
      {
        "title": "Frames completos no transporte",
        "body": "Agrupar as unidades NAL de cada frame evita atribuir instantes diferentes a partes da mesma imagem."
      },
      {
        "title": "Filas por cliente",
        "body": "Cada conexão mantém seu próprio backlog, com descarte de frames antigos para controlar o acúmulo."
      }
    ],
    "evidence": [
      {
        "label": "Servidor",
        "value": "Captura, configuração, framing e distribuição em módulos separados."
      },
      {
        "label": "Qualidade",
        "value": "Testes Python e CI de build/lint Android documentados."
      },
      {
        "label": "Compatibilidade",
        "value": "Suporte documentado a X11 e Wayland/wlroots."
      },
      {
        "label": "Limitações",
        "value": "Sem input remoto; TLS opcional com trust-on-first-use."
      }
    ],
    "learned": "O projeto combina redes, concorrência e processamento de mídia. As decisões de framing e filas mostram como detalhes de protocolo influenciam a estabilidade da aplicação."
  }
] as const;

export interface SideProject {
 readonly repo: string;
 readonly name: string;
 readonly summary: string;
 readonly stack: readonly string[];
}

export const sideProjects: readonly SideProject[] = [
  {
    "repo": "saas-starter",
    "name": "DropShip SaaS",
    "summary": "Projeto de plataforma para automação de dropshipping, com API FastAPI, interface Next.js, integrações Shopify e Stripe e tarefas assíncronas com Celery. A estrutura inclui Docker, Nginx e migrations.",
    "stack": [
      "FastAPI",
      "Next.js",
      "PostgreSQL",
      "Celery",
      "Stripe"
    ]
  },
  {
    "repo": "projeto-n8n",
    "name": "Pipeline n8n + Discord",
    "summary": "Projeto de integração entre workflows n8n, API FastAPI e bot de Discord, com serviços organizados em Docker Compose.",
    "stack": [
      "n8n",
      "FastAPI",
      "Discord.js",
      "Docker Compose"
    ]
  }
] as const;

export function repoUrl(repo: string): string { return `https://github.com/${GITHUB_USER}/${repo}`; }
export function findCaseStudy(slug: string): CaseStudy | undefined { return caseStudies.find((project) => project.slug === slug); }
