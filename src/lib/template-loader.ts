import { TemplateData } from '@/types/template'

export async function loadTemplate(templateId: string): Promise<TemplateData> {
  try {
    const templateModule = await import(`@/data/templates/${templateId}.json`)
    return templateModule.default as TemplateData
  } catch (error) {
    console.error(`Failed to load template: ${templateId}`, error)
    throw new Error(`Template not found: ${templateId}`)
  }
}

export function getIconClassName(iconName: string): string {
  const iconMap: Record<string, string> = {
    'primary': 'w-2 h-2 rounded-full bg-primary',
    'accent': 'w-2 h-2 rounded-full bg-accent', 
    'warning': 'w-2 h-2 rounded-full bg-warning',
    'success': 'w-2 h-2 rounded-full bg-success'
  }
  
  return iconMap[iconName] || iconMap.primary
}

export function getGridClassName(gridSize?: string): string {
  switch (gridSize) {
    case 'half': return 'grid-cols-2 gap-3'
    case 'third': return 'grid-cols-3 gap-2'
    default: return ''
  }
}

// Dynamic PDF template loader
export async function loadPDFTemplate(templateName: string) {
  try {
    const pdfModule = await import(`@/components/pdf-templates/${templateName}`)
    return pdfModule.default
  } catch (error) {
    console.error(`Error loading PDF template ${templateName}:`, error)
    throw new Error(`PDF template ${templateName} not found`)
  }
}
