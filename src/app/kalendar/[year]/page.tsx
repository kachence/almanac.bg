import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ChevronRight, Calendar, Download, Printer, Bell, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import Link from 'next/link'

interface MonthSignal {
  date: string
  type: 'nameday' | 'holiday' | 'church'
  title?: string
  names?: string[]
  isOfficial?: boolean
  movable?: boolean
}

interface MonthData {
  month: number
  name: string
  slug: string
  url: string
  days: number
  signals: MonthSignal[]
}

interface NonWorkingDay {
  date: string
  title: string
  dayOfWeek: string
  moved: string | null
  movable?: boolean
}

interface YearData {
  year: number
  totalDays: number
  isLeapYear: boolean
  nonWorkingDaysCount: number
  monthsCount: number
  today?: string
  currentMonth?: number
  months: MonthData[]
  nonWorkingDays: NonWorkingDay[]
  namedaysByMonth: Record<string, Array<{ date: string; names: string[] }>>
  orthodoxByMonth: Record<string, Array<{ date: string; title: string; movable: boolean }>>
  lunarSnapshot: Array<{ dateTime: string; phase: string }>
  solarSnapshot: {
    city: string
    lat: number
    lon: number
    shortest: { date: string; dayLength: string; sunrise: string; sunset: string }
    longest: { date: string; dayLength: string; sunrise: string; sunset: string }
  }
  downloads: {
    icsNonWorkingUrl: string
    pdfYearUrl: string
    pdfMonthsZipUrl: string
    jsonUrl: string
  }
}

interface PageProps {
  params: {
    year: string
  }
}

// Load year data
async function getYearData(year: number): Promise<YearData | null> {
  try {
    const data = await import(`@/data/calendar/${year}.json`)
    return data.default
  } catch {
    return null
  }
}

// Generate static params
export async function generateStaticParams() {
  const years = [2024, 2025, 2026, 2027, 2028, 2029, 2030]
  return years.map((year) => ({
    year: year.toString(),
  }))
}

// Generate metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const year = parseInt(params.year, 10)
  const data = await getYearData(year)
  if (!data) return {}

  return {
    title: `Календар ${year} | Almanac.bg`,
    description: `Пълен календар за ${year} година с неработни дни, празници, имени дни. ${data.nonWorkingDaysCount} официални неработни дни.`,
    keywords: `календар ${year}, неработни дни ${year}, празници ${year}, имени дни ${year}`,
    openGraph: {
      title: `Календар ${year}`,
      description: `Пълен календар за ${year} с ${data.nonWorkingDaysCount} неработни дни и всички празници`,
      type: 'website',
    },
  }
}

// Helper to get day of week
function getDayOfWeek(dateStr: string): number {
  const date = new Date(dateStr)
  return (date.getDay() + 6) % 7 // Convert to Monday=0
}

// Helper to format date
function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  return `${day}.${month}.${year}`
}

