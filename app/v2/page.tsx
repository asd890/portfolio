import V2Nav from "@/components/v2/V2Nav";
import V2Hero from "@/components/v2/V2Hero";
import V2Projects from "@/components/v2/V2Projects";

export default function V2Page() {
  return (
    <main className="relative min-h-screen" style={{ backgroundColor: "#f1f0ec" }}>
      <V2Nav />
      <V2Hero />
      <V2Projects />
    </main>
  );
}
