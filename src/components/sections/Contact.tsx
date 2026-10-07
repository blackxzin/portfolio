import Link from "next/link";
import CopyEmail from "@/components/CopyEmail";
import SectionHeading from "@/components/SectionHeading";
import { contacts, profile, sections } from "@/content/profile";

const meta = sections[5];

export default function Contact() {
  return (
    <section id={meta.id} className="shell py-24 md:py-36">
      <SectionHeading
        index={meta.index}
        title="Falar comigo"
        command={meta.command}
        aside={meta.title}
      />

      <div className="mt-14 grid gap-12 md:grid-cols-12 md:gap-16">
        <p
          className="md:col-span-6"
          style={{ fontSize: "var(--step-lead)", lineHeight: 1.4 }}
          data-reveal
        >
          {profile.contactIntro}
        </p>

        <ul className="md:col-span-5 md:col-start-8 m-0 list-none p-0" data-reveal>
          <li style={{ borderTop: "1px solid var(--line)" }}>
            <Link
              href="/curriculo"
              className="scan-hover group flex items-baseline justify-between gap-6 py-4"
            >
              <span className="label">Currículo</span>
              <span className="link-underline text-[0.95rem]" style={{ color: "var(--signal)" }}>
                Ver e imprimir ↗
              </span>
            </Link>
          </li>
          {contacts.map((contact) => {
            const isEmail = contact.href.startsWith("mailto:");
            const isExternal = contact.href.startsWith("http");

            return (
              <li
                key={contact.label}
                className="scan-hover flex items-baseline justify-between gap-6 py-4"
                style={{ borderTop: "1px solid var(--line)" }}
              >
                <span className="label">{contact.label}</span>
                <span className="flex items-baseline gap-4">
                  <a
                    href={contact.href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className="link-underline text-[0.95rem]"
                  >
                    {contact.value}
                  </a>
                  {isEmail ? <CopyEmail email={contact.value} /> : null}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <p className="label mt-16 flex items-center gap-2" data-reveal>
        <span className="status-dot" aria-hidden="true" />
        {profile.location} · {profile.status}
      </p>
    </section>
  );
}
