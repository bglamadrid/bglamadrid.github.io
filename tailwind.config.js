const plugin = require('tailwindcss/plugin')
const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: {
    files: [
      './src/views/**/*.pug',
      './src/mixins/**/*.pug',
      './src/scripts/**/*.ts',
      './src/data.json'
    ]
  },
  theme: {
    fontFamily: {
      // sourced from `/src/includes/googlefonts.pug`
      sans: ['FantasqueSansMono Nerd Font', 'sans-serif'],
    },
    extend: {
      height: {
        'header': defaultTheme.spacing['32']
      },
      minHeight: ({ theme }) => ({
        'fullscreen': `calc(100vh - ${theme('height.header')})`
      })
    }
  },
  plugins: [
    plugin(function ({ addBase, addComponents, theme }) {
      addBase({
        '*': { textAlign: 'inherit' },
        'body': { textAlign: 'center' },
        'section:target': { scrollMarginTop: theme('height.header') },
        'h1': { fontSize: theme('fontSize.4xl') },
        'h2': { fontSize: theme('fontSize.2xl') },
        'h3': { fontSize: theme('fontSize.xl') },
        'h4': { fontSize: theme('fontSize.lg') },
      });
      addComponents({
        'main > * > .container': {
          display: 'grid',
          gap: theme('gap.4'),
          marginLeft: 'auto',
          marginRight: 'auto',
          justifyItems: 'center',
          maxWidth: theme('maxWidth.screen-lg'),
          boxShadow: theme('boxShadow.md'),
          borderRadius: theme('borderRadius.DEFAULT'),
        },
      });
    })
  ],
};
