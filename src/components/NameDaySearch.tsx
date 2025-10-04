'use client'

import { Search, User, X } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

// Bulgarian alphabet (28 letters) with name counts (mock data)
const ALPHABET = [
  { letter: 'А', count: 45 },
  { letter: 'Б', count: 23 },
  { letter: 'В', count: 34 },
  { letter: 'Г', count: 18 },
  { letter: 'Д', count: 28 },
  { letter: 'Е', count: 15 },
  { letter: 'Ж', count: 8 },
  { letter: 'З', count: 12 },
  { letter: 'И', count: 52 },
  { letter: 'Й', count: 6 },
  { letter: 'К', count: 31 },
  { letter: 'Л', count: 22 },
  { letter: 'М', count: 41 },
  { letter: 'Н', count: 27 },
  // Second row
  { letter: 'О', count: 9 },
  { letter: 'П', count: 38 },
  { letter: 'Р', count: 25 },
  { letter: 'С', count: 43 },
  { letter: 'Т', count: 19 },
  { letter: 'У', count: 3 },
  { letter: 'Ф', count: 7 },
  { letter: 'Х', count: 11 },
  { letter: 'Ц', count: 5 },
  { letter: 'Ч', count: 4 },
  { letter: 'Ш', count: 2 },
  { letter: 'Щ', count: 1 },
  { letter: 'Ю', count: 3 },
  { letter: 'Я', count: 14 },
]

const TOP_NAMES = ['Иван', 'Георги', 'Димитър', 'Мария', 'Елена', 'Николай', 'Петър', 'Стефан']

// Mock name database for autocomplete
const NAME_DATABASE = [
  { name: 'Иван', slug: 'ivan', dates: '7 януари, 24 юни', isPopular: true },
  { name: 'Ивана', slug: 'ivana', dates: '7 януари', isPopular: false },
  { name: 'Ивайло', slug: 'ivaylo', dates: '2 юли', isPopular: false },
  { name: 'Георги', slug: 'georgi', dates: '6 май (Гергьовден)', isPopular: true },
  { name: 'Гергана', slug: 'gergana', dates: '6 май', isPopular: true },
  { name: 'Димитър', slug: 'dimitar', dates: '26 октомври', isPopular: true },
  { name: 'Димитрина', slug: 'dimitrina', dates: '26 октомври', isPopular: false },
  { name: 'Мария', slug: 'maria', dates: '15 август, 21 септември', isPopular: true },
  { name: 'Марин', slug: 'marin', dates: '21 септември', isPopular: false },
  { name: 'Елена', slug: 'elena', dates: '21 май', isPopular: true },
  { name: 'Николай', slug: 'nikolay', dates: '6 декември, 19 декември', isPopular: true },
  { name: 'Никола', slug: 'nikola', dates: '6 декември', isPopular: true },
  { name: 'Петър', slug: 'petar', dates: '29 юни', isPopular: true },
  { name: 'Петра', slug: 'petra', dates: '29 юни', isPopular: false },
  { name: 'Стефан', slug: 'stefan', dates: '27 декември, 9 януари', isPopular: true },
  { name: 'Стефка', slug: 'stefka', dates: '27 декември', isPopular: false },
  { name: 'Александър', slug: 'aleksandar', dates: '30 август', isPopular: true },
  { name: 'Александра', slug: 'aleksandra', dates: '30 август', isPopular: true },
  { name: 'Денис', slug: 'denis', dates: '3 октомври', isPopular: false },
  { name: 'Тодор', slug: 'todor', dates: '1 март, 17 февруари', isPopular: true },
]

