const Twitter = require('twitter')
const Telegraf = require('telegraf')
const debug = require('debug')
const CronJob = require('cron').CronJob
const dateTime = require('node-datetime')

const log = debug('TTgram:bot')
const logError = debug('TTgram:error')

const client = new Twitter({
	consumer_key: process.env.consumer_key,
	consumer_secret: process.env.consumer_secret,
	access_token_key: process.env.access_token_key,
	access_token_secret: process.env.access_token_secret
});

var token = process.env.telegram_token
const bot = new Telegraf(token, {
	telegram: {
		apiRoot: 'https://api.telegram.org'
	}
})

bot.telegram.sendMessage(process.env.chat_id, '*TTgran starting...*', {
	parse_mode: 'Markdown'
})
log('TTgran starting...')

function like(id) {
	client.post('favorites/create', {id: id}, function(error, data, response) {
		if (!error) {
			return data
		} else {
			return false
		}
	})
}

function unlike(id) {
	client.post('favorites/destroy', {id: id}, function(error, data, response) {
		if (!error) {
			return data
		} else {
			return false
		}
	})
}

function rt(id) {
	client.post(`statuses/retweet/${id}`, {id: id}, function(error, data, response) {
		if (!error) {
			return data
		} else {
			return false
		}
	})
}

function unrt(id) {
	client.post(`statuses/unretweet/${id}`, {id: id}, function(error, data, response) {
		if (!error) {
			return data
		} else {
			return false
		}
	})
}

function makeTwitter(text) {
	client.post('statuses/update', {status: text},  function(error, tweet, response) {
		if(!error) {
			var user = twitter.user.screen_name || twitter.user.name
			var id = twitter.id_str
			var output = `
<b>You said</b>: ${text}
<b>URL</b>: <a href="https://twitter.com/${user}/status/${id}">Souce</a>
`
			bot.telegram.sendMessage(process.env.chat_id, output, {
				parse_mode: "HTML",
				disable_web_page_preview: true,
			})
			return tweet
		} else {
			logError(error)
			bot.telegram.sendMessage(
				process.env.chat_id,
				`*ERROR*!\n*Code*: ${error.code}\n*Message*: ${error.message}`, {
					parse_mode: "Markdown"
				}
			)
			return false
		}
	})
}

var blackList = []
var NewList = []
var ntwitters = 0
async function get() {
	log('Get new twitters - ', (dateTime.create()).format('H:M'))
	log('Starts:', ntwitters, 'twitters processed')
	NewList = []
	client.get('statuses/home_timeline', {}, function(error, tweets, response) {
		log(error)
		if (!error) {
			var a = true
			tweets.forEach(post => {
				var text = post.text
				var user = post.user.screen_name || post.user.name
				var id = post.id_str

				//status
				var favorites_status = '❤'
				var favorites_cstatus = 'love'
				if (post.favorited) {
					favorites_status = '💔'
					favorites_cstatus = 'unlove'
				}
				favorites_status += ` ${post.favorite_count}`
				var retweet_status = '🔄'
				var retweet_cstatus = 'rt'
				if (post.retweeted) {
					retweet_cstatus = 'unrt'
					retweet_status = '❌'
				}
				retweet_status += ` ${post.retweet_count}`

				var output = `
<b>User</b>: @${user}
<b>Text</b>: ${text}
<b>URL</b>: <a href="https://twitter.com/${user}/status/${id}">Souce</a>
`
				if (!blackList.includes(id)) {
					ntwitters++
					bot.telegram.sendMessage(process.env.chat_id, output, {
						parse_mode: "HTML",
						disable_web_page_preview: true,
						reply_markup: {
							inline_keyboard: [[
								{text: favorites_status, callback_data: `${favorites_cstatus}:${id}`},
								{text: retweet_status, callback_data: `${retweet_cstatus}:${id}`},
								{text: '💬', url: `https://twitter.com/${user}/status/${id}`}
							]]
						}
					})
				}
				NewList.push(id)
			})
			blackList = NewList
			log('Sent new Twitters')
		}
	})
}

bot.on('callback_query', (ctx) => {
	log(ctx.callbackQuery.entities)
	var data = ctx.callbackQuery.data
	if (data.startsWith('love')) {
		like(data.replace('love:', ''))
		ctx.answerCbQuery('Favorited ❤')
	} else if (data.startsWith('unlove')) {
		unlike(data.replace('unlove:', ''))
		ctx.answerCbQuery('Unfavored 💔')
	} else if (data.startsWith('rt')) {
		rt(data.replace('rt:', ''))
		ctx.answerCbQuery('Retweeted 🔄')
	} else if (data.startsWith('unrt')) {
		unrt(data.replace('unrt', ''))
		ctx.answerCbQuery('Undone ❌')
	}
})

bot.command('ping', (ctx) => {
	ctx.replyWithMarkdown('*Pong*!')
})

bot.hears(/\/get[s]*|\/[new_\s]*twitter[s]*$/i, (ctx) => {
	get()
})

bot.hears(/\/[new_\s]*twitter[s]* (.*)/i, (ctx) => {
	makeTwitter(ctx.match[1])
})

bot.catch((err) => {
	logError(`Oooops ${err}`)
})


bot.startPolling()

get()
new CronJob(process.env.cron_format, function() {
	get()
}, null, true, 'America/Los_Angeles')
