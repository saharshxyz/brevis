const fetch = require('node-fetch');
const { Telegraf } = require('telegraf');
require('dotenv').config();

const { API_KEY, DOMAIN, BOT_TOKEN } = process.env;

// eslint-disable-next-line consistent-return
const shorten = async (target) => {
  try {
    const response = await fetch('https://kutt.it/api/v2/links', {
      method: 'POST',
      body: JSON.stringify({
        target: target.toString(),
        reuse: true,
        domain: DOMAIN,
      }),
      headers: {
        'content-type': 'application/json',
        'X-API-KEY': API_KEY,
      },
    });
    return (await response.json()).link.toString().replace(/http:/, 'https:');
  } catch (error) {
    console.error(error);
  }
};

const run = async (longlink) => {
  return shorten(longlink);
};

const bot = new Telegraf(BOT_TOKEN);
bot.start((ctx) =>
  ctx.reply(
    'Welcome! I am ready to shorten links using Kutt. Send me your links to shorten them.'
  )
);
bot.help((ctx) => ctx.reply('Send me a link'));
bot.on('sticker', (ctx) => ctx.reply('Please send me a link'));
bot.on('text', async (ctx) => {
  ctx.reply(await run(ctx.message.text));
});
bot.launch();
