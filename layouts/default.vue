<template lang="pug">
  div.master-container
    //- Header
    //- SidebarLinks
    nuxt
</template>

<script>

import Header from '~/components/Header'
import SidebarLinks from '~/components/SidebarLinks'

export default {
  components: {
    Header,
    SidebarLinks
  },
  beforeMount: function () {
    // var self = this
    // self.$store.dispatch('updateCartId')
  },
  mounted: function () {
    // window.fcWidget.init({
    //   token: '57621006-84c6-4f7c-bd16-e686ad5c0667',
    //   host: 'https://wchat.freshchat.com'
    // })
    // this.$nextTick(function () {
    //   // Code that will run only after the
    //   // entire view has been rendered
    //   setTimeout(function () {
    //     // document.querySelector('.everything').style.opacity = 1
    //     this.$refs.loading_screen.playAnimation()
    //   }, 100)
    // })
    // this.$intercom.boot()
  }
}
</script>

<style lang="scss">

@import "@/assets/basics/main.scss";

.master-container {
  display: flex;
  flex-direction: column;
  height: auto;
}

</style>
