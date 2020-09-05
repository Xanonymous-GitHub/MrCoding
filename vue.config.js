/* eslint-disable @typescript-eslint/no-var-requires */
const isProduction = process.env.NODE_ENV === 'production'
const path = require('path')
const PrerenderSpaPlugin = require('prerender-spa-plugin')
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcssPresetEnv = require('postcss-preset-env');
const postcssImport = require('postcss-import');
const postcssPlugin = require('postcss-plugin');
const postcssAssets = require('postcss-assets');
const resolve = dir => path.join(__dirname, dir);
const renderRoutes = (() => {
  const routes = [
    '/',
  ].map((route) => route.replace(/\/$/, ''))
  routes.push(...routes.map((route) => `${route}/`))
  return routes
})()


module.exports = {
  devServer: {
    proxy: 'http://mrcoding.org:8787'
  },
  "transpileDependencies": [
    "vuetify",
    "vuex-module-decorators"
  ],
  pages: {
    index: {
      entry: "src/main.ts",
      template: 'public/index.html',
      filename: 'index.html',
      title: "NPC Mr.coding",
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    }
  },
  productionSourceMap: false,
  css: {
    sourceMap: false,
    extract: {
      ignoreOrder: true,
    },
    loaderOptions: {
      postcss: {
        map: false,
        plugins: [
          autoprefixer,
          cssnano,
          postcssPresetEnv,
          postcssImport,
          postcssPlugin,
          postcssAssets
        ]
      },
    }
  },
  chainWebpack: config => {
    config.performance
      .maxEntrypointSize(1000000)
      .maxAssetSize(1000000)
  },
  configureWebpack: config => {
    config.optimization = {}
    const plugins = [];
    if (isProduction) {
      plugins.push(
        new PrerenderSpaPlugin({
          staticDir: resolve("dist"),
          routes: renderRoutes,
          registry: undefined,
          useRenderEvent: true,
          onlyProduction: true,
          postProcess(renderedRoute) {
            renderedRoute.route = renderedRoute.originalRoute
            if (renderedRoute.route.endsWith('.html')) {
              renderedRoute.outputPath = path.join(__dirname, 'dist', renderedRoute.route)
            }
            return renderedRoute
          },
          minify: {
            collapseBooleanAttributes: true,
            collapseWhitespace: true,
            decodeEntities: true,
            keepClosingSlash: true,
            sortAttributes: true
          },
          renderer: new PrerenderSpaPlugin.PuppeteerRenderer({
            renderAfterDocumentEvent: "app-rendered",
            maxConcurrentRoutes: 20,
            headless: true,
          })
        })
      )
    }
    config.plugins = [...config.plugins, ...plugins];
  },
}
