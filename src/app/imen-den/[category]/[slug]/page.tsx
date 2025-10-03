import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ChevronRight, Calendar, Download, Bell, Copy, Share2, CheckCircle2 } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import Link from 'next/link'

interface NameDate {
  year: number
  date: string
  month: string
  day: number
  dayOfWeek: string
  weekNumber: number
  movable: boolean
  isOfficial: boolean
  isPrimary: boolean
  feastName: string
}

interface Greeting {
  text: string
  tone: 'classic' | 'fun' | 'formal'
}

interface NameDayData {
  slug: string
  name: string
  variants: string[]
  vocative: string
  latin: string
  gender: 'male' | 'female' | 'unisex'
  etymology: string
  saint: {
    title: string
    description: string
    feastSlug: string
    source: string
  }
  dates: NameDate[]
  traditions: string[]
  greetings: Greeting[]
  cards: Array<{ id: string; url: string; alt: string }>
  relatedNames: string[]
  popularity?: {
    rank: number
    total: number
    note: string
  }
  sources: Array<{ label: string; url: string }>
}

interface PageProps {
  params: {
    category: string
    slug: string
  }
}

// Sample data - in production, this would load from JSON files
async function getNameData(slug: string): Promise<NameDayData | null> {
  try {
    const data = await import(`@/data/names/${slug}.json`)
    return data.default
  } catch {
    return null
  }
}

// Get upcoming name days (mock for now)
async function getUpcomingNameDays() {
  return [
    { date: '8 яну', name: 'Георги', slug: 'georgi' },
    { date: '17 яну', name: 'Антон, Антоанета', slug: 'anton' },
    { date: '18 яну', name: 'Атанас, Атанаска', slug: 'atanas' },
    { date: '20 яну', name: 'Евтимий', slug: 'evtimiy' },
    { date: '21 яну', name: 'Максим, Максимилиан', slug: 'maksim' }
  ]
}

// Generate static params
export async function generateStaticParams() {
  // In production, this would scan all name JSON files
  return [
    { category: 'yanuari', slug: 'ivan' },
    { category: 'yuni', slug: 'ivan' },
    // Add more as data is created
  ]
}

// Generate metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const nameData = await getNameData(params.slug)
  if (!nameData) return {}

  const currentYear = new Date().getFullYear()
  const primaryDate = nameData.dates.find(d => d.year === currentYear && d.isPrimary)
  const dateText = primaryDate 
    ? `${primaryDate.day} ${getMonthNameGenitive(primaryDate.month)} ${primaryDate.year}`
    : 'виж дати'

  return {
    title: `Кога е имен ден на ${nameData.name}? ${dateText} | Almanac.bg`,
    description: `Имен ден на ${nameData.name}: ${dateText}. ${nameData.etymology} Вижте традиции, бързи поздрави и картички.`,
    keywords: `${nameData.name}, имен ден ${nameData.name}, ${nameData.variants.join(', ')}, ${dateText}`,
    openGraph: {
      title: `Имен ден на ${nameData.name} — ${dateText}`,
      description: `${nameData.etymology} Виж традиции, поздрави и картички.`,
      type: 'article',
    },
  }
}

