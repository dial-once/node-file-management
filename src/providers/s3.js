const S3 = require('aws-sdk/clients/s3');
const assert = require('assert');
const BaseProvider = require('./base');

const s3 = Symbol('s3');

class S3Provider extends BaseProvider {
  /**
   * Creates a new s3 provider
   * @param {Configuration} config
   */
  constructor(config) {
    super(config);
    this.name = 'S3';
    this[s3] = new S3({
      maxRetries: config.options.maxRetries || 1,
      accessKeyId: config.auth.AWS_ACCESS_KEY_ID || null,
      secretAccessKey: config.auth.AWS_SECRET_ACCESS_KEY || null,
      region: config.auth.AWS_REGION || null
    });

    this.uploadFile = this.uploadFile.bind(this);
    this.downloadFile = this.downloadFile.bind(this);
    this.deleteFile = this.deleteFile.bind(this);
  }

  downloadFile(location, uploadName, writableStream) {
    return new Promise((resolve, reject) => {
      assert(location, 'location of the upload needs to be provided');
      assert(uploadName, 'uploadName needs to be provided');
      assert(writableStream, 'writableStream needs to be provided');

      const opts = this.configuration.options;
      const params = Object.assign({}, opts, {
        Bucket: location,
        Key: uploadName,
      });

      return this[s3]
        .getObject(params)
        .createReadStream()
        .on('end', () => resolve(true))
        .on('error', error => reject(error))
        .pipe(writableStream);
    });
  }

  uploadFile(location, uploadName, fileStream) {
    return new Promise((resolve, reject) => {
      assert(location, 'location of the upload needs to be provided');
      assert(uploadName, 'uploadName needs to be provided');
      assert(fileStream, 'fileStream needs to be provided');

      const opts = this.configuration.options;
      // this can take in other s3 options if provided
      const params = Object.assign({}, opts, {
        Bucket: location,
        Key: uploadName,
        Body: fileStream
      });

      const upload = this[s3].upload(params);

      return upload.send((err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      });
    });
  }

  deleteFile(location, uploadName) {
    return new Promise((resolve, reject) => {
      assert(location, 'location of the upload needs to be provided');
      assert(uploadName, 'uploadName needs to be provided');

      const opts = this.configuration.options;
      const params = Object.assign({}, opts, {
        Bucket: location,
        Key: uploadName,
      });

      return this[s3]
        .deleteObject(params, (err, result) => {
          if (err) {
            return reject(err);
          }
          return resolve(result);
        });
    });
  }
}

module.exports = S3Provider;
