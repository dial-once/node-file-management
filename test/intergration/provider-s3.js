require('dotenv').load({ silent: true, path: `${__dirname}/.env` });
const chai = require('chai');
const assert = require('assert');
const fs = require('fs');
const fileManagement = require('../../src/index');

const { expect } = chai;

describe('S3 Provider', () => {
  describe('should initialize S3 provider and use it', () => {
    assert(process.env.AWS_ACCESS_KEY_ID, 'AWS_ACCESS_KEY_ID must be defined as env var');
    assert(process.env.AWS_SECRET_ACCESS_KEY, 'AWS_SECRET_ACCESS_KEY must be defined as env var');
    assert(process.env.AWS_REGION, 'process.env.AWS_REGION must be defined as env var');
    assert(process.env.CLOUDFRONT_DISTRIBUTION_ID, 'process.env.CLOUDFRONT_DISTRIBUTION_ID must be defined as env var');

    // use the default provider
    const manager = fileManagement.create('S3', {
      auth: {
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
        AWS_REGION: process.env.AWS_REGION,
      },
      options: {}
    });

    expect(manager).to.be.an('Object').and.to.be.ok;
    expect(manager.downloadFile).to.be.a('Function').and.to.be.ok;
    expect(manager.uploadFile).to.be.a('Function').and.to.be.ok;
    expect(manager.deleteFile).to.be.a('Function').and.to.be.ok;

    const testFileName = 'test-LICENSE';
    const testLocation = 'dialonce-uploads/ci';

    it('to upload a file', () => {
      const stream = fs.createReadStream('./LICENSE');
      return manager
        .uploadFile(testLocation, testFileName, stream)
        .then(({ result }) => {
          expect(result).to.be.an('object').and.to.be.ok;
          expect(result.Location).to.be.a('String')
            .and.to.include(testFileName)
            .and.to.include('dialonce-uploads')
            .and.to.include('ci');
        });
    });

    it('to expose the function to run invalidation after upload', () => {
      const stream = fs.createReadStream('./LICENSE');
      return manager
        .uploadFile(testLocation, testFileName, stream)
        .then((result) => {
          expect(result.invalidate).to.be.a('function');
          expect(result.result).to.be.an('object').and.to.be.ok;
          return result.invalidate();
        })
        .then((result) => {
          expect(result).to.be.an('object').and.to.be.ok;
          expect(result.Invalidation).to.be.an('object');
        });
    });

    it('to download a file', () => {
      const stream = fs.createWriteStream(testFileName);
      return manager
        .downloadFile(testLocation, testFileName, stream)
        .then(() => {
          if (!fs.existsSync(testFileName)) {
            throw new Error('File does not exist');
          } else {
            fs.unlinkSync(testFileName);
          }
        });
    });

    it('to delete a file', () => manager.deleteFile(testLocation, testFileName));
  });

  describe('initialize S3 provider', () => {
    it('should work without options', () => {
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
