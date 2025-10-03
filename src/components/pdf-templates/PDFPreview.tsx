"use client"

import React, { useDeferredValue, useState, useEffect, startTransition } from 'react'
import dynamic from 'next/dynamic'
import { useDebouncedCallback } from 'use-debounce'

// Dynamically import React-PDF components for client-side rendering
const Document = dynamic(
  () => import('react-pdf').then(mod => mod.Document),
  { 
    ssr: false,
    loading: () => <SkeletonPreview />
  }
)

const Page = dynamic(
  () => import('react-pdf').then(mod => mod.Page),
  { ssr: false }
)

const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then(mod => mod.PDFDownloadLink),
  { ssr: false }
)

import { pdf } from '@react-pdf/renderer'

// Set up PDF.js worker for better performance
if (typeof window !== 'undefined') {
  import('react-pdf').then(({ pdfjs }) => {
    // Use local worker file to avoid CORS issues
    pdfjs.GlobalWorkerOptions.workerSrc = '/pdf-worker/pdf.worker.min.js'
  }).catch(error => {
    console.warn('Failed to set up PDF.js worker:', error)
  })
}

interface FormData {
  fullName?: string
  egn?: string
  address?: string
  municipality?: string
  region?: string
  blockNumber?: string
  entrance?: string
  apartment?: string
  floor?: string
  phone?: string
  expertDecisionNumber?: string
  expertDecisionDate?: string
  diseaseLocation?: string
  telkPercentage?: string
  schedulingDate?: string
  signingLocation?: string
  rkmeCity?: string
}

interface PDFPreviewProps {
  formData: FormData
  PDFTemplate: React.ComponentType<{ formData: FormData }>
  onDownloadPDF?: () => void
  onDownloadDOCX?: () => void
  onHeightChange?: (height: number) => void
  onPageCountChange?: (isMultiPage: boolean) => void
}

// Skeleton component for loading states
const SkeletonPreview: React.FC = () => (
  <div className="w-full h-full flex items-center justify-center bg-white rounded-lg border-2 border-dashed border-border">
    <div className="text-center p-8">
      <div className="w-12 h-12 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-sm text-muted">Генериране на документа...</p>
    </div>
  </div>
)

