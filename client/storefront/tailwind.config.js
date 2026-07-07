/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Golden amber - primary brand color. Matches the "Vừa" (medium) flavor.
        brand: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b', // main brand color (amber)
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // Muted rust / rose-brown - the "Mặn" (salty) flavor accent.
        terracotta: {
          50: '#faf1ee',
          100: '#f3ddd6',
          200: '#e3bcae',
          500: '#a45b45',
          600: '#8c4a3a',
          700: '#723a2d',
        },
        // Vivid red-orange - the "Cay" (spicy) flavor accent.
        chili: {
          50: '#fff1eb',
          100: '#ffdfd1',
          200: '#ffbfa1',
          500: '#e8571c',
          600: '#c2410c',
          700: '#9a3412',
        },
      }
    },
  },
  plugins: [],
}
