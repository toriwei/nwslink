/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        nwslElectricBlue: '#0036FF',
        nwslNavy: '#001E60',
        nwslRed: '#EE1B4B',
        nwslDeepRed: '#CB333B',
      },
      keyframes: {
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      },
      animation: {
        slideDown: 'slideDown 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
}
