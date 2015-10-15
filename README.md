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

* Make mail text
* make sendgrid template
* Make email string per person
* Send each email
* Heroku scheduler and remote usage

Wishlist
--

* Send SMS with twilio
* autoconfigure sendgrid template?
* Config file for spreadsheet parameters and columns
* Automated Travis testing