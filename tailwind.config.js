import defaultTheme from 'tailwindcss/defaultTheme';
import plugin from 'tailwindcss/plugin';
import typographyPlugin from '@tailwindcss/typography';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,json,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--aw-color-primary)',
        secondary: 'var(--aw-color-secondary)',
        accent: 'var(--aw-color-accent)',
        default: 'var(--aw-color-text-default)',
        muted: 'var(--aw-color-text-muted)',
        bond: {
          yellow: {
            main: 'var(--bond-yellow-main)',
            deep: 'var(--bond-yellow-deep)',
          },
          navy: 'var(--bond-navy)',
          brown: 'var(--bond-brown)',
          surface: 'var(--bond-surface)',
          background: 'var(--bond-background)',
          text: {
            main: 'var(--bond-text-main)',
            sub: 'var(--bond-text-sub)',
          },
          border: 'var(--bond-border)',
        },
      },
      fontFamily: {
        sans: ['var(--aw-font-sans)', 'Helvetica Neue', 'Helvetica', 'Arial', ...defaultTheme.fontFamily.sans],
        serif: ['var(--aw-font-serif)', 'Didot', 'Bodoni MT', 'Noto Serif JP', ...defaultTheme.fontFamily.serif],
        heading: ['var(--aw-font-heading)', 'Didot', 'Bodoni MT', ...defaultTheme.fontFamily.serif],
        mono: ['var(--aw-font-mono)', 'Courier New', 'Courier', ...defaultTheme.fontFamily.mono],
      },

      fontSize: {
        '7xl': ['4.5rem', { lineHeight: '1.3' }],
      },

      animation: {
        fade: 'fadeInUp 1s both',
      },

      keyframes: {
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(2rem)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    typographyPlugin,
    plugin(({ addVariant }) => {
      addVariant('intersect', '&:not([no-intersect])');
    }),
  ],
  darkMode: 'class',
};
