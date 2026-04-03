/* eslint-env node */
const { configure } = require('quasar/wrappers');

module.exports = configure(function (/* ctx */) {
  return {
    boot: [
      'mathjax',
      'i18n',
      'axios',
    ],

    css: [
      'app.sass',
    ],

    extras: [
      'roboto-font',
      'material-icons',
    ],

    build: {
      target: {
        browser: ['es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1'],
        node: 'node20',
      },
      vueRouterMode: 'hash',
      distDir: 'docs',
    },

    devServer: {
      port: 8080,
      open: true,
    },

    framework: {
      config: {},
      iconSet: 'material-icons',
      lang: 'en-US',
      components: [],
      directives: [],
      plugins: [],
    },

    animations: [],

    ssr: {
      pwa: false,
      prodPort: 3000,
      middlewares: [],
    },

    pwa: {
      workboxMode: 'generateSW',
      injectPwaMetaTags: true,
      swFilename: 'sw.js',
      manifestFilename: 'manifest.json',
      useCredentialsForManifestTag: false,
    },

    capacitor: {
      hideSplashscreen: true,
    },

    electron: {
      inspectPort: 5858,
      bundler: 'packager',
      packager: {},
      builder: {
        appId: 'fem',
      },
    },
  };
});
