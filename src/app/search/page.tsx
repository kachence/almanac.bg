import * as React from "react"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { SearchPageContent } from "@/components/SearchPageContent"

interface SearchPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const query = typeof searchParams.q === 'string' ? searchParams.q : ''
  
  if (!query) {
    return {
      title: 'Търсене | blanka.bg',
      description: 'Търсете сред хиляди готови бланки и образци за всички български институции'
    }
  }

  return {
    title: `Търсене: "${query}" | blanka.bg`,
    description: `Резултати от търсенето за "${query}" - намерете готови бланки и образци`,
    openGraph: {
      title: `Търсене: "${query}" | blanka.bg`,
      description: `Резултати от търсенето за "${query}" - намерете готови бланки и образци`,
    }
  }
}

async function getSearchResults(
  query: string,
  offset: number = 0,
  filters: any = {}
) {
  const searchParams = new URLSearchParams({
    q: query,
    limit: '20',
    offset: offset.toString(),
    typeahead: 'false',
    ...filters
  })

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/search?${searchParams}`,
      { cache: 'no-store' } // Disable caching for search results
    )
    
    if (!response.ok) {
      throw new Error('Search failed')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Search error:', error)
    return {
      results: [],
      total: 0,
      query,
      hasMore: false
    }
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = typeof searchParams.q === 'string' ? searchParams.q.trim() : ''
  const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page) : 1
  const category = typeof searchParams.category === 'string' ? searchParams.category : ''
  const institution = typeof searchParams.institution === 'string' ? searchParams.institution : ''
  const hasDocx = searchParams.hasDocx === 'true'
  
  const offset = (page - 1) * 20
  const filters = {
    ...(category && { category }),
    ...(institution && { institution }),
    ...(hasDocx && { hasDocx: 'true' })
  }

  // Get search results on server side for SEO
  const searchData = query ? await getSearchResults(query, offset, filters) : {
    results: [],
    total: 0,
    query: '',
    hasMore: false
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="pt-24 pb-20">
        <SearchPageContent 
          initialQuery={query}
          initialResults={searchData.results}
          initialTotal={searchData.total}
          initialHasMore={searchData.hasMore}
          initialPage={page}
          initialFilters={filters}
        />
      </div>
    </div>
  )
}

