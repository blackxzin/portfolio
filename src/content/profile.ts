// Conteúdo profissional compartilhado pela home, currículo e metadados.
export const GITHUB_USER = "blackxzin";

export const profile = {
  "name": "Lucas Gabriel",
  "fullName": "Lucas Gabriel Barros de Oliveira",
  "role": "Engenheiro de Software · Back-end · IA aplicada",
  "location": "Santa Bárbara d’Oeste, SP · aberto a remoto",
  "status": "Aberto a oportunidades",
  "handle": "~/blackxzin",
  "intro": "Atuo como Engenheiro de Software na Ferreira Advocacia e curso Análise e Desenvolvimento de Sistemas na UniCesumar. Desenvolvo sistemas e projetos com foco em back-end, aplicações web e automação, integrando Python, Java, TypeScript e inteligência artificial.",
  "heroDescription": "Desenvolvo APIs, aplicações web e automações com Python, Java e TypeScript. Meus projetos conectam inteligência artificial, bancos de dados e infraestrutura Linux para resolver problemas do dia a dia.",
  "contactIntro": "Estou aberto a conversar sobre oportunidades em desenvolvimento back-end, full stack, DevOps e inteligência artificial. Posso contribuir com a criação de APIs, integração de serviços e automação de processos. Vamos falar sobre o que seu time está construindo?"
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
  "paragraphs": [
    "Sou Lucas Gabriel Barros de Oliveira, estudante de Análise e Desenvolvimento de Sistemas na UniCesumar, com conclusão prevista para 2029. Desde setembro de 2026, atuo como Engenheiro de Software na Ferreira Advocacia, com desenvolvimento e criação de sistemas. Também mantenho projetos pessoais no GitHub, nos quais exploro APIs, interfaces web e integrações entre serviços.",
    "Meu foco é back-end: modelagem de dados, autenticação, regras de negócio e processamento assíncrono. Uso Python com FastAPI, Java com Spring Boot e TypeScript com NestJS, além de React e Next.js para construir as interfaces que conectam essas funcionalidades ao usuário.",
    "A inteligência artificial faz parte dos meus projetos e do meu processo de aprendizado. Integro APIs de diferentes provedores e modelos locais com Ollama, explorando busca semântica, análise de código e assistentes de desktop. Uso ferramentas como Copilot, Claude e ChatGPT como apoio ao desenvolvimento, com revisão e validação das soluções.",
    "Tenho familiaridade com Windows e Linux, incluindo Arch Linux e Kali Linux. Meu interesse por segurança aparece nos estudos de autenticação, análise de ameaças e auditoria em ambientes autorizados. Quero ampliar essa experiência em projetos que valorizem colaboração, revisão de código e aprendizado contínuo."
  ],
  "facts": [
    {
      "label": "Formação",
      "value": "ADS · UniCesumar · em curso"
    },
    {
      "label": "Conclusão prevista",
      "value": "2029"
    },
    {
      "label": "Localização",
      "value": "Santa Bárbara d’Oeste, SP"
    },
    {
      "label": "Atuação atual",
      "value": "Engenheiro de Software · Ferreira Advocacia"
    }
  ]
} as const;

export interface StackGroup {
  readonly label: string;
  readonly note: string;
  readonly items: readonly string[];
}

export const stack: readonly StackGroup[] = [
  {
    "label": "Back-end e dados",
    "note": "Tecnologias utilizadas nos projetos de APIs, persistência e processamento assíncrono.",
    "items": [
      "Python",
      "FastAPI",
      "Java",
      "Spring Boot",
      "Node.js",
      "NestJS",
      "PostgreSQL",
      "Redis",
      "APIs REST"
    ]
  },
  {
    "label": "Front-end e aplicações web",
    "note": "Interfaces conectadas às APIs, com componentes e tipagem.",
    "items": [
      "TypeScript",
      "JavaScript",
      "React",
      "Next.js",
      "HTML",
      "CSS"
    ]
  },
  {
    "label": "Infraestrutura e automação",
    "note": "Ambientes em containers, integração de serviços e tarefas em segundo plano.",
    "items": [
      "Docker",
      "Docker Compose",
      "Nginx",
      "Git / GitHub",
      "Linux (Arch / Kali)",
      "Vercel",
      "n8n",
      "Celery",
      "BullMQ"
    ]
  },
  {
    "label": "Inteligência artificial",
    "note": "Integrações com modelos locais e APIs, busca semântica e respostas em streaming.",
    "items": [
      "Ollama",
      "OpenAI",
      "Anthropic",
      "Gemini",
      "NVIDIA NIM",
      "Groq",
      "Embeddings",
      "SSE"
    ]
  }
] as const;

export interface WorkPrinciple {
  readonly title: string;
  readonly body: string;
}

export const work: readonly WorkPrinciple[] = [
  {
    "title": "Entender antes de implementar",
    "body": "Organizo o problema em requisitos e responsabilidades para definir a API, os dados e as integrações necessárias. Registro decisões de arquitetura para facilitar a evolução do projeto."
  },
  {
    "title": "Separar responsabilidades",
    "body": "Estruturo aplicações em camadas, com validação de entrada, serviços e acesso a dados. Essa organização facilita a leitura, os testes e a manutenção."
  },
  {
    "title": "Tratar segurança como requisito",
    "body": "Considero autenticação, controle de acesso, validação e proteção de credenciais durante o desenvolvimento. Em projetos de auditoria, o uso deve respeitar o ambiente e o escopo autorizados."
  },
  {
    "title": "Automatizar tarefas repetitivas",
    "body": "Uso filas, workers e workflows para integrar serviços e processar tarefas demoradas fora do ciclo de uma requisição, mantendo a aplicação responsiva."
  },
  {
    "title": "Validar e documentar",
    "body": "Investigo erros com logs, acrescento testes nos projetos e documento configuração e execução. Busco deixar o código compreensível para quem for utilizá-lo ou contribuir."
  },
  {
    "title": "Aprender em colaboração",
    "body": "Valorizo revisão de código, comunicação clara e feedback. Tenho iniciativa para pesquisar e experimentar, e procuro ajuda quando preciso esclarecer uma decisão técnica."
  }
] as const;

export interface Milestone {
  readonly when: string;
  readonly title: string;
  readonly body: string;
}

export const milestones: readonly Milestone[] = [
  {
    "when": "Agora",
    "title": "Desenvolvimento de sistemas",
    "body": "Atuar na criação de sistemas na Ferreira Advocacia e continuar evoluindo os projetos pessoais que aprofundam minha prática de desenvolvimento."
  },
  {
    "when": "Próximo passo",
    "title": "Aprofundar engenharia de software",
    "body": "Evoluir em testes, arquitetura, integração contínua e observabilidade, entendendo como manter aplicações além do ambiente de desenvolvimento."
  },
  {
    "when": "Direção",
    "title": "Back-end, infraestrutura e IA",
    "body": "Construir uma carreira conectando APIs, dados e automação, com atenção à segurança, à manutenção e às necessidades de quem usa o software."
  }
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

export const experience = [
  {
    "company": "Ferreira Advocacia",
    "role": "Engenheiro de Software",
    "period": "Setembro de 2026 — atual",
    "location": "Itaí, São Paulo · presencial",
    "description": "Desenvolvimento e criação de sistemas para o escritório.",
    "skills": [
      "Sistemas de informação computacionais",
      "Infraestrutura de tecnologia da informação"
    ]
  }
] as const;
