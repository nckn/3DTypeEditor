<template lang="pug">
  #app.main-container.white-bg
    //- ThreeDScene.fixed(:layoutState="layoutState")
    //- SectionSelfAware(v-for="(lp, index) in sections" :content="lp" :order="index" :isPresent="lp.isPresent" :key="`id-#${index}`" :returnInfo="true")
    EditorOne.fixed(:layoutState="layoutState")
    SectionAnimStagger(:text="text[0]")
    PreloaderAnim(v-bind:class="{ hasloaded: isLoaded}")
</template>

<script>

// import EditorOne from '@/components/EditorBokehShader2.vue'
import EditorOne from '@/components/EditorOne.vue'

import PreloaderAnim from '~/components/templates/PreloaderAnim'

import globalFunctions from '@/mixins/globalFunctions.js'

import SectionAnimStagger from '~/components/templates/SectionAnimStagger'

// import { ParallaxContainer, ParallaxElement} from 'vue-mouse-parallax'
var preloaderFakeTime = 1000

export default {
  name: 'Index2',
  mixins: [globalFunctions],
  components: {
    EditorOne,
    SectionAnimStagger,
    PreloaderAnim
  },
  data () {
    return {
      isLarge: true,
      layoutState: 0,
      isLoaded: false,
      text: [
        {
          title: '', // Explore editor
          subtitle: '',
          explanation: '',
        },
      ],
      sections: [
        {
          id: 'networklp',
          style: 'pad-l',
          isPresent: false,
          subtitles: [
            {
              text: 'Title 1',
              style: 'medium',
              seperator: 'vertical white',
            },
            {
              style: 'medium watch-width more-line-height',
              text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
            },
            {
              style: 'medium watch-width more-line-height',
              text: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
            }
          ],
        },
        {
          id: 'networknumbers',
          style: 'pad-l',
          isPresent: false,
          blocks: [
            [
              {
                style: '',
                text: 'Title 2'
              },
              {
                style: '',
                text: 'networks.'
              }
            ],
            [
              {
                style: '',
                text: '180+'
              },
              {
                style: '',
                text: 'countries.'
              }
            ],
            [
              {
                style: 'bronze',
                text: 'one'
              },
              {
                style: '',
                text: 'world.'
              }
            ],
          ],
        },
        {
          id: 'networkthird',
          style: 'pad-l',
          isPresent: false,
          subtitles: [
            {
              style: 'medium',
              text: 'Title 3.',
              seperator: 'vertical white',
            },
            {
              text: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
              style: 'medium watch-width more-line-height',
            },
            {
              text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
              style: 'medium watch-width more-line-height',
            }
          ],
        },
      ]
    }
  },
  mounted () {
    var self = this
    // Check if large
    self.isLarge = self.checkIfLarge(768)
    // console.log('parallaxxx')
    // console.log(ParallaxContainer)
    setTimeout(() => {
      self.isLoaded = true
    }, preloaderFakeTime)
  },
  methods: {
    receiveInfo (data) {
      var self = this
      // console.log('where: ', data.state)
      // console.log('which: ', data.index)
      self.layoutState = data.index   
      // if (data.index === 0) {
      //   self.layoutState = data.index   
      //   console.log('which: ', data.index)
      // }
      // else if (data.index === 1) {
      //   self.layoutState = data.index   
      //   console.log('next: ', data.index)        
      // }
      // else if (data.index === 2) {
      //   self.layoutState = data.index   
      //   console.log('next: ', data.index)        
      // }
    }
  }
}
</script>

<style lang="scss">

// #app {
//   // font-family: 'Avenir', Helvetica, Arial, sans-serif;
//   -webkit-font-smoothing: antialiased;
//   -moz-osx-font-smoothing: grayscale;
//   text-align: center;
//   // color: #2c3e50;
//   // margin-top: 60px;
// }

</style>
