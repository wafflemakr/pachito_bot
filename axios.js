const axios = require("axios");

const cmc = axios.create({
  baseURL:
    "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
  headers: {
    "X-CMC_PRO_API_KEY": process.env.CMC_API,
    Accept: "application/json",
  },
});

const coinbase = axios.create({
  baseURL: "https://api.coinbase.com/v2",
});

const gecko = axios.create({
  baseURL:
    "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
  headers: {
    "X-CMC_PRO_API_KEY": process.env.CMC_API,
    Accept: "application/json",
  },
});

const local = axios.create({
  baseURL: "https://localbitcoins.com",
});

const CGK_URL = "https://api.coingecko.com/api/v3/";

module.exports = { cmc, coinbase, gecko, local };
