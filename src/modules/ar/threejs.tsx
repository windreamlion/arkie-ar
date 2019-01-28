import { observer } from 'mobx-react'
import * as React from 'react'
import { createGlobalStyle } from 'styled-components'
import { BoxGeometry, Color, Mesh, MeshBasicMaterial, Scene, VertexColors, WebGLRenderer } from 'three'
import { ARDebug, ARPerspectiveCamera, ARUtils, ARView } from 'three.ar.js'

import { VRControls } from './vrControls'

@observer
class ThreejsAR extends React.Component {
  private vrDisplay?: VRDisplay

  private vrFrameData?: any

  private arView?: any

  private renderer?: WebGLRenderer

  private scene?: any

  private camera?: any

  private vrControls?: VRControls

  private cube?: any

  private init(display: VRDisplay) {
    this.renderer = new WebGLRenderer({ alpha: true })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    console.log('setRenderer size', window.innerWidth, window.innerHeight)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.autoClear = false
    const canvas = this.renderer.domElement

    this.scene = new Scene()

    this.arView = new ARView(display, this.renderer)

    const arDebug = new ARDebug(display, this.scene)

    document.body.appendChild(arDebug.getElement())
    document.body.appendChild(canvas)
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

    this.vrControls = new VRControls(this.camera)

    const colors = [
      new Color(0xffffff),
      new Color(0xffff00),
      new Color(0xff00ff),
      new Color(0xff0000),
      new Color(0x00ffff),
      new Color(0x00ff00),
      new Color(0x0000ff),
      new Color(0x000000),
    ]

    const geometry = new BoxGeometry(0.05, 0.05, 0.05)
    const faceIndices = ['a', 'b', 'c']
    for (var i = 0; i < geometry.faces.length; i++) {
      var f = geometry.faces[i]
      for (var j = 0; j < 3; j++) {
        var vertexIndex = f[faceIndices[j]]
        f.vertexColors[j] = colors[vertexIndex]
      }
    }
    var material = new MeshBasicMaterial({
      vertexColors: VertexColors,
    })
    this.cube = new Mesh(geometry, material)
    this.scene.add(this.cube)

    // this.camera.position.z = 10

    this.update()
  }

  private update = () => {
    const { vrDisplay, vrControls } = this
    this.arView.render()

    this.camera.updateProjectionMatrix()

    vrDisplay && vrDisplay.getFrameData(this.vrFrameData)

    this.cube.rotation.x += 0.05
    this.cube.rotation.y += 0.05

    vrControls && vrControls.update()

    if (this.renderer) {
      this.renderer.clearColor()
      this.renderer.clearDepth()
      this.renderer.render(this.scene, this.camera)
    }

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
