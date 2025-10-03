import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ChevronRight, Calendar, Download, Bell, Share2, Info } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import Link from 'next/link'

interface HolidayDate {
  year: number
  date: string
  month: string
  day: number
  dayOfWeek: string
  weekNumber: number
  movable: boolean
  isOfficial: boolean
  movableFormula?: string
}

interface Tradition {
  title: string
  description: string
}

interface HolidayData {
  slug: string
  title: string
  shortTitle: string
  alternativeNames: string[]
  type: 'religious' | 'national' | 'professional' | 'foreign'
  icon: string
  description: string
  history: string
  significance: string
  dates: HolidayDate[]
  traditions: Tradition[]
  symbols: string[]
  relatedHolidays: Array<{ title: string; slug: string; date: string }>
  observedBy?: string
  sources: Array<{ label: string; url: string }>
}

interface PageProps {
  params: {
    category: string
    slug: string
  }
}

// Load holiday data
async function getHolidayData(slug: string): Promise<HolidayData | null> {
  try {
    const data = await import(`@/data/holidays/${slug}.json`)
    return data.default
  } catch {
    return null
  }
}

// Get upcoming holidays (mock for now)
async function getUpcomingHolidays() {
  return [
    { date: '1 ноем', title: 'Ден на народните будители', slug: 'den-na-narodnite-buditeli', icon: '🏛️' },
    { date: '8 ноем', title: 'Архангеловден', slug: 'arhangelovden', icon: '⛪' },
    { date: '21 ноем', title: 'Въведение Богородично', slug: 'vavedenie-bogorodichno', icon: '⛪' },
    { date: '6 дек', title: 'Никулден', slug: 'nikulden', icon: '⛪' },
    { date: '24 дек', title: 'Бъдни вечер', slug: 'badni-vecher', icon: '⛪' }
  ]
}

// Generate static params
export async function generateStaticParams() {
  // In production, this would scan all holiday JSON files
  return [
    { category: 'tsarkoven', slug: 'velikden' },
    { category: 'natsionalen', slug: 'osvobozdenie-na-bulgaria' },
    // Add more as data is created
  ]
}

// Generate metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const holidayData = await getHolidayData(params.slug)
  if (!holidayData) return {}

  const currentYear = new Date().getFullYear()
  const currentYearDate = holidayData.dates.find(d => d.year === currentYear)
  const dateText = currentYearDate 
    ? `${currentYearDate.day} ${getMonthNameGenitive(currentYearDate.month)} ${currentYearDate.year}`
    : 'виж дати'

  return {
    title: `${holidayData.title} ${currentYear} — ${dateText} | Almanac.bg`,
    description: `${holidayData.title}: ${dateText}. ${holidayData.description}`,
    keywords: `${holidayData.title}, ${holidayData.alternativeNames.join(', ')}, празник, ${dateText}`,
    openGraph: {
      title: `${holidayData.title} — ${dateText}`,
      description: holidayData.description,
      type: 'article',
    },
  }
}

// Helper to get month name
function getMonthNameGenitive(month: string): string {
  const months: Record<string, string> = {
    'yanuari': 'януари', 'februari': 'февруари', 'mart': 'март',
    'april': 'април', 'may': 'май', 'yuni': 'юни',
    'yuli': 'юли', 'avgust': 'август', 'septemvri': 'септември',
    'oktomvri': 'октомври', 'noemvri': 'ноември', 'dekemvri': 'декември'
  }
  return months[month] || month
}

