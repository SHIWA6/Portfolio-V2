import DemoVideo from "../UI-comps/Skill/Skill";

export default function Projects() {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <DemoVideo
        src="/videos/mydemo_optimized.mp4"
        poster="/videos/mydemo_poster.webp"
      />
    </div>
  );
}