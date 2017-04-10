"use strict"

function pubSub(element) {
	const listeners = []

	return {
		on: (type, f) => {
			listeners.push([type, f])
			return element
		},
		off: (type, f) => {
			listeners = listeners.filter(l => l[0] !== type && l[1] !== f)
			return element
		},
		fire: (type, ...args) => {
			listeners.forEach(l => {
				l[0] === type && l[1].apply(null, args)
			})
			return element
		}
	}
}
