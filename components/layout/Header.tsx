'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

// Navigation structure matching HTML design
const leftNav = [
  { name: 'RECETAS', href: 'https://victorsdou.pe/recetas/' },
  { name: 'BLOG', href: 'https://victorsdou.pe/blog/' },
]

const rightNav = [
  { name: 'NOSOTROS', href: '#nosotros' },
  { name: 'CONTACTO', href: '#contacto' },
  { name: 'TIENDA', href: '/tienda' },
]

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-charcoal/95 backdrop-blur' : 'bg-transparent'
    }`}>
      <div className="container-main">
        <nav className="flex items-center justify-between py-6" aria-label="Navegación principal">
          {/* Left Navigation - Desktop */}
          <ul className="hidden md:flex items-center gap-8">
            {leftNav.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="text-white text-sm font-medium tracking-wider hover:opacity-80 transition-opacity"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Center Logo */}
          <Link href="/" className="flex items-center" aria-label="Victorsdou - Inicio">
            <Image
              src="/images/logo.svg"
              alt="@victorsdou"
              width={238}
              height={41}
              className="h-8 md:h-10 w-auto"
              priority
            />
          </Link>

          {/* Right Navigation - Desktop */}
          <ul className="hidden md:flex items-center gap-8">
            {rightNav.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="text-white text-sm font-medium tracking-wider hover:opacity-80 transition-opacity"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-charcoal/95 backdrop-blur z-40 pt-20">
          <nav className="container-main">
            <ul className="flex flex-col gap-6">
              {[...leftNav, ...rightNav].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="block text-white text-xl font-medium tracking-wider"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  )
}
