"use client"

import * as React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser, faEye, faEyeSlash, faCheck, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons"
import { faGoogle, faFacebook } from "@fortawesome/free-brands-svg-icons"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { supabase } from "@/lib/supabase"
import { analytics } from "@/lib/analytics"
import { Dialog, DialogContent, DialogOverlay, DialogPortal } from "@/components/ui/dialog"

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const auth = useAuth()
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false)
  const [showNewPassword, setShowNewPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [currentPassword, setCurrentPassword] = React.useState("")
  const [newPassword, setNewPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [isUpdating, setIsUpdating] = React.useState(false)
  const [message, setMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null)


  // Check if user signed up with OAuth (Google/Facebook)
  const isOAuthUser = auth.user?.app_metadata?.provider === 'google' || auth.user?.app_metadata?.provider === 'facebook'
  const providerName = auth.user?.app_metadata?.provider === 'google' ? 'Google' : 
                      auth.user?.app_metadata?.provider === 'facebook' ? 'Facebook' : null

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (!isOpen) {
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setMessage(null)
      setShowCurrentPassword(false)
      setShowNewPassword(false)
      setShowConfirmPassword(false)
    }
  }, [isOpen])

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Новите пароли не съвпадат' })
      return
    }

    if (newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Новата парола трябва да бъде поне 8 символа' })
      return
    }

    setIsUpdating(true)
    setMessage(null)

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) {
        setMessage({ type: 'error', text: error.message })
      } else {
        setMessage({ type: 'success', text: 'Паролата е обновена успешно' })
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
        analytics.profileAction('password_updated')
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Възникна грешка при обновяването на паролата' })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent className="max-w-md p-0 overflow-hidden rounded-2xl border-0 bg-transparent shadow-none">
          <div className="rounded-2xl border border-border bg-card shadow-xl">
          {/* Header */}
          <div className="flex items-center gap-3 p-6 border-b border-border">
            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <FontAwesomeIcon icon={faUser} className="text-primary text-sm" />
            </div>
            <h2 className="text-xl font-semibold text-text">Профил</h2>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* User Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-text">Информация за профила</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">Име</label>
                  <p className="text-sm text-text bg-panel/30 rounded-lg px-3 py-2 border border-border">
                    {auth.user?.user_metadata?.full_name || auth.user?.user_metadata?.name || 'Не е посочено'}
                  </p>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">Имейл</label>
                  <p className="text-sm text-text bg-panel/30 rounded-lg px-3 py-2 border border-border">
                    {auth.user?.email}
                  </p>
                </div>

                {providerName && (
                  <div>
                    <label className="block text-xs font-medium text-muted mb-1">Начин на вход</label>
                    <div className="flex items-center gap-2 bg-panel/30 rounded-lg px-3 py-2 border border-border">
                      <FontAwesomeIcon 
                        icon={providerName === 'Google' ? faGoogle : faFacebook} 
                        className="text-sm text-primary" 
                      />
                      <span className="text-sm text-text">{providerName}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Password Update Section - Only for non-OAuth users */}
            {!isOAuthUser && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-text">Смяна на парола</h3>
                
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-muted mb-2">
                      Текуща парола
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 pr-10"
                        placeholder="Въведете текущата парола"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors"
                      >
                        <FontAwesomeIcon icon={showCurrentPassword ? faEyeSlash : faEye} className="text-xs" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted mb-2">
                      Нова парола
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 pr-10"
                        placeholder="Въведете нова парола (мин. 8 символа)"
                        minLength={8}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors"
                      >
                        <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} className="text-xs" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted mb-2">
                      Потвърдете новата парола
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 pr-10"
                        placeholder="Потвърдете новата парола"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors"
                      >
                        <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} className="text-xs" />
                      </button>
                    </div>
                  </div>

                  {/* Message */}
                  {message && (
                    <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
                      message.type === 'success' 
                        ? 'bg-success/10 border border-success/20 text-success' 
                        : 'bg-danger/10 border border-danger/20 text-danger'
                    }`}>
                      <FontAwesomeIcon 
                        icon={message.type === 'success' ? faCheck : faExclamationTriangle} 
                        className="text-xs" 
                      />
                      {message.text}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isUpdating || !currentPassword || !newPassword || !confirmPassword}
                    className="w-full"
                  >
                    {isUpdating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Обновяване...
                      </>
                    ) : (
                      'Обнови паролата'
                    )}
                  </Button>
                </form>
              </div>
            )}

            {/* OAuth User Notice */}
            {isOAuthUser && (
              <div className="bg-panel/30 rounded-lg p-4 border border-border">
                <div className="flex items-start gap-3">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="text-warning text-sm mt-0.5" />
                  <div>
                    <p className="text-sm text-text font-medium mb-1">Парола не е необходима</p>
                    <p className="text-xs text-muted">
                      Влязохте чрез {providerName}, така че няма нужда от парола за този акаунт.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
