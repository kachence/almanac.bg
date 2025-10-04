import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ChevronRight, Download, Printer, Church } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import Link from 'next/link'

// Type definitions
interface ChurchItem {
  date: string
  title: string
  slug: string
  movable: boolean
  nonWorking?: boolean
  note?: string
  icsUrl: string
}

interface ChurchYearData {
  type: 'tsarkoven'
  year: number
  totalItems: number
  nonWorkingCount: number
  movableCount: number
  months: Array<{
    month: number
    items: ChurchItem[]
  }>
  downloads: { icsYearUrl: string; csvUrl: string; jsonUrl: string; pdfUrl: string }
}

interface PageProps {
  params: {
    year: string
  }
}

// Load data
async function getYearData(year: number): Promise<ChurchYearData | null> {
  try {
    const data = await import(`@/data/calendar/tsarkoven/${year}.json`)
    return data.default
  } catch {
    return null
  }
}

// Generate static params
export async function generateStaticParams() {
  const years = [2024, 2025, 2026]
  return years.map(year => ({ year: String(year) }))
}

// Generate metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const year = parseInt(params.year, 10)
  const data = await getYearData(year)
  if (!data) return {}

  return {
    title: `Църковен календар ${year} | Almanac.bg`,
    description: `Църковен календар за ${year} година с точни дати, часове и допълнителна информация.`,
    keywords: `Църковен календар, ${year}, България, православни празници`,
  }
}

// Helper functions
function getMonthName(month: number): string {
  const names = ['Януари', 'Февруари', 'Март', 'Април', 'Май', 'Юни', 'Юли', 'Август', 'Септември', 'Октомври', 'Ноември', 'Декември']
  return names[month - 1]
}

function getMonthNameShort(month: number): string {
  const names = ['ян', 'фев', 'мар', 'апр', 'май', 'юни', 'юли', 'авг', 'сеп', 'окт', 'ное', 'дек']
  return names[month - 1]
}

