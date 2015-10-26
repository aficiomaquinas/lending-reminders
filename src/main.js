var App, blockspring, escape, request, util,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

require('dotenv').load();

util = require('util');

blockspring = require('blockspring');

escape = require('escape-html');

request = require('request');

module.exports = App = (function() {
  var siblingArray;

  function App() {
    this.makeListOfEmails = bind(this.makeListOfEmails, this);
    this.getEmailContent = bind(this.getEmailContent, this);
    this.getItemsPerPersonJsonPromise = bind(this.getItemsPerPersonJsonPromise, this);
    this.getPersonsJsonPromise = bind(this.getPersonsJsonPromise, this);
    this.getGSheetJsonPromise2 = bind(this.getGSheetJsonPromise2, this);
    this.api = process.env.BLOCKSPRING_API;
    this.gsheet_items_url = process.env.G_SHEET_ITEMS_URL;
    this.gsheet_persons_url = process.env.G_SHEET_PERSONS_URL;
    this.gsheet_items_id = process.env.G_SHEET_ITEMS_ID;
    this.gsheet_persons_id = process.env.G_SHEET_PERSONS_ID;
    this.email = [];
  }

  siblingArray = function(arr, key, match) {
    var matches;
    matches = arr.filter(function(val, index, array) {
      return val[key] === match;
    });
    return matches;
  };

  App.prototype.getGSheetJsonPromise = function(url, query) {
    return new Promise(function(resolve, reject) {
      return blockspring.runParsed('query-google-spreadsheet', {
        'query': query,
        'url': url
      }, {
        api_key: this.api
      }, function(res) {
        if (res.params) {
          if (res.params.data) {
            return resolve(res.params);
          } else {
            return reject(res);
          }
        } else {
          return reject(Error("Gsheets response has no parameters"));
        }
      });
    });
  };

  App.prototype.getGSheetJsonPromise2 = function(id, gid, query) {
    return new Promise((function(_this) {
      return function(resolve, reject) {
        return request("https://spreadsheets.google.com/tq?tqx=out:json&tq=" + (encodeURIComponent(query)) + "&key=" + id + "&gid=" + gid, function(err, res, body) {
          var json, match, regex;
          if (!err && res.statusCode === 200) {
            regex = /google\.visualization\.Query\.setResponse\((.*)\);/g;
            match = regex.exec(res.body);
            json = JSON.parse(match[1]);
            if (json.status === 'ok') {
              return resolve(json);
            } else {
              return reject(res);
            }
          } else {
            reject(res);
            return console.log(res);
          }
        });
      };
    })(this));
  };

  App.prototype.getPersonsJsonPromise = function() {
    return this.getGSheetJsonPromise(this.gsheet_persons_url, 'SELECT A,B,C,D\n');
  };

  App.prototype.getItemsPerPersonJsonPromise = function(person) {
    return this.getGSheetJsonPromise(this.gsheet_items_url, "SELECT H,I,J,K,N,P,Q\nWHERE K CONTAINS '" + person + "' AND R CONTAINS 'To' AND O CONTAINS '0' AND S CONTAINS '1'");
  };

  App.prototype.getEmailContent = function(arr) {
    return Promise.all(arr.map((function(_this) {
      return function(person) {
        return _this.getItemsPerPersonJsonPromise(person.Nombre).then(function(result) {
          var i, item, len, newEmailContent, newPerson, ref;
          newEmailContent = "<ul>";
          ref = result.data;
          for (i = 0, len = ref.length; i < len; i++) {
            item = ref[i];
            newEmailContent += "<li>" + escape("Artículo: " + item.Articulo + "\nTipo: " + item['Tipo de artículo'] + "\nNombre: " + item['Tipo de artículo'] + "\nFecha de préstamo: " + item['Fecha de prestamo'] + "\nImagen: " + item['Imagen cache']) + "</li>";
            if (item['Tipo de artículo'] === "Libro") {
              newEmailContent += "<li>" + escape("Autor: " + item['Book author'] + "\nLink amazon: " + item['Book link']) + "</li>";
            }
          }
          newEmailContent += "</ul>";
          newPerson = {
            name: person.Nombre,
            meta: {
              from: "victtorglez@gmail.com",
              to: person.Email,
              subject: person.Nombre + ": recordatorio de préstamos"
            },
            content: "<p>" + [escape("Hola estimado/a " + person.Nombre + ","), escape("Este es un recordatorio automatizado de que tienes actualmente en tu posesión los siguientes libros pertenecientes a tu amigo Víctor, para que no se te olvide de que no son tuyos, ¡son prestados! xD."), newEmailContent.replace(/\\n/g, "</li><li>")].join("</p><p>") + "</p>"
          };
          console.log(newPerson);
          return newPerson;
        });
      };
    })(this)));
  };

  App.prototype.makeListOfEmails = function() {
    return this.getPersonsJsonPromise().then((function(_this) {
      return function(result) {
        return _this.getEmailContent(result.data);
      };
    })(this)).then((function(_this) {
      return function(result) {
        console.log(result);
        return result;
      };
    })(this));
  };

  App.prototype.init = function() {
    return false;
  };

  return App;

})();
