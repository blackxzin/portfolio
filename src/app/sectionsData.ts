export interface IconData {
  id: string;
  src: string;
  x: number; // Percentage of screen width (0-100)
  y: number; // Percentage of screen height (0-100)
  width: number; // Width in px
  blur: number; // Blur in px
  rotation: number; // Rotation angle in deg
  floatDuration: number; // Speed of floating animation in seconds
  floatDistance: number; // Distance of floating animation in px
}

export interface BrandPosition {
  x: number; // Offset X relative to pet center (px)
  y: number; // Offset Y relative to pet center (px)
  rotation: number; // Rotation in deg
  scale: number; // Scale factor
  flipX: boolean; // Mirror horizontally
}

export interface SectionData {
  id: string;
  name: string;
  titleDisplay: string;
  bgColor: string;
  patternSrc: string;
  tagline: string;
  skills: string[];
  icons: IconData[];
  badgePos: BrandPosition;
  codeTagPos: BrandPosition;
}

export const sectionsData: SectionData[] = [
  {
    id: "estagio",
    name: "Estágio",
    titleDisplay: "ESTÁGIO EM DESENVOLVIMENTO",
    bgColor: "#BFE3FF",
    patternSrc: "/pattern-frontend.png",
    tagline: "Rotina de quem está começando: acompanhar tarefas pequenas, corrigir bugs simples, aprender fluxo de código, participar de dailies, documentar e estudar na prática todo dia.",
    skills: ["Git", "HTML", "CSS", "JavaScript", "TypeScript", "APIs", "Aprendizado contínuo"],
    icons: [
      {
        id: "e1",
        src: "/icon-browser.png",
        x: 16,
        y: 22,
        width: 100,
        blur: 0,
        rotation: -14,
        floatDuration: 3.2,
        floatDistance: 13,
      },
      {
        id: "e2",
        src: "/icon-gear.png",
        x: 78,
        y: 24,
        width: 90,
        blur: 5,
        rotation: 16,
        floatDuration: 4.1,
        floatDistance: 15,
      },
      {
        id: "e3",
        src: "/icon-component.png",
        x: 18,
        y: 72,
        width: 85,
        blur: 0,
        rotation: 10,
        floatDuration: 4.5,
        floatDistance: 14,
      },
    ],
    badgePos: { x: -160, y: -140, rotation: -15, scale: 1.0, flipX: false },
    codeTagPos: { x: 150, y: -120, rotation: 12, scale: 1.0, flipX: false },
  },
  {
    id: "junior",
    name: "Júnior",
    titleDisplay: "DESENVOLVEDOR JÚNIOR",
    bgColor: "#C6F2C1",
    patternSrc: "/pattern-backend.png",
    tagline: "Já entrega features pontuais e resolve problemas com apoio. Faz testes, revisa PRs pequenos, atende chamados, documenta soluções e cresce com code review.",
    skills: ["React", "Next.js", "Node.js", "SQL", "Testes", "Code Review", "Debugging"],
    icons: [
      {
        id: "j1",
        src: "/icon-terminal.png",
        x: 18,
        y: 22,
        width: 105,
        blur: 0,
        rotation: 14,
        floatDuration: 3.8,
        floatDistance: 13,
      },
      {
        id: "j2",
        src: "/icon-browser.png",
        x: 76,
        y: 20,
        width: 90,
        blur: 4,
        rotation: -18,
        floatDuration: 4.3,
        floatDistance: 15,
      },
      {
        id: "j3",
        src: "/icon-terminal.png",
        x: 80,
        y: 70,
        width: 80,
        blur: 0,
        rotation: -8,
        floatDuration: 3.5,
        floatDistance: 12,
      },
    ],
    badgePos: { x: -180, y: 40, rotation: 10, scale: 1.1, flipX: true },
    codeTagPos: { x: 170, y: -60, rotation: -18, scale: 0.9, flipX: false },
  },
  {
    id: "pleno-senior",
    name: "Pleno / Sênior",
    titleDisplay: "PLENO / SÊNIOR",
    bgColor: "#E3C6FF",
    patternSrc: "/pattern-database.png",
    tagline: "Lidera entregas, define solução técnica, antecipa riscos, mentora colegas, participa de planejamento e cuida da qualidade sem perder velocidade.",
    skills: ["Arquitetura", "Performance", "Mentoria", "Liderança técnica", "Escalabilidade", "DevOps", "Observabilidade"],
    icons: [
      {
        id: "p1",
        src: "/icon-db.png",
        x: 22,
        y: 18,
        width: 95,
        blur: 0,
        rotation: -12,
        floatDuration: 4.0,
        floatDistance: 13,
      },
      {
        id: "p2",
        src: "/icon-key.png",
        x: 75,
        y: 24,
        width: 85,
        blur: 4,
        rotation: 16,
        floatDuration: 3.7,
        floatDistance: 14,
      },
      {
        id: "p3",
        src: "/icon-gear.png",
        x: 78,
        y: 72,
        width: 90,
        blur: 0,
        rotation: -14,
        floatDuration: 4.7,
        floatDistance: 15,
      },
    ],
    badgePos: { x: 160, y: -150, rotation: 20, scale: 0.95, flipX: false },
    codeTagPos: { x: -160, y: 50, rotation: -10, scale: 1.1, flipX: true },
  },
];
