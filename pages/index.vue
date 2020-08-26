<template lang="pug">
  .container.outer.black-bg
    #containerTypo(ref="container_typo")
    HoverInfo(:type="'top-left'" :options="guiControls" :closer="container")
    //- MenuOptions(:type="'top-left'" :options="guiControls" :closer="container")
    Controls(:settings="settings" :event="'click'" :revealed="true")
    QuickOptions(:type="'top-left'" :options="quickOptions")
    //- QuickSearch(:type="'top-left'" :settings="quickSearch" :options="quickOptions")
    .preview-container(v-bind:class="{ available: revealSnapper }")
      .btn.icon.camera-trigger(@click="takeScreenshot" name="screenshot-trigger" v-bind:class="{ closeagain: revealSnapper }")
      .hidden-gui
        .screenshot-img(ref="image_display")
        .action-buttons
          //- button.action-button(@click="takeScreenshot" name="display") Display
          .btn.icon.download(@click="downloadImage" name="download-btn")
    //- #typeinfo
    //-   button#color change color
    //-   button#font change font
    //-   button#weight change weight
    //-   button#bevel change bevel
    //-   br
    //-   a#permalink(href='#') permalink
</template>
 
<script>

// Example
// http://www.bryanjones.us/article/reflections-threejs
// 
// Converter
// https://gero3.github.io/facetype.js/

import * as THREE from 'three'
import { MixOperation } from 'three/build/three.min.js'
// import { mixOperation} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// Post-processing
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { BloomPass } from 'three/examples/jsm/postprocessing/BloomPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass.js';

// Anti aliasing
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js'
import { PixelShader } from 'three/examples/jsm/shaders/PixelShader.js'

import HoverInfo from '@/components/gui/HoverInfo'
import MenuOptions from '@/components/gui/MenuOptions'
import Controls from '@/components/gui/Controls'
import { map } from '@/assets/js/helpers'

import QuickSearch from '@/components/gui/QuickSearch'
import QuickOptions from '@/components/gui/QuickOptions'

import globalFunctions from '@/mixins/globalFunctions.js'
import { Vector2 } from 'three';

const vertexShader = require('@/assets/js/shaders/vertexShader.glsl')
const fragmentShader = require('@/assets/js/shaders/fragmentShader.glsl')

const TEXTURE_PATH = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/123879/';

// import vertexShader from '@/assets/js/vertexShader.glsl'
// import fragmentShader from '@/assets/js/fragmentShader.glsl'

// const vertexShader = require('@/assets/js/vertexShader.glsl')
// const fragmentShader = require('@/assets/js/fragmentShader.glsl')

const camOffsetY = 1500

// const panoImage = require('@/assets/images/pano.jpg')
var envTextures = [
  require('static/textures/environment-textures-opposite-sunrise.jpg'),
  require('static/textures/environment-textures-condensed-bands-1.jpg'),
]
// const panoImage = require('@/assets/images/environment-textures-opposite-sunrise.jpg')

var text = 'WRITE',
  height = 20,
  zOffset = 0,
  size = 200,
  hover = 30,
  curveSegments = 4,
  bevelThickness = 2,
  bevelSize = 1.5,
  bevelEnabled = true,
  font = '',
  fontName = 'impact', // helvetiker, optimer, gentilis, droid sans, droid serif
  fontWeight = 'bold'; // normal bold

var fontMap = {
  'impact': 0,
  'deathstar': 1,
  'outrun': 2,
  'helvetiker': 3,
  'optimer': 4,
  // 'gentilis': 5,
  // 'potato': 6,
  // 'droid/droid_sans': 5,
  // 'droid/droid_serif': 6
};

var fontList = [
  'impact',
  'deathstar',
  'outrun',
  'helvetiker',
  'optimer',
  // 'gentilis',
  // 'potato',
]

var weightMap = {
  'regular': 0,
  'bold': 1
};

var reverseFontMap = [];
var reverseWeightMap = [];

for (var i in fontMap) reverseFontMap[fontMap[i]] = i;
for (var i in weightMap) reverseWeightMap[weightMap[i]] = i;

var targetRotation = 0;
var targetRotationOnMouseDown = 0;

var mouseX = 0;
var mouseXOnMouseDown = 0;

var windowHalfX = window.innerWidth / 2;

var fontIndex = 1;

// import Slider from '@/components/gui/Slider'

