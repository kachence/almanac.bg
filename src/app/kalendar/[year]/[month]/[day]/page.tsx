import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ChevronRight, ChevronLeft, Calendar, Download, Bell, Copy, Share2, Sun, Moon } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import Link from 'next/link'

interface Nameday {
  name: string
  slug: string
  variants: string[]
  vocative: string
  isPrimary: boolean
}

interface Greeting {
  tone: string
  text: string
  rendered: string
}

interface Holiday {
  title: string
  slug: string
  type: string
  isOfficial: boolean
  movable?: boolean
}

interface DayData {
  date: string
  year: number
  month: number
  day: number
  weekday: string
  weekdayName: string
  weekdayNameFull: string
  isToday: boolean
  isWeekend: boolean
  isNonWorking: boolean
  weekNumber: number
  dayOfYear: number
  formattedDate: string
  namedays: Nameday[]
  greetings: Greeting[]
  holidays: Holiday[]
  church: Holiday[]
  lunar: {
    phase: string
    phaseKey: string
    illumination: number
    nextPhase: { phase: string; dateTime: string; date: string }
    prevPhase: { phase: string; dateTime: string; date: string }
  }
  solar: {
    city: string
    citySlug: string
    lat: number
    lon: number
    sunrise: string
    sunset: string
    dayLength: string
    civilTwilightStart: string
    civilTwilightEnd: string
    solarNoon: string
    availableCities: Array<{ name: string; slug: string }>
  }
  timeline: Array<{ time: string; event: string; type: string; icon: string }>
  nextDays: Array<{ date: string; day: number; weekday: string; summary: string | null }>
  popularThisWeek: Array<{ name: string; slug: string }>
  prevNext: {
    prev: { date: string; url: string; weekday: string; summary: string | null }
    next: { date: string; url: string; weekday: string; summary: string | null }
  }
  links: {
    month: string
    year: string
    lunarMonth: string
    solarMonth: string
    orthodoxYear: string
  }
  downloads: {
    icsDayUrl: string
    icsNamedaysUrl: string
  }
  sources: Array<{ label: string; url: string }>
}

interface PageProps {
  params: {
    year: string
    month: string
    day: string
  }
}

// Load day data
async function getDayData(year: number, month: number, day: number): Promise<DayData | null> {
  try {
    const data = await import(`@/data/calendar/days/${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}.json`)
    return data.default
  } catch {
    return null
  }
}

// Generate static params (sample - in production, generate for all days)
export async function generateStaticParams() {
  // Sample for October 2025
  const params = []
  for (let day = 1; day <= 31; day++) {
    params.push({
      year: '2025',
      month: '10',
      day: String(day).padStart(2, '0'),
    })
  }
  return params
}

// Generate metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const year = parseInt(params.year, 10)
  const month = parseInt(params.month, 10)
  const day = parseInt(params.day, 10)
  const data = await getDayData(year, month, day)
  if (!data) return {}

  const namedaysText = data.namedays.length > 0 
    ? ` Имен ден: ${data.namedays.map(n => n.name).join(', ')}.`
    : ''

  return {
    title: `${data.formattedDate} | Almanac.bg`,
    description: `${data.formattedDate}.${namedaysText} Виж празници, луннифази, изгрев и залез.`,
    keywords: `${day} ${getMonthName(month)} ${year}, календар, ${data.namedays.map(n => n.name).join(', ')}`,
    openGraph: {
      title: data.formattedDate,
      description: `${namedaysText} Празници и още`,
      type: 'article',
    },
  }
}

// Helper functions
function getMonthName(month: number): string {
  const names = ['януари', 'февруари', 'март', 'април', 'май', 'юни', 'юли', 'август', 'септември', 'октомври', 'ноември', 'декември']
  return names[month - 1]
}

function formatTime(timeStr: string): string {
  return timeStr
}

