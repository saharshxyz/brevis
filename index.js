const { Telegraf } = require('telegraf');
const fetch = require('node-fetch');

require('dotenv').config();

const { API_KEY, DOMAIN, BOT_TOKEN, USERNAME, LOGGING_CHAT_ID } = process.env;

// ----------
// Shorten URL
// ----------

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

// ----------
// Telegram Bot
// ----------

const log = (log) => {
	// Logs to console and logging channel
	console.log(log);
	fetch(
		`https://api.telegram.org/bot1385381418:AAFj3F3O7BBe58qRgXJG7blLK26wPvct7QI/sendMessage?chat_id=-1001286844739&text=${JSON.stringify(
			log
		)}`
	);
};

const bot = new Telegraf(BOT_TOKEN);
bot.start((ctx) =>
	ctx.reply(
		'Welcome! I am ready to shorten links using Kutt. Send me your links to shorten them.'
	)
);
log('🏁 Starting Bot');
bot.help((ctx) => ctx.reply('Send me a link'));
bot.on('message', async (ctx) => {
	log(ctx.message);

	// Check if it's an authorized user
	if (
		ctx.message.from.username !== USERNAME ||
		ctx.message.from.is_Bot === true
	) {
		ctx.reply('Not an authorized user', {
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
		ctx.reply('Please send a link', {
			reply_to_message_id: ctx.message.message_id,
		});
		log('❌ Invalid Link');
	} else {
		// Respond with shortened link
		const shortLink = await shorten(ctx.message.text);
		ctx.reply(shortLink, {
			reply_to_message_id: ctx.message.message_id,
		});
		log(`🟢 Shortened link: ${shortLink}`);
	}
});

bot.launch();
