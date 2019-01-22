import { Drawer, Grid } from '@material-ui/core'
import { inject, observer } from 'mobx-react'
import * as React from 'react'

import { Scenario } from '../../model/scenario.model'
import { ScenarioInputs } from '../scenario/scenario.inputs'
import { PosterList } from './poster.list'

interface PosterEditorProps {
  selected?: Scenario
  editing?: boolean
  toggleEditor?: (state: boolean) => void
}

@inject((store: any) => ({
  selected: store.scenarios.selected,
  editing: store.process.editing,
  toggleEditor: store.process.toggleEditState,
}))
@observer
export class PosterEditor extends React.Component<PosterEditorProps> {
  private handleClose = () => {
    const { toggleEditor } = this.props
    toggleEditor && toggleEditor(false)
  }

  render() {
    const { selected, editing = false } = this.props
    if (!selected) return null
    return (
      <>
        <Drawer anchor="bottom" open={editing} onClose={this.handleClose}>
          <ScenarioInputs />
        </Drawer>
        <Grid container wrap="nowrap">
          <PosterList />
        </Grid>
      </>
    )
  }
}
