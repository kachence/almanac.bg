import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Ember & Saffron Palette - Warm autumn theme
        'bg': 'var(--bg)',
        'bg-alt': 'var(--bg-alt)',
        'card': 'var(--card)',
        'panel': 'var(--panel)',
        'border': 'var(--border)',
        'border-strong': 'var(--border-strong)',
        'text': 'var(--text)',
        'muted': 'var(--muted)',
        'muted-strong': 'var(--muted-strong)',
        
        // Brand colors with hover states
        'primary': {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary-hover)',
          pressed: 'var(--primary-pressed)',
          foreground: 'var(--primary-foreground)',
        },
        'accent': {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
          pressed: 'var(--accent-pressed)',
          foreground: 'var(--accent-foreground)',
        },
        'critical': {
          DEFAULT: 'var(--critical)',
          hover: 'var(--critical-hover)',
        },
        
        // Semantic colors
        'success': 'rgb(var(--success-rgb) / <alpha-value>)',
        'warning': 'rgb(var(--warning-rgb) / <alpha-value>)',
        'info': 'var(--info)',
        'info-bg': 'var(--info-bg)',
        'warning-bg': 'var(--warning-bg)',
        'success-bg': 'var(--success-bg)',
        
        // Support colors
        'soft': 'var(--soft)',
        'ink-rare': 'var(--ink-rare)',
        
        // Legacy compatibility
        'danger': 'rgb(var(--critical-rgb) / <alpha-value>)',
        'surface': 'var(--surface)',
        'fg': 'var(--fg)',
        'primary-foreground': 'var(--primary-foreground)',
        'accent-foreground': 'var(--accent-foreground)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      fontSize: {
        'base': ['15px', '1.6'],
      },
      borderRadius: {
        '2xl': '1rem',
        'xl': '0.75rem',
      },
      boxShadow: {
        'custom': '0 1px 2px rgba(31,25,21,.06), 0 6px 20px rgba(31,25,21,.06)',
        'card': '0 1px 2px rgba(31,25,21,.06), 0 6px 20px rgba(31,25,21,.06)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      perspective: {
        '1000': '1000px',
      },
      maxWidth: {
        '8xl': '88rem', // 1408px
        '9xl': '96rem', // 1536px
      },
    },
  },
  plugins: [],
  future: {
    hoverOnlyWhenSupported: true,
  },
}
export default config
