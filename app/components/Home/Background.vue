<template>
  <div id="webgl" ref="container" :class="props.class" />
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, reactive, toRefs, ref } from 'vue'
import * as THREE from 'three'
import { DofPointsMaterial } from '@/utils/shaders/pointMaterial'
import { SimulationMaterial } from '@/utils/shaders/simulationMaterial'
import * as easing from 'maath/easing'

interface Props {
  hovering?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  hovering: false,
  class: 'fixed inset-0 w-full h-full z-[-1] overflow-hidden'
})

// Controls (formerly Leva)
const controls = reactive({
  speed: 1,
  focus: 3.8,
  aperture: 1.79,
  size: 512,
  noiseScale: 0.6,
  noiseIntensity: 0.52,
  timeScale: 1,
  pointSize: 10,
  opacity: 0.8,
  planeScale: 10,
  useManualTime: false,
  manualTime: 0
})

const {
  speed,
  focus,
  aperture,
  size,
  noiseScale,
  noiseIntensity,
  timeScale,
  pointSize,
  opacity,
  planeScale,
  useManualTime,
  manualTime
} = toRefs(controls)

const container = ref<HTMLDivElement | null>(null)

// Three objects
let renderer: THREE.WebGLRenderer | null = null
let camera: THREE.PerspectiveCamera | null = null
let scene: THREE.Scene | null = null
let animationId = 0

// Simulation pass (FBO)
let simScene: THREE.Scene | null = null
let simCamera: THREE.OrthographicCamera | null = null
let simMesh: THREE.Mesh<THREE.BufferGeometry, SimulationMaterial> | null = null
let renderTarget: THREE.WebGLRenderTarget<THREE.Texture> | null = null

// Points
let points: THREE.Points<THREE.BufferGeometry, DofPointsMaterial> | null = null

// Reveal animation
const revealStartTime = ref<number | null>(null)
const isRevealing = ref(true)
const revealDuration = 3.5

function init() {
  if (!container.value) return

  const width = container.value.clientWidth || window.innerWidth
  const height = container.value.clientHeight || window.innerHeight

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(width, height)
  renderer.setClearColor(0x00_00_00, 1)
  container.value.append(renderer.domElement)

  scene = new THREE.Scene()

  camera = new THREE.PerspectiveCamera(50, width / height, 0.01, 300)
  camera.position.set(1.262_978_312_331_458_9, 2.664_606_471_394_044, -1.817_899_374_328_891_4)
  camera.lookAt(0, 0, 0)

  // Simulation setup
  simScene = new THREE.Scene()
  simCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1 / Math.pow(2, 53), 1)

  const simGeo = new THREE.BufferGeometry()
  const positions = new Float32Array([
    -1, -1, 0,
    1, -1, 0,
    1, 1, 0,
    -1, -1, 0,
    1, 1, 0,
    -1, 1, 0
  ])
  const uvs = new Float32Array([
    0, 1, 1, 1, 1, 0,
    0, 1, 1, 0, 0, 0
  ])
  simGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  simGeo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))

  const simMat = new SimulationMaterial(planeScale.value)
  simMesh = new THREE.Mesh(simGeo, simMat)
  simScene.add(simMesh)

  renderTarget = new THREE.WebGLRenderTarget(size.value, size.value, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    type: THREE.FloatType,
    depthBuffer: false,
    stencilBuffer: false
  })

  // Particles setup
  const length = size.value * size.value
  const particleData = new Float32Array(length * 3)
  for (let i = 0; i < length; i++) {
    const i3 = i * 3
    particleData[i3 + 0] = (i % size.value) / size.value
    particleData[i3 + 1] = i / size.value / size.value
    particleData[i3 + 2] = 0
  }

  const pointsGeo = new THREE.BufferGeometry()
  pointsGeo.setAttribute('position', new THREE.BufferAttribute(particleData, 3))

  const pointsMat = new DofPointsMaterial()
  if (pointsMat.uniforms?.positions) pointsMat.uniforms.positions.value = renderTarget.texture
  if (pointsMat.uniforms?.initialPositions && simMat.uniforms?.positions) {
    pointsMat.uniforms.initialPositions.value = simMat.uniforms.positions.value
  }

  points = new THREE.Points(pointsGeo, pointsMat)
  scene.add(points)

  // start loop
  revealStartTime.value = null
  isRevealing.value = true
  animationId = requestAnimationFrame(loop)

  window.addEventListener('resize', onResize)
}

