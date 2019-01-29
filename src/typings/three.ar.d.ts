declare module 'three.ar.js' {
  const ARUtils: {
    getARDisplay: () => Promise<VRDisplay | null>
    placeObjectAtHit: (object: Object3D, hit: VRHit, easing = 1, applyOrientation = false) => void
  }

  class ARDebug {
    constructor(vrDisplay: VRDisplay, scene?: any, config?: any)
    getElement: () => HTMLDivElement
  }

  class ARView {
    constructor(vrDisplay: VRDisplay, renderer: any)
    getElement: () => HTMLDivElement
  }

  class ARPerspectiveCamera {
    constructor(vrDisplay: VRDisplay, fov: number, aspect: number, near: number, far: number)
  }

  class ARAnchorManager {
    constructor(vrDisplay: VRDisplay)
  }
}
interface VRDisplay {
  hitTest(x: number, y: number): VRHit
}
