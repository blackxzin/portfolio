import SectionHeading from "@/components/SectionHeading";
import { about, sections } from "@/content/profile";

const meta = sections[0];

export default function About() {
  return (
    <section id={meta.id} className="shell py-24 md:py-36">
      <SectionHeading
        index={meta.index}
        title="Quem está por trás disso"
        command={meta.command}
        aside={meta.title}
      />

      <div className="mt-14 grid gap-12 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-7 lg:col-span-6 lg:col-start-2">
          {about.paragraphs.map((paragraph, i) => (
            <p
              key={paragraph.slice(0, 24)}
              className={`d${Math.min(i + 1, 4)} mt-0 mb-6 last:mb-0`}
              style={{ color: "var(--paper-dim)" }}
              data-reveal
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* lista de definição — informação densa sem virar grade de cards */}
        <dl className="m-0 md:col-span-4 md:col-start-9" data-reveal>
          {about.facts.map((fact) => (
            <div
              key={fact.label}
              className="flex flex-col gap-1 py-4"
              style={{ borderTop: "1px solid var(--line)" }}
            >
              <dt className="label">{fact.label}</dt>
              <dd className="m-0 text-[0.95rem]">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
