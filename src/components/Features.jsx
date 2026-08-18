import React from 'react'

const features = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
        <line x1="6" y1="1" x2="6" y2="4"/>
        <line x1="10" y1="1" x2="10" y2="4"/>
        <line x1="14" y1="1" x2="14" y2="4"/>
      </svg>
    ),
    title: 'Smart Expiry Alerts',
    description: 'Receive timely notifications before products expire, so you can use them in time or plan replacements.',
    color: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-primary/20',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
    title: 'Organized Dashboard',
    description: 'View all your products in one place, sorted by expiry dates, categories, or urgency levels.',
    color: 'text-secondary',
    bg: 'bg-secondary/10',
    border: 'border-secondary/20',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    title: 'Waste Analytics',
    description: 'Track your waste patterns over time and gain insights to make smarter purchasing decisions.',
    color: 'text-[#00b894]',
    bg: 'bg-[#00b894]/10',
    border: 'border-[#00b894]/20',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'Multi-Category Support',
    description: 'Manage food, medicines, cosmetics, and household products all in a single unified system.',
    color: 'text-[#6c5ce7]',
    bg: 'bg-[#6c5ce7]/10',
    border: 'border-[#6c5ce7]/20',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: 'Family Sharing',
    description: 'Share your pantry with family members so everyone stays informed and nothing gets forgotten.',
    color: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-primary/20',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
        <line x1="12" y1="18" x2="12.01" y2="18"/>
      </svg>
    ),
    title: 'Mobile Ready',
    description: 'Access your expiry tracker from any device — phones, tablets, or desktops — anytime.',
    color: 'text-secondary',
    bg: 'bg-secondary/10',
    border: 'border-secondary/20',
  },
]

const Features = () => {
  return (
    <section id="features" className="bg-neutral-50 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-primary/10 text-primary font-semibold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            Everything You Need
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-neutral-900 mb-4 tracking-tight">
            Powerful features, simple to use
          </h2>
          <p className="text-lg text-neutral-500 max-w-xl mx-auto">
            Everything you need to track, manage, and reduce product waste — all in one intuitive app.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => (
            <div
              key={i}
              className={`group bg-white rounded-2xl p-7 border ${feat.border} hover:shadow-xl hover:shadow-neutral-200/60 transition-all duration-300 hover:-translate-y-1`}
            >
              <div className={`w-14 h-14 rounded-xl ${feat.bg} ${feat.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                {feat.icon}
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">{feat.title}</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">{feat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
