import SectionHeading from "@/components/SectionHeading";
import { sections, stack } from "@/content/profile";

const meta = sections[1];

/**
 * Sem barra de porcentagem e sem auto-nota de 1 a 5 — ninguém acredita nelas.
 * O agrupamento diz o que importa: com o que já me viro e o que ainda consulto.
 */
export default function Stack() {
  return (
    <section id={meta.id} className="shell py-24 md:py-36">
      <SectionHeading index={meta.index} title="Com o que eu construo" aside={meta.title} />

      <div className="mt-14 flex flex-col">
        {stack.map((group, i) => (
          <div
            key={group.label}
            className={`d${Math.min(i + 1, 4)} grid gap-6 py-8 md:grid-cols-12 md:gap-10`}
            style={{ borderTop: "1px solid var(--line)" }}
            data-reveal
          >
            <div className="md:col-span-4">
              <h3 className="text-[1.0625rem] font-medium tracking-normal">{group.label}</h3>
              <p className="mt-1 text-sm" style={{ color: "var(--paper-faint)" }}>
                {group.note}
              </p>
            </div>

            <ul className="md:col-span-8 m-0 flex list-none flex-wrap gap-x-6 gap-y-2 p-0">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="font-[family-name:var(--font-mono)] text-[0.9rem]"
                  style={{ color: "var(--paper)" }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
