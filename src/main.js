var App, blockspring, util,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

require('dotenv').load();

util = require('util');

blockspring = require('blockspring');

module.exports = App = (function() {
  var siblingArray;

  function App() {
    this.getItemsPerPersonJson = bind(this.getItemsPerPersonJson, this);
    this.getPersonsJson = bind(this.getPersonsJson, this);
    this.getItemsJson = bind(this.getItemsJson, this);
    this.getGSheetJson = bind(this.getGSheetJson, this);
    this.api = process.env.BLOCKSPRING_API;
    this.gsheet_items = process.env.G_SHEET_ITEMS_URL;
    this.gsheet_persons = process.env.G_SHEET_PERSONS_URL;
    this.jsonItemsCache = void 0;
    this.jsonPersonsCache = void 0;
    this.jsonItemsPerPersonCache = void 0;
  }

  siblingArray = function(arr, key, match) {
    var matches;
    matches = arr.filter(function(val, index, array) {
      return val[key] === match;
    });
    return matches;
  };

  App.prototype.getGSheetJson = function(url, query, store, callback) {
    return blockspring.runParsed('query-google-spreadsheet', {
      'query': query,
      'url': url
    }, {
      api_key: this.api
    }, (function(_this) {
      return function(res) {
        _this[store] = res.params;
        if (callback) {
          return callback();
        }
      };
    })(this));
  };

  App.prototype.getItemsJson = function(callback) {
    return this.getGSheetJson(this.gsheet_items, 'SELECT H,I,J,K,N,O,P,Q,R,S\n', 'jsonItemsCache', callback);
  };

  App.prototype.getPersonsJson = function(callback) {
    return this.getGSheetJson(this.gsheet_persons, 'SELECT A,B,C,D\n', 'jsonPersonsCache', callback);
  };

  App.prototype.getItemsPerPersonJson = function(person, callback) {
    return this.getGSheetJson(this.gsheet_items, "SELECT H,I,J,K,N,O,P,Q,R,S\nWHERE K CONTAINS '" + person + "'", 'jsonItemsPerPersonCache', callback);
  };

  App.prototype.init = function() {
    return false;
  };

  return App;

})();
