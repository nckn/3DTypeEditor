export default {
  methods: {
    assignDoubleTap(bool) {
      // Quick menu related - start
      var timeout;
      var lastTap = 0
      var isTouch = (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0))
      var mouseDown = isTouch ? 'touchstart' : 'mousedown'

      document.addEventListener(mouseDown, function(event) {
        var currentTime = new Date().getTime()
        var tapLength = currentTime - lastTap
        clearTimeout(timeout)
        if (tapLength < 500 && tapLength > 0) {
          // elm2.innerHTML = 'Double Tap'
          event.preventDefault()
          return bool
        } else {
          // elm2.innerHTML = 'Single Tap';
          timeout = setTimeout(function() {
            // elm2.innerHTML = 'Single Tap (timeout)'
            clearTimeout(timeout)
          }, 500)
        }
        lastTap = currentTime
      })
      // return 
      // Quick menu related - start
    },
    // For threejs
    radians (degrees) {
      return degrees * Math.PI / 180;
    },
    map (value, start1, stop1, start2, stop2) {
      return (value - start1) / (stop1 - start1) * (stop2 - start2) + start2
    },
    // For threejs - end
    convertRange: function (value, r1, r2) {
      return (value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0]
    },
    checkIfLarge: function (breakp) {
      return breakp < window.innerWidth
    },
    ifSmall: function () {
      return 576 > window.innerWidth
    },
    offset(el) {
      var rect = el.getBoundingClientRect()
      // console.log(el)
      var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop
      return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
    },
    randomColor () {
      return '#' + Math.floor(Math.random()*16777215).toString(16)
    },
    log: function (msg) {
      // return
      console.log(msg)
    },
    pauseEvent (e) {
      if (e.stopPropagation) {
        e.stopPropagation()
      }
      if (e.preventDefault) {
        e.preventDefault()
      }
      e.cancelBubble = true
      e.returnValue = false
      return false
    },
    checkIfTouch(e) {
      var thisX, thisY
      if (e.touches != undefined) {
        thisX = e.touches[0].pageX
        thisY = e.touches[0].pageY
      }
      else {
        thisX = e.clientX
        thisY = e.clientY
      }
      return { x: thisX, y: thisY }
    },
    logObject (obj) {
      var output = ''
      var object = obj
      for (var property in object) {
        output += property + ': ' + object[property] + '; '
      }
      console.log('object')
      return output
    },
    mapValue (value, start1, stop1, start2, stop2) {
      return (value - start1) / (stop1 - start1) * (stop2 - start2) + start2
    },
    getKeyByValue(nameKey, myArray){
      for (var i=0; i < myArray.length; i++) {
        if (myArray[i].name === nameKey) {
          return myArray[i]
        }
      }
    },
    distance (x1, y1, x2, y2) {
      return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2))
    },
    // Vector direction
    vectorDirection (line, noiseVal, half) {
      var x1
      var y1
      var x2
      var y2
      if (half === 'first') {
        x1 = line.x1.baseVal.value
        y1 = line.y1.baseVal.value
        x2 = line.x2.baseVal.value
        y2 = line.y2.baseVal.value
      }
      else if (half === 'second') {
        x1 = line.x2.baseVal.value
        y1 = line.y2.baseVal.value
        x2 = line.x1.baseVal.value
        y2 = line.y1.baseVal.value
      }

      // var c = document.getElementById("myCanvas");
      // var ctx = c.getContext("2d");

      // // Draw a line.
      // ctx.moveTo(x1,y1);
      // ctx.lineTo(x2,y2);
      // ctx.stroke();

      // Determine line lengths
      // Org
      // var xlen
      // var ylen
      // if (half === 'first') {
      //   xlen = x2 - x1
      //   ylen = y2 - y1
      // }
      // else if (half === 'second') {
      //   xlen = x1 - x2
      //   ylen = y1 - y2
      // }
      var xlen = x2 - x1
      var ylen = y2 - y1
      // Opposite
      // var xlen = x1 - x2
      // var ylen = y1 - y2

      // Determine hypotenuse length
      var hlen = Math.sqrt(Math.pow(xlen,2) + Math.pow(ylen,2))

      // The variable identifying the length of the `shortened` line.
      // In this case 50 units.
      // var smallerLen = 160;
      var smallerLen = noiseVal

      // Determine the ratio between they shortened value and the full hypotenuse.
      var ratio = smallerLen / hlen

      var smallerXLen = xlen * ratio
      var smallerYLen = ylen * ratio

      // The new X point is the starting x plus the smaller x length.
      var smallerX = x1 + smallerXLen

      // Same goes for the new Y.
      var smallerY = y1 + smallerYLen
      return {
        nX: smallerX,
        nY: smallerY
      }

      // Draw a circle at the new point on the line.
      // ctx.fillStyle = "red";
      // ctx.moveTo(smallerX, smallerY);
      // ctx.arc(smallerX,smallerY,3,0,2*Math.PI);
      // ctx.stroke();
      // ctx.fill();
    },
    shuffle(a) {
      var j, x, i
      for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1))
        x = a[i]
        a[i] = a[j]
        a[j] = x
      }
      return a
    }
  }
}
