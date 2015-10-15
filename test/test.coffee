assert = require('chai').assert

App = require "../src/main"
a = new App()

describe 'Environment variables', ->
  describe 'Blockspring api', ->
    it 'should be defined', ->
      assert.isDefined a.api
  describe 'Google sheets items url', ->
    it 'should be defined', ->
      assert.isDefined a.gsheet_items
  describe 'Google sheets persons url', ->
    it 'should be defined', ->
      assert.isDefined a.gsheet_persons

describe 'Gsheets json', ->
  describe '#jsonItems', ->
    it 'should get a valid json object', (done) ->
      a.getItemsJson ->
        assert.isObject a.jsonItemsCache
        assert.isArray a.jsonItemsCache.data
        done()
  describe '#jsonPersons', ->
    it 'should get a valid json object', (done) ->
      a.getPersonsJson ->
        assert.isObject a.jsonPersonsCache
        assert.isArray a.jsonPersonsCache.data
        done()
  describe '#jsonItems per person', ->
    it 'should get a valid json object', (done) ->
      testPerson = a.jsonPersonsCache.data[0].Nombre
      a.getItemsPerPersonJson testPerson, ->
        assert.isObject a.jsonPersonsCache
        assert.isArray a.jsonPersonsCache.data
        done()