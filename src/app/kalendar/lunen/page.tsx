import { Metadata } from 'next'
import { ChevronRight, Moon, Calendar } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Лунен календар | Almanac.bg',
  description: 'Лунен календар с всички фази на луната и точни часове в българско време.',
  keywords: 'лунен календар, фази на луната, новолуние, пълнолуние, България',
}

export default function LunarCalendarHubPage() {
  const currentYear = new Date().getFullYear()
  const years = [currentYear - 1, currentYear, currentYear + 1, currentYear + 2]

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
              <span className="text-text font-medium">Лунен</span>
            </nav>

            {/* H1 */}
            <div className="flex items-center gap-4 mb-6">
              <Moon className="w-12 h-12 text-primary" />
              <h1 className="text-5xl lg:text-6xl font-bold text-text">
                Лунен календар
              </h1>
            </div>

            {/* Intro */}
            <p className="text-xl text-muted-strong max-w-3xl">
              Точни дати и часове на всички лунни фази в българско време. Новолуние, пълнолуние, първа и последна четвърт.
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
                  href={`/kalendar/lunen/${year}`}
                  className="group bg-card rounded-2xl border border-border hover:border-primary/40 p-8 transition-all hover:shadow-lg"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Calendar className="w-8 h-8 text-primary" />
                    <span className="text-4xl font-bold text-text">{year}</span>
                  </div>
                  <p className="text-muted group-hover:text-text transition-colors">
                    Всички лунни фази с точни часове
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-primary">
                    <span className="text-sm font-semibold">Виж календара</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </Link>
              ))}
            </div>

            {/* Quick Links */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-card rounded-xl border border-border p-6 text-center">
                <div className="text-4xl mb-3">🌑</div>
                <h3 className="text-lg font-bold text-text mb-2">Новолуние</h3>
                <p className="text-sm text-muted">
                  Луната е между Земята и Слънцето
                </p>
              </div>

              <div className="bg-card rounded-xl border border-border p-6 text-center">
                <div className="text-4xl mb-3">🌓</div>
                <h3 className="text-lg font-bold text-text mb-2">Първа четвърт</h3>
                <p className="text-sm text-muted">
                  Луната нараства
                </p>
              </div>

              <div className="bg-card rounded-xl border border-border p-6 text-center">
                <div className="text-4xl mb-3">🌕</div>
                <h3 className="text-lg font-bold text-text mb-2">Пълнолуние</h3>
                <p className="text-sm text-muted">
                  Луната е напълно осветена
                </p>
              </div>

              <div className="bg-card rounded-xl border border-border p-6 text-center">
                <div className="text-4xl mb-3">🌗</div>
                <h3 className="text-lg font-bold text-text mb-2">Последна четвърт</h3>
                <p className="text-sm text-muted">
                  Луната намалява
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="py-12 px-4 bg-panel/20">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-card rounded-2xl border border-border p-8">
                <h2 className="text-2xl font-bold text-text mb-4">За календара</h2>
                <div className="space-y-4 text-muted-strong">
                  <p>
                    Лунният календар съдържа точните дати и часове на всички четири основни лунни фази: новолуние, първа четвърт, пълнолуние и последна четвърт.
                  </p>
                  <p>
                    Всички часове са в българско време (EET/EEST) с автоматична корекция за лятно и зимно часово време.
                  </p>
                  <p>
                    Данните са изчислени с астрономическа точност (±1 минута) и се базират на NASA библиотеки.
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
                      <p className="text-sm text-muted">Вижте всички лунни фази за конкретна година</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center font-bold">2</span>
                    <div>
                      <p className="text-text font-semibold">Изтеглете ICS файл</p>
                      <p className="text-sm text-muted">Добавете лунните фази в календара си</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center font-bold">3</span>
                    <div>
                      <p className="text-text font-semibold">Преглед по месеци</p>
                      <p className="text-sm text-muted">Детайлен преглед с визуализация на фазите</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Other Calendars */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-text mb-8">Други календари</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Link
                href="/kalendar/tsarkoven"
                className="bg-card rounded-xl border border-border hover:border-primary/40 p-6 transition-all hover:shadow-lg group"
              >
                <div className="text-4xl mb-3">✚</div>
                <h3 className="text-xl font-bold text-text mb-2 group-hover:text-primary transition-colors">
                  Църковен календар
                </h3>
                <p className="text-sm text-muted">
                  Православни празници и неработни дни
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
        <section className="py-12 px-4 bg-panel/20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-text mb-8">Често задавани въпроси</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-text mb-3">
                  Часовете са в българско време ли?
                </h3>
                <p className="text-sm text-muted-strong">
                  Да, всички часове са в българско време (EET/EEST) с автоматична корекция за лятно и зимно часово време.
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

              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-text mb-3">
                  Какво означават фазите?
                </h3>
                <p className="text-sm text-muted-strong">
                  Новолуние = луната е между Земята и Слънцето. Пълнолуние = Земята е между Слънцето и Луната. Четвъртите са преходните фази.
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
              <a href="#" className="text-primary hover:underline">NASA Astronomical Algorithms</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

