import * as React from "react"
import { cn } from "@/lib/utils"

const badgeVariants = {
  default: "bg-card border-border text-text",
  success: "bg-success/10 border-border text-success",
  accent: "bg-accent/10 border-border text-accent",
  muted: "bg-muted/20 border-border text-muted",
  pdf: "bg-danger/10 border-border text-danger",
  docx: "bg-primary/10 border-border text-primary",
  warning: "bg-warning/10 border-border text-warning",
}

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof badgeVariants
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)] focus:ring-offset-2",
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
