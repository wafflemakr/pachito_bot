const Telegraf = require("telegraf");
const Extra = require("telegraf/extra");
const Markup = require("telegraf/markup");
const express = require("express");
const app = express();
const cors = require("cors");
const { cmc, coinbase, local } = require("./axios");

require("dotenv").config();

app.use(
  cors({
    credentials: true,
    origin: true,
  })
);
app.options("*", cors());

app.get("/", (req, res) => res.send("Working!!!"));

app.listen(process.env.PORT || 3000, function () {
  console.log("server running on port 3000", "");
});

const MENU = `Selecciona un comando:
\n/tasas - Tasas de Cambio Actuales
`;

// FUNCTIONS
function getFormattedDate(date) {
  let year = date.getFullYear();
  let month = (1 + date.getMonth()).toString().padStart(2, "0");
  let day = date.getDate().toString().padStart(2, "0");

  const formatNumber = (num) => {
    if (num >= 10) return num;
    else return `0${num}`;
  };
  // const seconds =
  //   date.getUTCSeconds() >= 10
  //     ? date.getUTCSeconds()
  //     : `0${date.getUTCSeconds()}`;

  return `${month}/${day}/${year} ${formatNumber(
    date.getUTCHours()
  )}:${formatNumber(date.getUTCMinutes())}:${formatNumber(
    date.getUTCSeconds()
  )} GMT`;
}

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(({ reply, from }) => reply(`Welcome ${from.username}!\n${MENU}`));

bot.command("tasas", async (ctx) => {
  const res = await coinbase.get("/exchange-rates");

  const res2 = await coinbase.get("/exchange-rates?currency=BTC");

  const res3 = await local.get(
    "https://localbitcoins.com/sell-bitcoins-online/CO/colombia/transfers-with-specific-bank/.json"
  );

  const trm = res.data.data.rates.COP;
  const btc = res2.data.data.rates.USD;
  const oficial = +trm * +btc;
  const tasaVenta = Number(res3.data.data.ad_list[0].data.temp_price);
  const tasaVenta_porc = Number((1 - tasaVenta / oficial) * 100).toFixed(2);

  ctx.reply(`TRM Dolar: ${formatter.format(Number(trm))}
    \nPrecio Bitcoin: ${formatter.format(Number(btc).toFixed(2))} USD
    \nTasa Oficial BTC: ${formatter.format(Number(oficial).toFixed(2))}
    \nVenta LocalBTC: ${formatter.format(
      Number(tasaVenta)
    )} (-${tasaVenta_porc}%)`);
});

bot.command("help", async ({ reply }) => {
  reply(MENU);
});

bot.hears(["mk", , "marica", "gonorrea", "chimba"], ({ reply }) => {
  reply(`Hola ${from.username}. Por favor no digas groserías. Gracias`);
});

bot.on("text", ({ reply, from }) => {
  reply(`Hola ${from.username}. Escribe /help para información del bot`);
});

bot.launch();
