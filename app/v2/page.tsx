import V2Nav from "@/components/v2/V2Nav";
import V2Hero from "@/components/v2/V2Hero";
import V2Projects from "@/components/v2/V2Projects";
import V2About from "@/components/v2/V2About";
import V2Contact from "@/components/v2/V2Contact";

export default function V2Page() {
  return (
    <main id="top" className="relative min-h-screen" style={{ backgroundColor: "#f1f0ec" }}>
      <V2Nav />
      <V2Hero />
      <V2Projects />
      <V2About />
      <V2Contact />
    </main>
  );
}
