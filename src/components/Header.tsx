"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { 
  faCalendar, 
  faSearch, 
  faUser, 
  faChevronDown, 
  faBars, 
  faTimes, 
  faSpinner,
  faSignOutAlt,
  faFileAlt
} from "@fortawesome/free-solid-svg-icons"
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { ThemeToggle } from "@/components/theme-toggle"
import { SearchModal } from "@/components/SearchModal"
import AuthModal from "@/components/AuthModal"
import ProfileModal from "@/components/ProfileModal"
import DocumentsModal from "@/components/DocumentsModal"
import { useAuth } from "@/components/auth-provider"
import { analytics } from "@/lib/analytics"
import { cn } from "@/lib/utils"

interface HeaderProps {
  className?: string
}

function HeaderSearch({ className, onSearchModalOpen }: { className?: string, onSearchModalOpen?: () => void }) {
  const router = useRouter()
  const [query, setQuery] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [isFocused, setIsFocused] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim() && !isLoading) {
      setIsLoading(true)
      analytics.searchSubmit('header', query.trim().length)
      
      // Add slight delay to show loading state
      setTimeout(() => {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`)
        setIsLoading(false)
      }, 150)
    }
  }

  const handleFocus = () => {
    setIsFocused(true)
    analytics.searchFocus('header')
    // Open search modal on desktop
    if (window.innerWidth >= 1024 && onSearchModalOpen) {
      onSearchModalOpen()
      // Blur the input to prevent double focus
      inputRef.current?.blur()
    }
  }

  const handleBlur = () => {
    setIsFocused(false)
  }

  const clearSearch = () => {
    setQuery('')
    inputRef.current?.focus()
  }

  return (
    <form onSubmit={handleSubmit} className={cn("relative group", className)}>
      <FontAwesomeIcon 
        icon={faSearch} 
        className={cn(
          "absolute left-4 top-1/2 -translate-y-1/2 text-sm transition-colors",
          isFocused ? "text-primary" : "text-muted"
        )} 
      />
      
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="Търсене: име, празник, дата…"
        disabled={isLoading}
        className={cn(
          "w-full rounded-2xl bg-card border px-12 py-2.5 text-sm text-text transition-all duration-200",
          "placeholder:text-muted/70",
          "focus:outline-none focus:ring-2 focus:ring-primary/35 focus:border-primary/50",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          isFocused ? "border-primary/50 shadow-sm" : "border-border",
          query ? "pr-20" : "pr-16"
        )}
        aria-label="Търсене на документи"
      />

      {/* Clear button */}
      {query && !isLoading && (
        <button
          type="button"
          onClick={clearSearch}
          className="absolute right-14 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-panel/60 transition-colors group"
          aria-label="Изчистване на търсенето"
        >
          <FontAwesomeIcon icon={faTimes} className="text-xs text-muted group-hover:text-text" />
        </button>
      )}

      {/* Loading spinner */}
      {isLoading && (
        <div className="absolute right-14 top-1/2 -translate-y-1/2">
          <FontAwesomeIcon icon={faSpinner} className="text-sm text-primary animate-spin" />
        </div>
      )}

      {/* Keyboard shortcut */}
      <kbd className={cn(
        "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 hidden xl:flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] transition-colors",
        isFocused ? "border-primary/40 bg-primary/5 text-primary" : "border-border bg-panel text-muted"
      )}>
        ⌘K
      </kbd>
    </form>
  )
}

function MobileMenu({ className, onSearchModalOpen, onAuthModalOpen, onProfileModalOpen, onDocumentsModalOpen }: { className?: string, onSearchModalOpen?: () => void, onAuthModalOpen?: () => void, onProfileModalOpen?: () => void, onDocumentsModalOpen?: () => void }) {
  const auth = useAuth()
  const [isOpen, setIsOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  // Prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Close menu when clicking outside
  React.useEffect(() => {
    function handleClickOutside() {
      setIsOpen(false)
    }

    if (isOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [isOpen])

  // Prevent body scroll when menu is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <div className={cn("", className)}>
      <button
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        className="p-2 rounded-lg hover:bg-panel/60 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Затвори меню" : "Отвори меню"}
      >
        {isOpen ? 
          <FontAwesomeIcon icon={faTimes} className="text-base" /> : 
          <FontAwesomeIcon icon={faBars} className="text-base" />
        }
      </button>
      
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-bg/80 backdrop-blur-sm z-40" />
          
          {/* Menu */}
          <div className="absolute top-full left-0 right-0 mt-1 p-4 bg-card/95 backdrop-blur-sm border-b border-border/50 z-50 animate-in slide-in-from-top-2 duration-200">
            <div className="space-y-4">
              <HeaderSearch 
                className="w-full" 
                onSearchModalOpen={onSearchModalOpen}
              />
              
              <nav className="space-y-1" role="navigation" aria-label="Мобилно меню">
                <a 
                  href="/imen-den" 
                  onClick={() => {
                    setIsOpen(false)
                    analytics.navClick('nameday')
                  }}
                  className="block p-3 rounded-lg hover:bg-panel/60 focus:bg-panel/60 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  Имен ден
                </a>
                <a 
                  href="/praznici"
                  onClick={() => {
                    setIsOpen(false)
                    analytics.navClick('holidays')
                  }}
                  className="block p-3 rounded-lg hover:bg-panel/60 focus:bg-panel/60 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  Празници
                </a>
                <a 
                  href="/kalendar"
                  onClick={() => {
                    setIsOpen(false)
                    analytics.navClick('calendar')
                  }}
                  className="block p-3 rounded-lg hover:bg-panel/60 focus:bg-panel/60 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  Календар
                </a>

                {mounted && auth.user ? (
                  <>
                    <button
                      onClick={() => {
                        setIsOpen(false)
                        analytics.navClick('documents')
                        onDocumentsModalOpen?.()
                      }}
                      className="w-full text-left p-3 rounded-lg hover:bg-panel/60 focus:bg-panel/60 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 flex items-center gap-2"
                    >
                      <FontAwesomeIcon icon={faFileAlt} className="text-xs" />
                      Документи
                    </button>
                    <button
                      onClick={() => {
                        setIsOpen(false)
                        analytics.navClick('profile')
                        onProfileModalOpen?.()
                      }}
                      className="w-full text-left p-3 rounded-lg hover:bg-panel/60 focus:bg-panel/60 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 flex items-center gap-2"
                    >
                      <FontAwesomeIcon icon={faUser} className="text-xs" />
                      Профил
                    </button>
                    <hr className="border-border my-2" />
                    <button
                      onClick={() => {
                        setIsOpen(false)
                        analytics.navClick('logout')
                        auth.signOut()
                      }}
                      className="w-full text-left p-3 rounded-lg hover:bg-panel/60 focus:bg-panel/60 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 flex items-center gap-2"
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} className="text-xs" />
                      Излез
                    </button>
                  </>
                ) : mounted ? (
                  <button
                    onClick={() => {
                      setIsOpen(false)
                      analytics.navClick('login')
                      onAuthModalOpen?.()
                    }}
                    className="w-full text-left p-3 rounded-lg hover:bg-panel/60 focus:bg-panel/60 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 flex items-center gap-2"
                  >
                    <FontAwesomeIcon icon={faUser} className="text-xs" />
                    Вход / Регистрация
                  </button>
                ) : null}
              </nav>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export function Header({ className }: HeaderProps) {
  const router = useRouter()
  const auth = useAuth()
  const [scrolled, setScrolled] = React.useState(false)
  const [searchModalOpen, setSearchModalOpen] = React.useState(false)
  const [authModalOpen, setAuthModalOpen] = React.useState(false)
  const [profileModalOpen, setProfileModalOpen] = React.useState(false)
  const [documentsModalOpen, setDocumentsModalOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  // Prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Debug auth state
  React.useEffect(() => {
    console.log('Header: Auth state changed:', {
      user: auth.user?.email || 'No user',
      loading: auth.loading
    })
  }, [auth.user, auth.loading])

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSearchClick = React.useCallback(() => {
    // Desktop (≥lg): open modal, Mobile (<lg): navigate to /search
    if (window.innerWidth >= 1024) {
      setSearchModalOpen(true)
    } else {
      router.push('/search')
    }
  }, [router])

  // Handle ⌘K keyboard shortcut
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        handleSearchClick()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleSearchClick])

  return (
    <header className={cn(
      "transition-all duration-200",
      scrolled 
        ? "border-b border-border bg-[color-mix(in_oklab,var(--bg),transparent_10%)]/70 backdrop-blur supports-[backdrop-filter]:bg-transparent" 
        : "border-b border-transparent bg-transparent",
      className
    )}>
      <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-3">
        {/* Logo */}
        <a href="/" className="inline-flex items-center flex-shrink-0">
          <div className="h-9 w-9 rounded-xl grid place-items-center">
            <FontAwesomeIcon icon={faCalendar} className="text-lg text-primary" />
          </div>
          <span className="font-semibold tracking-tight text-primary text-lg">almanac.bg</span>
        </a>

        {/* Nav - Desktop only */}
        <nav className="ml-6 hidden md:flex items-center gap-1 text-sm text-muted">
          <a href="/imen-den" className="px-3 py-2 rounded-lg hover:bg-panel/60 hover:text-text transition-colors">
            Имен ден
          </a>
          <a href="/praznici" className="px-3 py-2 rounded-lg hover:bg-panel/60 hover:text-text transition-colors">
            Празници
          </a>
          <a href="/kalendar" className="px-3 py-2 rounded-lg hover:bg-panel/60 hover:text-text transition-colors">
            Календар
          </a>
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Search - Desktop only */}
        <HeaderSearch 
          className="hidden lg:flex w-[28rem]" 
          onSearchModalOpen={() => setSearchModalOpen(true)}
        />

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Auth - prevent hydration mismatch */}
        {!mounted ? (
          <button
            className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-sm hover:border-primary/40 transition-colors"
          >
            <FontAwesomeIcon icon={faUser} className="text-xs" />
            <span className="hidden sm:inline">Вход</span>
          </button>
        ) : auth.user ? (
          <Popover className="relative">
            {({ close }) => (
              <>
                <PopoverButton className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-sm hover:border-primary/40 transition-colors focus:outline-none">
                  <FontAwesomeIcon icon={faUser} className="text-xs" />
                  <span className="hidden sm:inline">Акаунт</span>
                  <FontAwesomeIcon icon={faChevronDown} className="text-xs" />
                </PopoverButton>
                <PopoverPanel className="absolute right-0 mt-2 w-48 rounded-2xl border border-border bg-card shadow-lg p-2 z-50">
                  <div className="space-y-1">
                        <button
                          onClick={() => {
                            close()
                            analytics.navClick('documents')
                            setDocumentsModalOpen(true)
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-panel/60 focus:bg-panel/60 transition-colors focus:outline-none text-sm flex items-center gap-2"
                        >
                          <FontAwesomeIcon icon={faFileAlt} className="text-xs" />
                          Документи
                        </button>
                        <button
                          onClick={() => {
                            close()
                            analytics.navClick('profile')
                            setProfileModalOpen(true)
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-panel/60 focus:bg-panel/60 transition-colors focus:outline-none text-sm flex items-center gap-2"
                        >
                          <FontAwesomeIcon icon={faUser} className="text-xs" />
                          Профил
                        </button>
                    <hr className="border-border my-1" />
                    <button
                      onClick={() => {
                        close()
                        analytics.navClick('logout')
                        auth.signOut()
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-panel/60 focus:bg-panel/60 transition-colors focus:outline-none text-sm flex items-center gap-2"
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} className="text-xs" />
                      Излез
                    </button>
                  </div>
                </PopoverPanel>
              </>
            )}
          </Popover>
        ) : (
          <button
            onClick={() => {
              analytics.navClick('login')
              setAuthModalOpen(true)
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-sm hover:border-primary/40 transition-colors"
          >
            <FontAwesomeIcon icon={faUser} className="text-xs" />
            <span className="hidden sm:inline">Вход</span>
          </button>
        )}

        {/* Mobile Menu */}
        <MobileMenu 
          className="lg:hidden" 
          onSearchModalOpen={() => setSearchModalOpen(true)}
          onAuthModalOpen={() => setAuthModalOpen(true)}
          onProfileModalOpen={() => setProfileModalOpen(true)}
          onDocumentsModalOpen={() => setDocumentsModalOpen(true)}
        />
      </div>

      {/* Search Modal */}
      <SearchModal 
        open={searchModalOpen} 
        onOpenChange={setSearchModalOpen} 
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode="login"
      />
      
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
      
      <DocumentsModal
        isOpen={documentsModalOpen}
        onClose={() => setDocumentsModalOpen(false)}
      />
    </header>
  )
}