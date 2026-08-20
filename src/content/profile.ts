// Texto e dados do portfólio. Edite aqui — nenhum componente tem conteúdo fixo.
export const GITHUB_USER = "blackxzin";

export const profile = {
  name: "Lucas Gabriel",
  role: "Automação · Segurança defensiva · IA aplicada",
  location: "Brasil · aberto a remoto",
  status: "Disponível para estágio",
  handle: `~/${GITHUB_USER}`,
  intro:
    "Estudo Análise e Desenvolvimento de Sistemas na UniCesumar e construo sistemas que rodam sozinhos: agentes com LLM local, pipelines de automação em n8n, APIs em FastAPI e ferramentas de auditoria defensiva — tudo containerizado, tudo com log para ler depois.",
} as const;

export interface Section {
  readonly id: string;
  readonly index: string;
  readonly title: string;
  /** Comando exibido no cabeçalho da seção — carrega o tom de terminal. */
  readonly command: string;
}

export const sections: readonly Section[] = [
  { id: "sobre", index: "01", title: "Sobre", command: "whoami" },
  { id: "stack", index: "02", title: "Stack", command: "stack --list" },
  { id: "trabalho", index: "03", title: "Como trabalho", command: "cat principios.md" },
  { id: "projetos", index: "04", title: "Projetos", command: "ls -la ~/projetos" },
  { id: "metas", index: "05", title: "Metas", command: "git log --oneline" },
  { id: "contato", index: "06", title: "Contato", command: "ssh contato" },
] as const;

export const about = {
  paragraphs: [
    "Comecei automatizando o que me irritava: relatório montado à mão toda segunda, dado copiado de um sistema para outro, tarefa que alguém repete sem pensar. Quase sempre existe um jeito de a máquina fazer — e é aí que eu gosto de estar.",
    "Hoje isso virou algo maior. Rodo modelos localmente com Ollama, escrevo agentes que decidem qual ferramenta usar, ligo tudo em fluxos n8n e subo cada peça em container. Na parte de segurança meu foco é defensivo: reconhecimento, análise de logs e threat intel — sempre com aprovação humana antes de qualquer ação ativa.",
    "Aprendo com a mão no teclado. Subo o serviço, quebro de propósito, leio o stack trace, entendo por que quebrou e arrumo. É mais lento que assistir aula, e é o único jeito que fixa.",
    "Nunca trabalhei formalmente na área — é exatamente isso que procuro: entrar num time, pegar tarefa de verdade, entregar com revisão e aprender com quem já faz isso todo dia.",
  ],
  facts: [
    { label: "Formação", value: "ADS · UniCesumar (em curso)" },
    { label: "Base", value: "Brasil — aberto a remoto" },
    { label: "Procurando", value: "Estágio em dev, automação ou segurança" },
    { label: "Foco atual", value: "Agentes de IA, n8n e segurança defensiva" },
  ],
} as const;

export interface StackGroup {
  readonly label: string;
  readonly note: string;
  readonly items: readonly string[];
}

export const stack: readonly StackGroup[] = [
  {
    label: "Domínio",
    note: "Já escrevi projeto inteiro com isso e me viro sem ajuda.",
    items: ["Python", "FastAPI", "Docker", "n8n", "Git", "JavaScript", "Linux", "Ollama / LLMs locais"],
  },
  {
    label: "Uso com consulta",
    note: "Entrego, mas ainda abro a documentação no meio do caminho.",
    items: ["TypeScript", "Next.js", "NestJS", "PostgreSQL", "Redis", "Java", "APIs REST", "Kotlin"],
  },
  {
    label: "Estudando agora",
    note: "É o que está em cima da mesa nos próximos meses.",
    items: ["Testes automatizados", "CI/CD", "pgvector / RAG", "Observabilidade", "Hardening de Linux"],
  },
] as const;

export interface WorkPrinciple {
  readonly title: string;
  readonly body: string;
}

export const work: readonly WorkPrinciple[] = [
  {
    title: "Automatizo o que se repete",
    body: "Tarefa que acontece toda semana do mesmo jeito vira script ou workflow. Ligar API, banco e notificação numa cadeia que roda sozinha é o tipo de problema que eu procuro.",
  },
  {
    title: "Humano no circuito",
    body: "Ferramenta que faz varredura, apaga ou dispara não executa sozinha. Ela pede aprovação, mostra o comando exato e registra quem confirmou. Automação sem freio é incidente esperando data.",
  },
  {
    title: "Ambiente igual para todo mundo",
    body: "Docker desde o primeiro commit. Prefiro gastar meia hora num Dockerfile a gastar dois dias descobrindo por que só funciona na minha máquina.",
  },
  {
    title: "Leio o erro antes de chutar",
    body: "Stack trace, log, menor caso reproduzível. É mais lento nos primeiros dez minutos e economiza o resto do dia.",
  },
  {
    title: "Segredo nunca vai para o repositório",
    body: "Variável de ambiente, .env fora do git, chave rotacionada se vazar. Custa nada fazer certo desde o começo e custa caro consertar depois.",
  },
  {
    title: "Pergunto cedo",
    body: "Prefiro travar vinte minutos e perguntar a travar dois dias e entregar errado. Estou no começo e trato isso como informação, não como vergonha.",
  },
] as const;

export interface Milestone {
  readonly when: string;
  readonly title: string;
  readonly body: string;
}

export const milestones: readonly Milestone[] = [
  {
    when: "Agora",
    title: "Primeiro estágio",
    body: "Entrar num time real, pegar o bug pequeno, entender o fluxo de um projeto que já existe e chegar na daily com algo pronto.",
  },
  {
    when: "Próximo",
    title: "Desenvolvedor júnior",
    body: "Entregar feature de ponta a ponta com revisão, escrever teste para o que eu mando e ter opinião fundamentada em code review.",
  },
  {
    when: "Longo prazo",
    title: "Engenharia sênior",
    body: "Desenhar solução, medir o que ela custa em produção e destravar quem chegar depois de mim.",
  },
] as const;

export interface Contact {
  readonly label: string;
  readonly value: string;
  readonly href: string;
}

export const contacts: readonly Contact[] = [
  { label: "Email", value: "lucasgabriel4331@gmail.com", href: "mailto:lucasgabriel4331@gmail.com" },
  { label: "WhatsApp", value: "(14) 99611-2048", href: "https://wa.me/5514996112048" },
  { label: "GitHub", value: `github.com/${GITHUB_USER}`, href: `https://github.com/${GITHUB_USER}` },
  { label: "LinkedIn", value: "/in/lucas-gabriel", href: "https://www.linkedin.com/in/lucas-gabriel-787b19334/" },
] as const;
