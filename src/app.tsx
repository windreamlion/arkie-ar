import 'antd/dist/antd.css'
import 'three'

import { createBrowserHistory } from 'history'
import { Provider } from 'mobx-react'
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router'
import * as React from 'react'
import { Route, Router, Switch } from 'react-router-dom'

import { store } from './model'
import { Creator } from './modules/create'
import { ThreejsAR } from './modules/preview'

const browserHistory = createBrowserHistory()
const routingStore = new RouterStore()
const history = syncHistoryWithStore(browserHistory, routingStore)

const App = () => (
  <Provider {...store} routing={routingStore}>
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={Creator} />
        <Route path="/preview" component={ThreejsAR} />
      </Switch>
    </Router>
  </Provider>
)

export { App }
