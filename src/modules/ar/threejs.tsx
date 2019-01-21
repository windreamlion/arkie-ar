import * as React from 'react'
import { createGlobalStyle } from 'styled-components'
import * as THREE from 'three'
import { ARDebug, ARPerspectiveCamera, ARUtils, ARView } from 'three.ar.js'

class ThreejsAR extends React.Component {
  private vrDisplay?: VRDisplay

  private vrFrameData?: any

  private arView?: any

  private renderer?: any

  private scene?: any

  private camera?: any

  private cube?: any

  private init(display: VRDisplay) {
    const arDebug = new ARDebug(display)
    document.body.appendChild(arDebug.getElement())

    this.renderer = new THREE.WebGLRenderer({ alpha: true })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    console.log('setRenderer size', window.innerWidth, window.innerHeight)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.autoClear = false
    const canvas = this.renderer.domElement
    document.body.appendChild(canvas)

    this.scene = new THREE.Scene()

    this.arView = new ARView(display, this.renderer)

    // this.camera = new THREE.PerspectiveCamera(
    //   60,
    //   window.innerWidth / window.innerHeight,
    //   display.depthNear,
    //   display.depthFar,
    // )
    this.camera = new ARPerspectiveCamera(
      display,
      60,
      window.innerWidth / window.innerHeight,
      display.depthNear,
      display.depthFar,
    )
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    this.cube = new THREE.Mesh(geometry, material)
    // this.scene.add(this.cube)

    // this.camera.position.z = 10

    this.update()
  }

  private update = () => {
    this.renderer.clearColor()

    this.arView.render()

    this.camera.updateProjectionMatrix()

    this.vrDisplay && this.vrDisplay.getFrameData(this.vrFrameData)

    // this.cube.rotation.x += 0.01
    // this.cube.rotation.y += 0.01

    this.renderer.clearDepth()
    this.renderer.render(this.scene, this.camera)

    requestAnimationFrame(this.update)
  }

  async componentDidMount() {
    try {
      const display = await ARUtils.getARDisplay()
      console.info(display)
      if (display) {
        this.vrFrameData = new VRFrameData()
        this.vrDisplay = display
        this.init(this.vrDisplay)
      }
    } catch (e) {
      console.info(e)
    }
  }

  render() {
    return (
      <>
        <GlobalStyle />
        <div>hello threejs</div>
      </>
    )
  }
}

const GlobalStyle = createGlobalStyle`
  body {
    background: transparent;
  }
`

export { ThreejsAR }
