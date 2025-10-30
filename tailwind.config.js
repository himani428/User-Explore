// tailwind.config.cjs
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7C3AED',
        accent: '#06B6D4',
        soft: '#f6f7fb' // <-- defines the "soft" color so `from-soft` can be generated
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' }
        }
      },
      animation: {
        float: 'float 4s ease-in-out infinite'
      },
      boxShadow: {
        'soft-lg': '0 10px 30px rgba(15, 23, 42, 0.12)'
      }
    }
  },
  plugins: [],
}
