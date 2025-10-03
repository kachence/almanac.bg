"use client"

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function AuthHandler() {
  useEffect(() => {
    const handleAuthCallback = async () => {
      // Check if we have auth tokens in the URL hash
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const accessToken = hashParams.get('access_token')
      const refreshToken = hashParams.get('refresh_token')
      
      if (accessToken && refreshToken) {
        console.log('AuthHandler: Processing OAuth tokens from URL hash')
        try {
          // Set the session using the tokens from the URL
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })
          
          if (error) {
            console.error('AuthHandler: Error setting session:', error)
          } else {
            console.log('AuthHandler: Session set successfully:', data.user?.email)
            // Clean up the URL
            window.history.replaceState({}, document.title, window.location.pathname)
          }
        } catch (err) {
          console.error('AuthHandler: Unexpected error:', err)
        }
      }
    }

    handleAuthCallback()
  }, [])

  return null // This component doesn't render anything
}
