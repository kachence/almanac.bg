"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Search, FileText, Download, Edit, ArrowRight, Loader2, X } from "lucide-react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFire, faWandMagicSparkles, faPen } from "@fortawesome/free-solid-svg-icons"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SearchModal } from "@/components/SearchModal"
import { analytics } from "@/lib/analytics"
import { cn } from "@/lib/utils"

const topTemplates = [
  {
    slug: '/templates/jalba-nelk',
    title: 'Жалба до НЕЛК',
    sub: 'Некачествено обслужване',
    version: '2025.09',
    hasDocx: true,
    isPopular: true,
    isUpdated: true
  },
  {
    slug: '/templates/vazrajenie-efish',
    title: 'Възражение е-фиш',
    sub: 'Електронен фиш за нарушение',
    version: '2025.09',
    hasDocx: true,
    isRecent: true
  },
  {
    slug: '/templates/protokol-es',
    title: 'Протокол ЕС',
    sub: 'Избор на управител',
    version: '2025.09',
    hasDocx: false,
    isPopular: true
  },
  {
    slug: '/templates/molba-otpusk',
    title: 'Молба за отпуск',
    sub: 'Платен годишен отпуск',
    version: '2025.09',
    hasDocx: true,
    isPopular: true
  },
  {
    slug: '/templates/dogovor-naem',
    title: 'Договор за наем',
    sub: 'Жилищно помещение',
    version: '2025.09',
    hasDocx: true,
    isRecent: true,
    isUpdated: true
  },
  {
    slug: '/templates/zayavlenie-grajdanstvo',
    title: 'Молба за напускане',
    sub: 'Напускане на длъжност',
    version: '2025.09',
    hasDocx: true,
    isRecent: true
  }
]

const popularQueries = ['жалба до НЕЛК', 'е-фиш КАТ', 'пълномощно МПС', 'протокол ЕС']

interface HeroProps {
  className?: string
}

