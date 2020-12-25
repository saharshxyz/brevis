const fetch = require('node-fetch');
const { Telegraf } = require('telegraf');
require('dotenv').config();

const { API_KEY, DOMAIN, BOT_TOKEN, USERNAME } = process.env;

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

const bot = new Telegraf(BOT_TOKEN);
bot.start((ctx) =>
  ctx.reply(
    'Welcome! I am ready to shorten links using Kutt. Send me your links to shorten them.'
  )
);
bot.help((ctx) => ctx.reply('Send me a link'));
bot.on('message', async (ctx) => {
  console.log(ctx.message);

  if (
    ctx.message.from.username !== USERNAME ||
    ctx.message.from.is_Bot === true
  ) {
    ctx.reply('Not an authorized user');
    return;
  }

  if (typeof ctx.message.text === 'undefined') {
    ctx.reply('Please send a link');
  }

  ctx.reply(await shorten(ctx.message.text));
});
bot.launch();
