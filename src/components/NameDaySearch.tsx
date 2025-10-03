'use client'

import { Search } from 'lucide-react'
import { useState } from 'react'

const ALPHABET = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З', 'И', 'Й', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ю', 'Я']

const TOP_NAMES = ['Иван', 'Георги', 'Димитър', 'Мария', 'Елена', 'Николай', 'Петър', 'Стефан']

export function NameDaySearch() {
  const [query, setQuery] = useState('')

  return (
    <section id="imen-den" className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
            Кога е имен ден на…
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            Напиши име — ще ти покажем точната дата, традициите и бързи поздрави.
          </p>
        </div>

        {/* Search Input */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Търси име... (напр. Иван, Мария, Георги)"
              className="w-full pl-12 pr-4 py-4 bg-card border-2 border-border rounded-xl text-text placeholder-muted focus:outline-none focus:border-primary transition-colors text-lg shadow-sm"
            />
          </div>
        </div>

        {/* Alphabet Index */}
        <div className="mb-8">
          <p className="text-sm font-medium text-muted mb-3 text-center">
            Азбучен индекс:
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {ALPHABET.map((letter) => (
              <button
                key={letter}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-card border border-border hover:border-primary hover:bg-accent/10 hover:text-primary transition-colors font-medium text-text"
              >
                {letter}
              </button>
            ))}
          </div>
        </div>

        {/* Top Names This Month */}
        <div>
          <p className="text-sm font-medium text-muted mb-3 text-center">
            Топ имена този месец:
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {TOP_NAMES.map((name) => (
              <button
                key={name}
                className="px-4 py-2 bg-card border border-border hover:border-primary hover:bg-accent/10 hover:text-primary rounded-full transition-colors font-medium text-text"
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* Reminder CTA */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted">
            💡 Добави напомняне за 2026
          </p>
        </div>
      </div>
    </section>
  )
}

