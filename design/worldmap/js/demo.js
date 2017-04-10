"use strict"

const world = SVG("worldmap")

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
