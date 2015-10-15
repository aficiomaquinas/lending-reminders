require('dotenv').load()
util = require 'util'
blockspring = require 'blockspring'


module.exports = class App
  constructor: ->
    @api = process.env.BLOCKSPRING_API
    @gsheet_items = process.env.G_SHEET_ITEMS_URL
    @gsheet_persons = process.env.G_SHEET_PERSONS_URL
    @jsonItemsCache = undefined
    @jsonPersonsCache = undefined
    @jsonItemsPerPersonCache = undefined
  siblingArray = (arr, key, match) ->
    matches = arr.filter((val, index, array) ->
      val[key] is match
    )
    return matches
  getGSheetJson: (url, query, store, callback) =>
    blockspring.runParsed 'query-google-spreadsheet', {
      'query': query
      'url': url
    },
    { api_key: @api },
    (res) =>
      # console.log res.params
      @[store] = res.params
      if callback
        callback()
  getItemsJson: (callback) =>
    @getGSheetJson @gsheet_items, 'SELECT H,I,J,K,N,O,P,Q,R,S\n', 'jsonItemsCache', callback
  getPersonsJson: (callback) =>
    @getGSheetJson @gsheet_persons, 'SELECT A,B,C,D\n', 'jsonPersonsCache', callback
  getItemsPerPersonJson: (person, callback) =>
    @getGSheetJson @gsheet_items, "SELECT H,I,J,K,N,O,P,Q,R,S\nWHERE K CONTAINS '#{person}'", 'jsonItemsPerPersonCache', callback

  init: ->
    false