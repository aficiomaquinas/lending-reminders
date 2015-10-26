Prerequisites
--

* Heroku toolbelt
* Sendgrid free account

Installation
--

```bash
cd inventario-de-prestamos
npm install
npm install -g grunt-cli
grunt
```

Then create .env file from .env-sample

Development
--

```bash
grunt watch
```

Local usage
--

```bash
grunt local
```

Todo
--

* Use native sheets url instead of blockspring
* Handlebars?
* make sendgrid template?
* Send each email
* Heroku scheduler and remote usage

Wishlist
--

* Send SMS with twilio
* autoconfigure sendgrid template?
* Config file for spreadsheet parameters and columns
* Automated Travis testing
* Articles with "To" type