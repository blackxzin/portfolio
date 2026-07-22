export interface IconConfig {
  id: string;
  emoji: string;
  x: number;
  y: number;
  size: number;
  blur: number;
  rotation: number;
  floatDuration: number;
  floatRange: number;
}

export interface SectionConfig {
  id: string;
  name: string;
  color: string;
  patternColor: string;
  icons: IconConfig[];
}

export interface BrandElement {
  id: string;
  emoji: string;
  label: string;
  size: number;
  rotation: number;
  offsetX: number;
  offsetY: number;
}

export const sections: SectionConfig[] = [
  {
    id: "frontend",
    name: "Frontend",
    color: "#BFE3FF",
    patternColor: "#BFE3FF",
    icons: [
      { id: "f1", emoji: "🌐", x: 15, y: 20, size: 60, blur: 0, rotation: -15, floatDuration: 3.2, floatRange: 13 },
      { id: "f2", emoji: "🧩", x: 80, y: 30, size: 50, blur: 6, rotation: 10, floatDuration: 4.1, floatRange: 11 },
      { id: "f3", emoji: "⚡", x: 25, y: 75, size: 55, blur: 0, rotation: -8, floatDuration: 3.7, floatRange: 14 },
    ],
  },
  {
    id: "backend",
    name: "Backend",
    color: "#C6F2C1",
    patternColor: "#C6F2C1",
    icons: [
      { id: "b1", emoji: "⚙️", x: 20, y: 25, size: 60, blur: 0, rotation: 12, floatDuration: 4.4, floatRange: 12 },
      { id: "b2", emoji: "💻", x: 78, y: 22, size: 50, blur: 5, rotation: -10, floatDuration: 3.9, floatRange: 13 },
      { id: "b3", emoji: "🔌", x: 22, y: 72, size: 55, blur: 0, rotation: -6, floatDuration: 3.5, floatRange: 11 },
    ],
  },
  {
    id: "database",
    name: "Database",
    color: "#E3C6FF",
    patternColor: "#E3C6FF",
    icons: [
      { id: "d1", emoji: "🗄️", x: 18, y: 28, size: 60, blur: 0, rotation: -12, floatDuration: 4.2, floatRange: 13 },
      { id: "d2", emoji: "🔑", x: 82, y: 25, size: 50, blur: 4, rotation: 14, floatDuration: 3.8, floatRange: 12 },
      { id: "d3", emoji: "🗃️", x: 24, y: 70, size: 55, blur: 0, rotation: -9, floatDuration: 4.6, floatRange: 14 },
    ],
  },
];

export const brandElements: BrandElement[] = [
  { id: "badge", emoji: "🤖", label: "AI", size: 36, rotation: -12, offsetX: -70, offsetY: -90 },
  { id: "codeTag", emoji: "</>", label: "code", size: 32, rotation: 10, offsetX: 70, offsetY: -85 },
];
