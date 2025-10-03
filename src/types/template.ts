export interface FormField {
  id: string
  label: string
  type: 'text' | 'email' | 'tel' | 'number' | 'date' | 'textarea' | 'dynamic_list'
  placeholder?: string
  required?: boolean
  maxLength?: number
  min?: number
  max?: number
  rows?: number
  gridSize?: 'full' | 'half' | 'third'
  // Dynamic list specific properties
  minItems?: number
  maxItems?: number
  defaultItems?: number
  itemFields?: FormField[]
}

export interface FormSection {
  section: string
  title: string
  icon: 'primary' | 'accent' | 'warning' | 'success'
  fields: FormField[]
}

export interface RelatedTemplate {
  slug: string
  title: string
  subtitle: string
  category: string
}

export interface TemplateVariant {
  label: string
  slug: string
  description?: string
}

export interface Source {
  title: string
  url: string
  lastChecked: string
}

export interface FAQ {
  question: string
  answer: string
}

export interface TemplateSubmission {
  where: string
  how: string
  url: string
}

export interface TemplateMeta {
  icon: string
  usage: string
  deadline: string
  submission: TemplateSubmission
}

export interface TemplateSectionWithContent {
  title: string
  content: string
}

export interface TemplateSectionWithItems {
  title: string
  items: string[]
}

export interface TemplateData {
  id: string
  title: string
  subtitle: string
  version: string
  lastReviewed: string
  category: string
  institution: string
  fileSize: string
  hasDocx: boolean
  description: string
  meta: TemplateMeta
  pdfTemplate: string
  formSchema: FormSection[]
  prerequisites: string[]
  steps: string[]
  requiredDocuments: string[]
  commonMistakes: string[]
  sources: Source[]
  relatedTemplates: RelatedTemplate[]
  faq: FAQ[]
  variants?: TemplateVariant[]
  hasOnlineEditor?: boolean
  downloadFormats?: string[]
  // Optional rich guidance sections for static PDF templates
  usageInstructions?: TemplateSectionWithContent
  whenToUse?: TemplateSectionWithItems
  importantNotes?: TemplateSectionWithItems
}
