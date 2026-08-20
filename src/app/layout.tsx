import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Backdrop from "@/components/Backdrop";
import BootSequence from "@/components/BootSequence";
import CommandPalette from "@/components/CommandPalette";
import RevealObserver from "@/components/RevealObserver";
import { contacts, profile } from "@/content/profile";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

/** Só quem abre o view-source encontra isto — sem custo para quem não procura. */
const EASTER_EGG = `
   __
  /  \\   ${profile.name} — ${profile.role}
  \\__/   curioso o bastante para ler o código-fonte?
   ||    isso já diz algo sobre você.
  /  \\
 /    \\  Ctrl+K abre a paleta de comandos.
/______\\ ${contacts.find((c) => c.href.startsWith("mailto:"))?.value ?? ""} — me chama.
`;

const sans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-display",
  display: "swap",
});

const title = `${profile.name} — ${profile.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: title,
    template: `%s — ${profile.name}`,
  },
  description: profile.intro,
  keywords: ["desenvolvedor", "automação", "Python", "n8n", "Docker", "estágio", profile.name],
  authors: [{ name: profile.name, url: SITE_URL }],
  creator: profile.name,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    title,
    description: profile.intro,
    url: SITE_URL,
    siteName: profile.name,
    locale: "pt_BR",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: profile.intro,
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0a",
  colorScheme: "dark",
};

/** Dados estáticos do próprio site — seguro serializar direto, sem input de usuário. */
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  description: profile.intro,
  url: SITE_URL,
  sameAs: contacts.filter((c) => c.href.startsWith("http")).map((c) => c.href),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${sans.variable} ${mono.variable} ${display.variable}`}>
      <body>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <div
          aria-hidden="true"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: `<!--${EASTER_EGG.replace(/--/g, "—")}-->` }}
        />
        <Backdrop />
        <div className="scanlines" aria-hidden="true" />
        <div className="grain" aria-hidden="true" />
        <RevealObserver />
        <BootSequence />
        <CommandPalette />
        <div className="relative z-10">{children}</div>
        <Analytics />
      </body>
    </html>
  );
}
