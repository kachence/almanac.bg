'use client'

import { Briefcase, Calendar, Church, Flag, Flower } from 'lucide-react'
import Link from 'next/link'

const HOLIDAY_CATEGORIES = [
  {
    title: 'Официални/неработни',
    icon: Flag,
    description: 'Официални почивни дни',
    href: '/praznici/oficialni',
    color: 'text-red-500'
  },
  {
    title: 'Православни празници',
    icon: Church,
    description: 'Църковни и религиозни празници',
    href: '/praznici/pravoslavni',
    color: 'text-blue-500'
  },
  {
    title: 'Професионални дни',
    icon: Briefcase,
    description: 'Ден на учителя, полицията и др.',
    href: '/praznici/profesionalni',
    color: 'text-purple-500'
  },
]

const FEATURED_HOLIDAYS = [
  { name: 'Баба Марта', icon: Flower, date: '1 март 2025' },
  { name: 'Великден', icon: Church, date: '20 април 2025' },
  { name: 'Цветница', icon: Flower, date: '13 април 2025' },
]

export function HolidaysHub() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
            Празници в България
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            Официални неработни дни, православни и професионални празници — на едно място.
          </p>
        </div>

        {/* Category Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {HOLIDAY_CATEGORIES.map((category) => {
            const Icon = category.icon
            return (
              <Link
                key={category.title}
                href={category.href}
                className="group bg-card rounded-2xl p-6 border-2 border-border hover:border-primary transition-all shadow-[0_1px_2px_rgba(31,25,21,.08),0_8px_24px_rgba(31,25,21,.06)] hover:shadow-[0_4px_8px_rgba(31,25,21,.12),0_12px_32px_rgba(31,25,21,.08)]"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-panel rounded-lg">
                    <Icon className={`w-6 h-6 ${category.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-text mb-1 group-hover:text-primary transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-sm text-muted">
                      {category.description}
                    </p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Featured Holidays */}
        <div className="bg-card rounded-xl p-8 border border-accent/20">
          <h3 className="text-xl font-bold text-text mb-6">
            Предстоящи празници
          </h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {FEATURED_HOLIDAYS.map((holiday) => {
              const Icon = holiday.icon
              return (
                <div
                  key={holiday.name}
                  className="bg-panel rounded-lg p-4 border border-border"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="w-5 h-5 text-primary" />
                    <h4 className="font-semibold text-text">
                      {holiday.name}
                    </h4>
                  </div>
                  <p className="text-sm text-muted">
                    {holiday.date}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

