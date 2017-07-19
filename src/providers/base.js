const config = Symbol.for('config');

class BaseProvider {
  /**
   *
   * @param {Configuration} configuration
   */
  constructor(configuration = {}) {
    this[config] = configuration;
  }

  /**
   *Gets the current configuration
   * @return {Configuration}
   */
  get configuration() {
    return this[config];
  }

  uploadFile() {
    throw new Error('Must be overridden by implementing class!');
  }

  downloadFile() {
    throw new Error('Must be overridden by implementing class!');
  }

  deleteFile() {
    throw new Error('Must be overridden by implementing class!');
  }
}

module.exports = BaseProvider;
