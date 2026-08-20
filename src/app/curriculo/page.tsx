import type { Metadata } from "next";
import Link from "next/link";
import PrintButton from "@/components/PrintButton";
import { about, contacts, milestones, profile, stack, work } from "@/content/profile";

export const metadata: Metadata = {
  title: "Currículo",
  description: `Currículo de ${profile.name} — ${profile.role}.`,
};

export default function CurriculoPage() {
  return (
    <div className="cv-page min-h-screen" style={{ background: "var(--ink)" }}>
      <div className="shell max-w-[820px] py-16 md:py-20">
        <div className="no-print mb-10 flex items-center justify-between gap-4">
          <Link href="/" className="label link-underline">
            ← Voltar ao site
          </Link>
          <PrintButton />
        </div>

        <header style={{ borderBottom: "2px solid var(--line-strong)" }} className="pb-6">
          <h1 style={{ fontSize: "var(--step-title)" }}>{profile.name}</h1>
          <p className="label mt-2" style={{ color: "var(--signal)" }}>
            {profile.role}
          </p>
          <p className="mt-4" style={{ color: "var(--paper-dim)" }}>
            {profile.intro}
          </p>
          <ul className="mt-4 m-0 flex flex-wrap list-none gap-x-6 gap-y-1 p-0">
            {contacts.map((contact) => (
              <li key={contact.label} className="text-sm">
                <span className="label">{contact.label}:</span> {contact.value}
              </li>
            ))}
          </ul>
        </header>

        <section className="mt-10">
          <h2 className="label" style={{ color: "var(--signal)" }}>
            Formação e situação
          </h2>
          <dl className="mt-4 m-0 grid gap-4 sm:grid-cols-2">
            {about.facts.map((fact) => (
              <div key={fact.label}>
                <dt className="label">{fact.label}</dt>
                <dd className="m-0 mt-1">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-10">
          <h2 className="label" style={{ color: "var(--signal)" }}>
            Stack técnica
          </h2>
          <div className="mt-4 flex flex-col gap-4">
            {stack.map((group) => (
              <div key={group.label}>
                <p className="m-0 text-sm font-medium">{group.label}</p>
                <p className="m-0 mt-1 font-[family-name:var(--font-mono)] text-sm" style={{ color: "var(--paper-dim)" }}>
                  {group.items.join(" · ")}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="label" style={{ color: "var(--signal)" }}>
            Como trabalho
          </h2>
          <ul className="mt-4 m-0 flex list-none flex-col gap-4 p-0">
            {work.map((item) => (
              <li key={item.title}>
                <p className="m-0 font-medium">{item.title}</p>
                <p className="m-0 mt-1 text-sm" style={{ color: "var(--paper-dim)" }}>
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10 mb-16">
          <h2 className="label" style={{ color: "var(--signal)" }}>
            Objetivos
          </h2>
          <ul className="mt-4 m-0 flex list-none flex-col gap-4 p-0">
            {milestones.map((milestone) => (
              <li key={milestone.title}>
                <p className="label m-0">{milestone.when}</p>
                <p className="m-0 mt-1 font-medium">{milestone.title}</p>
                <p className="m-0 mt-1 text-sm" style={{ color: "var(--paper-dim)" }}>
                  {milestone.body}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