function onResize() {
  if (!renderer || !camera || !container.value) return
  const width = container.value.clientWidth || window.innerWidth
  const height = container.value.clientHeight || window.innerHeight

  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

function loop(nowMs: number) {
  if (!renderer || !scene || !camera || !simScene || !simCamera || !simMesh || !renderTarget || !points) return

  const now = useManualTime.value ? manualTime.value : nowMs / 1000

  // Reveal timing
  if (revealStartTime.value === null) revealStartTime.value = now
  const revealElapsed = now - (revealStartTime.value || 0)
  const revealProgress = Math.min(revealElapsed / revealDuration, 1)
  const easedProgress = 1 - Math.pow(1 - revealProgress, 3)
  const revealFactor = easedProgress * 4
  if (revealProgress >= 1 && isRevealing.value) isRevealing.value = false

  // Update sim uniforms
  const simMat = simMesh.material
  if (simMat.uniforms?.uTime) simMat.uniforms.uTime.value = now
  if (simMat.uniforms?.uNoiseScale) simMat.uniforms.uNoiseScale.value = noiseScale.value
  if (simMat.uniforms?.uNoiseIntensity) simMat.uniforms.uNoiseIntensity.value = noiseIntensity.value
  if (simMat.uniforms?.uTimeScale) simMat.uniforms.uTimeScale.value = timeScale.value * speed.value

  // Render simulation to target
  renderer.setRenderTarget(renderTarget)
  renderer.clear()
  renderer.render(simScene, simCamera)
  renderer.setRenderTarget(null)

  // Update points uniforms
  const pointsMat = points.material
  if (pointsMat.uniforms?.uTime) pointsMat.uniforms.uTime.value = now
  if (pointsMat.uniforms?.uFocus) pointsMat.uniforms.uFocus.value = focus.value
  if (pointsMat.uniforms?.uBlur) pointsMat.uniforms.uBlur.value = aperture.value

  if (pointsMat.uniforms?.uTransition) {
    easing.damp(
      pointsMat.uniforms.uTransition,
      'value',
      props.hovering ? 1 : 0,
      props.hovering ? 0.35 : 0.2,
      1 / 60
    )
  }

  if (pointsMat.uniforms?.uPointSize) pointsMat.uniforms.uPointSize.value = pointSize.value
  if (pointsMat.uniforms?.uOpacity) pointsMat.uniforms.uOpacity.value = opacity.value
  if (pointsMat.uniforms?.uRevealFactor) pointsMat.uniforms.uRevealFactor.value = revealFactor
  if (pointsMat.uniforms?.uRevealProgress) pointsMat.uniforms.uRevealProgress.value = easedProgress

  // Render main scene
  renderer.render(scene, camera)

  animationId = requestAnimationFrame(loop)
}

onMounted(() => {
  init()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', onResize)

  if (scene) scene.traverse((obj) => {
    if ((obj as THREE.Mesh).geometry) (obj as THREE.Mesh).geometry.dispose()
    if ((obj as THREE.Mesh).material) {
      const mat = (obj as THREE.Mesh).material as THREE.Material | THREE.Material[]
      // oxlint-disable-next-line no-array-for-each
      if (Array.isArray(mat)) mat.forEach(m => m.dispose())
      else mat.dispose()
    }
  })

  renderTarget?.dispose()
  renderer?.dispose()
  if (renderer?.domElement && renderer.domElement.parentNode) {
    // oxlint-disable-next-line prefer-dom-node-remove
    renderer.domElement.parentNode.removeChild(renderer.domElement)
  }

  scene = null
  simScene = null
  renderer = null
  camera = null
  simCamera = null
  simMesh = null
  renderTarget = null
  points = null
})
</script>

<style scoped>
.gl-container {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
}
</style>