// Memoized Preview component that only re-renders when fileUrl changes
const Preview = React.memo(function Preview({ fileUrl, onHeightChange, onPageCountChange }: { fileUrl: string | null; onHeightChange?: (height: number) => void; onPageCountChange?: (isMultiPage: boolean) => void }) {
  const [numPages, setNumPages] = useState<number>(0)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState<number>(1.05)
  const [containerHeight, setContainerHeight] = useState<number>(0)

  // Memoize options to prevent unnecessary reloads
  const documentOptions = React.useMemo(() => ({
    cMapUrl: '/cmaps/',
    standardFontDataUrl: '/standard_fonts/'
  }), [])

  // Calculate scale and container height to fit A4 page perfectly
  React.useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const availableWidth = containerRef.current.clientWidth - 32 // Account for padding
        const a4Width = 595 // A4 width in points
        const a4Height = 842 // A4 height in points
        
        // Calculate scale based on available width
        const calculatedScale = availableWidth / a4Width
        const finalScale = Math.min(Math.max(calculatedScale, 0.6), 1.4)
        
        // Calculate exact container height needed for one A4 page
        const pageHeight = a4Height * finalScale
        const totalHeight = pageHeight + 32 + 16 // padding + border/shadow
        
        setScale(finalScale)
        setContainerHeight(totalHeight)
        
        // Communicate height to parent component (only for single page)
        if (onHeightChange) {
          onHeightChange(totalHeight)
        }
      }
    }

    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [onHeightChange])

  if (!fileUrl) return <SkeletonPreview />

  return (
    <div 
      ref={containerRef} 
      className="w-full"
      style={{ 
        backgroundColor: '#323232',
        height: containerHeight || '100%', 
        maxHeight: containerHeight || '100%', 
        overflow: 'auto' 
      }}
    >
      <div className="p-4">
        <Document
          file={fileUrl}
          onLoadSuccess={({ numPages }) => {
          setNumPages(numPages)
          // Communicate if this is a multi-page document
          if (onPageCountChange) {
            onPageCountChange(numPages > 1)
          }
        }}
          loading={<SkeletonPreview />}
          error={
            <div className="w-full h-full flex items-center justify-center bg-white rounded-lg">
              <div className="text-center p-8">
                <p className="text-sm text-red-600 mb-2">Грешка при зареждане на документа</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="text-xs text-primary hover:underline"
                >
                  Опитайте отново
                </button>
              </div>
            </div>
          }
          options={documentOptions}
        >
          <div className="space-y-6 flex flex-col items-center">
            {Array.from(new Array(numPages), (el, index) => (
              <div key={`page_${index + 1}`} className="relative">
                <Page
                  pageNumber={index + 1}
                  scale={scale}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  renderMode="canvas"
                  className="shadow-lg rounded-lg overflow-hidden border border-gray-200"
                />
                {numPages > 1 && (
                  <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                    {index + 1} / {numPages}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Document>
      </div>
    </div>
  )
})

const PDFPreview: React.FC<PDFPreviewProps> = ({ 
  formData, 
  PDFTemplate,
  onDownloadPDF, 
  onDownloadDOCX,
  onHeightChange,
  onPageCountChange
}) => {
  const [isClient, setIsClient] = useState(false)
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  // Use deferred value to keep typing snappy
  const deferredForm = useDeferredValue(formData)

  // Debounced PDF generation function
  const generatePdfDebounced = useDebouncedCallback(async (state: FormData) => {
    if (!isClient) return
    
    setIsGenerating(true)
    try {
      // Generate PDF blob
      const blob = await pdf(<PDFTemplate formData={state} />).toBlob()
      
      // Create new URL and clean up old one
      const newUrl = URL.createObjectURL(blob)
      setFileUrl(prevUrl => {
        // Use setTimeout to delay cleanup, ensuring PDF.js finishes loading
        if (prevUrl) {
          pendingCleanups.current.push(prevUrl)
          setTimeout(() => {
            URL.revokeObjectURL(prevUrl)
            pendingCleanups.current = pendingCleanups.current.filter(url => url !== prevUrl)
          }, 1000)
        }
        return newUrl
      })
    } catch (error) {
      console.error('Error generating PDF:', error)
    } finally {
      setIsGenerating(false)
    }
  }, 500) // 500ms debounce - good balance between responsiveness and performance

  // Set up client-side rendering
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Generate initial PDF and regenerate when deferred form changes
  useEffect(() => {
    if (!isClient) return
    
    startTransition(() => {
      generatePdfDebounced(deferredForm)
    })
  }, [deferredForm, generatePdfDebounced, isClient])

  // Cleanup URLs on unmount and store pending cleanups
  const pendingCleanups = React.useRef<string[]>([])
  
  useEffect(() => {
    return () => {
      // Clean up current URL
      if (fileUrl) URL.revokeObjectURL(fileUrl)
      // Clean up any pending URLs
      pendingCleanups.current.forEach(url => URL.revokeObjectURL(url))
      pendingCleanups.current = []
    }
  }, [fileUrl])

  if (!isClient) {
    return <SkeletonPreview />
  }

  return (
    <div className="w-full h-full relative">
      {/* Generation indicator */}
      {isGenerating && (
        <div className="absolute top-2 right-2 z-10 bg-primary/10 border border-primary/20 rounded-lg px-3 py-1.5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs text-primary">Обновяване...</span>
          </div>
        </div>
      )}
      
      {/* PDF Preview */}
      <div className="w-full h-full overflow-hidden">
        <Preview fileUrl={fileUrl} onHeightChange={onHeightChange} onPageCountChange={onPageCountChange} />
      </div>
    </div>
  )
}

export { PDFDownloadLink }
export default PDFPreview