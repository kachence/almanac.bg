'use client'

import { CalendarDays } from 'lucide-react'

interface UpcomingDate {
  date: string
  title: string
  type: 'nameday' | 'holiday'
}

interface UpcomingDatesProps {
  dates: UpcomingDate[]
}

export function UpcomingDates({ dates }: UpcomingDatesProps) {
  return (
    <div className="bg-card rounded-2xl shadow-[0_1px_2px_rgba(31,25,21,.08),0_8px_24px_rgba(31,25,21,.06)] p-6 border border-border h-full flex flex-col w-full">
      <div className="flex items-center gap-2 mb-4 flex-shrink-0">
        <CalendarDays className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold text-text">
          Наближаващи
        </h2>
      </div>
      
      <div className="grid grid-cols-2 gap-2 flex-1">
        {dates.map((item, index) => (
          <button
            key={index}
            className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-panel transition-colors text-left"
          >
            <div className="flex-shrink-0 w-14 h-14 bg-[#FFF0C8] border border-[#F0C770] rounded-lg flex flex-col items-center justify-center leading-tight">
              <span className="text-[#C95502] font-bold text-lg">
                {item.date.split(' ')[0]}
              </span>
              <span className="text-[#C95502] font-medium text-xs">
                {item.date.split(' ')[1]}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text flex items-center gap-1.5">
                <span className="text-base" role="img" aria-label={item.type === 'nameday' ? 'імен ден' : 'празник'}>
                  {item.type === 'nameday' ? '🎉' : '🏛️'}
                </span>
                {item.title}
              </p>
              <p className="text-xs text-muted-strong">
                {item.type === 'nameday' ? 'Имен ден' : 'Празник'}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

