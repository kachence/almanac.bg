"use client"

import * as React from "react"
import { motion } from 'framer-motion'
import { Download, FileText, Edit3, ExternalLink, Clock, MapPin, AlertTriangle, CheckCircle2, ArrowRight, ChevronRight } from 'lucide-react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGavel, faDownload, faEdit, faExternalLinkAlt, faInfoCircle, faWarning, faPrint, faSignature, faSave, faCheck, faExclamationTriangle, faSpinner, faUser, faPrayingHands, faFileContract, faGraduationCap } from "@fortawesome/free-solid-svg-icons"
import PDFPreview, { PDFDownloadLink } from '@/components/pdf-templates/PDFPreview'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { analytics } from "@/lib/analytics"
import { saveDocument, loadPrefillData } from "@/lib/document-save"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/components/ui/toast"
import AuthModal from "@/components/AuthModal"
import { FormBuilder } from "@/components/FormBuilder"
import { loadPDFTemplate } from "@/lib/template-loader"
import { TemplateData } from "@/types/template"

interface TemplateDetailClientProps {
  templateData: TemplateData
  params: {
    category: string
    slug: string
  }
}

// Icon mapping function
const getTemplateIcon = (iconName: string) => {
  const iconMap: Record<string, any> = {
    faGavel,
    faPrayingHands,
    faFileContract,
    faGraduationCap,
    faFileAlt: faGavel, // fallback for old templates
    faDownload,
    faEdit,
    faExternalLinkAlt,
    faInfoCircle,
    faWarning,
    faPrint,
    faSignature,
    faSave,
    faCheck,
    faExclamationTriangle,
    faSpinner,
    faUser
  }
  return iconMap[iconName] || faGavel // fallback to faGavel if icon not found
}

