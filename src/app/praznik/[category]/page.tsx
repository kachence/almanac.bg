import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ChevronRight, Calendar, Download, Bell } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import Link from 'next/link'

// Available holiday categories
const AVAILABLE_CATEGORIES = [
  'tsarkoven', 'natsionalen', 'profesionalen', 'chuzhdestranen'
]

const CATEGORY_NAMES: Record<string, string> = {
  'tsarkoven': 'Православни (църковни)',
  'natsionalen': 'Национални',
  'profesionalen': 'Професионални',
  'chuzhdestranen': 'Чуждестранни'
}

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  'tsarkoven': 'Православните празници са по календара на Българската православна църква (БПЦ). Датите на подвижните празници се изчисляват спрямо Великден.',
  'natsionalen': 'Национални празници и официални неработни дни в България. Свалете ICS календар с всички неработни дни за годината.',
  'profesionalen': 'Професионални дни в България — дни на учителя, полицията, медиците и други професии. Това са работни дни с традиционни чествания.',
  'chuzhdestranen': 'Чуждестранни празници с популярност в България (Свети Валентин, Хелоуин и др.). Вижте как се отбелязват и у нас.'
}

interface Holiday {
  date: string
  day: number
  month: string
  title: string
  shortTitle?: string
  type: 'religious' | 'national' | 'professional' | 'foreign'
  isOfficial: boolean
  isMovable: boolean
  description: string
  slug: string
  icon: string
}

interface CategoryData {
  category: string
  categoryName: string
  year: number
  description: string
  totalHolidays: number
  holidays: Holiday[]
}

interface PageProps {
  params: {
    category: string
  }
  searchParams: {
    year?: string
    filter?: string
    sort?: string
    page?: string
  }
}

// Load category data
async function getCategoryData(category: string, year: number): Promise<CategoryData | null> {
  try {
    // In production, this would load from JSON files
    const data = await import(`@/data/holidays/${category}-${year}.json`)
    return data.default
  } catch {
    return null
  }
}

// Generate static params for all categories
export async function generateStaticParams() {
  return AVAILABLE_CATEGORIES.map((category) => ({
    category,
  }))
}

// Generate metadata for SEO
export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const categoryName = CATEGORY_NAMES[params.category]
  if (!categoryName) return {}

  const year = parseInt(searchParams.year || '2025', 10)
  const data = await getCategoryData(params.category, year)
  if (!data) return {}

  return {
    title: `${categoryName} празници ${year} | Almanac.bg`,
    description: data.description,
    keywords: `${categoryName.toLowerCase()} празници, празници ${year}, неработни дни ${year}, български празници`,
    openGraph: {
      title: `${categoryName} празници ${year}`,
      description: data.description,
      type: 'website',
    },
  }
}