export function NameDaySearch() {
  const [query, setQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [suggestions, setSuggestions] = useState<typeof NAME_DATABASE>([])
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Filter suggestions based on query
  useEffect(() => {
    if (query.trim().length >= 1) {
      const filtered = NAME_DATABASE.filter(name =>
        name.name.toLowerCase().startsWith(query.toLowerCase())
      ).slice(0, 6)
      setSuggestions(filtered)
      setShowDropdown(true)
    } else {
      setSuggestions([])
      setShowDropdown(false)
    }
  }, [query])

  const handleLetterClick = (letter: string) => {
    setQuery(letter)
    inputRef.current?.focus()
  }

  const handleNameClick = (name: string) => {
    setQuery(name)
    inputRef.current?.focus()
  }

  const clearSearch = () => {
    setQuery('')
    setSuggestions([])
    setShowDropdown(false)
  }

  const handleSuggestionClick = () => {
    setShowDropdown(false)
  }

  return (
    <section id="imen-den" className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/20 rounded-full mb-4">
            <User className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
            Кога е имен ден на…
          </h2>
          <p className="text-lg text-muted-strong max-w-3xl mx-auto">
            Напиши име — ще ти покажем точната дата, традициите и бързи поздрави.
          </p>
        </div>

        {/* Search Input */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative" ref={dropdownRef}>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 z-10">
              <User className="w-5 h-5 text-muted" />
              <span className="text-muted/30">|</span>
              <Search className="w-5 h-5 text-muted" />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => {
                if (suggestions.length > 0) setShowDropdown(true)
              }}
              placeholder="Търси име... (напр. Иван, Мария, Георги)"
              className="w-full pl-28 pr-12 py-4 bg-card border-2 border-border rounded-xl text-text placeholder-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-lg shadow-sm"
            />
            {query && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-panel transition-colors z-10"
                aria-label="Изчисти търсенето"
              >
                <X className="w-5 h-5 text-muted hover:text-text" />
              </button>
            )}

            {/* Autocomplete Dropdown */}
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card border-2 border-border rounded-xl shadow-[0_4px_12px_rgba(31,25,21,.12),0_12px_32px_rgba(31,25,21,.08)] overflow-hidden z-20">
                {suggestions.length > 0 ? (
                  <div className="py-2">
                    {suggestions.map((suggestion) => (
                      <Link
                        key={suggestion.slug}
                        href={`/imen-den/${suggestion.slug}`}
                        onClick={handleSuggestionClick}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-accent/10 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-[#FFF0C8] border border-[#F0C770] flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-[#C95502]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-text group-hover:text-primary transition-colors">
                              {suggestion.name}
                            </span>
                            {suggestion.isPopular && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent/20 text-muted-strong font-medium">
                                популярен
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted truncate">
                            {suggestion.dates}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : query.trim().length >= 1 ? (
                  <div className="py-8 px-4 text-center">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-muted/10 flex items-center justify-center">
                      <Search className="w-6 h-6 text-muted" />
                    </div>
                    <p className="text-muted font-medium mb-1">
                      Не намерено &quot;{query}&quot;
                    </p>
                    <p className="text-sm text-muted/70">
                      Опитайте с друго име или използвайте азбучния индекс
                    </p>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>

        {/* Alphabet Index - 2 rows of 14 */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-muted mb-4 text-center">
            Азбучен индекс:
          </p>
          <div className="max-w-4xl mx-auto">
            {/* First row (14 letters) */}
            <div className="grid grid-cols-7 sm:grid-cols-14 gap-2 mb-2">
              {ALPHABET.slice(0, 14).map(({ letter, count }) => (
                <button
                  key={letter}
                  onClick={() => handleLetterClick(letter)}
                  className="relative w-full aspect-square min-h-[44px] flex items-center justify-center rounded-lg bg-card border border-border hover:border-primary hover:bg-accent/10 hover:text-primary transition-all font-semibold text-text hover:scale-105 active:scale-95"
                >
                  {letter}
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-sm">
                    {count}
                  </span>
                </button>
              ))}
            </div>
            {/* Second row (14 letters) */}
            <div className="grid grid-cols-7 sm:grid-cols-14 gap-2">
              {ALPHABET.slice(14, 28).map(({ letter, count }) => (
                <button
                  key={letter}
                  onClick={() => handleLetterClick(letter)}
                  className="relative w-full aspect-square min-h-[44px] flex items-center justify-center rounded-lg bg-card border border-border hover:border-primary hover:bg-accent/10 hover:text-primary transition-all font-semibold text-text hover:scale-105 active:scale-95"
                >
                  {letter}
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-sm">
                    {count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Top Names This Month - Now clickable */}
        <div>
          <p className="text-sm font-semibold text-muted mb-4 text-center">
            Топ имена този месец:
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {TOP_NAMES.map((name) => (
              <button
                key={name}
                onClick={() => handleNameClick(name)}
                className="px-4 py-2 bg-[#FFF0C8] text-[#1F1915] border border-[#F0C770] hover:border-primary hover:bg-accent/90 rounded-full transition-all font-medium hover:scale-105 active:scale-95 shadow-sm"
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

