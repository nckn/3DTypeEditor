<template lang="pug">
  header.fixed
    .nav-block.logotext
      //- h4 Onomondo
      nuxt-link.nav-item.logo(:to="{ name: 'index' }"): h4 Explore editor
    .nav-block.links
      nuxt-link.nav-item(:to="{ name: 'index' }") 1
      nuxt-link.nav-item(:to="{ name: '2' }") 2
      nuxt-link.nav-item(:to="{ name: '3' }") 3
      nuxt-link.nav-item(:to="{ name: '4' }") 4
    //- .nav-block.links
    //-   nuxt-link.nav-item(:to="{ name: 'index' }") Case stories
    //-   nuxt-link.nav-item(:to="{ name: 'network' }") Network
    //-   nuxt-link.nav-item(:to="{ name: 'features' }") Features
    //-   //- nuxt-link.nav-item(:to="{ name: 'network' }") The Network
    //-   nuxt-link.nav-item(:to="{ name: 'about' }") About
</template>

<script>

import { TweenMax, Sine } from 'gsap'

import globalFunctions from '@/mixins/globalFunctions.js'

export default {
  name: 'Header',
  mixins: [globalFunctions],
  data () {
    return {
      isLarge: true,
      allLetters: null
    }
  },
  mounted () {
    var self = this

    // Check size of client
    self.isLarge = self.checkIfLarge(768)
    
    self.$nextTick(
      // Tween letters
      self.setupHoverFont()
    )
  },
  methods: {
    setupHoverFont () {
      var self = this
      if (!self.isLarge) {
        return
      }
      // var tl = new TimelineMax({ onComplete: self.onComplete })
      var splitText = new SplitText('.nav-item', { type: 'words, chars' })
      self.allLetters = splitText.chars
      for (var i = 0; i < self.allLetters.length; i++) {
        // console.log(self.allLetters[i])
        // Hovering letters
        self.allLetters[i].addEventListener('mouseenter', self.letterEnter.bind(this))
        self.allLetters[i].addEventListener('touchstart', self.letterEnter.bind(this))
        self.allLetters[i].addEventListener('touchmove', self.letterEnter.bind(this))
        // Leaving letters
        self.allLetters[i].addEventListener('mouseleave', self.letterLeave.bind(this))
        self.allLetters[i].addEventListener('touchend', self.letterLeave.bind(this))
      }
    },
    letterEnter (e) {
      var self = this
      console.log('getting in alright')
      e.preventDefault();
      // e.stopPropation();
      var target = e.target || e.srcElement
      // Random rotation
      // var randomRotX = Math.floor(Math.random() * 40) + 1
      // var remapRotX = self.mapValue(randomRotX, 0, 40, -20, 20)
      // TweenMax.to(target, 0.5, {rotate: remapRotX, ease: Sine.easeOut})
      // Lift letters up
      // TweenMax.to(target, 0.5, {y: -10})
      // TweenMax.to(target, 0.5, {scale: 0.98, transformOrigin: '0% 0%'})
      // Rotate to side
      // TweenMax.to(target, 0.5, {rotateY: -90, ease: Sine.easeOut})
      // auto alpha
      TweenMax.to(target, 0.5, {autoAlpha: 0.5, ease: Sine.easeOut})
    },
    letterLeave (e) {
      // console.log('getting in alright')
      e.preventDefault();
      // e.stopPropation();
      var target = e.target || e.srcElement
      // TweenMax.to(target, 0.5, {rotate: 0, ease: Sine.easeOut})
      // Rotate to side
      TweenMax.to(target, 0.5, {rotateY: 0, ease: Sine.easeOut})
      // auto alpha
      TweenMax.to(target, 0.5, {autoAlpha: 1, ease: Sine.easeOut})
      // TweenMax.to(target, 0.5, {y: 10})
    },
  }
}

</script>


<style lang="scss" scoped>

header {
  width: 100%;
  // z-index: unset !important;
}

</style>