<template lang="pug">
  .sideinfo-container
    .blocks.tl
      label.text 3D Type Editor
    .blocks.bl
      label.text.grey-it.small-it Made by #[a(href='https://www.konradstudio.com' target="_blank") Konrad Studio]
</template>

<script>

export default {
  name: 'PageInfo',
  components: {
    //
  },
  data () {
    return {
      //
    }
  },
  mounted() {
    //
  },
  methods: {
    someFunc() {

    }
  }
};
</script>

<style lang="scss" scoped>

// .sideinfo-container { background: red; }

$breakp-xs: 480px;
$breakp-sm: 576px;
$breakp-md: 768px;
$breakp-lg: 992px;
$breakp-xl: 1200px;
$breakp-xxl: 1600px;

$uni-margin: 16px;

.sideinfo-container {
  width: 100%; 
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  .blocks {
    position: absolute;
    a {
      pointer-events: all;
    }
    &.tl {
      left: $uni-margin;
      top: $uni-margin;
    }
    &.bl {
      left: $uni-margin;
      bottom: $uni-margin;
      @media screen and (max-width: $breakp-md) {
        bottom: 64px;
      }
    }
    &.center {
      
    }
  }
}

</style>
