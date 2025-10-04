import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ChevronRight, ChevronLeft, Calendar, Download, Printer, X } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import Link from 'next/link'

interface DaySignals {
  hasNameday: boolean
  hasHoliday: boolean
  hasChurchHoliday: boolean
  lunarPhase: string | null
}

interface Holiday {
  title: string
  slug: string
  type: string
  isOfficial: boolean
  movable: boolean
}

interface DayData {
  date: string
  day: number
  weekday: number
  weekdayName: string
  isToday: boolean
  isWeekend: boolean
  signals: DaySignals
  summary: string | null
  namedays: string[]
  holidays: Holiday[]
}

interface MonthData {
  year: number
  month: number
  monthName: string
  monthNameGenitive: string
  daysInMonth: number
  weekendsCount: number
  nonWorkingDaysCount: number
  namedaysCount: number
  firstDayOfWeek: number
  today?: string
  days: DayData[]
  nonWorkingDays: any[]
  namedaysByWeek: Record<string, Array<{ date: string; day: number; names: string[] }>>
  holidaysByType: Record<string, Array<{ date: string; day: number; title: string; slug: string; badges: string[] }>>
  lunar: Array<{ dateTime: string; phase: string }>
  solar: {
    city: string
    shortest: { date: string; dayLength: string; sunrise: string; sunset: string }
    longest: { date: string; dayLength: string; sunrise: string; sunset: string }
  }
  downloads: {
    icsMonthUrl: string
    pdfMonthUrl: string
    csvMonthUrl: string
    jsonMonthUrl: string
  }
  prevMonth: { name: string; url: string }
  nextMonth: { name: string; url: string }
}

interface PageProps {
  params: {
    year: string
    month: string
  }
}

// Load month data
async function getMonthData(year: number, month: number): Promise<MonthData | null> {
  try {
    const data = await import(`@/data/calendar/${year}-${String(month).padStart(2, '0')}.json`)
    return data.default
  } catch {
    return null
  }
}

// Generate static params
export async function generateStaticParams() {
  const years = [2025, 2026]
  const months = Array.from({ length: 12 }, (_, i) => i + 1)
  
  const params = []
  for (const year of years) {
    for (const month of months) {
      params.push({
        year: year.toString(),
        month: String(month).padStart(2, '0'),
      })
    }
  }
  return params
}

// Generate metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const year = parseInt(params.year, 10)
  const month = parseInt(params.month, 10)
  const data = await getMonthData(year, month)
  if (!data) return {}

  return {
    title: `Календар ${data.monthNameGenitive} ${year} | Almanac.bg`,
    description: `Пълен календар за ${data.monthNameGenitive} ${year} с ${data.daysInMonth} дни, ${data.namedaysCount} именни дни, празници и луннифази.`,
    keywords: `календар ${data.monthNameGenitive} ${year}, ${data.monthNameGenitive} ${year}, имени дни ${data.monthNameGenitive}`,
    openGraph: {
      title: `Календар ${data.monthNameGenitive} ${year}`,
      description: `${data.daysInMonth} дни · ${data.weekendsCount} уикенда · ${data.namedaysCount} именни дни`,
      type: 'website',
    },
  }
}

// Format date
function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  return `${day}.${month}.${year}`
}

