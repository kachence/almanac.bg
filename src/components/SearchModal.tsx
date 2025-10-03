"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { 
  faFileAlt, 
  faBuilding, 
  faFolderOpen, 
  faBookOpen, 
  faDownload, 
  faEdit, 
  faArrowTrendUp,
  faClock
} from "@fortawesome/free-solid-svg-icons"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"

interface SearchResult {
  id: string
  type: 'template' | 'institution' | 'category' | 'doc'
  title: string
  description: string
  url: string
  institution?: string
  hasDocx?: boolean
  isPopular?: boolean
  isRecent?: boolean
}

interface SearchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Mock data - replace with actual API calls
const mockResults: SearchResult[] = [
  {
    id: '1',
    type: 'template',
    title: 'Жалба до НЕЛК',
    description: 'Некачествено обслужване',
    url: '/templates/jalba-nelk',
    institution: 'НЕЛК',
    hasDocx: true,
    isPopular: true
  },
  {
    id: '2',
    type: 'template',
    title: 'Възражение е-фиш',
    description: 'Електронен фиш за нарушение',
    url: '/templates/vazrajenie-efish',
    institution: 'КАТ',
    hasDocx: true,
    isRecent: true
  },
  {
    id: '3',
    type: 'template',
    title: 'Протокол ЕС',
    description: 'Избор на управител',
    url: '/templates/protokol-es',
    institution: 'Съд',
    hasDocx: false
  },
  {
    id: '4',
    type: 'institution',
    title: 'НАП',
    description: 'Национална агенция за приходите',
    url: '/institutions/nap'
  },
  {
    id: '5',
    type: 'category',
    title: 'Автомобили и превозни средства',
    description: '24 шаблона',
    url: '/categories/automotive'
  },
  {
    id: '6',
    type: 'doc',
    title: 'Как да попълня жалба до НЕЛК',
    description: 'Стъпка по стъпка ръководство',
    url: '/guides/jalba-nelk-guide'
  }
]

const topQueries = [
  'жалба до НЕЛК',
  'възражение е-фиш', 
  'протокол ЕС',
  'молба за отпуск',
  'договор за наем'
]

const categories = [
  { name: 'Автомобили', url: '/categories/automotive' },
  { name: 'Недвижими имоти', url: '/categories/real-estate' },
  { name: 'Здравеопазване', url: '/categories/healthcare' }
]

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const router = useRouter()
  const [query, setQuery] = React.useState('')
  const [results, setResults] = React.useState<SearchResult[]>([])
  const [loading, setLoading] = React.useState(false)

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
    onOpenChange(false)
    router.push(result.url)
  }

  const handleSubmit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      onOpenChange(false)
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'template': return faFileAlt
      case 'institution': return faBuilding
      case 'category': return faFolderOpen
      case 'doc': return faBookOpen
      default: return faFileAlt
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'template': return 'Шаблон'
      case 'institution': return 'Институция'
      case 'category': return 'Категория'
      case 'doc': return 'Ръководство'
      default: return 'Резултат'
    }
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Търсене на шаблони, документи и ръководства..."
        value={query}
        onValueChange={setQuery}
        onKeyDown={handleSubmit}
      />
      <CommandList>
        {!query && (
          <>
            <CommandGroup heading="Популярни търсения">
              {topQueries.map((topQuery) => (
                <CommandItem
                  key={topQuery}
                  onSelect={() => {
                    setQuery(topQuery)
                  }}
                  className="flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faArrowTrendUp} className="text-sm text-muted" />
                  <span>{topQuery}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            
            <CommandGroup heading="Категории">
              {categories.map((category) => (
                <CommandItem
                  key={category.name}
                  onSelect={() => {
                    onOpenChange(false)
                    router.push(category.url)
                  }}
                  className="flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faFolderOpen} className="text-sm text-muted" />
                  <span>{category.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {query && results.length === 0 && !loading && (
          <CommandEmpty>Няма намерени резултати за &quot;{query}&quot;</CommandEmpty>
        )}

        {query && results.length > 0 && (
          <>
            {/* Templates */}
            {results.filter(r => r.type === 'template').length > 0 && (
              <CommandGroup heading="Шаблони">
                {results.filter(r => r.type === 'template').slice(0, 6).map((result, index) => {
                  const icon = getIcon(result.type)
                  const isSelected = index === 0 // First item is selected by default
                  return (
                    <CommandItem
                      key={result.id}
                      onSelect={() => handleSelect(result)}
                      className={`flex items-center justify-between gap-2 py-3 ${isSelected ? 'bg-primary/10 border-l-2 border-l-primary' : ''}`}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <FontAwesomeIcon 
                          icon={icon} 
                          className={`text-sm flex-shrink-0 ${isSelected ? 'text-primary' : 'text-muted'}`} 
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`font-medium truncate ${isSelected ? 'text-primary' : 'text-text'}`}>
                              {result.title}
                            </span>
                            {result.isPopular && (
                              <Badge variant="muted" className="text-[10px] px-1 py-0">
                                популярен
                              </Badge>
                            )}
                            {result.isRecent && (
                              <Badge variant="accent" className="text-[10px] px-1 py-0">
                                нов
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted truncate">{result.description}</p>
                          {result.institution && (
                            <p className="text-[10px] text-muted/70">{result.institution}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {result.hasDocx ? (
                          <>
                            <Badge variant="pdf" className="text-[9px] px-1 py-0">PDF</Badge>
                            <Badge variant="docx" className="text-[9px] px-1 py-0">DOCX</Badge>
                          </>
                        ) : (
                          <Badge variant="pdf" className="text-[9px] px-1 py-0">PDF</Badge>
                        )}
                      </div>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            )}

            {/* Institutions */}
            {results.filter(r => r.type === 'institution').length > 0 && (
              <CommandGroup heading="Институции">
                {results.filter(r => r.type === 'institution').slice(0, 4).map((result) => {
                  const icon = getIcon(result.type)
                  return (
                    <CommandItem
                      key={result.id}
                      onSelect={() => handleSelect(result)}
                      className="flex items-center gap-3"
                    >
                      <FontAwesomeIcon icon={icon} className="text-sm text-muted" />
                      <div>
                        <span className="font-medium">{result.title}</span>
                        <p className="text-xs text-muted">{result.description}</p>
                      </div>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            )}

            {/* Categories */}
            {results.filter(r => r.type === 'category').length > 0 && (
              <CommandGroup heading="Категории">
                {results.filter(r => r.type === 'category').slice(0, 3).map((result) => {
                  const icon = getIcon(result.type)
                  return (
                    <CommandItem
                      key={result.id}
                      onSelect={() => handleSelect(result)}
                      className="flex items-center gap-3"
                    >
                      <FontAwesomeIcon icon={icon} className="text-sm text-muted" />
                      <div>
                        <span className="font-medium">{result.title}</span>
                        <p className="text-xs text-muted">{result.description}</p>
                      </div>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            )}

            {/* Docs/Guides */}
            {results.filter(r => r.type === 'doc').length > 0 && (
              <CommandGroup heading="Ръководства">
                {results.filter(r => r.type === 'doc').slice(0, 2).map((result) => {
                  const icon = getIcon(result.type)
                  return (
                    <CommandItem
                      key={result.id}
                      onSelect={() => handleSelect(result)}
                      className="flex items-center gap-3"
                    >
                      <FontAwesomeIcon icon={icon} className="text-sm text-muted" />
                      <div>
                        <span className="font-medium">{result.title}</span>
                        <p className="text-xs text-muted">{result.description}</p>
                      </div>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            )}
          </>
        )}
      </CommandList>
    </CommandDialog>
  )
}
