import { supabase } from '@/lib/supabase'
import { analytics } from '@/lib/analytics'

interface SaveDocumentParams {
  templateSlug: string
  templateTitle: string
  documentData: any
}

export async function saveDocument({ templateSlug, templateTitle, documentData }: SaveDocumentParams) {
  try {
    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session) {
      throw new Error('Трябва да влезете в профила си, за да запазите документа')
    }

    // Save to API
    const response = await fetch('/api/documents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        template_slug: templateSlug,
        template_title: templateTitle,
        document_data: documentData
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Възникна грешка при запазването')
    }

    const result = await response.json()
    
    // Track analytics
    analytics.documentSave(templateSlug, false)
    
    return result.document

  } catch (error) {
    console.error('Error saving document:', error)
    throw error
  }
}

export async function updateDocument(documentId: string, documentData: any, templateSlug: string) {
  try {
    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session) {
      throw new Error('Трябва да влезете в профила си, за да обновите документа')
    }

    // Update via API
    const response = await fetch(`/api/documents/${documentId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        document_data: documentData
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Възникна грешка при обновяването')
    }

    const result = await response.json()
    
    // Track analytics
    analytics.documentSave(templateSlug, true)
    
    return result.document

  } catch (error) {
    console.error('Error updating document:', error)
    throw error
  }
}

export async function loadPrefillData(): Promise<any | null> {
  try {
    const prefillData = sessionStorage.getItem('blanka_prefill_data')
    if (prefillData) {
      // Clear it after reading to avoid stale data
      sessionStorage.removeItem('blanka_prefill_data')
      return JSON.parse(prefillData)
    }
    return null
  } catch (error) {
    console.error('Error loading prefill data:', error)
    return null
  }
}

export async function savePrefillData(data: any): Promise<void> {
  try {
    sessionStorage.setItem('blanka_prefill_data', JSON.stringify(data))
    
    // Dispatch custom event for same-tab updates
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('prefillDataUpdated'))
    }
  } catch (error) {
    console.error('Error saving prefill data:', error)
  }
}
