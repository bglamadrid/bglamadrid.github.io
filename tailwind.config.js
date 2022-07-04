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
  plugins: [],
}
