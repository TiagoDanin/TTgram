const Twitter = require('twitter')
const Telegraf = require('telegraf')
const debug = require('debug')
const CronJob = require('cron').CronJob

const log = debug('TTgram:bot')
const logError = debug('TTgram:error')

const actions = require('./lib/actions')
const twitter = require('./lib/twitter')

const bot = new Telegraf(process.env.telegram_token)

const users = {
	1234567890: {
		client: new Twitter({
			consumer_key: process.env.consumer_key,
			consumer_secret: process.env.consumer_secret,
			access_token_key: process.env.access_token_key,
			access_token_secret: process.env.access_token_secret
		})
	},
	1114567890: {
		client: new Twitter({
			consumer_key: process.env.consumer_key,
			consumer_secret: process.env.consumer_secret,
			access_token_key: process.env.access_token_key,
			access_token_secret: process.env.access_token_secret
		})
	}
}

bot.telegram.sendMessage(process.env.chat_id, '*TTgram starting...*', {
	parse_mode: 'Markdown'
})
log('TTgram starting...')

bot.command('ping', (ctx) => {
	ctx.replyWithMarkdown('*Pong*!')
})

bot.hears(/\/[new_\s]*twitter[s]* (.*)/i, async (ctx) => {
	await actions.create(ctx)
	//TODO ERROR `*ERROR*!\n*Code*: ${error[0].code}\n*Message*: ${error[0].message}`
})

bot.hears(/\/get[s]*|\/[new_\s]*twitter[s]*$/i, (ctx) => {
	twitter.getTimeLine(ctx)
})


bot.on('callback_query', (ctx) => {
	log(ctx.callbackQuery.entities)
	var data = ctx.callbackQuery.data
	if (data.startsWith('love')) {
		actions.like(ctx)
		ctx.answerCbQuery('Favorited ❤')
	} else if (data.startsWith('unlove')) {
		actions.unlike(ctx)
		ctx.answerCbQuery('Unfavored 💔')
	} else if (data.startsWith('rt')) {
		actions.rt(ctx)
		ctx.answerCbQuery('Retweeted 🔄')
	} else if (data.startsWith('unrt')) {
		actions.unrt(ctx)
		ctx.answerCbQuery('Undone ❌')
	}
	//TODO GET TWIITER
	//TODO EDIT MSG
})

bot.catch((err) => {
	logError(`Oooops ${err}`)
})

bot.startPolling()

new CronJob(process.env.cron_format, function() {
	//TODO FOR CTX OF USERS
	twitter.getTimeLine(ctx)
}, null, true, 'America/Los_Angeles')