// Helper to get month name in genitive case
function getMonthNameGenitive(month: string): string {
  const months: Record<string, string> = {
    'yanuari': 'януари',
    'februari': 'февруари',
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
  return months[month] || month
}

export default async function NameDayPage({ params }: PageProps) {
  const nameData = await getNameData(params.slug)
  if (!nameData) {
    notFound()
  }

  const upcomingDays = await getUpcomingNameDays()
  const currentYear = new Date().getFullYear()
  const primaryDate = nameData.dates.find(d => d.year === currentYear && d.isPrimary)
  const otherDates = nameData.dates.filter(d => d.year === currentYear && !d.isPrimary)
  
  // Get alphabet letter for breadcrumb
  const firstLetter = nameData.name[0].toUpperCase()

  // Dates by year (2025-2030)
  const yearsDates = nameData.dates
    .filter(d => d.year >= 2025 && d.year <= 2030)
    .reduce((acc, d) => {
      if (!acc[d.year]) acc[d.year] = []
      acc[d.year].push(d)
      return acc
    }, {} as Record<number, NameDate[]>)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-bg">
        {/* Hero Section */}
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
              <Link href={`/imen-den/${firstLetter.toLowerCase()}`} className="hover:text-text transition-colors">
                {firstLetter}
              </Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <span className="text-text font-medium">{nameData.name}</span>
            </nav>

            {/* H1 */}
            <div className="flex items-center gap-4 mb-8">
              <Calendar className="w-12 h-12 text-primary flex-shrink-0" />
              <h1 className="text-3xl lg:text-5xl font-bold text-text">
                Кога е имен ден на <span className="text-primary">{nameData.name}</span>?
              </h1>
            </div>

            {/* Answer Panel */}
            <div className="bg-card rounded-2xl shadow-[0_1px_2px_rgba(31,25,21,.08),0_8px_24px_rgba(31,25,21,.06)] p-8 border border-border border-t-[3px] border-t-accent">
              <div className="grid lg:grid-cols-[1fr,auto] gap-8">
                {/* Left: Primary Date */}
                <div>
                  <p className="text-sm font-medium text-muted mb-3">Основна дата за {currentYear}</p>
                  {primaryDate ? (
                    <>
                      <div className="flex items-baseline gap-3 mb-4">
                        <p className="text-5xl lg:text-6xl font-bold text-text">
                          {primaryDate.day}
                        </p>
                        <div>
                          <p className="text-2xl font-semibold text-text capitalize">
                            {getMonthNameGenitive(primaryDate.month)}
                          </p>
                          <p className="text-lg text-muted">{primaryDate.year} г.</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-panel text-muted text-sm rounded-full">
                          {primaryDate.dayOfWeek}
                        </span>
                        <span className="px-3 py-1 bg-panel text-muted text-sm rounded-full">
                          Седмица {primaryDate.weekNumber}
                        </span>
                        {!primaryDate.movable && (
                          <span className="px-3 py-1 bg-success/20 text-success text-sm rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Фиксирана дата
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-strong mb-6">
                        🎉 {primaryDate.feastName}
                      </p>
                    </>
                  ) : (
                    <p className="text-muted">Няма данни за {currentYear} г.</p>
                  )}

                  {/* Other dates this year */}
                  {otherDates.length > 0 && (
                    <div className="pt-4 border-t border-border">
                      <p className="text-sm font-medium text-muted mb-2">
                        Също се празнува на:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {otherDates.map((d, i) => (
                          <span key={i} className="px-3 py-1.5 bg-[#FFF0C8] text-[#1F1915] border border-[#F0C770] rounded-lg text-sm font-medium">
                            {d.day} {getMonthNameGenitive(d.month)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: Actions */}
                <div className="flex flex-col gap-3 lg:min-w-[240px]">
                  <button className="px-5 h-12 bg-primary hover:bg-primary-hover text-white rounded-xl font-semibold transition-colors shadow-sm flex items-center justify-center gap-2 focus:outline focus:outline-3 focus:outline-[#F4BF3A80] focus:outline-offset-2">
                    <Download className="w-4 h-4" />
                    Добави в календара
                  </button>
                  <button className="px-5 h-12 border-2 border-border text-text bg-card hover:bg-panel/60 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 focus:outline focus:outline-3 focus:outline-[#F4BF3A80] focus:outline-offset-2">
                    <Bell className="w-4 h-4" />
                    Напомни ми
                  </button>
                  <Link
                    href="#kartichki"
                    className="px-5 h-12 border-2 border-border text-text bg-card hover:bg-panel/60 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 focus:outline focus:outline-3 focus:outline-[#F4BF3A80] focus:outline-offset-2"
                  >
                    🎨 Картички
                  </Link>
                </div>
              </div>

              {/* Secondary CTA */}
              {primaryDate && (
                <div className="mt-6 pt-6 border-t border-border">
                  <Link
                    href={`/imen-den/${primaryDate.month}`}
                    className="text-primary hover:underline text-sm font-medium inline-flex items-center gap-1"
                  >
                    Виж именните дни през {getMonthNameGenitive(primaryDate.month)} →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Content: Main + Sidebar */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-[1fr,360px] gap-8">
              {/* Main Content */}
              <div className="space-y-8">
                {/* Variants & Linguistics */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h2 className="text-2xl font-bold text-text mb-4">Варианти на името</h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted mb-2">Алтернативни форми:</p>
                      <div className="flex flex-wrap gap-2">
                        {nameData.variants.map((variant) => (
                          <Link
                            key={variant}
                            href={`/imen-den/${variant.toLowerCase()}`}
                            className="px-3 py-1.5 bg-panel text-text border border-border hover:border-primary/40 rounded-lg text-sm transition-colors"
                          >
                            {variant}
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-border">
                      <div>
                        <p className="text-sm font-medium text-muted mb-1">Звателна форма:</p>
                        <p className="text-lg font-semibold text-text">{nameData.vocative}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted mb-1">Латиница:</p>
                        <p className="text-lg font-semibold text-text">{nameData.latin}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Saint & Meaning */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h2 className="text-2xl font-bold text-text mb-4">Светец и значение</h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-soft rounded-xl">
                      <span className="text-2xl">✚</span>
                      <div>
                        <p className="font-semibold text-text mb-1">{nameData.saint.title}</p>
                        <p className="text-sm text-muted-strong">{nameData.saint.description}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted mb-2">Произход и значение:</p>
                      <p className="text-muted-strong leading-relaxed">{nameData.etymology}</p>
                    </div>
                    {nameData.popularity && (
                      <div className="pt-4 border-t border-border">
                        <p className="text-sm text-muted">
                          <span className="font-semibold">Популярност:</span> {nameData.popularity.note}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Traditions */}
                {nameData.traditions.length > 0 && (
                  <div className="bg-card rounded-2xl border border-border p-6">
                    <h2 className="text-2xl font-bold text-text mb-4">Традиции и обичаи</h2>
                    <ul className="space-y-3">
                      {nameData.traditions.map((tradition, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="text-primary mt-1">•</span>
                          <span className="text-muted-strong">{tradition}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Quick Greetings */}
                <div id="pozdravi" className="bg-card rounded-2xl border border-border p-6">
                  <h2 className="text-2xl font-bold text-text mb-4">Бързи поздрави</h2>
                  <p className="text-sm text-muted mb-6">
                    Готови поздравления за копиране — избери тон и копирай с 1 клик
                  </p>
                  
                  {/* Tone filters */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    <button className="px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-medium">
                      Всички
                    </button>
                    <button className="px-3 py-1.5 bg-panel text-text border border-border hover:border-primary/40 rounded-lg text-sm font-medium transition-colors">
                      Класически
                    </button>
                    <button className="px-3 py-1.5 bg-panel text-text border border-border hover:border-primary/40 rounded-lg text-sm font-medium transition-colors">
                      Забавни
                    </button>
                    <button className="px-3 py-1.5 bg-panel text-text border border-border hover:border-primary/40 rounded-lg text-sm font-medium transition-colors">
                      Официални
                    </button>
                  </div>

                  {/* Greetings list */}
                  <div className="space-y-3">
                    {nameData.greetings.map((greeting, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-4 bg-panel/60 rounded-xl border border-border hover:border-primary/40 transition-colors group"
                      >
                        <p className="flex-1 text-text">
                          {greeting.text.replace('{{name_voc}}', nameData.vocative).replace('{{name}}', nameData.name)}
                        </p>
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

                {/* Greeting Cards */}
                <div id="kartichki" className="bg-card rounded-2xl border border-border p-6">
                  <h2 className="text-2xl font-bold text-text mb-4">Картички за имен ден</h2>
                  <p className="text-sm text-muted mb-6">
                    Красиви картички, готови за изтегляне и споделяне
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {nameData.cards.map((card) => (
                      <div
                        key={card.id}
                        className="aspect-[4/3] bg-panel rounded-xl border border-border overflow-hidden group relative"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                          <p className="text-4xl font-bold text-text opacity-50">{nameData.name}</p>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex gap-2">
                            <button className="flex-1 px-3 py-2 bg-white text-text rounded-lg text-sm font-medium hover:bg-white/90 transition-colors flex items-center justify-center gap-1">
                              <Download className="w-3 h-3" />
                              Изтегли
                            </button>
                            <button className="px-3 py-2 bg-white text-text rounded-lg hover:bg-white/90 transition-colors">
                              <Share2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dates by Year */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h2 className="text-2xl font-bold text-text mb-4">
                    Дати на {nameData.name} по години
                  </h2>
                  <p className="text-sm text-muted mb-6">
                    Планирайте напред — вижте датите за следващите години
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 text-sm font-semibold text-text">Година</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-text">Дата</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-text">Ден</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-text">Празник</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(yearsDates).map(([year, dates]) =>
                          dates.map((d, i) => (
                            <tr key={`${year}-${i}`} className="border-b border-border hover:bg-panel/30 transition-colors">
                              <td className="py-3 px-4 text-text font-medium">{year}</td>
                              <td className="py-3 px-4 text-text">
                                {d.day} {getMonthNameGenitive(d.month)}
                              </td>
                              <td className="py-3 px-4 text-muted">{d.dayOfWeek}</td>
                              <td className="py-3 px-4 text-sm text-muted-strong">{d.feastName}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-6">
                    <button className="w-full sm:w-auto px-5 h-12 bg-panel text-text rounded-xl font-semibold border border-border hover:border-primary/40 transition-colors flex items-center justify-center gap-2 mx-auto">
                      <Download className="w-4 h-4" />
                      Свали ICS за 2025–2030
                    </button>
                  </div>
                </div>

                {/* FAQ */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h2 className="text-2xl font-bold text-text mb-6">Често задавани въпроси</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-text mb-2">
                        Защо {nameData.name} има няколко дати?
                      </h3>
                      <p className="text-sm text-muted-strong">
                        В православния календар има няколко празника, посветени на светци с това име. 
                        Най-често се празнува основната дата, но можете да изберете коя да отбелязвате.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-text mb-2">
                        Как да добавя в Google Calendar?
                      </h3>
                      <p className="text-sm text-muted-strong">
                        Кликнете бутона "Добави в календара" и изтеглете ICS файла. 
                        След това го отворете с Google Calendar или друго календарно приложение.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-text mb-2">
                        Какво е звателна форма (вокатив)?
                      </h3>
                      <p className="text-sm text-muted-strong">
                        Звателната форма се използва, когато се обръщаме директно към човека. 
                        Например: "Честит имен ден, {nameData.vocative}!"
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-text mb-2">
                        Откъде са датите?
                      </h3>
                      <p className="text-sm text-muted-strong">
                        Датите следват официалния православен календар на Българската православна църква (БПЦ).
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sources */}
                <div className="bg-soft border border-border rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-text mb-3">Източници</h3>
                  <div className="flex flex-wrap gap-2">
                    {nameData.sources.map((source, i) => (
                      <a
                        key={i}
                        href={source.url}
                        className="text-sm text-primary hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {source.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <aside className="space-y-6">
                {/* Upcoming Name Days */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h3 className="text-lg font-semibold text-text mb-4">Наближаващи</h3>
                  <div className="space-y-2">
                    {upcomingDays.map((day) => (
                      <Link
                        key={day.slug}
                        href={`/imen-den/${day.slug}`}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-panel transition-colors"
                      >
                        <div className="w-12 h-12 bg-[#FFF0C8] border border-[#F0C770] rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-[#C95502] font-bold text-sm">{day.date}</span>
                        </div>
                        <p className="text-sm font-medium text-text">{day.name}</p>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Related Names */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h3 className="text-lg font-semibold text-text mb-4">Сродни имена</h3>
                  <div className="flex flex-wrap gap-2">
                    {nameData.relatedNames.map((name) => (
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
                {primaryDate && (
                  <div className="bg-card rounded-2xl border border-border p-6">
                    <h3 className="text-lg font-semibold text-text mb-4">Навигация</h3>
                    <div className="space-y-2">
                      <Link
                        href={`/imen-den/${primaryDate.month}`}
                        className="block px-4 py-2 bg-panel rounded-lg hover:bg-panel/60 transition-colors text-sm"
                      >
                        Именни дни през {getMonthNameGenitive(primaryDate.month)}
                      </Link>
                      <Link
                        href={`/kalendar/${primaryDate.year}/${primaryDate.month.slice(0, 2)}/${String(primaryDate.day).padStart(2, '0')}`}
                        className="block px-4 py-2 bg-panel rounded-lg hover:bg-panel/60 transition-colors text-sm"
                      >
                        Какво има на {primaryDate.day} {getMonthNameGenitive(primaryDate.month)}
                      </Link>
                    </div>
                  </div>
                )}
              </aside>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
