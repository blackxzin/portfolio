import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Lucas Gabriel | Portfólio Full Stack (Cyber Matrix Skull)',
  description: 'Portfólio interativo Full Stack com pet gerado por IA, framer-motion e canvas chameleon textures.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className="m-0 p-0 overflow-hidden bg-slate-900 text-slate-900 antialiased"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
