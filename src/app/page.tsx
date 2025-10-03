import { Header } from '@/components/Header'
import { TodayCard } from '@/components/TodayCard'
import { UpcomingDates } from '@/components/UpcomingDates'
import { NameDaySearch } from '@/components/NameDaySearch'
import { HolidaysHub } from '@/components/HolidaysHub'
import { CalendarPreview } from '@/components/CalendarPreview'
import { GreetingCards } from '@/components/GreetingCards'
import { ReminderSignup } from '@/components/ReminderSignup'
import { FAQ } from '@/components/FAQ'
import { Footer } from '@/components/Footer'

// Mock data - in production this would come from a database/API
const todayData = {
  date: 'петък, 3 октомври 2025',
  nameDays: ['Денис', 'Денислав', 'Денислава'],
  holidays: [],
  moonPhase: 'Растяща луна',
  sunrise: '07:12',
  sunset: '18:45',
  isWorkingDay: true,
  weekNumber: 40,
  dayOfYear: 276,
  historicalEvent: '1990 г. — Обединение на Германия след падането на Берлинската стена. 3 октомври е официалният национален празник на Германия.',
}

const upcomingDates = [
  { date: '6 окт', title: 'Тома, Томислав', type: 'nameday' as const },
  { date: '14 окт', title: 'Параскева', type: 'nameday' as const },
  { date: '19 окт', title: 'Йоан Рилски', type: 'holiday' as const },
  { date: '26 окт', title: 'Димитър, Димитрина', type: 'nameday' as const },
  { date: '1 ноем', title: 'Ден на народните будители', type: 'holiday' as const },
  { date: '8 ноем', title: 'Архангеловден (Михаил, Гавраил)', type: 'holiday' as const },
  { date: '11 ноем', title: 'Мина, Минчо', type: 'nameday' as const },
  { date: '21 ноем', title: 'Въведение Богородично', type: 'holiday' as const },
  { date: '25 ноем', title: 'Екатерина, Катя', type: 'nameday' as const },
  { date: '30 ноем', title: 'Андрей, Андреана', type: 'nameday' as const },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-bg">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 lg:items-stretch">
              <TodayCard {...todayData} />
              <div className="hidden lg:flex">
                <UpcomingDates dates={upcomingDates} />
              </div>
            </div>
          </div>
        </section>

        {/* Name Day Search */}
        <NameDaySearch />

        {/* Holidays Hub */}
        <HolidaysHub />

        {/* Calendar Preview */}
        <CalendarPreview />

        {/* Greeting Cards */}
        {/* <GreetingCards /> */}

        {/* Reminder Signup */}
        <ReminderSignup />

        {/* FAQ */}
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}
