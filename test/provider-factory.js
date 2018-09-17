const chai = require('chai');
const fileManagement = require('../src/index');

const { BaseProvider } = fileManagement.providers;
const { expect } = chai;

describe('Provider Factory', () => {
  expect(fileManagement.providers).to.be.an('object').and.to.be.ok;

  it('should be able to get provider names', () => {
    expect(fileManagement.providers.getNames()).to.be.an('Array').and.to.have.length.gt(0);
  });

  it('should be able to get default provider name', () => {
    expect(fileManagement.providers.getDefaultName()).to.be.a('String').and.to.eql('default');
  });

  describe('Add a provider', () => {
    it('should fail if there is no name provider', () => {
      try {
        fileManagement.providers.add();
      } catch (e) {
        expect(e.message).to.eq('name must be provided');
      }
    });

    it('should fail if there is an existing provider already', () => {
      const name = fileManagement.providers.getNames()[0];
      try {
        fileManagement.providers.add(name);
      } catch (e) {
        expect(e.message).to.eq(`Provider ${name} already exists`);
      }
    });

    it('should fail if the name is OK but the class is not instance of BaseProvider', () => {
      try {
        fileManagement.providers.add('test provider', Error);
      } catch (e) {
        expect(e.message).to.eq('class must be instance of BaseProvider');
      }
    });

    it('should add a provider', () => {
      class TestProvider extends BaseProvider {
        constructor(config) {
          super(config);
          this.name = 'test-provider';
        }
      }
      const name = 'testProvider';
      fileManagement.providers.add(name, TestProvider);

      expect(fileManagement.providers.getNames()).to.include(name.toLowerCase());
    });
  });
});
