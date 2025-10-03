"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faExclamationTriangle, faInfo, faTimes } from "@fortawesome/free-solid-svg-icons"

interface Toast {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title?: string
  message: string
  duration?: number
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const addToast = React.useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { ...toast, id }
    
    setToasts(prev => [...prev, newToast])
    
    // Auto remove after duration (default 4 seconds)
    const duration = toast.duration ?? 4000
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, duration)
  }, [])

  const removeToast = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

function ToastContainer({ toasts, removeToast }: { toasts: Toast[], removeToast: (id: string) => void }) {
  return (
    <div className="fixed bottom-4 right-4 z-[100] space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  )
}

function ToastItem({ toast, onRemove }: { toast: Toast, onRemove: (id: string) => void }) {
  const getIcon = () => {
    switch (toast.type) {
      case 'success': return faCheck
      case 'error': return faExclamationTriangle
      case 'warning': return faExclamationTriangle
      case 'info': return faInfo
    }
  }

  const getStyles = () => {
    switch (toast.type) {
      case 'success': return 'bg-success/10 border-success/20 text-success'
      case 'error': return 'bg-danger/10 border-danger/20 text-danger'
      case 'warning': return 'bg-warning/10 border-warning/20 text-warning'
      case 'info': return 'bg-primary/10 border-primary/20 text-primary'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.95 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
      className={`min-w-80 max-w-md rounded-lg border backdrop-blur-sm shadow-lg ${getStyles()}`}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <FontAwesomeIcon 
            icon={getIcon()} 
            className="text-sm mt-0.5 flex-shrink-0" 
          />
          <div className="flex-1 min-w-0">
            {toast.title && (
              <p className="font-medium text-sm mb-1">{toast.title}</p>
            )}
            <p className="text-sm opacity-90">{toast.message}</p>
          </div>
          <button
            onClick={() => onRemove(toast.id)}
            className="text-current opacity-50 hover:opacity-100 transition-opacity flex-shrink-0"
          >
            <FontAwesomeIcon icon={faTimes} className="text-xs" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
