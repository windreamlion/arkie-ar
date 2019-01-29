import { sample } from 'lodash'
import { action, observable } from 'mobx'
import { inject, observer } from 'mobx-react'
import * as React from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import { Mesh, MeshBasicMaterial, Object3D, PlaneGeometry, Scene, TextureLoader, WebGLRenderer } from 'three'
import { ARDebug, ARPerspectiveCamera, ARUtils, ARView } from 'three.ar.js'

import { Poster } from '../../model/posters'
import { VRControls } from './vrControls'

interface ThreejsARProps {
  list: Poster[]
}

@inject((store: any) => ({
  list: store.posters.list,
}))
@observer
class ThreejsAR extends React.Component<ThreejsARProps> {
  private poster?: Poster

  private vrDisplay?: VRDisplay

  private vrFrameData?: any

  private arView?: any

  private renderer?: WebGLRenderer

  @observable.ref
  private curWidth: number = 0

  @observable.ref
  private curHeight: number = 0

  private scene?: any

  private camera?: any

  private vrControls?: VRControls

  private imagePlane?: Object3D
  private imagePlaneGeometry?: PlaneGeometry

  @action.bound
  private async init(display: VRDisplay) {
    this.renderer = new WebGLRenderer({ alpha: true })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    console.log('setRenderer size', window.innerWidth, window.innerHeight)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.autoClear = false
    const canvas = this.renderer.domElement

    this.scene = new Scene()

    this.arView = new ARView(display, this.renderer)

    const arDebug = new ARDebug(display, this.scene, {
      showPoseStatus: true,
      showLastHit: true,
      // showPlanes: true,
    })

    document.body.appendChild(arDebug.getElement())
    document.body.appendChild(canvas)

    this.camera = new ARPerspectiveCamera(
      display,
      60,
      window.innerWidth / window.innerHeight,
      display.depthNear,
      display.depthFar,
    )

    this.vrControls = new VRControls(this.camera)

    if (this.poster) {
      const loader = new TextureLoader()
      const texture = await loader.load(this.poster.url!)
      const geometry = new PlaneGeometry(
        this.poster.size!.width / (100 * 28),
        this.poster.size!.height / (100 * 28),
        1,
        1,
      )

      this.curWidth = parseInt((this.poster.size!.width / 28) as any)
      this.curHeight = parseInt((this.poster.size!.height / 28) as any)
      const material = new MeshBasicMaterial({
        map: texture,
      })

      this.imagePlane = new Mesh(geometry, material)
      this.imagePlane.position.set(0, 0, 0)
      this.imagePlane.rotation.set(-Math.PI / 2, 0, 0)
      this.imagePlaneGeometry = geometry
      this.scene.add(this.imagePlane)
    }

    // const light = new PointLight(0xffffff, 1, 0)

    // Specify the light's position
    // light.position.set(1, 1, 100)

    // Add the light to the scene
    // this.scene.add(light)
    // this.camera.position.z = 10
    if (this.imagePlane && this.vrDisplay) {
      canvas.addEventListener('touchstart', this.touchStart(this.imagePlane, this.vrDisplay), false)
      canvas.addEventListener('touchmove', this.touchMove(this.imagePlane, this.vrDisplay), false)
    }
    this.update()
  }

  move = (obj: Object3D, vrDisplay: VRDisplay, e: TouchEvent) => {
    const x = e.touches[0].pageX / window.innerWidth
    const y = e.touches[0].pageY / window.innerHeight

    const hits = vrDisplay.hitTest(x, y)

    if (hits && hits.length) {
      const hit = hits[0]
      ARUtils.placeObjectAtHit(obj, hit, 1, false)
    }
  }

  private touchMove = (obj: Object3D, vrDisplay: VRDisplay) => (e: TouchEvent) => {
    if (!e.touches[0]) {
      return
    }

    if (e.touches.length > 1) {
    } else {
      this.move(obj, vrDisplay, e)
    }
  }

  spawn = (obj: Object3D, vrDisplay: VRDisplay, x: number, y: number) => {
    const hits = vrDisplay!.hitTest(x, y)

    if (hits && hits.length) {
      const hit = hits[0]

      ARUtils.placeObjectAtHit(obj, hit, 1, false)
    }
  }

