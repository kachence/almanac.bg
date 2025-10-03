"use client"

import * as React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { 
  faFileAlt, 
  faDownload, 
  faPrint, 
  faTrash, 
  faExternalLinkAlt,
  faSpinner,
  faExclamationTriangle,
  faFolderOpen
} from "@fortawesome/free-solid-svg-icons"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { supabase } from "@/lib/supabase"
import { analytics } from "@/lib/analytics"
import { useRouter } from "next/navigation"
import { savePrefillData } from "@/lib/document-save"
import { useToast } from "@/components/ui/toast"
import { Dialog, DialogContent, DialogOverlay, DialogPortal } from "@/components/ui/dialog"

interface DocumentsModalProps {
  isOpen: boolean
  onClose: () => void
}

interface SavedDocument {
  id: string
  template_slug: string
  template_title: string
  document_data: any
  created_at: string
  updated_at: string
}

export default function DocumentsModal({ isOpen, onClose }: DocumentsModalProps) {
  const auth = useAuth()
  const router = useRouter()
  const { addToast } = useToast()
  const [documents, setDocuments] = React.useState<SavedDocument[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [deletingId, setDeletingId] = React.useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<string | null>(null)


  // Fetch documents when modal opens
  React.useEffect(() => {
    if (isOpen && auth.user) {
      fetchDocuments()
    }
  }, [isOpen, auth.user])

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setError('Не сте влезли в профила си')
        return
      }

      const response = await fetch('/api/documents', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Documents API error:', response.status, errorText)
        throw new Error(`Failed to fetch documents: ${response.status}`)
      }

      const data = await response.json()
      setDocuments(data.documents || [])

    } catch (error) {
      console.error('Error fetching documents:', error)
      setError('Възникна грешка при зареждането на документите')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDocument = async (doc: SavedDocument) => {
    analytics.documentAction('open', doc.template_slug)
    
    // Store the document data for prefilling
    await savePrefillData(doc.document_data)
    
    // Navigate to the template page
    router.push(`/templates/${doc.template_slug}`)
    onClose()
  }

  const handleDownloadPDF = async (doc: SavedDocument) => {
    analytics.documentAction('download_pdf', doc.template_slug)
    
    try {
      // Dynamic import to avoid SSR issues
      const { pdf } = await import('@react-pdf/renderer')
      const { default: ZhalbaNELKTemplate } = await import('@/components/pdf-templates/ZhalbaNELKTemplate')
      
      // Create React element and generate PDF
      const template = React.createElement(ZhalbaNELKTemplate, { formData: doc.document_data }) as any
      const blob = await pdf(template).toBlob()
      
      // Create download link
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${doc.template_title.replace(/\s+/g, '_')}_${new Date(doc.updated_at).toISOString().split('T')[0]}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
    } catch (error) {
      console.error('Error downloading PDF:', error)
      addToast({ type: 'error', message: 'Възникна грешка при генериране на PDF файла' })
    }
  }


  const handlePrint = async (doc: SavedDocument) => {
    analytics.documentAction('print', doc.template_slug)
    
    try {
      // Generate PDF for printing
      const { pdf } = await import('@react-pdf/renderer')
      const { default: ZhalbaNELKTemplate } = await import('@/components/pdf-templates/ZhalbaNELKTemplate')
      
      const template = React.createElement(ZhalbaNELKTemplate, { formData: doc.document_data }) as any
      const blob = await pdf(template).toBlob()
      
      // Create a URL for the PDF blob
      const url = URL.createObjectURL(blob)
      
      // Open PDF in new window for printing
      const printWindow = window.open(url, '_blank')
      
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print()
          // Clean up URL after a delay
          setTimeout(() => {
            URL.revokeObjectURL(url)
          }, 1000)
        }
      } else {
        // Fallback if popup blocked
        addToast({ type: 'error', message: 'Моля разрешете pop-up прозорци за принтиране' })
        URL.revokeObjectURL(url)
      }
      
    } catch (error) {
      console.error('Error preparing document for printing:', error)
      addToast({ type: 'error', message: 'Възникна грешка при подготовката за принтиране' })
    }
  }

  const handleDeleteClick = (doc: SavedDocument) => {
    // If clicking on the same document that's already in confirm state, cancel it
    if (confirmDeleteId === doc.id) {
      setConfirmDeleteId(null)
    } else {
      // Otherwise, set this document for confirmation
      setConfirmDeleteId(doc.id)
    }
  }

  const handleConfirmDelete = async (doc: SavedDocument) => {
    try {
      setDeletingId(doc.id)
      analytics.documentAction('delete', doc.template_slug)

      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        addToast({ type: 'error', message: 'Не сте влезли в профила си' })
        return
      }

      const response = await fetch(`/api/documents/${doc.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete document')
      }

      // Remove from local state
      setDocuments(prev => prev.filter(d => d.id !== doc.id))
      setConfirmDeleteId(null)
      
      // Show success message
      addToast({ type: 'success', message: 'Документът е изтрит успешно' })

    } catch (error) {
      console.error('Error deleting document:', error)
      addToast({ type: 'error', message: 'Възникна грешка при изтриването на документа' })
    } finally {
      setDeletingId(null)
    }
  }


  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('bg-BG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden rounded-2xl border-0 bg-transparent shadow-none">
          <div className="rounded-2xl border border-border bg-card shadow-xl flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center gap-3 p-6 border-b border-border">
            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <FontAwesomeIcon icon={faFileAlt} className="text-primary text-sm" />
            </div>
            <h2 className="text-xl font-semibold text-text">Моите документи</h2>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <div className="text-center">
                  <FontAwesomeIcon icon={faSpinner} className="text-2xl text-primary animate-spin mb-4" />
                  <p className="text-muted">Зареждане на документите...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center p-12">
                <div className="text-center">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="text-2xl text-danger mb-4" />
                  <p className="text-text font-medium mb-2">Възникна грешка</p>
                  <p className="text-muted mb-4">{error}</p>
                  <Button onClick={fetchDocuments} variant="ghost" size="sm">
                    Опитай отново
                  </Button>
                </div>
              </div>
            ) : documents.length === 0 ? (
              <div className="flex items-center justify-center p-12">
                <div className="text-center">
                  <FontAwesomeIcon icon={faFolderOpen} className="text-4xl text-muted mb-4" />
                  <p className="text-text font-medium mb-2">Няма запазени документи</p>
                  <p className="text-muted mb-4">
                    Редактирайте документ и натиснете &quot;Запази&quot;, за да го видите тук.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="space-y-4">
                  {documents.map((doc) => (
                    <div key={doc.id} className="rounded-xl border border-border bg-panel/30 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-text mb-1">{doc.template_title}</h3>
                          <p className="text-sm text-muted">
                            Запазен на {formatDate(doc.created_at)}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => handleOpenDocument(doc)}
                            variant="ghost"
                            size="sm"
                            className="gap-2"
                          >
                            <FontAwesomeIcon icon={faExternalLinkAlt} className="text-xs" />
                            Отвори
                          </Button>
                          
                          <Button
                            onClick={() => handleDownloadPDF(doc)}
                            variant="ghost"
                            size="sm"
                            className="gap-2"
                          >
                            <FontAwesomeIcon icon={faDownload} className="text-xs" />
                            PDF
                          </Button>
                          
                          
                          <Button
                            onClick={() => handlePrint(doc)}
                            variant="ghost"
                            size="sm"
                            className="gap-2"
                          >
                            <FontAwesomeIcon icon={faPrint} className="text-xs" />
                            Принтирай
                          </Button>
                          
                          {confirmDeleteId === doc.id ? (
                            <Button
                              onClick={() => handleConfirmDelete(doc)}
                              disabled={deletingId === doc.id}
                              variant="ghost"
                              size="sm"
                              className="gap-1 text-danger hover:text-danger bg-danger/10"
                            >
                              {deletingId === doc.id ? (
                                <FontAwesomeIcon icon={faSpinner} className="text-xs animate-spin" />
                              ) : (
                                <FontAwesomeIcon icon={faTrash} className="text-xs" />
                              )}
                              Потвърди
                            </Button>
                          ) : (
                            <Button
                              onClick={() => handleDeleteClick(doc)}
                              variant="ghost"
                              size="sm"
                              className="gap-2 text-danger hover:text-danger"
                            >
                              <FontAwesomeIcon icon={faTrash} className="text-xs" />
                              Изтрий
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {documents.length >= 8 && (
                  <div className="mt-6 p-4 bg-warning/10 border border-warning/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <FontAwesomeIcon icon={faExclamationTriangle} className="text-warning text-sm mt-0.5" />
                      <div>
                        <p className="text-sm text-text font-medium mb-1">Приближавате лимита</p>
                        <p className="text-xs text-muted">
                          Можете да имате до 10 запазени документа. При достигане на лимита, най-старият документ ще бъде изтрит автоматично.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
