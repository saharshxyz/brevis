# brevis [![Run on Repl.it](https://repl.it/badge/github/saharshxyz/brevis)](https://repl.it/github/saharshxyz/brevis)

Telegram Bot to shorten urls with Kutt.it This is very feature-light and breaks easily, but it does the trick. 

Setup is super simple:
1. Create a [kutt.it](https://kutt.it) account and set it up with the domain you want to shorten to
2. Host this somewhere. I am running it on [repl.it](https://repl.it)
3. Set the following environment variables:
    1. `API_KEY` is your Kutt API Key
    2. `DOMAIN` is the domain to shorten to
    3. `BOT_TOKEN` is the token for the Telegram bot
    4. `USERNAME` is the Telegram username authorized to shorten links. 
    5. `LOGGING_CHAT_ID` is the channel ID for logging messages to be sent to. Note: Before adding bot to logging channel, it's suggested that you go to BotFather, enable groups for the bot and disable group privacy mode. Then, after adding the bot to the logging channel and getting the channel id, disable groups and enable privacy mode.
