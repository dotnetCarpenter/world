"use strict"

!(function(doc) {
  var world = SVG("worldmap")
  var controls = [$(".info-box__button_in"), $(".info-box__button_out"), $('.info-box__button_default')]
  var displayZoomLevel = setupDisplayZoomLevel($(".info-box__zoom-factor"))

  function $(query, el) {
    el = el || doc
    return el.querySelector(query)
  }

  function setupDisplayZoomLevel(out) {
    return function(level) {
      out.textContent = level.toFixed(2)
    }
  }

  main()

  function main() {
    world.panZoom({ zoomFactor: 0.2 })

    var zoomLevel

    var displayWorldZoomLevel = function() {
      zoomLevel = world.zoom()
      displayZoomLevel(zoomLevel)
    }

    SVG.on(window, "resize", displayWorldZoomLevel)
    world.on("zoom", displayWorldZoomLevel)

    SVG.on(controls[0], "click", function() {
      world.animate(250, "<>").zoom(zoomLevel * 1.2)
    })

    SVG.on(controls[1], "click", function() {
      world.animate(200, ">").zoom(zoomLevel * .8)
    })

    SVG.on(controls[2], "click", function() {
      world.animate(400, "<>").zoom(1)
    })

    displayWorldZoomLevel()

    var lastP
    var normalizeEvent = function(ev) {
      if(!ev.touches) {
        ev.touches = [{clientX: ev.clientX, clientY: ev.clientY}]
      }

      return [].slice.call(ev.touches)
    }
    var panStart = function(ev) {
      ev.preventDefault()

      world.off('touchstart', panStart)

      let lastTouches = normalizeEvent(ev)

      // TODO: this is important
      // if(zoomInProgress) return

      lastP = {x: lastTouches[0].clientX, y: lastTouches[0].clientY }

      SVG.on(document, 'touchmove', panning, world, {passive:false})
      SVG.on(document, 'touchend', panStop, world, {passive:false})
    }

    var panStop = function(ev) {
      ev.preventDefault()

      SVG.off(document,'touchmove', panning)
      SVG.off(document,'touchend', panStop)
      world.on('touchstart', panStart)
    }

    var panning = function(ev) {
      ev.preventDefault()

      var currentTouches = normalizeEvent(ev)

      var currentP = {x: currentTouches[0].clientX, y: currentTouches[0].clientY }
        , p1 = this.point(currentP.x, currentP.y)
        , p2 = this.point(lastP.x, lastP.y)
        , deltaP = [p2.x - p1.x, p2.y - p1.y]
        , box = new SVG.Box(this.viewbox()).transform(new SVG.Matrix().translate(deltaP[0], deltaP[1]))

      this.viewbox(box)
      lastP = currentP
    }

    // TODO - test in user-land
    world.on('touchstart', panStart, world, {passive:false})

  }

}(document))
