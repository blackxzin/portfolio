import SectionHeading from "@/components/SectionHeading";
import { milestones, sections } from "@/content/profile";

const meta = sections[4];

export default function Milestones() {
  return (
    <section id={meta.id} className="shell py-24 md:py-36">
      <SectionHeading
        index={meta.index}
        title="Para onde estou indo"
        command={meta.command}
        aside={meta.title}
      />

      <ol className="mt-14 m-0 list-none p-0">
        {milestones.map((milestone, i) => (
          <li
            key={milestone.title}
            className={`d${Math.min(i + 1, 4)} grid gap-4 py-9 md:grid-cols-12 md:gap-10`}
            style={{ borderTop: "1px solid var(--line)" }}
            data-reveal
          >
            <div className="label md:col-span-3" style={{ color: i === 0 ? "var(--signal)" : undefined }}>
              {milestone.when}
            </div>
            <h3 className="md:col-span-4 text-[1.375rem]">{milestone.title}</h3>
            <p className="md:col-span-5 m-0" style={{ color: "var(--paper-dim)" }}>
              {milestone.body}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
