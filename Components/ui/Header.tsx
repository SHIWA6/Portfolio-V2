"use client"

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

const Header = () => {
  const pathname = usePathname()
  const [activeItem, setActiveItem] = useState('home')

  useEffect(() => {
    if (pathname === '/') setActiveItem('home')
    else if (pathname === '/projects') setActiveItem('projects')
    else if (pathname === '/blogs') setActiveItem('blogs')
  }, [pathname])

  const navItems = [
    { name: 'Home', path: '/', id: 'home' },
    { name: 'Projects', path: '/projects', id: 'projects' },
    { name: 'Blogs', path: '/blogs', id: 'blogs' }
  ]

  return (
    /* Layout Note: Using 'sticky' preserves layout space (Zero CLS) while floating.
      z-50 ensures it stays above all content.
    */
    <nav className="sticky top-4 z-50 flex justify-center w-full px-4">
      <div className="relative group">
        {/* Subtle ambient glow behind the navbar */}
        <div className="absolute -inset-1 bg-gradient-to-r from-teal-500/20 via-purple-500/20 to-teal-500/20 rounded-full blur-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        
        <div className="relative backdrop-blur-2xl bg-black/40 border border-white/10 shadow-2xl shadow-black/50 rounded-full w-fit mx-auto overflow-hidden ring-1 ring-white/5">
          <div className="px-1.5 py-1.5">
            <ul className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = activeItem === item.id;
                
                return (
                  <li key={item.id} className="relative z-10">
                    <Link
                      href={item.path}
                      className={`relative px-4 py-2 block text-sm font-medium transition-colors duration-300 ${
                        isActive 
                          ? 'text-white' 
                          : 'text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      {/* The Magic Moving Pill */}
                      {isActive && (
                        <motion.div
                          layoutId="active-pill"
                          className="absolute inset-0 bg-white/10 rounded-full border border-white/5 shadow-[0_0_10px_0_rgba(255,255,255,0.05)]"
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                        />
                      )}
                      
                      {/* Text Content */}
                      <span className="relative z-20">{item.name}</span>
                    </Link>
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