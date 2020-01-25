# Statement Getter

Gets 'current balance' and 'balance available' from various netbanking sites.

Currently works for St. George and ING.

## Scraping
Logs in to the netbanking accounts for the banks, and gets account information (name, BSB, account number, current balance and balance available) for each account. Saves it to a database.

## Serving

Runs a webserver at port `8764` with the following endpoints:

- `/accounts`: returns all accounts
- `/accounts/bsb/000000/number/0000000000`: returns a specific account matching that BSB and number

# Configuration

Set up `data/config.js` to return an object that looks something like this:

```js
const config = {
  stGeorge: {
    accessNumber: '...',
    securityNumber: '...',
    password: '...',
  },
  ing: {
    clientNumber: '...',
    pin: '...',
  }
};

module.exports = config;
```

