/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "lg": "1320px", // custom layout width
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Codec Pro', 'sans-serif'],
        inter: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: '#0f766e',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        tertiary: {
          DEFAULT: "hsl(var(--tertiary))",
          foreground: "hsl(var(--tertiary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        error: {
          DEFAULT: "hsl(var(--error))",
          foreground: "hsl(var(--error-foreground))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
        },
        text: {
          primary: "hsl(var(--text-primary))",
          secondary: "hsl(var(--text-secondary))",
          muted: "hsl(var(--text-muted))",
          disabled: "hsl(var(--text-disabled))",
        },
        bg: {
          primary: "hsl(var(--bg-primary))",
          secondary: "hsl(var(--bg-secondary))",
          muted: "hsl(var(--bg-muted))",
          accent: "hsl(var(--bg-accent))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        blue: {
          DEFAULT: '#4F46E5', // Primary blue
          light: '#6366F1',
        },
        category: {
          green: '#10B981',
          blue: '#2563EB',
          orange: '#F97316',
          red: '#EF4444',
          purple: '#7C3AED',
          pink: '#EC4899',
          yellow: '#F59E0B',
          cyan: '#06B6D4',
          lime: '#84CC16',
          indigo: '#6366F1',
        },
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: '1rem', // 16px
        '2xl': '1.5rem', // 24px
        '3xl': '2rem', // 32px
        full: '9999px',
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      spacing: {
        '0': 'var(--space-0)',
        '1': 'var(--space-1)',
        '2': 'var(--space-2)',
        '3': 'var(--space-3)',
        '4': 'var(--space-4)',
        '5': 'var(--space-5)',
        '6': 'var(--space-6)',
        '8': 'var(--space-8)',
        '10': 'var(--space-10)',
        '12': 'var(--space-12)',
        '14': 'var(--space-14)',
        '16': 'var(--space-16)',
        '20': 'var(--space-20)',
        '24': 'var(--space-24)',
        '28': 'var(--space-28)',
        '32': 'var(--space-32)',
        'layout': 'var(--gap-layout)',
      },
      boxShadow: {
        card: '0 2px 16px 0 rgba(16, 23, 42, 0.08)',
        cardDeep: '0 8px 32px 0 rgba(16, 23, 42, 0.16)',
        floating: '0 12px 48px 0 rgba(16, 23, 42, 0.24)',
      },
      backgroundImage: {
        'hero-gradient': "linear-gradient(135deg, rgba(15,118,110,0.8), rgba(59,130,246,0.8))",
        'category-green': 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
        'category-blue': 'linear-gradient(135deg, #2563EB 0%, #60A5FA 100%)',
        'category-orange': 'linear-gradient(135deg, #F97316 0%, #FDBA74 100%)',
        'category-red': 'linear-gradient(135deg, #EF4444 0%, #FCA5A5 100%)',
        'category-purple': 'linear-gradient(135deg, #7C3AED 0%, #C4B5FD 100%)',
        'category-pink': 'linear-gradient(135deg, #EC4899 0%, #F9A8D4 100%)',
        'category-yellow': 'linear-gradient(135deg, #F59E0B 0%, #FDE68A 100%)',
        'category-cyan': 'linear-gradient(135deg, #06B6D4 0%, #67E8F9 100%)',
        'category-lime': 'linear-gradient(135deg, #84CC16 0%, #D9F99D 100%)',
        'category-indigo': 'linear-gradient(135deg, #6366F1 0%, #A5B4FC 100%)',
      },
      fontSize: {
        xs: 'var(--font-xs)',
        sm: 'var(--font-sm)',
        base: 'var(--font-base)',
        md: 'var(--font-md)',
        lg: 'var(--font-lg)',
        xl: 'var(--font-xl)',
        '2xl': 'var(--font-2xl)',
        '3xl': 'var(--font-3xl)',
        '4xl': 'var(--font-4xl)',
        '5xl': 'var(--font-5xl)',
        display: 'clamp(2.5rem, 6vw, 4rem)',
        lead: '1.25rem',
        muted: 'var(--font-sm)',
      },
      fontWeight: {
        normal: 'var(--font-weight-normal)',
        medium: 'var(--font-weight-medium)',
        semibold: 'var(--font-weight-semibold)',
        bold: 'var(--font-weight-bold)',
      },
      lineHeight: {
        tight: 'var(--leading-tight)',
        snug: 'var(--leading-snug)',
        normal: 'var(--leading-normal)',
        relaxed: 'var(--leading-relaxed)',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
} 