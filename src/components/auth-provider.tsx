"use client"

import * as React from "react"
import { User, Session } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/toast"

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<{ error: any }>
  signInWithGoogle: () => Promise<{ error: any }>
  signInWithFacebook: () => Promise<{ error: any }>
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null)
  const [session, setSession] = React.useState<Session | null>(null)
  const [loading, setLoading] = React.useState(true)
  const toastTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)
  const lastEventRef = React.useRef<{ event: string; userId: string | null; timestamp: number } | null>(null)
  const isInitialLoadRef = React.useRef(true)
  const { addToast } = useToast()

  React.useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('AuthProvider: Getting initial session...')
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error('AuthProvider: Error getting session:', error)
        } else {
          console.log('AuthProvider: Session found:', session?.user?.email || 'No session')
          setSession(session)
          setUser(session?.user ?? null)
        }
      } catch (error) {
        console.error('AuthProvider: Error in getInitialSession:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email)
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
      
      // Debounced toast notifications to prevent duplicates
      const currentUserId = session?.user?.id || null
      const now = Date.now()
      const currentEvent = { event, userId: currentUserId, timestamp: now }
      
      // Check if this is a duplicate event within 1 second
      const isDuplicate = lastEventRef.current && 
        lastEventRef.current.event === event &&
        lastEventRef.current.userId === currentUserId &&
        (now - lastEventRef.current.timestamp) < 1000
      
      if (!isDuplicate) {
        if (toastTimeoutRef.current) {
          clearTimeout(toastTimeoutRef.current)
        }
        
        toastTimeoutRef.current = setTimeout(() => {
          // Only show welcome toast for actual login events, not initial session restoration
          if (event === 'SIGNED_IN' && session?.user && !isInitialLoadRef.current) {
            addToast({
              type: 'success',
              message: `Добре дошли, ${session.user.user_metadata?.full_name || session.user.email || 'потребител'}!`,
              duration: 3000
            })
          } else if (event === 'SIGNED_OUT') {
            addToast({
              type: 'success',
              message: 'Успешно излязохте от профила си',
              duration: 3000
            })
          }
          
          // Mark that initial load is complete after the first auth event
          if (isInitialLoadRef.current) {
            isInitialLoadRef.current = false
          }
        }, 100) // Small delay to batch multiple rapid events
        
        lastEventRef.current = currentEvent
      }
    })

    return () => subscription.unsubscribe()
  }, [addToast])

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          }
        }
      })
      
      if (error) {
        addToast({
          type: 'error',
          message: error.message || 'Възникна грешка при регистрацията'
        })
      } else if (data.user && !data.session) {
        // Email confirmation required
        addToast({
          type: 'info',
          message: 'Проверете имейла си за потвърждение на регистрацията',
          duration: 5000
        })
      }
      
      return { error }
    } catch (error: any) {
      addToast({
        type: 'error',
        message: 'Възникна неочаквана грешка при регистрацията'
      })
      return { error }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        addToast({
          type: 'error',
          message: error.message || 'Възникна грешка при влизането'
        })
      }
      
      return { error }
    } catch (error: any) {
      addToast({
        type: 'error',
        message: 'Възникна неочаквана грешка при влизането'
      })
      return { error }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        addToast({
          type: 'error',
          message: error.message || 'Възникна грешка при излизането'
        })
      }
      
      return { error }
    } catch (error: any) {
      addToast({
        type: 'error',
        message: 'Възникна неочаквана грешка при излизането'
      })
      return { error }
    }
  }

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) {
        addToast({
          type: 'error',
          message: error.message || 'Възникна грешка при влизането с Google'
        })
      }
      
      return { error }
    } catch (error: any) {
      addToast({
        type: 'error',
        message: 'Възникна неочаквана грешка при влизането с Google'
      })
      return { error }
    }
  }

  const signInWithFacebook = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) {
        addToast({
          type: 'error',
          message: error.message || 'Възникна грешка при влизането с Facebook'
        })
      }
      
      return { error }
    } catch (error: any) {
      addToast({
        type: 'error',
        message: 'Възникна неочаквана грешка при влизането с Facebook'
      })
      return { error }
    }
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    signInWithGoogle,
    signInWithFacebook,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
