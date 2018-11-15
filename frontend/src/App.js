import React, { Component } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Routes from "./Routes";
import {IntlProvider} from 'react-intl';
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withRouter  } from 'react-router-dom';
import { fetchAllPins } from './actions/index';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


import 'bootstrap/dist/css/bootstrap.min.css';
import messages from "./messages";



class App extends Component {

  componentDidMount() {
    if (this.props.isAuthenticated) this.props.fetchAllPosts();
  }

  render() {
    const {  lang } = this.props;

    return (
      <MuiThemeProvider>
      <IntlProvider locale={lang} messages={messages[lang]}>
            <div>
              <Navbar />
              <Routes />
              <Footer/>
            </div>
    </IntlProvider>
    </MuiThemeProvider>


    );
  }
}
App.propTypes = {
  lang: PropTypes.string.isRequired,
  auth: PropTypes.object.isRequired

};



const mapStateToProps = (state) => ({
  lang: state.locale.lang,
  auth: state.auth
})

export default withRouter(connect(mapStateToProps, {fetchAllPins})(App));
