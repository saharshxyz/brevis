const { Telegraf, Telegram, Scenes, Stage, session } = require('telegraf')
const rateLimit = require('telegraf-ratelimit');
const fetch = require('node-fetch');
require('dotenv').config();

const { API_KEY, DOMAIN, BOT_TOKEN, USERNAME, LOGGING_CHAT_ID } = process.env;


// Configs for rate limiting
const limitConfig = {
  window: 1000,
  limit: 3,
  onLimitExceeded: (ctx, next) => ctx.reply('Rate limit exceeded'),
};

const bot = new Telegraf(BOT_TOKEN); // Start telegraf bot
bot.use(rateLimit(limitConfig)); // Set ratelimitting configs for bot
bot.start((ctx) =>
  ctx.reply(
    'Welcome! I am ready to shorten links using Kutt. Send me your links to shorten them.'
  )
);
bot.help((ctx) => ctx.reply('Send me a link'));

const telegram = new Telegram(BOT_TOKEN); // Start telegram bot with telegraf wrapper

const log = (log) => {
  // Logs to console and logging channel
  console.log(log);
  telegram.sendMessage(LOGGING_CHAT_ID, log);
};

// ----------
// Shorten URL
// ----------

const shorten = async (target, reuse = false, customurl = '') => {
  try {
    const response = await fetch('https://kutt.it/api/v2/links', {
      method: 'POST',
      body: JSON.stringify({
        target: target.toString(),
        reuse,
        customurl,
        domain: DOMAIN,
      }),
      headers: {
        'content-type': 'application/json',
        'X-API-KEY': API_KEY,
      },
    });
    return (await response.json()).link.toString().replace(/http:/, 'https:'); // Kutt will return with http://, replate that with https:// for security
  } catch (error) {
    console.error(error);
  }
};

const customUrlWizard = new Scenes.WizardScene(
  'CUSTOM_URL_WIZARD',
  (ctx) => {
    ctx.reply(`What's the target url?`, {
      disable_notification: true
    })
    return ctx.wizard.next()
  },
  (ctx) => {
    if (
    typeof ctx.message.text === 'undefined' ||
    typeof ctx.message.entities === 'undefined'
  ) {
    // Check to see if it's a text message with a link
    ctx.reply('❌ Please send a link', {
      reply_to_message_id: ctx.message.message_id,
    });
    log('❌ Invalid Link');
    return ctx.scene.leave()
  } else {
    ctx.wizard.state.target = `${ctx.message.text}`
    ctx.reply(`What's the custom slug?`, {
      disable_notification: true
    })
    return ctx.scene.next()
  }
  },
  async (ctx) => {
    ctx.wizard.state.slug = `${ctx.message.text}`
    // Respond with shortened link
    const shortLink = await shorten(ctx.wizard.state.target, false, ctx.wizard.state.slug);
    ctx.reply(shortLink, {
      reply_to_message_id: ctx.message.message_id,
    });
    log(`🟢 Shortened link: ${shortLink}`);
    return ctx.scene.next()
  }
)

// Setup for scenes
const stage = new Scenes.Stage([
  customUrlWizard
])
bot.use(session())
bot.use(stage.middleware())


bot.on('message', async (ctx) => {
  log(ctx.message);

  // Check if it's an authorized user
  if (
    ctx.message.from.username !== USERNAME ||
    ctx.message.from.is_Bot === true
  ) {
    ctx.reply('📛 Not an authorized user', {
      reply_to_message_id: ctx.message.message_id,
    });
    log('📛 Unauthorized User');
    return;
  }

  if (
    typeof ctx.message.text === 'undefined' ||
    typeof ctx.message.entities === 'undefined'
  ) {
    // Check to see if it's a text message with a link
    ctx.reply('❌ Please send a link', {
      reply_to_message_id: ctx.message.message_id,
    });
    log('❌ Invalid Link');
  } else {
    // Respond with shortened link
    const shortLink = await shorten(ctx.message.text, true);
    ctx.reply(shortLink, {
      reply_to_message_id: ctx.message.message_id,
    });
    log(`🟢 Shortened link: ${shortLink}`);
  }
});

bot.command('custom_url', async (ctx) => {
  log(ctx.message);

  // Check if it's an authorized user
  if (
    ctx.message.from.username !== USERNAME ||
    ctx.message.from.is_Bot === true
  ) {
    ctx.reply('📛 Not an authorized user', {
      reply_to_message_id: ctx.message.message_id,
    });
    log('📛 Unauthorized User');
    return;
  } else {
    ctx.scene.enter('CUSTOM_URL_WIZARD')
  }
})


log('🏁 Starting Bot');
bot.launch();
