import 'antd/dist/antd.css'
import 'three'

import { Provider } from 'mobx-react'
import * as React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { store } from './model'
import { Creator } from './modules/create'
import { ThreejsAR } from './modules/preview'

const App = () => (
  <Provider {...store}>
    <Router>
      <Switch>
        <Route path="/" exact component={Creator} />
        <Route path="/preview" component={ThreejsAR} />
      </Switch>
    </Router>
  </Provider>
)

export { App }
