"use client"

// Link not needed; using <motion.a> anchors for cards
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFire, faWandMagicSparkles, faPen } from "@fortawesome/free-solid-svg-icons"
import { analytics } from "@/lib/analytics"

const featuredTemplates = [
  {
    slug: '/templates/jalba-nelk',
    title: 'Жалба до НЕЛК',
    sub: 'Некачествено обслужване',
    version: '2025.09',
    hasDocx: true,
    isPopular: true,
    isUpdated: true
  },
  {
    slug: '/templates/vazrajenie-efish',
    title: 'Възражение е-фиш',
    sub: 'Електронен фиш за нарушение',
    version: '2025.09',
    hasDocx: true,
    isRecent: true
  },
  {
    slug: '/templates/protokol-es',
    title: 'Протокол ЕС',
    sub: 'Избор на управител',
    version: '2025.09',
    hasDocx: false,
    isPopular: true
  },
  {
    slug: '/templates/molba-otpusk',
    title: 'Молба за отпуск',
    sub: 'Платен годишен отпуск',
    version: '2025.09',
    hasDocx: true,
    isPopular: true
  },
  {
    slug: '/templates/dogovor-naem',
    title: 'Договор за наем',
    sub: 'Жилищно помещение',
    version: '2025.09',
    hasDocx: true,
    isRecent: true,
    isUpdated: true
  },
  {
    slug: '/templates/molba-napuskane',
    title: 'Молба за напускане',
    sub: 'Напускане на длъжност',
    version: '2025.09',
    hasDocx: true,
    isRecent: true
  },
  {
    slug: '/templates/zhalba-kzp',
    title: 'Жалба до КЗП',
    sub: 'Некачествени стоки',
    version: '2025.09',
    hasDocx: true,
    isPopular: true,
    isUpdated: true
  },
  {
    slug: '/templates/vazrajenie-nap',
    title: 'Възражение до НАП',
    sub: 'Данъчна оценка',
    version: '2025.09',
    hasDocx: true,
    isRecent: true
  },
  {
    slug: '/templates/pulnomoshto-banka',
    title: 'Пълномощно за банка',
    sub: 'Банкови операции',
    version: '2025.09',
    hasDocx: true,
    isPopular: true
  },
  {
    slug: '/templates/zayavlenie-licenz',
    title: 'Заявление за лиценз',
    sub: 'Търговска дейност',
    version: '2025.09',
    hasDocx: true,
    isUpdated: true
  },
  {
    slug: '/templates/molba-bolnichen',
    title: 'Молба за болничен',
    sub: 'Временна неработоспособност',
    version: '2025.09',
    hasDocx: true,
    isRecent: true
  },
  {
    slug: '/templates/dogovor-rabota',
    title: 'Договор за работа',
    sub: 'Трудов договор',
    version: '2025.09',
    hasDocx: true,
    isPopular: true,
    isUpdated: true
  },
  {
    slug: '/templates/zhalba-mvr',
    title: 'Жалба до МВР',
    sub: 'Полицейска дейност',
    version: '2025.09',
    hasDocx: true,
    isRecent: true
  },
  {
    slug: '/templates/molba-razhod',
    title: 'Молба за разход',
    sub: 'Служебни разходи',
    version: '2025.09',
    hasDocx: false,
    isUpdated: true
  },
  {
    slug: '/templates/dogovor-usluga',
    title: 'Договор за услуга',
    sub: 'Възмездна услуга',
    version: '2025.09',
    hasDocx: true,
    isPopular: true
  },
  {
    slug: '/templates/zayavlenie-pensiya',
    title: 'Заявление за пенсия',
    sub: 'Възрастова пенсия',
    version: '2025.09',
    hasDocx: true,
    isRecent: true,
    isUpdated: true
  }
]

export function FeaturedTemplates() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-12 lg:py-16 bg-bg">
      <div className="mx-auto max-w-8xl">
        <div className="text-center mb-12">
          <h2 className="text-2xl lg:text-3xl font-semibold text-text mb-4">
            Най-търсени образци
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            Готови за изтегляне PDF файлове и DOCX за попълване онлайн
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredTemplates.map((template, index) => (
            <motion.a
              key={template.slug}
              href={template.slug}
              onClick={() => analytics.featuredTemplateClick(template.slug)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05, duration: 0.6 }}
              className="group rounded-2xl border border-border bg-card backdrop-blur-sm p-5 shadow-sm hover:shadow-md hover:border-primary/30 hover:bg-card/80 transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {template.isPopular && (
                      <Badge variant="warning" className="text-[10px] px-1.5 py-0.5 flex items-center gap-1">
                        <FontAwesomeIcon icon={faFire} className="text-[8px]" />
                        Популярен
                      </Badge>
                    )}
                    {template.isRecent && (
                      <Badge variant="accent" className="text-[10px] px-1.5 py-0.5 flex items-center gap-1">
                        <FontAwesomeIcon icon={faWandMagicSparkles} className="text-[8px]" />
                        Нов
                      </Badge>
                    )}
                    {template.isUpdated && (
                      <Badge variant="muted" className="text-[10px] px-1.5 py-0.5 flex items-center gap-1">
                        <FontAwesomeIcon icon={faPen} className="text-[8px]" />
                        Обновен
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-medium text-text group-hover:text-primary transition-colors">
                    {template.title}
                  </h3>
                  <p className="text-xs text-muted mt-0.5">{template.sub}</p>
                </div>
                <button 
                  onClick={(e) => {
                    e.preventDefault()
                    analytics.ctaClick('demo_fill')
                    console.log(`Open editor for ${template.title}`)
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-all duration-200 text-xs rounded-lg border border-border bg-panel/60 px-2 py-1 hover:border-primary/40 hover:bg-primary/5 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary/40"
                  aria-label={`Попълни ${template.title}`}
                >
                  Попълни
                </button>
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <div className="flex gap-2">
                  <Badge variant="pdf" className="text-[10px] px-1.5 py-0.5">PDF</Badge>
                  {template.hasDocx && (
                    <Badge variant="docx" className="text-[10px] px-1.5 py-0.5">DOCX</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[10px] text-muted">
                  <span>v{template.version}</span>
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <a href="/search" className="text-primary hover:text-primary/80 font-medium">
            Виж всички образци →
          </a>
        </div>
      </div>
    </section>
  )
}
