import React from 'react'

const CTA = () => {
  return (
    <section id="cta" className="bg-neutral-50 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary via-[#0e6fd0] to-[#0b5cae] p-12 text-center shadow-2xl shadow-primary/30">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/10 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

          <div className="relative z-10">
            <span className="inline-block bg-white/15 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
              Get Started Today — It's Free
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
              Ready to stop throwing money away?
            </h2>
            <p className="text-white/75 text-base max-w-lg mx-auto mb-10">
              Join thousands of households and businesses who have cut waste and saved
              money with ExpiryTrack.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/register"
                id="cta-register-btn"
                className="group px-8 py-4 bg-secondary hover:bg-secondary-dark text-white font-bold text-base rounded-2xl shadow-xl shadow-secondary/30 hover:shadow-secondary/50 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <span className="flex items-center gap-2">
                  Create Free Account
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1 duration-200">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </span>
              </a>
              <a
                href="/login"
                id="cta-login-btn"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/25 hover:border-white/40 text-white font-semibold text-base rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Already have an account?
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTA
