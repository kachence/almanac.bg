"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { 
  Search, 
  Filter, 
  SortAsc, 
  FileText, 
  Building2, 
  FolderOpen, 
  BookOpen,
  Download,
  Edit,
  ChevronDown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

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
  snippet?: string
  relevanceScore?: number
}

interface SearchPageContentProps {
  initialQuery: string
  initialResults: SearchResult[]
  initialTotal: number
  initialHasMore: boolean
  initialPage: number
  initialFilters: any
}

const categories = [
  { value: '', label: 'Всички категории' },
  { value: 'automotive', label: 'Автомобили' },
  { value: 'real-estate', label: 'Недвижими имоти' },
  { value: 'healthcare', label: 'Здравеопазване' },
  { value: 'employment', label: 'Трудови отношения' },
  { value: 'business', label: 'Бизнес документи' }
]

const institutions = [
  { value: '', label: 'Всички институции' },
  { value: 'nap', label: 'НАП' },
  { value: 'kat', label: 'КАТ' },
  { value: 'nelk', label: 'НЕЛК' },
  { value: 'noi', label: 'НОИ' },
  { value: 'kzp', label: 'КЗП' },
  { value: 'court', label: 'Съд' }
]

const sortOptions = [
  { value: 'relevance', label: 'Най-подходящи' },
  { value: 'popularity', label: 'Най-популярни' },
  { value: 'newest', label: 'Най-нови' },
  { value: 'alphabetical', label: 'Азбучен ред' }
]

