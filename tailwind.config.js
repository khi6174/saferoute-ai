/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        safe: '#178a58',
        caution: '#d89b00',
        warning: '#e46f27',
        danger: '#d73a31',
        ink: '#17202a',
      },
    },
  },
  plugins: [],
}
