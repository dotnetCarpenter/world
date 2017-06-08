"use strict"

!(function(doc, win) {
  var world = SVG('worldmap')

  main()

  function main() {
    // initiate
    world.panZoom({ zoomFactor: 0.4 })

    var ORIG_ZOOM = world.zoom()
    var zoomLevel = ORIG_ZOOM
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
      var lvl = ev.detail.level
      var zoomingIn = zoomLevel < lvl

      if(zoomingIn && zoomLevel > 7) ev.preventDefault()
      else if(!zoomingIn && zoomLevel < ORIG_ZOOM) ev.preventDefault()
    })

    zoomIn.on('click', function() {
      buttonGroup
          .select('.worldmap__plus')
          .animate(110, '<')
          .scale(1.4)
          .animate(110, '>')
          .scale(1)
      world.animate(200, ">").zoom(zoomLevel * 1.6)
    })

    zoomOut.on('click', function() {
      buttonGroup
          .select('.worldmap__minus')
          .animate(110, '<')
          .scale(1.4)
          .animate(110, '>')
          .scale(1)
      world.animate(200, ">").zoom(zoomLevel * .4)
    })

    world.on('click', function(ev) {
      var target = SVG.adopt(ev.target)
      var className = 'worldmap__country_has-data-selected'

      if(!target.hasClass('worldmap__country')) return

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
