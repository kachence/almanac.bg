"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser, faEnvelope, faLock, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import { faGoogle, faFacebook } from "@fortawesome/free-brands-svg-icons"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { Dialog, DialogContent, DialogOverlay, DialogPortal } from "@/components/ui/dialog"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: 'login' | 'signup'
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const auth = useAuth()
  const [mode, setMode] = React.useState<'login' | 'signup'>(initialMode)
  const [showPassword, setShowPassword] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  })

  React.useEffect(() => {
    setMode(initialMode)
  }, [initialMode])


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (mode === 'signup') {
        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
          setError('Паролите не съвпадат')
          return
        }

        const { error } = await auth.signUp(formData.email, formData.password, formData.name)
        if (!error) {
          setError(null)
          onClose()
        }
      } else {
        const { error } = await auth.signIn(formData.email, formData.password)
        if (!error) {
          setError(null)
          onClose()
        }
      }
    } catch (err) {
      setError('Възникна неочаквана грешка')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const { error } = await auth.signInWithGoogle()
      // Note: For OAuth, the redirect will handle closing the modal
    } catch (err) {
      // Error toast will be handled by auth provider
    } finally {
      setLoading(false)
    }
  }

  const handleFacebookAuth = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const { error } = await auth.signInWithFacebook()
      // Note: For OAuth, the redirect will handle closing the modal
    } catch (err) {
      // Error toast will be handled by auth provider
    } finally {
      setLoading(false)
    }
  }

  const updateFormField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent className="max-w-md p-0 overflow-hidden rounded-2xl border-0 bg-transparent shadow-none">
          <div className="relative w-full bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-text">
                {mode === 'login' ? 'Вход' : 'Регистрация'}
              </h2>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Error Display */}
              {error && (
                <div className="mb-4 p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm">
                  {error}
                </div>
              )}

              {/* Social Auth Buttons */}
              <div className="space-y-3 mb-6">
                <Button
                  onClick={handleGoogleAuth}
                  disabled={loading}
                  variant="ghost"
                  className="w-full h-12 border border-border hover:border-primary/40 gap-3"
                  size="lg"
                >
                  <FontAwesomeIcon icon={faGoogle} className="text-lg text-red-500" />
                  Продължи с Google
                </Button>
                
                <Button
                  onClick={handleFacebookAuth}
                  disabled={loading}
                  variant="ghost"
                  className="w-full h-12 border border-border hover:border-primary/40 gap-3"
                  size="lg"
                >
                  <FontAwesomeIcon icon={faFacebook} className="text-lg text-blue-500" />
                  Продължи с Facebook
                </Button>
              </div>

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted">или</span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">
                      <FontAwesomeIcon icon={faUser} className="mr-2 text-xs" />
                      Име и фамилия
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => updateFormField('name', e.target.value)}
                      className="w-full rounded-lg border border-border bg-card px-3 py-3 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60"
                      placeholder="Въведете вашето име"
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-xs" />
                    Имейл адрес
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => updateFormField('email', e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-3 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60"
                    placeholder="example@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    <FontAwesomeIcon icon={faLock} className="mr-2 text-xs" />
                    Парола
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={(e) => updateFormField('password', e.target.value)}
                      className="w-full rounded-lg border border-border bg-card px-3 py-3 pr-10 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60"
                      placeholder="Въведете парола"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors"
                    >
                      <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="text-sm" />
                    </button>
                  </div>
                </div>

                {mode === 'signup' && (
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">
                      <FontAwesomeIcon icon={faLock} className="mr-2 text-xs" />
                      Потвърди парола
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => updateFormField('confirmPassword', e.target.value)}
                      className="w-full rounded-lg border border-border bg-card px-3 py-3 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60"
                      placeholder="Потвърдете паролата"
                    />
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 mt-6"
                  size="lg"
                >
                  {loading ? 'Изчакайте...' : (mode === 'login' ? 'Влез' : 'Регистрирай се')}
                </Button>
              </form>

              {/* Switch Mode */}
              <div className="mt-6 text-center text-sm">
                <span className="text-muted">
                  {mode === 'login' ? 'Нямате акаунт?' : 'Вече имате акаунт?'}
                </span>
                {' '}
                <button
                  onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  {mode === 'login' ? 'Регистрирайте се' : 'Влезте'}
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
