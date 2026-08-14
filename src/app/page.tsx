import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Stack from "@/components/sections/Stack";
import Work from "@/components/sections/Work";
import Projects from "@/components/sections/Projects";
import Milestones from "@/components/sections/Milestones";
import Contact from "@/components/sections/Contact";

export default function PortfolioPage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Stack />
        <Work />
        <Projects />
        <Milestones />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
