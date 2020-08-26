<template lang="pug">
  .sideinfo-container
    .blocks.bl
      label.text.grey-it Made by #[a(href='https://www.konradstudio.com' target="_blank") Konrad Studio]
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
    &.bl {
      left: 24px;
      bottom: 24px;
    }
    &.center {
      
    }
  }
}

</style>
