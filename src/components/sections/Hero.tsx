import TypeLine from "@/components/TypeLine";
import { profile } from "@/content/profile";

export default function Hero() {
  const [first, ...rest] = profile.name.split(" ");

  return (
    <section id="topo" className="shell flex min-h-[100svh] flex-col justify-between pt-28 pb-10">
      <div className="flex flex-1 flex-col justify-center">
        <TypeLine
          prompt={`${profile.handle} $`}
          command="whoami"
          className="label font-[family-name:var(--font-mono)]"
        />

        <h1 className="mt-6 leading-[0.86]" style={{ fontSize: "var(--step-hero)" }} data-reveal>
          <span className="block">{first}</span>
          <span className="display block" style={{ color: "var(--signal)" }}>
            {rest.join(" ")}
          </span>
        </h1>

        <p className="label mt-6" data-reveal>
          {profile.role}
        </p>

        {/* coluna deslocada: quebra a simetria de centro, tom editorial */}
        <div className="mt-10 grid gap-8 md:grid-cols-12">
          <p
            className="d2 md:col-span-6 md:col-start-6 lg:col-span-5 lg:col-start-7"
            style={{ fontSize: "var(--step-lead)", color: "var(--paper-dim)", lineHeight: 1.45 }}
            data-reveal
          >
            {profile.intro}
          </p>
        </div>
      </div>

      <div
        className="flex flex-wrap items-end justify-between gap-4 pt-10"
        style={{ borderTop: "1px solid var(--line)" }}
        data-reveal
      >
        <div className="label">{profile.location}</div>
        <div className="label flex items-center gap-2" style={{ color: "var(--signal)" }}>
          <span className="status-dot" aria-hidden="true" />
          {profile.status}
        </div>
        <a href="#sobre" className="label link-underline">
          Rolar ↓
        </a>
      </div>
    </section>
  );
}
