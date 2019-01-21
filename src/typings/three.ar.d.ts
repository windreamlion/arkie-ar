declare module 'three.ar.js' {
  const ARUtils: {
    getARDisplay: () => Promise<VRDisplay | null>
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
