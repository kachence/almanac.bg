'use client'

import { Calendar, Moon, Sunrise, Sunset } from 'lucide-react'
import Link from 'next/link'

interface TodayCardProps {
  date: string
  nameDays: string[]
  holidays: Array<{ name: string; isOfficial: boolean }>
  moonPhase: string
  sunrise: string
  sunset: string
  isWorkingDay: boolean
  weekNumber: number
  dayOfYear: number
  historicalEvent?: string
}

export function TodayCard({ 
  date, 
  nameDays, 
  holidays, 
  moonPhase, 
  sunrise, 
  sunset,
  isWorkingDay,
  weekNumber,
  dayOfYear,
  historicalEvent
}: TodayCardProps) {
  return (
    <div className="bg-card rounded-2xl shadow-[0_1px_2px_rgba(31,25,21,.08),0_8px_24px_rgba(31,25,21,.06)] p-8 border border-border border-t-[3px] border-t-accent h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="w-8 h-8 text-primary" />
        <h1 className="text-[2rem] md:text-[2.5rem] font-bold text-text">
          Днес в България
        </h1>
      </div>
      
      <div className="space-y-6">
        {/* Date */}
        <div>
          <p className="text-2xl font-semibold text-text">
            {date}
          </p>
          {/* Day Metadata Strip */}
          <div className="flex items-center gap-2 mt-2 text-xs text-muted">
            <span>{isWorkingDay ? 'Работен ден' : 'Неработен ден'}</span>
            <span className="text-muted/50">•</span>
            <span>Седмица {weekNumber}</span>
            <span className="text-muted/50">•</span>
            <span>Ден {dayOfYear} от годината</span>
          </div>
        </div>

        {/* Name Days */}
        <div>
          {nameDays.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {nameDays.map((name) => (
                <span
                  key={name}
                  className="px-3 py-1.5 bg-[#FFF0C8] text-[#1F1915] border border-[#F0C770] rounded-full text-sm font-medium"
                >
                  {name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-muted text-sm italic">
              Днес няма имен ден
            </p>
          )}
        </div>

        {/* Holidays */}
        {holidays.length > 0 && (
          <div>
            <p className="text-sm font-medium text-muted mb-2">
              Празници:
            </p>
            <div className="space-y-2">
              {holidays.map((holiday) => (
                <div key={holiday.name} className="flex items-center gap-2">
                  <span className="text-text">
                    {holiday.name}
                  </span>
                  {holiday.isOfficial && (
                    <span className="px-2 py-0.5 bg-critical text-white rounded text-xs font-medium">
                      неработен
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Moon Phase & Sun Times */}
        <div className="flex items-center gap-6 text-sm text-muted-strong">
          <div className="flex items-center gap-2">
            <Moon className="w-4 h-4" />
            <span>{moonPhase}</span>
          </div>
          <div className="flex items-center gap-2">
            <Sunrise className="w-4 h-4" />
            <span>{sunrise}</span>
          </div>
          <div className="flex items-center gap-2">
            <Sunset className="w-4 h-4" />
            <span>{sunset}</span>
          </div>
        </div>

        {/* "На този ден" Historical Event */}
        {historicalEvent && (
          <div className="bg-soft border border-border rounded-xl px-4 py-3">
            <p className="text-sm text-text leading-relaxed">
              <span className="font-semibold">На този ден</span> {historicalEvent}
            </p>
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Link
            href="/kalendar/2025/10"
            className="flex-1 h-12 flex items-center justify-center px-5 bg-[#F46A03] hover:bg-[#DD5F02] text-white rounded-xl font-semibold transition-colors shadow-sm focus:outline focus:outline-3 focus:outline-[#F4BF3A80] focus:outline-offset-2"
          >
            Календар за октомври →
          </Link>
          <button className="flex-1 h-12 px-5 border-2 border-[#F2E6D7] text-[#C95502] bg-[#FFFBF2] hover:bg-[#FFF6EB] rounded-xl font-semibold transition-colors focus:outline focus:outline-3 focus:outline-[#F4BF3A80] focus:outline-offset-2">
            Добави днешните събития
          </button>
        </div>
      </div>
    </div>
  )
}

