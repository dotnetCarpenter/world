"use strict"

!(function(doc) {
  var world = SVG("worldmap")
  var controls = [$(".info-box__button_in"), $(".info-box__button_out"), $('.info-box__button_default')]
  var displays = $(".info-box__zoom-factor")
  var displayZoomLevel = setupDisplayZoomLevel(displays[0])
  var displayOrigLevel = setupDisplayZoomLevel(displays[1])

  function $(query, el) {
    el = el || doc
    var ret = el.querySelectorAll(query)
    return ret.length > 1 ? ret : ret[0]
  }

  function setupDisplayZoomLevel(out) {
    return function(level) {
      out.textContent = level.toFixed(2)
    }
  }

  /*world.on('panStart', console.log)
    world.on('panEnd', console.log)
    world.on('zoom', console.log)
    world.on('pinchZoomStart', console.log)
    world.on('pinchZoomEnd', console.log)*/

  main()

  function main() {
    var zoomLevel = 0
    var originalZoomLevel = world.zoom()

    SVG.on(controls[0], "click", function() {
      world.animate(250, "<>").zoom(zoomLevel * 1.4)
    })

    SVG.on(controls[1], "click", function() {
      world.animate(200, ">").zoom(zoomLevel * .6)
    })

    SVG.on(controls[2], "click", function() {
      world.animate(400, "<>").zoom(originalZoomLevel)
    })

    SVG.on(window, "resize", debounce(function() {
      displayWorldZoomLevel()
    }), 300)

    world.on("zoom", displayWorldZoomLevel)

    function displayWorldZoomLevel() {
      zoomLevel = world.zoom()
      displayZoomLevel(zoomLevel)
    }

    displayWorldZoomLevel()
    displayOrigLevel(originalZoomLevel)
  }

  function debounce(func, wait, immediate) {
    var timeout
    return function() {
      var context = this, args = arguments
      var later = function() {
        timeout = null
        if (!immediate) func.apply(context, args)
      }
      var callNow = immediate && !timeout
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
      if (callNow) func.apply(context, args)
    }
  }




  /*
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

    // user-land single touch pan
    world.on('touchstart', panStart, world, {passive:false})
    */


}(document))
