/*
 * @class Configuration
 * @property {Object} auth - the auth object
 * @property {Object} options -  the other options
 */

/**
 * * Creates a new configuration object
 * @param {Object} auth the auth object
 * @param {Object} options the other options
 * @return {Configuration} teh configuration object
 */
module.exports.create = (auth = {}, options = {}) => Object.create(Object.prototype, {
  auth: { value: auth },
  options: { value: options }
});
