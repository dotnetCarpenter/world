SVG.extend(SVG.Doc, {

  panZoom: function(options = {}) {

    var zoomFactor = options.zoomFactor || 0.01

    var lastP

    var zoom = function(ev) {

      ev.preventDefault()

      var zoomAmound = ev.deltaY * zoomFactor + 1

      var p = this.point(ev.clientX, ev.clientY)
      var b = new SVG.Box(this.viewbox()).transform(new SVG.Matrix().scale(zoomAmound, p.x, p.y))

      this.viewbox(b)

    }

    var panStart = function(ev) {
      ev.preventDefault()
      lastP = new SVG.Point(ev.clientX, ev.clientY)

      this.off('mousedown', panStart)
      SVG.on(document, 'mousemove', panning, this)
      SVG.on(document, 'mouseup', panStop, this)
    }

    var panStop = function(ev) {
      ev.preventDefault()

      SVG.off(document,'mousemove', panning)
      SVG.off(document,'mouseup', panStop)
      this.on('mousedown', panStart)
    }

    var panning = function(ev) {
      ev.preventDefault()

      var currentP = new SVG.Point(ev.clientX, ev.clientY)
        , deltaP = [lastP.x - currentP.x, lastP.y - currentP.y]
        , box = new SVG.Box(this.viewbox()).transform(new SVG.Matrix().translate(deltaP[0], deltaP[1]))

      this.viewbox(box)
      lastP = currentP
    }

    this.on('wheel', zoom)
    this.on('mousedown', panStart)

    return this

  }

})
