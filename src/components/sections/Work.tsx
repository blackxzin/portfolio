import SectionHeading from "@/components/SectionHeading";
import { sections, work } from "@/content/profile";

const meta = sections[2];

export default function Work() {
  return (
    <section id={meta.id} className="shell py-24 md:py-36">
      <SectionHeading
        index={meta.index}
        title="Como eu trabalho"
        command={meta.command}
        aside={meta.title}
      />

      <div className="mt-14 grid gap-x-16 gap-y-12 md:grid-cols-2">
        {work.map((item, i) => (
          <article key={item.title} className={`d${Math.min(i + 1, 4)}`} data-reveal>
            <span className="label" style={{ color: "var(--signal)" }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-3 text-[1.375rem]">{item.title}</h3>
            <p className="mt-3 max-w-[46ch]" style={{ color: "var(--paper-dim)" }}>
              {item.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
