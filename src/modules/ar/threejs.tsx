import * as React from 'react'
import { ARUtils } from 'three.ar.js'

class ThreejsAR extends React.Component {
  private vrDisplay?: VRDisplay

  // private init() {

  // }

  async componentDidMount() {
    try {
      const display = await ARUtils.getARDisplay()
      console.info(display)
      if (display) {
        this.vrDisplay = display
      }
    } catch (e) {
      console.info(e)
    }
  }

  render() {
    return <div>hello threejs</div>
  }
}

export { ThreejsAR }
