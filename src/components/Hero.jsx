import React from 'react'

const stats = [
  { value: '10K+', label: 'Products Tracked' },
  { value: '98%', label: 'Waste Reduced' },
  { value: '500+', label: 'Happy Users' },
]

const Hero = () => {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0b3f7a] via-primary to-[#1a6fc4]" />

      {/* Decorative orbs */}
      <div className="absolute top-20 left-1/4 w-72 h-72 rounded-full bg-white/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-10 w-40 h-40 rounded-full bg-primary-light/10 blur-2xl pointer-events-none" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-20">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8 text-sm text-white/90 font-medium">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
          Smart Expiry Tracking for Modern Homes & Businesses
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight mb-6">
          Never Let Another
          <br />
          <span className="relative inline-block">
            <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-secondary-light to-secondary">
              Product Expire
            </span>
            <span className="absolute bottom-1 left-0 right-0 h-3 bg-secondary/20 rounded-full blur-sm -z-0" />
          </span>
          <br />
          Unnoticed
        </h1>

        {/* Sub-heading */}
        <p className="text-lg sm:text-xl text-white/75 max-w-2xl mx-auto leading-relaxed mb-10">
          ExpiryTrack helps you manage product expiry dates with smart alerts, organized
          dashboards, and actionable insights — so you reduce waste and stay on top of
          what matters most.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a
            href="/register"
            id="hero-register-cta"
            className="group relative px-8 py-4 bg-secondary hover:bg-secondary-dark text-white font-bold text-base rounded-2xl shadow-xl shadow-secondary/30 hover:shadow-secondary/50 transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              Start Tracking Free
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 group-hover:translate-x-1">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-secondary to-secondary-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </a>

          <a
            href="/login"
            id="hero-login-cta"
            className="group px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/25 hover:border-white/40 text-white font-semibold text-base rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <span className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                <polyline points="10 17 15 12 10 7"/>
                <line x1="15" y1="12" x2="3" y2="12"/>
              </svg>
              Sign In
            </span>
          </a>
        </div>

        {/* Stats */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="text-3xl font-extrabold text-white">{stat.value}</span>
              <span className="text-sm text-white/60 font-medium mt-1">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0 80V40C360 0 720 80 1080 40C1260 20 1380 10 1440 0V80H0Z" fill="#f8fafc"/>
        </svg>
      </div>
    </section>
  )
}

export default Hero
