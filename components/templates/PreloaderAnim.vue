<template lang="pug">
  .container-preloader
    .inner-container.center(ref="lottie_cont")
      //- .lottie-cont(ref="lottie_cont")
</template>

<script>

// import {
//   TweenMax,
//   TimelineMax,
//   Sine,
//   Elastic,
//   Bounce,
//   Back,
//   Power0,
//   Power4
// } from 'gsap'

import globalFunctions from "@/mixins/globalFunctions.js";

import lottie from 'lottie-web'

export default {
  name: 'LogoAnimLottie',
  mixins: [globalFunctions],
  // props: ["kind"],
  components: {
    //
  },
  // watch {
  //   this.$route () {
  //     alert('heya')
  //   }
  // },
  data() {
    return {
      isLarge: true, 
    }
  },
  async mounted() {
    var self = this;

    // Check if large
    self.isLarge = self.checkIfLarge(768);

    // Get container
    self.lottieCont = self.$refs.lottie_cont

    self.$nextTick(
      self.introAnimation()
    )
  },
  methods: {
    introOver() {
      var self = this;
      // Mouse move event listener
      window.addEventListener('mousemove', e => {
        // self.tweenLinesWithCursor(e)
        // self.affectDotGrid(e)
      }, false)
      // Touch event listener
      window.addEventListener('touchmove', e => {
        var touch = e.targetTouches[0];
        // self.tweenLinesWithCursor(touch)
        // self.affectDotGrid(touch)
      }, false)
    },
    introAnimation() {
      // alert('is this what you want!')
      console.log(lottie)
      var self = this
      var anim = lottie.loadAnimation({
        container: self.lottieCont, // the dom element that will contain the animation
        renderer: 'svg',
        loop: true,
        autoplay: true,

        // path: '/lottie-files/24265-flower-animation.json' // the path to the animation json
        path: '/lottie-files/preloader_logo-anim-shifting-places.json' // the path to the animation json
        // path: '/lottie-files/main-1b-lottie-friendly.json' // the path to the animation json
      });
      anim.setSpeed(1)
    },
  }
}
</script>



<style lang="scss">

.container-preloader {
  width: 100%;
  height: 100vh;
  z-index: 10;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #000;
  transition: all 1s ease-in-out;
  &.hasloaded {
    opacity: 0;
    visibility: hidden;
    // display: none;
  }
  .inner-container {
    // transform-style: preserve-3d;
    // perspective: 500px;
  }
}


// .container { background: red; }
// .inner-container { background: blue; }
// .purchase-wrapper { background: green; }
// .cta-buttons { background: orange; }

</style>
