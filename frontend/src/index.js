import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';
import {addLocaleData} from 'react-intl';
import el from 'react-intl/locale-data/el';
import en from 'react-intl/locale-data/en';

import { setCurrentUser, logoutUser } from './actions/authentication';
import {fetchAllPins,fetchAllUserPins} from './actions/index'


import store from './store';
import jwt_decode from 'jwt-decode';
import setAuthToken from './setAuthToken';
import { Provider } from 'react-redux';
import { localeSet } from "./actions/locale";



store.dispatch(fetchAllPins());
addLocaleData(en);
addLocaleData(el);


if(localStorage.jwtToken){
  setAuthToken(localStorage.jwtToken);
  const decoded = jwt_decode(localStorage.jwtToken);
  store.dispatch(setCurrentUser(decoded));
  store.dispatch(fetchAllUserPins());



  const currentTime = Date.now() / 1000;
  if(decoded.exp < currentTime) {
    store.dispatch(logoutUser());
    window.location.href = '/login'
  }
}
if (localStorage.lang) {
  store.dispatch(localeSet(localStorage.lang));
}


ReactDOM.render(
  <Provider store = { store }>
  <Router>
     <App />
   </Router>
  </Provider>
  , document.getElementById('root'));
registerServiceWorker();
