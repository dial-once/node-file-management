const chai = require('chai');
const fileManagement = require('../src/index');

const BaseProvider = fileManagement.providers.BaseProvider;
const expect = chai.expect;

describe('Mock Provider', () => {
  describe('should create a provider and use it', () => {
    const providerName = 'mock-provider';
    // register a fake provider;
    class MockProvider extends BaseProvider {
      constructor(config) {
        super(config);
        this.name = providerName;
      }

      downloadFile(file) {
        return Promise.resolve(file);
      }

      uploadFile(file) {
        return Promise.resolve(file);
      }

      deleteFile() {
        return Promise.resolve(true);
      }
    }

    fileManagement.providers.add(providerName, MockProvider);
    expect(fileManagement.providers.getNames()).to.include(providerName);
    // use the default provider
    const manager = fileManagement.create(providerName, {});

    expect(manager).to.be.an('Object').and.to.be.ok;
    expect(manager.downloadFile).to.be.a('Function').and.to.be.ok;
    expect(manager.uploadFile).to.be.a('Function').and.to.be.ok;
    expect(manager.deleteFile).to.be.a('Function').and.to.be.ok;

    const testFile = '/path/to/some/imaginary/file';

    it('to upload a file', () => manager
    .uploadFile(testFile)
    .then((result) => {
      expect(result).to.eq(testFile);
    }));

    it('to download a file', () => manager
    .downloadFile(testFile)
    .then((result) => {
      expect(result).to.eq(testFile);
    }));

    it('to delete a file', () => manager.deleteFile(testFile));
  });

  describe('should work without options', () => {
    it('', () => {
      const manager = fileManagement.create('S3', {
        auth: {
          AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
          AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
          AWS_REGION: process.env.AWS_REGION,
        }
      });

      expect(manager).to.be.an('Object').and.to.be.ok;
      expect(manager.downloadFile).to.be.a('Function').and.to.be.ok;
      expect(manager.uploadFile).to.be.a('Function').and.to.be.ok;
      expect(manager.deleteFile).to.be.a('Function').and.to.be.ok;
    });
  });
});
