"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { User, Gift, Calendar, Sparkles, Clock, ArrowRight, Search as SearchIcon } from 'lucide-react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

interface SearchResult {
  id: string
  type: 'nameday' | 'holiday' | 'date' | 'quick'
  title: string
  description: string
  url: string
  date?: string
  isPopular?: boolean
  isToday?: boolean
}

interface SearchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Mock data - replace with actual API calls
const mockResults: SearchResult[] = [
  {
    id: '1',
    type: 'nameday',
    title: 'Иван',
    description: '7 януари, 24 юни',
    url: '/imen-den/ivan',
    isPopular: true
  },
  {
    id: '2',
    type: 'nameday',
    title: 'Мария',
    description: '15 август, 21 септември',
    url: '/imen-den/maria',
    isPopular: true
  },
  {
    id: '3',
    type: 'nameday',
    title: 'Георги',
    description: '6 май (Гергьовден)',
    url: '/imen-den/georgi',
    isPopular: true
  },
  {
    id: '4',
    type: 'holiday',
    title: 'Великден',
    description: '20 април 2025',
    url: '/praznik/velikden',
    date: '20 април 2025'
  },
  {
    id: '5',
    type: 'holiday',
    title: 'Коледа',
    description: '25 декември • Официален празник',
    url: '/praznik/koleda',
    date: '25 декември'
  },
  {
    id: '6',
    type: 'holiday',
    title: 'Ивановден',
    description: '7 януари • Празник на Иван',
    url: '/praznik/ivanovden',
    date: '7 януари'
  },
  {
    id: '7',
    type: 'date',
    title: '3 октомври 2025',
    description: 'Петък • Работен ден',
    url: '/kalendar/2025/10/3',
    isToday: true
  }
]

const quickActions = [
  { name: 'Днес', url: '/kalendar/2025/10/3', icon: Sparkles },
  { name: 'Този месец', url: '/kalendar/2025/10', icon: Calendar },
  { name: 'Неработни дни 2025', url: '/kalendar/2025#nerabotni', icon: Clock }
]