// Format datetime
function formatDateTime(dateTime: string): string {
  const date = new Date(dateTime)
  return date.toLocaleDateString('bg-BG', { 
    day: 'numeric', 
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export default async function MonthPage({ params }: PageProps) {
  const year = parseInt(params.year, 10)
  const month = parseInt(params.month, 10)
  
  if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
    notFound()
  }

  const monthData = await getMonthData(year, month)
  if (!monthData) {
    notFound()
  }

  // Build calendar grid (7x5 = 35 cells)
  const calendarGrid = []
  const firstDayOffset = monthData.firstDayOfWeek === 7 ? 6 : monthData.firstDayOfWeek - 1
  
  for (let i = 0; i < 35; i++) {
    const dayNum = i - firstDayOffset + 1
    const isValidDay = dayNum > 0 && dayNum <= monthData.daysInMonth
    const dayData = isValidDay ? monthData.days.find(d => d.day === dayNum) : null
    calendarGrid.push(dayData)
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
              <Link href="/" className="hover:text-text transition-colors">
                Начало
              </Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <Link href="/kalendar" className="hover:text-text transition-colors">
                Календар
              </Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <Link href={`/kalendar/${year}`} className="hover:text-text transition-colors">
                {year}
              </Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <span className="text-text font-medium capitalize">{monthData.monthName}</span>
            </nav>

            {/* H1 */}
            <div className="flex items-center gap-4 mb-4">
              <Calendar className="w-10 h-10 text-primary" />
              <h1 className="text-4xl lg:text-5xl font-bold text-text">
                Календар {monthData.monthNameGenitive} {year}
              </h1>
            </div>

            {/* Meta strip */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
              <span>{monthData.daysInMonth} дни</span>
              <span>•</span>
              <span>{monthData.weekendsCount} уикенда</span>
              {monthData.nonWorkingDaysCount > 0 && (
                <>
                  <span>•</span>
                  <span className="font-semibold">Неработни: {monthData.nonWorkingDaysCount}</span>
                </>
              )}
              <span>•</span>
              <span>Именни дни: {monthData.namedaysCount}</span>
            </div>
          </div>
        </section>

        {/* Month Toolbar (Sticky) */}
        <section className="py-4 px-4 bg-panel/30 border-b border-border sticky top-0 z-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
              {/* Primary actions */}
              <div className="flex flex-wrap gap-2">
                {monthData.today && (
                  <Link
                    href={`/kalendar/${year}/${String(month).padStart(2, '0')}/${monthData.today.split('-')[2]}`}
                    className="px-4 h-10 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors"
                  >
                    Днес →
                  </Link>
                )}
                <a
                  href={monthData.downloads.pdfMonthUrl}
                  className="px-4 h-10 bg-card text-text border border-border hover:border-primary/40 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Печат (PDF)
                </a>
                {monthData.nonWorkingDaysCount > 0 && (
                  <a
                    href={monthData.downloads.icsMonthUrl}
                    className="px-4 h-10 bg-card text-text border border-border hover:border-primary/40 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Неработни дни (ICS)
                  </a>
                )}
              </div>

              {/* Month navigation */}
              <div className="flex items-center gap-2">
                <Link
                  href={monthData.prevMonth.url}
                  className="px-4 h-10 bg-card text-text border border-border hover:border-primary/40 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  {monthData.prevMonth.name}
                </Link>
                <Link
                  href={monthData.nextMonth.url}
                  className="px-4 h-10 bg-card text-text border border-border hover:border-primary/40 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  {monthData.nextMonth.name}
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 mt-3">
              <button className="px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-medium">
                Всичко
              </button>
              <button className="px-3 py-1.5 bg-card text-text border border-border hover:border-primary/40 rounded-lg text-sm font-medium transition-colors">
                Само именни дни
              </button>
              <button className="px-3 py-1.5 bg-card text-text border border-border hover:border-primary/40 rounded-lg text-sm font-medium transition-colors">
                Само празници
              </button>
              {monthData.nonWorkingDaysCount > 0 && (
                <button className="px-3 py-1.5 bg-card text-text border border-border hover:border-primary/40 rounded-lg text-sm font-medium transition-colors">
                  Само неработни
                </button>
              )}
              <button className="px-3 py-1.5 bg-card text-text border border-border hover:border-primary/40 rounded-lg text-sm font-medium transition-colors">
                Уикенди
              </button>
            </div>
          </div>
        </section>

        {/* Month Grid */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
              <span className="font-semibold text-text">Легенда:</span>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-accent rounded-full"></span>
                <span className="text-muted">имен ден</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-critical rounded-full"></span>
                <span className="text-muted">празник</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-warning text-lg leading-none">✚</span>
                <span className="text-muted">църковен</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg leading-none">🌙</span>
                <span className="text-muted">фаза</span>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="bg-card rounded-2xl border border-border p-4 md:p-6">
              {/* Weekday headers */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {['Пон', 'Вто', 'Сря', 'Чет', 'Пет', 'Съб', 'Нед'].map((day, i) => (
                  <div
                    key={i}
                    className={`text-center text-sm font-semibold py-2 ${
                      i >= 5 ? 'text-muted' : 'text-text'
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Days grid */}
              <div className="grid grid-cols-7 gap-2">
                {calendarGrid.map((dayData, i) => {
                  if (!dayData) {
                    return <div key={i} className="aspect-square" />
                  }

                  const isToday = dayData.isToday
                  const hasSignals = dayData.signals.hasNameday || dayData.signals.hasHoliday || dayData.signals.hasChurchHoliday || dayData.signals.lunarPhase

                  return (
                    <Link
                      key={i}
                      href={`/kalendar/${year}/${String(month).padStart(2, '0')}/${String(dayData.day).padStart(2, '0')}`}
                      className={`
                        aspect-square p-2 rounded-xl border transition-all
                        ${isToday
                          ? 'border-2 border-accent bg-accent/10'
                          : dayData.isWeekend
                            ? 'border-border bg-panel/30 hover:border-primary/40'
                            : 'border-border bg-card hover:border-primary/40 hover:shadow-sm'
                        }
                      `}
                    >
                      <div className="flex flex-col h-full">
                        {/* Day number */}
                        <div className={`text-lg font-bold mb-1 ${
                          isToday ? 'text-accent' : 'text-text'
                        }`}>
                          {dayData.day}
                        </div>

                        {/* Signals */}
                        {hasSignals && (
                          <div className="flex items-center gap-1 mb-1">
                            {dayData.signals.hasNameday && (
                              <span className="w-2 h-2 bg-accent rounded-full"></span>
                            )}
                            {dayData.signals.hasHoliday && (
                              <span className="w-2 h-2 bg-critical rounded-full"></span>
                            )}
                            {dayData.signals.hasChurchHoliday && (
                              <span className="text-warning text-xs">✚</span>
                            )}
                            {dayData.signals.lunarPhase && (
                              <span className="text-xs">🌙</span>
                            )}
                          </div>
                        )}

                        {/* Summary */}
                        {dayData.summary && (
                          <div className="text-xs text-muted line-clamp-2 mt-auto">
                            {dayData.summary}
                          </div>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Content Grid */}
        <section className="py-12 px-4 bg-panel/30">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-[1fr,360px] gap-8">
              {/* Main content */}
              <div className="space-y-8">
                {/* Non-Working Days */}
                {monthData.nonWorkingDays.length > 0 ? (
                  <div className="bg-card rounded-2xl border border-border p-6">
                    <h2 className="text-2xl font-bold text-text mb-4">Неработни дни</h2>
                    <div className="space-y-3">
                      {monthData.nonWorkingDays.map((day, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-panel rounded-lg">
                          <div>
                            <p className="font-medium text-text">{day.title}</p>
                            <p className="text-sm text-muted">{formatDate(day.date)} · {day.dayOfWeek}</p>
                          </div>
                          <button className="text-primary hover:underline text-sm">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-card rounded-2xl border border-border p-6">
                    <h2 className="text-2xl font-bold text-text mb-4">Неработни дни</h2>
                    <p className="text-muted">Няма официални неработни дни този месец.</p>
                  </div>
                )}

                {/* Name Days by Week */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h2 className="text-2xl font-bold text-text mb-4">Именни дни</h2>
                  <div className="space-y-4">
                    {Object.entries(monthData.namedaysByWeek).map(([week, namedays]) => (
                      <div key={week}>
                        <h3 className="text-lg font-semibold text-text mb-2">Седмица {week}</h3>
                        <div className="space-y-2">
                          {namedays.map((nd, i) => (
                            <div key={i} className="flex items-start gap-3">
                              <span className="text-muted font-medium whitespace-nowrap">{nd.day} {monthData.monthNameGenitive}:</span>
                              <div className="flex flex-wrap gap-2">
                                {nd.names.map((name) => (
                                  <Link
                                    key={name}
                                    href={`/imen-den/${name.toLowerCase()}`}
                                    className="px-2 py-1 bg-[#FFF0C8] text-[#1F1915] border border-[#F0C770] rounded text-sm font-medium hover:bg-[#F0C770] transition-colors"
                                  >
                                    {name}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Holidays by Type */}
                {Object.entries(monthData.holidaysByType).map(([type, holidays]) => {
                  if (holidays.length === 0) return null
                  
                  const typeLabels: Record<string, string> = {
                    'church': 'Църковни празници',
                    'national': 'Национални празници',
                    'professional': 'Професионални дни',
                    'foreign': 'Чуждестранни празници'
                  }
                  
                  return (
                    <div key={type} className="bg-card rounded-2xl border border-border p-6">
                      <h2 className="text-2xl font-bold text-text mb-4">{typeLabels[type]}</h2>
                      <div className="space-y-3">
                        {holidays.map((holiday, i) => (
                          <Link
                            key={i}
                            href={`/praznik/${holiday.slug}/${year}`}
                            className="block p-3 bg-panel hover:bg-panel/60 rounded-lg transition-colors"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <p className="font-medium text-text">{holiday.title}</p>
                                <p className="text-sm text-muted">{holiday.day} {monthData.monthNameGenitive}</p>
                              </div>
                              {holiday.badges.length > 0 && (
                                <div className="flex gap-2">
                                  {holiday.badges.map((badge, j) => (
                                    <span key={j} className="px-2 py-0.5 bg-critical text-white text-xs rounded">
                                      {badge}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Sidebar */}
              <aside className="space-y-6">
                {/* Lunar Phases */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">🌙</span>
                    <h3 className="text-xl font-bold text-text">Лунни фази</h3>
                  </div>
                  <div className="space-y-3">
                    {monthData.lunar.map((lunar, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-text">{lunar.phase}</span>
                        <span className="text-muted text-sm">{formatDateTime(lunar.dateTime)}</span>
                      </div>
                    ))}
                  </div>
                  <Link
                    href={`/kalendar/lunen/${year}/${String(month).padStart(2, '0')}`}
                    className="block mt-4 text-center px-4 h-10 bg-panel text-text border border-border hover:border-primary/40 rounded-lg font-medium transition-colors leading-10"
                  >
                    Лунен календар →
                  </Link>
                </div>

                {/* Solar Data */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">☀</span>
                    <h3 className="text-xl font-bold text-text">Слънце</h3>
                  </div>
                  <p className="text-sm text-muted mb-4">За {monthData.solar.city}</p>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-muted mb-1">Най-къс ден</p>
                      <p className="text-text">{formatDate(monthData.solar.shortest.date)}</p>
                      <p className="text-xs text-muted">{monthData.solar.shortest.dayLength}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted mb-1">Най-дълъг ден</p>
                      <p className="text-text">{formatDate(monthData.solar.longest.date)}</p>
                      <p className="text-xs text-muted">{monthData.solar.longest.dayLength}</p>
                    </div>
                  </div>
                  <Link
                    href={`/kalendar/slanchev/${year}/${String(month).padStart(2, '0')}`}
                    className="block mt-4 text-center px-4 h-10 bg-panel text-text border border-border hover:border-primary/40 rounded-lg font-medium transition-colors leading-10"
                  >
                    Слънчев календар →
                  </Link>
                </div>

                {/* Bulk Actions */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h3 className="text-xl font-bold text-text mb-4">Бързи действия</h3>
                  <div className="space-y-2">
                    <a
                      href={monthData.downloads.icsMonthUrl}
                      className="block w-full h-10 px-4 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors text-center leading-10"
                    >
                      Добави всички събития
                    </a>
                    <a
                      href={monthData.downloads.csvMonthUrl}
                      className="block w-full h-10 px-4 bg-panel text-text border border-border hover:border-primary/40 rounded-lg font-medium transition-colors text-center leading-10"
                    >
                      Свали CSV
                    </a>
                  </div>
                </div>

                {/* Cross-family links */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h3 className="text-xl font-bold text-text mb-4">Други календари</h3>
                  <div className="space-y-2 text-sm">
                    <Link
                      href={`/kalendar/tsarkoven/${year}/${String(month).padStart(2, '0')}`}
                      className="block text-primary hover:underline"
                    >
                      ⛪ Църковен {monthData.monthNameGenitive} {year}
                    </Link>
                    <Link
                      href={`/kalendar/lunen/${year}/${String(month).padStart(2, '0')}`}
                      className="block text-primary hover:underline"
                    >
                      🌙 Лунен {monthData.monthNameGenitive} {year}
                    </Link>
                    <Link
                      href={`/kalendar/slanchev/${year}/${String(month).padStart(2, '0')}`}
                      className="block text-primary hover:underline"
                    >
                      ☀ Слънчев {monthData.monthNameGenitive} {year}
                    </Link>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-text mb-6">Често задавани въпроси</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {monthData.nonWorkingDaysCount > 0 ? (
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="text-lg font-semibold text-text mb-3">
                    Кои са неработните дни през {monthData.monthNameGenitive} {year}?
                  </h3>
                  <p className="text-sm text-muted-strong">
                    През {monthData.monthNameGenitive} {year} има {monthData.nonWorkingDaysCount} официални неработни дни. 
                    Вижте пълния списък по-горе.
                  </p>
                </div>
              ) : (
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="text-lg font-semibold text-text mb-3">
                    Има ли неработни дни през {monthData.monthNameGenitive} {year}?
                  </h3>
                  <p className="text-sm text-muted-strong">
                    Не, през {monthData.monthNameGenitive} {year} няма официални неработни дни.
                  </p>
                </div>
              )}

              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-text mb-3">
                  Как да добавя месечните събития в календара си?
                </h3>
                <p className="text-sm text-muted-strong">
                  Използвайте бутона "Добави всички събития" в страничната лента, за да изтеглите ICS файл 
                  с всички празници и имени дни за месеца.
                </p>
              </div>

              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-text mb-3">
                  Какво означава подвижен празник?
                </h3>
                <p className="text-sm text-muted-strong">
                  Подвижните празници нямат фиксирана дата и се изчисляват спрямо Великден, 
                  който варира всяка година според лунния календар.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Sources */}
        <section className="py-8 px-4 bg-soft border-t border-border">
          <div className="max-w-7xl mx-auto">
            <p className="text-sm text-muted">
              <span className="font-semibold">Източници:</span> БПЦ календар, Министерски съвет (неработни дни), 
              астрономически изчисления (лунни фази, изгрев/залез).
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

