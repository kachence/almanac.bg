import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faDownload, faEdit, faSearch } from "@fortawesome/free-solid-svg-icons"

const steps = [
  {
    number: 1,
    title: 'Избираш образец',
    description: 'Разглеждаш нашата колекция от готови за употреба документи с подробни инструкции.',
    icon: faSearch,
    color: 'text-primary'
  },
  {
    number: 2,
    title: 'Попълваш данните',
    description: 'Използваш онлайн редактора с автоматични проверки за ЕГН, дати и други полета.',
    icon: faEdit,
    color: 'text-accent'
  },
  {
    number: 3,
    title: 'Сваляш файла',
    description: 'Изтегляш PDF безплатно или DOCX след регистрация с готов за подаване документ.',
    icon: faDownload,
    color: 'text-success'
  }
]

export function HowItWorks() {
  return (
    <section className="relative py-12 lg:py-16">
      {/* Background - same as Hero */}
      <div className="relative mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight text-text mb-6">
            Как работи
          </h2>
          <p className="text-lg text-muted max-w-3xl mx-auto leading-relaxed">
            От идеята до готовия документ в три прости стъпки, без излишни усложнения.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div key={step.number} className="text-center">
              {/* Icon circle */}
              <div className="relative mb-8">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center">
                  <FontAwesomeIcon 
                    icon={step.icon} 
                    className="text-2xl text-primary" 
                  />
                </div>
              </div>
              
              <h3 className="text-xl lg:text-2xl font-semibold text-text mb-4">
                {step.number}. {step.title}
              </h3>
              <p className="text-muted leading-relaxed max-w-sm mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <button className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/60 backdrop-blur-sm px-6 py-3 text-sm font-medium hover:bg-card/80 hover:border-primary/40 transition-all duration-200">
            <FontAwesomeIcon icon={faSearch} className="text-sm" />
            Разгледай всички образци
          </button>
        </div>
      </div>
    </section>
  )
}
