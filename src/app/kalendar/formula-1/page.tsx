import { Metadata } from 'next'
import { ChevronRight, CarFront, Calendar } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Формула 1 календар | Almanac.bg',
  description: 'Календар на Формула 1 с всички състезания, квалификации и часове в българско време.',
  keywords: 'формула 1, F1, календар, състезания, квалификации, българско време',
}

export default function F1CalendarHubPage() {
  const currentYear = new Date().getFullYear()
  const years = [currentYear - 1, currentYear, currentYear + 1]

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
              <span className="text-text font-medium">Формула 1</span>
            </nav>

            {/* H1 */}
            <div className="flex items-center gap-4 mb-6">
              <CarFront className="w-12 h-12 text-primary" />
              <h1 className="text-5xl lg:text-6xl font-bold text-text">
                Формула 1 календар
              </h1>
            </div>

            {/* Intro */}
            <p className="text-xl text-muted-strong max-w-3xl">
              Пълен календар на Формула 1 с всички кръгове, квалификации, спринт състезания и точни часове в българско време.
            </p>
          </div>
        </section>

        {/* Seasons Grid */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-text mb-8">Изберете сезон</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {years.map((year) => (
                <Link
                  key={year}
                  href={`/kalendar/formula-1/${year}`}
                  className="group bg-card rounded-2xl border border-border hover:border-primary/40 p-8 transition-all hover:shadow-lg"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Calendar className="w-8 h-8 text-primary" />
                    <span className="text-4xl font-bold text-text">Сезон {year}</span>
                  </div>
                  <p className="text-muted group-hover:text-text transition-colors">
                    Всички Гран При с часове в BG време
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-primary">
                    <span className="text-sm font-semibold">Виж календара</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </Link>
              ))}
            </div>

            {/* Info Cards */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-card rounded-xl border border-border p-6">
                <div className="text-4xl mb-3">🏎️</div>
                <h3 className="text-lg font-bold text-text mb-2">Състезания</h3>
                <p className="text-sm text-muted">
                  Всички Гран При през сезона
                </p>
              </div>

              <div className="bg-card rounded-xl border border-border p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 bg-accent text-ink-rare rounded text-sm font-medium">Q</span>
                  <h3 className="text-lg font-bold text-text">Квалификации</h3>
                </div>
                <p className="text-sm text-muted">
                  Борба за pole position
                </p>
              </div>

              <div className="bg-card rounded-xl border border-border p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 bg-primary text-white rounded text-sm font-medium">S</span>
                  <h3 className="text-lg font-bold text-text">Спринт</h3>
                </div>
                <p className="text-sm text-muted">
                  Кратки състезания събота
                </p>
              </div>

              <div className="bg-card rounded-xl border border-border p-6">
                <div className="text-4xl mb-3">🕐</div>
                <h3 className="text-lg font-bold text-text mb-2">BG време</h3>
                <p className="text-sm text-muted">
                  Всички часове конвертирани
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-12 px-4 bg-panel/20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-text mb-8">Какво включва?</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-card rounded-xl border border-border p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-text mb-3">Пълен календар</h3>
                <p className="text-muted-strong">
                  Всички кръгове, квалификации и спринт състезания с точни дати и часове
                </p>
              </div>

              <div className="bg-card rounded-xl border border-border p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">⏰</span>
                </div>
                <h3 className="text-xl font-bold text-text mb-3">Българско време</h3>
                <p className="text-muted-strong">
                  Всички часове автоматично конвертирани в българско време (EET/EEST)
                </p>
              </div>

              <div className="bg-card rounded-xl border border-border p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">📥</span>
                </div>
                <h3 className="text-xl font-bold text-text mb-3">ICS файлове</h3>
                <p className="text-muted-strong">
                  Изтеглете календара и го импортирайте в Google/Apple Calendar
                </p>
              </div>

              <div className="bg-card rounded-xl border border-border p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🏁</span>
                </div>
                <h3 className="text-xl font-bold text-text mb-3">Детайли за пистите</h3>
                <p className="text-muted-strong">
                  Информация за всяка писта, държава и брой обиколки
                </p>
              </div>

              <div className="bg-card rounded-xl border border-border p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🌙</span>
                </div>
                <h3 className="text-xl font-bold text-text mb-3">Нощни състезания</h3>
                <p className="text-muted-strong">
                  Ясна индикация за състезания под изкуствено осветление
                </p>
              </div>

              <div className="bg-card rounded-xl border border-border p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">📺</span>
                </div>
                <h3 className="text-xl font-bold text-text mb-3">TV излъчване</h3>
                <p className="text-muted-strong">
                  Информация за телевизиите и стрийминг услугите
                </p>
              </div>
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
                    Календарът съдържа официалния график на Формула 1, автоматично актуализиран при промени от FIA.
                  </p>
                  <p>
                    Всички часове са конвертирани в българско време (EET/EEST) с автоматична корекция за лятно и зимно часово време.
                  </p>
                  <p>
                    Включени са квалификации, спринт състезания (където е приложимо) и основните състезания с информация за броя обиколки.
                  </p>
                </div>
              </div>

              <div className="bg-card rounded-2xl border border-border p-8">
                <h2 className="text-2xl font-bold text-text mb-4">Как да използвам?</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center font-bold">1</span>
                    <div>
                      <p className="text-text font-semibold">Изберете сезон</p>
                      <p className="text-sm text-muted">Вижте всички кръгове за конкретна година</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center font-bold">2</span>
                    <div>
                      <p className="text-text font-semibold">Изтеглете ICS</p>
                      <p className="text-sm text-muted">Добавете целия сезон или отделни кръгове</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center font-bold">3</span>
                    <div>
                      <p className="text-text font-semibold">Получавайте напомняния</p>
                      <p className="text-sm text-muted">Никога не пропускайте състезание</p>
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
                  Часовете са в българско време ли?
                </h3>
                <p className="text-sm text-muted-strong">
                  Да, всички часове са конвертирани в българско време (EET/EEST) с автоматична корекция за лятно/зимно часово време.
                </p>
              </div>

              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-text mb-3">
                  Как да добавя в календара си?
                </h3>
                <p className="text-sm text-muted-strong">
                  Изтеглете ICS файла за отделно състезание или целия сезон и го импортирайте в календарното си приложение (Google Calendar, Apple Calendar и др.).
                </p>
              </div>

              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-text mb-3">
                  Откъде са данните?
                </h3>
                <p className="text-sm text-muted-strong">
                  Официалният календар на FIA, автоматично актуализиран при промени в графика.
                </p>
              </div>

              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-text mb-3">
                  Какво означава "Sprint"?
                </h3>
                <p className="text-sm text-muted-strong">
                  Спринт състезанията са кратки състезания (около 100 км), които се провеждат в събота на някои кръгове и определят стартовата позиция за основното състезание.
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
              <a href="https://www.fia.com" className="text-primary hover:underline">FIA Official Calendar</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

