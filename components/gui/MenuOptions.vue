<template lang="pug">
  .menu-container(ref="menu_container" v-bind:class="type" name="menu-container")
    //- .pie.pie1(@click="document.body.classList.remove('active')")
    //-
    //- Second level menu options
    //- .piechart.bigger(v-show="revealMenuSub")
    .menu-trigger(@mouseenter="hoverOption" name="menu-trigger")
      svg.hamburger(width='24' height='24' viewbox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg')
        g(fill='none' stroke='#000' stroke-width='1' stroke-linecap='round')
          path(d='M5.5 11.5L19.5 11.5')
          path(d='M9.5 5.5L12.5 5.5')
          path(d='M9.5 17.5L12.5 17.5')
          path(d='M12.5 5.5L15.5 5.5')
          path(d='M12.5 17.5L15.5 17.5')
    .piechart.bigger(v-bind:class="{ revealed: revealMenuSub }")
      .piechart__segment(:style="`--offset: ${(25 + (index * (25 / options.length)))}; --value: ${(25 / options.length)};`" v-for="(pm, index) in options" :key="`pm-${index}`" v-bind:class="`pieseg${index+1}`" @mouseenter="")
        .submenu-wrapper
          .submenu-option(v-for="(mtd, index) in pm.methods" :key="`mtd-${index}`" @click="commandClicked" :name="`${mtd.name}`" v-bind:class="[`${pm.name} ${mtd.name}`, {disabled: !pm.enabled}]")
    //- Second level menu options - end
    //-
    //- First level menu options
    .piechart.inner(v-bind:class="{ revealed: revealMenu }")
      .piechart__segment.clipped(:style="`--offset: ${(25 + (index * (25 / options.length)))}; --value: ${(25 / options.length)};`" v-for="(pm, index) in options" :key="`pm-${index}`" v-bind:class="`pieseg${index+1}`" @mouseenter="hoverOption" @mouseleave="hoverOption" :name="`unique-${index}`")
        .micon(v-bind:class="[pm.name, {enabled: pm.enabled}, {greyedout: !pm.enabled}, {otherstate: !pm.enabled}]" :name="pm.name" @click="commandClicked")
    //- First level menu options - end
    //-
    .pie(@click="toggleMenu" v-for="(pm, index) in options" :name="pm.name" :key="`pm-${index}`" v-bind:class="`pie${index+1}`")
      .pie-color(v-bind:class="ids[index]")
    .menu(@click="toggleMenu" name="menu-button")
      //- svg.hamburger(width='24' height='24' viewbox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg')
      //-   g(fill='none' stroke='#000' stroke-width='1' stroke-linecap='round')
      //-     path(d='M5.5 11.5L19.5 11.5')
      //-     path(d='M9.5 5.5L12.5 5.5')
      //-     path(d='M9.5 17.5L12.5 17.5')
      //-     path(d='M12.5 5.5L15.5 5.5')
      //-     path(d='M12.5 17.5L15.5 17.5')
</template>

<script>

import globalFunctions from '@/mixins/globalFunctions.js'
// import { radians, map, distance } from '@/assets/js/helpers'

// Based on
// https://codepen.io/ainalem/pen/YoyZpq

export default {
  name: 'MenuOptions',
  props: ['type', 'options', 'closer'],
  mixins: [globalFunctions],
  components: {
    //
  },
  data () {
    return {
      menuContainer: null,
      ids: [
        'one',
        'two',
        'thr',
        'fou',
        'fiv',
        'six',
        'sev',
        'eig',
        'nin',
        'ten',
        'ele',
        'twe',
        'thi',
        'fot',
        'fif',
      ],
      revealMenu: false,
      revealMenuSub: false,
      curName: '',
      // delay between two menus
      delay: 100,
      isTouch: (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)),
      closerEvent: null,
      // Debug
      debug: false
    }
  },
  watch: {
    closer () {
      console.log('this thing: ', this.closer)
      // console.log('the renderer: ', self.$root)
      // Needed to make the menu disappear again
      if (this.debug) {
        return
      }
      this.setupCloser()
    }
  },
  async mounted() {
    var self = this
    // Set menu container
    self.menuContainer = self.$refs.menu_container
    await console.log('this is the closer: ', this.closer)

    // See if touch or mouse
    // self.closerEvent = self.isTouch ? 'touchmove' : 'closerEvent'
    self.closerEvent = self.isTouch ? 'touchstart' : 'mouseenter'

    // setTimeout(() => {
    //   console.log('this is the closer: ', this.closer)
    //   // self.init()
    // }, 1000)
    // console.log('length: ', this.options.length)
  },
  methods: {
    commandClicked(e) {
      var self = this
      var target = e.target || e.srcElement
      var name = target.getAttribute('name')
      // console.log('target: ', target)
      var obj = {target: target, name: name}
      self.$parent.clickedCommandInChild(obj)
    },
    // Setup menu closer
    setupCloser () {
      var self = this
      self.closer.addEventListener(self.closerEvent, function clearMouseUp(e) {
        var target = e.target || e.srcElement
        var name = target.getAttribute('name')
        // console.log('this is it: ', e)
        self.revealMenuSub = false
        setTimeout(() => {            
          self.revealMenu = false
        }, self.delay)
        document.removeEventListener(self.closerEvent, clearMouseUp, true);
        if (name === 'container-tfctls') {
          // Hide menus again
        }
      }, true);
    },
    // rndmColor () {
    //   return this.randomColor()
    // },
    init() {
      var self = this
      window.addEventListener( 'resize', self.onWindowResize(), false )
      // window.addEventListener( 'keydown', function ( event ) {
      //   switch ( event.keyCode ) {
      //     case 81: // Q
      //       // self.control.setSpace( self.control.space === 'local' ? 'world' : 'local' )
      //       break
      //   }
      // })

      // window.addEventListener( 'keyup', function ( event ) {
      //   switch ( event.keyCode ) {
      //     case 16: // Shift
      //       self.control.setTranslationSnap( null )
      //       self.control.setRotationSnap( null )
      //       self.control.setScaleSnap( null )
      //       break
      //   }
      // })
    },
    toggleMenu(e) {
      var self = this
      var childTarget = e.target || e.srcElement
      var target = childTarget.parentNode
      var name = target.getAttribute('name')
      var t = {src: target, name: name}
      console.log('clicked: ', target)
      console.log('name: ', name)
      self.$parent.optionSelected(t)
      // switch ( name ) {
      //   case 'toogle-cam': // Q
      //     self.control.setSpace( self.control.space === 'local' ? 'world' : 'local' )
      //     break
      // Toggle active class
      self.menuContainer.classList.toggle('active')

    },
    onWindowResize() {
      var self = this 
      // Do something here
    },
    hoverOption(e) {
      var self = this
      var target = e.target || e.srcElement
      var name = target.getAttribute('name')

      if (name === 'menu-trigger') {
        self.revealMenu = true
      }
      
      // console.log('target: ', self.curName)
      if (e.type === 'mouseenter' && !self.revealMenuSub) {
        setTimeout(() => {
          self.revealMenuSub = true
        }, self.delay)
        // self.curName = name
        // Apply temporary eventlistener
        // document.addEventListener('mouseenter', function clearMouseUp(e) {
        //   var name = target.getAttribute('name')
        //   console.log('this is it: ', name)
        //   if (name === 'container-tfctls') {
        //     self.revealMenuSub = false
        //     document.removeEventListener('mouseenter', clearMouseUp, true);
        //   }
        // }, true);
      }
      // if (e.type === 'mouseleave' && self.curName != name) {
      //   // self.curName = name
      //   // self.revealMenuSub = false
      //   // self.curName = name
      // }
      // console.log('name: ', name)
      // if (name === 'menu-container') {
      //   self.revealMenuSub = false
      // }
      // if (self.revealMenuSub) {
      //   console.log('revealed yes: ', e.type)
      //   target.addEventListener('mouseleave', e => {
      //     if (self.curName === name) {
      //       console.log('same name')
      //       self.curName === name
      //       return
      //     }
      //     else {
      //       console.log('not the same name')
      //       self.revealMenuSub = false
      //     } 
      //   })
      // }
    }
  }
};
</script>

