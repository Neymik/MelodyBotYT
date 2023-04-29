'use strict';

const defaultConfig = require('./config.tmpl');

let localConfig = {};
try {
  localConfig = require('./config');
} catch (error) {
  console.warn('Local config not found, using tmpl config!');
}

const exportsConfig = localConfig ? Object.assign(defaultConfig, localConfig) : defaultConfig;

module.exports = exportsConfig;
