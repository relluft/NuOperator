import { motion } from 'framer-motion'
import { ArrowRight, Orbit, ScanSearch, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { buttonStyles } from '../components/ui'
import { brandConfig } from '../config/brand'
import { branchSelectionPath } from '../lib/routes'

export function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="ambient-orb ambient-orb-cyan absolute left-[-8%] top-[-8%] h-[34rem] w-[34rem] animate-[ambient-float_14s_ease-in-out_infinite]" />
        <div className="ambient-orb ambient-orb-gold absolute bottom-[-18%] right-[-10%] h-[36rem] w-[36rem] animate-[ambient-float_16s_ease-in-out_infinite]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(199,155,88,0.12),transparent_38%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,248,234,0.04),transparent_20%,transparent_80%,rgba(255,248,234,0.018))]" />
        <div className="paper-grid absolute inset-0 opacity-30" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1520px] flex-col px-4 py-4 md:px-6">
        <header className="flex items-center gap-4 py-4 md:py-6">
          <div className="brand-mark flex h-14 w-14 items-center justify-center rounded-[22px] text-lg font-semibold">
            {brandConfig.logo}
          </div>
          <div>
            <div className="text-2xl font-semibold tracking-tight text-[var(--ink-950)]">
              {brandConfig.companyName}
            </div>
            <div className="text-sm uppercase tracking-[0.18em] text-[var(--ink-500)]">
              Приватное ИИ-рабочее пространство
            </div>
          </div>
        </header>

        <main className="flex flex-1 items-center justify-center py-8 md:py-12">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="frosted panel-outline relative w-full max-w-6xl overflow-hidden rounded-[42px] px-6 py-11 md:px-10 md:py-[3.75rem] lg:px-14 lg:py-[4.5rem]"
          >
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(215,170,103,0.14),transparent_34%,rgba(92,64,33,0.1)_82%)]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,235,201,0.26),transparent)]" />

            <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
              <span className="metal-pill inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--brand-700)]">
                <Orbit size={13} />
                Платформа исполнительной автоматизации
              </span>

              <h1 className="display-title mt-8 text-6xl text-[var(--ink-950)] md:text-8xl">
                {brandConfig.companyName}
              </h1>

              <p className="mt-6 max-w-3xl text-base leading-8 text-[var(--ink-800)] md:text-[1.22rem] md:leading-9">
                Из заявки, фото и замеров в готовый рабочий сценарий без лишней перегрузки.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-left">
                <div className="executive-card rounded-full px-4 py-2.5 text-sm text-[var(--ink-800)]">
                  <div className="relative flex items-center gap-2">
                    <ShieldCheck size={15} className="text-[var(--accent-amber-strong)]" />
                    Презентационный уровень для руководителей
                  </div>
                </div>
                <div className="executive-card rounded-full px-4 py-2.5 text-sm text-[var(--ink-800)]">
                  <div className="relative flex items-center gap-2">
                    <ScanSearch size={15} className="text-[var(--brand-700)]" />
                    Точная оркестрация рабочих процессов
                  </div>
                </div>
              </div>

              <Link
                to={branchSelectionPath()}
                className={`mt-10 ${buttonStyles('primary')} px-8 py-3.5 text-base`}
              >
                Начать
                <ArrowRight size={18} />
              </Link>

              <div className="mt-12 grid w-full gap-4 md:grid-cols-3">
                <div className="executive-card rounded-[28px] px-5 py-5 text-left">
                  <div className="relative">
                    <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--ink-500)]">
                      Позиционирование
                    </div>
                    <div className="mt-3 text-lg font-semibold text-[var(--ink-950)]">
                      Приватная ИИ-платформа
                    </div>
                    <p className="mt-2 text-sm leading-7 text-[var(--ink-800)]">
                      Закрытая система, которая выглядит как кастомное внутреннее решение под
                      конкретный бизнес.
                    </p>
                  </div>
                </div>
                <div className="executive-card executive-highlight rounded-[28px] px-5 py-5 text-left">
                  <div className="relative">
                    <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--ink-500)]">
                      Визуальный тон
                    </div>
                    <div className="mt-3 text-lg font-semibold text-[var(--ink-950)]">
                      Кинематографичная точность
                    </div>
                    <p className="mt-2 text-sm leading-7 text-[var(--ink-800)]">
                      Контролируемый свет, дорогие материалы и аккуратная анимация вместо
                      кричащего футуризма.
                    </p>
                  </div>
                </div>
                <div className="executive-card gold-highlight rounded-[28px] px-5 py-5 text-left">
                  <div className="relative">
                    <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--ink-500)]">
                      Цель демо
                    </div>
                    <div className="mt-3 text-lg font-semibold text-[var(--ink-950)]">
                      Готово к переговорам
                    </div>
                    <p className="mt-2 text-sm leading-7 text-[var(--ink-800)]">
                      Экран должен сразу считываться как зрелый продукт, а не как быстрый
                      прототип.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        </main>
      </div>
    </div>
  )
}
