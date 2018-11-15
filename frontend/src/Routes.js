import React, { Component } from 'react';
import { Route,Switch } from 'react-router-dom';

import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import Main from './components/Main';
import Mail from './components/Mail';
import Reset from './components/Reset';
import NotFound from './components/NotFound';



import requireAuth from './utils/requireAuth';

class Routes extends Component {
  render() {
    return (

<div className="container">
<Switch>
  <Route exact path="/" component={ Home } />
  <Route exact path="/myprofil" component={requireAuth(Main)} />
  <Route exact path="/mail" component={ Mail } />
  <Route exact path="/reset/:token" component={ Reset } />
  <Route exact path="/register" component={ Register } />
  <Route exact path="/login" component={ Login } />
  <Route exact path="*" component={NotFound} />
  </Switch>
</div>

);
  }
}



export default Routes;
