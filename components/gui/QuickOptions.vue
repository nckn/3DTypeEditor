<template lang="pug">
  .bloom-master-container(ref="quick_container" v-bind:class="type") 
    //- LongPress 
</template>

<script>
import globalFunctions from "@/mixins/globalFunctions.js";
// import { radians, map, distance } from '@/assets/js/helpers'
import BloomingMenu from "@/assets/js/misc/blooming-menu";
import LongPress from "@/assets/js/misc/longpress";
// import LongPress from '@/components/scripts/LongPress'

// Based on
// https://codepen.io/ainalem/pen/YoyZpq

export default {
  name: 'MenuOptions',
  props: ['type', 'options'],
  mixins: [globalFunctions],
  components: {
    //
  },
  data() {
    return {
      menuContainer: null,
      bloomingMenu: null,
      isSmall: null
    };
  },
  mounted() {
    var self = this;
    // Set menu container
    self.menuContainer = self.$refs.quick_container;
    setTimeout(() => {
      self.init()
    }, 1000);
    // console.log('script: ', BloomingMenu);
    // console.log('script: ', LongPress);

    self.isSmall = self.ifSmall()

    self.isTouch = (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0))
    self.mouseDown = self.isTouch ? 'touchstart' : 'mousedown'
    self.mouseUp = self.isTouch ? 'touchend' : 'mouseup'
    self.mouseMove = self.isTouch ? 'touchmove' : 'mousemove'
    //

    // Listen for Open event
    window.addEventListener('long-press', this.displayData)

    // Listen for Close event
    window.addEventListener('close-menu', () => {
      // alert('being closed')
      // console.log('being closed')
    })
  },
  methods: {
    init() {
      var self = this;
      window.addEventListener('resize', self.onWindowResize(), false);
      self.bloomingMenu = new BloomingMenu({
        startAngle: 0,
        endAngle: 315,
        // endAngle: 180,
        radius: self.isSmall ? 56 : 80,
        itemsNum: self.options.length,
        // elements:
      });
      self.bloomingMenu.render()
      // Attach functions to the bloom menu
      self.bloomingMenu.props.elements.items.forEach(function (item, index) {
        // Assign icons
        // console.log('Item is:')
        // console.log(item)
        var opt = self.options[index]
        item.style.backgroundImage = `url(${opt.path})`
        item.style.backgroundSize = 'cover'
        item.style.backgroundPosition = 'center'
        // item.style.backgroundImage = `url(../../../public/svg/icons/icon-camera-front.svg)`
        item.addEventListener('click', function (e) {
          console.log('Item #' + index + 'was clicked')
          var target = e.target || e.srcElement
          var name = target.getAttribute('name')
          // console.log('target: ', target)
          var obj = {target: target, name: opt.name}
          self.$parent.clickedCommandInChild(obj)
        })
      })

      // Prevents "elastic scrolling" on Safari
      document.addEventListener('touchmove', function(event) {
        'use strict';
        event.preventDefault();
      });
    },
    displayData: function(e) {
      var self = this
      var pos = {x: e.detail.clientX, y: e.detail.clientY}
      var target = e.target || e.srcElement
      // console.log('target: ', target.tagName)

      // Make sure that it is a canvas that is being clicked
      if (target.tagName !== 'CANVAS') {
        return
      }
      
      // console.log('BloomingMenu: ', BloomingMenu)
      self.bloomingMenu.open()
      // Long press happened
      var menuElem = document.getElementsByClassName('blooming-menu__container')[0]
      if (menuElem) {
        menuElem.classList.add('visible')
        menuElem.style.left = pos.x + 'px'
        menuElem.style.top = pos.y + 'px'
      }
      e.stopImmediatePropagation()
      e.preventDefault()
      e.stopPropagation()
    },
    // rndmColor () {
    //   return this.randomColor()
    // },
    toggleMenu(e) {
      var self = this;
      var childTarget = e.target || e.srcElement;
      var target = childTarget.parentNode;
      var name = target.getAttribute('name');
      var t = { src: target, name: name };
      // console.log('clicked: ', target);
      // console.log('name: ', name);
      self.$parent.optionSelected(t);
      // switch ( name ) {
      //   case 'toogle-cam': // Q
      //     self.control.setSpace( self.control.space === 'local' ? 'world' : 'local' )
      //     break
      // Toggle active class
      self.menuContainer.classList.toggle('active');
    },
    onWindowResize() {
      var self = this;
      // Do something here
    },
    hoverOption(e) {
      var self = this;
      var target = e.target || e.srcElement;
      // target.style.opacity = 0.5
    },
  }
};
</script>

<style lang="scss">

$s-menu: 100px;

// Bloom styling
$menu-color-1: #333333;

.blooming-menu__container {
  visibility: hidden;
  transition: all 0.25s ease-in;
  &.visible {
    visibility: visible;
  }
  .blooming-menu__main {
    background-color: $menu-color-1;
    transition: all 0.25s ease-in;
    display: flex;
    align-items: center;
    justify-content: center;
    transform-origin: center;
    &.is-active {

    }
    &:hover {
      transform: scale(1.05) rotate(90deg);
    }
  }
  .blooming-menu__items {
    .blooming-menu__item {
      background-repeat: no-repeat !important;
      background-size: 24px !important;
      background: $menu-color-1;
      transition: all 0.25s ease-in;
      &:hover {
        filter: brightness(115%);
      }
      .blooming-menu__item-btn-wrapper {
        background: none;
      }
    }
  }
}


.bloom-master-container {
  width: $s-menu;
  height: $s-menu;
  position: absolute;
  top: calc(50% - #{$s-menu / 2});
  left: calc(50% - #{$s-menu / 2});
  pointer-events: none;
  // background: rgba(255,0,0,0.25);
  // visibility: hidden;
  // &.visible {
  //   visibility: visible;
  // }
}

.blooming-menu__item-btn {
  transition: box-shadow 0.28s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.28s cubic-bezier(0.4, 0, 0.2, 1);
  background-size: 50%;
  background-position: center center;
  background-repeat: no-repeat;
  opacity: 0.8;
}

// .blooming-menu__item:nth-of-type(1) .blooming-menu__item-btn {
//   background-image: url(img/language.svg);
// }

// .blooming-menu__item:nth-of-type(2) .blooming-menu__item-btn {
//   background-image: url(img/accessibility.svg);
// }

// .blooming-menu__item:nth-of-type(3) .blooming-menu__item-btn {
//   background-image: url(img/favorite.svg);
// }

// .blooming-menu__item:nth-of-type(4) .blooming-menu__item-btn {
//   background-image: url(img/find-in-page.svg);
//   background-size: 40%;
// }

// .blooming-menu__item:nth-of-type(5) .blooming-menu__item-btn {
//   background-image: url(img/get-app.svg);
//   background-size: 35%;
// }

// .blooming-menu__item:nth-of-type(6) .blooming-menu__item-btn {
//   background-image: url(img/grade.svg);
// }

// .blooming-menu__item:nth-of-type(7) .blooming-menu__item-btn {
//   background-image: url(img/home.svg);
// }

// .blooming-menu__item:nth-of-type(8) .blooming-menu__item-btn {
//   background-image: url(img/lock.svg);
//   background-size: 35%;
// }

.blooming-menu__item-btn:hover {
  box-shadow: 0 8px 17px 0 rgba(0, 0, 0, 0.2);
  opacity: 1;
}

</style>
