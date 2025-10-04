import { CircleHelp } from 'lucide-react'

const faqs = [
  {
    id: 1,
    question: 'Как се изчислява Великден?',
    answer: 'Великден се изчислява според Александрийската пасхалия и Юлианския календар. Датата е първата неделя след първото пълнолуние, което настъпва на или след пролетното равноденствие.'
  },
  {
    id: 2,
    question: 'Кои са неработните дни през 2025?',
    answer: 'Официалните неработни дни се определят ежегодно с решение на Министерския съвет. Включват национални празници, както и преместени почивни дни за удължени уикенди.'
  },
  {
    id: 3,
    question: 'Как да добавя имен ден в Google Calendar?',
    answer: 'При всеки имен ден има бутон "Добави в календара", който генерира ICS файл. Отворете файла с Google Calendar или друго приложение за календар и събитието автоматично ще се добави.'
  },
  {
    id: 4,
    question: 'Откъде са данните за имени дни?',
    answer: 'Данните за имени дни се базират на официалния календар на Българската православна църква (БПЦ), като включват и народни традиции и варианти на имена.'
  },
  {
    id: 5,
    question: 'Как работят напомнянията?',
    answer: 'След абониране получавате 2 имейла: един ден преди събитието и един в деня на събитието. Можете да се отпишете по всяко време с 1 клик.'
  },
  {
    id: 6,
    question: 'Могат ли да се изтеглят картичките безплатно?',
    answer: 'Да, всички картички и поздрави са напълно безплатни. Можете да копирате текста или да изтеглите изображението директно.'
  }
]

export function FAQ() {
  return (
    <section className="relative py-12 lg:py-16">
      {/* Background - same as Hero and HowItWorks */}
      <div className="absolute inset-0 blueprint-grid noise-overlay opacity-30"></div>
      
      <div className="relative mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/20 rounded-full mb-4">
            <CircleHelp className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight text-text mb-6">
            Често задавани въпроси
          </h2>
          <p className="text-lg text-muted leading-relaxed">
            Имате различен въпрос и не можете да намерите отговора, който търсите? Свържете се с нас чрез{' '}
            <a href="mailto:contact@almanac.bg" className="font-semibold text-primary hover:text-primary/80 transition-colors">
              изпращане на имейл
            </a>{' '}
            и ще ви отговорим възможно най-скоро.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-8xl mx-auto">
          {faqs.map((faq) => (
            <div key={faq.id} className="bg-card rounded-2xl border border-border p-6">
              <h3 className="text-base font-semibold text-text mb-3">{faq.question}</h3>
              <p className="text-sm text-muted leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
