import { CssBaseline, Grid } from '@material-ui/core'
import React = require('react')
import styled from 'styled-components'

const Creator = () => (
  <Wrapper container direction="column" wrap="nowrap">
    <CssBaseline />
    {/* <Navigation /> */}
    {/* <StepContainer /> */}
  </Wrapper>
)

const Wrapper = styled(Grid)`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 100%;
`

export { Creator }
