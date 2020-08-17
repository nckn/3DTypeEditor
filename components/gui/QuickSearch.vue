<template lang="pug">
  .search-container#dragContainer(ref="quick_search" v-bind:class="[type, { enabled: settings.enabled } ]")
    .search-wrapper
      input.sb-search-input#search(type='text' v-model='keyword' placeholder='Search Title...' @input="blockOthers" name="search")
      //- #sb-search.sb-search
      //-   form
      //-     input.sb-search-input#search(type='text' v-model='keyword' placeholder='Search Title...' @input="blockOthers" name="search")
      //-     input.sb-search-submit(type="submit" value="")
      //-     span.sb-icon-search
      label Search Title
    .wrapper(v-if="settings")
      .card(v-for='post in filteredList' @click="commandClicked" :name="`${post.name}`")
        .btn.icon.camera-trigger
        p.text {{ post.name }}
        label.text(v-if="post.shortcut") {{ post.shortcut }}
</template>

<script>

import globalFunctions from "@/mixins/globalFunctions.js";
import UISearch from "@/assets/js/misc/uisearch";
// import { radians, map, distance } from '@/assets/js/helpers'
// import BloomingMenu from "@/assets/js/misc/blooming-menu";
// import LongPress from "@/assets/js/misc/longpress";
// import LongPress from '@/components/scripts/LongPress'

// Based on
// https://codepen.io/ainalem/pen/YoyZpq

class Post {
  constructor(title, link, author, img) {
    this.title = title;
    this.link = link;
    this.author = author;
    this.img = img;
  }
}

