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

  main(world)

  function main(world) {
    displayZoomLevel(1)

    world.panZoom({ zoomFactor: 0.2 })

    //introAnimation(world)

    world.on("zoomEnd", function() {
      displayZoomLevel(world.zoom())
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

  function introAnimation(world) {
    world.zoom(-50)
      .animate(1000, "<", 250)
      .zoom(50)
  }

}(document))
