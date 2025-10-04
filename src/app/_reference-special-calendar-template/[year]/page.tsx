import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ChevronRight, Calendar, Download, Printer, Moon, Sun, Church, CarFront } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import Link from 'next/link'

// Type definitions
type CalendarType = 'tsarkoven' | 'lunen' | 'slunchev' | 'formula-1'

interface ChurchItem {
  date: string
  title: string
  slug: string
  movable: boolean
  nonWorking?: boolean
  note?: string
  icsUrl: string
}

interface LunarPhase {
  dateTime: string
  phase: 'new' | 'firstQuarter' | 'full' | 'lastQuarter'
  icsUrl: string
}

interface SolarExtremes {
  firstSunrise?: string
  lastSunset?: string
}

interface F1Round {
  round: number
  gp: string
  country: string
  circuit: string
  quali: { dateTime: string }
  race: { dateTime: string; laps?: number; isNight?: boolean; hasSprint?: boolean }
  tv?: Array<{ provider: string; url?: string }>
  pageUrl?: string
  icsUrls: { quali: string; race: string }
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

interface LunarYearData {
  type: 'lunen'
  year: number
  totalPhases: number
  months: Array<{
    month: number
    phases: LunarPhase[]
    monthUrls: { page: string; ics: string; csv: string }
  }>
  downloads: { icsYearUrl: string; csvUrl: string; jsonUrl: string; pdfUrl: string }
}

interface SolarYearData {
  type: 'slunchev'
  year: number
  city: string
  citySlug: 'sofia' | 'plovdiv' | 'varna' | 'burgas' | 'ruse'
  availableCities: Array<{ name: string; slug: string }>
  months: Array<{
    month: number
    extremes: SolarExtremes
    summary: { shortestDay?: { date: string; length: string }; longestDay?: { date: string; length: string } }
    monthUrls: { page: string; csv: string; json: string }
  }>
  downloads: { csvUrl: string; jsonUrl: string; pdfUrl: string }
}

interface F1YearData {
  type: 'formula-1'
  year: number
  totalRounds: number
  rounds: F1Round[]
  downloads: { icsSeasonUrl: string; csvUrl: string; jsonUrl: string; pdfUrl: string }
}

type YearData = ChurchYearData | LunarYearData | SolarYearData | F1YearData

interface PageProps {
  params: {
    type: string
    year: string
  }
}

// Load data
async function getYearData(type: CalendarType, year: number): Promise<YearData | null> {
  try {
    const data = await import(`@/data/calendar/${type}/${year}.json`)
    return data.default
  } catch {
    return null
  }
}

// Generate static params
export async function generateStaticParams() {
  const types = ['tsarkoven', 'lunen', 'slunchev', 'formula-1']
  const years = [2024, 2025, 2026]
  const params = []
  
  for (const type of types) {
    for (const year of years) {
      params.push({ type, year: String(year) })
    }
  }
  
  return params
}

// Generate metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const type = params.type as CalendarType
  const year = parseInt(params.year, 10)
  const data = await getYearData(type, year)
  if (!data) return {}

  const typeLabels: Record<CalendarType, string> = {
    'tsarkoven': 'Църковен календар',
    'lunen': 'Лунен календар',
    'slunchev': 'Слънчев календар',
    'formula-1': 'Формула 1 календар'
  }

  const label = typeLabels[type]
  
