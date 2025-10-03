'use client'

import { Bell } from 'lucide-react'
import { useState } from 'react'

export function ReminderSignup() {
  const [email, setEmail] = useState('')
  const [remindMyNames, setRemindMyNames] = useState(false)
  const [remindHolidays, setRemindHolidays] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle signup
    console.log({ email, remindMyNames, remindHolidays })
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/20 rounded-full mb-4">
            <Bell className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
            Никога не изпускай имен ден
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            Едно напомняне преди деня, едно в самия ден. Без спам.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="bg-card rounded-2xl p-8 border border-border shadow-[0_1px_2px_rgba(31,25,21,.08),0_8px_24px_rgba(31,25,21,.06)]">
            {/* Email Input */}
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-text mb-2">
                Email адрес
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="твоят@email.bg"
                className="w-full px-4 py-3 bg-panel border border-border rounded-lg text-text placeholder-muted focus:outline-none focus:border-primary transition-colors"
                required
              />
            </div>

            {/* Checkboxes */}
            <div className="space-y-4 mb-6">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={remindMyNames}
                  onChange={(e) => setRemindMyNames(e.target.checked)}
                  className="mt-1 w-5 h-5 text-primary border-border rounded focus:ring-primary accent-primary"
                />
                <span className="text-text group-hover:text-primary transition-colors">
                  Изпращай ми напомняне за <strong>моите</strong> имена
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={remindHolidays}
                  onChange={(e) => setRemindHolidays(e.target.checked)}
                  className="mt-1 w-5 h-5 text-primary border-border rounded focus:ring-primary accent-primary"
                />
                <span className="text-text group-hover:text-primary transition-colors">
                  Напомняй ми за официалните празници
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full h-12 px-8 bg-[#F46A03] hover:bg-[#DD5F02] text-white rounded-xl font-semibold transition-colors shadow-lg focus:outline focus:outline-3 focus:outline-[#F4BF3A80] focus:outline-offset-2"
            >
              Абонирай се
            </button>

            {/* Fine Print */}
            <p className="text-sm text-muted text-center mt-4">
              1 имейл преди събитието, 1 в деня. Отписване с 1 клик.
            </p>
          </div>

        </form>
      </div>
    </section>
  )
}

