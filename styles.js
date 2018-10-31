var text = post.text
var user = post.user.screen_name || post.user.name
var id = post.id_str

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

bot.telegram.sendMessage(process.env.chat_id, output, {
	parse_mode: "HTML",
	disable_web_page_preview: false,
	reply_markup: {
		inline_keyboard: [[
			{text: favorites_status, callback_data: `${favorites_cstatus}:${id}`},
			{text: retweet_status, callback_data: `${retweet_cstatus}:${id}`},
			{text: '💬', url: `https://twitter.com/${user}/status/${id}`}
		]]
	}
})
