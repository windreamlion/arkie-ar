import { Matrix4 } from 'three'

export class VRControls {
  private vrDisplay: VRDisplay | null = null
  private standingMatrix = new Matrix4()

  private frameData: VRFrameData | null = null

  private scale = 1
  private standing = false
  private userHeight = 1.6

  constructor(private camera: any, private onError?: any) {
    this.init()
  }

  private async init() {
    if ('VRFrameData' in window) {
      this.frameData = new VRFrameData()
    }
    if (navigator.getVRDisplays) {
      try {
        const displays = await navigator.getVRDisplays()
        this.gotVRDisplays(displays)
      } catch (e) {
        console.warn('THREE.VRControls: Unable to get VR Displays')
      }
    }
  }

  private gotVRDisplays(displays: any[]) {
    if (displays.length > 0) {
      this.vrDisplay = displays[0]
      // console.info('vrd')
    } else {
      this.onError && this.onError('VR input not available.')
    }
  }

  getVRDisplay() {
    return this.vrDisplay
  }

  update() {
    const { vrDisplay, frameData, camera, standing, standingMatrix } = this
    if (vrDisplay) {
      let pose: VRPose | undefined
      if (vrDisplay.getFrameData && frameData) {
        vrDisplay.getFrameData(frameData)
        pose = frameData.pose
      } else if (vrDisplay.getPose) {
        pose = vrDisplay.getPose()
      }
      if (pose) {
        if (pose.orientation !== null) {
          camera.quaternion.fromArray(pose.orientation)
        }

        if (pose.position !== null) {
          camera.position.fromArray(pose.position)
        } else {
          camera.position.set(0, 0, 0)
        }
      }

      if (standing) {
        if (vrDisplay.stageParameters) {
          camera.updateMatrix()
          if (vrDisplay.stageParameters.sittingToStandingTransform) {
            standingMatrix.fromArray(vrDisplay.stageParameters.sittingToStandingTransform)
            camera.applyMatrix(standingMatrix)
          }
        } else {
          camera.postion.setY(camera.position.y + this.userHeight)
        }
      }

      camera.position.multiplyScalar(this.scale)
    }
  }

  dispose() {
    this.vrDisplay = null
  }
}
