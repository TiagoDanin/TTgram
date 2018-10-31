var blackList = []
var n = 0

const getTwitter = (ctx) => {
	//TODO GET TWITTER
}

const getNewTwitters = async (ctx) => {
	log(`Get new twitters: ${new Date()}`)
	await client.get('statuses/home_timeline', {}, async (error, tweets, response) => {
		if (error) {
			logError(error)
		} else {
			tweets.forEach(post => {
				if (!blackList.includes(id)) {
					n++
					//TODO await getTwitter(ctx)
				}
				blackList.push(id)
			})
		}
	})

	log(`Twitters processed: ${n}`)
}
