import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { buttonStyles } from '../components/ui'
import { brandConfig } from '../config/brand'
import { branchSelectionPath } from '../lib/routes'

export function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[-8%] h-[28rem] w-[28rem] rounded-full bg-[rgba(78,149,188,0.24)] blur-3xl" />
        <div className="absolute bottom-[-16%] right-[-8%] h-[32rem] w-[32rem] rounded-full bg-[rgba(213,159,78,0.16)] blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(142,198,231,0.14),transparent_42%)]" />
        <div className="paper-grid absolute inset-0 opacity-35" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1520px] flex-col px-4 py-4 md:px-6">
        <header className="flex items-center gap-4 py-4 md:py-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--brand-600)] text-lg font-semibold text-slate-950 shadow-lg shadow-cyan-950/20">
            {brandConfig.logo}
          </div>
          <div>
            <div className="text-2xl font-semibold tracking-tight text-[var(--ink-950)]">
              {brandConfig.companyName}
            </div>
            <div className="text-sm text-[var(--ink-700)]">Demo workspace</div>
          </div>
        </header>

        <main className="flex flex-1 items-center justify-center py-8 md:py-12">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="frosted relative w-full max-w-5xl overflow-hidden rounded-[40px] border border-[var(--border-soft)] px-6 py-10 md:px-10 md:py-14 lg:px-14 lg:py-16"
          >
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(117,194,232,0.1),transparent_40%,rgba(213,159,78,0.08))]" />

            <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
              <span className="rounded-full border border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--brand-700)]">
                Automation platform
              </span>

              <h1 className="mt-8 text-5xl font-semibold tracking-tight text-[var(--ink-950)] md:text-7xl md:leading-[0.95]">
                {brandConfig.companyName}
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--ink-800)] md:text-xl">
                {'\u0418\u0437 \u0437\u0430\u044f\u0432\u043a\u0438, \u0444\u043e\u0442\u043e \u0438 \u0437\u0430\u043c\u0435\u0440\u043e\u0432 \u2014 \u0432 \u0433\u043e\u0442\u043e\u0432\u044b\u0439 \u0440\u0430\u0431\u043e\u0447\u0438\u0439 \u0441\u0446\u0435\u043d\u0430\u0440\u0438\u0439 \u0431\u0435\u0437 \u043b\u0438\u0448\u043d\u0435\u0439 \u043f\u0435\u0440\u0435\u0433\u0440\u0443\u0437\u043a\u0438.'}
              </p>

              <Link
                to={branchSelectionPath()}
                className={`mt-10 ${buttonStyles('primary')} px-7 py-3 text-base`}
              >
                {'\u041d\u0430\u0447\u0430\u0442\u044c'}
                <ArrowRight size={18} />
              </Link>
            </div>
          </motion.section>
        </main>
      </div>
    </div>
  )
}
