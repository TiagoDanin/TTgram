# TTgram

[![NPM](https://nodei.co/npm/ttgram.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/ttgram/)

Integration with Twitter <-> Telegram

## Installation

1. Clone repo :)

2. Get twitter token in https://apps.twitter.com/app

3. Get Telegram token in https://t.me/BotFather

4. Set environment variables
```
telegram_token = 'ABCD:0123456789'
admin_id = '0123456789'
cron_job = '50 * * * * *'
DEBUG = 'TTgram:bot, TTgram:error'
```

5. Install dependencies
```bash
$ yarn install
```

6. Run the TTgram
```bash
$ npm start
```

7. Send `/add`

8. Set tokens

9. Done :)

## Dependencies

- [cron](https://ghub.io/cron): Cron jobs for your node
- [debug](https://ghub.io/debug): small debugging utility
- [env-cmd](https://ghub.io/env-cmd): Executes a command using the envs in the provided env file
- [graceful-fs](https://ghub.io/graceful-fs): A drop-in replacement for fs, making various improvements.
- [jsonfile](https://ghub.io/jsonfile): Easily read/write JSON files.
- [telegraf](https://ghub.io/telegraf): 📡 Modern Telegram bot framework
- [twitter](https://ghub.io/twitter): Twitter API client library for node.js

## License

MIT