export default async function DayPage({ params }: PageProps) {
  const year = parseInt(params.year, 10)
  const month = parseInt(params.month, 10)
  const day = parseInt(params.day, 10)
  
  if (isNaN(year) || isNaN(month) || isNaN(day) || month < 1 || month > 12 || day < 1 || day > 31) {
    notFound()
  }

  const dayData = await getDayData(year, month, day)
  if (!dayData) {
    notFound()
  }

  const monthName = getMonthName(month)

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
              <Link href={`/kalendar/${year}/${String(month).padStart(2, '0')}`} className="hover:text-text transition-colors capitalize">
                {monthName}
              </Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <span className="text-text font-medium">{day}</span>
            </nav>

            {/* H1 */}
            <div className="flex items-center gap-4 mb-6">
              <Calendar className="w-10 h-10 text-primary" />
              <h1 className="text-4xl lg:text-5xl font-bold text-text capitalize">
                {dayData.formattedDate}
              </h1>
            </div>

            {/* Meta bar */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              {dayData.namedays.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-accent font-medium">🟠 Имен ден:</span>
                  <div className="flex flex-wrap gap-2">
                    {dayData.namedays.map((nd) => (
                      <Link
                        key={nd.slug}
                        href={`/imen-den/${nd.slug}`}
                        className="px-3 py-1 bg-[#FFF0C8] text-[#1F1915] border border-[#F0C770] rounded-full font-medium hover:bg-[#F0C770] transition-colors"
                      >
                        {nd.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              
              {dayData.isNonWorking && (
                <span className="px-3 py-1 bg-critical text-white rounded-full font-medium">
                  Неработен ден
                </span>
              )}

              <div className="flex items-center gap-2 text-muted">
                <Moon className="w-4 h-4" />
                <span>{dayData.lunar.phase}</span>
              </div>

              <div className="flex items-center gap-2 text-muted">
                <Sun className="w-4 h-4" />
                <span>{dayData.solar.city}: ↑ {dayData.solar.sunrise} · ↓ {dayData.solar.sunset}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions (Sticky) */}
        <section className="py-4 px-4 bg-panel/30 border-b border-border sticky top-0 z-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-2">
              <a
                href={dayData.downloads.icsDayUrl}
                className="px-4 h-10 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Добави в календара
              </a>
              <button className="px-4 h-10 bg-card text-text border border-border hover:border-primary/40 rounded-lg font-medium transition-colors flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Напомни ми
              </button>
              {dayData.namedays.length > 0 && (
                <Link
                  href="#kartichki"
                  className="px-4 h-10 bg-card text-text border border-border hover:border-primary/40 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  Картички за днес
                </Link>
              )}
              <Link
                href={dayData.links.month}
                className="px-4 h-10 bg-card text-text border border-border hover:border-primary/40 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                Към месец {monthName} →
              </Link>
            </div>
          </div>
        </section>

        {/* Content Grid */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-[1fr,360px] gap-8">
              {/* Main Content */}
              <div className="space-y-8">
                {/* Name Days */}
                {dayData.namedays.length > 0 ? (
                  <div className="bg-card rounded-2xl border border-border p-6">
                    <h2 className="text-3xl font-bold text-text mb-6">Имен ден днес</h2>
                    
                    {/* Name chips */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {dayData.namedays.map((nd) => (
                        <Link
                          key={nd.slug}
                          href={`/imen-den/${nd.slug}`}
                          className="px-4 py-2 bg-[#FFF0C8] text-[#1F1915] border border-[#F0C770] rounded-lg text-lg font-semibold hover:bg-[#F0C770] transition-colors"
                        >
                          {nd.name}
                        </Link>
                      ))}
                    </div>

                    {/* Greetings */}
                    <div>
                      <h3 className="text-lg font-semibold text-text mb-4">Бързи поздрави</h3>
                      <div className="space-y-2">
                        {dayData.greetings.map((greeting, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 p-3 bg-panel rounded-lg hover:bg-panel/60 transition-colors"
                          >
                            <p className="flex-1 text-text">{greeting.rendered}</p>
                            <button
                              className="flex-shrink-0 p-2 bg-card rounded-lg border border-border hover:bg-primary hover:text-white hover:border-primary transition-colors"
                              title="Копирай"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Cards CTA */}
                    <div id="kartichki" className="mt-6 pt-6 border-t border-border">
                      <Link
                        href={`/kartichki/${dayData.namedays[0].slug}`}
                        className="inline-flex items-center gap-2 px-6 h-12 bg-primary hover:bg-primary-hover text-white rounded-xl font-semibold transition-colors"
                      >
                        Картички за {dayData.namedays[0].name}
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="bg-card rounded-2xl border border-border p-6">
                    <h2 className="text-3xl font-bold text-text mb-4">Имен ден днес</h2>
                    <p className="text-muted mb-6">Няма имен ден днес.</p>
                    <div>
                      <p className="text-sm font-medium text-text mb-3">Следващи именни дни:</p>
                      <div className="flex flex-wrap gap-2">
                        {dayData.nextDays
                          .filter(d => d.summary)
                          .slice(0, 3)
                          .map((d) => (
                            <Link
                              key={d.date}
                              href={`/kalendar/${year}/${String(month).padStart(2, '0')}/${String(d.day).padStart(2, '0')}`}
                              className="px-3 py-2 bg-panel text-text border border-border hover:border-primary/40 rounded-lg text-sm transition-colors"
                            >
                              {d.day} {monthName}: {d.summary}
                            </Link>
                          ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Holidays */}
                {dayData.holidays.length > 0 && (
                  <div className="bg-card rounded-2xl border border-border p-6">
                    <h2 className="text-3xl font-bold text-text mb-6">Празници днес</h2>
                    <div className="space-y-4">
                      {dayData.holidays.map((holiday, i) => (
                        <Link
                          key={i}
                          href={`/praznik/${holiday.slug}/${year}`}
                          className="block p-4 bg-panel hover:bg-panel/60 rounded-xl transition-colors"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="text-lg font-semibold text-text mb-1">{holiday.title}</h3>
                              <p className="text-sm text-muted">{holiday.type}</p>
                            </div>
                            {holiday.isOfficial && (
                              <span className="px-3 py-1 bg-critical text-white rounded text-sm font-medium">
                                Неработен
                              </span>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Church Holidays */}
                {dayData.church.length > 0 && (
                  <div className="bg-card rounded-2xl border border-border p-6">
                    <h2 className="text-3xl font-bold text-text mb-6">Църковни празници днес</h2>
                    <div className="space-y-4">
                      {dayData.church.map((holiday, i) => (
                        <div key={i} className="p-4 bg-panel rounded-xl">
                          <div className="flex items-start gap-3 mb-2">
                            <span className="text-warning text-xl">✚</span>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-text">{holiday.title}</h3>
                              {holiday.movable && (
                                <span className="text-xs text-warning">↔ Подвижен</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Link
                      href={dayData.links.orthodoxYear}
                      className="inline-flex items-center gap-2 mt-4 text-primary hover:underline"
                    >
                      Виж църковен календар {year} →
                    </Link>
                  </div>
                )}

                {/* Lunar & Solar */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Lunar */}
                  <div className="bg-card rounded-2xl border border-border p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Moon className="w-8 h-8 text-primary" />
                      <h3 className="text-2xl font-bold text-text">Луна</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted mb-1">Фаза</p>
                        <p className="text-lg font-semibold text-text">{dayData.lunar.phase}</p>
                        <p className="text-xs text-muted">Осветеност: {dayData.lunar.illumination}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted mb-1">Следваща фаза</p>
                        <p className="text-text">{dayData.lunar.nextPhase.phase}</p>
                        <p className="text-xs text-muted">
                          {new Date(dayData.lunar.nextPhase.dateTime).toLocaleDateString('bg-BG', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    <Link
                      href={dayData.links.lunarMonth}
                      className="block mt-4 text-center px-4 h-10 bg-panel text-text border border-border hover:border-primary/40 rounded-lg font-medium transition-colors leading-10"
                    >
                      Лунен календар →
                    </Link>
                  </div>

                  {/* Solar */}
                  <div className="bg-card rounded-2xl border border-border p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Sun className="w-8 h-8 text-primary" />
                      <h3 className="text-2xl font-bold text-text">Слънце</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm text-muted">Град:</span>
                        <select className="px-2 py-1 bg-panel border border-border rounded text-sm">
                          {dayData.solar.availableCities.map((city) => (
                            <option key={city.slug} value={city.slug}>
                              {city.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-muted mb-1">Изгрев</p>
                          <p className="text-lg font-semibold text-text">{dayData.solar.sunrise}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted mb-1">Залез</p>
                          <p className="text-lg font-semibold text-text">{dayData.solar.sunset}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted mb-1">Дължина на деня</p>
                        <p className="text-text font-semibold">{dayData.solar.dayLength}</p>
                      </div>
                    </div>
                    <Link
                      href={dayData.links.solarMonth}
                      className="block mt-4 text-center px-4 h-10 bg-panel text-text border border-border hover:border-primary/40 rounded-lg font-medium transition-colors leading-10"
                    >
                      Слънчев календар →
                    </Link>
                  </div>
                </div>

                {/* Timeline */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h3 className="text-2xl font-bold text-text mb-6">График на деня</h3>
                  <div className="space-y-3">
                    {dayData.timeline.map((item, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <span className="text-2xl">{item.icon}</span>
                        <span className="font-mono text-muted w-16">{item.time}</span>
                        <span className="text-text">{item.event}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <aside className="space-y-6">
                {/* Prev/Next Navigation */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h3 className="text-xl font-bold text-text mb-4">Навигация</h3>
                  <div className="space-y-2">
                    <Link
                      href={dayData.prevNext.prev.url}
                      className="block p-3 bg-panel hover:bg-panel/60 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-2 text-sm text-muted mb-1">
                        <ChevronLeft className="w-4 h-4" />
                        <span>Вчера</span>
                      </div>
                      <p className="text-text font-medium capitalize">{dayData.prevNext.prev.weekday}</p>
                      {dayData.prevNext.prev.summary && (
                        <p className="text-xs text-muted">{dayData.prevNext.prev.summary}</p>
                      )}
                    </Link>
                    <Link
                      href={dayData.prevNext.next.url}
                      className="block p-3 bg-panel hover:bg-panel/60 rounded-lg transition-colors"
                    >
                      <div className="flex items-center justify-between text-sm text-muted mb-1">
                        <span>Утре</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                      <p className="text-text font-medium capitalize">{dayData.prevNext.next.weekday}</p>
                      {dayData.prevNext.next.summary && (
                        <p className="text-xs text-muted">{dayData.prevNext.next.summary}</p>
                      )}
                    </Link>
                  </div>
                </div>

                {/* Upcoming Days */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h3 className="text-xl font-bold text-text mb-4">Следващи 7 дни</h3>
                  <div className="space-y-2">
                    {dayData.nextDays.map((d) => (
                      <Link
                        key={d.date}
                        href={`/kalendar/${year}/${String(month).padStart(2, '0')}/${String(d.day).padStart(2, '0')}`}
                        className="block p-2 hover:bg-panel rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-[#FFF0C8] border border-[#F0C770] rounded-lg flex items-center justify-center font-bold text-[#C95502]">
                            {d.day}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-text capitalize">{d.weekday}</p>
                            {d.summary && (
                              <p className="text-xs text-muted">{d.summary}</p>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Popular This Week */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h3 className="text-xl font-bold text-text mb-4">Популярни тази седмица</h3>
                  <div className="flex flex-wrap gap-2">
                    {dayData.popularThisWeek.map((name) => (
                      <Link
                        key={name.slug}
                        href={`/imen-den/${name.slug}`}
                        className="px-3 py-1.5 bg-[#FFF0C8] text-[#1F1915] border border-[#F0C770] rounded-full text-sm font-medium hover:bg-[#F0C770] transition-colors"
                      >
                        {name.name}
                      </Link>
                    ))}
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
              {dayData.isNonWorking && (
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="text-lg font-semibold text-text mb-3">
                    Защо тази дата е неработна?
                  </h3>
                  <p className="text-sm text-muted-strong">
                    {day} {monthName} е официален празник в България, обявен за неработен ден по решение на Министерския съвет.
                  </p>
                </div>
              )}

              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-text mb-3">
                  Как да добавя ICS в календара си?
                </h3>
                <p className="text-sm text-muted-strong">
                  Кликнете "Добави в календара" и изтеглете ICS файла. Отворете го с Google Calendar, Apple Calendar или друго приложение.
                </p>
              </div>

              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-text mb-3">
                  Как се изчисляват подвижните празници?
                </h3>
                <p className="text-sm text-muted-strong">
                  Подвижните православни празници се изчисляват спрямо Великден, който зависи от лунния календар и пролетното равноденствие.
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
              {dayData.sources.map((source, i) => (
                <a key={i} href={source.url} className="text-primary hover:underline">
                  {source.label}
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

