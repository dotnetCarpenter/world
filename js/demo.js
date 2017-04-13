"use strict"

const world = SVG("worldmap")
const page = onoff(document.querySelector(".map-area"))
const zoomInButton = onoff(document.querySelector(".info-box__button_in"))
const zoomOutButton = onoff(document.querySelector(".info-box__button_out"))
const zoomFactorOutput = document.querySelector(".info-box__zoom-factor")
const originaleViewbox = world.viewbox()
const svgPoint = world.node.createSVGPoint()



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

Object.assign(zoom, pubSub(zoom))

zoom.on("zoom", zoomFactor => { zoomFactorOutput.textContent = zoomFactor.toFixed(3) })
zoom.on("zoom", (z1, z2) => { console.log("zoom", z1, z2) })


const zoomIn = zoomHandler(.7)
const zoomOut = zoomHandler(1.3)
zoomInButton.on("click", zoomIn)
zoomOutButton.on("click", zoomOut)

function zoomHandler(level) {
	return event => {
		zoom(world, level).execute()
	}
}

function zoom(world, level) {
	const viewbox = world.viewbox(),
				width = viewbox.width * level,
				height = viewbox.height * level
	const x = viewbox.x - (width - viewbox.width) / 2
	const y = viewbox.y - (height - viewbox.height) / 2
	const zoomFactor = originaleViewbox.width / width

	zoom.fire("zoom", zoomFactor, viewbox.zoom)

	return {
		execute: () => {
			world.animate(250, "<>").viewbox( x, y, width, height )
		}
	}
}

function removeZoomHandler() {
	zoomInButton.off("click", zoomIn)
	zoomOutButton.off("click", zoomOut)
}

page.on("mousedown", panHandler)
/*zoom.on("zoom", zoomFactor => {
	const delta = world.data("delta")
	console.debug(delta)
	world.data("delta", { x: delta.x * zoomFactor, y: delta.y * zoomFactor })
	console.debug(world.data("delta"))

	//world.data("delta", null)
	// const delta = world.data("delta")
	// if(!delta) return
	// const matrix = world.node.getScreenCTM()
	// svgPoint.x = delta.x
	// svgPoint.y = delta.y
	// console.log(svgPoint.matrixTransform(matrix.inverse()))
	//world.data("delta",  )
})*/
function panHandler(event) {
	//let delta = world.viewbox()//world.data("delta") || { x:0, y:0 }
	
	// create an SVGPoint with the matrixTransform method
	// let svgPoint = world.node.createSVGPoint()
	const matrix = world.node.getScreenCTM()

	svgPoint.x = event.clientX
	svgPoint.y = event.clientY

	const start = svgPoint.matrixTransform(matrix.inverse())
	// const start = world.point(event.clientX, event.clientY)
	
	//console.debug(start, world.viewbox())
	
	const delta = world.viewbox()
	start.x -= -delta.x
	start.y -= -delta.y

	//console.log(delta)

	//const circle = world.circle(10).move(start.x -5, start.y - 5)

	page.on("mousemove", doPan)
	page.on("mouseup", removePan)

	let lastFrame
	let first = true
	
	function doPan(event) {		
		world.addClass("dragging")
		
		// let svgPoint = world.node.createSVGPoint()
		// let matrix = world.node.getScreenCTM()
		//console.log(matrix)
		svgPoint.x = event.clientX
		svgPoint.y = event.clientY

		const mouse = svgPoint.matrixTransform(matrix.inverse())

		//const mouse = world.point(event.clientX, event.clientY)
		
		//circle.move(delta.x - 5, delta.y - 5)
		const delta = { x: mouse.x - start.x, y: mouse.y - start.y }

		// if(first) console.debug(delta), first = false

		//if(lastFrame) cancelAnimationFrame(lastFrame), lastFrame = null
		//lastFrame = requestAnimationFrame(() => { circle.move(delta.x - 5, delta.y - 5) })

		//console.log(delta)
		//world.circle(10).move(delta.x - 5, delta.y - 5)

		if(lastFrame) cancelAnimationFrame(lastFrame), lastFrame = null
		lastFrame = requestAnimationFrame(pan(world, delta).execute)

		//pan(world, delta).execute()
	}
	function removePan(event) {
		page.off("mousemove", doPan)
		page.off("mouseup", removePan)

		world.removeClass("dragging")

		//console.debug(delta)
		//circle.remove()
		//world.data("delta", delta)
	}
}

function pan(world, {x,y}) {
	return {
		execute: () => {
			const viewbox = world.viewbox()
			world.viewbox( -x, -y, viewbox.width, viewbox.height )
			//console.debug( viewbox )
		}
	}
}

/*
function transformPoint(matrix) {
	const svgPoint = world.node.createSVGPoint()

	return (x, y) => {
		svgPoint.x = x
		svgPoint.y = y

		const transformation = svgPoint.matrixTransform(matrix)
		return [transformation.x, transformation.y]
	}
}
*/
/*
function panHandler(event) {
	let	delta = world.data("delta") || { x:0, y:0 }


	const startX = (event.pageX - delta.x) * zoomFactor,
				startY = (event.pageY - delta.y) * zoomFactor

	world.circle(10).move(startX - 5, startY - 5)

	page.on("mousemove", doPan)
	page.on("mouseup", removePan)

	world.addClass("dragging")

	function doPan(event) {
		const view = world.viewbox()

		const trans = {
			x: (event.pageX - startX) * zoomFactor,
			y: (event.pageY - startY) * zoomFactor
		}

		pan(world, trans).execute()
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

function pan(world, {x, y}) {
	return {
		execute: () => {
			const viewbox = world.viewbox()
			world.viewbox( -x, -y, viewbox.width, viewbox.height )
		//	console.debug( -x, -y, viewbox.width, viewbox.height )
		}
	}
}
*/


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