  return {
    title: `${label} ${year} | Almanac.bg`,
    description: `${label} за ${year} година с точни дати, часове и допълнителна информация.`,
    keywords: `${label}, ${year}, България, календар`,
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

function formatDateTime(dt: string): { date: string; time: string } {
  const d = new Date(dt)
  const date = d.toLocaleDateString('bg-BG', { day: 'numeric', month: 'short' })
  const time = d.toLocaleTimeString('bg-BG', { hour: '2-digit', minute: '2-digit' })
  return { date, time }
}

function getPhaseIcon(phase: string): string {
  const icons: Record<string, string> = {
    'new': '🌑',
    'firstQuarter': '🌓',
    'full': '🌕',
    'lastQuarter': '🌗'
  }
  return icons[phase] || '🌙'
}

function getPhaseName(phase: string): string {
  const names: Record<string, string> = {
    'new': 'Новолуние',
    'firstQuarter': 'Първа четвърт',
    'full': 'Пълнолуние',
    'lastQuarter': 'Последна четвърт'
  }
  return names[phase] || phase
}

export default async function SpecialCalendarYearPage({ params }: PageProps) {
  const type = params.type as CalendarType
  const year = parseInt(params.year, 10)
  
  if (!['tsarkoven', 'lunen', 'slunchev', 'formula-1'].includes(type)) {
    notFound()
  }
  
  if (isNaN(year) || year < 2020 || year > 2030) {
    notFound()
  }

  const data = await getYearData(type, year)
  if (!data) {
    notFound()
  }

  const typeLabels: Record<CalendarType, string> = {
    'tsarkoven': 'Църковен',
    'lunen': 'Лунен',
    'slunchev': 'Слънчев',
    'formula-1': 'Формула 1'
  }

  const typeIcons: Record<CalendarType, any> = {
    'tsarkoven': Church,
    'lunen': Moon,
    'slunchev': Sun,
    'formula-1': CarFront
  }

  const typeLabel = typeLabels[type]
  const TypeIcon = typeIcons[type]

  const typeIntros: Record<CalendarType, string> = {
    'tsarkoven': 'Големи и малки празници, подвижни дати и бележки за неработни дни.',
    'lunen': 'Фазите с точни часове (BG time) и месечни изгледи.',
    'slunchev': data.type === 'slunchev' ? `Изгрев и залез за ${data.city}, продължителност на деня по месеци.` : '',
    'formula-1': 'Всички кръгове, квалификации и часове в българско време.'
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
              <Link href={`/kalendar/${type}`} className="hover:text-text transition-colors">{typeLabel}</Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <span className="text-text font-medium">{year}</span>
            </nav>

            {/* H1 */}
            <div className="flex items-center gap-4 mb-4">
              <TypeIcon className="w-10 h-10 text-primary" />
              <h1 className="text-4xl lg:text-5xl font-bold text-text">
                {typeLabel} календар {year}
              </h1>
            </div>

            {/* Intro */}
            <p className="text-lg text-muted-strong mb-6">
              {typeIntros[type]}
            </p>

            {/* Meta strip */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              {data.type === 'tsarkoven' && (
                <>
                  <span className="text-muted">Общо събития: <strong className="text-text">{data.totalItems}</strong></span>
                  <span className="text-muted">Неработни: <strong className="text-critical">{data.nonWorkingCount}</strong></span>
                  <span className="text-muted">Подвижни: <strong className="text-warning">{data.movableCount}</strong></span>
                </>
              )}
              {data.type === 'lunen' && (
                <span className="text-muted">Общо фази: <strong className="text-text">{data.totalPhases}</strong></span>
              )}
              {data.type === 'slunchev' && (
                <span className="text-muted">Град: <strong className="text-text">{data.city}</strong></span>
              )}
              {data.type === 'formula-1' && (
                <span className="text-muted">Кръгове: <strong className="text-text">{data.totalRounds}</strong></span>
              )}
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
                  href={`/kalendar/${type}/${year - 1}`}
                  className="px-3 h-9 bg-card text-muted border border-border hover:border-primary/40 rounded-lg text-sm transition-colors flex items-center"
                >
                  {year - 1}
                </Link>
                <span className="px-4 h-9 bg-primary text-white rounded-lg text-sm font-bold flex items-center">
                  {year}
                </span>
                <Link
                  href={`/kalendar/${type}/${year + 1}`}
                  className="px-3 h-9 bg-card text-muted border border-border hover:border-primary/40 rounded-lg text-sm transition-colors flex items-center"
                >
                  {year + 1}
                </Link>
              </div>

              <div className="h-6 w-px bg-border mx-2"></div>

              {/* Exports */}
              {data.type === 'tsarkoven' && (
                <>
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
                </>
              )}
              {data.type === 'lunen' && (
                <>
                  <a href={data.downloads.icsYearUrl} className="px-3 h-9 bg-card text-text border border-border hover:border-primary/40 rounded-lg text-sm transition-colors flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    ICS
                  </a>
                  <a href={data.downloads.csvUrl} className="px-3 h-9 bg-card text-text border border-border hover:border-primary/40 rounded-lg text-sm transition-colors flex items-center gap-2">
                    CSV
                  </a>
                </>
              )}
              {data.type === 'slunchev' && (
                <>
                  <a href={data.downloads.csvUrl} className="px-3 h-9 bg-card text-text border border-border hover:border-primary/40 rounded-lg text-sm transition-colors flex items-center gap-2">
                    CSV
                  </a>
                  <a href={data.downloads.jsonUrl} className="px-3 h-9 bg-card text-text border border-border hover:border-primary/40 rounded-lg text-sm transition-colors flex items-center gap-2">
                    JSON
                  </a>
                </>
              )}
              {data.type === 'formula-1' && (
                <>
                  <a href={data.downloads.icsSeasonUrl} className="px-3 h-9 bg-card text-text border border-border hover:border-primary/40 rounded-lg text-sm transition-colors flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    ICS
                  </a>
                  <a href={data.downloads.csvUrl} className="px-3 h-9 bg-card text-text border border-border hover:border-primary/40 rounded-lg text-sm transition-colors flex items-center gap-2">
                    CSV
                  </a>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Legend */}
        <section className="py-6 px-4 bg-soft border-b border-border">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              {data.type === 'tsarkoven' && (
                <>
                  <span className="flex items-center gap-2"><span className="text-warning text-lg">✚</span> Празник</span>
                  <span className="flex items-center gap-2"><span className="text-warning">↔</span> Подвижен</span>
                  <span className="px-2 py-1 bg-critical text-white rounded text-xs font-medium">Неработен</span>
                </>
              )}
              {data.type === 'lunen' && (
                <>
                  <span className="flex items-center gap-2"><span className="text-lg">🌑</span> Новолуние</span>
                  <span className="flex items-center gap-2"><span className="text-lg">🌓</span> Първа четвърт</span>
                  <span className="flex items-center gap-2"><span className="text-lg">🌕</span> Пълнолуние</span>
                  <span className="flex items-center gap-2"><span className="text-lg">🌗</span> Последна четвърт</span>
                  <span className="text-muted">Всички часове в българско време</span>
                </>
              )}
              {data.type === 'slunchev' && (
                <>
                  <span className="flex items-center gap-2"><Sun className="w-4 h-4 text-warning" /> Изгрев</span>
                  <span className="flex items-center gap-2"><Sun className="w-4 h-4 text-critical" /> Залез</span>
                  <span className="text-muted">Дължина на деня</span>
                </>
              )}
              {data.type === 'formula-1' && (
                <>
                  <span className="flex items-center gap-2"><span className="text-lg">🏎</span> Състезание</span>
                  <span className="px-2 py-1 bg-accent text-ink-rare rounded text-xs font-medium">Q</span>
                  <span className="text-xs">Квалификация</span>
                  <span className="px-2 py-1 bg-primary text-white rounded text-xs font-medium">S</span>
                  <span className="text-xs">Спринт</span>
                  <span className="text-muted">BG Time</span>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Month Navigator */}
        <section className="py-6 px-4 bg-panel/20">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
                let count = 0
                if (data.type === 'tsarkoven') {
                  count = data.months.find(m => m.month === month)?.items.length || 0
                } else if (data.type === 'lunen') {
                  count = data.months.find(m => m.month === month)?.phases.length || 0
                } else if (data.type === 'formula-1') {
                  count = data.rounds.filter(r => new Date(r.race.dateTime).getMonth() + 1 === month).length
                }

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
                {/* Church Calendar */}
                {data.type === 'tsarkoven' && data.months.map((monthData) => (
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

                {/* Lunar Calendar */}
                {data.type === 'lunen' && data.months.map((monthData) => (
                  <div key={monthData.month} id={`month-${monthData.month}`} className="bg-card rounded-2xl border border-border p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-text">{getMonthName(monthData.month)} {year}</h2>
                      <Link
                        href={monthData.monthUrls.page}
                        className="text-sm text-primary hover:underline"
                      >
                        Виж месеца →
                      </Link>
                    </div>
                    
                    <div className="space-y-3">
                      {monthData.phases.map((phase, i) => {
                        const { date, time } = formatDateTime(phase.dateTime)
                        
                        return (
                          <div key={i} className="flex items-center gap-4 p-4 bg-panel rounded-xl">
                            <span className="text-4xl">{getPhaseIcon(phase.phase)}</span>
                            
                            <div className="flex-1">
                              <p className="text-lg font-semibold text-text">{getPhaseName(phase.phase)}</p>
                              <p className="text-sm text-muted">{date} · {time}</p>
                            </div>
                            
                            <a
                              href={phase.icsUrl}
                              className="px-3 py-1.5 bg-card text-text border border-border hover:border-primary/40 rounded-lg text-xs transition-colors"
                            >
                              ICS
                            </a>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}

                {/* Solar Calendar */}
                {data.type === 'slunchev' && (
                  <>
                    {/* City selector */}
                    <div className="bg-card rounded-2xl border border-border p-6 mb-8">
                      <h3 className="text-lg font-semibold text-text mb-4">Избери град</h3>
                      <div className="flex flex-wrap gap-2">
                        {data.availableCities.map((city) => (
                          <Link
                            key={city.slug}
                            href={`/kalendar/slunchev/${city.slug}/${year}`}
                            className={`px-4 h-10 rounded-lg font-medium transition-colors flex items-center ${
                              city.slug === data.citySlug
                                ? 'bg-primary text-white'
                                : 'bg-panel text-text border border-border hover:border-primary/40'
                            }`}
                          >
                            {city.name}
                          </Link>
                        ))}
                      </div>
                    </div>

                    {data.months.map((monthData) => (
                      <div key={monthData.month} id={`month-${monthData.month}`} className="bg-card rounded-2xl border border-border p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h2 className="text-2xl font-bold text-text">{getMonthName(monthData.month)} {year}</h2>
                          <div className="flex gap-2">
                            <a href={monthData.monthUrls.csv} className="text-sm text-primary hover:underline">CSV</a>
                            <span className="text-muted">·</span>
                            <a href={monthData.monthUrls.json} className="text-sm text-primary hover:underline">JSON</a>
                          </div>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          {monthData.summary.shortestDay && (
                            <div className="p-4 bg-panel rounded-xl">
                              <p className="text-sm text-muted mb-1">Най-кратък ден</p>
                              <p className="text-lg font-semibold text-text">{monthData.summary.shortestDay.date}</p>
                              <p className="text-sm text-muted-strong">{monthData.summary.shortestDay.length}</p>
                            </div>
                          )}
                          {monthData.summary.longestDay && (
                            <div className="p-4 bg-panel rounded-xl">
                              <p className="text-sm text-muted mb-1">Най-дълъг ден</p>
                              <p className="text-lg font-semibold text-text">{monthData.summary.longestDay.date}</p>
                              <p className="text-sm text-muted-strong">{monthData.summary.longestDay.length}</p>
                            </div>
                          )}
                        </div>

                        <Link
                          href={monthData.monthUrls.page}
                          className="block mt-4 text-center px-4 h-10 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors leading-10"
                        >
                          Виж пълния месец
                        </Link>
                      </div>
                    ))}
                  </>
                )}

                {/* F1 Calendar */}
                {data.type === 'formula-1' && (
                  <div className="space-y-4">
                    {data.rounds.map((round) => {
                      const raceDate = formatDateTime(round.race.dateTime)
                      const qualiDate = formatDateTime(round.quali.dateTime)
                      
                      return (
                        <div key={round.round} className="bg-card rounded-2xl border border-border p-6">
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <span className="px-3 py-1 bg-panel text-muted font-mono text-sm rounded">
                                  R{round.round}
                                </span>
                                <h3 className="text-2xl font-bold text-text">{round.gp}</h3>
                              </div>
                              <p className="text-sm text-muted">{round.circuit}, {round.country}</p>
                            </div>
                            <div className="flex gap-2">
                              {round.race.hasSprint && (
                                <span className="px-2 py-1 bg-primary text-white rounded text-xs font-medium">S</span>
                              )}
                              {round.race.isNight && (
                                <span className="px-2 py-1 bg-ink-rare text-white rounded text-xs font-medium">Night</span>
                              )}
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div className="p-4 bg-panel rounded-xl">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-1 bg-accent text-ink-rare rounded text-xs font-medium">Q</span>
                                <p className="text-sm font-semibold text-text">Квалификация</p>
                              </div>
                              <p className="text-lg font-bold text-text">{qualiDate.date} · {qualiDate.time}</p>
                            </div>

                            <div className="p-4 bg-panel rounded-xl">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg">🏎</span>
                                <p className="text-sm font-semibold text-text">Състезание</p>
                              </div>
                              <p className="text-lg font-bold text-text">{raceDate.date} · {raceDate.time}</p>
                              {round.race.laps && (
                                <p className="text-xs text-muted">{round.race.laps} обиколки</p>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <a href={round.icsUrls.race} className="px-3 py-1.5 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs transition-colors">
                              Добави състезание
                            </a>
                            <a href={round.icsUrls.quali} className="px-3 py-1.5 bg-card text-text border border-border hover:border-primary/40 rounded-lg text-xs transition-colors">
                              Добави квалификация
                            </a>
                            {round.tv && round.tv.length > 0 && (
                              <button className="px-3 py-1.5 bg-card text-text border border-border hover:border-primary/40 rounded-lg text-xs transition-colors">
                                TV/Стрийм
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <aside className="space-y-6">
                {/* Quick Actions */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h3 className="text-xl font-bold text-text mb-4">Изтегли целия {year}</h3>
                  <div className="space-y-2">
                    {data.type === 'tsarkoven' && (
                      <>
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
                      </>
                    )}
                    {data.type === 'lunen' && (
                      <>
                        <a href={data.downloads.icsYearUrl} className="block px-4 h-10 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors text-center leading-10">
                          <Download className="w-4 h-4 inline mr-2" />
                          ICS файл
                        </a>
                        <a href={data.downloads.csvUrl} className="block px-4 h-10 bg-panel text-text border border-border hover:border-primary/40 rounded-lg font-medium transition-colors text-center leading-10">
                          CSV
                        </a>
                      </>
                    )}
                    {data.type === 'formula-1' && (
                      <a href={data.downloads.icsSeasonUrl} className="block px-4 h-10 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors text-center leading-10">
                        <Download className="w-4 h-4 inline mr-2" />
                        Целия сезон (ICS)
                      </a>
                    )}
                  </div>
                </div>

                {/* Cross-links */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h3 className="text-xl font-bold text-text mb-4">Други календари</h3>
                  <div className="space-y-2">
                    <Link href={`/kalendar/${year}`} className="block p-3 bg-panel hover:bg-panel/60 rounded-lg transition-colors">
                      <span className="text-text font-medium">Годишен календар {year}</span>
                    </Link>
                    {type !== 'tsarkoven' && (
                      <Link href={`/kalendar/tsarkoven/${year}`} className="block p-3 bg-panel hover:bg-panel/60 rounded-lg transition-colors">
                        <span className="text-text font-medium">Църковен {year}</span>
                      </Link>
                    )}
                    {type !== 'lunen' && (
                      <Link href={`/kalendar/lunen/${year}`} className="block p-3 bg-panel hover:bg-panel/60 rounded-lg transition-colors">
                        <span className="text-text font-medium">Лунен {year}</span>
                      </Link>
                    )}
                    {type !== 'slunchev' && (
                      <Link href={`/kalendar/slunchev/sofia/${year}`} className="block p-3 bg-panel hover:bg-panel/60 rounded-lg transition-colors">
                        <span className="text-text font-medium">Слънчев {year}</span>
                      </Link>
                    )}
                    {type !== 'formula-1' && (
                      <Link href={`/kalendar/formula-1/${year}`} className="block p-3 bg-panel hover:bg-panel/60 rounded-lg transition-colors">
                        <span className="text-text font-medium">Формула 1 {year}</span>
                      </Link>
                    )}
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
              {data.type === 'tsarkoven' && (
                <>
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
                </>
              )}
              
              {data.type === 'lunen' && (
                <>
                  <div className="bg-card rounded-xl border border-border p-6">
                    <h3 className="text-lg font-semibold text-text mb-3">
                      Часовете са в българско време ли?
                    </h3>
                    <p className="text-sm text-muted-strong">
                      Да, всички часове са в българско време (EET/EEST с автоматична корекция за лятно/зимно часово време).
                    </p>
                  </div>
                  <div className="bg-card rounded-xl border border-border p-6">
                    <h3 className="text-lg font-semibold text-text mb-3">
                      Колко точни са лунните фази?
                    </h3>
                    <p className="text-sm text-muted-strong">
                      Данните са изчислени с астрономическа точност (±1 минута) и се базират на NASA библиотеки.
                    </p>
                  </div>
                  <div className="bg-card rounded-xl border border-border p-6">
                    <h3 className="text-lg font-semibold text-text mb-3">
                      Как да добавя в календара си?
                    </h3>
                    <p className="text-sm text-muted-strong">
                      Изтеглете ICS файла и го импортирайте в Google Calendar, Apple Calendar или друго приложение.
                    </p>
                  </div>
                </>
              )}

              {data.type === 'slunchev' && (
                <>
                  <div className="bg-card rounded-xl border border-border p-6">
                    <h3 className="text-lg font-semibold text-text mb-3">
                      За кои градове е валидно?
                    </h3>
                    <p className="text-sm text-muted-strong">
                      Данните са изчислени за 5 основни града: София, Пловдив, Варна, Бургас и Русе.
                    </p>
                  </div>
                  <div className="bg-card rounded-xl border border-border p-6">
                    <h3 className="text-lg font-semibold text-text mb-3">
                      Как се изчисляват данните?
                    </h3>
                    <p className="text-sm text-muted-strong">
                      Използваме астрономически алгоритми с GPS координатите на всеки град.
                    </p>
                  </div>
                  <div className="bg-card rounded-xl border border-border p-6">
                    <h3 className="text-lg font-semibold text-text mb-3">
                      Защо има разлика между градовете?
                    </h3>
                    <p className="text-sm text-muted-strong">
                      Изгревът и залезът зависят от географската ширина и дължина — колкото по-на изток/север, толкова по-рано/късно.
                    </p>
                  </div>
                </>
              )}

              {data.type === 'formula-1' && (
                <>
                  <div className="bg-card rounded-xl border border-border p-6">
                    <h3 className="text-lg font-semibold text-text mb-3">
                      Часовете са в българско време ли?
                    </h3>
                    <p className="text-sm text-muted-strong">
                      Да, всички часове са конвертирани в българско време (EET/EEST).
                    </p>
                  </div>
                  <div className="bg-card rounded-xl border border-border p-6">
                    <h3 className="text-lg font-semibold text-text mb-3">
                      Как да добавя в календара си?
                    </h3>
                    <p className="text-sm text-muted-strong">
                      Изтеглете ICS файла за отделно състезание или целия сезон и го импортирайте в календарното си приложение.
                    </p>
                  </div>
                  <div className="bg-card rounded-xl border border-border p-6">
                    <h3 className="text-lg font-semibold text-text mb-3">
                      Откъде са данните?
                    </h3>
                    <p className="text-sm text-muted-strong">
                      Официалният календар на FIA, автоматично актуализиран при промени.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Sources */}
        <section className="py-8 px-4 bg-soft border-t border-border">
          <div className="max-w-7xl mx-auto">
            <h3 className="text-xl font-bold text-text mb-4">Източници</h3>
            <div className="flex flex-wrap gap-4 text-sm">
              {data.type === 'tsarkoven' && (
                <>
                  <a href="https://bg-patriarshia.bg" className="text-primary hover:underline">Българска православна църква</a>
                  <a href="#" className="text-primary hover:underline">Министерски съвет</a>
                </>
              )}
              {data.type === 'lunen' && (
                <a href="#" className="text-primary hover:underline">NASA Astronomical Algorithms</a>
              )}
              {data.type === 'slunchev' && (
                <a href="#" className="text-primary hover:underline">NOAA Solar Calculator</a>
              )}
              {data.type === 'formula-1' && (
                <a href="https://www.fia.com" className="text-primary hover:underline">FIA Official Calendar</a>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

