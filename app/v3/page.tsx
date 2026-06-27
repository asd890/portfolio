import Nav from "@/components/layout/Nav";
import Hero from "@/components/sections/Hero";
import ScrollProjects from "@/components/sections/ScrollProjects";
import ProjectMarquee from "@/components/sections/ProjectMarquee";
import AboutCTA from "@/components/sections/AboutCTA";
import ContactSection from "@/components/sections/ContactSection";
import Footer from "@/components/sections/Footer";

export default function V3Page() {
  return (
    <main className="relative" style={{ backgroundColor: "var(--bg)" }}>
      <Nav />
      <Hero />
      <ProjectMarquee />
      <ScrollProjects />
      <AboutCTA />
      <ContactSection />
      <Footer />
    </main>
  );
}