export function SearchPageContent({
  initialQuery,
  initialResults,
  initialTotal,
  initialHasMore,
  initialPage,
  initialFilters
}: SearchPageContentProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [query, setQuery] = React.useState(initialQuery)
  const [results, setResults] = React.useState(initialResults)
  const [total, setTotal] = React.useState(initialTotal)
  const [hasMore, setHasMore] = React.useState(initialHasMore)
  const [loading, setLoading] = React.useState(false)
  const [page, setPage] = React.useState(initialPage)
  
  // Filters
  const [selectedCategory, setSelectedCategory] = React.useState(initialFilters.category || '')
  const [selectedInstitution, setSelectedInstitution] = React.useState(initialFilters.institution || '')
  const [hasDocxFilter, setHasDocxFilter] = React.useState(initialFilters.hasDocx === 'true')
  const [sortBy, setSortBy] = React.useState('relevance')
  const [showFilters, setShowFilters] = React.useState(false)

  const performSearch = React.useCallback(async (
    searchQuery: string,
    pageNum: number = 1,
    filters: any = {}
  ) => {
    if (!searchQuery.trim()) {
      setResults([])
      setTotal(0)
      setHasMore(false)
      return
    }

    setLoading(true)
    
    const searchParams = new URLSearchParams({
      q: searchQuery,
      limit: '20',
      offset: ((pageNum - 1) * 20).toString(),
      typeahead: 'false',
      ...filters
    })

    try {
      const response = await fetch(`/api/search?${searchParams}`)
      if (response.ok) {
        const data = await response.json()
        setResults(data.results)
        setTotal(data.total)
        setHasMore(data.hasMore)
      }
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const updateURL = React.useCallback((newQuery: string, newPage: number = 1, filters: any = {}) => {
    const params = new URLSearchParams()
    if (newQuery) params.set('q', newQuery)
    if (newPage > 1) params.set('page', newPage.toString())
    if (filters.category) params.set('category', filters.category)
    if (filters.institution) params.set('institution', filters.institution)
    if (filters.hasDocx) params.set('hasDocx', 'true')
    if (filters.sort && filters.sort !== 'relevance') params.set('sort', filters.sort)

    const url = `/search${params.toString() ? '?' + params.toString() : ''}`
    router.push(url, { scroll: false })
  }, [router])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const filters = {
      category: selectedCategory,
      institution: selectedInstitution,
      hasDocx: hasDocxFilter,
      sort: sortBy
    }
    
    setPage(1)
    performSearch(query, 1, filters)
    updateURL(query, 1, filters)
  }

  const handleFilterChange = React.useCallback(() => {
    const filters = {
      category: selectedCategory,
      institution: selectedInstitution,
      hasDocx: hasDocxFilter,
      sort: sortBy
    }
    
    setPage(1)
    performSearch(query, 1, filters)
    updateURL(query, 1, filters)
  }, [selectedCategory, selectedInstitution, hasDocxFilter, sortBy, query, performSearch, updateURL])

  React.useEffect(() => {
    handleFilterChange()
  }, [handleFilterChange])

  const getIcon = (type: string) => {
    switch (type) {
      case 'template': return FileText
      case 'institution': return Building2
      case 'category': return FolderOpen
      case 'doc': return BookOpen
      default: return FileText
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
    <div className="container mx-auto px-4">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text mb-4">
          {query ? `Търсене: "${query}"` : 'Търсене'}
        </h1>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted" />
            <Input
              type="search"
              placeholder="Търсете шаблони, документи и ръководства..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-12 pr-4 py-3 text-base"
            />
          </div>
        </form>

        {/* Filters */}
        <div className="space-y-4">
          <Button
            variant="ghost"
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden"
          >
            <Filter className="h-4 w-4 mr-2" />
            Филтри
            <ChevronDown className={cn("h-4 w-4 ml-2 transition-transform", showFilters && "rotate-180")} />
          </Button>

          <div className={cn(
            "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4",
            !showFilters && "hidden lg:grid"
          )}>
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-text mb-1">Категория</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            {/* Institution Filter */}
            <div>
              <label className="block text-sm font-medium text-text mb-1">Институция</label>
              <select
                value={selectedInstitution}
                onChange={(e) => setSelectedInstitution(e.target.value)}
                className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm"
              >
                {institutions.map(inst => (
                  <option key={inst.value} value={inst.value}>{inst.label}</option>
                ))}
              </select>
            </div>

            {/* DOCX Filter */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="hasDocx"
                checked={hasDocxFilter}
                onChange={(e) => setHasDocxFilter(e.target.checked)}
                className="rounded border-border"
              />
              <label htmlFor="hasDocx" className="text-sm font-medium text-text">
                Има DOCX версия
              </label>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-text mb-1">Подредба</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        {query && (
          <div className="mt-6 text-muted">
            {loading ? (
              <p>Търсене...</p>
            ) : (
              <p>
                {total > 0 
                  ? `Намерени ${total} резултата${total === 1 ? '' : 'та'} за "${query}"`
                  : `Няма намерени резултати за "${query}"`
                }
              </p>
            )}
          </div>
        )}
      </div>

      {/* Results */}
      <div className="space-y-4">
        {results.map((result) => {
          const Icon = getIcon(result.type)
          return (
            <Card key={result.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <Icon className="h-5 w-5 text-muted flex-shrink-0 mt-1" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="muted" className="text-xs">
                        {getTypeLabel(result.type)}
                      </Badge>
                      {result.isPopular && (
                        <Badge variant="accent" className="text-xs">популярен</Badge>
                      )}
                      {result.isRecent && (
                        <Badge variant="success" className="text-xs">нов</Badge>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-semibold text-text mb-2 hover:text-accent transition-colors">
                      <a href={result.url} className="block">
                        {result.title}
                      </a>
                    </h3>
                    
                    <p 
                      className="text-muted mb-2"
                      dangerouslySetInnerHTML={{ 
                        __html: result.snippet || result.description 
                      }}
                    />
                    
                    {result.institution && (
                      <p className="text-xs text-muted/70">{result.institution}</p>
                    )}
                  </div>
                </div>
                
                {result.type === 'template' && (
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Badge variant="pdf" className="text-xs">PDF</Badge>
                    {result.hasDocx && (
                      <Badge variant="docx" className="text-xs">DOCX</Badge>
                    )}
                  </div>
                )}
              </div>
            </Card>
          )
        })}
      </div>

      {/* Empty State */}
      {!loading && query && results.length === 0 && (
        <div className="text-center py-12">
          <div className="mb-4">
            <Search className="h-12 w-12 text-muted mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-text mb-2">
            Няма намерени резултати
          </h3>
          <p className="text-muted mb-6">
            Опитайте с различни ключови думи или проверете правописа
          </p>
          
          <div className="space-y-2">
            <p className="text-sm font-medium text-text">Предложения:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {['жалба', 'възражение', 'молба', 'протокол', 'договор'].map(suggestion => (
                <Button
                  key={suggestion}
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setQuery(suggestion)
                    performSearch(suggestion, 1)
                    updateURL(suggestion, 1)
                  }}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Load More */}
      {hasMore && !loading && (
        <div className="text-center mt-8">
          <Button
            onClick={() => {
              const nextPage = page + 1
              setPage(nextPage)
              // TODO: Implement load more functionality
            }}
            disabled={loading}
          >
            Зареди още резултати
          </Button>
        </div>
      )}
    </div>
  )
}
