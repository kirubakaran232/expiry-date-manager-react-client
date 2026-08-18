import React, { useState, useEffect } from 'react'

const Header = () => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg shadow-neutral-900/5 border-b border-neutral-200'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3 group" id="header-logo">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-md shadow-primary/30 group-hover:shadow-primary/50 transition-all duration-300 group-hover:scale-105">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="4" width="18" height="17" rx="3" stroke="white" strokeWidth="2" fill="none"/>
                  <path d="M8 2v4M16 2v4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M3 9h18" stroke="white" strokeWidth="2"/>
                  <circle cx="16" cy="16" r="4" fill="#e17055"/>
                  <path d="M14.5 16l1 1 2-2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-secondary border-2 border-white"></div>
            </div>
            <div className="flex flex-col leading-none">
              <span className={`font-bold text-base tracking-tight transition-colors duration-300 ${scrolled ? 'text-neutral-900' : 'text-white'}`}>
                ExpiryTrack
              </span>
              <span className={`text-xs font-medium transition-colors duration-300 ${scrolled ? 'text-primary' : 'text-primary-light'}`}>
                Date Manager
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            <a
              href="/login"
              id="header-login-link"
              className={`px-5 py-2 rounded-xl font-semibold text-sm transition-all duration-200 ${
                scrolled
                  ? 'text-neutral-700 hover:text-primary hover:bg-primary/8'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              Login
            </a>
            <a
              href="/register"
              id="header-register-link"
              className="px-5 py-2 rounded-xl font-semibold text-sm bg-secondary hover:bg-secondary-dark text-white shadow-md shadow-secondary/30 hover:shadow-secondary/50 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Get Started
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            id="mobile-menu-toggle"
            className={`md:hidden p-2 rounded-lg transition-colors ${scrolled ? 'text-neutral-700' : 'text-white'}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {menuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </>
              ) : (
                <>
                  <line x1="4" y1="8" x2="20" y2="8"/>
                  <line x1="4" y1="16" x2="20" y2="16"/>
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white rounded-2xl shadow-xl border border-neutral-100 mb-3 overflow-hidden animate-[fadeInDown_0.2s_ease]">
            <div className="flex flex-col p-3 gap-1">
              <a
                href="/login"
                id="mobile-login-link"
                className="px-4 py-3 rounded-xl text-neutral-700 font-semibold text-sm hover:bg-neutral-50 hover:text-primary transition-colors"
              >
                Login
              </a>
              <a
                href="/register"
                id="mobile-register-link"
                className="px-4 py-3 rounded-xl bg-secondary text-white font-semibold text-sm hover:bg-secondary-dark transition-colors text-center"
              >
                Get Started
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header
