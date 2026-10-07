import Link from "next/link";
import TypeLine from "@/components/TypeLine";
import CyberCore from "@/components/CyberCore";
import { profile } from "@/content/profile";

export default function Hero() {
  return (
    <section id="topo" className="shell hero">
      <div className="hero-layout">
        <div className="hero-copy">
          <p className="label hero-eyebrow"><span className="status-dot" aria-hidden="true" /> {profile.status}</p>
          <TypeLine prompt={`${profile.handle} $`} command="whoami" className="label" />
          <h1>Lucas<span>Gabriel<span className="hero-period">.</span></span></h1>
          <p className="hero-role">Back-end &amp; Full Stack.<br /><span>Automação e IA aplicada.</span></p>
          <p className="hero-description">{profile.heroDescription}</p>
          <div className="hero-actions">
            <a className="action-primary" href="#projetos">Explorar projetos <span aria-hidden="true">↗</span></a>
            <a className="action-secondary" href="#contato">Vamos conversar <span aria-hidden="true">→</span></a>
          </div>
          <div className="hero-skills label"><span>Python</span><span>Java</span><span>TypeScript</span><span>Docker</span></div>
        </div>
        <CyberCore />
      </div>
      <div className="hero-footer label">
        <span>{profile.location}</span>
        <Link href="/curriculo" className="link-underline">Ver currículo ↗</Link>
        <a href="#sobre" className="link-underline">Conheça meu trabalho ↓</a>
      </div>
    </section>
  );
}
