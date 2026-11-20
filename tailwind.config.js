/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#FAF9F5',
        ink: '#1F2937',
        'text-muted': '#6B7280',
        'brand-blue': '#2563EB',
        'brand-blue-hover': '#1D4ED8',
        'card-bg': '#FFFFFF',
        'state-secure': '#059669',
        'state-uncertain': '#D97706',
        'state-gap': '#4B5563',
        'state-blindspot': '#DC2626',
      },
      fontFamily: {
        sans: ['"Bricolage Grotesque"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

