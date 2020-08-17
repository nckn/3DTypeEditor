<template lang="pug">
  .outer-container-popover
    .inner-container-popover
      //- .popup-shipping-info(ref="popup_info" v-if="$store.getters['globals/getCovidInfo']")
      .popup-shipping-info(ref="popup_info")
        .popup-triangle
        //- button.btn.popup-close-btn(@click="hideShowPopupInfo")
        p.title.bodytext.white-it Title
        p.details.grey-it Details
        //- button.btn.full-w(@click="hideShowPopupInfo") Okay
</template>

<script>

// import { mapGetters } from 'vuex'

export default {
  name: 'Popover',
  props: ['canShow', 'coords'],
  data () {
    return {
      // showPopupInfo: true
    }
  },
  watch: { 
    canShow: function(newVal, oldVal) { // watch it
      // console.log('Prop changed: ', newVal, ' | was: ', oldVal)
      // console.log('getting change')
      if (newVal === true) {
        // console.log('show it')
        // console.log(this.coords.x)
        this.showPopupInfo()
        this.placePopover()
      } else if (newVal === false) {
        // console.log('hide it')
        this.hideShowPopupInfo()
        // console.log('tween layout 1')
      }
    },
    coords: function(newVal, oldVal) {
      this.placePopover()
    }
  },
  mounted: function () {
    var self = this
    // Popup info
    // Make it visible
    // setTimeout(() => {
    //   if (self.$refs.popup_info) {
    //     self.$refs.popup_info.classList.add('fadedin')
    //     self.$refs.popup_info.classList.add('ispresent')
    //   }
    // }, 1000)
  },
  methods: {
    placePopover () {
      var self = this
      var offsetX = (self.$refs.popup_info.offsetWidth / 2)
      var offsetY = (self.$refs.popup_info.offsetHeight / 1)
      var bufferY = 20
      var parent = document.querySelector('.inner-container-popover')
      var parentOffsetX = parent.offsetLeft
      
      self.$refs.popup_info.style.left = `${self.coords.x - offsetX - parentOffsetX}px`
      self.$refs.popup_info.style.top = `${self.coords.y - offsetY - bufferY}px`
      self.$refs.popup_info.style.right = 'auto'

      console.log('parent: ', parent.offsetLeft)
    },
    showPopupInfo () {
      var self = this
      setTimeout(() => {
        if (self.$refs.popup_info) {
          self.$refs.popup_info.classList.add('fadedin')
          self.$refs.popup_info.classList.add('ispresent')
        }
      }, 500)
    },
    hideShowPopupInfo () {
      var self = this
      if (self.$refs.popup_info) {
        self.$refs.popup_info.classList.remove('fadedin')
        setTimeout(() => {
          self.$refs.popup_info.classList.remove('ispresent')
          // Update the global variable
          // self.$store.dispatch('globals/updateCovidInfo', false)
        }, 500)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

// .outer-container-popover { background: rgba(200,200,0,0.2); }
// .inner-container-popover { background: rgba(200,0,200,0.2); }

$offset-popup: 24px;
$width-popup-md: 320px;

$breakp-xs: 480px;
$breakp-sm: 576px;
$breakp-md: 768px;
$breakp-lg: 992px;
$breakp-xl: 1200px;
$breakp-xxl: 1600px;

$max-uni-width: 1050px;

$bgcolor-tooltip-grey: #303030;

@mixin dropShadow($third, $alpha) {
  -webkit-box-shadow: 0px 3px $third -2px rgba(0,0,0,$alpha);
  -moz-box-shadow: 0px 3px $third -2px rgba(0,0,0,$alpha);
  box-shadow: 0px 3px $third -2px rgba(0,0,0,$alpha);
}

// Popup triangle
.popup-triangle {
  display: block;
  height: 12px;
  width: 12px;
  background-color: $bgcolor-tooltip-grey;
  border: inherit;
  position: absolute;
  -webkit-clip-path: polygon(0% 0%, 100% 100%, 0% 100%);
  clip-path: polygon(0% 0%, 100% 100%, 0% 100%);
  // transform: rotate(135deg);
  transform: rotate(-45deg);
  border-radius: 0 0 0 2px;
  left: calc(50% - 6px);
  bottom: -6px;
  // top: -6px;
  // left: 48px;
  // @media screen and (min-width: $breakp-md) {
  //   left: auto;
  //   right: 72px;
  // }
}

.outer-container-popover {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 12;
  .inner-container-popover {
    width: 100%;
    height: 100%;
    pointer-events: none;
    max-width: $max-uni-width;
    position: relative;
  }
}

$anim-time: 0.2s;

.popup-shipping-info {
  width: 100px;
  position: absolute;
  // top: 64px;
  // right: 4px;
  padding: 24px;
  background: $bgcolor-tooltip-grey;
  opacity: 0;
  visibility: hidden;
  border-radius: 2px;
  @include dropShadow(4px, 0.5);
  // transition: all 0.4s ease-in;
  transition: scale $anim-time ease-in, opacity $anim-time ease-in-out;
  pointer-events: all;
  &.ispresent {
    transform: scale(0);
    visibility: visible;
  }
  &.fadedin {
    transform: scale(1);
    // visibility: visible;
    opacity: 1;
    // @include transition(opacity $transition-time);
  }
  @media screen and (min-width: $breakp-md) {
    max-width: $width-popup-md;
  }
  // Make sure to offset popup when beyond max-width
  @media screen and (min-width: ($max-uni-width + 60px)) {
    right: -$offset-popup;
  }
  &:hover {

  }
  .popup-close-btn {
    width: 24px !important;
    height: 24px !important;
    position: absolute;
    top: 12px;
    right: 12px;
    background: url('/svg/icons/icon-close.svg') no-repeat;
    background-size: contain;
    background-position: center;
    &:hover {
      // @include scale(1.1);
    }
  }
  .popup-okay-btn {
    margin-top: 12px;
  }
  .popup-triangle {
    display: none;
    @media screen and (min-width: ($max-uni-width + 150px)) {
      right: 98px;
      display: block;
    }
  }
  p {
    font-size: 12px;
    // margin-top: 12px;
    margin-top: 0;
    margin-bottom: 0;
    &.title {
      margin-bottom: 6px;
    }
    &.details {
      margin-bottom: 12px;
    }
  }
}

</style>
