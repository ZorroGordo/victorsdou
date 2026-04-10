'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

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
  const [cartCount, setCartCount] = useState(0)
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const readCart = () => {
      try {
        const raw = localStorage.getItem('victorsdou-cart')
        if (!raw) { setCartCount(0); return }
        const d = JSON.parse(raw)
        const items: { quantity?: number }[] = (d.state || d).items || []
        const count = items.reduce((s: number, i) => s + (i.quantity || 1), 0)
        setCartCount(count)
      } catch { setCartCount(0) }
    }
    readCart()
    window.addEventListener('storage', readCart)
    return () => window.removeEventListener('storage', readCart)
  }, [])

  const isDark = isScrolled || !isHomePage

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isDark ? 'bg-white shadow-sm' : 'bg-transparent'
    }`}>
      <div className="container-main">
        <nav className="flex items-center justify-between py-6" aria-label="Navegación principal">
          {/* Left Navigation - Desktop */}
          <ul className="hidden md:flex items-center gap-8">
            {leftNav.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`text-sm font-medium tracking-wider hover:opacity-60 transition-opacity ${isDark ? 'text-charcoal' : 'text-white'}`}
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
              className={`h-8 md:h-10 w-auto transition-all duration-300 ${isDark ? 'brightness-0' : ''}`}
              priority
            />
          </Link>

          {/* Right Navigation - Desktop */}
          <ul className="hidden md:flex items-center gap-8">
            {rightNav.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`text-sm font-medium tracking-wider hover:opacity-60 transition-opacity ${isDark ? 'text-charcoal' : 'text-white'}`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
            {/* Cart icon */}
            <li>
              <Link href="/carrito" className="relative inline-flex items-center" aria-label="Mi Carrito">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={isDark ? 'text-charcoal' : 'text-white'}>
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-charcoal text-white text-[10px] font-bold min-w-[16px] h-4 rounded-full flex items-center justify-center px-1">
                    {cartCount}
                  </span>
                )}
              </Link>
            </li>
          </ul>

          {/* Mobile: Cart icon + Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <Link href="/carrito" className="relative inline-flex items-center p-1" aria-label="Mi Carrito">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={isDark ? 'text-charcoal' : 'text-white'}>
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-charcoal text-white text-[10px] font-bold min-w-[14px] h-3.5 rounded-full flex items-center justify-center px-0.5">
                  {cartCount}
                </span>
              )}
            </Link>
          <button
            type="button"
            className={`p-2 ${isDark ? 'text-charcoal' : 'text-white'}`}
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
          </div>
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
