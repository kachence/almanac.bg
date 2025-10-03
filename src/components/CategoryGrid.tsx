import Link from 'next/link'
import { ChevronRight, FileText, AlertCircle, Send, PenTool, UserCheck, Clipboard, Mail, Paperclip } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const categories = [
  {
    slug: 'zhalbi',
    title: 'Жалби',
    description: 'За некачествено обслужване и нарушения',
    count: 26,
    icon: AlertCircle,
    color: 'text-danger'
  },
  {
    slug: 'vazrazheniya',
    title: 'Възражения',
    description: 'Срещу административни актове',
    count: 18,
    icon: FileText,
    color: 'text-warning'
  },
  {
    slug: 'moli',
    title: 'Молби',
    description: 'За различни услуги и права',
    count: 22,
    icon: Send,
    color: 'text-primary'
  },
  {
    slug: 'zayavleniya',
    title: 'Заявления',
    description: 'За административни процедури',
    count: 31,
    icon: PenTool,
    color: 'text-accent'
  },
  {
    slug: 'pulnomoshtni',
    title: 'Пълномощни',
    description: 'За представителство и упълномощяване',
    count: 14,
    icon: UserCheck,
    color: 'text-primary'
  },
  {
    slug: 'protokoli',
    title: 'Протоколи',
    description: 'За заседания и решения',
    count: 12,
    icon: Clipboard,
    color: 'text-text'
  },
  {
    slug: 'pokani',
    title: 'Покани',
    description: 'За събрания и мероприятия',
    count: 8,
    icon: Mail,
    color: 'text-warning'
  },
  {
    slug: 'aneksi',
    title: 'Анекси',
    description: 'Допълнения към договори',
    count: 15,
    icon: Paperclip,
    color: 'text-muted'
  }
]

export function CategoryGrid() {
  return (
    <section className="px-6 lg:px-10 py-16 bg-bg">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl lg:text-3xl font-semibold text-text mb-4">
            Категории документи
          </h2>
          <p className="text-text-dim max-w-2xl mx-auto">
            Избери категория за да намериш нужния ти документ бързо и лесно
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon
            
            return (
              <Link key={category.slug} href={`/${category.slug}`}>
                <Card className="h-full group cursor-pointer transition-all duration-200 hover:scale-105">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-card ${category.color}/10`}>
                        <IconComponent className={`h-6 w-6 ${category.color}`} />
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-muted">{category.count} шаблона</span>
                        <ChevronRight className="h-4 w-4 text-muted mt-1 group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-text mb-2 group-hover:text-primary transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-sm text-text-dim leading-relaxed">
                      {category.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
