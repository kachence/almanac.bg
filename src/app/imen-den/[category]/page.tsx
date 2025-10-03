import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ChevronRight, Calendar, Search, Download, Bell } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import Link from 'next/link'

// Available months for name days
const AVAILABLE_MONTHS = [
  'yanuari', 'fevruari', 'mart', 'april', 'may', 'yuni',
  'yuli', 'avgust', 'septemvri', 'oktomvri', 'noemvri', 'dekemvri'
]

const MONTH_NAMES: Record<string, string> = {
  'yanuari': 'януари',
  'fevruari': 'февруари',
  'mart': 'март',
  'april': 'април',
  'may': 'май',
  'yuni': 'юни',
  'yuli': 'юли',
  'avgust': 'август',
  'septemvri': 'септември',
  'oktomvri': 'октомври',
  'noemvri': 'ноември',
  'dekemvri': 'декември'
}

interface NameDay {
  date: string
  day: number
  names: string[]
  variants: string[]
  saint: string
  saintIcon: string
  traditions: string | null
  isPopular: boolean
  slug: string
}

interface MonthData {
  month: string
  monthName: string
  monthNameGenitive: string
  year: number
  description: string
  totalNameDays: number
  namedays: NameDay[]
}

interface PageProps {
  params: {
    category: string
  }
  searchParams: {
    letter?: string
    sort?: string
    page?: string
  }
}

// Load month data
async function getMonthData(month: string): Promise<MonthData | null> {
  try {
    // In production, this would load from JSON files
    const data = await import(`@/data/namedays/${month}.json`)
    return data.default
  } catch {
    return null
  }
}