const topQueries = [
  'Иван',
  'Великден', 
  'Коледа',
  'Гергьовден',
  'Баба Марта'
]

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const router = useRouter()
  const [query, setQuery] = React.useState('')
  const [results, setResults] = React.useState<SearchResult[]>([])
  const [loading, setLoading] = React.useState(false)
  const [recentSearches, setRecentSearches] = React.useState<string[]>([])

  // Load recent searches from localStorage
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('almanac_recent_searches')
      if (stored) {
        setRecentSearches(JSON.parse(stored).slice(0, 5))
      }
    }
  }, [])

  // Save search to recent
  const saveRecentSearch = (searchQuery: string) => {
    if (typeof window !== 'undefined' && searchQuery.trim()) {
      const stored = localStorage.getItem('almanac_recent_searches')
      const recent = stored ? JSON.parse(stored) : []
      const updated = [searchQuery, ...recent.filter((s: string) => s !== searchQuery)].slice(0, 5)
      localStorage.setItem('almanac_recent_searches', JSON.stringify(updated))
      setRecentSearches(updated)
    }
  }

  // Debounced search
  React.useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    const timeoutId = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&typeahead=true&limit=10`)
        if (response.ok) {
          const data = await response.json()
          setResults(data.results)
        } else {
          // Fallback to mock data if API fails
          const filtered = mockResults.filter(result => 
            result.title.toLowerCase().includes(query.toLowerCase()) ||
            result.description.toLowerCase().includes(query.toLowerCase())
          )
          setResults(filtered)
        }
      } catch (error) {
        console.error('Search failed:', error)
        // Fallback to mock data
        const filtered = mockResults.filter(result => 
          result.title.toLowerCase().includes(query.toLowerCase()) ||
          result.description.toLowerCase().includes(query.toLowerCase())
        )
        setResults(filtered)
      } finally {
        setLoading(false)
      }
    }, 200)

    return () => {
      clearTimeout(timeoutId)
      setLoading(false)
    }
  }, [query])

  const handleSelect = (result: SearchResult) => {
    saveRecentSearch(query)
    onOpenChange(false)
    router.push(result.url)
  }

  const handleSubmit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      saveRecentSearch(query)
      onOpenChange(false)
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'nameday': return User
      case 'holiday': return Gift
      case 'date': return Calendar
      case 'quick': return Sparkles
      default: return Calendar
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'nameday': return 'Имен ден'
      case 'holiday': return 'Празник'
      case 'date': return 'Дата'
      case 'quick': return 'Бързо'
      default: return 'Резултат'
    }
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Търсене: име, празник, дата..."
        value={query}
        onValueChange={setQuery}
        onKeyDown={handleSubmit}
      />
      <CommandList className="max-h-[400px] scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
        {!query && (
          <>
            <CommandGroup heading="БЪРЗИ ДЕЙСТВИЯ" className="[&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-muted/70 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-3">
              <div className="bg-accent/5 rounded-lg p-2 mb-2">
                {quickActions.map((action) => {
                  const Icon = action.icon
                  return (
                    <CommandItem
                      key={action.name}
                      onSelect={() => {
                        onOpenChange(false)
                        router.push(action.url)
                      }}
                      className="flex items-center gap-3 py-3 px-3 mb-1 last:mb-0 rounded-lg hover:bg-card transition-all hover:-translate-y-[1px] cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <span className="font-semibold text-text">{action.name}</span>
                      <ArrowRight className="w-4 h-4 text-muted ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </CommandItem>
                  )
                })}
              </div>
            </CommandGroup>

            {/* Divider */}
            <div className="h-px bg-border my-2" />

            {recentSearches.length > 0 && (
              <>
                <CommandGroup heading="СКОРОШНИ ТЪРСЕНИЯ" className="[&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-muted/70 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-3">
                  {recentSearches.map((recent) => (
                    <CommandItem
                      key={recent}
                      onSelect={() => {
                        setQuery(recent)
                      }}
                      className="flex items-center gap-3 px-3 py-2"
                    >
                      <Clock className="w-4 h-4 text-muted" />
                      <span>{recent}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
                <div className="h-px bg-border my-2" />
              </>
            )}
            
            <CommandGroup heading="ПОПУЛЯРНИ ТЪРСЕНИЯ" className="[&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-muted/70 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-3">
              {topQueries.map((topQuery) => (
                <CommandItem
                  key={topQuery}
                  onSelect={() => {
                    setQuery(topQuery)
                  }}
                  className="flex items-center gap-3 px-3 py-2"
                >
                  <SearchIcon className="w-4 h-4 text-muted" />
                  <span>{topQuery}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {query && results.length === 0 && !loading && (
          <CommandEmpty>
            <div className="py-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/10 flex items-center justify-center">
                <SearchIcon className="w-8 h-8 text-muted" />
              </div>
              <p className="text-muted font-medium mb-1">
                Няма намерени резултати
              </p>
              <p className="text-sm text-muted/70">
                Опитайте с друго име, празник или дата
              </p>
            </div>
          </CommandEmpty>
        )}

        {query && results.length > 0 && (
          <>
            {/* Name Days */}
            {results.filter(r => r.type === 'nameday').length > 0 && (
              <CommandGroup heading="ИМЕНИ ДНИ" className="[&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-muted/70 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-3">
                {results.filter(r => r.type === 'nameday').slice(0, 6).map((result, index) => {
                  const Icon = getIcon(result.type)
                  const isFirst = index === 0
                  return (
                    <CommandItem
                      key={result.id}
                      onSelect={() => handleSelect(result)}
                      className={`flex items-center gap-3 py-3 px-3 mb-1 rounded-lg ${isFirst ? 'bg-accent/10 border-l-2 border-l-primary' : ''}`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#FFF0C8] border border-[#F0C770] flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-[#C95502]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold truncate ${isFirst ? 'text-primary' : 'text-text'}`}>
                            {result.title}
                          </span>
                          {result.isPopular && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent/20 text-muted-strong font-medium">
                              популярен
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted truncate">{result.description}</p>
                      </div>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            )}
            
            {/* Divider between sections */}
            {results.filter(r => r.type === 'nameday').length > 0 && results.filter(r => r.type === 'holiday').length > 0 && (
              <div className="h-px bg-border my-2" />
            )}

            {/* Holidays */}
            {results.filter(r => r.type === 'holiday').length > 0 && (
              <CommandGroup heading="ПРАЗНИЦИ" className="[&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-muted/70 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-3">
                {results.filter(r => r.type === 'holiday').slice(0, 4).map((result) => {
                  const Icon = getIcon(result.type)
                  return (
                    <CommandItem
                      key={result.id}
                      onSelect={() => handleSelect(result)}
                      className="flex items-center gap-3 py-3 px-3 mb-1 rounded-lg"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#FDEAEA] border border-[#F5C6C6] flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-[#CC2B2B]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-semibold truncate block">{result.title}</span>
                        <p className="text-sm text-muted truncate">{result.description}</p>
                      </div>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            )}
            
            {/* Divider between sections */}
            {results.filter(r => r.type === 'holiday').length > 0 && results.filter(r => r.type === 'date').length > 0 && (
              <div className="h-px bg-border my-2" />
            )}

            {/* Dates */}
            {results.filter(r => r.type === 'date').length > 0 && (
              <CommandGroup heading="ДАТИ" className="[&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-muted/70 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-3">
                {results.filter(r => r.type === 'date').slice(0, 3).map((result) => {
                  const Icon = getIcon(result.type)
                  return (
                    <CommandItem
                      key={result.id}
                      onSelect={() => handleSelect(result)}
                      className="flex items-center gap-3 py-3 px-3 mb-1 rounded-lg"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        result.isToday 
                          ? 'bg-primary text-white' 
                          : 'bg-card border border-border'
                      }`}>
                        <Icon className={`w-4 h-4 ${result.isToday ? 'text-white' : 'text-primary'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold truncate">{result.title}</span>
                          {result.isToday && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary text-white font-medium">
                              днес
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted truncate">{result.description}</p>
                      </div>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            )}

            {/* View All Results Link */}
            <div className="px-3 py-3 border-t border-border mt-2">
              <button
                onClick={() => {
                  saveRecentSearch(query)
                  onOpenChange(false)
                  router.push(`/search?q=${encodeURIComponent(query.trim())}`)
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:text-primary-hover transition-colors rounded-lg hover:bg-accent/10"
              >
                <span>Виж всички резултати</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </CommandList>

      {/* Keyboard Hints Footer */}
      <div className="border-t border-border px-3 py-2 flex items-center justify-between text-xs text-muted bg-bg-alt/50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-card border border-border font-mono">↑</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-card border border-border font-mono">↓</kbd>
            <span className="ml-1">навигация</span>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-card border border-border font-mono">↵</kbd>
            <span className="ml-1">избор</span>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-card border border-border font-mono">esc</kbd>
            <span className="ml-1">затвори</span>
          </div>
        </div>
        <div className="text-[10px] text-muted/70">
          ⌘K
        </div>
      </div>
    </CommandDialog>
  )
}
