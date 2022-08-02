# What is this

My website/portfolio. A personal laboratory of sorts.

It used to be a static website, written entirely on pure HTML and CSS. By initially refusing to employ any extra tooling, I got to learn a lot from modern Web standards, and specially, modern CSS.

But eventually I decided to migrate to a more developer-friendly environment, which is what you see here today: a simple Node.JS [Jamstack](https://jamstack.org/what-is-jamstack) mainly composed by:

- [Webpack](https://webpack.js.org), which is the bundler used by Angular, the framework I'm most comfortable with (as of writing this README).
- [Pug](https://pugjs.org), a clean & cute templating library whose syntax I simply adore (and [this awesome Webpack plugin](https://github.com/webdiscus/pug-plugin) that saved me a lot of headaches integrating it).
- [TailwindCSS](https://tailwindcss.com) as the design framework (also sparing me one hell of CSS files).
- [PostCSS](https://postcss.org/) along with its [Preset Env plugin pack](https://github.com/csstools/postcss-plugins/tree/main/plugin-packs/postcss-preset-env) and a [Browserlist](https://github.com/browserslist/browserslist) file to help optimize & polyfill styles (I mostly care about making sure that Safari renders things correctly).
- [Husky](https://typicode.github.io/husky) enforcing the [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/).

This project's original file structure is still preserved in the `static` branch, and at the same time, that branch is now the target of new deployments (a task accomplished by using [GitHub Pages](https://github.com/tschaub/gh-pages)).


# Getting started

- `npm run build` will build the production-ready static site on `/dist` directory
- `npm run dev` will initiate the webpack-dev-server on port 80
- `npm run watch` will build the site automatically whenever a change is made (but will not embed a webserver)


# To-Do

- Localize to spanish
- Support static & scripted language switch
- Introduce task to build & deploy the site in parallel for english and spanish locales
