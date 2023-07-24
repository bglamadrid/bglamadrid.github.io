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
      sans: [
        'Ubuntu',
        ...defaultTheme.fontFamily.sans
      ],
      mono: [
        'Ubuntu Mono',
        ...defaultTheme.fontFamily.mono
      ],
      heading: ['Fira Sans']
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
        'h1': {
          fontFamily: theme('fontFamily.heading'),
          fontSize: theme('fontSize.2xl'),
          fontWeight: 'bold',
          textTransform: 'uppercase'
        },
        'h2': {
          fontFamily: theme('fontFamily.heading'),
          fontSize: theme('fontSize.xl'),
          fontWeight: 'bold',
          textTransform: 'uppercase'
        },
        'h3': {
          fontFamily: theme('fontFamily.heading'),
          fontSize: theme('fontSize.lg'),
          fontWeight: 'bold',
        },
        'h4': {
          fontFamily: theme('fontFamily.heading'),
          fontSize: theme('fontSize.md')
        },
      });
      addComponents({
        'main > * > .container': {
          display: 'grid',
          gap: theme('gap.4'),
          marginLeft: 'auto',
          marginRight: 'auto',
          justifyItems: 'center',
          borderRadius: theme('borderRadius.DEFAULT'),
        },
      });
    })
  ],
};
