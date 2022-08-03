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
    plugin(function ({ addBase, addComponents, theme }) {
      addBase({
        '*': { textAlign: 'inherit' },
        'body': { textAlign: 'center' },
        'h1': { fontSize: theme('fontSize.4xl') },
        'h2': { fontSize: theme('fontSize.2xl') },
        'h3': { fontSize: theme('fontSize.xl') },
        'h4': { fontSize: theme('fontSize.lg') },
      });
      addComponents({
        'main > * > .container': {
          display: 'grid',
          gap: theme('gap.4'),
          justifyItems: 'center',
          padding: theme('spacing.4'),
          maxWidth: theme('maxWidth.screen-lg'),
          boxShadow: theme('boxShadow.md'),
          borderRadius: theme('borderRadius.DEFAULT'),
        },
      });
    })
  ],
};