export default async function HolidayDetailPage({ params }: PageProps) {
  const holidayData = await getHolidayData(params.slug)
  if (!holidayData) {
    notFound()
  }

  const upcomingHolidays = await getUpcomingHolidays()
  const currentYear = new Date().getFullYear()
  const currentYearDate = holidayData.dates.find(d => d.year === currentYear)
  
  // Dates by year (2025-2030)
  const yearsDates = holidayData.dates.filter(d => d.year >= 2025 && d.year <= 2030)

  // Type label
  const typeLabels: Record<string, string> = {
    'religious': 'Православен празник',
    'national': 'Национален празник',
    'professional': 'Професионален ден',
    'foreign': 'Чуждестранен празник'
  }

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
              <Link href="/praznik" className="hover:text-text transition-colors">
                Празници
              </Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <Link href={`/praznik/${params.category}`} className="hover:text-text transition-colors capitalize">
                {params.category.replace('tsarkoven', 'църковни').replace('natsionalen', 'национални')}
              </Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <span className="text-text font-medium">{holidayData.shortTitle}</span>
            </nav>

            {/* Type badge */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">{holidayData.icon}</span>
              <span className="px-3 py-1 bg-panel text-muted text-sm rounded-full border border-border">
                {typeLabels[holidayData.type]}
              </span>
            </div>

            {/* H1 */}
            <h1 className="text-3xl lg:text-5xl font-bold text-text mb-8">
              {holidayData.title}
            </h1>

            {/* Answer Panel */}
            <div className="bg-card rounded-2xl shadow-[0_1px_2px_rgba(31,25,21,.08),0_8px_24px_rgba(31,25,21,.06)] p-8 border border-border border-t-[3px] border-t-accent">
              <div className="grid lg:grid-cols-[1fr,auto] gap-8">
                {/* Left: Date Info */}
                <div>
                  <p className="text-sm font-medium text-muted mb-3">Дата за {currentYear}</p>
                  {currentYearDate ? (
                    <>
                      <div className="flex items-baseline gap-3 mb-4">
                        <p className="text-5xl lg:text-6xl font-bold text-text">
                          {currentYearDate.day}
                        </p>
                        <div>
                          <p className="text-2xl font-semibold text-text capitalize">
                            {getMonthNameGenitive(currentYearDate.month)}
                          </p>
                          <p className="text-lg text-muted">{currentYearDate.year} г.</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-panel text-muted text-sm rounded-full">
                          {currentYearDate.dayOfWeek}
                        </span>
                        <span className="px-3 py-1 bg-panel text-muted text-sm rounded-full">
                          Седмица {currentYearDate.weekNumber}
                        </span>
                        {currentYearDate.isOfficial && (
                          <span className="px-3 py-1 bg-critical text-white text-sm rounded-full font-medium">
                            Неработен ден
                          </span>
                        )}
                        {currentYearDate.movable ? (
                          <span className="px-3 py-1 bg-warning/20 text-warning text-sm rounded-full flex items-center gap-1">
                            ↔ Подвижна дата
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-success/20 text-success text-sm rounded-full">
                            Фиксирана дата
                          </span>
                        )}
                      </div>
                      {currentYearDate.movable && currentYearDate.movableFormula && (
                        <div className="flex items-start gap-2 p-3 bg-soft rounded-lg">
                          <Info className="w-4 h-4 text-muted flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-muted-strong">
                            {currentYearDate.movableFormula}
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-muted">Няма данни за {currentYear} г.</p>
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
                  <button className="px-5 h-12 border-2 border-border text-text bg-card hover:bg-panel/60 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 focus:outline focus:outline-3 focus:outline-[#F4BF3A80] focus:outline-offset-2">
                    <Share2 className="w-4 h-4" />
                    Сподели
                  </button>
                </div>
              </div>

              {/* Alternative names */}
              {holidayData.alternativeNames.length > 0 && (
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-sm font-medium text-muted mb-2">Известен още като:</p>
                  <div className="flex flex-wrap gap-2">
                    {holidayData.alternativeNames.map((name) => (
                      <span
                        key={name}
                        className="px-3 py-1 bg-panel text-text text-sm rounded-full border border-border"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
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
                {/* Description */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h2 className="text-2xl font-bold text-text mb-4">Описание</h2>
                  <p className="text-muted-strong leading-relaxed mb-4">
                    {holidayData.description}
                  </p>
                  {holidayData.observedBy && (
                    <p className="text-sm text-muted">
                      <span className="font-semibold">Отбелязва се от:</span> {holidayData.observedBy}
                    </p>
                  )}
                </div>

                {/* History & Significance */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h2 className="text-2xl font-bold text-text mb-4">История и значение</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-text mb-2">История</h3>
                      <p className="text-muted-strong leading-relaxed">
                        {holidayData.history}
                      </p>
                    </div>
                    <div className="pt-4 border-t border-border">
                      <h3 className="text-lg font-semibold text-text mb-2">Значение</h3>
                      <p className="text-muted-strong leading-relaxed">
                        {holidayData.significance}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Traditions */}
                {holidayData.traditions.length > 0 && (
                  <div className="bg-card rounded-2xl border border-border p-6">
                    <h2 className="text-2xl font-bold text-text mb-4">Традиции и обичаи</h2>
                    <div className="space-y-4">
                      {holidayData.traditions.map((tradition, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <span className="text-primary text-xl flex-shrink-0 mt-1">•</span>
                          <div>
                            <p className="font-semibold text-text mb-1">{tradition.title}</p>
                            <p className="text-sm text-muted-strong">{tradition.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Symbols */}
                {holidayData.symbols.length > 0 && (
                  <div className="bg-card rounded-2xl border border-border p-6">
                    <h2 className="text-2xl font-bold text-text mb-4">Символи</h2>
                    <div className="flex flex-wrap gap-3">
                      {holidayData.symbols.map((symbol) => (
                        <span
                          key={symbol}
                          className="px-4 py-2 bg-[#FFF0C8] text-[#1F1915] border border-[#F0C770] rounded-lg font-medium"
                        >
                          {symbol}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dates by Year */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h2 className="text-2xl font-bold text-text mb-4">
                    Дати на {holidayData.shortTitle} по години
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
                          <th className="text-left py-3 px-4 text-sm font-semibold text-text">Статус</th>
                        </tr>
                      </thead>
                      <tbody>
                        {yearsDates.map((d, i) => (
                          <tr key={i} className="border-b border-border hover:bg-panel/30 transition-colors">
                            <td className="py-3 px-4 text-text font-medium">{d.year}</td>
                            <td className="py-3 px-4 text-text">
                              {d.day} {getMonthNameGenitive(d.month)}
                            </td>
                            <td className="py-3 px-4 text-muted">{d.dayOfWeek}</td>
                            <td className="py-3 px-4">
                              {d.isOfficial && (
                                <span className="px-2 py-0.5 bg-critical text-white text-xs rounded">
                                  Неработен
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
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
                        {currentYearDate?.isOfficial ? 'Работи ли се?' : 'Работен ли е денят?'}
                      </h3>
                      <p className="text-sm text-muted-strong">
                        {currentYearDate?.isOfficial 
                          ? `${holidayData.title} е официален неработен ден в България. Повечето институции и предприятия не работят.`
                          : `${holidayData.title} е работен ден, но се отбелязва с различни традиции и чествания.`
                        }
                      </p>
                    </div>
                    {currentYearDate?.movable && (
                      <div>
                        <h3 className="text-lg font-semibold text-text mb-2">
                          Защо датата варира всяка година?
                        </h3>
                        <p className="text-sm text-muted-strong">
                          {holidayData.title} е подвижен празник, чиято дата зависи от православния календар и датата на Великден.
                        </p>
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-text mb-2">
                        Как да добавя в календара?
                      </h3>
                      <p className="text-sm text-muted-strong">
                        Кликнете бутона "Добави в календара" и изтеглете ICS файла. 
                        След това го отворете с Google Calendar, Apple Calendar или друго приложение.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-text mb-2">
                        Откъде са данните?
                      </h3>
                      <p className="text-sm text-muted-strong">
                        Датите следват официалния календар на Българската православна църква (БПЦ) 
                        и решенията на Министерския съвет за неработните дни.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sources */}
                <div className="bg-soft border border-border rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-text mb-3">Източници</h3>
                  <div className="flex flex-wrap gap-2">
                    {holidayData.sources.map((source, i) => (
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
                {/* Upcoming Holidays */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h3 className="text-lg font-semibold text-text mb-4">Наближаващи празници</h3>
                  <div className="space-y-2">
                    {upcomingHolidays.map((holiday) => (
                      <Link
                        key={holiday.slug}
                        href={`/praznik/${holiday.slug}/${currentYear}`}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-panel transition-colors"
                      >
                        <div className="w-12 h-12 bg-[#FFF0C8] border border-[#F0C770] rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-xl">{holiday.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text">{holiday.title}</p>
                          <p className="text-xs text-muted">{holiday.date}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Related Holidays */}
                {holidayData.relatedHolidays.length > 0 && (
                  <div className="bg-card rounded-2xl border border-border p-6">
                    <h3 className="text-lg font-semibold text-text mb-4">Свързани празници</h3>
                    <div className="space-y-2">
                      {holidayData.relatedHolidays.map((holiday) => (
                        <Link
                          key={holiday.slug}
                          href={`/praznik/${holiday.slug}/${currentYear}`}
                          className="block px-3 py-2 bg-panel rounded-lg hover:bg-panel/60 transition-colors"
                        >
                          <p className="text-sm font-medium text-text">{holiday.title}</p>
                          <p className="text-xs text-muted">{holiday.date}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Navigation */}
                {currentYearDate && (
                  <div className="bg-card rounded-2xl border border-border p-6">
                    <h3 className="text-lg font-semibold text-text mb-4">Навигация</h3>
                    <div className="space-y-2">
                      <Link
                        href={`/praznik/${params.category}?year=${currentYear}`}
                        className="block px-4 py-2 bg-panel rounded-lg hover:bg-panel/60 transition-colors text-sm"
                      >
                        Всички празници {currentYear}
                      </Link>
                      <Link
                        href={`/kalendar/${currentYearDate.year}/${currentYearDate.month.slice(0, 2)}/${String(currentYearDate.day).padStart(2, '0')}`}
                        className="block px-4 py-2 bg-panel rounded-lg hover:bg-panel/60 transition-colors text-sm"
                      >
                        Календар за {currentYearDate.day} {getMonthNameGenitive(currentYearDate.month)}
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
