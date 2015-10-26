# assert = require('chai').assert
chai = require 'chai'
chaiAsPromised = require 'chai-as-promised'
assert = chai.assert
chai.use(chaiAsPromised)

App = require "../src/main"
a = new App()

describe 'Environment variables', ->
  describe 'Blockspring api', ->
    it 'should be defined', ->
      assert.isDefined a.api
  describe 'Google sheets items url', ->
    it 'should be defined', ->
      assert.isDefined a.gsheet_items_url
  describe 'Google sheets persons url', ->
    it 'should be defined', ->
      assert.isDefined a.gsheet_persons_url

describe 'get Gsheets json promise v2', ->
  it 'should be fulfilled', ->
    return assert.isFulfilled a.getGSheetJsonPromise2(a.gsheet_persons_id, 0, 'SELECT A,B,C,D')

# describe 'Gsheets json', ->
#   describe '#jsonPersonsPromise', ->
#     it 'should get a valid json object', ->
#       return assert.eventually.isObject a.getPersonsJsonPromise()
#       return assert.eventually.isArray a.getPersonsJsonPromise().data
#   describe '#jsonItems per person promise', ->
#     it 'should get a valid json object', ->
#       a.getPersonsJsonPromise().then (result) ->
#         testPerson = result.data[0].Nombre
#         return assert.eventually.isObject a.getItemsPerPersonJsonPromise(testPerson)
#         return assert.eventually.isArray a.getItemsPerPersonJsonPromise(testPerson).data

# describe 'makeListOfEmails', ->
#   @timeout(5000)
#   it 'should get a valid array', ->
#     return assert.eventually.isArray a.getEmailContent()

# describe 'Compose email', ->
#   @timeout(2000)
#   it 'should fulfill', ->
#     return assert.isFulfilled a.sendEachEmail()