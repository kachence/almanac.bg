'use client'

import { Briefcase, Calendar, Church, Flag, Flower, Globe, PartyPopper, MapPin, Gift } from 'lucide-react'
import Link from 'next/link'

const HOLIDAY_CATEGORIES = [
  {
    title: 'Официални/неработни',
    icon: Flag,
    description: 'Официални почивни дни',
    href: '/praznik/natsionalen',
    color: 'text-[#CC2B2B]',
    bgColor: 'bg-[#FDEAEA]',
    borderColor: 'border-[#F5C6C6]'
  },
  {
    title: 'Православни празници',
    icon: Church,
    description: 'Църковни и религиозни празници',
    href: '/praznik/tsarkoven',
    color: 'text-[#F46A03]',
    bgColor: 'bg-[#FFE8D1]',
    borderColor: 'border-[#FFB580]'
  },
  {
    title: 'Професионални дни',
    icon: Briefcase,
    description: 'Ден на учителя, полицията и др.',
    href: '/praznik/profesionalen',
    color: 'text-[#F4BF3A]',
    bgColor: 'bg-[#FFF0C8]',
    borderColor: 'border-[#F0C770]'
  },
  {
    title: 'Чуждестранни празници',
    icon: Globe,
    description: 'Хелуин, Св. Валентин',
    href: '/praznik/chuzhdestranen',
    color: 'text-[#B5560A]',
    bgColor: 'bg-[#FDE8D7]',
    borderColor: 'border-[#E7B08B]'
  },
  {
    title: 'Фестивали',
    icon: Flower,
    description: 'Празник на розата, на виното',
    href: '/praznik/festivali',
    color: 'text-[#D39A17]',
    bgColor: 'bg-[#FFF4D6]',
    borderColor: 'border-[#F0C770]'
  },
  {
    title: 'Забавни/Други празници',
    icon: PartyPopper,
    description: 'Празник на котката, Ден на пицата',
    href: '/praznik/zabavni',
    color: 'text-[#8C6E1A]',
    bgColor: 'bg-[#F7F0D9]',
    borderColor: 'border-[#D8C793]'
  },
  {
    title: 'Местни/Празник на града',
    icon: MapPin,
    description: 'Празник на София, Варна, Пловдив и др.',
    href: '/praznik/mestni',
    color: 'text-[#C95502]',
    bgColor: 'bg-[#FFE8D1]',
    borderColor: 'border-[#F0C770]'
  },
]

const FEATURED_HOLIDAYS = [
  { name: 'Баба Марта', date: '1 март', month: 'мар', href: '/praznik/baba-marta' },
  { name: 'Цветница', date: '13 април', month: 'апр', href: '/praznik/cvetnica' },
  { name: 'Великден', date: '20 април', month: 'апр', href: '/praznik/velikden' },
  { name: '24 май', date: '24 май', month: 'май', href: '/praznik/24-may' },
]

export function HolidaysHub() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/20 rounded-full mb-4">
            <Gift className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
            Празници в България
          </h2>
          <p className="text-lg text-muted-strong max-w-3xl mx-auto">
            Официални неработни дни, православни и професионални празници — на едно място.
          </p>
        </div>

        {/* Category Cards - 2 rows (4 + 3) */}
        <div className="space-y-6 mb-12">
          {/* First row - 4 cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {HOLIDAY_CATEGORIES.slice(0, 4).map((category) => {
              const Icon = category.icon
              return (
                <Link
                  key={category.title}
                  href={category.href}
                  className="group bg-card rounded-2xl p-6 border-2 border-border hover:border-primary transition-all shadow-[0_1px_2px_rgba(31,25,21,.08),0_8px_24px_rgba(31,25,21,.06)] hover:shadow-[0_4px_8px_rgba(31,25,21,.12),0_12px_32px_rgba(31,25,21,.08)] hover:scale-[1.02]"
                >
                  <div className="flex flex-col gap-4">
                    <div className={`w-12 h-12 ${category.bgColor} ${category.borderColor} border rounded-xl flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${category.color}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-text mb-1.5 group-hover:text-primary transition-colors">
                        {category.title}
                      </h3>
                      <p className="text-sm text-muted leading-snug">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
          
          {/* Second row - 3 cards (centered) */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {HOLIDAY_CATEGORIES.slice(4, 7).map((category) => {
              const Icon = category.icon
              return (
                <Link
                  key={category.title}
                  href={category.href}
                  className="group bg-card rounded-2xl p-6 border-2 border-border hover:border-primary transition-all shadow-[0_1px_2px_rgba(31,25,21,.08),0_8px_24px_rgba(31,25,21,.06)] hover:shadow-[0_4px_8px_rgba(31,25,21,.12),0_12px_32px_rgba(31,25,21,.08)] hover:scale-[1.02]"
                >
                  <div className="flex flex-col gap-4">
                    <div className={`w-12 h-12 ${category.bgColor} ${category.borderColor} border rounded-xl flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${category.color}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-text mb-1.5 group-hover:text-primary transition-colors">
                        {category.title}
                      </h3>
                      <p className="text-sm text-muted leading-snug">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Featured Holidays - Using date chip pattern */}
        <div className="bg-card rounded-2xl p-8 border border-border shadow-[0_1px_2px_rgba(31,25,21,.08),0_8px_24px_rgba(31,25,21,.06)]">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-bold text-text">
              Предстоящи празници
            </h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURED_HOLIDAYS.map((holiday) => (
              <Link
                key={holiday.name}
                href={holiday.href}
                className="group flex items-center gap-3 p-4 rounded-xl hover:bg-panel transition-colors border border-transparent hover:border-border"
              >
                <div className="flex-shrink-0 w-14 h-14 bg-[#FFF0C8] border border-[#F0C770] rounded-lg flex flex-col items-center justify-center leading-tight">
                  <span className="text-[#C95502] font-bold text-lg">
                    {holiday.date.split(' ')[0]}
                  </span>
                  <span className="text-[#C95502] font-medium text-xs">
                    {holiday.month}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-text group-hover:text-primary transition-colors truncate">
                    {holiday.name}
                  </h4>
                  <p className="text-xs text-muted-strong">
                    {holiday.date}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

