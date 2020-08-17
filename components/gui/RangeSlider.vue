<template lang="pug">
  .gui-wrapper.slider
    form
      //- h2
      //-   | Range slider
      .range
        //- .bg
        .output-labels
          label.name {{ name }}
          label.value {{ sliderVal }}
        input(:name="name" type='range' min='0' max='1' step="0.01" @input="changeVal" v-model="sliderVal")
        //- input(name='range' type='range' min='0' max='0.0002' step="0.00001" @change="changeVal" v-model="sliderVal")
        .range-output
          output.output(name='output' for=sliderVal)
          //- output.output(name='output' for='range')
          //-   | 50
</template>
 
<script>

export default {
  name: 'Slider',
  props: ['name', 'val'],
  data () {
    return {
      sliderVal: this.val
    }
  },
  mounted () {
    // var self = this
    // console.log(vertexShader)
    // self.someFunc()
  },
  methods: {
    changeVal(e) {
      this.$parent.changeVal(e, this.sliderVal)
      // var self = this
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

// $easeOutBack: cubic-bezier(0.175, 0.885, 0.320, 1.275);
// $color-range-output: #383c42;
// $color-input-placeholder: #c3c4c6;
// $height-range-bounds: 22px;
// $background-color-range-thumb: #333940;
// $radius-range-thumb: 100px;
// $height-range-thumb: 24px;
// $width-range-thumb: 24px;
// $size-range-thumb-shadow: 25px;
// $color-range-thumb-shadow: rgba(#000, .5);
// $shadow-offset-y-range-thumb: 4px;
// $shadow-offset-x-range-thumb: 0px;
// $border-width-range-thumb: 6px;
// $border-color-range-thumb: #fff;
// $width-range-track: 100%;
// $height-range-track: 4px;
// $radius-range-track: 100px;
// $fill-range-track: #e6e6e6;
// $fill-range-track-active: #60cd18;

// //Output
// $height-range-output: 60px;
// $min-width-range-output: 32px;
// $padding-x-range-output: 20px;
// $size-range-output-arrow: 10px;
// $offset-y-range-output: 4px;

// .range {
//   .bg {
//     // background: red;
//     background: #808080;
//     width: 100%;
//     height: 2px;
//     position: absolute;
//     top: 12px;
//     left: 0;
//   }
// 	@mixin range-track() {
// 		box-sizing: border-box;
// 		width: $width-range-track;
// 		height: $height-range-track;
// 		// background: $fill-range-track;
// 		border-radius: $radius-range-track;
// 	}
// 	@mixin range-thumb() {
// 		box-sizing: border-box;
// 		box-shadow: $shadow-offset-x-range-thumb $shadow-offset-y-range-thumb $size-range-thumb-shadow $color-range-thumb-shadow;
// 		border: $border-width-range-thumb solid $border-color-range-thumb;
// 		height: $height-range-thumb;
// 		width: $width-range-thumb;
// 		border-radius: $radius-range-thumb;
// 		background: $background-color-range-thumb;
// 		cursor: pointer;
// 	}

// 	position: relative;

// 	//Native
// 	input[type=range] {
// 		appearance: none;
// 		padding: 0;
// 		width: $width-range-track;
// 		height: $height-range-bounds;
// 		cursor: pointer;
// 		display: block;
//     background: none;
//     position: relative;
//     // &:after {
//     //   content: '';
//     //   background: red;
//     //   position: absolute;
//     //   top: 10px;
//     //   width: 100%;
//     //   height: 2px;
//     // }
// 		&:focus {
// 			outline: none;
// 		}
// 		&[disabled] {
// 			opacity: .3;
// 			cursor: default;
// 		}
// 	}

// 	//Plugin wrapper
// 	.rangeslider {
// 		position: relative;
// 		height: $height-range-bounds;
// 		cursor: pointer;
// 		user-select: none;
// 	}

// 	//Track
// 	.rangeslider:before {
// 		@include range-track();
// 		content: "";
// 		position: absolute;
// 		top: 50%;
// 		transform: translateY(-50%);
// 	}
// 	input::-webkit-slider-runnable-track, {
// 		@include range-track();
// 		margin: $height-range-bounds / 2 0;
// 	}
// 	input::-moz-range-track {
// 		@include range-track();
// 		margin: $height-range-bounds / 2 0;
// 	}
// 	input::-ms-track {
// 		@include range-track();
// 		color: transparent;
// 		padding: $height-range-bounds / 2 0;
// 		background: transparent;
// 		border-color: transparent;
// 	}

// 	//Track fill
// 	input::-ms-fill-lower,
// 	input::-ms-fill-upper {
// 		@include range-track();
// 	}
// 	input::-ms-fill-lower {
// 		background: $fill-range-track-active;
// 	}
// 	.rangeslider-fill-lower {
// 		background-color: $fill-range-track-active;
// 		border-radius: $radius-range-track;
// 		position: absolute;
// 		top: 50%;
// 		transform: translateY(-50%);
// 		height: $height-range-track;
// 		will-change: width;
// 	}

// 	//Thumb
// 	input::-webkit-slider-thumb {
// 		@include range-thumb();
// 		appearance: none;
// 		transform: translateY(-50%);
// 		margin-top: $height-range-track / 2;
//     // z-index: inherit;
// 	}
// 	input::-moz-range-thumb {
// 		@include range-thumb();
// 	}
// 	input::-ms-thumb {
// 		@include range-thumb();
// 	}
// 	.rangeslider-thumb {
// 		@include range-thumb();
// 		position: absolute;
// 		touch-action: pan-x;
// 		top: 50%;
// 		transform: translateY(-50%);
// 		will-change: left;
// 	}
// 	.range-output {
// 		position: absolute;
// 		left: ($width-range-thumb - $border-width-range-thumb * 2) / 2;
// 		top: ($width-range-thumb - $border-width-range-thumb * 2) / 2;
// 		transform-origin: 0 0;
// 		transition: transform .4s $easeOutBack;
// 		user-select: none;
//     width: 100%;
//     display: flex;
//     justify-content: flex-end;
//     .output {
//       color: #f5f5f5;
//       margin-top: -24px;
//       margin-right: 4px;
//       font-size: 10px;
//     }
// 		// .output {
// 		// 	display: block;
// 		// 	position: absolute;
// 		// 	height: $height-range-output;
// 		// 	line-height: $height-range-output;
// 		// 	min-width: $min-width-range-output;
// 		// 	padding: 0 $padding-x-range-output;
// 		// 	top: - ($width-range-thumb / 2) - $offset-y-range-output - $size-range-output-arrow;
// 		// 	transform: translate(-50%, -100%);
// 		// 	background: $color-range-output;
// 		// 	color: #fff;
// 		// 	border-radius: 100px;
// 		// 	white-space: nowrap;
// 		// 	font-weight: bold;
// 		// 	font-size: 1.2em;
// 		// 	text-align: center;

// 		// 	&:before {
// 		// 		content: "";
// 		// 		position: absolute;
// 		// 		bottom: - $size-range-output-arrow + 2px; //Subtract 2 to get slight overlap that renders more nicely
// 		// 		left: 50%;
// 		// 		border: $size-range-output-arrow solid $color-range-output;
// 		// 		border-bottom: none;
// 		// 		border-left-color: transparent;
// 		// 		border-right-color: transparent;
// 		// 		transform: translateX(-50%);
// 		// 	}
// 		// }
// 	}
// }

// //Demo stuff
// // main {
// //   display: flex;
// //   height: 100vh;
// //   justify-content: center;
// //   align-items: center;
// //   color: #333;
// // }

// // form {
// //   max-width: 500px;
// //   min-width: 320px;
// // }

// // h2 {
// //   font-weight: 300;
// //   text-align: center;
// //   margin-bottom: 30px;
// // }

</style>
