require('dotenv').load()
util = require 'util'
blockspring = require 'blockspring'
escape = require 'escape-html'
request = require 'request'


module.exports = class App
  constructor: ->
    @api = process.env.BLOCKSPRING_API
    @gsheet_items_url = process.env.G_SHEET_ITEMS_URL
    @gsheet_persons_url = process.env.G_SHEET_PERSONS_URL
    @gsheet_items_id = process.env.G_SHEET_ITEMS_ID
    @gsheet_persons_id = process.env.G_SHEET_PERSONS_ID
    @email = []

  siblingArray = (arr, key, match) ->
    matches = arr.filter((val, index, array) ->
      val[key] is match
    )
    return matches
  
  getGSheetJsonPromise: (url, query) ->
    return new Promise (resolve, reject) ->
      blockspring.runParsed 'query-google-spreadsheet', {
        'query': query
        'url': url
      },
      { api_key: @api },
      (res) ->
        if res.params
          if res.params.data
            resolve(res.params)
          else
            reject(res)
        else
          reject(Error("Gsheets response has no parameters"))
        # console.log res.params

  getGSheetJsonPromise2: (id, gid, query) =>
    return new Promise (resolve, reject) =>
      request "https://spreadsheets.google.com/tq?tqx=out:json&tq=#{encodeURIComponent(query)}&key=#{id}&gid=#{gid}", (err, res, body) =>
        if !err and res.statusCode == 200
          regex = /google\.visualization\.Query\.setResponse\((.*)\);/g
          match = regex.exec(res.body)
          json = JSON.parse(match[1])
          # console.log match[1]
          if json.status is 'ok'
            resolve json
          else
            reject res
        else
          reject res
          console.log res

  getPersonsJsonPromise: () =>
    @getGSheetJsonPromise @gsheet_persons_url, 'SELECT A,B,C,D\n'
  
  getItemsPerPersonJsonPromise: (person) =>
    @getGSheetJsonPromise @gsheet_items_url, "SELECT H,I,J,K,N,P,Q\nWHERE K CONTAINS '#{person}' AND R CONTAINS 'To' AND O CONTAINS '0' AND S CONTAINS '1'"

  getEmailContent: (arr) =>
    return Promise.all arr.map (person) =>
      return @getItemsPerPersonJsonPromise(person.Nombre).then (result) =>
        
        # Empezar tabla de elementos
        newEmailContent = "<ul>"

        for item in result.data
          newEmailContent += "<li>" + escape("""
            Artículo: #{item.Articulo}
            Tipo: #{item['Tipo de artículo']}
            Nombre: #{item['Tipo de artículo']}
            Fecha de préstamo: #{item['Fecha de prestamo']}
            Imagen: #{item['Imagen cache']}
          """) + "</li>"
          if item['Tipo de artículo'] is "Libro"
            newEmailContent += "<li>" + escape("""
              Autor: #{item['Book author']}
              Link amazon: #{item['Book link']}
            """) + "</li>"
        
        # Cerrar tabla de elementos
        newEmailContent += "</ul>"

        newPerson =
          name: person.Nombre
          meta:
            from: "victtorglez@gmail.com"
            to: person.Email
            subject: "#{person.Nombre}: recordatorio de préstamos"
          content: "<p>" + [
            escape("""
              Hola estimado/a #{person.Nombre},
            """),
            escape("""
              Este es un recordatorio automatizado de que tienes actualmente en tu posesión los siguientes libros pertenecientes a tu amigo Víctor, para que no se te olvide de que no son tuyos, ¡son prestados! xD.
            """),
            newEmailContent.replace /\\n/g, "</li><li>"
          ].join("</p><p>") + "</p>"

        console.log newPerson
        return newPerson

  makeListOfEmails: () =>
    @getPersonsJsonPromise()
      .then (result) =>
        return @getEmailContent result.data
      .then (result) =>
        console.log result
        return result

  init: ->
    false