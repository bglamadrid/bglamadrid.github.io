const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: {
    files: [
      './src/views/**/*.pug',
      './src/data.json'
    ]
  },
  theme: {
    fontFamily: {
      sans: ['Ubuntu Mono', 'sans-serif'],
    },
  },
  plugins: [
    plugin(function ({ addBase, addUtilities, theme }) {
      addBase({
        '*': { textAlign: 'inherit' },
        'body': { textAlign: 'center' },
        'h1': { fontSize: theme('fontSize.4xl') },
        'h2': { fontSize: theme('fontSize.2xl') },
        'h3': { fontSize: theme('fontSize.xl') },
        'h4': { fontSize: theme('fontSize.lg') },
      })
    })
  ],
};
