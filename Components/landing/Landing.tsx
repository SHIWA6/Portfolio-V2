import Hero from "./Hero";

// SERVER COMPONENT - Preloader removed for LCP optimization
// The preloader was blocking rendering for 1-2 seconds, killing LCP
function Landing() {
  return (
    <div>
      <Hero />
    </div>
  );
}

export default Landing;