export default {
  name: 'QuickSearch',
  props: ['type', 'settings', 'options'],
  mixins: [globalFunctions],
  components: {
    //
  },
  data() {
    return {
      keyword: '',
      searchItems: [],
      postList: [
        new Post(
          'Vue.js', 
          'https://vuejs.org/', 
          'Chris', 
          'https://vuejs.org//images/logo.png'
        ),
        new Post(
          'React.js', 
          'https://facebook.github.io/react/', 
          'Tim',
          'http://daynin.github.io/clojurescript-presentation/img/react-logo.png'
        )
      ],
      cSpecs: {
        w: 0,
        h: 0
      },
      mousePos: {x: 0, y: 0},
      cOffset: null,
      div: null,
      isDown: false
    }
  },
  async mounted() {
    var self = this
    // Get searchable commands from parent
    self.searchItems = self.settings

    // console.log('settings: ', this.settings)
    
    // Set menu container
    self.cont = self.$refs.quick_search

    // Quick menu related - start
    self.isTouch = (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0))
    self.mouseDown = self.isTouch ? 'touchstart' : 'mousedown'
    self.mouseUp = self.isTouch ? 'touchend' : 'mouseup'
    self.mouseMove = self.isTouch ? 'touchmove' : 'mousemove'

    self.cont.addEventListener(self.mouseDown, function(e) {
      self.isDown = true
      var clientX = self.isTouch ? e.touches[0].clientX : e.clientX
      var clientY = self.isTouch ? e.touches[0].clientY : e.clientY
      self.cOffset = [
        self.cont.offsetLeft - clientX,
        self.cont.offsetTop - clientY
      ];
    }, true)

    document.addEventListener(self.mouseUp, function() {
      self.isDown = false
    }, true)

    document.addEventListener(self.mouseMove, function(e) {
      // e.preventDefault()
      if (self.isDown) {
          self.mousePos = {
            x : self.isTouch ? e.touches[0].clientX : e.clientX,
            y : self.isTouch ? e.touches[0].clientY : e.clientY
          }
          self.cont.style.left = (self.mousePos.x + self.cOffset[0]) + 'px'
          self.cont.style.top  = (self.mousePos.y + self.cOffset[1]) + 'px'
      }
    }, true)
    
    // Get attributes
    // self.getSpecs()
    // console.log('specs w offset: ', self.cSpecs.wOffset)
    // console.log('specs w: ', self.cSpecs.h)

    self.$nextTick(
      self.init(),
      // self.dragElement(self.cont),
      // self.$nextTick(self.dragElement(document.getElementById('dragContainer')))
    )
    // console.log('script: ', BloomingMenu);
    // console.log('script: ', LongPress);
    console.log('UISearch script: ', UISearch);

    self.isSmall = self.ifSmall()

    self.isTouch = (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0))
    self.mouseDown = self.isTouch ? 'touchstart' : 'mousedown'
    self.mouseUp = self.isTouch ? 'touchend' : 'mouseup'
    self.mouseMove = self.isTouch ? 'touchmove' : 'mousemove'
    //

    // Listen for Open event
    // window.addEventListener('long-press', this.displayData)

    // Listen for Close event
    // window.addEventListener('close-menu', () => {
    //   // alert('being closed')
    //   // console.log('being closed')
    // })
  },
  computed: {
    filteredList() {
      // return this.postList.filter((item) => {
      //   return item.title.toLowerCase().includes(this.keyword.toLowerCase());
      // });
      return this.options.filter((item) => {
        return item.name.toLowerCase().includes(this.keyword.toLowerCase());
      });
    }
  },
  methods: {
    getSpecs() {
      var self = this
      self.cSpecs = {
        w: self.cont.offsetWidth,
        h: self.cont.offsetHeight,
        xOffset: self.cont.offsetLeft,
        yOffset: self.cont.offsetTop,
      }
    },
    commandClicked(e) {
      var self = this
      var target = e.target || e.srcElement
      var name = target.getAttribute('name')
      // console.log('target: ', target)
      var obj = {target: target, name: name}
      self.$parent.clickedCommandInChild(obj)
    },
    init() {
      var self = this
      window.addEventListener('resize', self.onWindowResize(), false)
    },
    blockOthers (e) {
      var self = this

      var key
      var target = event.target || event.srcElement
      var isSpecialKey
      if (window.event) {
        key = window.event.keyCode
        // isSpecialKey = !!window.event.altKey // typecast to boolean
      } else {
        key = ev.which
        // isSpecialKey = !!ev.altKey
      }
      // Global keys
      switch ( key ) {
        case 27: // Escape key
          alert(something)
          break
      }
      // e.preventDefault()
    },
    toggleOnOff () {
      this.onOff = !this.onOff
    },
    // rndmColor () {
    //   return this.randomColor()
    // },
    onWindowResize() {
      var self = this;
      // Do something here
    },
    hoverOption(e) {
      var self = this;
      var target = e.target || e.srcElement;
      // target.style.opacity = 0.5
    }
  }
};
</script>

<style lang="scss">

$s-menu: 300px;

// Bloom styling
$menu-color-1: #333333;

@mixin dropShadow() {
  -webkit-box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.25);
  -moz-box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.25);
  box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.25);
}

