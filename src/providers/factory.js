const providers = new Map();
const S3Provider = require('./s3');
const BaseProvider = require('./base');

/**
 * @class ProviderFactory
 * @classdesc The provider factory is used to locate instantiate providers
 * @property {Function} createProvider
 */

/**
 * Create and instance of the provider factory
 * @return {ProviderFactory} chosen provider
 */
module.exports.create = () => {
  // keys should be lowercased
  // init providers
  providers.set('s3', S3Provider);
  providers.set('default', S3Provider);

  return {
    /**
     * @method
     * @name createProvider
     * Creates a provider by it's name and passes in the configuration
     * @param {String} providerName
     * @param {Configuration} config
     * @return {BaseProvider} a provider for file management
     */
    createProvider(providerName = 'default', config = {}) {
      const normalizedName = providerName.toLowerCase();
      if (!providers.has(normalizedName)) {
        throw new Error(`${providerName} is not an existent provider`);
      }
      const Clazz = providers.get(normalizedName);
      return new Clazz(config);
    },
    providers: {
      BaseProvider,
      getNames() {
        return [...providers.keys()];
      },

      getDefaultName() {
        return 'default';
      },

      add(name, clazz) {
        if (!name) {
          throw new Error('name must be provided');
        }
        const normalizedName = name.toLowerCase();
        if (providers.has(normalizedName)) {
          throw new Error(`Provider ${name} already exists`);
        }

        if (!(clazz.prototype instanceof BaseProvider)) {
          throw new Error('class must be instance of BaseProvider');
        }

        providers.set(normalizedName, clazz);
      }
    }
  };
};
