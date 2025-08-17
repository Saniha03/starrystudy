/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "var(--color-border)", // slate-400 with opacity
        input: "var(--color-input)", // slate-800
        ring: "var(--color-ring)", // blue-500
        background: "var(--color-background)", // slate-900
        foreground: "var(--color-foreground)", // slate-50
        surface: {
          DEFAULT: "var(--color-surface)", // slate-800
          foreground: "var(--color-surface-foreground)", // slate-50
        },
        primary: {
          DEFAULT: "var(--color-primary)", // blue-800
          foreground: "var(--color-primary-foreground)", // slate-50
        },
        secondary: {
          DEFAULT: "var(--color-secondary)", // blue-500
          foreground: "var(--color-secondary-foreground)", // slate-50
        },
        destructive: {
          DEFAULT: "var(--color-destructive)", // red-500
          foreground: "var(--color-destructive-foreground)", // slate-50
        },
        muted: {
          DEFAULT: "var(--color-muted)", // slate-700
          foreground: "var(--color-muted-foreground)", // slate-400
        },
        accent: {
          DEFAULT: "var(--color-accent)", // pink-400
          foreground: "var(--color-accent-foreground)", // slate-900
        },
        popover: {
          DEFAULT: "var(--color-popover)", // slate-800
          foreground: "var(--color-popover-foreground)", // slate-50
        },
        card: {
          DEFAULT: "var(--color-card)", // slate-800
          foreground: "var(--color-card-foreground)", // slate-50
        },
        success: {
          DEFAULT: "var(--color-success)", // emerald-500
          foreground: "var(--color-success-foreground)", // slate-50
        },
        warning: {
          DEFAULT: "var(--color-warning)", // amber-500
          foreground: "var(--color-warning-foreground)", // slate-900
        },
        error: {
          DEFAULT: "var(--color-error)", // red-500
          foreground: "var(--color-error-foreground)", // slate-50
        },
      },
      borderRadius: {
        lg: "var(--radius)", // 8px
        md: "calc(var(--radius) - 2px)", // 6px
        sm: "calc(var(--radius) - 4px)", // 4px
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      boxShadow: {
        'soft': 'var(--shadow-soft)',
        'medium': 'var(--shadow-medium)',
        'card': 'var(--shadow-card)',
      },
      animation: {
        "pulse-gentle": "pulse-gentle 2s ease-in-out infinite",
        "slide-in": "slide-in 300ms cubic-bezier(0.4, 0, 0.2, 1)",
      },
      keyframes: {
        "pulse-gentle": {
          "0%, 100%": {
            opacity: "1",
          },
          "50%": {
            opacity: "0.7",
          },
        },
        "slide-in": {
          from: {
            opacity: "0",
            transform: "translateY(-10px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
      scale: {
        '102': '1.02',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      zIndex: {
        '100': '100',
        '150': '150',
        '200': '200',
        '201': '201',
        '300': '300',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
}