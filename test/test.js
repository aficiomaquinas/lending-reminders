var App, a, assert, chai, chaiAsPromised;

chai = require('chai');

chaiAsPromised = require('chai-as-promised');

assert = chai.assert;

chai.use(chaiAsPromised);

App = require("../src/main");

a = new App();

describe('Environment variables', function() {
  describe('Blockspring api', function() {
    return it('should be defined', function() {
      return assert.isDefined(a.api);
    });
  });
  describe('Google sheets items url', function() {
    return it('should be defined', function() {
      return assert.isDefined(a.gsheet_items_url);
    });
  });
  return describe('Google sheets persons url', function() {
    return it('should be defined', function() {
      return assert.isDefined(a.gsheet_persons_url);
    });
  });
});

describe('get Gsheets json promise v2', function() {
  return it('should be fulfilled', function() {
    return assert.isFulfilled(a.getGSheetJsonPromise2(a.gsheet_persons_id, 0, 'SELECT A,B,C,D'));
  });
});
