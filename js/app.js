"use strict"

!(function(doc) {

  var world = SVG("worldmap")
  var controls = [$(".info-box__button_in"), $(".info-box__button_out"), $('.info-box__button_default')]
  var zoomFactorOut = displayZoomLevel($(".info-box__zoom-factor"))
  var currentZoomLevel = 1


  function $(query, el) {
    el = el || doc
    return el.querySelector(query)
  }

  function displayZoomLevel(out) {
    return function(level) {
      out.textContent = level.toFixed(2)
    }
  }

  main()

  function main() {
    zoomFactorOut(currentZoomLevel)

    world.panZoom({ zoomFactor: 0.2 })

    world.on("zoom", function() {
      //console.debug(z.detail)
      currentZoomLevel = world.zoomLevel()
      zoomFactorOut(currentZoomLevel)
    })

    SVG.on(controls[0], "click", function() {
      world.animate(250, "<>").zoom(0.5)
      //world.zoom(0.5)
    })

    SVG.on(controls[1], "click", function() {
      world.animate(200, ">").zoom(1.5)
      //world.zoom(1.5)
    })

    SVG.on(controls[2], "click", function() {
      world.animate(400, "<>").zoomToOne()
      //world.zoomToOne()
    })
  }

}(document))
