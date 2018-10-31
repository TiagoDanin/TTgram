const processAction = (error, data, response) => {
	if(!error) {
		return twitter, ''
	} else {
		return false, `*ERROR*!\n*Code*: ${error[0].code}\n*Message*: ${error[0].message}`
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
	ctx.client.post(`statuses/retweet/${id}`, {id: ctx.id}, (error, data, response) => {
		return processAction(error, data, response)
	})
}

const unrt = (ctx) => {
	ctx.client.post(`statuses/unretweet/${id}`, {id: ctx.id}, (error, data, response) => {
		return processAction(error, data, response)
	})
}

const create = (ctx) => {
	client.post('statuses/update', {status: ctx.match[1]}, (error, data, response) => {
		return processAction(error, data, response)
	})
}