export default async function YearPage({ params }: PageProps) {
  const year = parseInt(params.year, 10)
  
  if (isNaN(year) || year < 2020 || year > 2035) {
    notFound()
  }

  const yearData = await getYearData(year)
  if (!yearData) {
    notFound()
  }

  const currentYear = new Date().getFullYear()
  const isCurrentYear = year === currentYear

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
              <span className="text-text font-medium">{year}</span>
            </nav>

            {/* H1 */}
            <div className="flex items-center gap-4 mb-4">
              <Calendar className="w-10 h-10 text-primary" />
              <h1 className="text-4xl lg:text-5xl font-bold text-text">
                Календар {year}
              </h1>
            </div>

            {/* Meta strip */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
              <span>{yearData.totalDays} дни</span>
              <span>•</span>
              <span className="font-semibold">Неработни: {yearData.nonWorkingDaysCount}</span>
              <span>•</span>
              <span>{yearData.monthsCount} месеца</span>
              <span>•</span>
              <span>Луна/Слънце налични</span>
            </div>
          </div>
        </section>

        {/* Year Toolbar (Sticky) */}
        <section className="py-4 px-4 bg-panel/30 border-b border-border sticky top-0 z-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
              {/* Primary actions */}
              <div className="flex flex-wrap gap-2">
                {yearData.today && (
                  <Link
                    href={`/kalendar/${year}/${yearData.today.split('-')[1]}/${yearData.today.split('-')[2]}`}
                    className="px-4 h-10 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    Днес →
                  </Link>
                )}
                {yearData.currentMonth && (
                  <Link
                    href={`/kalendar/${year}/${String(yearData.currentMonth).padStart(2, '0')}`}
                    className="px-4 h-10 bg-card text-text border border-border hover:border-primary/40 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    Месец: {yearData.months.find(m => m.month === yearData.currentMonth)?.name} →
                  </Link>
                )}
                <a
                  href={yearData.downloads.icsNonWorkingUrl}
                  className="px-4 h-10 bg-card text-text border border-border hover:border-primary/40 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Неработни дни (ICS)
                </a>
                <a
                  href={yearData.downloads.pdfYearUrl}
                  className="px-4 h-10 bg-card text-text border border-border hover:border-primary/40 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Печат (PDF)
                </a>
              </div>

              {/* Year switchers */}
              <div className="flex items-center gap-2">
                <Link
                  href={`/kalendar/${year - 1}`}
                  className="px-3 h-10 bg-card text-text border border-border hover:border-primary/40 rounded-lg font-medium transition-colors flex items-center"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Link>
                {[year - 1, year, year + 1].map((y) => (
                  <Link
                    key={y}
                    href={`/kalendar/${y}`}
                    className={`
                      px-4 h-10 rounded-lg font-medium transition-colors flex items-center
                      ${y === year
                        ? 'bg-primary text-white'
                        : 'bg-card text-text border border-border hover:border-primary/40'
                      }
                    `}
                  >
                    {y}
                  </Link>
                ))}
                <Link
                  href={`/kalendar/${year + 1}`}
                  className="px-3 h-10 bg-card text-text border border-border hover:border-primary/40 rounded-lg font-medium transition-colors flex items-center"
                >
                  <ChevronRightIcon className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Quick links */}
            <div className="flex flex-wrap gap-3 mt-3 text-sm">
              <Link href={`/kalendar/lunen/${year}`} className="text-primary hover:underline">
                🌙 Лунен {year}
              </Link>
              <span className="text-muted">·</span>
              <Link href={`/kalendar/slanchev/${year}`} className="text-primary hover:underline">
                ☀ Слънчев {year}
              </Link>
              <span className="text-muted">·</span>
              <Link href={`/kalendar/tsarkoven/${year}`} className="text-primary hover:underline">
                ⛪ Църковен {year}
              </Link>
            </div>
          </div>
        </section>

        {/* Year Grid - 12 Months */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-text mb-8">Преглед по месеци</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {yearData.months.map((month) => (
                <div
                  key={month.month}
                  className="bg-card rounded-2xl border border-border p-5 hover:border-primary/40 hover:shadow-md transition-all"
                >
                  {/* Month header */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-text">{month.name} {year}</h3>
                    {month.month === yearData.currentMonth && (
                      <span className="px-2 py-1 bg-accent/20 text-accent text-xs rounded font-medium">
                        Текущ
                      </span>
                    )}
                  </div>

                  {/* Mini calendar grid */}
                  <div className="mb-4">
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {['П', 'В', 'С', 'Ч', 'П', 'С', 'Н'].map((day) => (
                        <div key={day} className="text-center text-xs text-muted font-medium">
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: 35 }, (_, i) => {
                        const firstDay = getDayOfWeek(`${year}-${String(month.month).padStart(2, '0')}-01`)
                        const dayNum = i - firstDay + 1
                        const isValidDay = dayNum > 0 && dayNum <= month.days
                        const dateStr = isValidDay ? `${year}-${String(month.month).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}` : ''
                        const signal = month.signals.find(s => s.date === dateStr)
                        const isToday = dateStr === yearData.today

                        return (
                          <div
                            key={i}
                            className={`
                              aspect-square flex items-center justify-center text-xs rounded relative
                              ${isValidDay 
                                ? isToday
                                  ? 'bg-primary text-white font-bold'
                                  : 'text-text hover:bg-panel/60 cursor-pointer'
                                : 'text-muted/30'
                              }
                            `}
                          >
                            {isValidDay && dayNum}
                            {signal && (
                              <span className={`
                                absolute bottom-0.5 w-1 h-1 rounded-full
                                ${signal.type === 'holiday' && signal.isOfficial
                                  ? 'bg-critical'
                                  : signal.type === 'church'
                                    ? 'bg-warning'
                                    : 'bg-accent'
                                }
                              `} />
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="flex flex-wrap gap-2 mb-4 text-xs text-muted">
                    {month.signals.some(s => s.type === 'nameday') && (
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-accent rounded-full"></span>
                        <span>Имен ден</span>
                      </div>
                    )}
                    {month.signals.some(s => s.type === 'holiday' && s.isOfficial) && (
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-critical rounded-full"></span>
                        <span>Неработен</span>
                      </div>
                    )}
                    {month.signals.some(s => s.type === 'church') && (
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-warning rounded-full"></span>
                        <span>Църковен</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <Link
                    href={month.url}
                    className="block w-full h-10 px-4 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors text-center leading-10"
                  >
                    Виж месеца →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Official Non-Working Days */}
        <section className="py-12 px-4 bg-panel/30">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-text mb-6">
              Официални неработни дни през {year}
            </h2>
            <p className="text-muted mb-8">
              {yearData.nonWorkingDaysCount} официални неработни дни (вкл. преместени по решение на МС)
            </p>
            
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-panel/60">
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-text">Дата</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-text">Ден</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-text">Събитие</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-text">Забележка</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-text">ICS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {yearData.nonWorkingDays.map((day, i) => (
                      <tr key={i} className="border-b border-border hover:bg-panel/30 transition-colors">
                        <td className="py-3 px-4 text-text font-medium">
                          {formatDate(day.date)}
                        </td>
                        <td className="py-3 px-4 text-muted">
                          {day.dayOfWeek}
                        </td>
                        <td className="py-3 px-4 text-text">
                          {day.title}
                          {day.movable && (
                            <span className="ml-2 text-xs text-warning">↔ подвижен</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-sm text-muted">
                          {day.moved || '—'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button className="text-primary hover:underline text-sm">
                            <Download className="w-4 h-4 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6 text-center">
              <a
                href={yearData.downloads.icsNonWorkingUrl}
                className="inline-flex items-center gap-2 px-6 h-12 bg-primary hover:bg-primary-hover text-white rounded-xl font-semibold transition-colors"
              >
                <Download className="w-4 h-4" />
                Свали всички като ICS
              </a>
            </div>
          </div>
        </section>

        {/* Name Days Overview */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-text mb-6">
              Именни дни през {year} (по месеци)
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(yearData.namedaysByMonth).map(([monthSlug, namedays]) => {
                const monthData = yearData.months.find(m => m.slug === monthSlug)
                if (!monthData || namedays.length === 0) return null
                
                return (
                  <div key={monthSlug} className="bg-card rounded-xl border border-border p-5">
                    <h3 className="text-lg font-semibold text-text mb-3">{monthData.name}</h3>
                    <div className="space-y-2 mb-4">
                      {namedays.slice(0, 5).map((nd, i) => (
                        <div key={i} className="text-sm">
                          <span className="text-muted">{formatDate(nd.date)}:</span>{' '}
                          <span className="text-text font-medium">{nd.names.join(', ')}</span>
                        </div>
                      ))}
                      {namedays.length > 5 && (
                        <p className="text-xs text-muted">+ още {namedays.length - 5}</p>
                      )}
                    </div>
                    <Link
                      href={`/imen-den/${monthData.name.toLowerCase()}`}
                      className="text-primary hover:underline text-sm font-medium"
                    >
                      Виж всички за {monthData.name.toLowerCase()} →
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Orthodox Holidays Quick Index */}
        <section className="py-12 px-4 bg-panel/30">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-text mb-6">
              Православни празници {year}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {Object.entries(yearData.orthodoxByMonth).map(([monthSlug, holidays]) => {
                const monthData = yearData.months.find(m => m.slug === monthSlug)
                if (!monthData || holidays.length === 0) return null
                
                return (
                  <div key={monthSlug} className="bg-card rounded-xl border border-border p-4">
                    <h3 className="font-semibold text-text mb-2">{monthData.name}</h3>
                    <div className="space-y-1">
                      {holidays.map((h, i) => (
                        <div key={i} className="text-sm flex items-start gap-2">
                          <span className="text-muted">{formatDate(h.date)}:</span>
                          <span className="text-text flex-1">
                            {h.title}
                            {h.movable && <span className="ml-1 text-xs text-warning">↔</span>}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="text-center">
              <Link
                href={`/kalendar/tsarkoven/${year}`}
                className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
              >
                Църковен календар {year} →
              </Link>
            </div>
          </div>
        </section>

        {/* Lunar & Solar Snapshots */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Lunar */}
              <div className="bg-card rounded-2xl border border-border p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">🌙</span>
                  <h3 className="text-2xl font-bold text-text">Лунен {year}</h3>
                </div>
                <p className="text-sm text-muted mb-4">Следващи фази на луната</p>
                <div className="space-y-3">
                  {yearData.lunarSnapshot.map((lunar, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-text">{lunar.phase}</span>
                      <span className="text-muted text-sm">
                        {new Date(lunar.dateTime).toLocaleDateString('bg-BG', { 
                          day: 'numeric', 
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  ))}
                </div>
                <Link
                  href={`/kalendar/lunen/${year}`}
                  className="block mt-6 text-center px-4 h-10 bg-panel text-text border border-border hover:border-primary/40 rounded-lg font-medium transition-colors leading-10"
                >
                  Лунен календар {year} →
                </Link>
              </div>

              {/* Solar */}
              <div className="bg-card rounded-2xl border border-border p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">☀</span>
                  <h3 className="text-2xl font-bold text-text">Слънчев {year}</h3>
                </div>
                <p className="text-sm text-muted mb-4">
                  За {yearData.solarSnapshot.city}
                </p>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted mb-1">Най-къс ден</p>
                    <p className="text-text">
                      {formatDate(yearData.solarSnapshot.shortest.date)} — {yearData.solarSnapshot.shortest.dayLength}
                    </p>
                    <p className="text-xs text-muted">
                      ↑ {yearData.solarSnapshot.shortest.sunrise} ↓ {yearData.solarSnapshot.shortest.sunset}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted mb-1">Най-дълъг ден</p>
                    <p className="text-text">
                      {formatDate(yearData.solarSnapshot.longest.date)} — {yearData.solarSnapshot.longest.dayLength}
                    </p>
                    <p className="text-xs text-muted">
                      ↑ {yearData.solarSnapshot.longest.sunrise} ↓ {yearData.solarSnapshot.longest.sunset}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/kalendar/slanchev/${year}`}
                  className="block mt-6 text-center px-4 h-10 bg-panel text-text border border-border hover:border-primary/40 rounded-lg font-medium transition-colors leading-10"
                >
                  Слънчев календар {year} →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Utilities */}
        <section className="py-12 px-4 bg-panel/30">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-text mb-6">Допълнителни услуги</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-card rounded-xl border border-border p-6">
                <Printer className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold text-text mb-2">Печат</h3>
                <p className="text-sm text-muted mb-4">
                  Разпечатай календар {year} (A4 & A3) или отделни месеци
                </p>
                <div className="space-y-2">
                  <a
                    href={yearData.downloads.pdfYearUrl}
                    className="block w-full h-10 px-4 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors text-center leading-10"
                  >
                    Цялата година
                  </a>
                  <a
                    href={yearData.downloads.pdfMonthsZipUrl}
                    className="block w-full h-10 px-4 bg-panel text-text border border-border hover:border-primary/40 rounded-lg font-medium transition-colors text-center leading-10"
                  >
                    12 месеца (ZIP)
                  </a>
                </div>
              </div>

              <div className="bg-card rounded-xl border border-border p-6">
                <Download className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold text-text mb-2">Данни</h3>
                <p className="text-sm text-muted mb-4">
                  Изтегли календарни данни за {year} (JSON/CSV)
                </p>
                <a
                  href={yearData.downloads.jsonUrl}
                  className="block w-full h-10 px-4 bg-panel text-text border border-border hover:border-primary/40 rounded-lg font-medium transition-colors text-center leading-10"
                >
                  Свали JSON
                </a>
              </div>

              <div className="bg-card rounded-xl border border-border p-6">
                <Bell className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold text-text mb-2">Напомняния</h3>
                <p className="text-sm text-muted mb-4">
                  Получавай напомняния за неработните дни през {year}
                </p>
                <button className="block w-full h-10 px-4 bg-panel text-text border border-border hover:border-primary/40 rounded-lg font-medium transition-colors">
                  Абонирай се
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-text mb-6">Често задавани въпроси</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-text mb-3">
                  Кои са неработните дни през {year}?
                </h3>
                <p className="text-sm text-muted-strong">
                  През {year} г. има {yearData.nonWorkingDaysCount} официални неработни дни, 
                  включително преместените почивни дни по решение на Министерския съвет.
                </p>
              </div>

              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-text mb-3">
                  Как се изчислява Великден?
                </h3>
                <p className="text-sm text-muted-strong">
                  Великден се изчислява по Александрийската пасхалия — винаги е в първата неделя 
                  след пълнолунието, което настъпва след или на пролетното равноденствие (21 март).
                </p>
              </div>

              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-text mb-3">
                  Как да добавя ICS в Google Calendar?
                </h3>
                <p className="text-sm text-muted-strong">
                  Изтеглете ICS файла, отворете Google Calendar, кликнете на "+" до "Други календари", 
                  изберете "Импортиране" и качете файла.
                </p>
              </div>

              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-text mb-3">
                  Ще се променят ли почивните дни?
                </h3>
                <p className="text-sm text-muted-strong">
                  Министерският съвет може да премести почивни дни, когато официален празник 
                  пада в събота или неделя. Проверявайте редовно за актуализации.
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
              <a href="#" className="text-primary hover:underline">БПЦ календар</a>
              <span className="text-muted">•</span>
              <a href="#" className="text-primary hover:underline">Решения на МС</a>
              <span className="text-muted">•</span>
              <a href="#" className="text-primary hover:underline">Астрономически изчисления</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