// Generate static params for all months
export async function generateStaticParams() {
  return AVAILABLE_MONTHS.map((month) => ({
    category: month,
  }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const monthName = MONTH_NAMES[params.category]
  if (!monthName) return {}

  const data = await getMonthData(params.category)
  if (!data) return {}

  return {
    title: `Именни дни през ${monthName} ${data.year} | Almanac.bg`,
    description: data.description,
    keywords: `имен ден ${monthName}, именници ${monthName}, имена ${monthName}, празници ${monthName}`,
    openGraph: {
      title: `Именни дни през ${monthName} ${data.year}`,
      description: data.description,
      type: 'website',
    },
  }
}

export default async function NameDayCategoryPage({ params, searchParams }: PageProps) {
  const { category } = params
  const { letter, sort = 'date', page = '1' } = searchParams

  // Validate category
  if (!AVAILABLE_MONTHS.includes(category)) {
    notFound()
  }

  const monthData = await getMonthData(category)
  if (!monthData) {
    notFound()
  }

  const monthName = MONTH_NAMES[category]
  const currentPage = parseInt(page, 10)
  const itemsPerPage = 30

  // Filter by letter if specified
  let filteredNameDays = monthData.namedays
  if (letter) {
    filteredNameDays = filteredNameDays.filter(nd =>
      nd.names.some(name => name[0].toUpperCase() === letter.toUpperCase())
    )
  }

  // Sort
  const sortedNameDays = [...filteredNameDays].sort((a, b) => {
    if (sort === 'popularity') {
      if (a.isPopular && !b.isPopular) return -1
      if (!a.isPopular && b.isPopular) return 1
      return a.day - b.day
    }
    if (sort === 'alphabetical') {
      return a.names[0].localeCompare(b.names[0], 'bg')
    }
    return a.day - b.day // default: by date
  })

  // Pagination
  const totalPages = Math.ceil(sortedNameDays.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedNameDays = sortedNameDays.slice(startIndex, startIndex + itemsPerPage)

  // Get alphabet for filters
  const alphabet = 'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЬЮЯ'.split('')

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
              <Link href="/imen-den" className="hover:text-text transition-colors">
                Имен ден
              </Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <span className="text-text font-medium capitalize">{monthName}</span>
            </nav>

            {/* Header */}
            <div className="flex items-center gap-4 mb-4">
              <Calendar className="w-10 h-10 text-primary" />
              <h1 className="text-4xl lg:text-5xl font-bold text-text">
                Именни дни през {monthName}
              </h1>
            </div>

            {/* Meta strip */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted mb-4">
              <span>{filteredNameDays.length} именни дни</span>
              <span>•</span>
              <span>{monthData.year} година</span>
            </div>

            {/* Description */}
            <p className="text-lg text-muted-strong max-w-3xl">
              {monthData.description}
            </p>
          </div>
        </section>

        {/* Month Navigation Chips */}
        <section className="py-4 px-4 bg-panel/30 border-b border-border sticky top-0 z-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {AVAILABLE_MONTHS.map((m) => (
                <Link
                  key={m}
                  href={`/imen-den/${m}`}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                    ${m === category
                      ? 'bg-primary text-white'
                      : 'bg-card text-text border border-border hover:border-primary/40'
                    }
                  `}
                >
                  {MONTH_NAMES[m]}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Filters & Sort */}
        <section className="py-6 px-4 border-b border-border">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
              {/* Alphabet Filter */}
              <div className="flex-1">
                <p className="text-sm font-medium text-text mb-2">Филтър по буква:</p>
                <div className="flex flex-wrap gap-1">
                  <Link
                    href={`/imen-den/${category}`}
                    className={`
                      px-2 py-1 rounded text-xs font-medium transition-colors
                      ${!letter
                        ? 'bg-primary text-white'
                        : 'bg-card text-text border border-border hover:border-primary/40'
                      }
                    `}
                  >
                    Всички
                  </Link>
                  {alphabet.map((l) => (
                    <Link
                      key={l}
                      href={`/imen-den/${category}?letter=${l}`}
                      className={`
                        px-2 py-1 rounded text-xs font-medium transition-colors
                        ${letter === l
                          ? 'bg-primary text-white'
                          : 'bg-card text-text border border-border hover:border-primary/40'
                        }
                      `}
                    >
                      {l}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-text">Подреди:</span>
                <div className="flex gap-2">
                  <Link
                    href={`/imen-den/${category}?sort=date${letter ? `&letter=${letter}` : ''}`}
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
                    href={`/imen-den/${category}?sort=alphabetical${letter ? `&letter=${letter}` : ''}`}
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
                  <Link
                    href={`/imen-den/${category}?sort=popularity${letter ? `&letter=${letter}` : ''}`}
                    className={`
                      px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                      ${sort === 'popularity'
                        ? 'bg-primary text-white'
                        : 'bg-card text-text border border-border hover:border-primary/40'
                      }
                    `}
                  >
                    Популярност
                  </Link>
                </div>
              </div>
            </div>

            {/* Results count */}
            <div className="mt-4 text-sm text-muted">
              {filteredNameDays.length === monthData.namedays.length
                ? `Показани всички ${filteredNameDays.length} именни дни`
                : `Намерени ${filteredNameDays.length} именни дни`}
            </div>
          </div>
        </section>

        {/* Content: List + Sidebar */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-[1fr,360px] gap-8">
              {/* Main List */}
              <div>
                {paginatedNameDays.length === 0 ? (
                  <div className="text-center py-16 bg-card rounded-2xl border border-border">
                    <Calendar className="w-16 h-16 text-muted mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-text mb-2">
                      Няма намерени именни дни
                    </h3>
                    <p className="text-muted">
                      Опитайте с друга буква или премахнете филтрите.
                    </p>
                    <Link
                      href={`/imen-den/${category}`}
                      className="inline-block mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
                    >
                      Покажи всички
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {paginatedNameDays.map((nameday) => (
                      <Link
                        key={nameday.slug}
                        href={`/imen-den/${nameday.slug}`}
                        className="block bg-card rounded-xl border border-border p-5 hover:border-primary/40 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start gap-4">
                          {/* Date Chip */}
                          <div className="flex-shrink-0 w-16 h-16 bg-[#FFF0C8] border border-[#F0C770] rounded-lg flex flex-col items-center justify-center">
                            <span className="text-[#C95502] font-bold text-xl">
                              {nameday.day}
                            </span>
                            <span className="text-[#C95502] font-medium text-xs">
                              {monthName}
                            </span>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <div>
                                <h3 className="text-lg font-semibold text-text mb-1">
                                  Имен ден на {nameday.names.join(', ')}
                                </h3>
                                {nameday.variants.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mb-2">
                                    {nameday.variants.map((variant) => (
                                      <span
                                        key={variant}
                                        className="px-2 py-0.5 bg-panel text-muted text-xs rounded-full"
                                      >
                                        {variant}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              {nameday.isPopular && (
                                <span className="px-2 py-1 bg-warning/20 text-warning text-xs font-medium rounded">
                                  Популярен
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 text-sm text-muted mb-3">
                              <span>{nameday.saintIcon}</span>
                              <span>{nameday.saint}</span>
                            </div>

                            {nameday.traditions && (
                              <p className="text-sm text-muted-strong mb-3 line-clamp-2">
                                {nameday.traditions}
                              </p>
                            )}

                            {/* Actions */}
                            <div className="flex flex-wrap gap-2">
                              <button className="px-3 py-1.5 bg-panel text-text text-xs rounded-lg border border-border hover:border-primary/40 transition-colors">
                                Картички
                              </button>
                              <button className="px-3 py-1.5 bg-panel text-text text-xs rounded-lg border border-border hover:border-primary/40 transition-colors flex items-center gap-1">
                                <Download className="w-3 h-3" />
                                ICS
                              </button>
                              <button className="px-3 py-1.5 bg-panel text-text text-xs rounded-lg border border-border hover:border-primary/40 transition-colors flex items-center gap-1">
                                <Bell className="w-3 h-3" />
                                Напомни 2026
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
                        href={`/imen-den/${category}?page=${currentPage - 1}${letter ? `&letter=${letter}` : ''}${sort !== 'date' ? `&sort=${sort}` : ''}`}
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
                            href={`/imen-den/${category}?page=${pageNum}${letter ? `&letter=${letter}` : ''}${sort !== 'date' ? `&sort=${sort}` : ''}`}
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
                        href={`/imen-den/${category}?page=${currentPage + 1}${letter ? `&letter=${letter}` : ''}${sort !== 'date' ? `&sort=${sort}` : ''}`}
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
                      Свали ICS за {monthName}
                    </button>
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

                {/* Popular Names */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h3 className="text-lg font-semibold text-text mb-4">Популярни имена</h3>
                  <div className="flex flex-wrap gap-2">
                    {monthData.namedays
                      .filter(nd => nd.isPopular)
                      .flatMap(nd => nd.names)
                      .slice(0, 10)
                      .map((name) => (
                        <Link
                          key={name}
                          href={`/imen-den/${name.toLowerCase()}`}
                          className="px-3 py-1.5 bg-[#FFF0C8] text-[#1F1915] border border-[#F0C770] rounded-full text-sm font-medium hover:bg-[#F0C770] transition-colors"
                        >
                          {name}
                        </Link>
                      ))}
                  </div>
                </div>

                {/* Navigation */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h3 className="text-lg font-semibold text-text mb-4">Навигация</h3>
                  <div className="space-y-2">
                    {(() => {
                      const currentIndex = AVAILABLE_MONTHS.indexOf(category)
                      const prevMonth = currentIndex > 0 ? AVAILABLE_MONTHS[currentIndex - 1] : null
                      const nextMonth = currentIndex < AVAILABLE_MONTHS.length - 1 ? AVAILABLE_MONTHS[currentIndex + 1] : null
                      
                      return (
                        <>
                          {prevMonth && (
                            <Link
                              href={`/imen-den/${prevMonth}`}
                              className="block px-4 py-2 bg-panel rounded-lg hover:bg-panel/60 transition-colors text-sm"
                            >
                              ← {MONTH_NAMES[prevMonth]}
                            </Link>
                          )}
                          {nextMonth && (
                            <Link
                              href={`/imen-den/${nextMonth}`}
                              className="block px-4 py-2 bg-panel rounded-lg hover:bg-panel/60 transition-colors text-sm"
                            >
                              {MONTH_NAMES[nextMonth]} →
                            </Link>
                          )}
                        </>
                      )
                    })()}
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
                  Как да добавя имен ден в календара?
                </h3>
                <p className="text-sm text-muted-strong">
                  Кликнете на бутона "ICS" до съответното име и изтеглете файла. След това го отворете с вашето календарно приложение (Google Calendar, Apple Calendar и др.).
                </p>
              </div>
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-text mb-3">
                  Откъде са датите на имените?
                </h3>
                <p className="text-sm text-muted-strong">
                  Датите следват официалния православен календар на Българската православна църква (БПЦ).
                </p>
              </div>
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-text mb-3">
                  Мога ли да получавам напомняния?
                </h3>
                <p className="text-sm text-muted-strong">
                  Да! Използвайте бутона "Напомни 2026" или се абонирайте за автоматични напомняния за всички имена, които ви интересуват.
                </p>
              </div>
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-text mb-3">
                  Липсва моето име. Какво да правя?
                </h3>
                <p className="text-sm text-muted-strong">
                  Свържете се с нас чрез формата за контакт и ще добавим името, ако има официална дата по православния календар.
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
