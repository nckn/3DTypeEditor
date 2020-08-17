<template lang="pug">
  .wrapper
    .trigger(v-if="event === 'click'" @click="triggerMenu" name="settings-trigger")
    .trigger(v-else-if="event === 'hover'" @mouseenter="triggerMenu" name="settings-trigger")
    //- .trigger(v-on:${event}="triggerMenu" name="settings-trigger")
    .controls(ref="controls_master" v-bind:class="{ expanded: revealMenu }")
      //- .trigger.mini(@click="triggerMenu" name="settings-trigger")
      p.text Settings
      .row(v-for="(row, index) in settings" :key="`r-${index}`")
        .checkbox-group(v-for="(ch, index) in row.checkbox" :key="`ch-${index}`")
          input.styled-checkbox(:id="`ch-${index}`" type="checkbox" :checked="ch.checked" :name='ch.name' @change="changeVal($event)")
          //- input.styled-checkbox(type="checkbox" :name='ch.name' value="0" @change="changeVal($event)")
          label.text(:for="`ch-${index}`") {{ ch.name }}
        .slider-group(v-for="(sl, index) in row.sliders" :key="`sl-${index}`")
          .labels
            label.text {{ sl.name }}
            label.text {{ sl.value }}
          input.slider(
            :name='sl.name'
            type='range'
            :min="sl.min ? sl.min : 0"
            :max="sl.max ? sl.max : 1"
            :step="sl.step ? sl.step : 0.01"
            @input="changeVal"
            v-model="sl.value"
          )
        //- A step slider such as the font picker
        .slider-group(v-for="(sl, index) in row.stepsliders" :key="`stsl-${index}`")
          .labels
            p.text {{ sl.name }}
            //- label.text {{ sl.value }}
            label.text {{ sl.types[sl.value].name }}
          .labels
            //- label.text.step-slider-label(v-for="(f, index) in sl.types" v-bind:class="f") {{ index }}
            .step-slider-label(v-for="(f, index) in sl.types" v-bind:class="f.name")
            //- label.text {{ sl.value }}
          input.slider(
            :name='sl.name'
            type='range'
            :min="sl.min ? sl.min : 0"
            :max="sl.max ? sl.max : 1"
            :step="sl.step ? sl.step : 0.01"
            @input="changeVal"
            v-model="sl.value"
          )
          //- input(name='range' type='range' min='0' max='0.0002' step="0.00001" @change="changeVal" v-model="sliderVal")
            output.output(name='output' for='range')
            //- output.output(name='output' for='range')
            //-   | 50
</template>
 
<script>

export default {
  name: 'Controls',
  props: ['settings', 'event', 'revealed', 'class_name'],
  data () {
    return {
      sliderVal: 0,
      revealMenu: this.revealed,
      pickedFont: ''
    }
  },
  mounted () {
    var self = this
    self.controlsMaster = self.$refs.controls_master
    // self.controlsMaster.classList.add('expanded')
    // console.log(vertexShader)
    // self.someFunc()
  },
  methods: {
    changeVal(e) {
      var self = this
      var target = e.target || e.srcElement
      var name = target.getAttribute('name')
      var type = target.getAttribute('type')
      var ob = {name: name, value: target.value}
      // Check if checkbox
      console.log('receiving ', name)
      console.log('parent ', self.$parent)
      console.log('ob ', ob)
      if (type === 'checkbox') {
        console.log('is checkbox')
      }
      self.$parent.changeVal(ob)
      // var self = this
    },
    triggerMenu(e) {
      var self = this
      var target = e.target || e.srcElement
      var name = target.getAttribute('name')

      console.log(e)

      if (name === 'settings-trigger') {
        self.revealMenu = !self.revealMenu
      }
    }
  }
}
</script>

<style lang="scss">

$breakp-xs: 480px;
$breakp-sm: 576px;
$breakp-md: 768px;
$breakp-lg: 992px;
$breakp-xl: 1200px;
$breakp-xxl: 1600px;