export default async function HolidayCategoryPage({ params, searchParams }: PageProps) {
  const { category } = params
  const { year = '2025', filter, sort = 'date', page = '1' } = searchParams

  // Validate category
  if (!AVAILABLE_CATEGORIES.includes(category)) {
    notFound()
  }

  const selectedYear = parseInt(year, 10)
  const categoryData = await getCategoryData(category, selectedYear)
  
  // If no data for this year, try to load default/mock data
  if (!categoryData) {
    // Return with empty data
    return (
      <div className="min-h-screen bg-bg">
        <Header />
        <main className="py-12 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <Calendar className="w-16 h-16 text-muted mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-text mb-4">Няма данни за {selectedYear}</h1>
            <p className="text-muted mb-6">Данните за тази категория и година все още не са налични.</p>
            <Link href="/praznik" className="text-primary hover:underline">
              ← Върни се към празниците
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const categoryName = CATEGORY_NAMES[category]
  const currentPage = parseInt(page, 10)
  const itemsPerPage = 40

  // Filter holidays
  let filteredHolidays = categoryData.holidays
  if (filter === 'official') {
    filteredHolidays = filteredHolidays.filter(h => h.isOfficial)
  } else if (filter === 'movable') {
    filteredHolidays = filteredHolidays.filter(h => h.isMovable)
  } else if (filter === 'fixed') {
    filteredHolidays = filteredHolidays.filter(h => !h.isMovable)
  }

  // Sort
  const sortedHolidays = [...filteredHolidays].sort((a, b) => {
    if (sort === 'alphabetical') {
      return a.title.localeCompare(b.title, 'bg')
    }
    return new Date(a.date).getTime() - new Date(b.date).getTime() // default: by date
  })

  // Pagination
  const totalPages = Math.ceil(sortedHolidays.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedHolidays = sortedHolidays.slice(startIndex, startIndex + itemsPerPage)

  // Available years for picker
  const availableYears = [2025, 2026, 2027, 2028, 2029, 2030]

  // Get month names
  const getMonthName = (month: string): string => {
    const months: Record<string, string> = {
      'yanuari': 'януари', 'februari': 'февруари', 'mart': 'март',
      'april': 'април', 'may': 'май', 'yuni': 'юни',
      'yuli': 'юли', 'avgust': 'август', 'septemvri': 'септември',
      'oktomvri': 'октомври', 'noemvri': 'ноември', 'dekemvri': 'декември'
    }
    return months[month] || month
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-bg">
        {/* Breadcrumbs & Hero */}
        <section className="py-8 px-4 border-b border-border">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumbs */}
            <nav className="flex items-center text-sm text-muted mb-6" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-text transition-colors">
                Начало
              </Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <Link href="/praznik" className="hover:text-text transition-colors">
                Празници
              </Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <span className="text-text font-medium">{categoryName}</span>
            </nav>

            {/* Header */}
            <div className="flex items-center gap-4 mb-4">
              <Calendar className="w-10 h-10 text-primary" />
              <h1 className="text-4xl lg:text-5xl font-bold text-text">
                {categoryName} празници — {selectedYear}
              </h1>
            </div>

            {/* Meta strip */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted mb-4">
              <span>{filteredHolidays.length} празника</span>
              <span>•</span>
              <span>{filteredHolidays.filter(h => h.isOfficial).length} неработни дни</span>
              <span>•</span>
              <span>{filteredHolidays.filter(h => h.isMovable).length} подвижни</span>
            </div>

            {/* Description */}
            <p className="text-lg text-muted-strong max-w-3xl">
              {CATEGORY_DESCRIPTIONS[category]}
            </p>
          </div>
        </section>

        {/* Year Picker */}
        <section className="py-4 px-4 bg-panel/30 border-b border-border sticky top-0 z-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <span className="text-sm font-medium text-text mr-2 flex-shrink-0">Година:</span>
              {availableYears.map((y) => (
                <Link
                  key={y}
                  href={`/praznik/${category}?year=${y}`}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                    ${y === selectedYear
                      ? 'bg-primary text-white'
                      : 'bg-card text-text border border-border hover:border-primary/40'
                    }
                  `}
                >
                  {y}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Category Navigation */}
        <section className="py-4 px-4 bg-bg border-b border-border">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <span className="text-sm font-medium text-text mr-2 flex-shrink-0">Тип:</span>
              {AVAILABLE_CATEGORIES.map((cat) => (
                <Link
                  key={cat}
                  href={`/praznik/${cat}?year=${selectedYear}`}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                    ${cat === category
                      ? 'bg-primary text-white'
                      : 'bg-card text-text border border-border hover:border-primary/40'
                    }
                  `}
                >
                  {CATEGORY_NAMES[cat]}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Filters & Sort */}
        <section className="py-6 px-4 border-b border-border">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
              {/* Type Filter */}
              <div className="flex-1">
                <p className="text-sm font-medium text-text mb-2">Филтър:</p>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/praznik/${category}?year=${selectedYear}`}
                    className={`
                      px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                      ${!filter
                        ? 'bg-primary text-white'
                        : 'bg-card text-text border border-border hover:border-primary/40'
                      }
                    `}
                  >
                    Всички
                  </Link>
                  <Link
                    href={`/praznik/${category}?year=${selectedYear}&filter=official`}
                    className={`
                      px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                      ${filter === 'official'
                        ? 'bg-primary text-white'
                        : 'bg-card text-text border border-border hover:border-primary/40'
                      }
                    `}
                  >
                    Само неработни
                  </Link>
                  <Link
                    href={`/praznik/${category}?year=${selectedYear}&filter=movable`}
                    className={`
                      px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                      ${filter === 'movable'
                        ? 'bg-primary text-white'
                        : 'bg-card text-text border border-border hover:border-primary/40'
                      }
                    `}
                  >
                    Само подвижни
                  </Link>
                  <Link
                    href={`/praznik/${category}?year=${selectedYear}&filter=fixed`}
                    className={`
                      px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                      ${filter === 'fixed'
                        ? 'bg-primary text-white'
                        : 'bg-card text-text border border-border hover:border-primary/40'
                      }
                    `}
                  >
                    Само фиксирани
                  </Link>
                </div>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-text">Подреди:</span>
                <div className="flex gap-2">
                  <Link
                    href={`/praznik/${category}?year=${selectedYear}&sort=date${filter ? `&filter=${filter}` : ''}`}
                    className={`
                      px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                      ${sort === 'date'
                        ? 'bg-primary text-white'
                        : 'bg-card text-text border border-border hover:border-primary/40'
                      }
                    `}
                  >
                    По дата
                  </Link>
                  <Link
                    href={`/praznik/${category}?year=${selectedYear}&sort=alphabetical${filter ? `&filter=${filter}` : ''}`}
                    className={`
                      px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                      ${sort === 'alphabetical'
                        ? 'bg-primary text-white'
                        : 'bg-card text-text border border-border hover:border-primary/40'
                      }
                    `}
                  >
                    А→Я
                  </Link>
                </div>
              </div>
            </div>

            {/* Results count */}
            <div className="mt-4 text-sm text-muted">
              {filteredHolidays.length === categoryData.holidays.length
                ? `Показани всички ${filteredHolidays.length} празника`
                : `Намерени ${filteredHolidays.length} празника`}
            </div>
          </div>
        </section>

        {/* Legend (for religious holidays) */}
        {category === 'tsarkoven' && (
          <section className="py-4 px-4 bg-panel/30">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <span>⛪</span>
                  <span className="text-muted">Църковен</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-critical rounded-full"></span>
                  <span className="text-muted">Неработен</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>↔</span>
                  <span className="text-muted">Подвижен (датата варира)</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Content: List + Sidebar */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-[1fr,360px] gap-8">
              {/* Main List */}
              <div>
                {paginatedHolidays.length === 0 ? (
                  <div className="text-center py-16 bg-card rounded-2xl border border-border">
                    <Calendar className="w-16 h-16 text-muted mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-text mb-2">
                      Няма намерени празници
                    </h3>
                    <p className="text-muted">
                      Опитайте с друг филтър или година.
                    </p>
                    <Link
                      href={`/praznik/${category}?year=${selectedYear}`}
                      className="inline-block mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
                    >
                      Покажи всички
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {paginatedHolidays.map((holiday) => (
                      <Link
                        key={holiday.slug}
                        href={`/praznik/${holiday.slug}/${selectedYear}`}
                        className="block bg-card rounded-xl border border-border p-5 hover:border-primary/40 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start gap-4">
                          {/* Date Chip */}
                          <div className="flex-shrink-0 w-16 h-16 bg-[#FFF0C8] border border-[#F0C770] rounded-lg flex flex-col items-center justify-center">
                            <span className="text-[#C95502] font-bold text-xl">
                              {holiday.day}
                            </span>
                            <span className="text-[#C95502] font-medium text-xs">
                              {getMonthName(holiday.month)}
                            </span>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <div>
                                <h3 className="text-lg font-semibold text-text mb-1 flex items-center gap-2">
                                  <span>{holiday.icon}</span>
                                  {holiday.title}
                                </h3>
                                <div className="flex flex-wrap gap-2 mb-2">
                                  {holiday.isOfficial && (
                                    <span className="px-2 py-0.5 bg-critical text-white text-xs rounded font-medium">
                                      Неработен ден
                                    </span>
                                  )}
                                  {holiday.isMovable && (
                                    <span className="px-2 py-0.5 bg-warning/20 text-warning text-xs rounded font-medium">
                                      ↔ Подвижен
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <p className="text-sm text-muted-strong mb-3 line-clamp-2">
                              {holiday.description}
                            </p>

                            {/* Actions */}
                            <div className="flex flex-wrap gap-2">
                              <button className="px-3 py-1.5 bg-panel text-text text-xs rounded-lg border border-border hover:border-primary/40 transition-colors flex items-center gap-1">
                                <Download className="w-3 h-3" />
                                ICS
                              </button>
                              <button className="px-3 py-1.5 bg-panel text-text text-xs rounded-lg border border-border hover:border-primary/40 transition-colors flex items-center gap-1">
                                <Bell className="w-3 h-3" />
                                Напомни
                              </button>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center items-center gap-2">
                    {currentPage > 1 && (
                      <Link
                        href={`/praznik/${category}?year=${selectedYear}&page=${currentPage - 1}${filter ? `&filter=${filter}` : ''}${sort !== 'date' ? `&sort=${sort}` : ''}`}
                        className="px-4 py-2 bg-card text-text rounded-lg border border-border hover:border-primary/40 transition-colors"
                      >
                        Предишна
                      </Link>
                    )}
                    
                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                        const pageNum = i + 1
                        return (
                          <Link
                            key={pageNum}
                            href={`/praznik/${category}?year=${selectedYear}&page=${pageNum}${filter ? `&filter=${filter}` : ''}${sort !== 'date' ? `&sort=${sort}` : ''}`}
                            className={`
                              w-10 h-10 flex items-center justify-center rounded-lg font-medium transition-colors
                              ${currentPage === pageNum
                                ? 'bg-primary text-white'
                                : 'bg-card text-text border border-border hover:border-primary/40'
                              }
                            `}
                          >
                            {pageNum}
                          </Link>
                        )
                      })}
                    </div>

                    {currentPage < totalPages && (
                      <Link
                        href={`/praznik/${category}?year=${selectedYear}&page=${currentPage + 1}${filter ? `&filter=${filter}` : ''}${sort !== 'date' ? `&sort=${sort}` : ''}`}
                        className="px-4 py-2 bg-card text-text rounded-lg border border-border hover:border-primary/40 transition-colors"
                      >
                        Следваща
                      </Link>
                    )}
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <aside className="space-y-6">
                {/* Utilities Card */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h3 className="text-lg font-semibold text-text mb-4">Бързи действия</h3>
                  <div className="space-y-3">
                    <button className="w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors flex items-center justify-center gap-2">
                      <Download className="w-4 h-4" />
                      Свали ICS за {selectedYear}
                    </button>
                    {category === 'natsionalen' && (
                      <button className="w-full px-4 py-3 bg-critical text-white rounded-lg hover:bg-[#B82626] transition-colors flex items-center justify-center gap-2">
                        <Download className="w-4 h-4" />
                        Само неработни дни
                      </button>
                    )}
                    <button className="w-full px-4 py-3 bg-panel text-text rounded-lg border border-border hover:border-primary/40 transition-colors flex items-center justify-center gap-2">
                      <Bell className="w-4 h-4" />
                      Абонирай се
                    </button>
                    <Link
                      href="/kalendar/2025"
                      className="block w-full px-4 py-3 bg-panel text-text rounded-lg border border-border hover:border-primary/40 transition-colors text-center"
                    >
                      Виж календара
                    </Link>
                  </div>
                </div>

                {/* Movable Holidays Note (for religious) */}
                {category === 'tsarkoven' && (
                  <div className="bg-soft border border-border rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-text mb-3">
                      Как се изчисляват подвижните празници?
                    </h3>
                    <p className="text-sm text-muted-strong">
                      Датите на подвижните православни празници се определят спрямо Великден, 
                      който се изчислява по специална формула (Александрийска пасхалия).
                    </p>
                  </div>
                )}

                {/* Navigation */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h3 className="text-lg font-semibold text-text mb-4">Навигация</h3>
                  <div className="space-y-2">
                    {selectedYear > 2025 && (
                      <Link
                        href={`/praznik/${category}?year=${selectedYear - 1}`}
                        className="block px-4 py-2 bg-panel rounded-lg hover:bg-panel/60 transition-colors text-sm"
                      >
                        ← Празници {selectedYear - 1}
                      </Link>
                    )}
                    {selectedYear < 2030 && (
                      <Link
                        href={`/praznik/${category}?year=${selectedYear + 1}`}
                        className="block px-4 py-2 bg-panel rounded-lg hover:bg-panel/60 transition-colors text-sm"
                      >
                        Празници {selectedYear + 1} →
                      </Link>
                    )}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* SEO Footer with FAQ */}
        <section className="py-12 px-4 bg-panel/30 border-t border-border">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-text mb-6">Често задавани въпроси</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-text mb-3">
                  Как да добавя празниците в календара?
                </h3>
                <p className="text-sm text-muted-strong">
                  Кликнете на бутона "Свали ICS" и изтеглете файла. След това го отворете с вашето календарно приложение (Google Calendar, Apple Calendar и др.).
                </p>
              </div>
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-text mb-3">
                  Откъде са датите на празниците?
                </h3>
                <p className="text-sm text-muted-strong">
                  Датите следват официалния православен календар на БПЦ и решенията на Министерския съвет за неработните дни.
                </p>
              </div>
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-text mb-3">
                  Какво означава "подвижен празник"?
                </h3>
                <p className="text-sm text-muted-strong">
                  Подвижните празници нямат фиксирана дата и се изчисляват спрямо Великден, който варира всяка година според лунния календар.
                </p>
              </div>
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-text mb-3">
                  Мога ли да получавам напомняния?
                </h3>
                <p className="text-sm text-muted-strong">
                  Да! Абонирайте се за автоматични напомняния за празниците, които ви интересуват.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
