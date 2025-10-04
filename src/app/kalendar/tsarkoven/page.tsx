import { Metadata } from 'next'
import { ChevronRight, Church, Calendar } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Църковен календар | Almanac.bg',
  description: 'Православен църковен календар с всички празници, подвижни дати и неработни дни за България.',
  keywords: 'църковен календар, православни празници, България, БПЦ',
}

export default function ChurchCalendarHubPage() {
  const currentYear = new Date().getFullYear()
  const years = [currentYear - 1, currentYear, currentYear + 1, currentYear + 2]

  // Sample upcoming events (would be dynamically loaded)
  const upcomingEvents = [
    { date: '2025-01-01', title: 'Нова година, Васильовден', nonWorking: true },
    { date: '2025-01-06', title: 'Богоявление (Йордановден)', nonWorking: true },
    { date: '2025-01-17', title: 'Св. Антоний Велики', nonWorking: false },
    { date: '2025-02-02', title: 'Сретение Господне', nonWorking: false },
    { date: '2025-02-10', title: 'Св. Харалампий', nonWorking: false },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen bg-bg">
        {/* Header */}
        <section className="py-12 px-4 border-b border-border">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumbs */}
            <nav className="flex items-center text-sm text-muted mb-6" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-text transition-colors">Начало</Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <Link href="/kalendar" className="hover:text-text transition-colors">Календар</Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <span className="text-text font-medium">Църковен</span>
            </nav>

            {/* H1 */}
            <div className="flex items-center gap-4 mb-6">
              <Church className="w-12 h-12 text-primary" />
              <h1 className="text-5xl lg:text-6xl font-bold text-text">
                Църковен календар
              </h1>
            </div>

            {/* Intro */}
            <p className="text-xl text-muted-strong max-w-3xl">
              Православен църковен календар с всички големи и малки празници, подвижни дати, неработни дни и традиции според Българската православна църква.
            </p>
          </div>
        </section>

        {/* Years Grid */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-text mb-8">Изберете година</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {years.map((year) => (
                <Link
                  key={year}
                  href={`/kalendar/tsarkoven/${year}`}
                  className="group bg-card rounded-2xl border border-border hover:border-primary/40 p-8 transition-all hover:shadow-lg"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Calendar className="w-8 h-8 text-primary" />
                    <span className="text-4xl font-bold text-text">{year}</span>
                  </div>
                  <p className="text-muted group-hover:text-text transition-colors">
                    Всички празници и неработни дни
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-primary">
                    <span className="text-sm font-semibold">Виж календара</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </Link>
              ))}
            </div>

            {/* Quick Links */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-xl font-bold text-text mb-3">📅 Подвижни празници</h3>
                <p className="text-sm text-muted mb-4">
                  Великден, Цветница, Възнесение и други дати, които се изчисляват всяка година.
                </p>
                <Link href={`/kalendar/tsarkoven/${currentYear}`} className="text-primary hover:underline text-sm font-medium">
                  Виж {currentYear} →
                </Link>
              </div>

              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-xl font-bold text-text mb-3">🏛️ Неработни дни</h3>
                <p className="text-sm text-muted mb-4">
                  Официални празници, обявени за неработни по решение на Министерския съвет.
                </p>
                <Link href={`/kalendar/tsarkoven/${currentYear}`} className="text-primary hover:underline text-sm font-medium">
                  Виж списъка →
                </Link>
              </div>

              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-xl font-bold text-text mb-3">✚ Имен ден</h3>
                <p className="text-sm text-muted mb-4">
                  Всички имени, свързани с православни светци и техните празнични дни.
                </p>
                <Link href="/imen-den" className="text-primary hover:underline text-sm font-medium">
                  Търси име →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="py-12 px-4 bg-panel/20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-text mb-8">Наближаващи празници</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingEvents.map((event, i) => {
                const date = new Date(event.date)
                const day = date.getDate()
                const month = date.toLocaleDateString('bg-BG', { month: 'short' })
                
                return (
                  <div key={i} className="bg-card rounded-xl border border-border p-4 flex items-start gap-4">
                    <div className="flex-shrink-0 w-14 h-14 bg-[#FFF0C8] border border-[#F0C770] rounded-lg flex flex-col items-center justify-center leading-tight">
                      <span className="text-[#C95502] font-bold text-lg">{day}</span>
                      <span className="text-[#C95502] font-medium text-xs">{month}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-text font-semibold mb-1">
                        <span className="text-warning mr-2">✚</span>
                        {event.title}
                      </p>
                      {event.nonWorking && (
                        <span className="px-2 py-0.5 bg-critical text-white rounded text-xs font-medium">
                          Неработен
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-card rounded-2xl border border-border p-8">
                <h2 className="text-2xl font-bold text-text mb-4">За календара</h2>
                <div className="space-y-4 text-muted-strong">
                  <p>
                    Църковният календар съдържа всички православни празници според календара на Българската православна църква (БПЦ).
                  </p>
                  <p>
                    Включени са както фиксирани празници (напр. Коледа, Йордановден), така и подвижни, които зависят от датата на Великден и се изчисляват по специална формула всяка година.
                  </p>
                  <p>
                    Неработните дни се обявяват с решение на Министерския съвет и включват основните религиозни и национални празници.
                  </p>
                </div>
              </div>

              <div className="bg-card rounded-2xl border border-border p-8">
                <h2 className="text-2xl font-bold text-text mb-4">Как да използвам?</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center font-bold">1</span>
                    <div>
                      <p className="text-text font-semibold">Изберете година</p>
                      <p className="text-sm text-muted">Вижте всички празници за конкретна година</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center font-bold">2</span>
                    <div>
                      <p className="text-text font-semibold">Изтеглете ICS файл</p>
                      <p className="text-sm text-muted">Добавете празниците в Google/Apple Calendar</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center font-bold">3</span>
                    <div>
                      <p className="text-text font-semibold">Настройте напомняния</p>
                      <p className="text-sm text-muted">Получавайте известия преди важни дати</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Other Calendars */}
        <section className="py-12 px-4 bg-panel/20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-text mb-8">Други календари</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Link
                href="/kalendar/lunen"
                className="bg-card rounded-xl border border-border hover:border-primary/40 p-6 transition-all hover:shadow-lg group"
              >
                <div className="text-4xl mb-3">🌙</div>
                <h3 className="text-xl font-bold text-text mb-2 group-hover:text-primary transition-colors">
                  Лунен календар
                </h3>
                <p className="text-sm text-muted">
                  Фази на луната с точни часове
                </p>
              </Link>

              <Link
                href="/kalendar/slunchev"
                className="bg-card rounded-xl border border-border hover:border-primary/40 p-6 transition-all hover:shadow-lg group"
              >
                <div className="text-4xl mb-3">☀️</div>
                <h3 className="text-xl font-bold text-text mb-2 group-hover:text-primary transition-colors">
                  Слънчев календар
                </h3>
                <p className="text-sm text-muted">
                  Изгрев и залез за България
                </p>
              </Link>

              <Link
                href="/kalendar/formula-1"
                className="bg-card rounded-xl border border-border hover:border-primary/40 p-6 transition-all hover:shadow-lg group"
              >
                <div className="text-4xl mb-3">🏎️</div>
                <h3 className="text-xl font-bold text-text mb-2 group-hover:text-primary transition-colors">
                  Формула 1
                </h3>
                <p className="text-sm text-muted">
                  Всички състезания в BG време
                </p>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-text mb-8">Често задавани въпроси</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-text mb-3">
                  Как се изчислява Великден?
                </h3>
                <p className="text-sm text-muted-strong">
                  Великден се изчислява по формулата на Гаус спрямо пролетното равноденствие и пълнолунието. Това е първата неделя след първото пълнолуние след пролетното равноденствие.
                </p>
              </div>

              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-text mb-3">
                  Кои празници са неработни?
                </h3>
                <p className="text-sm text-muted-strong">
                  Неработните дни се обявяват с решение на Министерския съвет и включват основни религиозни празници (Великден, Коледа, Богоявление) и национални празници (3 март, 6 септември).
                </p>
              </div>

              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-text mb-3">
                  Какво значи "подвижен празник"?
                </h3>
                <p className="text-sm text-muted-strong">
                  Подвижните празници не са на фиксирана дата — тяхната дата зависи от датата на Великден и се изчислява всяка година наново (напр. Цветница, Възнесение, Петдесетница).
                </p>
              </div>

              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-text mb-3">
                  Откъде са данните?
                </h3>
                <p className="text-sm text-muted-strong">
                  Данните са от официалния календар на Българската православна църква (БПЦ) и решенията на Министерския съвет за неработните дни.
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

