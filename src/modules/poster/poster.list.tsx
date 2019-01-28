import { Grid, IconButton } from '@material-ui/core'
import { CheckCircleOutlined, Delete } from '@material-ui/icons'
import { inject, observer } from 'mobx-react'
import * as React from 'react'
import styled from 'styled-components'

import { Poster, PosterStatus } from '../../model/posters'

interface PosterListProps {
  list?: Poster[]
  deletePoster?: (posterId: string) => void
  toggleSelected?: (posterId: string, selected: boolean) => void
}

@inject((store: any) => ({
  list: store.posters.list,
  deletePoster: store.posters.delete,
  toggleSelected: store.posters.toggleSelectedById,
}))
@observer
export class PosterList extends React.Component<PosterListProps> {
  private handleClick(e: React.MouseEvent<HTMLElement>, id: string) {
    e.stopPropagation()
    const { deletePoster } = this.props
    deletePoster && deletePoster(id)
  }

  private handleSelect(id: string, selected: boolean) {
    const { toggleSelected } = this.props
    toggleSelected && toggleSelected(id, selected)
  }

  private renderItems() {
    const { list = [] } = this.props
    return (
      <Grid container style={{ padding: '10px 10px 50px 10px' }}>
        {list.map((item) => {
          const { url, posterId, status, selected = false } = item
          return (
            <Grid
              item
              key={posterId}
              xs={6}
              md={6}
              lg={2}
              style={{ position: 'relative', padding: 10 }}
              onClick={() => this.handleSelect(posterId, !selected)}
            >
              {
                <SelectedTip selected={selected}>
                  <CheckCircleOutlined style={{ fontSize: 48, color: '#a1d807' }} />
                </SelectedTip>
              }
              <Grid container style={{ position: 'absolute', top: 0, left: 0, height: 50 }} justify="flex-end">
                {status === PosterStatus.CREATED && !selected && (
                  <IconButton aria-label="Delete" onClick={(e) => this.handleClick(e, posterId)}>
                    <Delete fontSize="small" />
                  </IconButton>
                )}
              </Grid>
              <img src={url} style={{ width: '100%' }} />
            </Grid>
          )
        })}
      </Grid>
    )
  }

  render() {
    return <>{this.renderItems()}</>
  }
}

const SelectedTip = styled.div<{ selected: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 10px;
  left: 10px;
  width: calc(100% - 20px);
  height: calc(100% - 20px);
  background: rgba(0, 13, 153, 0.9);
  opacity: ${({ selected }) => (selected ? 0.9 : 0)};
  transition: all 0.3s ease-out;
`