<style lang="stylus" scoped>

.greyedout
  opacity 0.5
  // pointer-events none
.disabled
  opacity 0.5
  pointer-events none
.enabled
  opacity 1
  // svg
  //   stroke #0F0

trans-time = 0.4s

random(min,max)
  return floor(math(0, 'random')*(max - min + 1) + min)

.menu-container
  width 240px
  height 240px
  // background green
  position absolute
  top 0
  left 0
  pointer-events none
  .menu-trigger
    pointer-events all
    width 48px
    height 48px
    position absolute
    top 0
    left 0
    // background white
    border-radius 2px
    display flex
    align-items center
    justify-content center
    svg {
      background #f5f5f5
      border-radius 12px
      width 24px
      height 24px
    }

set-background($path)
  background url($path) no-repeat
  background-size 100%
  background-position center

.piechart
  width calc(var(--size, 200) * 1px)
  height calc(var(--size, 200) * 1px)
  box-shadow 3px 3px 20px 0px rgba(0,0,0,0.2)
  visibility hidden
  opacity 0
  transition all trans-time ease-out
  transform scale(0)
  pointer-events all
  &.inner
    .piechart__segment
      opacity 0.8
      &:hover
        opacity 1
  &.bigger
    width calc(var(--size, 400) * 1px)
    height calc(var(--size, 400) * 1px)
    left -200px
    top -200px
    // .piechart__segment
    //   opacity 0
    // &:hover
    //   .piechart__segment
    //     opacity 1
  &.revealed
    transform scale(1)
    visibility visible
    opacity 1
  // width 200px
  // height 200px
  border-radius 100%
  overflow hidden
  position relative
  position absolute
  // left var(--size)
  // top var(--size)
  left -100px
  top -100px
  //   &:hover
  //     &__segment
  //       transform scale(2)
  &__segment
    transform scale(0)
    --a calc(var(--over50, 0) * -100%)
    --b calc((1 + var(--over50, 0)) * 100%)
    --degrees calc((var(--offset, 0) / 100) * 360)
    // &.clipped
    -webkit-clip-path polygon(var(--a) var(--a), var(--b) var(--a), var(--b) var(--b), var(--a) var(--b))
    clip-path polygon(var(--a) var(--a), var(--b) var(--a), var(--b) var(--b), var(--a) var(--b))
    position absolute
    transform translate(0, -50%) rotate(90deg) rotate(calc(var(--degrees) * 1deg))
    transform-origin 50% 100%
    width 100%
    height 100%
    z-index calc(1 + var(--over50))
    cursor pointer
    // transition opacity 1s
    transition all 1s
    .micon
      width 24px
      height 24px
      position absolute
      top 86%
      left 5%
      z-index 1
      &.transforms
        set-background('/svg/icons/icon-transforms-white.svg')
      &.camerapos
        set-background('/svg/icons/icon-camera-white.svg')
      &.space 
        set-background('/svg/icons/icon-space-world.svg')
        &.otherstate
          set-background('/svg/icons/icon-space-local.svg')
      &.snap
        set-background('/svg/icons/icon-snap-on.svg')
        &.otherstate
          set-background('/svg/icons/icon-snap-off.svg') 
      transform rotate(-90deg) rotate(calc(var(--degrees) * -1deg))
      // transform-origin 50% 100%
    // If .submenu-wrapper is not present
    // display flex
    // align-items flex-end
    .submenu-wrapper
      width 100%
      height 100%
      // transform rotate(calc(var(--degrees) * -1deg))
      transform rotate(5deg)
      position absolute
      top 0
      left 24px
      display flex
      align-items flex-end
      // flex-direction row-reverse
      z-index 1
      // pointer-events none
    .submenu-option
      // pointer-events all
      width 24px
      height 24px
      background green
      z-index 1
      transform rotate(-90deg) rotate(calc(var(--degrees) * -1deg - 5deg))
      // right calc(50% - 12px)
      opacity 0.5
      &:hover
        opacity 1
      &:not(:last-child)
        margin-right 8px
      // position absolute
      // bottom 0px
      // right 0px
    &:after
    &:before
      transition background 0.5s
      background var(--bg, #151515)
      content ''
      height 100%
      position absolute
      width 100%
    &:before
      --degrees calc((var(--value, 45) / 100) * 360)
      transform translate(0, 100%) rotate(calc(var(--degrees) * 1deg))
      transform-origin 50% 0%

    &:after
      opacity var(--over50, 0)
    
    // For ramdom coloring
    for $i in (1)..(30)
      // width: 100px;
      // transition: opacity 0.25s ease-in, height 0.25s ease-in;
      &:nth-child({$i})
        // height: 100%;
        // height: random(200) + px;
        // background: red;
        // random-rgba(background-color)
        // filter: hue-rotate(random(30, 300)deg)
        // background darken(#D62828, 10)
    &:hover
      &:before
        background lighten(#151515, 10)
      // background lighten(#D62828, 30)
      // opacity: 0.75
      // border: 1px solid #f00
      // transform: scaleX(20)
      // transform translate(0, -50%) rotate(90deg) scale(2) rotate(calc(var(--degrees) * 1deg))
      // background: lighten($color: random-rgba(background-color), $amount: 20)

.submenu-option
  &.camerapos
    &.front
      background url('/svg/icons/icon-camera-front.svg') no-repeat
    &.top
      background url('/svg/icons/icon-camera-top.svg') no-repeat
    &.right
      background url('/svg/icons/icon-camera-left.svg') no-repeat
  &.viewhandles
    &.handlex
      background url('/svg/icons/icon-camera-front.svg') no-repeat
    &.handley
      background url('/svg/icons/icon-camera-top.svg') no-repeat
    &.handlez
      background url('/svg/icons/icon-camera-left.svg') no-repeat
  &.transforms
    &.translate
      background url('/svg/icons/icon-transforms-translate.svg') no-repeat
    &.rotate
      background url('/svg/icons/icon-transforms-rotate.svg') no-repeat
    &.scale
      background url('/svg/icons/icon-transforms-scale.svg') no-repeat
  // &.space
  //   &.translate
  //     background url('/svg/icons/icon-transforms-translate.svg') no-repeat
  //   &.rotate
  //     background url('/svg/icons/icon-transforms-rotate.svg') no-repeat
  //   &.scale
  //     background url('/svg/icons/icon-transforms-scale.svg') no-repeat
</style>



<style lang="scss" scoped>

// .submenu-option {
//   background: url('/svg/icons/icon-menu-centered-white.svg') no-repeat;
//   // background: url('/svg/icons/icon-camera-white.svg') no-repeat;
//   background-size: 100%;
//   background-position: center;
// }

</style>


// <style lang="scss" scoped>

// $s-menu: 100px;

// @function random-decimal() {
//   @return random(100)/100;
// }
// @mixin random-rgba($attr, $color: 255, $alpha: random-decimal()){
//   #{$attr}: rgba(random($color),random($color),random($color),$alpha);
// }


// // START PIE CHART RELATED FUNCTIONAL STYLES
// .piechart {
//   width: calc(var(--size, 200) * 1px);
//   height: calc(var(--size, 200) * 1px);
//   // width: $s-menu;
//   // height: $s-menu;
//   position: absolute;
//   left: -$s-menu / 2;
//   top: -$s-menu / 2;
//   border-radius: 100%;
//   overflow: hidden;
//   // position: relative;
//   .segment {
//     --a: calc(var(--over50, 0) * -100%);
//     --b: calc((1 + var(--over50, 0)) * 100%);
//     --degrees: calc((var(--offset, 0) / 100) * 360);
//     -webkit-clip-path: polygon(var(--a) var(--a), var(--b) var(--a), var(--b) var(--b), var(--a) var(--b));
//     clip-path: polygon(var(--a) var(--a), var(--b) var(--a), var(--b) var(--b), var(--a) var(--b));
//     // clip-path: polygon(0px 400px, 344px 450px, 0 350px);
//     height: 100%;
//     position: absolute;
//     transform: translate(0, -50%) rotate(90deg) rotate(calc(var(--degrees) * 1deg));
//     transform-origin: 50% 100%;
//     width: 100%;
//     z-index: calc(1 + var(--over50));
//     &:after, &:before {
//       // background: var(--bg, #e74c3c);
//       content: '';
//       height: 100%;
//       position: absolute;
//       width: 100%;
//     }
//     &:before {
//       --degrees: calc((var(--value, 45) / 100) * 360);
//       transform: translate(0, 100%) rotate(calc(var(--degrees) * 1deg));
//       transform-origin: 50% 0%;
//     }
//     &:after {
//       opacity: var(--over50, 0);
//     }
//     // @include random-bgr();
//     @for $i from 1 through 30 {
//       // width: 100px;
//       // transition: opacity 0.25s ease-in, height 0.25s ease-in;    
//       &:nth-child(#{$i}) {
//         // height: 100%;
//         // height: random(200) + px;
//         // background: red;
//         @include random-rgba(background-color);
//       }
//     }
//     &:hover {
//       // opacity: 0.75;
//       border: 1px solid #f00;
//       // background: lighten($color: random-rgba(background-color), $amount: 20);
//     }
//   }
// }

// // END PIE CHART STYLES


// .menu-container {
//   .menu {
//     width: $s-menu;
//     height: $s-menu;
//     position: absolute;
//     left: -$s-menu / 2;
//     top: -$s-menu / 2;
//     -webkit-tap-highlight-color: transparent;
//     background: #fff;
//     border-radius: 50%;
//     box-shadow: 0 0 4px 5px rgba(0, 0, 0, 0.2);
//     cursor: pointer;
//   }
//   .pie {
//     width: 400px;
//     height: 400px;
//     position: absolute;
//     left: -200px;
//     top: -200px;
//     -webkit-tap-highlight-color: transparent;
//     // background: #000;
//     border-radius: 50%;
//     box-shadow: 0 0 4px 5px rgba(0, 0, 0, 0.2);
//     cursor: pointer;
//     transform: translateX(-200px) translateY(-200px);
//     transition: transform 300ms;
//   }
//   .pie-color:hover {
//     opacity: 0.85;
//   }
//   .pie-color:active {
//     opacity: 0.7;
//   }
//   .pie1 {
//     clip-path: polygon(200px 200px, 344px 450px, 0 350px);
//     transition-delay: 30ms;
//   }
//   .pie2 {
//     clip-path: polygon(200px 200px, 344px 450px, 450px 344px);
//     transition-delay: 60ms;
//   }
//   .pie3 {
//     clip-path: polygon(200px 200px, 450px 0, 450px 344px);
//     transition-delay: 90ms;
//   }
//   .pie-color {
//     width: 100%;
//     height: 100%;
//     border-radius: 50%;
//     position: relative;
//     &:after {
//       content: '';
//       width: 24px;
//       height: 24px;
//       position: absolute;
//       // top: calc(50% - 12px);
//       // left: calc(50% - 12px);
//     }
//     &.one {
//       background: linear-gradient(135deg, #f12711, #f5af19);
//       clip-path: polygon(200px 200px, 344px 450px, 0 450px);
//       &:after {
//         background: url('/svg/icons/icon-menu-centered-white.svg') no-repeat;
//         // background: url('/svg/icons/icon-camera-white.svg') no-repeat;
//         background-size: 100%;
//         background-position: center;
//         top: 83%;
//         left: 56%;
//       }
//     }
//     &.two {
//       background: linear-gradient(135deg, #444, #7e84f9);
//       clip-path: polygon(200px 200px, 344px 450px, 450px 344px);
//     }
//     &.thr {
//       background: linear-gradient(135deg, #444, #b7e13f);
//       clip-path: polygon(200px 200px, 450px 0, 450px 344px);
//     }
//   }
//   // .pie-color2 {
//   //   background: linear-gradient(135deg, #444, #7e84f9);
//   //   clip-path: polygon(200px 200px, 344px 450px, 450px 344px);
//   // }
//   // .pie-color3 {
//   //   background: linear-gradient(135deg, #444, #b7e13f);
//   //   clip-path: polygon(200px 200px, 450px 0, 450px 344px);
//   // }
//   .card {
//     left: 216px;
//     position: absolute;
//     top: 300px;
//     width: 46px;
//   }
//   .discount {
//     left: 288px;
//     position: absolute;
//     top: 258px;
//     width: 46px;
//   }
//   .cart {
//     left: 324px;
//     position: absolute;
//     top: 188px;
//     width: 46px;
//   }
//   .hamburger {
//     cursor: pointer;
//     height: 46px;
//     left: 58%;
//     position: relative;
//     top: 58%;
//     width: 46px;
//   }
//   .hamburger path {
//     transition: transform 300ms;
//   }
//   .hamburger path:nth-child(1) {
//     transform-origin: 25% 29%;
//   }
//   .hamburger path:nth-child(2) {
//     transform-origin: 50% 50%;
//   }
//   .hamburger path:nth-child(3) {
//     transform-origin: 75% 72%;
//   }
//   .hamburger path:nth-child(4) {
//     transform-origin: 75% 29%;
//   }
//   .hamburger path:nth-child(5) {
//     transform-origin: 25% 72%;
//   }
//   &.active .pie {
//     transform: translateX(0) translateY(0);
//   }
//   &.active .hamburger path:nth-child(1) {
//     transform: rotate(45deg);
//   }
//   &.active .hamburger path:nth-child(2) {
//     transform: scaleX(0);
//   }
//   &.active .hamburger path:nth-child(3) {
//     transform: rotate(45deg);
//   }
//   &.active .hamburger path:nth-child(4) {
//     transform: rotate(-45deg);
//   }
//   &.active .hamburger path:nth-child(5) {
//     transform: rotate(-45deg);
//   }
//   // Menu container
//   &.top-right {
//     .menu {
//       left: auto;
//       right: -100px;
//     }
//     .pie {
//       left: auto;
//       right: -200px;
//     }
//   }
// }

// </style>
