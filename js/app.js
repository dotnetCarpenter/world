"use strict"

!(function(doc, win) {
  var world = SVG("worldmap")

  main()

  function main() {
    // initiate
    world.panZoom({ zoomFactor: 0.4 })
    var ORIG_ZOOM = world.zoom()

    // event handlers
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
      var target = SVG.adopt(ev.target)
      var className = 'worldmap__country_has-data-selected'

      if(!target.hasClass('worldmap__country')) return

      this.select('path').removeClass(className)
      target.addClass(className)
    })

   // create buttons
  //  var zoomIn = drawButton(world)
   //var zoomOut = zoomIn.clone()
  }

  // function drawButton(world) {
  //   var bg = world.group()
  //   var button = bg.rect()
  //   var line = bg.line(0, "50%", button.width(), "50%")
  //   line.fill({
  //     width: 1, color: '#84c47b'
  //   })
  //   //line.addTo(button)

  //   bg.addClass('worldmap__button')


  //   return button
  // }


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

}(document, window))
