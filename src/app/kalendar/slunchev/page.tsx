import { Metadata } from 'next'
import { ChevronRight, Sun } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Слънчев календар | Almanac.bg',
  description: 'Слънчев календар с изгрев, залез и дължина на деня за градовете в България.',
  keywords: 'слънчев календар, изгрев, залез, дължина на деня, България',
}

export default function SolarCalendarHubPage() {
  const currentYear = new Date().getFullYear()
  
  const cities = [
    { name: 'София', slug: 'sofia', lat: 42.6977, lon: 23.3219 },
    { name: 'Пловдив', slug: 'plovdiv', lat: 42.1354, lon: 24.7453 },
    { name: 'Варна', slug: 'varna', lat: 43.2141, lon: 27.9147 },
    { name: 'Бургас', slug: 'burgas', lat: 42.5048, lon: 27.4626 },
    { name: 'Русе', slug: 'ruse', lat: 43.8564, lon: 25.9656 },
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
              <span className="text-text font-medium">Слънчев</span>
            </nav>

            {/* H1 */}
            <div className="flex items-center gap-4 mb-6">
              <Sun className="w-12 h-12 text-primary" />
              <h1 className="text-5xl lg:text-6xl font-bold text-text">
                Слънчев календар
              </h1>
            </div>

            {/* Intro */}
            <p className="text-xl text-muted-strong max-w-3xl">
              Точни часове за изгрев и залез на слънцето, дължина на деня и астрономически данни за градовете в България.
            </p>
          </div>
        </section>

        {/* Cities Grid */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-text mb-4">Изберете град</h2>
            <p className="text-muted mb-8">Данните се различават според географската ширина и дължина на всеки град</p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {cities.map((city) => (
                <Link
                  key={city.slug}
                  href={`/kalendar/slunchev/${city.slug}/${currentYear}`}
                  className="group bg-card rounded-2xl border border-border hover:border-primary/40 p-8 transition-all hover:shadow-lg"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-text group-hover:text-primary transition-colors mb-2">
                        {city.name}
                      </h3>
                      <p className="text-sm text-muted">
                        {city.lat}°N, {city.lon}°E
                      </p>
                    </div>
                    <Sun className="w-8 h-8 text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-primary">
                    <span className="text-sm font-semibold">Виж {currentYear}</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </Link>
              ))}
              
              {/* Placeholder for more cities */}
              <div className="bg-card rounded-2xl border border-dashed border-border p-8 flex flex-col items-center justify-center text-center opacity-60">
                <p className="text-muted mb-2">Повече градове скоро</p>
                <p className="text-sm text-muted-strong">Работим по добавянето на допълнителни локации</p>
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-card rounded-xl border border-border p-6">
                <div className="text-4xl mb-3">🌅</div>
                <h3 className="text-lg font-bold text-text mb-2">Изгрев</h3>
                <p className="text-sm text-muted">
                  Точният час, когато слънцето се появява над хоризонта
                </p>
              </div>

              <div className="bg-card rounded-xl border border-border p-6">
                <div className="text-4xl mb-3">🌇</div>
                <h3 className="text-lg font-bold text-text mb-2">Залез</h3>
                <p className="text-sm text-muted">
                  Точният час, когато слънцето изчезва под хоризонта
                </p>
              </div>

              <div className="bg-card rounded-xl border border-border p-6">
                <div className="text-4xl mb-3">⏱️</div>
                <h3 className="text-lg font-bold text-text mb-2">Дължина на деня</h3>
                <p className="text-sm text-muted">
                  Общото време между изгрева и залеза
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
                    Слънчевият календар съдържа точните часове за изгрев и залез на слънцето за пет основни града в България.
                  </p>
                  <p>
                    Данните са изчислени с астрономически алгоритми, използвайки GPS координатите на всеки град и са коректни с точност до 1 минута.
                  </p>
                  <p>
                    Изгревът и залезът зависят от географската ширина и дължина — колкото по-на изток, толкова по-рано изгрява слънцето.
                  </p>
                </div>
              </div>

              <div className="bg-card rounded-2xl border border-border p-8">
                <h2 className="text-2xl font-bold text-text mb-4">Как да използвам?</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center font-bold">1</span>
                    <div>
                      <p className="text-text font-semibold">Изберете град</p>
                      <p className="text-sm text-muted">Вижте данните за конкретна локация</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center font-bold">2</span>
                    <div>
                      <p className="text-text font-semibold">Изберете година</p>
                      <p className="text-sm text-muted">Преглед по месеци и дни</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center font-bold">3</span>
                    <div>
                      <p className="text-text font-semibold">Изтеглете данни</p>
                      <p className="text-sm text-muted">CSV/JSON формат за анализ</p>
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
                  За кои градове е валидно?
                </h3>
                <p className="text-sm text-muted-strong">
                  Данните са изчислени за 5 основни града: София, Пловдив, Варна, Бургас и Русе. Работим по добавянето на повече локации.
                </p>
              </div>

              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-text mb-3">
                  Как се изчисляват данните?
                </h3>
                <p className="text-sm text-muted-strong">
                  Използваме астрономически алгоритми с GPS координатите на всеки град. Точността е до 1 минута.
                </p>
              </div>

              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-text mb-3">
                  Защо има разлика между градовете?
                </h3>
                <p className="text-sm text-muted-strong">
                  Изгревът и залезът зависят от географската ширина и дължина — колкото по-на изток/север е градът, толкова по-рано/късно изгрява слънцето.
                </p>
              </div>

              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-text mb-3">
                  Включва ли се лятно/зимно време?
                </h3>
                <p className="text-sm text-muted-strong">
                  Да, всички часове са коректирани за лятно и зимно часово време според българския часови пояс.
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
              <a href="#" className="text-primary hover:underline">NOAA Solar Calculator</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

