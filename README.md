# brevis [![Run on Repl.it](https://repl.it/badge/github/saharshxyz/brevis)](https://repl.it/github/saharshxyz/brevis)

Telegram Bot to shorten urls with Kutt.it This is very feature-light and breaks easily, but it does the trick. 

Setup is super simple:
1. Create a [kutt.it](https://kutt.it) account and set it up with the domain you want to shorten to
2. Host this somewhere. I am hosting this by running it on [repl.it](https://repl.it) and pinging it every few minutes through both [UpTime Robot](https://uptimerobot.com) and [UppTime](https://uptime.saharsh.xyz)
3. Set the following environment variables:
    1. `API_KEY` is your Kutt API Key
    2. `DOMAIN` is the domain to shorten to
    3. `BOT_TOKEN` is the token for the Telegram bot
    4. `USERNAME` is the Telegram username authorized to shorten links. 
