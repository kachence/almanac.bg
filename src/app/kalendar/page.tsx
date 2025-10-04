import { Metadata } from 'next'
import { ChevronRight, Calendar, Download, Printer, Bell, Search, Moon, Sun, CheckCircle2 } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import Link from 'next/link'

// Calendar families/types
const CALENDAR_FAMILIES = [
  {
    id: 'tsarkoven',
    title: 'Църковен календар',
    icon: '⛪',
    description: 'Господски и Богородични празници, подвижни дати, неработни дни',
    slug: 'tsarkoven',
    years: [2025, 2026, 2027],
    meta: 'БПЦ календар'
  },
  {
    id: 'lunen',
    title: 'Лунен календар',
    icon: '🌙',
    description: 'Фази на луната по дни и часове; ICS/CSV export',
    slug: 'lunen',
    years: [2025, 2026, 2027],
    meta: 'Астрономически данни'
  },
  {
    id: 'slanchev',
    title: 'Слънчев календар',
    icon: '☀',
    description: 'Изгрев и залез на слънцето; дължина на деня',
    slug: 'slanchev',
    years: [2025, 2026, 2027],
    cities: ['София', 'Пловдив', 'Варна', 'Бургас'],
    meta: 'По градове'
  },
  {
    id: 'formula1',
    title: 'Формула 1',
    icon: '🏎',
    description: 'Гран При (BG час), квалификации, тв канали',
    slug: 'formula1',
    years: [2025, 2026],
    meta: 'Международен календар'
  },
  {
    id: 'kitayski',
    title: 'Китайски календар',
    icon: '🐉',
    description: 'Зодия по години + 5 елемента; калкулатор',
    slug: 'kitayski',
    years: [2025, 2026, 2027],
    meta: 'Лунно-слънчев'
  },
  {
    id: 'ovulatsionen',
    title: 'Овулационен календар',
    icon: '♀',
    description: 'Калкулатор + образователни статии',
    slug: 'ovulatsionen',
    years: [2025, 2026],
    meta: 'Здравен калкулатор'
  }
]

const MONTHS = [
  { name: 'Януари', slug: '01', short: 'яну' },
  { name: 'Февруари', slug: '02', short: 'фев' },
  { name: 'Март', slug: '03', short: 'мар' },
  { name: 'Април', slug: '04', short: 'апр' },
  { name: 'Май', slug: '05', short: 'май' },
  { name: 'Юни', slug: '06', short: 'юни' },
  { name: 'Юли', slug: '07', short: 'юли' },
  { name: 'Август', slug: '08', short: 'авг' },
  { name: 'Септември', slug: '09', short: 'сеп' },
  { name: 'Октомври', slug: '10', short: 'окт' },
  { name: 'Ноември', slug: '11', short: 'ноем' },
  { name: 'Декември', slug: '12', short: 'дек' }
]

// Mock today's data (in production, this would be computed server-side)
const todayData = {
  date: 'петък, 3 октомври 2025',
  day: 3,
  month: 10,
  year: 2025,
  nameDays: ['Денис', 'Денислав', 'Денислава'],
  holidays: [],
  moonPhase: 'Растяща луна',
  sunrise: '07:12',
  sunset: '18:45'
}

// Generate metadata
export const metadata: Metadata = {
  title: 'Календари за България 2025-2027 | Almanac.bg',
  description: 'Всички календари на едно място: стандартен, църковен, лунен, слънчев, Формула 1, китайски и овулационен. Виж неработни дни, празници, имени дни.',
  keywords: 'календар 2025, календар 2026, църковен календар, лунен календар, слънчев календар, неработни дни, празници България',
  openGraph: {
    title: 'Календари за България',
    description: 'Всички календари на едно място — стандартен, църковен, лунен, слънчев и специализирани.',
    type: 'website',
  },
}

