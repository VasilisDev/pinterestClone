import React, { Component } from 'react';
import PinListPublic from '../containers/PinListPublic';

const stylesApp = {
  marginTop: 40
}

class Home extends Component {
  render() {
    return (
      <div className="container">
        <div className="row" style={ stylesApp }>
          <div className="col-md-6">
              </div>
              </div>
           <PinListPublic />
      </div>

    );
  }
}


export  default Home