  getLen = (x: number, y: number) => Math.sqrt(x ** 2 + y ** 2)

  toZoomScale = (touches: TouchList) => {
    const [{ pageX: x1, pageY: y1 }, { pageX: x2, pageY: y2 }] = Array.from(touches)

    return this.getLen(x1 - x2, y1 - y2)
  }

  toAngle = (x1: number, y1: number, x2: number, y2: number) => {
    const mr = this.getLen(x1, y1) * this.getLen(x2, y2)
    if (mr === 0) return 0

    const r = Math.min((x1 * x2 + y1 * y2) / mr, 1)
    return Math.acos(r)
  }

  toRotateAngle = (touches: TouchList) => {
    const [{ pageX: x1, pageY: y1 }, { pageX: x2, pageY: y2 }] = Array.from(touches)

    let angle = this.toAngle(x1, y1, x2, y2)
    if (x1 * y2 - x2 * y1 > 0) angle *= -1
    return (angle * 180) / Math.PI
  }

  @action.bound
  startZoom = (touches: TouchList) => {
    const base = this.toZoomScale(touches)
    let lastScale = 1

    const exec = (e: TouchEvent) => {
      const re = 1 / lastScale
      this.imagePlaneGeometry!.scale(re, re, 1)

      const factor = this.toZoomScale(e.touches)
      const scale = factor / base
      lastScale = scale
      this.curWidth = parseInt(((this.poster!.size!.width * scale) / 28) as any)
      this.curHeight = parseInt(((this.poster!.size!.height * scale) / 28) as any)
      this.imagePlaneGeometry!.scale(scale, scale, 1)
    }
    const destroy = () => {
      this.renderer!.domElement.removeEventListener('touchend', destroy, false)
      this.renderer!.domElement.removeEventListener('touchmove', exec, false)
    }
    this.renderer!.domElement.addEventListener('touchmove', exec, false)
    this.renderer!.domElement.addEventListener('touchend', destroy, false)
  }

  startRotate = (touches: TouchList) => {
    const base = this.toRotateAngle(touches)
    let lastRotate = 0

    const exec = (e: TouchEvent) => {
      const factor = this.toRotateAngle(e.touches)
      const angle = factor - base

      this.imagePlaneGeometry!.rotateZ(-(angle - lastRotate) / Math.PI / 4)
      lastRotate = angle
    }
    const destroy = () => {
      this.renderer!.domElement.removeEventListener('touchend', destroy, false)
      this.renderer!.domElement.removeEventListener('touchmove', exec, false)
    }
    this.renderer!.domElement.addEventListener('touchmove', exec, false)
    this.renderer!.domElement.addEventListener('touchend', destroy, false)
  }

  private touchStart = (obj: Object3D, vrDisplay: VRDisplay) => (e: TouchEvent) => {
    const { touches } = e

    if (touches.length === 1) {
      const { pageX, pageY } = touches[0]
      const x = pageX / window.innerWidth
      const y = pageY / window.innerHeight
      this.spawn(obj, vrDisplay, x, y)
    }

    if (touches.length === 2) {
      this.startZoom(touches)
      this.startRotate(touches)
    }
  }

  private update = () => {
    const { vrDisplay, vrControls } = this
    this.arView.render()

    this.camera.updateProjectionMatrix()

    vrDisplay && vrDisplay.getFrameData(this.vrFrameData)

    vrControls && vrControls.update()

    if (this.renderer) {
      this.renderer.clearColor()
      this.renderer.clearDepth()
      this.renderer.render(this.scene, this.camera)
    }

    requestAnimationFrame(this.update)
  }

  async componentDidMount() {
    const posterList = this.props.list.filter((item) => item.selected === true)
    this.poster = sample(posterList)
    try {
      const display = await ARUtils.getARDisplay()
      console.info(display, this.poster)
      if (display && this.poster) {
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
        <San>
          {this.curWidth}cm x {this.curHeight}cm
        </San>
      </>
    )
  }
}

const GlobalStyle = createGlobalStyle`
  body {
    background: transparent;
  }
`

const San = styled.span`
  width: auto;
  background: #555;
  color: #fff;
`

export { ThreejsAR }
