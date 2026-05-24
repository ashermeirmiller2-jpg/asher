/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
        popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        ivory: 'hsl(var(--ivory))',
        bone: 'hsl(var(--bone))',
        charcoal: 'hsl(var(--charcoal))',
        munchy: 'hsl(var(--munchy-red))',
        gold: 'hsl(var(--gold))',
        sun: 'hsl(var(--sun))',
        tomato: 'hsl(var(--tomato))',
        sage: 'hsl(var(--sage))',
        plum: 'hsl(var(--plum))',
        terracotta: 'hsl(var(--terracotta))',
        teal: 'hsl(var(--teal))',
      },
      fontFamily: {
        display: ['"Instrument Serif"', 'Times New Roman', 'serif'],
        body: ['Geist', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 2px rgba(20,10,6,0.04), 0 12px 28px -18px rgba(20,10,6,0.18)',
        'card-hover': '0 4px 8px rgba(20,10,6,0.06), 0 30px 50px -20px rgba(20,10,6,0.28)',
        'card-lg': '0 1px 2px rgba(20,10,6,0.04), 0 16px 40px -20px rgba(20,10,6,0.22)',
        'card-lg-hover': '0 4px 8px rgba(20,10,6,0.06), 0 40px 70px -25px rgba(20,10,6,0.32)',
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
        'fade-up': { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        'shimmer': { '0%': { backgroundPosition: '-700px 0' }, '100%': { backgroundPosition: '700px 0' } },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-up': 'fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'shimmer': 'shimmer 2.2s linear infinite',
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
};
