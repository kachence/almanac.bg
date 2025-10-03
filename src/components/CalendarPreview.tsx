'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface CalendarDay {
  day: number
  hasNameDay: boolean
  hasHoliday: boolean
  isToday: boolean
}

export function CalendarPreview() {
  // Mock data for October 2025
  const days: CalendarDay[] = Array.from({ length: 31 }, (_, i) => ({
    day: i + 1,
    hasNameDay: Math.random() > 0.7,
    hasHoliday: Math.random() > 0.85,
    isToday: i + 1 === 3,
  }))

  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд']

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
            Календар октомври 2025
          </h2>
        </div>

        {/* Calendar Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/kalendar/2025/09"
            className="flex items-center gap-2 px-4 py-2 text-muted hover:text-primary transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>септември 2025</span>
          </Link>
          <Link
            href="/kalendar/2025/11"
            className="flex items-center gap-2 px-4 py-2 text-muted hover:text-primary transition-colors"
          >
            <span>ноември 2025</span>
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Calendar Grid */}
        <div className="bg-card rounded-2xl p-6 border border-border shadow-[0_1px_2px_rgba(31,25,21,.08),0_8px_24px_rgba(31,25,21,.06)]">
          {/* Week Days Header */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-sm font-semibold text-muted py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty cells for offset (October 1, 2025 starts on Wednesday) */}
            {[...Array(2)].map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            
            {days.map((dayData) => (
              <button
                key={dayData.day}
                className={`
                  aspect-square rounded-lg p-2 text-center transition-all relative
                  ${dayData.isToday 
                    ? 'bg-primary text-white font-bold shadow-lg' 
                    : 'bg-panel hover:bg-accent/10 text-text'
                  }
                `}
              >
                <span className="text-sm">{dayData.day}</span>
                
                {/* Indicators */}
                <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-1">
                  {dayData.hasNameDay && (
                    <div className={`w-1.5 h-1.5 rounded-full ${dayData.isToday ? 'bg-white' : 'bg-accent'}`} />
                  )}
                  {dayData.hasHoliday && (
                    <div className={`w-1.5 h-1.5 rounded-full ${dayData.isToday ? 'bg-white' : 'bg-critical'}`} />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-border">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-accent" />
              <span className="text-sm text-muted">Имен ден</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-critical" />
              <span className="text-sm text-muted">Празник</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <Link
            href="/kalendar/2025"
            className="inline-flex items-center justify-center h-12 px-8 bg-[#F46A03] hover:bg-[#DD5F02] text-white rounded-xl font-semibold transition-colors shadow-sm focus:outline focus:outline-3 focus:outline-[#F4BF3A80] focus:outline-offset-2"
          >
            Виж работни/почивни дни 2025
          </Link>
        </div>
      </div>
    </section>
  )
}

