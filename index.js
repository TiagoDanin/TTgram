var Twitter = require('twitter')
var TelegramBot = require('node-telegram-bot-api')
var CronJob = require('cron').CronJob
var dateTime = require('node-datetime')

var client = new Twitter({
	consumer_key: process.env.consumer_key,
	consumer_secret: process.env.consumer_secret,
	access_token_key: process.env.access_token_key,
	access_token_secret: process.env.access_token_secret
});

var token = process.env.telegram_token
var bot = new TelegramBot(token, {polling: true})

bot.onText(/\/ping/, (msg) => {
	var chat_id = msg.chat.id
	bot.sendMessage(chat_id, 'Pong!')
})

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
	console.log(id)
	client.post('favorites/destroy', {id: id}, function(error, data, response) {
		if (!error) {
			return data
		} else {
			return false
		}
	})
}

var blackList = []
var NewList = []
var ntwitters = 0
async function get() {
	console.log('Get new twitters - ', (dateTime.create()).format('H:M'), '\nStarts:', ntwitters, 'twitters processed')
	NewList = []
	client.get('statuses/home_timeline', {}, function(error, tweets, response) {
		if (!error) {
			var a = true
			tweets.forEach(post => {
				if (ntwitters == 321312) {
					console.log(tweets)
				}
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
				var retweet_cstatus = 'retweet'
				if (post.retweeted) {
					retweet_cstatus = 'unretweet'
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
					bot.sendMessage(process.env.chat_id, output, {
						parse_mode: "HTML",
						reply_markup: {
							inline_keyboard: [[
								{text: favorites_status, callback_data: `${favorites_cstatus}:${id}`},
								{text: retweet_status, callback_data: `${retweet_cstatus}:${id}`},
								{text: '💬', callback_data: 'comment'}
							]]
						}
					})
				}
				NewList.push(id)
			})
			blackList = NewList
		}
	})
}

bot.on('callback_query', (result) => {
	var id = result.id
	var data = result.data
	if (data.startsWith('love')) {
		like(data.replace('love:', ''))
		bot.answerCallbackQuery(id, {
			text: 'Vavorited'
		})
	}
})

get()
new CronJob('10 * * * * *', function() {//'20 1 * * * *', function() {
	get()
}, null, true, 'America/Los_Angeles')