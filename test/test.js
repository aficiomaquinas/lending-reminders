var App, a, assert;

assert = require('chai').assert;

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
      return assert.isDefined(a.gsheet_items);
    });
  });
  return describe('Google sheets persons url', function() {
    return it('should be defined', function() {
      return assert.isDefined(a.gsheet_persons);
    });
  });
});

describe('Gsheets json', function() {
  describe('#jsonItems', function() {
    return it('should get a valid json object', function(done) {
      return a.getItemsJson(function() {
        assert.isObject(a.jsonItemsCache);
        assert.isArray(a.jsonItemsCache.data);
        return done();
      });
    });
  });
  describe('#jsonPersons', function() {
    return it('should get a valid json object', function(done) {
      return a.getPersonsJson(function() {
        assert.isObject(a.jsonPersonsCache);
        assert.isArray(a.jsonPersonsCache.data);
        return done();
      });
    });
  });
  return describe('#jsonItems per person', function() {
    return it('should get a valid json object', function(done) {
      var testPerson;
      testPerson = a.jsonPersonsCache.data[0].Nombre;
      return a.getItemsPerPersonJson(testPerson, function() {
        assert.isObject(a.jsonPersonsCache);
        assert.isArray(a.jsonPersonsCache.data);
        return done();
      });
    });
  });
});
