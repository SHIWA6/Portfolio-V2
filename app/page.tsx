import Landing from "../Components/landing/Landing";

// SERVER COMPONENT - No 'use client'
// This enables SSR and eliminates hydration blocking
export default function Home() {
  return <Landing />;
}
