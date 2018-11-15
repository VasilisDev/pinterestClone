import React, { Component } from 'react';
import CreatePin from '../containers/CreatePin';
import PinList from '../containers/PinList';

const stylesApp = {
  marginTop: 40
}

class Main extends Component {

  render() {
    return (
      <div className="container">
        <div className="row" style={ stylesApp }>
          <div className="col-md-6">
            <CreatePin />
              </div>
              </div>
           <PinList />
      </div>

    );
  }
}


export  default Main
