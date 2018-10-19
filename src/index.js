const assert = require('assert');
const providerFactory = require('./providers/factory').create();
const defaultConfig = require('./providers/config').create();
/**
 * @constructor
 * Create a file-management manager instance
 * @param {String} provider, the name of the provider to use. Use 'default' if no other provided
 * @param {Configuration} config the configuration options and provider auth
 * @return {FileManager} an instance of the file manager
 */
module.exports.create = (provider = 'default', config = defaultConfig) => {
  assert(provider, 'A provider must be specified');
  return providerFactory.createProvider(provider, Object.assign({ options: {} }, config));
};

module.exports.providers = providerFactory.providers;
