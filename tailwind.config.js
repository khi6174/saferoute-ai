/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#0F172A',
        slate: '#334155',
        appbg: '#F8FAFC',
        card: '#FFFFFF',
        line: '#E2E8F0',
        amber: '#F59E0B',
        safe: '#10B981',
        warning: '#F97316',
        danger: '#EF4444',
        info: '#3B82F6',
        ink: '#0F172A',
      },
    },
  },
  plugins: [],
}
