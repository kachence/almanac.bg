'use client'

import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react'
import Link from 'next/link'

interface CalendarDay {
  day: number
  hasNameDay: boolean
  hasHoliday: boolean
  isToday: boolean
  isWeekend: boolean
  isNonWorking: boolean
  nameDayName?: string
  holidayName?: string
  nameDaySlug?: string
  holidaySlug?: string
}

export function CalendarPreview() {
  // Mock data for October 2025 (deterministic to avoid hydration mismatch)
  const nameDayDates = [6, 14, 18, 26] // Example dates with name days
  const nameDayNames: Record<number, string> = {
    6: 'Петка',
    14: 'Петко',
    18: 'Златина',
    26: 'Димитър'
  }
  const nameDaySlugs: Record<number, string> = {
    6: 'petka',
    14: 'petko',
    18: 'zlatina',
    26: 'dimitar'
  }
  const holidayDates = [3] // Example holiday dates
  const holidayNames: Record<number, string> = {
    3: 'Независимост'
  }
  const holidaySlugs: Record<number, string> = {
    3: 'den-na-osvobozhdenieto'
  }
  // Official non-working days (excluding regular weekends)
  const officialNonWorkingDates = [3] // 3rd October - Independence Day
  
  // October 2025 starts on Wednesday (day of week 2, where Monday = 0)
  const startDayOfWeek = 2 // Wednesday
  
  const days: CalendarDay[] = Array.from({ length: 31 }, (_, i) => {
    const day = i + 1
    const dayOfWeek = (startDayOfWeek + i) % 7
    const isWeekend = dayOfWeek === 5 || dayOfWeek === 6 // Saturday (5) or Sunday (6)
    const isOfficialNonWorking = officialNonWorkingDates.includes(day)
    
    return {
      day,
      hasNameDay: nameDayDates.includes(day),
      hasHoliday: holidayDates.includes(day),
      isToday: day === 3,
      isWeekend,
      isNonWorking: isWeekend || isOfficialNonWorking,
      nameDayName: nameDayNames[day],
      holidayName: holidayNames[day],
      nameDaySlug: nameDaySlugs[day],
      holidaySlug: holidaySlugs[day]
    }
  })

  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд']

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/20 rounded-full mb-4">
            <CalendarDays className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-text mb-2">
            Календар октомври 2025
          </h2>
          <p className="text-muted-strong">
            Имени дни, празници и неработни дни — на един поглед
          </p>
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
            {weekDays.map((day, index) => {
              const isWeekend = index === 5 || index === 6 // Сб, Нд
              return (
                <div
                  key={day}
                  className={`text-center text-sm font-semibold py-2 ${
                    isWeekend ? 'text-muted-strong' : 'text-muted'
                  }`}
                >
                  {day}
                </div>
              )
            })}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty cells for offset (October 1, 2025 starts on Wednesday) */}
            {[...Array(2)].map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            
            {days.map((dayData) => {
              // Determine if this is an official non-working day (not just weekend)
              const isOfficialNonWorking = officialNonWorkingDates.includes(dayData.day)
              
              // Determine background and border color with dark mode support
              let bgClass = 'bg-card border-border-strong'
              let dayNumberClass = 'text-text'
              
              if (dayData.isToday) {
                bgClass = 'bg-primary text-white border-primary'
                dayNumberClass = 'text-white font-bold'
              } else if (isOfficialNonWorking) {
                bgClass = 'bg-warning-bg border-warning-border dark:bg-warning-bg dark:border-warning-border'
                dayNumberClass = 'text-text dark:text-warning-text'
              } else if (dayData.isWeekend) {
                bgClass = 'bg-[#FFF3E6] dark:bg-panel border-border-strong'
                dayNumberClass = 'text-muted-strong dark:text-muted'
              }
              
              return (
                <div
                  key={dayData.day}
                  className={`
                    group aspect-square rounded-lg transition-all relative
                    flex flex-col items-start gap-1 p-2 border-2 shadow-sm
                    ${bgClass}
                    hover:ring-2 hover:ring-primary/40 hover:scale-[1.02]
                    focus-within:outline focus-within:outline-2 focus-within:outline-accent/60 focus-within:outline-offset-2
                  `}
                >
                  {/* Day number (top left) */}
                  <Link
                    href={`/kalendar/2025/10/${dayData.day}`}
                    className={`text-2xl font-medium ${dayNumberClass} focus:outline-none`}
                  >
                    {dayData.day}
                  </Link>
                  
                  {/* Official non-working day badge (top right) */}
                  {isOfficialNonWorking && (
                    <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-critical text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-sm">
                      П
                    </div>
                  )}
                  
                  {/* Event labels (stacked below) */}
                  <div className="flex flex-col gap-1 w-full mt-auto">
                    {dayData.hasNameDay && dayData.nameDayName && dayData.nameDaySlug && (
                      <Link
                        href={`/imen-den/${dayData.nameDaySlug}`}
                        className={`group/chip text-[10px] px-1.5 py-0.5 rounded font-medium truncate transition-all ${
                          dayData.isToday 
                            ? 'bg-white/90 text-primary hover:bg-white' 
                            : 'bg-primary text-white dark:bg-primary dark:text-white hover:bg-primary-hover hover:scale-105 hover:shadow-sm'
                        }`}
                        title={`Имен ден: ${dayData.nameDayName}`}
                      >
                        {dayData.nameDayName}
                      </Link>
                    )}
                    {dayData.hasHoliday && dayData.holidayName && dayData.holidaySlug && (
                      <Link
                        href={`/praznik/${dayData.holidaySlug}`}
                        className={`group/chip text-[10px] px-1.5 py-0.5 rounded font-medium truncate transition-all ${
                          dayData.isToday 
                            ? 'bg-white/90 text-[#CC2B2B] hover:bg-white' 
                            : 'bg-critical text-white dark:bg-critical dark:text-white hover:bg-critical-hover hover:scale-105 hover:shadow-sm'
                        }`}
                        title={`Празник: ${dayData.holidayName}`}
                      >
                        {dayData.holidayName}
                      </Link>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-6 pt-6 border-t border-border">
            <div className="flex items-center gap-2">
              <div className="text-[10px] px-1.5 py-0.5 rounded bg-primary text-white font-medium whitespace-nowrap">
                Име
              </div>
              <span className="text-sm text-muted-strong">Имен ден</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-[10px] px-1.5 py-0.5 rounded bg-critical text-white font-medium whitespace-nowrap">
                Празник
              </div>
              <span className="text-sm text-muted-strong">Празник</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-[#FFF3E6] dark:bg-panel border-2 border-border-strong shadow-sm flex items-center justify-center text-xs font-medium text-muted-strong">
                <span className="text-[10px]">С+Н</span>
              </div>
              <span className="text-sm text-muted-strong">Почивен</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-8 h-8 rounded bg-warning-bg border-2 border-warning-border dark:bg-warning-bg dark:border-warning-border shadow-sm flex items-center justify-center">
                <div className="absolute top-0 right-0 w-4 h-4 bg-critical text-white rounded-full text-[8px] font-bold flex items-center justify-center -mt-1 -mr-1">
                  П
                </div>
              </div>
              <span className="text-sm text-muted-strong">Неработен</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-primary text-white border-2 border-primary shadow-sm flex items-center justify-center text-xs font-bold">
                3
              </div>
              <span className="text-sm text-muted-strong">Днес</span>
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

