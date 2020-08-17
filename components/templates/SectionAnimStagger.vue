<template lang="pug">
  .container(v-bind:class="kind" ref="anim_cont").fixed.no-events
    .inner-container.center.explanations
      h1.title.bold-it.anim {{ text.title }}
      h3.bold-it.anim {{ text.subtitle }}
      h3.grey-it.split-it {{ text.explanation }}
</template>

<script>

import { TweenMax, TimelineMax, Sine, Elastic, Bounce, Back, Power0, Power4 } from 'gsap'

import globalFunctions from '@/mixins/globalFunctions.js'

// import SimplexNoise from 'simplex-noise'

// import LogoOnGrid from '@/components/svg/LogoOnGrid'

// import { map, noise } from 'p5'
// import p5 from 'p5/lib/p5.min.js'

export default {
  name: 'SectionAnimStagger',
  mixins: [globalFunctions],
  props: ['kind', 'text'],
  components: {
    // CircleBold,
    // CircleBold2px,
    TweenMax,
    TimelineMax,
    Sine,
    Elastic,
    Bounce,
    Back,
    Power0
  },
  // watch {
  //   this.$route () {
  //     alert('heya')
  //   }
  // },
  data () {
    return {
      allLetters: []
    }
  },
  async mounted () {
    var self = this
    // Check if large
    self.isLarge = self.checkIfLarge(768)
    // Get container
    self.cnt = self.$refs.anim_cont
    // var cnts = document.getElementsByClassName('.container')
    // for (var i = 0; i < cnts.length; i++) {
    //   self.cnts.push(cnts[i])
    //   console.log('yes')
    //   console.log(cnts[i])
    // }
    self.$nextTick(
      self.introAnimation()
    )
  },
  methods: {
    setupScrollTriggers () {
      var self = this
      // console.log('here comes the party: ')
      for (var c = 0; c < self.cnts.length; c++) {
        // console.log(self.cnts[c])
        var attr = self.offset(self.cnts[c])
        // console.log(attr)
        self.triggers.push(attr.top)
      }
      // self.cnts.forEach(elm => {
      //   console.log(elm)
      //   // var attr = self.getPosition(elm)
      //   var attr = self.offset(elm)
      //   console.log(attr)
      // });
    },
    affectDotGrid (e) {
      var self = this
      var scrollPos = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop
      if ((scrollPos < self.triggers[2]) || (scrollPos < self.triggers[2])) {
        return
      }
      console.log('making it past it')
      for (var l = 0; l < self.allDots.length; l++) {
        var mouseDistance = self.distance(
          e.clientX - ((window.innerWidth - 1024) / 2),
          e.clientY,
          self.allDots[l].x1.baseVal.value,
          self.allDots[l].y1.baseVal.value
        );
        TweenMax.to(self.allLines[l], 0.5, {
          stroke: '#fff', // Stroke***
          // Scale down where cursor is
          // strokeWidth: Math.floor(mouseDistance * 0.02),
          // Scale up where cursor is
          strokeWidth: mouseDistance < 150 ? self.mapValue(mouseDistance, 0, 1000, 14, 2) : 1,
          // strokeWidth: mouseDistance < 120 ? Math.floor((10 / mouseDistance) * 15) : 1,
          ease: Sine.easeOut
        })
        // console.log(mouseDistance)
        // console.log('mouseDistance: ', mouseDistance)
      }
    },
    storeGridDots () {
      var self = this
      for (var l = 0; l < self.allDots.length; l++) {
        self.orgDots.push({
          x1: self.allDots[l].x1.baseVal.value,
          y1: self.allDots[l].y1.baseVal.value,
          x2: self.allDots[l].x2.baseVal.value,
          y2: self.allDots[l].y2.baseVal.value
        })
        // console.log(self.orgDots.length)
        // console.log(self.orgDots[l].x1)
        // if (l = self.allDots.length - 1) {
        // }
      }
    },
    storeLinePos () {
      var self = this
      for (var l = 0; l < self.allLines.length; l++) {
        self.orgLines.push({
          x1: self.allLines[l].x1.baseVal.value,
          y1: self.allLines[l].y1.baseVal.value,
          x2: self.allLines[l].x2.baseVal.value,
          y2: self.allLines[l].y2.baseVal.value
        })
        // console.log(self.orgLines.length)
        // console.log(self.orgDots[l].x1)
        // if (l = self.allDots.length - 1) {
        // }
      }
    },
    introOver () {
      var self = this
      // Mouse move event listener
      window.addEventListener('mousemove', (e) => {
        // self.tweenLinesWithCursor(e)
        self.affectDotGrid(e)
      }, false);
      // Touch event listener
      window.addEventListener('touchmove', (e) => {
        var touch = e.targetTouches[0];
        // self.tweenLinesWithCursor(touch)
        self.affectDotGrid(touch)
      }, false);
      // Start noise animation loop
      // self.noiseAnimation()
      // setTimeout(() => {
      //   self.noiseAnimation()
      // }, 2000)
    },
    introAnimation () {
      // alert('is this what you want!')
      self.tl = new TimelineMax()
      // var splitText = new SplitText('.split-it', { type: 'words, chars' })
      var splitText = new SplitText('.split-it', { type: 'lines' })
      // self.allLetters = splitText.chars
      self.allLetters = splitText.lines
      self.tl
        .delay(1)
        .add('start')
        .staggerFrom(`.anim`, 0.8, {autoAlpha: 0, rotateX: -90, transformOrigin: '50% 100%', ease: Sine.easeOut}, 0.25, 'start+=0.2')
        // .staggerFrom(self.allLetters, 0.8, {autoAlpha: 0, rotateX: -90, transformOrigin: '50% 100%', ease: Sine.easeOut}, 0.05)
        .from(self.allLetters, {duration: 1.2, opacity: 0, y: 20, transformOrigin: '0% 50% -50',  ease: 'back', stagger: 0.1}, '+=0')
    },
    whenLeaving () {
      var self = this
      //
      console.log('leave from index')
      // let tl = new TimelineMax({ onComplete: done })
      let tl = new TimelineMax()
      let isChrome = !!window.chrome && !!window.chrome.webstore
      tl.add('leave')
      tl.to(self.$el, 0.8, {
        scale: 0.9,
        opacity: 0,
        // rotateX: 100,
        transformOrigin: '50% 50%',
        ease: Sine.easeIn
      }, 'leave')
      tl.staggerTo('.all-lines line', 0.8, {
        rotation: -45,
        opacity: 0.2,
        scale: 0.5,
        transformOrigin: '50% 50%',
        ease: Sine.easeIn
      }, 0.003, 'leave')
      tl.timeScale(1.5)
    },
    // This can be used to change cursor and touch interaction modes
    changeState (target) {
      var self = this
      var name = target.getAttribute('name')
      console.log(target.getAttribute('name'))
      if (name === 'morph-1') {
        self.morphState = 'ballinnet'
      } else if (name === 'morph-2') {
        // self.morphState = {x2: 200} // {y2: 200}
        self.morphState = 0
      }
    },
    getCirclePosition(circleElem) {
      // var elem = document.getElementById(circleElemId);
      var elem = circleElem
      var svg = elem.ownerSVGElement;

      // Get the cx and cy coordinates
      var pt = svg.createSVGPoint();
      pt.x = elem.x1.baseVal.value;
      pt.y = elem.y1.baseVal.value;
      while (true) {
        // Get this elements transform
        var transform = elem.transform.baseVal.consolidate();
        // If it has a transform, then apply it to our point
        if (transform) {
          var matrix = elem.transform.baseVal.consolidate().matrix;
          pt = pt.matrixTransform(matrix);
        }
        // If this element's parent is the root SVG element, then stop
        if (elem.parentNode == svg)
          break;
        // Otherwise step up to the parent element and repeat the process
        elem = elem.parentNode;
      }
      return pt;
    },
    getPoint(x,y) {
      this.x = x
      this.y = y
      this.distanceTo = function (point) {
        var distance = Math.sqrt((Math.pow(point.x-this.x,2))+(Math.pow(point.y-this.y,2)))
        return distance
      }
    },
    randomColor () {
      // var m = new Array();
      // for (var i = 0; i < 80; i++) {
      //   m.push("#"+ Math.floor((Math.random() * 10)) + Math.floor((Math.random() * 10))+Math.floor((Math.random() * 10))); // to construct a color arrary.
      // }
      // return m
    }
  },
  created () {
    // console.log('created')
    if (process.browser) {
      // window.addEventListener('scroll', this.handleScroll)
    }
  },
  destroyed () {
    // console.log('destroyed')
    // if (process.browser) {
    //   window.removeEventListener('mousemove', (e) => {
    //     self.tweenLinesWithCursor(e)
    //   }, false);
    //   // window.removeEventListener('mousemove', this.tweenLinesWithCursor(), false)
    //   // window.removeEventListener('mousemove', true)
    // }
  },
  beforeDestroy: function () {
    console.log('before destroying BackgroundAnim')
    //
  },
  beforeLeave: function (el) {
    // console.log('we are leaving')
  },
  beforeRouteLeave (to, from, next) {
    // called when the route that renders this component is about to
    // be navigated away from.
    // has access to `this` component instance.
    // console.log('we are leaving route')
  }
}
</script>



<style lang="scss" scoped>

// .container { background: red; }
// .inner-container { background: blue; }
// .purchase-wrapper { background: green; }
// .cta-buttons { background: orange; }

.container {
  .inner-container {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 32px;
    .title {
      margin-bottom: 8px;
    }
  }
}

// /* Enter and leave animations can use different */
// /* durations and timing functions.              */
// .slide-fade-carousel-enter-active {
//   transition: all $trans-time-for-lp ease;
// }
// .slide-fade-carousel-leave-active {
//   transition: all $trans-time-for-lp cubic-bezier(1.0, 0.5, 0.8, 1.0);
// }
// .slide-fade-carousel-enter {
//   // transform: translateX(10px);
//   opacity: 0;
// }

// .slide-fade-carousel-leave-to {
//   // transform: translateX(-10px);
// }

// @media only screen and (max-width: $bootstrap-medium-break) {
//   .scroll-teaser { display: none; }
// }

</style>
