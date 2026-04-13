import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ivory: '#FDFCF5',
        charcoal: '#1C1C1E',
        space: '#0A0F1E',
        'space-mid': '#0F1628',
        'space-light': '#151D35',
        violet: {
          neon: '#8B5CF6',
          bright: '#A78BFA',
          deep: '#6D28D9',
          glow: '#7C3AED',
        },
        cyan: {
          glacial: '#06B6D4',
          bright: '#22D3EE',
          ice: '#67E8F9',
          pale: '#A5F3FC',
        },
        gold: {
          light: '#D4AF72',
          DEFAULT: '#B8962A',
        },
      },
      fontFamily: {
        serif: ['Nunito', 'system-ui', 'sans-serif'],
        sans: ['Nunito', 'system-ui', 'sans-serif'],
        signature: ['Caveat', 'cursive'],
        typewriter: ['Nunito', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'Courier New', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'space-gradient': 'linear-gradient(135deg, #0A0F1E 0%, #0F1628 50%, #0A0F1E 100%)',
        'violet-glow': 'radial-gradient(ellipse at center, rgba(139,92,246,0.15) 0%, transparent 70%)',
        'cyan-glow': 'radial-gradient(ellipse at center, rgba(6,182,212,0.15) 0%, transparent 70%)',
      },
      boxShadow: {
        'ice': '0 8px 32px 0 rgba(6, 182, 212, 0.08), inset 0 1px 0 rgba(255,255,255,0.08)',
        'ice-hover': '0 16px 48px 0 rgba(6, 182, 212, 0.15), 0 0 0 0.5px rgba(6,182,212,0.2), inset 0 1px 0 rgba(255,255,255,0.12)',
        'violet-glow': '0 0 40px rgba(139, 92, 246, 0.3)',
        'cyan-glow': '0 0 40px rgba(6, 182, 212, 0.3)',
        'gold-glow': '0 0 30px rgba(212, 175, 114, 0.25)',
        'neon-violet': '0 0 20px rgba(139,92,246,0.6), 0 0 60px rgba(139,92,246,0.2)',
        'neon-cyan': '0 0 20px rgba(6,182,212,0.6), 0 0 60px rgba(6,182,212,0.2)',
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'scan': 'scan 2s ease-in-out infinite',
        'radar-sweep': 'radarSweep 3s linear infinite',
        'log-scroll': 'logScroll 5s linear infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        scan: {
          '0%, 100%': { opacity: '0.4', transform: 'scaleX(1)' },
          '50%': { opacity: '1', transform: 'scaleX(1.02)' },
        },
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        logScroll: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-50%)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.6', boxShadow: '0 0 20px rgba(139,92,246,0.3)' },
          '50%': { opacity: '1', boxShadow: '0 0 40px rgba(139,92,246,0.7)' },
        },
      },
      backdropBlur: {
        'xs': '2px',
        'ice': '25px',
      },
      borderWidth: {
        'half': '0.5px',
      },
    },
  },
  plugins: [],
}

export default config
