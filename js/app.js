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
      currentZoomLevel = this.zoomLevel()
      zoomFactorOut(currentZoomLevel)
    })

    SVG.on(controls[0], "click", function() {
      var p = getCenterPoint(world)

      world.zoom(0.5, p, { duration: 250, easing: "<>" })
    })

    SVG.on(controls[1], "click", function() {
      var p = getCenterPoint(world)

      world.zoom(1.5, p, { duration: 200, easing: ">" })
    })

    SVG.on(controls[2], "click", function() {
      var p = getCenterPoint(world)

      world.zoomToOne(p, { duration: 400, easing: "<>" })
    })
  }

  function getCenterPoint(element) {
    var size = element.node.getBoundingClientRect()
    return element.point(size.width / 2,
                         size.height/ 2)
  }

}(document))
