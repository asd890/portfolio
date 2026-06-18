import Nav from "@/components/layout/Nav";
import Hero from "@/components/sections/Hero";
import ScrollProjects from "@/components/sections/ScrollProjects";
import ProjectMarquee from "@/components/sections/ProjectMarquee";
import WorkHistory from "@/components/sections/WorkHistory";
import ContactSection from "@/components/sections/ContactSection";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="relative" style={{ backgroundColor: "var(--bg)" }}>
      <Nav />
      <Hero />
      <ProjectMarquee />
      <ScrollProjects />
      <WorkHistory />
      <ContactSection />
      <Footer />
    </main>
  );
}
