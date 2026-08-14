import SectionHeading from "@/components/SectionHeading";
import { contacts, profile, sections } from "@/content/profile";

const meta = sections[5];

export default function Contact() {
  return (
    <section id={meta.id} className="shell py-24 md:py-36">
      <SectionHeading index={meta.index} title="Falar comigo" aside={meta.title} />

      <div className="mt-14 grid gap-12 md:grid-cols-12 md:gap-16">
        <p
          className="md:col-span-6"
          style={{ fontSize: "var(--step-lead)", lineHeight: 1.4 }}
          data-reveal
        >
          Procuro <span className="display" style={{ color: "var(--signal)" }}>estágio</span> em
          desenvolvimento, automação de processos ou análise de sistemas. Se o que você leu aqui
          faz sentido para o seu time, me chame — respondo no mesmo dia.
        </p>

        <ul className="md:col-span-5 md:col-start-8 m-0 list-none p-0" data-reveal>
          {contacts.map((contact) => (
            <li key={contact.label} style={{ borderTop: "1px solid var(--line)" }}>
              <a
                href={contact.href}
                target={contact.href.startsWith("http") ? "_blank" : undefined}
                rel={contact.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="group flex items-baseline justify-between gap-6 py-4"
              >
                <span className="label">{contact.label}</span>
                <span className="link-underline text-[0.95rem]">{contact.value}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <p className="label mt-16" data-reveal>
        {profile.location} · {profile.status}
      </p>
    </section>
  );
}
