"use strict"

const world = SVG("worldmap")
const page = onoff(document.querySelector(".map-area"))
const zoomInButton = onoff(document.querySelector(".info-box__button_in"))
const zoomOutButton = onoff(document.querySelector(".info-box__button_out"))
const originaleViewbox = world.viewbox()

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
const zoomIn = zoomHandler(.7)
const zoomOut = zoomHandler(1.3)
zoomInButton.on("click", zoomIn)
zoomOutButton.on("click", zoomOut)

function zoomHandler(level) {
	return event => {
		console.log(event.pageX)
		zoom(world, level).execute()
	}
}

function zoom(world, level) {
	const viewbox = world.viewbox(),
				width = viewbox.width * level,
				height = viewbox.height * level

	const x = viewbox.x - (width - viewbox.width) / 2
	const y = viewbox.y - (height - viewbox.height) / 2
/*
	const x = viewbox.x * level
	const y = viewbox.y * level*/

	const newViewbox = { x, y, width, height }
	console.log(newViewbox)
	console.log("zoom factor:", originaleViewbox.width / newViewbox.width)
	let	delta = world.data("delta") || { x:0, y:0 }
	delta.x = delta.x * originaleViewbox.width / newViewbox.width
	delta.y = delta.y * originaleViewbox.height / newViewbox.height
	world.data("delta", delta)
	console.log(delta)

	return {
		execute: () => {
	//		world.data("newViewbox", newViewbox)
			world.animate(250, "<>").viewbox( x, y, width, height )
		}
	}
}

function removeZoomHandler() {
	zoomInButton.off("click", zoomIn)
	zoomOutButton.off("click", zoomOut)
}

page.on("mousedown", panHandler)

function panHandler(event) {
	let	delta = world.data("delta") || { x:0, y:0 }

	const startX = event.pageX - delta.x,
				startY = event.pageY - delta.y

	console.log(event.pageX, delta.x, startX)

	page.on("mousemove", doPan)
	page.on("mouseup", removePan)

	world.addClass("dragging")

	function doPan(event) {
		const view = world.viewbox()
		

		delta = {
			x: event.pageX - startX,
			y: event.pageY - startY
		}
	console.log(event.pageX, delta.x, startX)
		

		pan(world, delta.x, delta.y).execute()
	}

	function removePan() {
		world.data("delta", delta)

		page.off("mousemove", doPan)
		page.off("mouseup", removePan)

		world.removeClass("dragging")
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
