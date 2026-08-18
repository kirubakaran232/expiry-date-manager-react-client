import React from 'react'

const footerLinks = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Changelog', href: '#changelog' },
  ],
  Company: [
    { label: 'About', href: '#about' },
    { label: 'Blog', href: '#blog' },
    { label: 'Contact', href: '#contact' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#privacy' },
    { label: 'Terms of Service', href: '#terms' },
    { label: 'Cookie Policy', href: '#cookies' },
  ],
}

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-neutral-400">
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <a href="/" className="flex items-center gap-3 mb-5 group" id="footer-logo">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-primary/20">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="4" width="18" height="17" rx="3" stroke="white" strokeWidth="2" fill="none"/>
                  <path d="M8 2v4M16 2v4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M3 9h18" stroke="white" strokeWidth="2"/>
                  <circle cx="16" cy="16" r="4" fill="#e17055"/>
                  <path d="M14.5 16l1 1 2-2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-bold text-base text-white tracking-tight">ExpiryTrack</span>
                <span className="text-xs font-medium text-primary-light">Date Manager</span>
              </div>
            </a>
            <p className="text-sm leading-relaxed text-neutral-500 mb-6 max-w-xs">
              Smart expiry date management for households and businesses. Reduce waste,
              stay safe, and save money.
            </p>
            {/* Social links */}
            <div className="flex gap-3">
              {[
                { label: 'Twitter/X', href: '#', icon: (
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                )},
                { label: 'GitHub', href: '#', icon: (
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                )},
                { label: 'LinkedIn', href: '#', icon: (
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                )},
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  id={`footer-social-${social.label.toLowerCase()}`}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg bg-neutral-800 hover:bg-primary/20 hover:text-primary border border-neutral-700 hover:border-primary/30 flex items-center justify-center transition-all duration-200"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    {social.icon}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h3 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase">
                {group}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-neutral-500 hover:text-white transition-colors duration-150"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-600">
            © {new Date().getFullYear()} ExpiryTrack. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-xs text-neutral-600">
            <span>Made with</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#e17055" className="inline-block">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <span>for fresher living</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
