import debug from 'debug';

// We need to define `ReactIntl` on the global scope
// in order to load specific locale data from `ReactIntl`
// see: https://github.com/iam4x/isomorphic-flux-boilerplate/issues/64
if (process.env.BROWSER) window.ReactIntl = require('react-intl');

const loaders = {

  en(callback, force = false) {
    if (!window.Intl || force) {
      require.ensure([
        'intl',
        'intl/locale-data/jsonp/en.js',
        'data/en'
      ], (require) => {
        require('intl');
        require('intl/locale-data/jsonp/en.js');
        const lang = require('data/en');
        return callback(lang);
      });
    }
    else {
      require.ensure([
        'react-intl/dist/locale-data/en.js',
        'data/en'
      ], (require) => {
        require('react-intl/dist/locale-data/en.js');
        const lang = require('data/en');
        return callback(lang);
      });
    }
  },

  ru(callback, force = false) {
    if (!window.Intl || force) {
      require.ensure([
        'intl',
        'intl/locale-data/jsonp/ru.js',
        'data/ru'
      ], (require) => {
        require('intl');
        require('intl/locale-data/jsonp/ru.js');
        const lang = require('data/ru');
        return callback(lang);
      });
    }
    else {
      require.ensure([
        'react-intl/dist/locale-data/ru.js',
        'data/ru'
      ], (require) => {
        require('react-intl/dist/locale-data/ru.js');
        const lang = require('data/ru');
        return callback(lang);
      });
    }
  }

};

export default (locale, force) => {
  debug('dev')(`loading lang ${locale}`);
  return new Promise((resolve) => loaders[locale](resolve, force));
};