.search-container {
  width: $s-menu;
  height: auto;
  position: absolute;
  // position: fixed;
  // top: 0;
  top: calc(50% - #{$s-menu / 2});
  left: calc(50% - #{$s-menu / 2});
  // pointer-events: none;
  visibility: hidden;
  transition: opacity 0.25s ease-in;
  background: $menu-color-1;
  display: flex;
  align-items: stretch;
  justify-content: center;
  flex-direction: column;
  @include dropShadow();
  opacity: 0;
  border-radius: 2px;
  padding: 2px;
  &.enabled {
    visibility: visible;
    opacity: 1;
  } 
  .wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    max-width: 444px;
    // flex-wrap: wrap;
    // padding-top: 12px;
    max-height: 300px;
    overflow-y: scroll;
    .card {
      width: 100%;
      height: 24px;
      // box-shadow: rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px;
      // max-width: 124px;
      // margin: 12px;
      transition: .15s all ease-in-out;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      background: lighten($color: $menu-color-1, $amount: 10);
      &:hover {
        background: lighten($color: $menu-color-1, $amount: 20);
        // transform: scale(1.1);
      }
      .btn.icon {
        //
      }
      .text.cmd {
        width: calc(100% - 24px);
      }
    }
  }
  .hotpink {
    background: hotpink;
  }
  .green {
    background: green;
  }
  .box {
    width: 100px;
    height: 100px;
    border: 1px solid rgba(0,0,0,.12);
  }
}

$bg-search: #1d1d1d;
$br-search: 2px;
$cl-placeholder: #a0a0a0;

.search-wrapper {
  position: relative;
  label {
    position: absolute;
    font-size: 12px;
    color: rgba(255, 0, 0, 0.5);
    top: 8px;
    left: 12px;
    z-index: -1;
    transition: .15s all ease-in-out;
  }
  .sb-search-input {
    width: 100%;
    height: 32px;
    margin: 0;
    z-index: 10;
    padding: 4px 64px 2px 6px;
    color: #f5f5f5;
    border: none;
    outline: none;
    background: $bg-search;
    font-family: inherit;
    border-radius: $br-search;
    // position: absolute;
    // top: 0;
    // right: 0;
    transition: .15s all ease-in-out;
    box-sizing: border-box;
    &:focus {
      outline: none;
      // transform: scale(1.05);
      & + label  {
        font-size: 10px;
        transform: translateY(-24px) translateX(-12px);
      }
    }
    &::-webkit-input-placeholder {
      font-size: 12px;
      color: $cl-placeholder;
      font-weight: 100;
    }
  }
}

.sb-search-input::-webkit-input-placeholder {
	color: $cl-placeholder;
}

.sb-search-input:-moz-placeholder {
	color: $cl-placeholder;
}

.sb-search-input::-moz-placeholder {
	color: $cl-placeholder;
}

.sb-search-input:-ms-input-placeholder {
	color: $cl-placeholder;
}

.sb-icon-search,
.sb-search-submit  {
	width: 60px;
	height: 60px;
	display: block;
	position: absolute;
	right: 0;
	top: 0;
	padding: 0;
	margin: 0;
	line-height: 60px;
	text-align: center;
	cursor: pointer;
}

// .sb-search-submit {
// 	background: #fff; /* IE needs this */
// 	-ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)"; /* IE 8 */
//     filter: alpha(opacity=0); /* IE 5-7 */
//     opacity: 0;
// 	color: transparent;
// 	border: none;
// 	outline: none;
// 	z-index: -1;
// }

.sb-icon-search {
	color: #fff;
	background: #e67e22;
	z-index: 90;
	font-size: 22px;
	// font-family: 'icomoon';
	// speak: none;
	// font-style: normal;
	// font-weight: normal;
	// font-variant: normal;
	// text-transform: none;
	-webkit-font-smoothing: antialiased;
}

.sb-icon-search:before {
	content: "\e000";
}

/* Open state */
.sb-search.sb-search-open,
.no-js .sb-search {
	width: 100%;
}

.sb-search.sb-search-open .sb-icon-search,
.no-js .sb-search .sb-icon-search {
	background: #da6d0d;
	color: #fff;
	z-index: 11;
}

.sb-search.sb-search-open .sb-search-submit,
.no-js .sb-search .sb-search-submit {
	z-index: 90;
}

// .blooming-menu__item-btn {
//   transition: box-shadow 0.28s cubic-bezier(0.4, 0, 0.2, 1),
//     opacity 0.28s cubic-bezier(0.4, 0, 0.2, 1);
//   background-size: 50%;
//   background-position: center center;
//   background-repeat: no-repeat;
//   opacity: 0.8;
// }

// .blooming-menu__item-btn:hover {
//   box-shadow: 0 8px 17px 0 rgba(0, 0, 0, 0.2);
//   opacity: 1;
// }

</style>
