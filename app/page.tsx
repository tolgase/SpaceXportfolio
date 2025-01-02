import { Encryption } from "@/components/main/encryption";
import { AI } from "@/components/main/AI";
import { Hero } from "@/components/main/hero";
import { Projects } from "@/components/main/projects";
import { Skills } from "@/components/main/skills";

export default function Home() {
  return (
    <main className="h-full w-full">
      <div className="flex flex-col gap-20">
        <Hero />
        <Skills />
        <AI />
        <Encryption />
        <Projects />
      </div>
    </main>
  );
}
