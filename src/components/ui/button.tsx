import * as React from "react"
import { cn } from "@/lib/utils"

const buttonVariants = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:ring-offset-bg",
  ghost: "border border-border text-text hover:bg-accent/10 hover:border-accent/50",
  outline: "border border-accent/20 text-accent hover:bg-accent/10",
  danger: "bg-danger text-white hover:bg-danger/90 focus:ring-2 focus:ring-danger/40 focus:ring-offset-2 focus:ring-offset-bg",
  size: {
    default: "h-11 px-6 py-2",
    sm: "h-9 px-4 text-sm",
    lg: "h-12 px-8",
  }
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants
  size?: keyof typeof buttonVariants.size
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, children, ...props }, ref) => {
    const baseClasses = cn(
      "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-bg transition-all duration-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
      buttonVariants[variant],
      buttonVariants.size[size],
      className
    )

    if (asChild) {
      return React.cloneElement(children as React.ReactElement, {
        className: cn(baseClasses, (children as React.ReactElement).props.className),
        ref,
        ...props
      })
    }

    return (
      <button
        className={baseClasses}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }