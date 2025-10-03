import Link from 'next/link'
import { Clock, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const recentUpdates = [
  {
    slug: 'zhalba-nelk-obrazec',
    title: 'Жалба до НЕЛК — образец',
    version: '2025.09',
    date: '2025-09-15',
    changeType: 'Обновяване',
    description: 'Актуализирани изисквания за данни и нови полета за контакт'
  },
  {
    slug: 'vazrazhenie-elektronni-fish-obrazec',
    title: 'Възражение електронен фиш — образец',
    version: '2025.09',
    date: '2025-09-10',
    changeType: 'Обновяване',
    description: 'Добавени инструкции за онлайн подаване в КАТ'
  },
  {
    slug: 'molba-otpusk-obrazec',
    title: 'Молба за отпуск — образец',
    version: '2025.09',
    date: '2025-09-12',
    changeType: 'Нов документ',
    description: 'Новодобавен шаблон за служебна молба за отпуск'
  },
  {
    slug: 'zhalba-kzp-nekachestvo-obrazec',
    title: 'Жалба до КЗП — некачество',
    version: '2025.09',
    date: '2025-09-14',
    changeType: 'Обновяване',
    description: 'Актуализирани адреси на регионалните дирекции на КЗП'
  },
  {
    slug: 'vazrazhenie-dan-otsenka-obrazec',
    title: 'Възражение данъчна оценка',
    version: '2025.08',
    date: '2025-08-28',
    changeType: 'Обновяване',
    description: 'Нови срокове и процедури за 2025 година'
  }
]

export function RecentUpdates() {
  return (
    <section className="px-6 lg:px-10 py-16 bg-bg">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Последни актуализации
            </CardTitle>
            <p className="text-sm text-text-dim">
              Следим официалните източници и обновяваме документите редовно
            </p>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              {recentUpdates.map((update) => (
                <Link key={update.slug} href={`/${update.slug}`}>
                  <div className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/40 hover:bg-card/50 transition-all group cursor-pointer">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-text group-hover:text-primary transition-colors line-clamp-1">
                          {update.title}
                        </h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge 
                            variant={update.changeType === 'Нов документ' ? 'success' : 'default'} 
                            className="text-xs"
                          >
                            {update.changeType}
                          </Badge>
                          <Badge variant="muted" className="text-xs">
                            v{update.version}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm text-text-dim mb-2 line-clamp-2">
                        {update.description}
                      </p>
                      
                      <div className="flex items-center gap-1 text-xs text-muted">
                        <Clock className="h-3 w-3" />
                        <span>
                          {new Date(update.date).toLocaleDateString('bg-BG', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                    
                    <ChevronRight className="h-5 w-5 text-muted group-hover:text-primary transition-colors flex-shrink-0 ml-4" />
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t border-border text-center">
              <Link 
                href="/changelog" 
                className="text-primary hover:text-primary-700 font-medium text-sm"
              >
                Виж пълния списък с промени →
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
