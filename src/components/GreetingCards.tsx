'use client'

import { Copy, Download, Image as ImageIcon } from 'lucide-react'
import { useState } from 'react'

const TABS = ['Имен ден', 'Рожден ден', 'Празници', 'По име']

const SAMPLE_CARDS = [
  { id: 1, title: 'Честит имен ден, Иване!', image: '/cards/sample-1.jpg' },
  { id: 2, title: 'Честит рожден ден!', image: '/cards/sample-2.jpg' },
  { id: 3, title: 'Честит празник!', image: '/cards/sample-3.jpg' },
  { id: 4, title: 'Честита Баба Марта!', image: '/cards/sample-4.jpg' },
]

export function GreetingCards() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
            Картички и кратки поздрави
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            Копирай кратък поздрав или изтегли готова картичка за секунди.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {TABS.map((tab, index) => (
            <button
              key={tab}
              onClick={() => setActiveTab(index)}
              className={`
                px-6 py-2.5 rounded-full font-medium transition-all
                ${activeTab === index
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-card text-text border border-border hover:border-primary hover:bg-accent/10'
                }
              `}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {SAMPLE_CARDS.map((card) => (
            <div
              key={card.id}
              className="bg-card rounded-2xl overflow-hidden border border-border shadow-[0_1px_2px_rgba(31,25,21,.08),0_8px_24px_rgba(31,25,21,.06)] hover:shadow-[0_4px_8px_rgba(31,25,21,.12),0_12px_32px_rgba(31,25,21,.08)] transition-shadow"
            >
              {/* Image Placeholder */}
              <div className="aspect-[4/3] bg-accent/10 flex items-center justify-center border-b border-border">
                <ImageIcon className="w-12 h-12 text-muted" />
              </div>
              
              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-text mb-3">
                  {card.title}
                </h3>
                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 bg-panel hover:bg-accent/10 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 text-text">
                    <Copy className="w-4 h-4" />
                    Копирай
                  </button>
                  <button className="flex-1 px-3 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    Изтегли
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Generator CTA */}
        <div className="text-center">
          <button className="h-12 px-8 bg-[#F46A03] hover:bg-[#DD5F02] text-white rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl focus:outline focus:outline-3 focus:outline-[#F4BF3A80] focus:outline-offset-2">
            Генерирай картичка →
          </button>
        </div>
      </div>
    </section>
  )
}

