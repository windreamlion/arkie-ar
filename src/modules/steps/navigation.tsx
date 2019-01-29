import { AppBar, Fab, IconButton, Tab, Toolbar } from '@material-ui/core'
import AddToPhotosRounded from '@material-ui/icons/AddToPhotosRounded'
import CameraFront from '@material-ui/icons/CameraFront'
import { inject, observer } from 'mobx-react'
import * as React from 'react'

interface navigationProps {
  step?: 1 | 2 | 3
  onStepChange?: (step?: number) => void
  scenario?: any
  toggleEditor?: (state: boolean) => void
  routing?: any
}

@inject((store: any) => ({
  step: store.process.step,
  scenario: store.scenarios.selected,
  onStepChange: store.process.changeStep,
  toggleEditor: store.process.toggleEditState,
  routing: store.routing,
}))
@observer
export class Navigation extends React.Component<navigationProps> {
  private openEditor = () => {
    const { toggleEditor } = this.props
    toggleEditor && toggleEditor(true)
  }

  private gotoPreview = () => {
    const { routing } = this.props
    if (routing) {
      const { push } = routing
      push && push('/preview')
    }
  }

  renderInputStep() {
    const { scenario } = this.props
    const disabled = scenario ? false : true
    return <Tab label="选择输入" disabled={disabled} />
  }
  render() {
    return (
      <AppBar position="fixed" color="primary" style={{ top: 'auto', bottom: 0 }}>
        <Toolbar style={{ alignItems: 'center', justifyContent: 'flex-end' }}>
          <IconButton color="inherit" aria-label="Open drawer" onClick={this.gotoPreview}>
            <CameraFront />
          </IconButton>
          <Fab
            color="secondary"
            aria-label="Add"
            style={{ position: 'absolute', zIndex: 1, top: -30, left: 0, right: 0, margin: '0 auto' }}
            onClick={this.openEditor}
          >
            <AddToPhotosRounded />
          </Fab>
        </Toolbar>
      </AppBar>
    )
  }
}
