import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from '../actions/authentication';
import { withRouter } from 'react-router-dom';
import CameraIcon from '@material-ui/icons/PhotoCamera';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { setLocale } from "../actions/locale";
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { FormattedMessage } from "react-intl";
import Avatar from '@material-ui/core/Avatar';
import Hidden from '@material-ui/core/Hidden';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Flag from 'react-world-flags'





class Navbar extends Component {

  constructor(){
    super()
    this.state={
      value: 'lang'
    };
    this.onChangeLang=this.onChangeLang.bind(this);
  }
    onLogout(e) {
        e.preventDefault();
          this.props.logoutUser(this.props.history);
    }
    onChangeLang(event) {
      this.setState({value: event.target.value});
      this.props.setLocale(event.target.value)
    }

    render() {
      const {  lang } = this.props;
        const {isAuthenticated, user} = this.props.auth;
        const userAvatar= isAuthenticated ? user.name : 'user';
        const authLinks = (

            <div >
            <Tooltip title="my profile">
            <Button variant="outlined" style={{margin:'5px'}}><Link style={{  textDecoration:'none'}}  to="/myprofil"><FormattedMessage
                            id="myprofile"
                            defaultMessage="My profile"
                          /></Link></Button >
                          </Tooltip>
                <FormControl >
                <Tooltip title="language">
                         <Select style={{margin:'5px'}}
                           onChange={this.onChangeLang}
                           value={this.state.value}
                           inputProps={{
                             name: 'lang',
                             id: 'demo-controlled-open-select',
                           }}
                         >
                           <MenuItem disabled value="lang"><em>{lang}</em></MenuItem>
                           <MenuItem value='en'>en</MenuItem>
                           <MenuItem value='el'>el</MenuItem>
                         </Select>
                         </Tooltip>
                       </FormControl>
                       <Tooltip title="logout">
                    <Button style={{margin:'5px'}} onClick={this.onLogout.bind(this)}><Avatar>{userAvatar.substr(0,1).toUpperCase()}</Avatar></Button>
                     </Tooltip>
                     <Flag code={user.code} height="16"  />

            </div>
        )
      const guestLinks = (
        <div >
        <Tooltip title="register">
                  <Button  style={{margin:'5px'}} color="primary" variant="outlined" ><Link style={{  textDecoration:'none'}}  to="/register"><FormattedMessage
                                id="registerNav"
                                defaultMessage="Sign up"
                              /></Link></Button>
                              </Tooltip>
                              <Tooltip title="login">
            <Button  style={{margin:'5px'}} color="primary" variant="outlined"><Link style={{  textDecoration:'none'}} to="/login"><FormattedMessage
                            id="loginNav"
                            defaultMessage="Sign in"
                          /></Link></Button>
                          </Tooltip>
            <FormControl >
            <Tooltip title="language">
                     <Select style={{margin:'5px'}}
                       onChange={this.onChangeLang}
                       value={this.state.value}
                       inputProps={{
                         name: 'lang',
                         id: 'demo-controlled-open-select',
                       }}
                     >
                       <MenuItem disabled value="lang"><em>{lang}</em></MenuItem>
                       <MenuItem value='en'>en</MenuItem>
                       <MenuItem value='el'>el</MenuItem>
                     </Select>
                     </Tooltip>
                   </FormControl>

                     </div>
      )
        return(
          <AppBar position="fixed" color="default"  style={{flexGrow: 1}}>
          <Toolbar>
          <Typography variant="h6" color="inherit" noWrap style={{flex:1}} ><Link className="navbar-brand" to="/"> <Hidden only="sm">
Pinterest Clone</Hidden><CameraIcon/></Link></Typography>
                    {isAuthenticated ? authLinks : guestLinks}
                </Toolbar>
            </AppBar>
        )
    }
}
Navbar.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    setLocale: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,


}

const mapStateToProps = (state) => ({
    auth: state.auth,
    lang: state.locale.lang,

})

export default connect(mapStateToProps, { logoutUser,setLocale  })(withRouter(Navbar));
