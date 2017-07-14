/*!
* svg.panzoom.js - A plugin for svg.js that enables panzoom for viewport elements
* @version 1.1.1
* https://github.com/svgdotjs/svg.panzoom.js#readme
*
* @copyright Ulrich-Matthias Schäfer
* @license MIT
*/;
;(function() {
"use strict";

function normalizeEvent(ev) {
  if(!ev.touches) {
    ev.touches = [{clientX: ev.clientX, clientY: ev.clientY}]
  }

  return ev.touches
}

function guard(f, guard, context) {
  return function() {
    var args = arguments
    args[0] = guard.apply(context, args)
    return f.apply(context, args)
  }
}

SVG.extend(SVG.Doc, SVG.Nested, {

  panZoom: function(options) {
    options = options || {}

    this.zoomMin = options.zoomMin || Number.MIN_VALUE
    this.zoomMax = options.zoomMax || Number.MAX_VALUE
    this.zoomFactor = options.zoomFactor || 0.03

    // if max/min is given then decorate zoom with zoomGuard
    if(options.zoomMin || options.zoomMax) this.zoom = guard(this.zoom, zoomGuard, this)


    var lastP, lastTouches, zoomInProgress = false

    this.on('wheel', wheelZoom)
    this.on('touchstart', pinchZoomStart, this, {passive:false})
    this.on('mousedown', panStart, this)

    return this

    function zoomGuard(level) {
      if(level == null) return

      if(level >= this.zoomMax) {
        level = this.zoomMax
      }
      if(level <= this.zoomMin) {
        level = this.zoomMin
      }
      return level
    }

    function wheelZoom(ev) {
      ev.preventDefault()

      if(ev.deltaY == 0) return

      var level = this.zoom() - this.zoomFactor * ev.deltaY/Math.abs(ev.deltaY)
        , p = this.point(ev.clientX, ev.clientY)

      this.zoom(level, p)
    }

    function pinchZoomStart(ev) {
      lastTouches = normalizeEvent(ev)

      if(lastTouches.length < 2) return
      ev.preventDefault()

      if(this.fire('pinchZoomStart', {event: ev}).event().defaultPrevented)
        return

      this.off('touchstart', pinchZoomStart)

      zoomInProgress = true
      SVG.on(document, 'touchmove', pinchZoom, this, {passive:false})
      SVG.on(document, 'touchend', pinchZoomStop, this, {passive:false})
    }

    function pinchZoomStop(ev) {
      ev.preventDefault()
      zoomInProgress = false

      this.fire('pinchZoomEnd', {event: ev})

      SVG.off(document,'touchmove', pinchZoom)
      SVG.off(document,'touchend', pinchZoomStop)
      this.on('touchstart', pinchZoomStart)
    }

    function pinchZoom(ev) {
      ev.preventDefault()

      var currentTouches = normalizeEvent(ev)

      // Distance Formula
      var lastDelta = Math.sqrt(
        Math.pow(lastTouches[0].clientX - lastTouches[1].clientX, 2) +
        Math.pow(lastTouches[0].clientY - lastTouches[1].clientY, 2)
      )

      var currentDelta = Math.sqrt(
        Math.pow(currentTouches[0].clientX - currentTouches[1].clientX, 2) +
        Math.pow(currentTouches[0].clientY - currentTouches[1].clientY, 2)
      )

      var zoomAmount = zoomGuard(lastDelta/currentDelta)

      var currentFocus = {
        x: currentTouches[0].clientX + 0.5 * (currentTouches[1].clientX - currentTouches[0].clientX),
        y: currentTouches[0].clientY + 0.5 * (currentTouches[1].clientY - currentTouches[0].clientY)
      }

      var lastFocus = {
        x: lastTouches[0].clientX + 0.5 * (lastTouches[1].clientX - lastTouches[0].clientX),
        y: lastTouches[0].clientY + 0.5 * (lastTouches[1].clientY - lastTouches[0].clientY)
      }

      var p = this.point(currentFocus.x, currentFocus.y)
      var focusP = this.point(2*currentFocus.x-lastFocus.x, 2*currentFocus.y-lastFocus.y)
      var box = new SVG.Box(this.viewbox()).transform(
        new SVG.Matrix()
          .translate(p.x, p.y)
          .scale(zoomAmount, 0, 0)
          .translate(-focusP.x, -focusP.y)
      )

      this.viewbox(box)

      lastTouches = currentTouches

      this.fire('zoom', {box: box, focus: focusP})
    }

    function panStart(ev) {
      ev.preventDefault()

      this.off('mousedown', panStart)

      lastTouches = normalizeEvent(ev)

      if(zoomInProgress) return

      this.fire('panStart', {event: ev})

      lastP = {x: lastTouches[0].clientX, y: lastTouches[0].clientY }

      SVG.on(document, 'mousemove', panning, this)
      SVG.on(document, 'mouseup', panStop, this)
    }

    function panStop(ev) {
      ev.preventDefault()

      this.fire('panEnd', {event: ev})

      SVG.off(document,'mousemove', panning)
      SVG.off(document,'mouseup', panStop)
      this.on('mousedown', panStart)
    }

    function panning(ev) {
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

  },

  zoom: function(level, point) {

    var style = window.getComputedStyle(this.node)
      , width = parseFloat(style.getPropertyValue('width'))
      , height = parseFloat(style.getPropertyValue('height'))
      , v = this.viewbox()
      , zoomX = width / v.width
      , zoomY = height / v.height
      , zoom = Math.min(zoomX, zoomY)

    if(level == null) {
      return zoom
    }

    var zoomAmount = zoom / level
    if(zoomAmount === Infinity) zoomAmount = Number.MIN_VALUE

    point = point || new SVG.Point(width/2 / zoomX + v.x, height/2 / zoomY + v.y)

    var box = new SVG.Box(v)
      .transform(new SVG.Matrix()
        .scale(zoomAmount, point.x, point.y)
      )

    if(this.fire('zoom', {box: box, focus: point}).event().defaultPrevented)
      return this

    return this.viewbox(box)
  }
})

SVG.extend(SVG.FX, {
  zoom: function(level, point) {
    return this.add('zoom', [new SVG.Number(level)].concat(point || []))
  }
})
}());
