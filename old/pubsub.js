"use strict"

function pubSub(publisher) {
	const listeners = []

	return {
		on: (type, f) => {
			listeners.push([type, f])
			return publisher
		},
		off: (type, f) => {
			listeners = listeners.filter(l => l[0] !== type && l[1] !== f)
			return publisher
		},
		fire: (type, ...args) => {
			listeners.forEach(l => {
				l[0] === type && l[1].apply(null, args)
			})
			return publisher
		}
	}
}
