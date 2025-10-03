// Simple analytics tracking utilities
// Replace with your preferred analytics provider (Plausible, Umami, etc.)

interface AnalyticsEvent {
  name: string
  properties?: Record<string, any>
}

export function track(eventName: string, properties?: Record<string, any>) {
  // Development logging
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Analytics Event:', eventName, properties)
  }

  // TODO: Replace with actual analytics implementation
  // Example for Plausible:
  // if (typeof window !== 'undefined' && window.plausible) {
  //   window.plausible(eventName, { props: properties })
  // }

  // Example for Umami:
  // if (typeof window !== 'undefined' && window.umami) {
  //   window.umami.track(eventName, properties)
  // }

  // Example for custom analytics:
  // fetch('/api/analytics', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ event: eventName, properties })
  // })
}

// Predefined tracking functions for common events
export const analytics = {
  // Navigation events
  navClick: (item: string) => track('nav_click', { item }),
  
  // Search events
  searchFocus: (source: 'header' | 'hero') => track('search_focus', { source }),
  searchSubmit: (source: 'header' | 'hero', queryLength: number) => 
    track('search_submit', { source, q_len: queryLength }),
  searchResultClick: (slug: string, position: number) => 
    track('search_result_click', { slug, position }),
  
  // CTA events
  ctaClick: (cta: 'demo_fill' | 'browse_templates') => track('cta_click', { cta }),
  
  // Template events
  featuredTemplateClick: (slug: string) => track('featured_template_click', { slug }),
  templateView: (slug: string) => track('template_view', { slug }),
  downloadClick: (format: 'pdf' | 'docx', slug: string) => 
    track('download_click', { format, slug }),
  
  // Editor events
  editorOpen: (slug: string, source: 'landing' | 'template') => 
    track('editor_open', { slug, source }),
  
  // Auth events
  authOpen: (source: string) => track('auth_open', { source }),
  signupComplete: (referrerSlug?: string) => 
    track('signup_complete', { referrer_slug: referrerSlug }),
  
  // Profile events
  profileAction: (action: 'password_updated' | 'profile_updated') => 
    track('profile_action', { action }),
  
  // Document events
  documentAction: (action: 'open' | 'download_pdf' | 'gmail_attach' | 'print' | 'delete', templateSlug: string) => 
    track('document_action', { action, template_slug: templateSlug }),
  documentSave: (templateSlug: string, isUpdate: boolean = false) => 
    track('document_save', { template_slug: templateSlug, is_update: isUpdate }),
}

export default analytics
