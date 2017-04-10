"use strict"

const world = SVG("worldmap")
const page = onoff(document)
const zoomInButton = document.querySelector(".info-box__button_in")
const zoomOutButton = document.querySelector(".info-box__button_out")

function onoff(element) {
	return {
		on: (type, f) => {
			element.addEventListener(type, f)
			return element
		},
		off: (type, f) => {
			element.removeEventListener(type, f)
			return element
		}
	}
}

page.on("mousedown", panHandler)

function panHandler(event) {
	page.on("mousemove", doPan)
	page.on("mouseup", removePan)

	world.style("cursor", "move")		

	function doPan(event) {
		const view = world.viewbox()
		console.log("event", event.pageX, event.pageY)
		console.log("calc", event.pageX - view.width, event.pageY - view.height)
		//console.log(world.viewbox())
		pan(world, event.pageX - view.width, event.pageY - view.height).execute()
	}

	function removePan() {
		page.off("mousemove", doPan)
		page.off("mouseup", removePan)
		world.style("cursor", "auto")
	}
}

function removePanHandler() {
	world.off("mousedown", panHandler)
}

function pan(world, x, y) {
	return {
		execute: () => {
			const viewbox = world.viewbox()
			world.viewbox( -x, -y, viewbox.width, viewbox.height )
		}
	}
}

/*const commands = new Map(
	commandFactory(
		// pan - made for mousedown
		{
			predicate: (world, event) => {
				world.on("mousemove")


			}
		}
	)
)

function commandFactory(...commands) {
	return commands.map(c => {
		return [
			// predicate A.K.A. accept, used as Map key
			(world, e) => c.predicate(world, e),
			// command object, used as Map value
			{
				execute: c.command,
				type: "",
				keyCode: c.keyCode,
				ctrlKey: c.ctrlKey,
				description: c.description
			}
		]
	})
}*/

/*
world.on("mousedown", mousedownHandler(world))

function mousedownHandler(world) {

	world.on("mousemove", mousemoveHandler)

	function mousemoveHandler(world) {
		setTimeout(() => {
			world.off("mousemove", mousemoveHandler)
			world.off("mousedown", mousedownHandler)
		}, 250)
	}

	const pan = paning(world)

	return event => {

		pan({
			x: event.pageX,
			y: event.pageY
		})
	}
}


function paning(world) {
	const view = world.viewbox()

	return coord => {

		//console.log(event.x, event.y)
		//console.log(event.pageX, event.pageY)
		console.log(coord.x, coord.y)

	}
}*/

/*setupScroll()

function setupScroll() {
	let last_known_scroll_position = 0
	let ticking = false

	window.addEventListener('scroll', function(e) {
		last_known_scroll_position = window.scrollY
		if (!ticking) {
			window.requestAnimationFrame(function() {
				doSomething(last_known_scroll_position)
				ticking = false
			})
		}
		ticking = true
	})
}

function doSomething(position) {
  console.log("position: ", position)
	console.log(world.viewbox().zoom)
	console.log("viewBox", world.viewbox())
	world.viewbox()
}*/
