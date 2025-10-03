import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Car, Shield, Calculator, Heart, Building, Zap, Phone, MapPin } from 'lucide-react'

const institutions = [
  {
    slug: 'kat',
    name: 'КАТ',
    fullName: 'Комисия за автомобилно транспорт',
    icon: Car,
    color: 'text-primary'
  },
  {
    slug: 'kzp',
    name: 'КЗП',
    fullName: 'Комисия за защита на потребителите',
    icon: Shield,
    color: 'text-accent'
  },
  {
    slug: 'nap',
    name: 'НАП',
    fullName: 'Национална агенция за приходите',
    icon: Calculator,
    color: 'text-warning'
  },
  {
    slug: 'noi',
    name: 'НОИ',
    fullName: 'Национален осигурителен институт',
    icon: Heart,
    color: 'text-danger'
  },
  {
    slug: 'obshtina-sofia',
    name: 'Община София',
    fullName: 'Столична община',
    icon: Building,
    color: 'text-text'
  },
  {
    slug: 'toplofikaciya',
    name: 'Топлофикация',
    fullName: 'Топлофикация София',
    icon: Zap,
    color: 'text-primary'
  },
  {
    slug: 'evn',
    name: 'EVN',
    fullName: 'Електроразпределение',
    icon: Zap,
    color: 'text-warning'
  },
  {
    slug: 'mvr',
    name: 'МВР',
    fullName: 'Министерство на вътрешните работи',
    icon: Shield,
    color: 'text-danger'
  }
]

export function InstitutionsStrip() {
  return (
    <section className="px-6 lg:px-10 py-16 bg-panel">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl lg:text-3xl font-semibold text-text mb-4">
            Документи по институции
          </h2>
          <p className="text-text-dim max-w-2xl mx-auto">
            Къде се подават и в какъв срок — с линкове към официални източници
          </p>
        </div>
        
        {/* Scrollable strip */}
        <div className="overflow-x-auto pb-4">
          <div className="flex space-x-4 min-w-max">
            {institutions.map((institution) => {
              const IconComponent = institution.icon
              
              return (
                <Link key={institution.slug} href={`/institucii/${institution.slug}`}>
                  <Button 
                    variant="ghost" 
                    className="flex-shrink-0 h-auto p-4 min-w-[160px] flex-col items-center space-y-3 hover:border-primary/40 group"
                  >
                    <div className={`p-3 rounded-xl bg-card group-hover:bg-primary/10 transition-colors`}>
                      <IconComponent className={`h-6 w-6 ${institution.color} group-hover:text-primary transition-colors`} />
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-text group-hover:text-primary transition-colors">
                        {institution.name}
                      </div>
                      <div className="text-xs text-text-dim mt-1 line-clamp-2">
                        {institution.fullName}
                      </div>
                    </div>
                  </Button>
                </Link>
              )
            })}
          </div>
        </div>
        
        {/* Mobile scroll hint */}
        <div className="mt-4 text-center md:hidden">
          <p className="text-xs text-muted">← Плъзнете за повече →</p>
        </div>
        
        {/* Call to action */}
        <div className="mt-8 text-center">
          <Link href="/institucii">
            <Button variant="default">
              <MapPin className="h-4 w-4" />
              Виж всички институции
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