export function Hero({ className }: HeroProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = React.useState('')
  const [isSearching, setIsSearching] = React.useState(false)
  const [isDemoLoading, setIsDemoLoading] = React.useState(false)
  const [isFocused, setIsFocused] = React.useState(false)
  const [searchModalOpen, setSearchModalOpen] = React.useState(false)
  const searchInputRef = React.useRef<HTMLInputElement>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim() && !isSearching) {
      setIsSearching(true)
      analytics.searchSubmit('hero', searchQuery.trim().length)
      
      // Add delay to show loading state
      setTimeout(() => {
        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
        setIsSearching(false)
      }, 200)
    }
  }

  const handleDemoClick = async () => {
    setIsDemoLoading(true)
    analytics.ctaClick('demo_fill')
    
    // Simulate demo loading
    setTimeout(() => {
      console.log('Demo editor opened')
      setIsDemoLoading(false)
      // TODO: Open editor modal with demo document
    }, 800)
  }

  const handleSearchFocus = () => {
    setIsFocused(true)
    analytics.searchFocus('hero')
    // Open search modal on desktop
    if (window.innerWidth >= 1024) {
      setSearchModalOpen(true)
      // Blur the input to prevent double focus
      searchInputRef.current?.blur()
    }
  }

  const handleSearchBlur = () => {
    setIsFocused(false)
  }

  const clearSearch = () => {
    setSearchQuery('')
    searchInputRef.current?.focus()
  }

  const handleQueryPillClick = (query: string) => {
    setSearchQuery(query)
    analytics.searchSubmit('hero', query.length)
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  return (
    <section className={cn("relative", className)}>
      {/* Background */}
      <div className="relative mx-auto max-w-8xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left Column */}
          <div>
            {/* Status Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 text-xs rounded-full border border-border bg-panel/60 px-3 py-1">
                <div className="h-2 w-2 rounded-full bg-accent"></div>
                Обновени образци • v2025.09
              </div>
            </motion.div>

            {/* Hero Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mt-4 text-4xl lg:text-6xl font-semibold leading-tight tracking-tight"
            >
              Готови{" "}
              <span className="text-[color-mix(in_oklab,var(--primary),#4F46E5_25%)]">
                бланки
              </span>
              .<br />
              Попълни{" "}
              <span className="text-[color-mix(in_oklab,var(--accent),#22D3EE_25%)]">
                за минути
              </span>.
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-4 text-[15px] text-muted leading-relaxed"
            >
              Изтегли PDF или DOCX безплатно, ползвай онлайн редактор след регистрация.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-6 flex gap-3"
            >
              <Button
                onClick={handleDemoClick}
                disabled={isDemoLoading}
                size="lg"
                className="rounded-2xl bg-primary hover:bg-[color-mix(in_oklab,var(--primary),#000_12%)] text-primary-foreground px-6 py-3 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDemoLoading ? (
                  <>
                    Зареждане...
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  </>
                ) : (
                  <>
                    Попълни онлайн (демо)
                    <Edit className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                size="lg"
                asChild
                className="rounded-2xl border border-border px-6 py-3 text-sm hover:border-primary/40"
              >
                <a 
                  href="/categories"
                  onClick={() => analytics.ctaClick('browse_templates')}
                >
                  Разгледай образци
                  <FileText className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </motion.div>

            {/* Search + Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-8"
            >
              <form onSubmit={handleSearch}>
                <div className="relative group">
                  <Search className={cn(
                    "absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors",
                    isFocused ? "text-primary" : "text-muted"
                  )} />
                  
                  <input
                    ref={searchInputRef}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={handleSearchFocus}
                    onBlur={handleSearchBlur}
                    disabled={isSearching}
                    className={cn(
                      "w-full rounded-2xl bg-card border px-14 py-4 text-[15px] text-text transition-all duration-200",
                      "placeholder:text-muted/70",
                      "focus:ring-2 focus:ring-primary/35 focus:outline-none focus:border-primary/50",
                      "disabled:opacity-50 disabled:cursor-not-allowed",
                      isFocused ? "border-primary/50 shadow-lg" : "border-border",
                      searchQuery ? "pr-20" : "pr-14"
                    )}
                    placeholder="жалба до НЕЛК, възражение е-фиш, протокол ЕС…"
                    name="q"
                    aria-label="Търсене на документи"
                  />

                  {/* Clear button */}
                  {searchQuery && !isSearching && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute right-5 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-panel/60 transition-colors group"
                      aria-label="Изчистване на търсенето"
                    >
                      <X className="h-4 w-4 text-muted group-hover:text-text" />
                    </button>
                  )}

                  {/* Loading spinner */}
                  {isSearching && (
                    <div className="absolute right-5 top-1/2 -translate-y-1/2">
                      <Loader2 className="h-5 w-5 text-primary animate-spin" />
                    </div>
                  )}
                </div>
              </form>
              
              {/* Popular Query Pills */}
              <div className="mt-4 flex flex-wrap gap-2">
                {popularQueries.map((query) => (
                  <button
                    key={query}
                    onClick={() => handleQueryPillClick(query)}
                    disabled={isSearching}
                    className="text-xs rounded-xl border border-border px-3 py-1.5 hover:border-primary/40 hover:bg-primary/5 focus:border-primary/40 focus:bg-primary/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {query}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Trust Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-4 flex items-center gap-3 text-xs text-muted"
            >
              <Badge variant="pdf" className="text-xs">PDF безплатно</Badge>
              <Badge variant="docx" className="text-xs">DOCX безплатно</Badge>
              <span>КАТ, КЗП, НАП, НОИ и др.</span>
            </motion.div>
          </div>

          {/* Right Column - Top Templates */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
             className="grid grid-cols-2 gap-4"
          >
            {topTemplates.map((template, index) => (
              <motion.a
                key={template.slug}
                href={template.slug}
                onClick={() => analytics.featuredTemplateClick(template.slug)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                className="group rounded-2xl border border-border bg-card backdrop-blur-sm p-5 shadow-sm hover:shadow-md hover:border-primary/30 hover:bg-card/80 transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {template.isPopular && (
                        <Badge variant="warning" className="text-[10px] px-1.5 py-0.5 flex items-center gap-1">
                          <FontAwesomeIcon icon={faFire} className="text-[8px]" />
                          Популярен
                        </Badge>
                      )}
                      {template.isRecent && (
                        <Badge variant="accent" className="text-[10px] px-1.5 py-0.5 flex items-center gap-1">
                          <FontAwesomeIcon icon={faWandMagicSparkles} className="text-[8px]" />
                          Нов
                        </Badge>
                      )}
                      {template.isUpdated && (
                        <Badge variant="muted" className="text-[10px] px-1.5 py-0.5 flex items-center gap-1">
                          <FontAwesomeIcon icon={faPen} className="text-[8px]" />
                          Обновен
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-medium text-text group-hover:text-primary transition-colors">
                      {template.title}
                    </h3>
                    <p className="text-xs text-muted mt-0.5">{template.sub}</p>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.preventDefault()
                      analytics.ctaClick('demo_fill')
                      console.log(`Open editor for ${template.title}`)
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-all duration-200 text-xs rounded-lg border border-border bg-panel/60 px-2 py-1 hover:border-primary/40 hover:bg-primary/5 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary/40"
                    aria-label={`Попълни ${template.title}`}
                  >
                    Попълни
                  </button>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex gap-2">
                    <Badge variant="pdf" className="text-[10px] px-1.5 py-0.5">PDF</Badge>
                    {template.hasDocx && (
                      <Badge variant="docx" className="text-[10px] px-1.5 py-0.5">DOCX</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-muted">
                    <span>v{template.version}</span>
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal 
        open={searchModalOpen} 
        onOpenChange={setSearchModalOpen} 
      />
    </section>
  )
}