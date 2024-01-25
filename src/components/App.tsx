import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'

import { store } from '../store'

import Menu from './Categories'
import Category from './Category'
import History from './History'
import Loader from './Loader'
import Login from './Login'
import NewOrder from './NewOrder'
import Order from './Order'
import Orders from './Orders'
import RefreshToken from './RefreshToken'

const App = (): JSX.Element => (
  <Provider store={store}>
    <Router>
      <RefreshToken>
        <NewOrder />
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/orders">
            <Orders />
          </Route>
          <Route path="/history">
            <History />
          </Route>
          <Route path="/menu">
            <Menu />
          </Route>
          <Route path="/category">
            <Category />
          </Route>
          <Route path="/loader">
            <Loader />
          </Route>
          <Route path="/order/:orderId">
            <Order />
          </Route>
          <Redirect to="/orders" />
        </Switch>
      </RefreshToken>
    </Router>
  </Provider>
)

export default App
