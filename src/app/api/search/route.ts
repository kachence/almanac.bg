import { NextRequest, NextResponse } from 'next/server'

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

// Mock data - replace with actual database queries
const mockTemplates = [
  {
    id: '1',
    type: 'template' as const,
    title: 'Жалба до НЕЛК',
    description: 'Некачествено обслужване',
    url: '/templates/jalba-nelk',
    institution: 'НЕЛК',
    hasDocx: true,
    isPopular: true,
    keywords: ['жалба', 'нелк', 'некачествено', 'обслужване', 'оплакване']
  },
  {
    id: '2',
    type: 'template' as const,
    title: 'Възражение е-фиш',
    description: 'Електронен фиш за нарушение',
    url: '/templates/vazrajenie-efish',
    institution: 'КАТ',
    hasDocx: true,
    isRecent: true,
    keywords: ['възражение', 'е-фиш', 'електронен', 'фиш', 'нарушение', 'кат', 'глоба']
  },
  {
    id: '3',
    type: 'template' as const,
    title: 'Протокол ЕС',
    description: 'Избор на управител',
    url: '/templates/protokol-es',
    institution: 'Съд',
    hasDocx: false,
    keywords: ['протокол', 'ес', 'етажна', 'собственост', 'управител', 'избор']
  },
  {
    id: '4',
    type: 'template' as const,
    title: 'Молба за отпуск',
    description: 'Служебна молба',
    url: '/templates/molba-otpusk',
    institution: 'Работодател',
    hasDocx: true,
    keywords: ['молба', 'отпуск', 'служебна', 'работодател', 'ваканция']
  },
  {
    id: '5',
    type: 'template' as const,
    title: 'Договор за наем',
    description: 'Наемане на жилище',
    url: '/templates/dogovor-naem',
    institution: 'Частен',
    hasDocx: true,
    isPopular: true,
    keywords: ['договор', 'наем', 'жилище', 'апартамент', 'наемател', 'наемодател']
  }
]

const mockInstitutions = [
  {
    id: 'nap',
    type: 'institution' as const,
    title: 'НАП',
    description: 'Национална агенция за приходите',
    url: '/institutions/nap',
    keywords: ['нап', 'национална', 'агенция', 'приходи', 'данъци', 'декларация']
  },
  {
    id: 'kat',
    type: 'institution' as const,
    title: 'КАТ',
    description: 'Комисия за автомобилна техника',
    url: '/institutions/kat',
    keywords: ['кат', 'комисия', 'автомобилна', 'техника', 'шофьорска', 'книжка']
  },
  {
    id: 'nelk',
    type: 'institution' as const,
    title: 'НЕЛК',
    description: 'Национална електрическа компания',
    url: '/institutions/nelk',
    keywords: ['нелк', 'национална', 'електрическа', 'компания', 'ток', 'електричество']
  }
]

const mockCategories = [
  {
    id: 'automotive',
    type: 'category' as const,
    title: 'Автомобили и превозни средства',
    description: '24 шаблона',
    url: '/categories/automotive',
    keywords: ['автомобили', 'превозни', 'средства', 'кола', 'мотор', 'шофиране']
  },
  {
    id: 'real-estate',
    type: 'category' as const,
    title: 'Недвижими имоти',
    description: '18 шаблона',
    url: '/categories/real-estate',
    keywords: ['недвижими', 'имоти', 'апартамент', 'къща', 'наем', 'продажба']
  },
  {
    id: 'healthcare',
    type: 'category' as const,
    title: 'Здравеопазване',
    description: '12 шаблона',
    url: '/categories/healthcare',
    keywords: ['здравеопазване', 'здраве', 'болница', 'лекар', 'лечение', 'медицина']
  }
]

const mockDocs = [
  {
    id: 'jalba-nelk-guide',
    type: 'doc' as const,
    title: 'Как да попълня жалба до НЕЛК',
    description: 'Стъпка по стъпка ръководство',
    url: '/guides/jalba-nelk-guide',
    keywords: ['как', 'попълня', 'жалба', 'нелк', 'ръководство', 'стъпки']
  }
]

const allMockData = [...mockTemplates, ...mockInstitutions, ...mockCategories, ...mockDocs]

function calculateRelevance(item: any, query: string): number {
  const queryLower = query.toLowerCase()
  let score = 0

  // Exact title match
  if (item.title.toLowerCase() === queryLower) {
    score += 100
  }
  
  // Title contains query
  if (item.title.toLowerCase().includes(queryLower)) {
    score += 50
  }

  // Description contains query
  if (item.description.toLowerCase().includes(queryLower)) {
    score += 25
  }

  // Keywords match
  if (item.keywords) {
    for (const keyword of item.keywords) {
      if (keyword.toLowerCase().includes(queryLower)) {
        score += 10
      }
      if (keyword.toLowerCase() === queryLower) {
        score += 20
      }
    }
  }

  // Institution match
  if (item.institution && item.institution.toLowerCase().includes(queryLower)) {
    score += 15
  }

  // Boost popular items
  if (item.isPopular) {
    score += 5
  }

  // Boost recent items
  if (item.isRecent) {
    score += 3
  }

  return score
}

function generateSnippet(item: any, query: string): string {
  const queryLower = query.toLowerCase()
  
  // Try to find query in description
  if (item.description.toLowerCase().includes(queryLower)) {
    const index = item.description.toLowerCase().indexOf(queryLower)
    const start = Math.max(0, index - 20)
    const end = Math.min(item.description.length, index + query.length + 40)
    let snippet = item.description.substring(start, end)
    
    if (start > 0) snippet = '...' + snippet
    if (end < item.description.length) snippet = snippet + '...'
    
    // Highlight the match
    const regex = new RegExp(`(${query})`, 'gi')
    snippet = snippet.replace(regex, '<mark>$1</mark>')
    
    return snippet
  }
  
  return item.description
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')
  const isTypeahead = searchParams.get('typeahead') === 'true'
  const limit = parseInt(searchParams.get('limit') || '20')
  const offset = parseInt(searchParams.get('offset') || '0')

  if (!query || query.trim().length === 0) {
    return NextResponse.json({ 
      results: [], 
      total: 0, 
      query: '',
      typeahead: isTypeahead 
    })
  }

  try {
    // Calculate relevance scores for all items
    const scoredResults = allMockData
      .map(item => ({
        ...item,
        relevanceScore: calculateRelevance(item, query),
        snippet: generateSnippet(item, query)
      }))
      .filter(item => item.relevanceScore > 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)

    // Apply pagination
    const paginatedResults = scoredResults.slice(offset, offset + limit)

    // Transform to the expected format
    const results: SearchResult[] = paginatedResults.map(item => ({
      id: item.id,
      type: item.type,
      title: item.title,
      description: item.description,
      url: item.url,
      institution: 'institution' in item ? item.institution : undefined,
      hasDocx: 'hasDocx' in item ? item.hasDocx : undefined,
      isPopular: 'isPopular' in item ? item.isPopular : undefined,
      isRecent: 'isRecent' in item ? item.isRecent : undefined,
      snippet: item.snippet,
      relevanceScore: item.relevanceScore
    }))

    return NextResponse.json({
      results,
      total: scoredResults.length,
      query: query.trim(),
      typeahead: isTypeahead,
      hasMore: offset + limit < scoredResults.length
    })

  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    )
  }
}
