const processAction = (error, data, response) => {
	if(!error) {
		return data
	} else {
		return {
			error: error
		}
	}
}

const like = (ctx) => {
	ctx.client.post('favorites/create', {id: ctx.id}, (error, data, response) => {
		return processAction(error, data, response)
	})
}

const unlike = (ctx) => {
	ctx.client.post('favorites/destroy', {id: ctx.id}, (error, data, response) => {
		return processAction(error, data, response)
	})
}

const rt = (ctx) => {
	ctx.client.post('statuses/retweet/', {id: ctx.id}, (error, data, response) => {
		return processAction(error, data, response)
	})
}

const unrt = (ctx) => {
	ctx.client.post('statuses/unretweet/', {id: ctx.id}, (error, data, response) => {
		return processAction(error, data, response)
	})
}

const create = (ctx) => {
	ctx.client.post('statuses/update', {status: ctx.match[1]}, (error, data, response) => {
		return processAction(error, data, response)
	})
}

module.exports = {
	like,
	unlike,
	rt,
	unrt,
	create
}
