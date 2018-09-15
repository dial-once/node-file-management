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
  const activeProvider = providerFactory.createProvider(provider, Object.assign({ options: {} }, config));
  /**
   *@class FileManager
   */
  return {
    /**
     * Download a file using a provider
     * @method downloadFile
     * @name downloadFile
     * @param args
     * @return {Promise}
     */
    downloadFile(...args) {
      return activeProvider.downloadFile(...args);
    },

    /**
     * Upload a file using a provider
     * @method
     * @name uploadFile
     * @param args
     * @return {Promise}
     */
    uploadFile(...args) {
      return activeProvider.uploadFile(...args);
    },

    /**
     * Delete a file using a provider
     * @method
     * @name deleteFile
     * @param args
     * @return {Promise}
     */
    deleteFile(...args) {
      return activeProvider.deleteFile(...args);
    }
  };
};

module.exports.providers = providerFactory.providers;
