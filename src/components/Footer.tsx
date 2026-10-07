import { profile } from "@/content/profile";

export default function Footer() {
  return (
    <footer className="shell flex flex-wrap items-center justify-between gap-4 py-10"
      style={{ borderTop: "1px solid var(--line)" }}
    >
      <span className="label">
        © {new Date().getFullYear()} {profile.name}
      </span>
      <span className="label">Next.js · TypeScript · CSS 3D</span>
      <a href="#topo" className="label link-underline">
        Voltar ao topo ↑
      </a>
    </footer>
  );
}
