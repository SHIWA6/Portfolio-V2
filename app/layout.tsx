import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import images from "next/image";

import { Toaster } from "../Components/ui/sonner";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // CRITICAL: Prevents FOIT (Flash of Invisible Text)
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shiva(a)",
  description: "Software Engineer Portfolio - Full-stack developer specializing in React, Next.js, and modern web technologies",
  metadataBase: new URL('https://pulsetalk.vercel.app'),
  icons: {
    icon: "/favicon.ico",
  },
};

// MOBILE PERFORMANCE: Viewport configuration
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* CRITICAL: Preload LCP image for faster rendering */}
        <link
          rel="preload"
          as="image"
          href="/images/reall.webp"
          type="image/webp"
        />
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background`}
      >
         
         
             
                {children}
              
       
            <Toaster 
              position="top-right"
              closeButton
              theme="light"
              richColors
              toastOptions={{
                duration: 4000,
                style: {
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  borderColor: '#e2e8f0',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  borderWidth: '1px',
                  borderStyle: 'solid'
                },
                classNames: {
                  toast: "bg-white text-black border border-gray-200 shadow-lg",
                  description: "text-gray-700 opacity-100",
                  actionButton: "bg-blue-500 text-white",
                  cancelButton: "bg-gray-200 text-gray-800",
                }
              }}
            />
       
      </body>
    </html>

  );
}
