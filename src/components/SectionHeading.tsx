import Scramble from "@/components/Scramble";

interface SectionHeadingProps {
  index: string;
  title: string;
  command?: string;
  aside?: string;
}

/** Cabeçalho de seção: índice mono + comando + título + régua. Sem card, sem ícone. */
export default function SectionHeading({ index, title, command, aside }: SectionHeadingProps) {
  return (
    <div data-reveal>
      <div className="flex items-baseline gap-4">
        <span className="label" style={{ color: "var(--signal)" }}>
          {index}
        </span>
        {command ? (
          <span className="label font-[family-name:var(--font-mono)]">
            <span style={{ color: "var(--signal)" }}>$</span>{" "}
            <Scramble text={command} />
          </span>
        ) : null}
        <hr className="rule flex-1" />
        {aside ? <span className="label hidden sm:block">{aside}</span> : null}
      </div>
      <h2 className="mt-6 max-w-[16ch]" style={{ fontSize: "var(--step-title)" }}>
        {title}
      </h2>
    </div>
  );
}
