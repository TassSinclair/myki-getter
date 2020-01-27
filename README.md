# Myki Getter

Gets Myki money from My Myki portal.

## Scraping
Logs in to the My Myki portal for a user and gets card information (card number, card holder, myki money) for each card in-use. Saves it to a database. Sleeps for 10 minutes, and then tries again.

## Serving

Runs a webserver at port `8764` with the following endpoints:

- `/balances`: returns all accounts
- `/balances/card/000000000000000`: returns a specific card matching that card number

# Configuration

Set up `data/config.js` to return an object that looks something like this:

```js
const config = {
  username: '...',
  password: '...',
};

module.exports = config;
```

It's up to you how to do that. It will work with plain-text credentials, but you should find a way to manage the secrets securely.
