# TTgram

[![NPM](https://nodei.co/npm/ttgram.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/ttgram/)

Integration with Twitter <-> Telegram

## Installation

1. Clone repo :)

2. Get twitter token in https://apps.twitter.com/app

3. Get Telegram token in https://t.me/BotFather

4. Set envelope variables
```
telegram_token = 'ABCD:0123456789'
chat_id = '0123456789'
consumer_key = 'ABCD0123456789'
consumer_secret = 'ABCD0123456789'
access_token_key = '123456789-ABCD0123456789'
access_token_secret = 'ABCD0123456789'
cron_format = '60 * * * * *'
DEBUG = 'TTgram:bot, TTgram:error'
```

5. Install dependencies
```bash
$ npm install
```

6. Run the TTgram
```bash
$ npm start
```

## Dependencies

- [env-cmd](https://ghub.io/env-cmd): Executes a command using the envs in the provided env file
- [cron](https://ghub.io/cron): Cron jobs for your node
- [debug](https://ghub.io/debug): small debugging utility
- [node-datetime](https://ghub.io/node-datetime): Extended Date object for javascript. 1. Handles offests by days and hours. 2. Built-in formatting function. 3. Time based value calculation.
- [telegraf](https://ghub.io/telegraf): 📡 Modern Telegram bot framework
- [twitter](https://ghub.io/twitter): Twitter API client library for node.js

## License

GPL-3.0
