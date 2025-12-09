"use client"

import Hero from "./Hero";
import PreLoader from "./Predloader";

function Landing() {
  return (
    <>
    <PreLoader/>
    <div>
      <Hero />
    </div>
    </>
  )
}

export default Landing