export default function KalendarHubPage() {
  const currentYear = 2025
  const currentMonth = 10
  const standardYears = [2024, 2025, 2026, 2027, 2028]

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
              <span className="text-text font-medium">Календар</span>
            </nav>

            {/* H1 */}
            <div className="flex items-center gap-4 mb-4">
              <Calendar className="w-10 h-10 text-primary" />
              <h1 className="text-4xl lg:text-5xl font-bold text-text">
                Календари за България
              </h1>
            </div>

            {/* Intro */}
            <p className="text-lg text-muted-strong max-w-3xl">
              Всички видове календари на едно място — от стандартни до специализирани. 
              Данните са от БПЦ, Министерски съвет и астрономически бази.
            </p>
          </div>
        </section>

        {/* "Днес" Summary Card */}
        <section className="py-6 px-4 bg-panel/30 border-b border-border">
          <div className="max-w-7xl mx-auto">
            <div className="bg-card rounded-2xl shadow-[0_1px_2px_rgba(31,25,21,.08),0_8px_24px_rgba(31,25,21,.06)] p-6 border border-border">
              <div className="grid lg:grid-cols-[1fr,auto] gap-6">
                {/* Left: Date Info */}
                <div>
                  <p className="text-sm font-medium text-muted mb-2">Днес</p>
                  <p className="text-2xl font-bold text-text mb-4">{todayData.date}</p>
                  
                  <div className="space-y-3">
                    {/* Name days */}
                    {todayData.nameDays.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted mb-1">Имен ден:</p>
                        <div className="flex flex-wrap gap-2">
                          {todayData.nameDays.map((name) => (
                            <span
                              key={name}
                              className="px-3 py-1 bg-[#FFF0C8] text-[#1F1915] border border-[#F0C770] rounded-full text-sm font-medium"
                            >
                              {name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Holidays */}
                    {todayData.holidays.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted mb-1">Празници:</p>
                        <div className="flex flex-wrap gap-2">
                          {todayData.holidays.map((holiday: any) => (
                            <span
                              key={holiday}
                              className="px-3 py-1 bg-critical text-white rounded-full text-sm font-medium"
                            >
                              {holiday}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Astronomical info */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-strong">
                      <div className="flex items-center gap-2">
                        <Moon className="w-4 h-4" />
                        <span>{todayData.moonPhase}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Sun className="w-4 h-4" />
                        <span>↑ {todayData.sunrise}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Sun className="w-4 h-4" />
                        <span>↓ {todayData.sunset}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: CTA */}
                <div className="flex items-center">
                  <Link
                    href={`/kalendar/${todayData.year}/${String(todayData.month).padStart(2, '0')}/${String(todayData.day).padStart(2, '0')}`}
                    className="px-6 h-12 bg-primary hover:bg-primary-hover text-white rounded-xl font-semibold transition-colors flex items-center gap-2 whitespace-nowrap"
                  >
                    Виж днес →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Search & Filters */}
        <section className="py-4 px-4 bg-bg border-b border-border sticky top-0 z-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="text"
                  placeholder="Търси календар... (напр. 2026, лунен, православен)"
                  className="w-full h-12 pl-10 pr-4 bg-card border border-border rounded-xl text-text placeholder:text-muted focus:outline focus:outline-2 focus:outline-primary/40"
                />
              </div>

              {/* Type chips */}
              <div className="flex flex-wrap gap-2">
                <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium">
                  Всички
                </button>
                <button className="px-4 py-2 bg-card text-text border border-border hover:border-primary/40 rounded-lg text-sm font-medium transition-colors">
                  Стандартен
                </button>
                <button className="px-4 py-2 bg-card text-text border border-border hover:border-primary/40 rounded-lg text-sm font-medium transition-colors">
                  Специални
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Primary Grid: Standard Calendars */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-text mb-6">Стандартни календари</h2>
            <p className="text-muted mb-8">Календари по години с неработни дни, празници и имени дни</p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {standardYears.map((year) => (
                <div
                  key={year}
                  className="bg-card rounded-2xl border border-border p-6 hover:border-primary/40 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-text">Календар {year}</h3>
                    {year === currentYear && (
                      <span className="px-2 py-1 bg-accent/20 text-accent text-xs rounded font-medium">
                        Текуща
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 mb-6 text-sm text-muted-strong">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                      <span>12 неработни дни</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted" />
                      <span>365 именни дни</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-base">⛪</span>
                      <span>25+ празника</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Link
                      href={`/kalendar/${year}`}
                      className="block w-full h-10 px-4 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors text-center leading-10"
                    >
                      Виж годината →
                    </Link>
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href={`/kalendar/${year}/${String(currentMonth).padStart(2, '0')}`}
                        className="h-10 px-3 bg-panel text-text border border-border hover:border-primary/40 rounded-lg text-sm font-medium transition-colors text-center leading-10"
                      >
                        Октомври
                      </Link>
                      <button className="h-10 px-3 bg-panel text-text border border-border hover:border-primary/40 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1">
                        <Download className="w-3 h-3" />
                        ICS
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <Link
                href="/kalendar/archive"
                className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
              >
                Всички години (2020–2030) →
              </Link>
            </div>
          </div>
        </section>

        {/* Special Calendars */}
        <section className="py-12 px-4 bg-panel/30">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-text mb-6">Специални календари</h2>
            <p className="text-muted mb-8">Специализирани календари за различни нужди</p>
            
            <div className="grid md:grid-cols-2 gap-6">
              {CALENDAR_FAMILIES.map((family) => (
                <div
                  key={family.id}
                  className="bg-card rounded-2xl border border-border p-6 hover:border-primary/40 hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <span className="text-4xl">{family.icon}</span>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-text mb-1">{family.title}</h3>
                      <p className="text-sm text-muted-strong">{family.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4 text-xs text-muted">
                    <span className="px-2 py-1 bg-panel rounded">{family.meta}</span>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs font-medium text-muted mb-2">Години:</p>
                    <div className="flex flex-wrap gap-2">
                      {family.years.map((year) => (
                        <Link
                          key={year}
                          href={`/kalendar/${family.slug}/${year}`}
                          className="px-3 py-1.5 bg-panel text-text border border-border hover:border-primary/40 rounded-lg text-sm font-medium transition-colors"
                        >
                          {year}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {family.cities && (
                    <div>
                      <p className="text-xs font-medium text-muted mb-2">Градове:</p>
                      <div className="flex flex-wrap gap-2">
                        {family.cities.slice(0, 3).map((city) => (
                          <span
                            key={city}
                            className="px-2 py-1 bg-soft text-muted text-xs rounded"
                          >
                            {city}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Month Shortcuts */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-text mb-6">Месец по месец — {currentYear}</h2>
            <p className="text-muted mb-8">Бърз достъп до всеки месец</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {MONTHS.map((month) => (
                <Link
                  key={month.slug}
                  href={`/kalendar/${currentYear}/${month.slug}`}
                  className={`
                    h-16 flex items-center justify-center rounded-xl font-semibold transition-all
                    ${month.slug === String(currentMonth).padStart(2, '0')
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-card text-text border border-border hover:border-primary/40 hover:shadow-sm'
                    }
                  `}
                >
                  {month.name}
                </Link>
              ))}
            </div>

            <div className="mt-6 text-center">
              <Link
                href={`/kalendar/${currentYear + 1}`}
                className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
              >
                Виж {currentYear + 1} по месеци →
              </Link>
            </div>
          </div>
        </section>

        {/* Utilities */}
        <section className="py-12 px-4 bg-panel/30">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-text mb-6">Бързи действия</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-card rounded-2xl border border-border p-6">
                <Download className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold text-text mb-2">Свали календари</h3>
                <p className="text-sm text-muted mb-4">
                  Изтегли неработни дни {currentYear} като ICS файл за календара си
                </p>
                <button className="w-full h-10 px-4 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors">
                  Свали ICS
                </button>
              </div>

              <div className="bg-card rounded-2xl border border-border p-6">
                <Printer className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold text-text mb-2">Разпечатай</h3>
                <p className="text-sm text-muted mb-4">
                  Разпечатай календар {currentYear} като PDF с празници
                </p>
                <button className="w-full h-10 px-4 bg-panel text-text border border-border hover:border-primary/40 rounded-lg font-medium transition-colors">
                  Генерирай PDF
                </button>
              </div>

              <div className="bg-card rounded-2xl border border-border p-6">
                <Bell className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold text-text mb-2">Напомняния</h3>
                <p className="text-sm text-muted mb-4">
                  Получавай напомняния за официални празници по имейл
                </p>
                <button className="w-full h-10 px-4 bg-panel text-text border border-border hover:border-primary/40 rounded-lg font-medium transition-colors">
                  Абонирай се
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-text mb-6">Често задавани въпроси</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-text mb-3">
                  Как се изчислява Великден?
                </h3>
                <p className="text-sm text-muted-strong">
                  Великден се изчислява по Александрийската пасхалия — винаги е в първата неделя след пълнолунието, 
                  което настъпва след или на пролетното равноденствие (21 март). Датата варира между 4 април и 8 май.
                </p>
              </div>

              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-text mb-3">
                  Кои са неработните дни през {currentYear}?
                </h3>
                <p className="text-sm text-muted-strong">
                  България има 12 официални неработни дни: Нова година, Освобождението (3 март), Великден, 
                  Гергьовден, Ден на труда (1 май), 24 май, Съединението, Независимостта и Коледа (24-26 декември).
                </p>
              </div>

              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-text mb-3">
                  Каква е разликата между лунен и слънчев календар?
                </h3>
                <p className="text-sm text-muted-strong">
                  Лунният календар следи фазите на луната (пълнолуние, новолуние и др.), 
                  докато слънчевият показва изгрев и залез на слънцето за конкретно място. 
                  Стандартният календар е слънчев (365 дни), но лунните фази влияят на много традиции.
                </p>
              </div>

              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-text mb-3">
                  Как да добавя ICS в Google Calendar?
                </h3>
                <p className="text-sm text-muted-strong">
                  Изтеглете ICS файла, отворете Google Calendar, кликнете на "+" до "Други календари", 
                  изберете "Импортиране" и качете файла. Всички събития ще се добавят автоматично.
                </p>
              </div>

              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-text mb-3">
                  Защо календарът на БПЦ се различава от гражданския?
                </h3>
                <p className="text-sm text-muted-strong">
                  Българската православна църква следва Юлианския календар (стар стил), който се различава с 13 дни 
                  от Грегорианския (граждански). Някои празници като Коледа се празнуват на различни дати.
                </p>
              </div>

              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-text mb-3">
                  Мога ли да разпечатам календара?
                </h3>
                <p className="text-sm text-muted-strong">
                  Да! Използвайте бутона "Генерирай PDF" за да създадете версия за печат. 
                  Тя включва всички празници, имени дни и може да се персонализира по месеци.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Sources */}
        <section className="py-12 px-4 bg-soft border-t border-border">
          <div className="max-w-7xl mx-auto">
            <h3 className="text-2xl font-bold text-text mb-4">Източници на данни</h3>
            <div className="flex flex-wrap gap-4">
              <a href="#" className="text-sm text-primary hover:underline">
                БПЦ официален календар
              </a>
              <span className="text-muted">•</span>
              <a href="#" className="text-sm text-primary hover:underline">
                Министерски съвет (неработни дни)
              </a>
              <span className="text-muted">•</span>
              <a href="#" className="text-sm text-primary hover:underline">
                NASA (астрономически данни)
              </a>
              <span className="text-muted">•</span>
              <a href="#" className="text-sm text-primary hover:underline">
                FIA Formula 1
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

