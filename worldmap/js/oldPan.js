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