export default {
  name: 'Type',
  mixins: [globalFunctions],
  data () {
    return {
      container: null,
      scene: null,
      camera: null,
      composer: null,
      // Reflection specific
      // effect: null,
      // controls,
      element: null,
      rotationPoint: null,
      lightRotationPoint: null,
      sphere: null,
      dome: null,
      dirLight: null,
      // skybox: null,
      textureCube: null,
      cube: null,
      cubeMaterial: null,
      mirrorSphere: null,
      mirrorSphereCamera: null,
      sphere1: null,
      sphere1Camera: null,
      mirrorRect2: null,
      mirrorRect2Camera: null,
      mirrorRect3: null,
      mirrorRect3Camera: null,
      mirrorRect4: null,
      cone1Camera: null,
      // Niels
      domeMat: null,
      mirrorSphereMaterial0: null,
      permalink: null,
      hex: null,
      cameraTarget: {y: -100},
      group: null,
      textMesh1: null,
      textMesh2: null,
      textGeo: null,
      materials: null,
      firstLetter: true,
      cameraPersp: null,
      cameraOrtho: null,
      camera: null,
      // Quick options
      quickSearch: {
        // enabled: false
        enabled: true
      },
      // Quick options
      quickOptions: [
        {name: 'front', path: '/icons/icon-camera-front.svg'},
        {name: 'top', path: '/icons/icon-camera-top.svg'},
        {name: 'angle', path: '/icons/icon-camera-top.svg'},
        // {name: 'snap', path: '/svg/icons/icon-snap-on.svg'},
      ],
      // MenuOptions
      guiControls: [
        {name: 'camerapos',
          enabled: true,
          methods: [
            {name: 'right', method: 'rotate'},
            {name: 'top', method: 'rotate'},
            {name: 'front', method: 'translate'},
          ]
        },
        // {name: 'transforms',
        //   enabled: true,
        //   methods: [
        //     {name: 'scale', method: 'rotate'},
        //     {name: 'rotate', method: 'rotate'},
        //     {name: 'translate', method: 'translate'},
        //   ]
        // },
        // {name: 'space world',
        //   enabled: true,
        //   otherState: 'local',
        //   methods: [
        //     {name: 'handlex', method: 'translate'},
        //     {name: 'handley', method: 'rotate'},
        //     {name: 'handlez', method: 'rotate'},
        //   ]
        // },
        // {name: 'snap', enabled: false},
      ],
      // Post-processing
      params: {
				exposure: 0.6, // org 1
				bloomThreshold: 0.3,
				bloomStrength: 1,
				bloomRadius: 0
      },
      // Passes
      filmPass: null,
      bloomPass: null,
      pixelPass: null,
      fxaaPass: null,
      AfterimagePass: null,
      renderComposer: true,
      // Slider settings  
      settings: [
        {name: 'Letter depth',
          stepsliders: [
            {
              name: 'Font', value: 0, min: 0, max: fontList.length - 1, step: 1,
              fonts: fontList
            },
          ],
          sliders: [
            {name: 'letterdepth', value: 0, min: 0.05, max: 3000, step: 0.01},
          ],
        },
        {name: 'FXs',
          checkbox: [
            {name: 'Enable FXs', checked: true},
            {name: 'After image', checked: true},
            // {name: 'Enable Environment', checked: true},
            {name: 'Mirror fonts', checked: true},
            {name: 'Neon colors', checked: true},
          ]
        },
        {name: 'FXsSliders',
          sliders: [
            {name: 'Scan lines', value: 0.5},
            {name: 'Noise intensity', value: 0.5},
            {name: 'Bloom strength', value: 1, min: 0, max: 6, step: 0.01},
            {name: 'Blur radius', value: 0.5},
            {name: 'Light intensity', value: 0.5},
          ]
        },
        {name: 'Pixel',
          sliders: [
            {name: 'Pixel size', value: 0.5}
          ]
        },
      ],
      // Save and download image data
      imageData: null,
      revealSnapper: false,
      text: '',
      hash: '',
      // Mirror letters
      mirror: true,
      reflection: true,
      // Quick menu touch trigger
      isTouch: null,
      mouseDown: null,
      timeout: null,
      lastTap: 0,
      mapTap: {}
    }
  },
  components: {
    MenuOptions,
    Controls,
    QuickSearch,
    QuickOptions,
    HoverInfo
  },
  mounted () {
    var self = this
    // Get window width
    self.window = {w: window.innerWidth, h: window.innerHeight}
    // console.log('mix operation: ', MixOperation)

    // See if FXs should be rendered
    var obj = self.getKeyByValue('FXs', self.settings)
    // console.log('this is it')
    // console.log(obj.checkbox[0].checked)
    self.renderComposer = obj.checkbox[0].checked
     
    // Quick menu related - start
    // Listen for double press from mouse or touch
    // self.quickSearch['enabled'] = self.assignDoubleTap(self.quickSearch['enabled'])
    self.isTouch = (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0))
    self.mouseDown = self.isTouch ? 'touchstart' : 'mousedown'

    document.addEventListener(self.mouseDown, function(event) {
      var currentTime = new Date().getTime()
      var tapLength = currentTime - self.lastTap
      clearTimeout(self.timeout)
      if (tapLength < 500 && tapLength > 0) {
        // elm2.innerHTML = 'Double Tap'
        event.preventDefault()
        self.quickSearch['enabled'] = !self.quickSearch['enabled']
      } else {
        // elm2.innerHTML = 'Single Tap';
        self.timeout = setTimeout(function() {
          // elm2.innerHTML = 'Single Tap (timeout)'
          clearTimeout(self.timeout)
        }, 500)
      }
      self.lastTap = currentTime
    })

    // Listen for double tap from any key
    document.addEventListener('keydown', e => {
      const slug = `${ e.shiftKey ? '⇧-' : '' }${ e.ctrlKey ? '⌥-' : '' }${ e.metaKey ? '⌘-' : '' }${e.key}`
      self.mapTap[slug] = self.mapTap[slug] || []
      self.mapTap[slug].forEach(clearTimeout)
      self.mapTap[slug].push(setTimeout(() => delete self.mapTap[slug], 300))
      // var numkey = parseInt(Number(slug))
      // var numkey = slug
      if (self.mapTap[slug].length === 2) {
        // self.quickSearch['enabled'] = !self.quickSearch['enabled']
        console.log(`Double keypress of ${slug}`)
        // console.log(typeof numkey)
        console.log(e.keyCode)
        // console.log(`type of`)
        // console.log(typeof slug)
        if (e.keyCode === 32) {
          self.quickSearch['enabled'] = !self.quickSearch['enabled']
        }
      }
    })
    // Quick menu related - end

    setTimeout(() => {
      self.init()
      self.animate()
    }, 1000)
  },
  beforeDestroy () {
    // var self = this
    // console.log('before destroy')
    // window.cancelAnimationFrame( self.reqAnim );
    // // Dispose controls
    // self.controls.dispose()
    // while(self.scene.children.length > 0){
    //   console.log('before destroying: ', self.scene.children[0])
    //   self.scene.remove(self.scene.children[0]);
    // }
  },
  methods: {
    changeVal(ob) {
      // Slider
      var self = this
      console.log('name: ', ob.name)
      if (ob.name === 'letterdepth') {
        // console.log('letter depth actual: ', self.textGeo.attributes)
        // height = map(ob.value, 0, 1, 0.05, 5000)
        // zOffset = map(ob.value, 0, 1, 0.05, -5000)
        height = parseFloat(ob.value)
        zOffset = -parseFloat(ob.value)
        self.refreshText()
      }
      else if (ob.name === 'Font') {
        // fontIndex++;
        // var index = parseInt(Math.floor(map(ob.value, 0, 1, 0, 5)))
        var index = ob.value
        fontName = reverseFontMap[index % reverseFontMap.length];
        self.loadFont()
        // self.renderComposer = !self.renderComposer
      }
      else if (ob.name === 'Enable FXs') {
        self.renderComposer = !self.renderComposer
      }
      else if (ob.name === 'Enable Environment') {
        // self.renderComposer = !self.renderComposer
        self.dome.visible = false
        console.log(self.dome.visible)
      }
      else if (ob.name === 'Mirror fonts') {
        // self.renderComposer = !self.renderComposer
        self.mirror = !self.mirror
        self.refreshText()
      }
      else if (ob.name === 'Neon colors') {
        // self.renderComposer = !self.renderComposer
        self.reflection = !self.reflection
        self.refreshText()
      }
      else if (ob.name === 'After image') {
        self.afterimagePass.enabled = !self.afterimagePass.enabled
        // self.afterimagePass.renderToScreen = !self.afterimagePass.renderToScreen
        console.log('after image: ', self.afterimagePass)
      }
      else if (ob.name === 'Scan lines') {
        console.log('scan lines: ', self.filmPass.uniforms.sIntensity)
        self.filmPass.uniforms.sIntensity.value = ob.value
        // self.refreshText()
      }
      else if (ob.name === 'Noise intensity') {
        console.log('scan lines: ', self.filmPass.uniforms.sIntensity)
        self.filmPass.uniforms.nIntensity.value = ob.value 
      }
      else if (ob.name === 'Bloom strength') {
        self.bloomPass.copyUniforms[ "opacity" ].value = ob.value
      }
      else if (ob.name === 'Blur radius') {
        self.bloomPass.radius = ob.value
        console.log('blur: ')
        // self.bloomPass.convolutionUniforms[ "uImageIncrement" ].value.y = map(ob.value, 0, 1, 0, 1)
        // console.log(JSON.stringify(self.bloomPass))
        // console.log(self.bloomPass)
        // self.bloomPass.uniforms[ "bloomRadius" ].value = map(ob.value, 0, 1, 0, 100)
      }
      else if (ob.name === 'Light intensity') {
        self.dirLight.intensity = map(ob.value, 0, 1, 0.15, 2)
      }
      else if (ob.name === 'Pixel size') {
        self.pixelPass.uniforms[ "pixelSize" ].value = map(ob.value, 0, 1, 1, 32) 
      }
    },
    clickedCommandInChild (obj) {
      var self = this
      console.log('obj: ', obj.name)
      if (obj.name === 'camerapos') {
        self.toggleCamera()
        self.guiControls[0].enabled = !self.guiControls[0].enabled
      }
      else if (obj.name === 'front' || obj.name === 'top' || obj.name === 'right' || obj.name === 'angle') {
        self.changeCameraPos(obj.name)
      }
    },
    // takeScreenshot (e) {
    //   var self = this
    //   self.revealSnapper = false
    // },
    takeScreenshot (e) {
      var self = this
      var target
      if (e) {
        var target = e.target || e.srcElement || ''
        if (target.classList.contains('closeagain')) {
          self.revealSnapper = false
          return
        }
        self.revealSnapper = true
      }
      else if (e === undefined) {
        console.log('probably a keystroke')
        self.revealSnapper = true
      }
      // var name = target.getAttribute('name')
      // // console.log(e)
      // if (name === 'screenshot-trigger') {
      //   console.log('innnn')
      // }
      console.log('the input')
      console.log(e)
      // return
      console.log(target)
      
      // taken from https://jsfiddle.net/2pha/art388yv/
      // var canvasElem = document.getElementById('containerTypo').children[0]
      // // const dataURI = canvasElem.toDataURL()
      // const dataURI = self.renderer.domElement.toDataURL()
      // console.log(dataURI)
      // self.imageDisplay.src = dataURI
      // open in new window like this
      //
      // var w = window.open('', '');
      // w.document.title = `80s image ${new Date()}`;
      //w.document.body.style.backgroundColor = "red";
      try {
        var img = new Image();
        // Without 'preserveDrawingBuffer' set to true, we must render now
        // img.src = self.renderer.domElement.toDataURL()
        self.renderer.render(self.scene, self.camera)
        // Post-processing
        if (self.renderComposer) {
          self.composer.render()
        }
        self.imageData = self.renderer.domElement.toDataURL()
        self.imageDisplay.style.background = `url(${self.imageData}`
        self.imageDisplay.style.backgroundSize = 'cover'
        self.imageDisplay.style.backgroundPosition = 'center'
        // self.imageDisplay.src = self.imageData
        // w.document.body.appendChild(img);
      } catch (err) {
        console.log(err)
        return
      }
    },
    downloadImage() {
      var self = this
      var link = document.createElement('a');
      if (typeof link.download === 'string') {
        document.body.appendChild(link) // Firefox requires the link to be in the body
        link.download = `${self.text}`
        link.href = self.imageData
        link.click()
        document.body.removeChild(link) //remove the link when done
      } else {
        location.replace(uri)
      }
    },
    tweenObject (type) {
      var self = this
      // if (type === 'default') {
      // }
      TweenMax.to(elm.obj.position, easeTime, {
        x: elm.pos.x,
        y: elm.pos.y,
        z: elm.pos.z,
        // ease: Sine.easeInOut
        ease: self.easingType
      })
    },
    resetCamera() {
      var self = this
      self.camera.position.set( 0, camOffsetY, 1500 )
    },
    changeCameraPos(angle) {
      var self = this
      switch (angle) {
        case 'front':
          self.camera.position.set( 0, 0, 1500 )
          break
        case 'top':
          self.camera.position.set( 0, 1500, 0 )
          break
        case 'angle':
          self.camera.position.set( -1500, 1000, 1500 )
          break
        case 'right':
          self.camera.position.set( 1500, 0, 0 )
          break
        case 'reset':
          self.resetCamera();
          break
      }
      self.camera.lookAt( 0, 0, 0 ) // TODO: look at "active" object
      self.controls.update()
      // self.render()
      // if (angle != 'reset') {
      // }
      // self.cameraPersp.position.set( 1000, 500, 1000 )
      // self.cameraOrtho.position.set( 1000, 500, 1000 )
    },
    createReflectionDome() {
      var self = this
      var panoTexture = new THREE.TextureLoader().load( envTextures[1] );
      // self.domeMat = new THREE.MeshBasicMaterial( { map: panoTexture } )
      self.domeMat = new THREE.MeshBasicMaterial({
        map: panoTexture
        // color: 0x000000
      })
      self.domeMat.side = THREE.DoubleSide
      self.dome = new THREE.Mesh( new THREE.SphereGeometry( 3500, 60, 60 ), self.domeMat )
      // sphere.scale.x = -1;
      self.dome.doubleSided = true
      // self.dome.visible = false
      self.scene.add( self.dome );

      // Assign to layer
      // dome.layers.set( 2 )
    },
    createReflectionCube() {
      var self = this
      // Create the scene.
      var urls = [
        TEXTURE_PATH + 'px.jpg', TEXTURE_PATH + 'nx.jpg',
        TEXTURE_PATH + 'py.jpg', TEXTURE_PATH + 'ny.jpg',
        TEXTURE_PATH + 'pz.jpg', TEXTURE_PATH + 'nz.jpg',
      ];
      self.loader = new THREE.CubeTextureLoader();
      self.loader.crossOrigin = "";
      var textureCube = self.loader.load( urls );
      textureCube.format = THREE.RGBFormat;
      // self.scene = new THREE.Scene();
      self.scene.background = textureCube;
    },
    init() {
      var self = this
      
      // Build the container
      self.container = self.$refs.container_typo
      self.imageDisplay = self.$refs.image_display
      // document.body.appendChild( container );

      // self.permalink = document.getElementById("permalink")
      
      // Create scene
      self.scene = new THREE.Scene();
      // Add fog
      self.scene.fog = new THREE.Fog(0x000000, 0, 4300);

      self.createReflectionDome()
      // self.createReflectionCube()
      
      // Create a rotation points.
      // self.rotationPoint = new THREE.Object3D();
      // self.rotationPoint.position.set( 0, 0, 0 );
      // self.scene.add(self.rotationPoint);
      // self.rotationPoint.lookAt(0,0,0);
      
      // light rotation point.
      self.lightRotationPoint = new THREE.Object3D();
      self.lightRotationPoint.position.set( 0, 0, 0 );
      self.scene.add(self.lightRotationPoint);
      
      // // Create the camera.
      // self.camera = new THREE.PerspectiveCamera(
      //   45, // Angle
      //   window.innerWidth / window.innerHeight, // Aspect Ratio.
      //   1, // Near view.
      //   23000 // Far view.
      // );
      // self.camera.position.z = 1500;
      // self.camera.position.y = 200;

      self.aspect = self.window.w / self.window.h

      self.cameraPersp = new THREE.PerspectiveCamera(
        45, // Angle
        window.innerWidth / window.innerHeight, // Aspect Ratio.
        1, // Near view.
        3000 // Far view. 23000
      )
      self.cameraOrtho = new THREE.OrthographicCamera( - 600 * self.aspect, 600 * self.aspect, 600, - 600, 0.01, 30000 )
      self.camera = self.cameraPersp
      self.resetCamera();
      self.camera.lookAt( 0, camOffsetY, 0 );
      
      // self.rotationPoint.add( self.camera );
      self.scene.add( self.camera );

      // Build the renderer.
      self.renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
      var element = self.renderer.domElement;
      self.renderer.setSize( window.innerWidth, window.innerHeight );
      self.renderer.shadowMap.enabled;
      self.renderer.autoClear = false
      // container.appendChild( element );
      self.container.appendChild( element )

      // Setup light
      self.setupLights()

      // Create base.
      self.createBase();
    
      // Setup the reflection
      self.setupReflectionCamera();
      
      // self.addGuides();

      // var pointLight = new THREE.PointLight(0xffffff, 1.5)
      // pointLight.position.set(0, 100, 90)
      // self.scene.add(pointLight)

      // Get text from hash
      var hash = document.location.hash.substr(1)
      self.hash = hash

      if (hash.length !== 0) {
        var colorhash = hash.substring(0, 6)
        var fonthash = hash.substring(6, 7)
        var weighthash = hash.substring(7, 8)
        var bevelhash = hash.substring(8, 9)
        var texthash = hash.substring(10)

        self.hex = colorhash
        // pointLight.color.setHex(parseInt(colorhash, 16))

        fontName = reverseFontMap[parseInt(fonthash)]
        fontWeight = reverseWeightMap[parseInt(weighthash)]

        bevelEnabled = parseInt(bevelhash)

        text = decodeURI(texthash)
        // self.text = text

        // self.updatePermalink()

      } else {
        // pointLight.color.setHSL(Math.random(), 1, 0.5)
        // self.hex = self.decimalToHex(pointLight.color.getHex())
      }

      self.materials = [
        new THREE.MeshPhongMaterial({ color: 0xa0a0a0, flatShading: true }), // front
        new THREE.MeshPhongMaterial({ color: 0xa0a0a0 }) // side
      ];

      self.group = new THREE.Group()
      self.group.position.y = 0

      self.scene.add(self.group)

      self.loadFont()

      // Org transparent floor
      // var plane = new THREE.Mesh(
      //   new THREE.PlaneBufferGeometry(10000, 10000),
      //   new THREE.MeshBasicMaterial({ color: 0x000000, opacity: 0.9, transparent: true })
      // );
      // plane.position.y = 100;
      // plane.rotation.x = - Math.PI / 2;
      // self.scene.add(plane);

      // RENDERER
      // renderer = new THREE.WebGLRenderer({ antialias: true });
      // renderer.setPixelRatio(window.devicePixelRatio);
      // renderer.setSize(window.innerWidth, window.innerHeight);
      // container.appendChild(renderer.domElement);

      // STATS

      // self.stats = new Stats()
      //container.appendChild( stats.dom );
      self.composer = new EffectComposer(self.renderer)
      self.composer.addPass(new RenderPass(self.scene, self.camera))

      var obj = self.getKeyByValue('FXsSliders', self.settings)

      // alert(obj.sliders[2].value)

      var params = {
				exposure: 1,
				// bloomStrength: 1,
				bloomStrength: parseFloat(obj.sliders[2].value),
				bloomThreshold: 0,
				bloomRadius: 0,
				scene: "Scene with Glow"
			}

      // New Bloom Pass - start
      self.bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
			self.bloomPass.threshold = params.bloomThreshold
			self.bloomPass.strength = params.bloomStrength
      self.bloomPass.radius = params.bloomRadius
      
      self.finalPass = new ShaderPass(
				new THREE.ShaderMaterial( {
					uniforms: {
						baseTexture: { value: null },
						bloomTexture: { value: self.composer.renderTarget2.texture }
					},
					vertexShader: vertexShader,
					fragmentShader: fragmentShader,
					defines: {}
				} ), 'baseTexture'
			)
			self.finalPass.needsSwap = true
      // New Bloom Pass - end

      // Org Bloom Pass - start
      // self.bloomPass = new BloomPass(
      //   1,    // strength
      //     25,   // kernel size
      //     2,    // sigma ?
      //     256,  // blur render target resolution
      // );
      // // self.bloomPass.convolutionUniforms[ "uImageIncrement" ].value.x = -0.0001
      // // self.bloomPass.convolutionUniforms[ "uImageIncrement" ].value.y = -0.005
      // // self.bloomPass.convolutionUniforms[ "uImageIncrement" ].value.x = 0
      // // self.bloomPass.convolutionUniforms[ "uImageIncrement" ].value.y = -0.002
      // Org Bloom Pass - end

      // console.log(self.bloomPass)
      // console.log(self.bloomPass.strength)

      // Anti alias
      self.fxaaPass = new ShaderPass( FXAAShader )
      var pixelRatio = self.renderer.getPixelRatio()
      self.fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / ( self.container.offsetWidth * pixelRatio );
      self.fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / ( self.container.offsetHeight * pixelRatio );
      
      // Anti alias
      self.composer.addPass( self.fxaaPass )
      
      self.composer.addPass(self.bloomPass)
      // self.composer.addPass(self.finalPass)

      self.filmPass = new FilmPass(
        0.35,   // noise intensity
        0.025,  // scanline intensity
        648,    // scanline count
        false,  // grayscale
      );
      self.filmPass.renderToScreen = true;
      self.composer.addPass(self.filmPass);

      self.afterimagePass = new AfterimagePass();
      self.composer.addPass( self.afterimagePass )
      
      // Pixelation
      self.pixelPass = new ShaderPass( PixelShader )
      self.pixelPass.uniforms[ "resolution" ].value = new THREE.Vector2( window.innerWidth, window.innerHeight )
      self.pixelPass.uniforms[ "resolution" ].value.multiplyScalar( window.devicePixelRatio )
      self.composer.addPass( self.pixelPass )

      // EVENTS
      document.addEventListener('mousedown', self.onDocumentMouseDown, false)
      document.addEventListener('touchstart', self.onDocumentTouchStart, false)
      document.addEventListener('touchmove', self.onDocumentTouchMove, false)
      document.addEventListener('keypress', self.onDocumentKeyPress, false)
      document.addEventListener('keydown', self.onDocumentKeyDown, false)

      // document.getElementById('color').addEventListener('click', function () {
      //   pointLight.color.setHSL(Math.random(), 1, 0.5)
      //   self.hex = self.decimalToHex(pointLight.color.getHex())
      //   self.updatePermalink();
      // }, false)

      // document.getElementById('font').addEventListener('click', function () {
      //   fontIndex++;
      //   fontName = reverseFontMap[fontIndex % reverseFontMap.length];
      //   self.loadFont()
      // }, false)

      // document.getElementById('weight').addEventListener('click', function () {
      //   if (fontWeight === 'bold') {
      //     fontWeight = 'regular';
      //   } else {
      //     fontWeight = 'bold';
      //   }
      //   self.loadFont()
      // }, false)

      // document.getElementById('bevel').addEventListener('click', function () {
      //   bevelEnabled = !bevelEnabled
      //   self.refreshText()
      // }, false)
    
      // Create surrounding shapes.
      // self.createSphere1();
      // self.createSphere2();
      // self.createRect();
      // self.createCone();

      self.setOrbitControls()

      self.listenForKeyEvents()

      window.addEventListener( 'resize', self.onWindowResize, false );
    },
    listenForKeyEvents() {
      var self = this
      window.addEventListener( 'keydown', function ( event ) {
        console.log('key code: ', event.keyCode)
        var key
        var target = event.target || event.srcElement
        var isSpecialKey
        if (window.event) {
          key = window.event.keyCode
          // isSpecialKey = !!window.event.shiftKey // typecast to boolean
          // isSpecialKey = !!window.event.metaKey // Cmd
          isSpecialKey = !!window.event.altKey // typecast to boolean
        } else {
          key = ev.which
          // isSpecialKey = !!ev.shiftKey
          // isSpecialKey = !!ev.metaKey
          isSpecialKey = !!ev.altKey
        }
        
        // console.log('where it stems from: ', event)
        if (target.tagName === 'INPUT' && key !== 27) {
          return
        }

        if (isSpecialKey) {
          event.preventDefault()
          switch ( key ) {
            case 77: // M
              self.quickSearch['enabled'] = !self.quickSearch['enabled']
              break
            case 67: // C
              self.toggleCamera()
              break
            case 49: // 1
              self.changeCameraPos('front')
              break
            case 50: // 2
              self.changeCameraPos('top')
              break
            case 51: // 3
              self.changeCameraPos('angle')
              break
            case 82: // R
              self.changeCameraPos('reset')
              break
            case 83: // S – take a screenshot
              self.takeScreenshot()
              break
            case 32: // S – take a screenshot
              // self.doubleTapProvoked(event)
              break
          }
        }
        // Global keys
        switch ( key ) {
          case 27: // Escape key
            self.quickSearch['enabled'] = false
            break
        }
        // if ( event.keyCode == 49 && event.keyCode == 16 ) {
        //   self.toggleCamera()
        // }
        // else if () {

        // }
      })
    },
    doubleTapProvoked (e) {
      var self = this
       
      // var currentTime = new Date().getTime()
      // var tapLength = currentTime - self.lastTap
      // clearTimeout(self.timeout)
      // if (tapLength < 500 && tapLength > 0) {
      //   // elm2.innerHTML = 'Double Tap'
      //   // event.preventDefault()
      //   self.quickSearch['enabled'] = !self.quickSearch['enabled']
      // } else {
      //   // elm2.innerHTML = 'Single Tap';
      //   self.timeout = setTimeout(function() {
      //     // elm2.innerHTML = 'Single Tap (timeout)'
      //     clearTimeout(self.timeout)
      //   }, 500)
      // }
      // self.lastTap = currentTime
    },
    toggleCamera() {
      var self = this
      const position = self.camera.position.clone()

      self.camera = self.camera.isPerspectiveCamera ? self.cameraOrtho : self.cameraPersp
      self.camera.position.copy( position )

      self.controls.object = self.camera
      self.controls.camera = self.camera

      self.camera.lookAt( self.controls.target.x, self.cameraTarget.y, self.controls.target.z )
      // self.onWindowResize()
    },
    setupLights() {
      var self = this
      self.dirLight = new THREE.DirectionalLight(0xffffff, 1.75);
      var d = 20;

      self.dirLight.position.set(d, d, d);

      self.dirLight.castShadow = true;
      //self.dirLight.shadowCameraVisible = true;

      self.dirLight.shadow.mapSize.width = 2048;
      self.dirLight.shadow.mapSize.height = 2048;

      self.dirLight.shadow.camera.left = -d;
      self.dirLight.shadow.camera.right = d;
      self.dirLight.shadow.camera.top = d;
      self.dirLight.shadow.camera.bottom = -d;

      self.dirLight.shadow.camera.far = 3 * d;
      self.dirLight.shadow.camera.near = d;

      // Set intensity
      var obj = self.getKeyByValue('FXsSliders', self.settings)
      var val = parseFloat(obj.sliders[4].value)
      self.dirLight.intensity = val
      // self.dirLight.shadowDarkness = 0.5;

      self.scene.add(self.dirLight);
    },
    boolToNum(b) {
      return b ? 1 : 0
    },
    updatePermalink() {
      var self = this
      var link = self.hex + fontMap[fontName] + weightMap[fontWeight] + self.boolToNum(bevelEnabled) + '#' + encodeURI(text)
      // self.permalink.href = '#' + link
      window.location.hash = link
    },
    checkOriginOfKeyStroke() {
      var self = this
      var target = event.target || event.srcElement
      if (target.tagName === 'INPUT') {
        console.log('it comes from: ', target.tagName)
        return true
      }
    },
    onDocumentKeyDown(event) {
      var self = this

      if (self.checkOriginOfKeyStroke())
        return
      
      if (self.firstLetter) {
        self.firstLetter = false
        text = ''
      }
      var keyCode = event.keyCode
      // backspace
      if (keyCode == 8) {
        event.preventDefault()
        text = text.substring(0, text.length - 1)
        self.refreshText()
        return false
      }
    },
    onDocumentKeyPress(event) {
      var self = this

      if (self.checkOriginOfKeyStroke())
        return

      var keyCode = event.which
      // backspace
      if (keyCode == 8) {
        event.preventDefault()
      } else {
        var ch = String.fromCharCode(keyCode)
        text += ch
        self.refreshText()
      }
    },
    loadFont() {
      var self = this
      var loader = new THREE.FontLoader()
      loader.load('fonts/json/' + fontName + '_' + fontWeight + '.typeface.json', function (response) {
        font = response
        self.refreshText()
        // self.addTestText(font)
      })
    },
    addTestText(font) {
      var self = this
      var textGeo = new THREE.TextBufferGeometry( "THREE.JS", {
        font: font,
        size: 200,
        height: 50,
        curveSegments: 12,
        bevelThickness: 2,
        bevelSize: 5,
        bevelEnabled: true
      } );

      textGeo.computeBoundingBox();
      var centerOffset = - 0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );

      // var textMaterial = new THREE.MeshPhongMaterial( { color: 0xff0000, specular: 0xffffff } );
      var textMaterial = new THREE.MeshBasicMaterial( { envMap: self.sphere1Camera.renderTarget.texture } )

      var mesh = new THREE.Mesh( textGeo, textMaterial );
      mesh.position.x = centerOffset;
      mesh.position.y = 100;
      // mesh.position.z = zOffset;

      mesh.castShadow = true;
      mesh.receiveShadow = true;

      self.scene.add( mesh );
    },
    createText() {
      var self = this
      self.text = text
      self.textGeo = new THREE.TextBufferGeometry(text, {
        font: font,
        size: size,
        height: height,
        curveSegments: curveSegments,
        bevelThickness: bevelThickness,
        bevelSize: bevelSize,
        bevelEnabled: bevelEnabled
      })

      self.textGeo.computeBoundingBox()
      self.textGeo.computeVertexNormals()

      var triangle = new THREE.Triangle()

      // "fix" side normals by removing z-component of normals for side faces
      // (this doesn't work well for beveled geometry as then we lose nice curvature around z-axis)

      if (!bevelEnabled) {
        var triangleAreaHeuristics = 0.1 * (height * size)
        for (var i = 0; i < self.textGeo.faces.length; i++) {
          var face = self.textGeo.faces[i]
          if (face.materialIndex == 1) {
            for (var j = 0; j < face.vertexNormals.length; j++) {
              face.vertexNormals[j].z = 0
              face.vertexNormals[j].normalize()
            }
            var va = self.textGeo.vertices[face.a]
            var vb = self.textGeo.vertices[face.b]
            var vc = self.textGeo.vertices[face.c]
            var s = triangle.set(va, vb, vc).getArea()
            if (s > triangleAreaHeuristics) {
              for (var j = 0; j < face.vertexNormals.length; j++) {
                face.vertexNormals[j].copy(face.normal)
              }
            }
          }
        }
      }

      var centerOffset = - 0.5 * (self.textGeo.boundingBox.max.x - self.textGeo.boundingBox.min.x);

      // self.textGeo = new THREE.BufferGeometry().fromGeometry(self.textGeo);

      var mat = new THREE.MeshBasicMaterial( { envMap: self.sphere1Camera.renderTarget.texture } )
      var mat2 = new THREE.MeshBasicMaterial( { envMap: self.sphere1Camera.renderTarget.texture, opacity: 0.25 } )
      // self.textMesh1 = new THREE.Mesh(self.textGeo, self.materials);
      self.textMesh1 = new THREE.Mesh(self.textGeo, self.reflection ? mat : self.materials);
      
      self.textMesh1.receiveShadow = true

      self.textMesh1.position.x = centerOffset
      self.textMesh1.position.y = hover
      // self.textMesh1.position.z = 0
      self.textMesh1.position.z = zOffset
      self.textMesh1.rotation.x = 0
      self.textMesh1.rotation.y = Math.PI * 2
      self.group.add(self.textMesh1)

      if (self.mirror) {
        // self.textMesh2 = new THREE.Mesh(self.textGeo, mat2)
        self.textMesh2 = new THREE.Mesh(self.textGeo, self.reflection ? mat2 : self.materials)
        self.textMesh2.position.x = centerOffset
        self.textMesh2.position.y = - hover
        // self.textMesh2.position.z = height
        self.textMesh2.position.z = 0
        self.textMesh2.rotation.x = Math.PI
        self.textMesh2.rotation.y = Math.PI * 2
        self.group.add(self.textMesh2)
      }
    },
    refreshText() {
      var self = this
      // self.updatePermalink()
      self.group.remove(self.textMesh1);
      
      self.group.remove(self.textMesh2)
      // if (self.mirror) {
      //   self.group.remove(self.textMesh2)
      // }
      if (!text) {
        return
      }
      self.createText()
    },
    onDocumentMouseDown(event) {
      var self = this
      // event.preventDefault()
      // console.log('eveeeent: ', event)
      document.addEventListener('mousemove', self.onDocumentMouseMove, false)
      document.addEventListener('mouseup', self.onDocumentMouseUp, false)
      document.addEventListener('mouseout', self.onDocumentMouseOut, false)
      mouseXOnMouseDown = event.clientX - windowHalfX
      targetRotationOnMouseDown = targetRotation
    },
    onDocumentMouseMove(event) {
      // console.log('eveeeent: ', event.clientX)
      mouseX = event.clientX - windowHalfX
      targetRotation = targetRotationOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.02
    },
    onDocumentMouseUp() {
      var self = this
      document.removeEventListener('mousemove', self.onDocumentMouseMove, false)
      document.removeEventListener('mouseup', self.onDocumentMouseUp, false)
      document.removeEventListener('mouseout', self.onDocumentMouseOut, false)
    },
    onDocumentMouseOut() {
      var self = this
      document.removeEventListener('mousemove', self.onDocumentMouseMove, false)
      document.removeEventListener('mouseup', self.onDocumentMouseUp, false)
      document.removeEventListener('mouseout', self.onDocumentMouseOut, false)
    },
    onDocumentTouchStart(event) {
      if (event.touches.length == 1) {
        event.preventDefault()
        mouseXOnMouseDown = event.touches[0].pageX - windowHalfX
        targetRotationOnMouseDown = targetRotation
      }
    },
    onDocumentTouchMove(event) {
      if (event.touches.length == 1) {
        event.preventDefault()
        mouseX = event.touches[0].pageX - windowHalfX
        targetRotation = targetRotationOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.05
      }
    },
    decimalToHex(d) {
      var hex = Number(d).toString(16)
      hex = '000000'.substr(0, 6 - hex.length) + hex
      return hex.toUpperCase()
    },
    createBase () {
      var self = this
      // Create a floor.  
      var loader = new THREE.TextureLoader()
      loader.crossOrigin = '';
      loader.load( TEXTURE_PATH + 'MetalRustRepolished001_COL_1K_SPECULAR.jpg', function( texture ) {
        var repeatX = 16
        var repeatY = 16
        texture.anisotropy = self.renderer.capabilities.getMaxAnisotropy();
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(repeatX, repeatY);

        var normal = loader.load( TEXTURE_PATH + 'MetalRustRepolished001_NRM_1K_SPECULAR.jpg');
        normal.anisotropy = self.renderer.capabilities.getMaxAnisotropy();
        normal.wrapS = normal.wrapT = THREE.RepeatWrapping;
        normal.repeat.set(repeatX, repeatY);
        
        var ao = loader.load( TEXTURE_PATH + 'MetalRustRepolished001_GLOSS_VAR2_1K_SPECULAR.jpg');
        ao.anisotropy = self.renderer.capabilities.getMaxAnisotropy();
        ao.wrapS = normal.wrapT = THREE.RepeatWrapping;
        ao.repeat.set(repeatX, repeatY);

        var displace = loader.load( TEXTURE_PATH + 'MetalRustRepolished001_DISP_1K_SPECULAR.jpg');
        displace.anisotropy = self.renderer.capabilities.getMaxAnisotropy();
        displace.wrapS = displace.wrapT = THREE.RepeatWrapping;
        displace.repeat.set(repeatX, repeatY); 
        
        var spec = loader.load( TEXTURE_PATH + 'MetalRustRepolished001_REFL_1K_SPECULAR.jpg');
        spec.anisotropy = self.renderer.capabilities.getMaxAnisotropy();
        spec.wrapS = spec.wrapT = THREE.RepeatWrapping;
        spec.repeat.set(repeatX, repeatY);
        
        var material = new THREE.MeshStandardMaterial({
          aoMap: ao,
          aoMapIntensity: 0.5,
          color: 0x666666,
          map: texture,
          metalnessMap: texture,
          displacementMap: displace,
          normalMap: normal,
          envMap: self.scene.background,
          metalness: 0.7,
          metalMap: texture,
          roughness: 0.2,
          // combine: THREE.mixOperation,
          // combine: MixOperation,
          // reflectivity: 0.3,
        });
        
        // Create the floor geometry and mesh. Add to scene.
        var geometry = new THREE.PlaneGeometry( 50000, 50000 );
        geometry.computeFaceNormals();
        var floor = new THREE.Mesh(geometry, material);
        // var floor = new THREE.Mesh(geometry, self.mirrorSphereMaterial0);
        floor.position.set(0, 0, 0);
        floor.rotation.x = -Math.PI/2;
        floor.receiveShadow = true;
        // self.scene.add(floor);

        // var geometry3 =  new THREE.CubeGeometry( 5000, 20, 5000, 1, 1, 1, )
        // self.mirrorFloorCamera = new THREE.CubeCamera( 0.1, 5000, 512 )
        // self.scene.add( self.mirrorFloorCamera )
        // var mirrorRectMaterial3 = new THREE.MeshBasicMaterial({ 
        //   envMap: self.mirrorFloorCamera.renderTarget.texture,
        //   //reflectivity: 0.9,
        //   color: 0xaaaaaa,
        // })
        // self.mirrorFloor = new THREE.Mesh( geometry3, mirrorRectMaterial3 )
        // self.mirrorFloor.position.set(-500, 0, 500)
        // self.mirrorFloorCamera.position.set(-500, 300, 500)
        // self.scene.add(self.mirrorFloor)

      });
    },
    setupReflectionCamera() {
      var self = this
    
      // Sphere
      var geometry1 =  new THREE.SphereGeometry( 100, 32, 32 );
      self.sphere1Camera = new THREE.CubeCamera( 0.1, 5000, 512 );
      self.scene.add( self.sphere1Camera );
      var mirrorRectMaterial1 = new THREE.MeshBasicMaterial( { envMap: self.sphere1Camera.renderTarget.texture } );
      self.sphere1 = new THREE.Mesh( geometry1, mirrorRectMaterial1 );
      self.sphere1.position.set(0, 200, 0);
      self.sphere1Camera.position.copy(self.sphere1.position);
      // Place sphere1 in middle
      // self.scene.add(self.sphere1);
    },
    setOrbitControls () {
      var self = this
      // Build the controls.
      self.controls = new OrbitControls( self.camera, self.renderer.domElement )
      self.controls.enablePan = false
      self.controls.enableZoom = true 
      self.controls.maxDistance = 2000 
      self.controls.minDistance = 500
      // self.controls.target.copy( new THREE.Vector3( 0, 200, 0 ) )
      // self.camera.lookAt(new THREE.Vector3( 0, self.cameraTarget.y, 0 ))
      // self.controls = new OrbitControls( self.camera, self.renderer.domElement );
      // self.controls.enablePan = false

      // Avoid going under floor
      // self.controls.maxPolarAngle = (Math.PI * 1) * 0.99

      // function setOrientationControls(e) {
      //   if (!e.alpha) {
      //     return;
      //   }
      //   self.controls = new THREE.DeviceOrientationControls( self.camera )
      //   self.controls.connect()
      //   window.removeEventListener('deviceorientation', setOrientationControls, true)
      // }
      // window.addEventListener('deviceorientation', setOrientationControls, true)
    },
    addGuides () {
      var axesHelper = new THREE.AxesHelper( 5 );
      this.scene.add( axesHelper );
      // console.log('adding guides')
    },
    update() {
      this.camera.updateProjectionMatrix()
    },
    animate () {
      var self = this
      self.reqAnim = requestAnimationFrame( self.animate.bind(this) )
      self.update()
      self.render()
    },
    render() {
      var self = this

      // console.log('rendering')

      self.updateReflections()
      
      // Render the scene.
      // renderer.render(scene, camera);
      self.renderer.render(self.scene, self.camera)

      // Post-processing
      if (self.renderComposer) {
        self.composer.render()
      }
      
      // Rotate the lights.
      self.lightRotationPoint.rotation.y += 0.005
      
      // Don't let the camera go too low.
      // if (self.camera.position.y < 30) {
      //   self.camera.position.y = 30;
      // }
      
      // Slowly rotate the scene.
      // self.rotationPoint.rotation.y += 0.0005;
    },
    updateReflections() {
      var self = this
      
      // Render the other materials.
      self.sphere1.visible = false
      self.sphere1Camera.update( self.renderer, self.scene )
      self.sphere1.visible = true
    },
    onWindowResize() {
      var self = this
      self.camera.aspect = ( window.innerWidth / window.innerHeight )
      self.camera.updateProjectionMatrix()
      self.renderer.setSize( window.innerWidth, window.innerHeight )
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

$s-action-btns: 24px;
$p-master: 24px;

$breakp-xs: 480px;
$breakp-sm: 576px;
$breakp-md: 768px;
$breakp-lg: 992px;
$breakp-xl: 1200px;
$breakp-xxl: 1600px;

.preview-container {
  width: 0;
  height: 0;
  position: absolute;
  // bottom: 48px; right: 48px;
  bottom: 12px; right: 12px;
  padding: $p-master / 2;
  display: flex;
  flex-direction: column;
  background: #252525;
  transition: all 0.15s ease-in;
  box-sizing: border-box;
  -webkit-box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.25);
  -moz-box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.25);
  box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.25);
  border-radius: 2px;
  .hidden-gui {
    visibility: hidden;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  &.available { 
    width: 156px;
    height: 156px;
    padding: $p-master;
    padding-bottom: $p-master / 2;
    .hidden-gui {
      visibility: visible;
    }
    .camera-trigger {
      top: 2px;
      right: 2px;
    }
  }
  .camera-trigger {
    position: absolute;
    top: 0;
    right: 0;
  }
  .screenshot-img {
    width: 100%;
    // height: 100px;
    // height: calc(100% - #{$s-action-btns});
    height: calc(100% - #{$s-action-btns + 12px});
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
  }
  .action-buttons {
    width: 100%;
    height: $s-action-btns;
    display: flex;
    // justify-content: space-between;
    justify-content: center;
    .action-button {
      width: calc(50% - 6px);
      height: 100%;
    }
  }
}

#typeinfo {
  position: absolute;
  bottom: 0;
  right: 0;
  width: auto;
  // display: none; // *** Demo purpose
}

@media screen and (max-width: $breakp-md) {
  .preview-container {
    bottom: 64px;
  }
}

</style>
