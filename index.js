const Twitter = require('twitter')
const Telegraf = require('telegraf')
const debug = require('debug')
const CronJob = require('cron').CronJob
const jsonfile = require('jsonfile')

const log = debug('TTgram:bot')
const logError = debug('TTgram:error')

const actions = require('./lib/actions')
const twitter = require('./lib/twitter')

const bot = new Telegraf(process.env.telegram_token)

var config = jsonfile.readFileSync('config.json')

var users = {}
const loadUsers = () => {
    users = {}
    config.map((user) => {
        users[user.id] = {
            log: log,
            logError: logError,
            bot: bot,
            chat_id: user.id,
            styles: user.styles,
            client: new Twitter({
                consumer_key: user.consumerKey,
                consumer_secret: user.consumerSecret,
                access_token_key: user.accessTokenKey,
                access_token_secret: user.accessTokenSecret
            })
        }
    })
}
loadUsers()

bot.use((ctx, next) => {
    var id = 0000000
    if (ctx.update) {
        if (ctx.update.message && ctx.update.message.from) {
            id = ctx.update.message.from.id
        } else if (ctx.update.callback_query && ctx.update.callback_query.from) {
            id = ctx.update.callback_query.from.id
        }
    }
    if (!users[id]) {
        if (id.toString() == process.env.admin_id.toString()) {
            return next(ctx)
        }
        return ctx.replyWithMarkdown(`
📕 Sorry, you do not have access to this bot.
🔖 TTGram is Open Source: [github.com/TiagoDanin/TTgram](https://github.com/TiagoDanin/TTgram)
		`)
    }
    ctx.log = users[id].log
    ctx.logError = users[id].logError
    ctx.bot = users[id].bot
    ctx.styles = users[id].styles
    ctx.client = users[id].client
    ctx.chat_id = users[id].chat_id
    return next(ctx)
})

bot.telegram.sendMessage(process.env.admin_id, '*TTgram starting...*', {
    parse_mode: 'Markdown'
})
log('TTgram starting...')

bot.command('ping', (ctx) => {
    return ctx.replyWithMarkdown('*Pong*!')
})

bot.command('help', (ctx) => {
    return ctx.replyWithMarkdown(`
*Help*!
/new twitter [text] - Create an new twitter
/search [text] - Search tweets
/about - About bot

*Admin*!
/add - Add new user
/rem [telegram id] - Remove user
	`)
})

bot.command(['start', 'about'], (ctx) => {
    return ctx.replyWithMarkdown(`
*TTgram*
👤 Developer: Tiago Danin (@TiagoEDGE)
🔖 TTGram is Open Source: [github.com/TiagoDanin/TTgram](https://github.com/TiagoDanin/TTgram)

📕 /help
`)
})

bot.command('add', (ctx) => {
    if (ctx.message.from.id.toString() == process.env.admin_id.toString()) {
        return ctx.replyWithMarkdown(`
*Reply this message!*
Add new user
---------------------------
Following the format: \`\`\`
Telegram user id
twitter consumer key
twitter consumer secret
twitter access token key
twitter access token secret
\`\`\`
---------------------------
Example: \`\`\`
123456789
absdajshd43288dsau
Djhf789HD98s9a8_fds7f8d7fs
hfdu8&HD_DHUDHUJIi6786sah
dsjahdja432343JHD7das_dffsdf_Dsda7
\`\`\`
		`)
    }
    return ctx.replyWithMarkdown('*You are not admin of bot*!')
})

bot.hears(/^\/rem\s(.*)/i, (ctx) => {
    if (ctx.message.from.id.toString() == process.env.admin_id.toString()) {
        config = config.reduce((total, user) => {
            if (user.id != ctx.match[1]) {
                total.push(user)
            }
            return total
        }, [])

        loadUsers()
        jsonfile.writeFileSync('config.json', config, { replacer: true })
        return ctx.replyWithMarkdown('*User removed*!')
    }
    return ctx.replyWithMarkdown('*You are not admin of bot*!')
})

bot.hears(/^\/[new_\s]*twitter[s]* (.*)/i, async(ctx) => {
    var post = await actions.create(ctx)
    if (post.error) {
        var error = post.error
        return ctx.replyWithHTML(`*ERROR*!\n*Code*: ${error[0].code}\n*Message*: ${error[0].message}`)
    }
    return twitter.sendTwitter(ctx, post)
})

bot.hears(/^\/get[s]*|\/[new_\s]*twitter[s]*$/i, (ctx) => {
    return twitter.getTimeLine(ctx)
})

bot.hears(/^\/search\s(.*)/i, (ctx) => {
    return twitter.getSearch(ctx)
})

bot.on('message', (ctx) => {
    if (ctx.message.reply_to_message && ctx.message.reply_to_message.text) {
        var replyMsg = ctx.message.reply_to_message.text
        if (replyMsg.match('Reply this message!') && ctx.message.from.id.toString() == process.env.admin_id.toString()) {
            var params = (ctx.message.text || '').split('\n')
            if (params.length != 5) {
                return ctx.replyWithMarkdown('*Invalid user...*, use /add again.')
            }
            config.push({
                id: params[0],
                consumerKey: params[1],
                consumerSecret: params[2],
                accessTokenKey: params[3],
                accessTokenSecret: params[4],
                styles: {
                    user: 'tg',
                    text: 'default',
                    url: 'default',
                    keyboard: 'count',
                    noPreviewLink: true
                }
            })

            loadUsers()
            jsonfile.writeFileSync('config.json', config, { replacer: true })
            return ctx.replyWithMarkdown('*User added*')
        }
    }
})

bot.on('callback_query', (ctx) => {
    var data = ctx.callbackQuery.data.split(':')
    ctx.id = data[1]
    if (data[0] == 'love') {
        actions.like(ctx)
        ctx.answerCbQuery('Favorited ❤')
    } else if (data[0] == 'unlove') {
        actions.unlike(ctx)
        ctx.answerCbQuery('Unfavored 💔')
    } else if (data[0] == 'rt') {
        actions.rt(ctx)
        ctx.answerCbQuery('Retweeted 🔄')
    } else if (data[0] == 'unrt') {
        actions.unrt(ctx)
        ctx.answerCbQuery('Undone ❌')
    }
    return twitter.getTwitter(ctx)
})

bot.catch((err) => {
    logError(`Oooops ${err}`)
})

bot.startPolling()

new CronJob(process.env.cron_job, function() {
    for (var id in users) {
        twitter.getTimeLine(users[id])
    }
}, null, true, 'America/Los_Angeles')