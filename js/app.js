'use strict'

!(function(doc, win) {
  var world = SVG('worldmap')

  // world.zoomMax = 3
  // setTimeout(world.zoom.bind(world), 0, 0.01)

  main()

  function main() {
    // initialize
    var zoomLevel
    setTimeout(function() { // wait for CSS styles to be applied to SVG or getComputedStyle might be wrong
      zoomLevel = world.zoom()
      world.panZoom({ zoomFactor: 0.4, zoomMax: 7 , zoomMin: zoomLevel  })
      if(Number.isNaN(zoomLevel) || zoomLevel === Infinity) alert(zoomLevel)
    }, 0)

    var container = SVG.adopt($('.worldmap'))
    var buttonGroup = SVG('worldmap__buttongroup')
    var zoomIn = buttonGroup.select('#button-zoom-in')
    var zoomOut = buttonGroup.select('#button-zoom-out')

    // event handlers
    world.on('panStart', function() {
      container.addClass('worldmap_dragging')
    })

    world.on('panEnd', function(ev) {
      container.removeClass('worldmap_dragging')
    })

    world.on('zoom', function maxMin(ev) {
      zoomLevel = world.zoom()

      // max/min zoom
      // var lvl = ev.detail.level
      // var zoomingIn = zoomLevel < lvl

      // if(zoomingIn && zoomLevel > 7) ev.preventDefault()
      // else if(!zoomingIn && zoomLevel < ORIG_ZOOM) ev.preventDefault()
    })

    world.on('dblclick', function zoomIn(ev) {
      ev.preventDefault()

      var factor
      if(ev.shiftKey) factor = .4
      else factor = 1.6

      world.animate(200, '>').zoom(zoomLevel * factor, {x:ev.clientX, y:ev.clientY}/* , new SVG.Point(ev.clientX, ev.clientY) */)
    })

    zoomIn.on('click', function() {
      buttonGroup
          .select('.worldmap__plus')
          .animate(110, '<')
          .scale(1.4)
          .animate(110, '>')
          .scale(1)

      world.animate(200, '>').zoom(zoomLevel * 1.6)
    })

    zoomOut.on('click', function() {
      buttonGroup
          .select('.worldmap__minus')
          .animate(110, '<')
          .scale(1.4)
          .animate(110, '>')
          .scale(1)

      world.animate(200, '>').zoom(zoomLevel * .4)
    })

    world.on('click', function(ev) {
      var target = SVG.adopt(ev.target)
      var className = 'worldmap__country_has-data-selected'

      if(!target.hasClass('worldmap__country_has-data')) return

      this.select('path').removeClass(className)
      target.addClass(className)
    })
  }

  function $(query, el) {
    el = el || doc
    var ret = el.querySelectorAll(query)
    return ret.length > 1 ? ret : ret[0]
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

}(document, window))
