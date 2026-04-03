module.exports = {
  root: true,

  parserOptions: {
    parser: require.resolve('@babel/eslint-parser'),
    requireConfigFile: false,
    sourceType: 'module',
  },

  env: {
    browser: true,
    'vue/setup-compiler-macros': true,
  },

  extends: [
    'airbnb-base',
    'plugin:vue/vue3-essential',
  ],

  plugins: [
    'vue',
  ],

  globals: {
    ga: 'readonly',
    cordova: 'readonly',
    __statics: 'readonly',
    __QUASAR_SSR__: 'readonly',
    __QUASAR_SSR_SERVER__: 'readonly',
    __QUASAR_SSR_CLIENT__: 'readonly',
    __QUASAR_SSR_PWA__: 'readonly',
    process: 'readonly',
    Capacitor: 'readonly',
    chrome: 'readonly',
  },

  rules: {
    'no-param-reassign': 'off',
    'import/first': 'off',
    'import/named': 'error',
    'import/namespace': 'error',
    'import/default': 'error',
    'import/export': 'error',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/prefer-default-export': 'off',
    'prefer-promise-reject-errors': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  },
};
