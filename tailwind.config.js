/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'scene-gradient': 'linear-gradient(0deg, rgba(253, 228, 255, 1) 0%, rgba(124, 156, 254, 1) 100%)',
      },
    },
  },
  daisyui: {
    themes: ['dark', 'light'],
  },
  plugins: [require('daisyui')],
}
