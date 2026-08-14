// Texto e dados do portfólio. Edite aqui — nenhum componente tem conteúdo fixo.
export const GITHUB_USER = "blackxzin";

export const profile = {
  name: "Lucas Gabriel",
  role: "Desenvolvimento · Automação de processos",
  location: "Brasil · aberto a remoto",
  status: "Procurando estágio",
  intro:
    "Estudo Análise e Desenvolvimento de Sistemas na UniCesumar e passo o tempo livre construindo coisas que tiram trabalho repetitivo da frente: integração entre APIs, fluxos no n8n e serviços pequenos rodando em Docker.",
} as const;

export interface Section {
  readonly id: string;
  readonly index: string;
  readonly title: string;
}

export const sections: readonly Section[] = [
  { id: "sobre", index: "01", title: "Sobre" },
  { id: "stack", index: "02", title: "Stack" },
  { id: "trabalho", index: "03", title: "Como trabalho" },
  { id: "projetos", index: "04", title: "Projetos" },
  { id: "metas", index: "05", title: "Metas" },
  { id: "contato", index: "06", title: "Contato" },
] as const;

export const about = {
  paragraphs: [
    "O que me prende na programação é justamente a parte chata do trabalho: aquele relatório que alguém precisa montar manualmente toda segunda-feira, ou o dado que precisa ser transferido de um sistema para outro. Na maioria das vezes, existe uma forma de automatizar — e é aí que eu gosto de estar.",
    "Estudo Análise e Desenvolvimento de Sistemas na UniCesumar e gosto de aprender colocando a mão no código. Subo containers, testo, quebro coisas, leio logs, descubro o problema e arrumo. É mais lento do que apenas assistir a uma aula, mas é assim que o conhecimento fica.",
    "Ainda não trabalhei profissionalmente na área, e é justamente isso que estou procurando: uma oportunidade para fazer parte de um time, assumir tarefas, entregar bem e aprender com pessoas que já vivem isso no dia a dia.",
    "Meu objetivo é transformar o que estudo em soluções que realmente funcionem.",
  ],
  facts: [
    { label: "Formação", value: "ADS · UniCesumar (em curso)" },
    { label: "Base", value: "Brasil — aberto a remoto" },
    { label: "Procurando", value: "Estágio em desenvolvimento ou automação" },
    { label: "Foco de estudo", value: "Automação, integração e arquitetura" },
  ],
} as const;

export interface StackGroup {
  readonly label: string;
  readonly note: string;
  readonly items: readonly string[];
}

export const stack: readonly StackGroup[] = [
  {
    label: "Uso com frequência",
    note: "Já escrevi projeto inteiro com isso e me viro sozinho.",
    items: ["Python", "Java", "JavaScript", "HTML", "CSS", "Git", "Docker", "n8n"],
  },
  {
    label: "Uso com consulta",
    note: "Entrego, mas ainda abro a documentação no meio do caminho.",
    items: ["TypeScript", "React", "SQL", "APIs REST", "Linux", "Banco de dados"],
  },
  {
    label: "Estudando agora",
    note: "É o que está em cima da mesa nos próximos meses.",
    items: ["Next.js", "Testes automatizados", "Integração de LLMs", "CI/CD"],
  },
] as const;

export interface WorkPrinciple {
  readonly title: string;
  readonly body: string;
}

export const work: readonly WorkPrinciple[] = [
  {
    title: "Automatizo o que se repete",
    body: "Tarefa que acontece toda semana do mesmo jeito vira script ou fluxo. Ligar planilha, API e notificação numa cadeia que roda sozinha é o tipo de problema que eu procuro.",
  },
  {
    title: "Ambiente igual para todo mundo",
    body: "Docker desde cedo. Prefiro gastar meia hora escrevendo um Dockerfile a gastar dois dias descobrindo por que só funciona na minha máquina.",
  },
  {
    title: "Leio o erro antes de chutar",
    body: "Stack trace, log, reproduzir o menor caso possível. É mais lento no começo e economiza o resto.",
  },
  {
    title: "Pergunto cedo",
    body: "Prefiro travar por vinte minutos e perguntar a travar por dois dias e entregar errado. Estou no começo e sei disso.",
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
    body: "Entrar num time real, pegar bug pequeno, entender o fluxo de um projeto que já existe e chegar na daily com algo feito.",
  },
  {
    when: "Próximo passo",
    title: "Desenvolvedor júnior",
    body: "Entregar feature de ponta a ponta com revisão, escrever teste para o que eu mando e ter opinião fundamentada em code review.",
  },
  {
    when: "Longo prazo",
    title: "Dev Sênior",
    body: "Desenhar solução, medir o que ela custa em produção e ajudar quem chegar depois de mim.",
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