export default async function ChurchCalendarYearPage({ params }: PageProps) {
  const year = parseInt(params.year, 10)
  
  if (isNaN(year) || year < 2020 || year > 2030) {
    notFound()
  }

  const data = await getYearData(year)
  if (!data) {
    notFound()
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-bg">
        {/* Header */}
        <section className="py-8 px-4 border-b border-border">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumbs */}
            <nav className="flex items-center text-sm text-muted mb-6" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-text transition-colors">Начало</Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <Link href="/kalendar" className="hover:text-text transition-colors">Календар</Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <Link href="/kalendar/tsarkoven" className="hover:text-text transition-colors">Църковен</Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <span className="text-text font-medium">{year}</span>
            </nav>

            {/* H1 */}
            <div className="flex items-center gap-4 mb-4">
              <Church className="w-10 h-10 text-primary" />
              <h1 className="text-4xl lg:text-5xl font-bold text-text">
                Църковен календар {year}
              </h1>
            </div>

            {/* Intro */}
            <p className="text-lg text-muted-strong mb-6">
              Големи и малки празници, подвижни дати и бележки за неработни дни.
            </p>

            {/* Meta strip */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="text-muted">Общо събития: <strong className="text-text">{data.totalItems}</strong></span>
              <span className="text-muted">Неработни: <strong className="text-critical">{data.nonWorkingCount}</strong></span>
              <span className="text-muted">Подвижни: <strong className="text-warning">{data.movableCount}</strong></span>
            </div>
          </div>
        </section>

        {/* Sticky Toolbar */}
        <section className="py-4 px-4 bg-panel/30 border-b border-border sticky top-0 z-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center gap-2">
              {/* Year switcher */}
              <div className="flex items-center gap-1">
                <Link
                  href={`/kalendar/tsarkoven/${year - 1}`}
                  className="px-3 h-9 bg-card text-muted border border-border hover:border-primary/40 rounded-lg text-sm transition-colors flex items-center"
                >
                  {year - 1}
                </Link>
                <span className="px-4 h-9 bg-primary text-white rounded-lg text-sm font-bold flex items-center">
                  {year}
                </span>
                <Link
                  href={`/kalendar/tsarkoven/${year + 1}`}
                  className="px-3 h-9 bg-card text-muted border border-border hover:border-primary/40 rounded-lg text-sm transition-colors flex items-center"
                >
                  {year + 1}
                </Link>
              </div>

              <div className="h-6 w-px bg-border mx-2"></div>

              {/* Exports */}
              <a href={data.downloads.icsYearUrl} className="px-3 h-9 bg-card text-text border border-border hover:border-primary/40 rounded-lg text-sm transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                ICS
              </a>
              <a href={data.downloads.csvUrl} className="px-3 h-9 bg-card text-text border border-border hover:border-primary/40 rounded-lg text-sm transition-colors flex items-center gap-2">
                CSV
              </a>
              <a href={data.downloads.pdfUrl} className="px-3 h-9 bg-card text-text border border-border hover:border-primary/40 rounded-lg text-sm transition-colors flex items-center gap-2">
                <Printer className="w-4 h-4" />
                PDF
              </a>
            </div>
          </div>
        </section>

        {/* Legend */}
        <section className="py-6 px-4 bg-soft border-b border-border">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="flex items-center gap-2"><span className="text-warning text-lg">✚</span> Празник</span>
              <span className="flex items-center gap-2"><span className="text-warning">↔</span> Подвижен</span>
              <span className="px-2 py-1 bg-critical text-white rounded text-xs font-medium">Неработен</span>
            </div>
          </div>
        </section>

        {/* Month Navigator */}
        <section className="py-6 px-4 bg-panel/20">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
                const count = data.months.find(m => m.month === month)?.items.length || 0

                return (
                  <a
                    key={month}
                    href={`#month-${month}`}
                    className="px-4 h-10 bg-card text-text border border-border hover:border-primary/40 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    {getMonthNameShort(month)}
                    {count > 0 && <span className="text-xs text-muted">({count})</span>}
                  </a>
                )
              })}
            </div>
          </div>
        </section>

        {/* Content Grid */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-[1fr,360px] gap-8">
              {/* Main Content */}
              <div className="space-y-8">
                {data.months.map((monthData) => (
                  <div key={monthData.month} id={`month-${monthData.month}`} className="bg-card rounded-2xl border border-border p-6">
                    <h2 className="text-2xl font-bold text-text mb-6">{getMonthName(monthData.month)} {year}</h2>
                    
                    {monthData.items.length > 0 ? (
                      <div className="space-y-3">
                        {monthData.items.map((item, i) => {
                          const date = new Date(item.date)
                          const day = date.getDate()
                          const month = getMonthNameShort(date.getMonth() + 1)
                          
                          return (
                            <div key={i} className="flex items-start gap-4 p-4 bg-panel hover:bg-panel/60 rounded-xl transition-colors">
                              <div className="flex-shrink-0 w-14 h-14 bg-[#FFF0C8] border border-[#F0C770] rounded-lg flex flex-col items-center justify-center leading-tight">
                                <span className="text-[#C95502] font-bold text-lg">{day}</span>
                                <span className="text-[#C95502] font-medium text-xs">{month}</span>
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-3 mb-2">
                                  <Link
                                    href={`/praznik/${item.slug}/${year}`}
                                    className="text-lg font-semibold text-text hover:text-primary transition-colors"
                                  >
                                    <span className="text-warning mr-2">✚</span>
                                    {item.title}
                                  </Link>
                                  <div className="flex flex-wrap gap-2">
                                    {item.movable && (
                                      <span className="px-2 py-0.5 bg-warning/20 text-warning border border-warning/40 rounded text-xs font-medium whitespace-nowrap">
                                        ↔ Подвижен
                                      </span>
                                    )}
                                    {item.nonWorking && (
                                      <span className="px-2 py-0.5 bg-critical text-white rounded text-xs font-medium whitespace-nowrap">
                                        Неработен
                                      </span>
                                    )}
                                  </div>
                                </div>
                                
                                {item.note && (
                                  <p className="text-sm text-muted mb-3">{item.note}</p>
                                )}
                                
                                <div className="flex flex-wrap gap-2">
                                  <a
                                    href={item.icsUrl}
                                    className="px-3 py-1.5 bg-card text-text border border-border hover:border-primary/40 rounded-lg text-xs transition-colors"
                                  >
                                    Добави ICS
                                  </a>
                                  <button className="px-3 py-1.5 bg-card text-text border border-border hover:border-primary/40 rounded-lg text-xs transition-colors">
                                    Напомни
                                  </button>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <p className="text-muted italic">Няма събития този месец.</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Sidebar */}
              <aside className="space-y-6">
                {/* Quick Actions */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h3 className="text-xl font-bold text-text mb-4">Изтегли целия {year}</h3>
                  <div className="space-y-2">
                    <a href={data.downloads.icsYearUrl} className="block px-4 h-10 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors text-center leading-10">
                      <Download className="w-4 h-4 inline mr-2" />
                      ICS файл
                    </a>
                    <a href={data.downloads.csvUrl} className="block px-4 h-10 bg-panel text-text border border-border hover:border-primary/40 rounded-lg font-medium transition-colors text-center leading-10">
                      CSV
                    </a>
                    <a href={data.downloads.pdfUrl} className="block px-4 h-10 bg-panel text-text border border-border hover:border-primary/40 rounded-lg font-medium transition-colors text-center leading-10">
                      <Printer className="w-4 h-4 inline mr-2" />
                      PDF
                    </a>
                  </div>
                </div>

                {/* Cross-links */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h3 className="text-xl font-bold text-text mb-4">Други календари</h3>
                  <div className="space-y-2">
                    <Link href={`/kalendar/${year}`} className="block p-3 bg-panel hover:bg-panel/60 rounded-lg transition-colors">
                      <span className="text-text font-medium">Годишен календар {year}</span>
                    </Link>
                    <Link href={`/kalendar/lunen/${year}`} className="block p-3 bg-panel hover:bg-panel/60 rounded-lg transition-colors">
                      <span className="text-text font-medium">Лунен {year}</span>
                    </Link>
                    <Link href={`/kalendar/slunchev/sofia/${year}`} className="block p-3 bg-panel hover:bg-panel/60 rounded-lg transition-colors">
                      <span className="text-text font-medium">Слънчев {year}</span>
                    </Link>
                    <Link href={`/kalendar/formula-1/${year}`} className="block p-3 bg-panel hover:bg-panel/60 rounded-lg transition-colors">
                      <span className="text-text font-medium">Формула 1 {year}</span>
                    </Link>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 px-4 bg-panel/30">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-text mb-6">Често задавани въпроси</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-text mb-3">
                  Как се изчислява Великден?
                </h3>
                <p className="text-sm text-muted-strong">
                  Великден се изчислява по формулата на Гаус спрямо пролетното равноденствие и лунния календар.
                </p>
              </div>
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-text mb-3">
                  Кои празници са неработни?
                </h3>
                <p className="text-sm text-muted-strong">
                  Неработните дни се обявяват с решение на Министерския съвет и включват основни религиозни и национални празници.
                </p>
              </div>
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-text mb-3">
                  Какво значи "подвижен празник"?
                </h3>
                <p className="text-sm text-muted-strong">
                  Подвижните празници не са на фиксирана дата — зависят от Великден и се изчисляват всяка година наново.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Sources */}
        <section className="py-8 px-4 bg-soft border-t border-border">
          <div className="max-w-7xl mx-auto">
            <h3 className="text-xl font-bold text-text mb-4">Източници</h3>
            <div className="flex flex-wrap gap-4 text-sm">
              <a href="https://bg-patriarshia.bg" className="text-primary hover:underline">Българска православна църква</a>
              <a href="#" className="text-primary hover:underline">Министерски съвет</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