export default function TemplateDetailClient({ templateData, params }: TemplateDetailClientProps) {
  const auth = useAuth()
  const { addToast } = useToast()
  const [PDFTemplate, setPDFTemplate] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)
  const [showEditor, setShowEditor] = React.useState(false)
  const [pdfContainerHeight, setPdfContainerHeight] = React.useState<number>(1100)
  const [isMultiPage, setIsMultiPage] = React.useState<boolean>(false)
  const [isSaving, setIsSaving] = React.useState(false)
  const [showAuthModal, setShowAuthModal] = React.useState(false)
  
  // Form state for live preview - initialized empty, will be populated from template schema
  const [formData, setFormData] = React.useState<Record<string, any>>({})

  // Separate state for PDF rendering (updates only when user stops typing)
  const [pdfData, setPdfData] = React.useState(formData)

  // Load PDF template and initialize form data
  React.useEffect(() => {
    const loadPDFTemplateData = async () => {
      try {
        setLoading(true)
        
        // Check if template has online editor
        if (templateData.hasOnlineEditor === false || !templateData.pdfTemplate) {
          // Skip PDF template loading for templates without online editor or PDF template
          setLoading(false)
          return
        }
        
        // Load the corresponding PDF template
        const pdfTemplate = await loadPDFTemplate(templateData.pdfTemplate)
        setPDFTemplate(() => pdfTemplate)
        
        // Initialize form data with empty values for all fields
        const initialFormData: Record<string, any> = {}
        templateData.formSchema?.forEach(section => {
          section.fields.forEach(field => {
            if (field.type === 'dynamic_list') {
              // Initialize dynamic lists with default number of items
              const defaultItems = field.defaultItems || 3
              const emptyItems = Array(defaultItems).fill({}).map(() => ({}))
              initialFormData[field.id] = emptyItems
            } else {
              initialFormData[field.id] = ''
            }
          })
        })
        setFormData(initialFormData)
        setPdfData(initialFormData)
        
      } catch (error) {
        console.error('Error loading PDF template:', error)
        addToast({
          type: 'error',
          message: 'Възникна грешка при зареждането на PDF шаблона'
        })
      } finally {
        setLoading(false)
      }
    }
    
    loadPDFTemplateData()
  }, [templateData, addToast])

  // Debounce PDF updates to eliminate flicker
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setPdfData(formData)
    }, 1000) // 1 second delay - only update when user stops typing

    return () => clearTimeout(timer)
  }, [formData])

  // Load prefill data from documents modal
  React.useEffect(() => {
    const loadData = async () => {
      const prefillData = await loadPrefillData()
      if (prefillData) {
        setFormData(prev => ({ ...prev, ...prefillData }))
        addToast({ 
          type: 'success', 
          message: 'Данните от запазения документ са заредени успешно!',
          duration: 3000 
        })
      }
    }
    
    // Load data on mount
    loadData()
    
    // Listen for new prefill data being saved
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'blanka_prefill_data' && e.newValue) {
        // Small delay to ensure data is written
        setTimeout(loadData, 100)
      }
    }
    
    // Also listen for custom event (for same-tab updates)
    const handlePrefillUpdate = () => {
      setTimeout(loadData, 100)
    }
    
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('prefillDataUpdated', handlePrefillUpdate)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('prefillDataUpdated', handlePrefillUpdate)
    }
  }, [addToast])

  // Check if user is authenticated before allowing editor interactions
  const requireAuth = () => {
    if (!auth.user) {
      addToast({
        type: 'info',
        message: 'Онлайн редакторът може да се използва само от регистрирани потребители. Моля влезте в профила си.',
        duration: 5000
      })
      setShowAuthModal(true)
      return false
    }
    return true
  }

  // Get input styling based on auth status
  const getInputClassName = () => {
    return `w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
      auth.user 
        ? "border-border bg-card text-text placeholder:text-muted focus:ring-primary/40 focus:border-primary/60" 
        : "border-border/50 bg-muted/30 text-muted placeholder:text-muted cursor-pointer"
    }`
  }

  // Update form field (with auth protection)
  const updateFormField = (field: string, value: string) => {
    if (!requireAuth()) return
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Update dynamic list field
  const updateDynamicListField = (field: string, index: number, subField: string, value: string) => {
    if (!requireAuth()) return
    
    setFormData(prev => {
      const currentList = Array.isArray(prev[field]) ? [...prev[field]] : []
      
      // Ensure we have enough items
      while (currentList.length <= index) {
        currentList.push({})
      }
      
      currentList[index] = {
        ...currentList[index],
        [subField]: value
      }
      
      return {
        ...prev,
        [field]: currentList
      }
    })
  }

  // Add new item to dynamic list
  const addDynamicListItem = (field: string) => {
    if (!requireAuth()) return
    
    setFormData(prev => {
      const currentList = Array.isArray(prev[field]) ? [...prev[field]] : []
      return {
        ...prev,
        [field]: [...currentList, {}]
      }
    })
  }

  // Remove item from dynamic list
  const removeDynamicListItem = (field: string, index: number) => {
    if (!requireAuth()) return
    
    setFormData(prev => {
      const currentList = Array.isArray(prev[field]) ? [...prev[field]] : []
      currentList.splice(index, 1)
      return {
        ...prev,
        [field]: currentList
      }
    })
  }

  const handleDownloadPDF = async () => {
    if (!requireAuth()) return
    
    analytics.ctaClick('demo_fill')
    try {
      // Import React-PDF and generate PDF
      const { pdf, Document, Page } = await import('@react-pdf/renderer')
      
      // Generate PDF blob using current form data
      const template = React.createElement(PDFTemplate, { formData: pdfData }) as any
      const blob = await pdf(template).toBlob()
      
      // Create download link
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${templateData?.title?.replace(/\s+/g, '_') || 'Документ'}_${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error generating PDF:', error)
      addToast({ 
        type: 'error', 
        message: 'Възникна грешка при генериране на PDF файла' 
      })
    }
  }

  const handlePrint = async () => {
    if (!requireAuth()) return
    
    analytics.ctaClick('demo_fill')
    try {
      // Generate PDF blob
      const { pdf } = await import('@react-pdf/renderer')
      
      const template = React.createElement(PDFTemplate, { formData: pdfData }) as any
      const blob = await pdf(template).toBlob()
      
      // Create blob URL and open in new tab for printing
      const url = URL.createObjectURL(blob)
      const printWindow = window.open(url, '_blank')
      
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print()
          // Clean up URL after printing
          setTimeout(() => {
            URL.revokeObjectURL(url)
          }, 1000)
        }
      } else {
        addToast({ 
          type: 'error', 
          message: 'Моля разрешете pop-up прозорци за принтиране' 
        })
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Error preparing document for printing:', error)
      addToast({ 
        type: 'error', 
        message: 'Възникна грешка при подготовката за принтиране' 
      })
    }
  }

  const handleOpenEditor = () => {
    analytics.ctaClick('demo_fill')
    
    // Check authentication first
    if (!requireAuth()) return
    
    // Scroll to the editor section
    const editorSection = document.getElementById('editor-section')
    if (editorSection) {
      editorSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      })
      
      // Focus first input field after a short delay for smooth scrolling
      setTimeout(() => {
        const firstInput = editorSection.querySelector('input, textarea, select')
        if (firstInput) {
          (firstInput as HTMLElement).focus()
        }
      }, 800) // Wait for scroll animation to complete
    }
    
    setShowEditor(true)
  }

  const handleSign = () => {
    if (!requireAuth()) return
    
    analytics.ctaClick('demo_fill')
    // Placeholder for eSign integration (EuroTrust, Borica, etc.)
    addToast({ 
      type: 'info', 
      message: 'Функцията за електронно подписване ще бъде добавена скоро. За момента можете да разпечатате документа и да го подпишете ръчно.',
      duration: 5000 
    })
  }

  const handleSave = async () => {
    if (!requireAuth()) return

    setIsSaving(true)

    try {
      await saveDocument({
        templateSlug: templateData!.id,
        templateTitle: templateData!.title,
        documentData: pdfData
      })

      addToast({ 
        type: 'success', 
        message: 'Документът е запазен успешно!',
        duration: 3000 
      })

    } catch (error: any) {
      console.error('Error saving document:', error)
      addToast({ 
        type: 'error', 
        message: error.message || 'Възникна грешка при запазването' 
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Early return for loading state
  if (loading || (!PDFTemplate && templateData.hasOnlineEditor !== false)) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-bg flex items-center justify-center">
          <div className="text-center">
            <FontAwesomeIcon icon={faSpinner} className="text-2xl text-primary animate-spin mb-4" />
            <p className="text-muted">Зареждане на шаблона...</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-bg">
        {/* Header Section */}
        <section className="pt-8 lg:pt-12">
          <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
            {/* Breadcrumbs */}
            <nav className="flex items-center text-sm text-muted" aria-label="Breadcrumb">
              <a href="/" className="hover:text-text transition-colors">Начало</a>
              <ChevronRight className="h-4 w-4 mx-2" />
              <a href="/obrazec" className="hover:text-text transition-colors">Образци</a>
              <ChevronRight className="h-4 w-4 mx-2" />
              <a href={`/obrazec/${params.category}`} className="hover:text-text transition-colors">{templateData.category}</a>
              <ChevronRight className="h-4 w-4 mx-2" />
              <span className="text-text font-medium">{templateData.title}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 mt-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/15 border-2 border-primary flex items-center justify-center">
                      <FontAwesomeIcon icon={getTemplateIcon(templateData.meta.icon)} className="text-lg text-primary" />
                    </div>
                    <div>
                      <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight text-text">
                        {templateData.title}
                      </h1>
                      <p className="text-lg text-muted mt-1">{templateData.subtitle}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <Badge variant="muted" className="text-sm">
                      Обновено: {templateData.lastReviewed}
                    </Badge>
                    
                    {/* Variants Navigation */}
                    {templateData.variants && templateData.variants.length > 0 && (
                      <div className="flex items-center gap-2">
                        {templateData.variants.map((variant, index) => (
                          <a
                            key={variant.slug}
                            href={variant.slug}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full border border-border hover:border-primary/40 hover:bg-primary/5 transition-colors group"
                            title={variant.description}
                          >
                            <span className="text-text group-hover:text-primary transition-colors">
                              {variant.label}
                            </span>
                            <ArrowRight className="h-3 w-3 text-muted group-hover:text-primary transition-colors" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <p className="text-lg text-text/80 leading-relaxed">
                    {templateData.description}
                  </p>
                </motion.div>
              </div>

              {/* Sticky Action Box */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="sticky top-20"
                >
                  <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-text mb-4">Свали документа</h3>
                    
                    <div className="space-y-3">
                      {templateData.hasOnlineEditor !== false ? (
                        <Button
                          onClick={handleOpenEditor}
                          className="w-full justify-start gap-3 h-12 border border-border hover:border-accent/40"
                          size="lg"
                        >
                          <FontAwesomeIcon icon={faEdit} className="text-sm" />
                          Попълни онлайн
                        </Button>
                      ) : (
                        <div className="p-4 border border-orange-200 bg-orange-50 rounded-lg">
                          <div className="flex items-center gap-2 text-orange-700 mb-2">
                            <FontAwesomeIcon icon={faInfoCircle} className="text-sm" />
                            <span className="text-sm font-medium">Онлайн редактор недостъпен</span>
                          </div>
                          <p className="text-sm text-orange-600">
                            Този документ не може да бъде редактиран онлайн. Можете да свалите готовия PDF файл.
                          </p>
                        </div>
                      )}
                      
                      {templateData.hasOnlineEditor !== false && PDFTemplate && (
                        <div>
                          <PDFDownloadLink
                            document={React.createElement(PDFTemplate, { formData }) as any}
                            fileName={`${params.slug}-${formData.fullName ? formData.fullName.replace(/\s+/g, '-').toLowerCase() : 'obrazec'}.pdf`}
                            style={{ width: '100%' }}
                          >
                          {({ loading }) => (
                            <Button
                              className="w-full justify-start gap-3 h-12"
                              variant="ghost"
                              size="lg"
                              disabled={loading}
                            >
                              <FontAwesomeIcon icon={faDownload} className="text-sm" />
                              {loading ? 'Генериране...' : 'Свали PDF'}
                            </Button>
                          )}
                          </PDFDownloadLink>
                        </div>
                      )}
                      
                      {templateData.hasOnlineEditor === false && (
                        <Button
                          asChild
                          className="w-full justify-start gap-3 h-12"
                          size="lg"
                        >
                          <a href={`/obrazec/${params.slug}.pdf`} target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faDownload} className="text-sm" />
                            Свали PDF
                          </a>
                        </Button>
                      )}
                      
                      {templateData.downloadFormats?.includes('docx') && (
                        <Button
                          asChild
                          variant="ghost"
                          className="w-full justify-start gap-3 h-12 border border-border hover:border-primary/40"
                          size="lg"
                        >
                          <a href={`/obrazec/${params.slug}.docx`} download>
                            <FontAwesomeIcon icon={faDownload} className="text-sm" />
                            Свали DOCX
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Template Preview */}
        <section id="editor-section" className="pt-6 pb-12 lg:pb-16">
          <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-text mb-8">
                Преглед и попълване на документа
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:items-start">
                {/* PDF Preview */}
                <div 
                  className="rounded-2xl border border-border bg-card overflow-hidden h-fit flex flex-col"
                  style={{ height: `${pdfContainerHeight}px` }}
                >
                  {/* PDF Header */}
                  <div className="px-6 py-4 border-b border-border bg-panel/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-text">Преглед на документа</h3>
                          <p className="text-xs text-muted">PDF • {templateData.fileSize} • A4 формат</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="pdf" className="text-xs">PDF</Badge>
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="gap-2 text-xs h-8"
                        >
                          <a href={`/obrazec/${params.slug}.pdf`} target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faExternalLinkAlt} className="text-[10px]" />
                            Увеличи
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* PDF Viewer */}
                  <div className="relative" style={{ height: `${pdfContainerHeight - 145}px` }}>
                    {templateData.hasOnlineEditor === false ? (
                      <iframe
                        src={`/obrazec/${params.slug}.pdf`}
                        width="100%"
                        height="100%"
                        className="border-0"
                        title={templateData.title}
                      />
                    ) : (
                      PDFTemplate && (
                        <PDFPreview 
                          formData={pdfData}
                          PDFTemplate={PDFTemplate}
                          onDownloadPDF={handleDownloadPDF}
                          onDownloadDOCX={() => {}} // Empty function since DOCX is disabled
                          onHeightChange={(height) => setPdfContainerHeight(height + 145)} // Add header + footer height
                          onPageCountChange={(isMulti) => setIsMultiPage(isMulti)}
                        />
                      )
                    )}
                    
                    {/* Mobile warning overlay */}
                    <div className="absolute inset-0 bg-card/95 backdrop-blur-sm flex items-center justify-center p-6 md:hidden">
                      <div className="text-center max-w-sm">
                        <FileText className="h-12 w-12 text-muted mx-auto mb-4" />
                        <h4 className="font-medium text-text mb-2">Мобилен преглед</h4>
                        <p className="text-sm text-muted mb-4">
                          За по-добро възприемане на документа, препоръчваме да го отворите в нов прозорец
                        </p>
                        <div className="flex flex-col gap-2">
                          <Button
                            asChild
                            size="sm"
                            className="gap-2"
                          >
                            <a href={`/obrazec/${params.slug}.pdf`} target="_blank" rel="noopener noreferrer">
                              <FontAwesomeIcon icon={faExternalLinkAlt} className="text-xs" />
                              Отвори в нов прозорец
                            </a>
                          </Button>
                          <Button
                            onClick={handleDownloadPDF}
                            variant="ghost"
                            size="sm"
                            className="gap-2"
                          >
                            <FontAwesomeIcon icon={faDownload} className="text-xs" />
                            Свали директно
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                
                  {/* PDF Controls Footer */}
                  <div className="px-6 py-4 border-t border-border bg-panel/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-muted">
                          Данните се съхраняват само локално във Вашия браузър
                        </span>
                      </div>
                      {templateData.hasOnlineEditor !== false && (
                        <div className="flex gap-2">
                          <Button
                            onClick={handleOpenEditor}
                            variant="ghost"
                            size="sm"
                            className="gap-2 text-xs"
                          >
                            <FontAwesomeIcon icon={faEdit} className="text-[10px]" />
                            Попълни онлайн
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Online Editor */}
                <div 
                  className="lg:sticky lg:top-20 lg:self-start h-fit"
                  style={{ height: `${pdfContainerHeight}px` }}
                >
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    viewport={{ once: true }}
                    className="rounded-2xl border border-border bg-card overflow-hidden h-full flex flex-col"
                  >
                    {templateData.hasOnlineEditor === false ? (
                      /* No Editor Available */
                      <>
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-border bg-panel/30">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-orange-100 border border-orange-300 flex items-center justify-center">
                              <FontAwesomeIcon icon={faInfoCircle} className="h-4 w-4 text-orange-600" />
                            </div>
                            <div>
                              <h3 className="font-medium text-text">Информация за документа</h3>
                              <p className="text-xs text-muted">Официален образец за сваляне</p>
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6 flex-1">
                          <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-orange-100 border border-orange-300 flex items-center justify-center mx-auto mb-4">
                              <FontAwesomeIcon icon={faFileContract} className="h-8 w-8 text-orange-600" />
                            </div>
                            <h4 className="font-semibold text-text mb-3">Онлайн редактор недостъпен</h4>
                            <p className="text-sm text-muted mb-6 leading-relaxed">
                              {templateData.description}
                            </p>
                            
                            <div className="space-y-4">
                              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-left">
                                <h5 className="font-medium text-blue-900 mb-2">{templateData.whenToUse?.title || '📋 Кога се използва:'}</h5>
                                <ul className="text-sm text-blue-800 space-y-1">
                                  {(templateData.whenToUse?.items || templateData.prerequisites || []).map((item: string, idx: number) => (
                                    <li key={`use-${idx}`}>• {item}</li>
                                  ))}
                                </ul>
                              </div>

                              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-left">
                                <h5 className="font-medium text-green-900 mb-2">{templateData.requiredDocuments ? '✅ Необходими документи:' : (templateData.steps ? '✅ Стъпки накратко:' : '✅ Ключови елементи:')}</h5>
                                <ul className="text-sm text-green-800 space-y-1">
                                  {(templateData.requiredDocuments || (templateData.steps ? templateData.steps.slice(0, 6) : [])).map((item: string, idx: number) => (
                                    <li key={`key-${idx}`}>• {item}</li>
                                  ))}
                                </ul>
                              </div>

                              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-left">
                                <h5 className="font-medium text-amber-900 mb-2">{templateData.importantNotes?.title || '⚠️ Важно за запомняне:'}</h5>
                                <ul className="text-sm text-amber-800 space-y-1">
                                  {(templateData.importantNotes?.items || (templateData.commonMistakes ? templateData.commonMistakes.slice(0, 6) : [])).map((item: string, idx: number) => (
                                    <li key={`imp-${idx}`}>• {item}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-border bg-panel/20">
                          <div className="text-center">
                            <Button
                              asChild
                              className="gap-2"
                              size="sm"
                            >
                              <a href={`/obrazec/${params.slug}.pdf`} target="_blank" rel="noopener noreferrer">
                                <FontAwesomeIcon icon={faDownload} className="text-xs" />
                                Свали PDF образеца
                              </a>
                            </Button>
                          </div>
                        </div>
                      </>
                    ) : (
                      /* Normal Online Editor */
                      <>
                        {/* Editor Header */}
                        <div className="px-6 py-4 border-b border-border bg-panel/30">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center">
                              <FontAwesomeIcon icon={faEdit} className="h-4 w-4 text-accent" />
                            </div>
                            <div>
                              <h3 className="font-medium text-text">Онлайн редактор</h3>
                              <p className="text-xs text-muted">Попълнете полетата за автоматично генериране</p>
                            </div>
                          </div>
                        </div>

                        {/* Form Fields */}
                        <div className={`p-6 space-y-6 flex-1 relative ${auth.user ? 'overflow-y-auto' : 'overflow-hidden'}`}>
                          {/* Auth overlay for unauthenticated users */}
                          {!auth.user && (
                            <div className="absolute inset-0 bg-card/90 backdrop-blur-sm z-50 flex items-center justify-center">
                              <div className="text-center">
                                <FontAwesomeIcon icon={faEdit} className="text-2xl text-muted mb-3" />
                                <h4 className="font-medium text-text mb-2">Онлайн редактор</h4>
                                <p className="text-sm text-muted mb-4 max-w-xs">
                                  За да използвате онлайн редактора, моля влезте в профила си или се регистрирайте
                                </p>
                                <Button
                                  onClick={() => setShowAuthModal(true)}
                                  size="sm"
                                  className="gap-2"
                                >
                                  <FontAwesomeIcon icon={faUser} className="text-xs" />
                                  Влез в профила
                                </Button>
                              </div>
                            </div>
                          )}
                          
                          {/* Form content - always render but hidden when not authenticated */}
                          <div className={!auth.user ? 'pointer-events-none select-none' : ''}>
                            {templateData.formSchema && (
                              <FormBuilder
                                formSchema={templateData.formSchema}
                                formData={formData}
                                updateFormField={updateFormField}
                                updateDynamicListField={updateDynamicListField}
                                addDynamicListItem={addDynamicListItem}
                                removeDynamicListItem={removeDynamicListItem}
                                getInputClassName={getInputClassName}
                                isAuthenticated={!!auth.user}
                              />
                            )}
                          </div>
                        </div>
                        
                        {/* Editor Footer */}
                        <div className="px-6 py-4 border-t border-border bg-panel/20">
                          <div className="flex items-center justify-center">
                            <div className={`flex gap-2 ${!auth.user ? 'cursor-pointer' : ''}`}
                                 onClick={!auth.user ? () => requireAuth() : undefined}>
                              <Button
                                onClick={handleDownloadPDF}
                                disabled={!auth.user}
                                variant="ghost"
                                size="sm"
                                className="gap-2 text-xs"
                              >
                                <FontAwesomeIcon icon={faDownload} className="text-[10px]" />
                                PDF
                              </Button>
                              <Button
                                onClick={handlePrint}
                                disabled={!auth.user}
                                variant="ghost"
                                size="sm"
                                className="gap-2 text-xs"
                              >
                                <FontAwesomeIcon icon={faPrint} className="text-[10px]" />
                                Принтирай
                              </Button>
                                <Button
                                  onClick={handleSave}
                                  disabled={isSaving || !auth.user}
                                  variant="ghost"
                                  size="sm"
                                  className="gap-2 text-xs"
                                >
                                  {isSaving ? (
                                    <FontAwesomeIcon icon={faSpinner} className="text-[10px] animate-spin" />
                                  ) : (
                                    <FontAwesomeIcon icon={faSave} className="text-[10px]" />
                                  )}
                                  {isSaving ? 'Запазва...' : 'Запази'}
                                </Button>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Quick Facts Strip */}
        <section className="py-12 lg:py-16 bg-panel/30">
          <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="flex items-start gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={faInfoCircle} className="text-sm text-accent" />
                </div>
                <div>
                  <h4 className="font-medium text-text mb-1">Кога се ползва</h4>
                  <p className="text-sm text-muted leading-relaxed">{templateData.meta.usage}</p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                className="flex items-start gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-warning/15 border border-warning/30 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <h4 className="font-medium text-text mb-1">Срокове</h4>
                  <p className="text-sm text-muted leading-relaxed">{templateData.meta.deadline}</p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                viewport={{ once: true }}
                className="flex items-start gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-text mb-1">Къде се подава</h4>
                  <p className="text-sm text-muted leading-relaxed mb-2">{templateData.meta.submission.where}</p>
                  {templateData.meta.submission.url && templateData.meta.submission.url !== '#' && (
                    <a
                      href={templateData.meta.submission.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                    >
                      Онлайн портал <FontAwesomeIcon icon={faExternalLinkAlt} className="text-[10px]" />
                    </a>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* How-to Guide */}
        <section className="py-12 lg:py-16 bg-panel/20">
          <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-2xl lg:text-3xl text-center font-semibold tracking-tight text-text mb-4">
                Как да попълните документа
              </h2>
              <p className="text-lg text-center text-muted">
                Подробно ръководство за правилното попълване и подаване на {templateData.category.toLowerCase() === 'жалби' ? 'жалбата' : templateData.category.toLowerCase() === 'молби' ? 'молбата' : 'документа'}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Prerequisites */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="rounded-2xl border border-border bg-card p-6 h-full">
                  <h3 className="text-xl font-semibold text-text mb-4 flex items-center gap-3">
                    <CheckCircle2 className="h-6 w-6 text-success" />
                    Предпоставки
                  </h3>
                  <ul className="space-y-3">
                    {templateData.prerequisites.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-success mt-1.5 flex-shrink-0"></div>
                        <span className="text-sm text-text/80">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>

              {/* Required Documents */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="rounded-2xl border border-border bg-card p-6 h-full">
                  <h3 className="text-xl font-semibold text-text mb-4 flex items-center gap-3">
                    <FileText className="h-6 w-6 text-primary" />
                    Необходими приложения
                  </h3>
                  <ul className="space-y-3">
                    {templateData.requiredDocuments.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0"></div>
                        <span className="text-sm text-text/80">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>

            {/* Steps and Common Mistakes in Two Columns */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              viewport={{ once: true }}
              className="mt-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Steps */}
                <div className="rounded-2xl border border-border bg-card p-6 h-full">
                  <h3 className="text-xl font-semibold text-text mb-6 flex items-center gap-3">
                    <Edit3 className="h-6 w-6 text-accent" />
                    Стъпки за попълване
                  </h3>
                  <div className="space-y-3">
                    {templateData.steps.map((step, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="w-5 h-5 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-medium text-accent">{index + 1}</span>
                        </div>
                        <p className="text-sm text-text/80">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Common Mistakes */}
                <div className="rounded-2xl border border-border bg-card p-6 h-full">
                  <h3 className="text-xl font-semibold text-text mb-4 flex items-center gap-3">
                    <FontAwesomeIcon icon={faWarning} className="text-lg text-warning" />
                    Чести грешки
                  </h3>
                  <ul className="space-y-3">
                    {templateData.commonMistakes.map((mistake, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0" />
                        <span className="text-sm text-text/80">{mistake}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Online Submission */}
            {templateData.meta.submission.url && templateData.meta.submission.url !== '#' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                viewport={{ once: true }}
                className="mt-8"
              >
                <div className="rounded-2xl border border-border bg-card p-6 text-center">
                  <h3 className="text-xl font-semibold text-text mb-4">Онлайн подаване</h3>
                  <p className="text-sm text-muted mb-6">
                    Можете да подадете {templateData.category.toLowerCase() === 'жалби' ? 'жалбата' : templateData.category.toLowerCase() === 'молби' ? 'молбата' : 'документа'} директно онлайн чрез официалния портал на {templateData.institution}
                  </p>
                  <Button
                    asChild
                    className="gap-2"
                  >
                    <a href={templateData.meta.submission.url} target="_blank" rel="noopener noreferrer">
                      <FontAwesomeIcon icon={faExternalLinkAlt} className="text-sm" />
                      Отиди към портала на {templateData.institution}
                    </a>
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* Citations & Sources */}
        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl lg:text-3xl text-center font-semibold tracking-tight text-text mb-4">
                Източници и правна основа
              </h2>
              <p className="text-lg text-center text-muted mb-8">
                Официални нормативни актове и разпоредби за {templateData.title.toLowerCase()}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templateData.sources.map((source, index) => (
                  <motion.a
                    key={index}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    viewport={{ once: true }}
                    className="group rounded-xl border border-border bg-card p-4 hover:border-primary/30 hover:bg-card/80 transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-text group-hover:text-primary transition-colors text-sm">
                        {source.title}
                      </h4>
                      <FontAwesomeIcon icon={faExternalLinkAlt} className="text-xs text-muted group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-xs text-muted">
                      Последна проверка: {source.lastChecked}
                    </p>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Related Templates */}
        <section className="py-12 lg:py-16 bg-panel/20">
          <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h2 className="text-2xl lg:text-3xl text-center font-semibold tracking-tight text-text mb-4">
                Свързани образци
              </h2>
              <p className="text-lg text-center text-muted">
                Други документи, които може да ви са полезни
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {templateData.relatedTemplates.map((template, index) => (
                <motion.a
                  key={template.slug}
                  href={template.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="group rounded-2xl border border-border bg-card p-5 hover:border-primary/30 hover:bg-card/80 transition-all"
                >
                  <div className="mb-4">
                    <Badge variant="muted" className="text-xs mb-2">{template.category}</Badge>
                    <h3 className="font-medium text-text group-hover:text-primary transition-colors mb-1">
                      {template.title}
                    </h3>
                    <p className="text-xs text-muted">{template.subtitle}</p>
                  </div>
                  <div className="flex items-center justify-end">
                    <ArrowRight className="h-4 w-4 text-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-2xl lg:text-3xl text-center font-semibold tracking-tight text-text mb-4">
                Често задавани въпроси
              </h2>
              <p className="text-lg text-center text-muted">
                Отговори на най-честите въпроси за {templateData.title.toLowerCase()}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-8xl mx-auto">
              {templateData.faq.map((faq, index) => (
                <motion.div
                  key={faq.question}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="bg-card rounded-2xl border border-border p-6"
                >
                  <h3 className="text-base font-semibold text-text mb-3">{faq.question}</h3>
                  <p className="text-sm text-muted leading-relaxed">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="rounded-xl bg-warning/10 border border-warning/20 p-6 max-w-4xl mx-auto">
                <AlertTriangle className="h-8 w-8 text-warning mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-text mb-2">Важно уведомление</h3>
                <p className="text-sm text-muted leading-relaxed">
                  Този образец е за информационни цели и <strong>не представлява правен съвет</strong>. 
                  За конкретни правни въпроси се консултирайте с квалифициран юрист. 
                  Винаги проверявайте актуалните изисквания в официалните източници.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  )
}
