"use strict"

!(function(doc) {

  var passiveSupported = false;
  try {
    var options = Object.defineProperty({}, "passive", {
      get: function() {
        passiveSupported = true;
      }
    });

    window.addEventListener("test", null, options);
  } catch(err) {}
  console.log("passiveSupported", passiveSupported)


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
      world.animate(250, "<>").zoom(zoomLevel / .2)
    })

    SVG.on(controls[1], "click", function() {
      world.animate(200, ">").zoom(zoomLevel * .2)
    })

    SVG.on(controls[2], "click", function() {
      world.animate(400, "<>").zoom(1)
    })

    displayWorldZoomLevel()
  }

}(document))
