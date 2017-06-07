"use strict"

!(function(doc) {
  var world = SVG("worldmap")

  main()

  function main() {
    world.panZoom({ zoomFactor: 0.4 })

    var ORIG_ZOOM = world.zoom()

    world.on('panStart', function() {
      world.addClass('worldmap_dragging')
    })

    world.on('panEnd', function() {
      world.removeClass('worldmap_dragging')
    })

    world.on('zoom', function maxMin(ev) {
      // max/min zoom
      var lvl = ev.detail.level
      var zoom = world.zoom()
      var zoomingIn = zoom < lvl

      if(zoomingIn && zoom > 7) ev.preventDefault()
      else if(!zoomingIn && zoom < ORIG_ZOOM) ev.preventDefault()
    })

    world.on('click', function(ev) {
      var className = 'worldmap__country_has-data-selected'
      this.select('path').removeClass(className)
      SVG.adopt(ev.target).addClass(className)
    })

    /*function updateZoomLevel() {
      zoomLevel = world.zoom()
    }*/

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

}(document))
