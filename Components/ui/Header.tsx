"use client"

import Link from 'next/link'
import { useMemo, useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

const Header = () => {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)
  
    useEffect(() => {
      setTimeout(() => {
        setIsMobile(window.innerWidth < 768)
      }, 0)
    }, [])
  
  const activeItem = useMemo(() => {
    if (pathname === '/os') return 'devcorner'
    if (pathname === '/blogs') return 'blogs'
    return 'home'
  }, [pathname])

  const navItems = [
    { name: 'Home', path: '/', id: 'home' },
    { name: 'Projects', path: '/#work', id: 'projects', isAnchor: true },
    { name: 'Blogs', path: 'https://github.com/SHIWA6', id: 'blogs', isExternal: true },
    { name: 'Dev Corner', path: '/os', id: 'devcorner' },
  ]

  const handleAnchorClick = (e: React.MouseEvent, hash: string) => {
    // If already on the home page, smooth-scroll to the section
    if (pathname === '/') {
      e.preventDefault()
      const el = document.querySelector(hash)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
    // Otherwise the Link will navigate to /#work and the browser handles the hash
  }

  return (
    /* Layout Note: Using 'sticky' preserves layout space (Zero CLS) while floating. */
    <nav className="sticky top-4 z-50 flex justify-center w-full px-4">
      <div className="relative group">
        {/* DESKTOP ONLY: Subtle ambient glow */}
        {!isMobile && (
          <div className="absolute -inset-1 bg-gradient-to-r from-teal-500/20 via-purple-500/20 to-teal-500/20 rounded-full blur-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        )}
        
        {/* MOBILE: Simpler navbar without backdrop-blur */}
        <div className="relative bg-black/90 md:backdrop-blur-2xl md:bg-black/40 border border-white/10 shadow-lg md:shadow-2xl shadow-black/50 rounded-full w-fit mx-auto overflow-hidden ring-1 ring-white/5">
          <div className="px-1.5 py-1.5">
            <ul className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = activeItem === item.id;
                const isAnchor = 'isAnchor' in item && item.isAnchor;
                const isExternal = 'isExternal' in item && item.isExternal;

                const linkClass = `relative px-3 sm:px-4 py-2 block text-xs sm:text-sm font-medium transition-colors duration-300 ${
                  isActive 
                    ? 'text-white' 
                    : 'text-neutral-400 hover:text-neutral-200'
                }`;
                
                const inner = (
                  <>
                    {/* MOBILE: Static pill, DESKTOP: Animated pill */}
                    {isActive && (
                      isMobile ? (
                        <div className="absolute inset-0 bg-white/10 rounded-full border border-white/5" />
                      ) : (
                        <motion.div
                          layoutId="active-pill"
                          className="absolute inset-0 bg-white/10 rounded-full border border-white/5 shadow-[0_0_10px_0_rgba(255,255,255,0.05)]"
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                        />
                      )
                    )}
                    <span className="relative z-20">{item.name}</span>
                  </>
                );

                return (
                  <li key={item.id} className="relative z-10">
                    {isExternal ? (
                      <a
                        href={item.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={linkClass}
                      >
                        {inner}
                      </a>
                    ) : (
                      <Link
                        href={item.path}
                        onClick={isAnchor ? (e) => handleAnchorClick(e, '#work') : undefined}
                        className={linkClass}
                      >
                        {inner}
                      </Link>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Header