$padding-sm: 8px;
$padding-lg: 12px;

$h-slider-bg: 4px;
$s-thumb: 12px;

@mixin thumbStyle() {
  -webkit-appearance: none;
  appearance: none;
  width: $s-thumb;
  height: $s-thumb;
  background: rgb(99, 99, 99);
  border-radius: $s-thumb / 2;
  cursor: pointer;
}

@mixin setBackground($path) {
  background: url($path) no-repeat;
  background-size: cover;
  background-position: center;
}

.wrapper {
  position: absolute;
  // top: 64px;
  top: 2px;
  width: auto;
  height: auto;
  right: 2px;
}

.step-slider-label {
  width: 16px;
  height: 16px;
  &.easeInOut {
    @include setBackground('/svg/easetype/icon-easetype-easeinout.svg');
  }
  &.expoOut {
    @include setBackground('/svg/easetype/icon-easetype-expoeaseout.svg');
  }
  &.backOut {
    @include setBackground('/svg/easetype/icon-easetype-backeaseout.svg');
  }
  &.Elastic {
    @include setBackground('/svg/easetype/icon-easetype-elasticeaseout.svg');
  }
}

.trigger {
  width: 24px;
  height: 24px;
  background: url(/svg/icon-settings-white.svg) no-repeat;
  background-size: cover;
  background-position: center;
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
  border-radius: 2px;
  transition: all 0.35s ease-in;
  cursor: pointer;
  &:hover {
    background: rgba(40,40,40,1) url(/svg/icon-settings-white.svg) no-repeat;
  }
}

$s-ctls: 200px;

.controls {
  width: $s-ctls;
  transform: translateX($s-ctls);
  // width: 100%;
  height: auto;
  // height: 200px;
  position: absolute;
  top: 2px;
  // top: 48px;
  right: 2px;
  padding: $padding-lg;
  background: #232323; // #111
  border-radius: 2px;
  z-index: 1;
  pointer-events: all;
  padding-top: 2px;
  padding-bottom: 4px;
  // display: flex;
  // align-items: center;
  visibility: hidden;
  transition: all 0.25s ease-out;
  &.expanded {
    width: 200px;
    visibility: visible;
    transform: translateX(0);
  }
  .trigger.mini {
    // top: 2px;
    // right: 2px;
    // width: 12px;
    // height: 12px;
  }
  .row {
    margin-top: 12px;
    // margin-bottom: 12px;
    .checkbox-group {
      // margin-top: 24px;
      margin-top: 16px;
      display: flex;
      align-items: flex-start;
    }
    .slider-group {
      margin-bottom: 12px;
      * {
        transition: opacity 0.25s ease-out;
        opacity: 0.75;
      }
      &:hover {
        * {
          opacity: 1;
        }
      }
    }
  }
  .labels {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .slider {
    -webkit-appearance: none;
    width: 100%;
    height: $h-slider-bg;
    background: #303030;
    outline: none;
    opacity: 0.7;
    -webkit-transition: .2s;
    transition: opacity .2s;
    display: block;
    margin-top: 6px;
    margin-left: 0;
  }

  .slider:hover {
    opacity: 1;
  }

  .slider::-webkit-slider-thumb {
    @include thumbStyle();
  }

  .slider::-moz-range-thumb {
    @include thumbStyle();
  }
}

@media screen and (max-width: $breakp-md) {
  // .trigger {
  //   top: auto;
  //   bottom: 80px;
  // }
  .controls {
    // top: auto;
    // bottom: 80px;
    // right: 0;
    padding: $padding-sm;
    padding-bottom: 0;
    padding-top: 0;
    &.expanded {
      width: 120px;
    }
    .row {
      margin-top: 6px;
      // margin-bottom: 12px;
      .checkbox-group {
        margin-top: 12px;
        margin-bottom: 6px;
      }
      .slider-group {
        // margin-top: 6px;
        margin-bottom: 12px;
      }
    }
  }
}

</style>
