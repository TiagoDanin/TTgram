# TTgram
Integration with Twitter <-> Telegram

# Setup
1. Get twitter token in https://apps.twitter.com/app

2. Get Telegram token in https://t.me/BotFather

3. Set envelope variables

```
telegram_token = 'ABCD:0123456789'
chat_id = '0123456789'
consumer_key = 'ABCD0123456789'
consumer_secret = 'ABCD0123456789'
access_token_key = '123456789-ABCD0123456789'
access_token_secret = 'ABCD0123456789'
cron_format = '60 * * * * *'
```

4. Install dependencies

```bash
$ npm install
```

5. Run the TTgram

```bash
$ node index.js
```