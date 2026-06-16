/**
 * Tailwind theme — the Aarogya design system tokens.
 * Palette: warm, dignified, humane health (NOT corporate blue/green).
 * See /docs/design-system.md for the rationale behind every token.
 */
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#103B33', // deep pine-teal — primary text & dark sections
        healing: '#1E6B5C', // mid teal — primary actions
        marigold: '#E58A2E', // warm saffron accent — hope (use sparingly)
        paper: '#F6F4ED', // warm off-white background
        rose: '#C75D54', // care/alert highlight (rare)
        slate: '#5B6B66', // muted captions
        // tints for surfaces/borders
        'paper-deep': '#ECE8DB',
        'healing-soft': '#E3EEEA',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body: ['"Public Sans"', 'system-ui', 'sans-serif'],
        mono: ['"Spline Sans Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        eyebrow: ['0.78rem', { lineHeight: '1', letterSpacing: '0.18em' }],
      },
      borderRadius: {
        xl: '0.9rem',
        '2xl': '1.25rem',
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,59,51,0.04), 0 8px 24px -12px rgba(16,59,51,0.18)',
        lift: '0 12px 40px -16px rgba(16,59,51,0.28)',
      },
      keyframes: {
        'draw-line': {
          from: { strokeDashoffset: '1000' },
          to: { strokeDashoffset: '0' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        pulse: {
          '0%,100%': { opacity: '0.45', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.12)' },
        },
      },
      animation: {
        'draw-line': 'draw-line 2.4s ease-out forwards',
        'fade-up': 'fade-up 0.7s ease-out both',
        'pulse-dot': 'pulse 2.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
