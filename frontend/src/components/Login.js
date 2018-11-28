import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginUser } from '../actions/authentication';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import {intlShape, injectIntl} from 'react-intl';
import { FormattedMessage } from "react-intl";
import MySnackbarContent from './MySnackbarContent';
import Grid from '@material-ui/core/Grid';





class Login extends Component {

    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            errors: {},
            isLoading:false,
            showPassword: false

        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(e) {
      if (!!this.state.errors[e.target.name]) {
        let errors = Object.assign({}, this.state.errors);
        delete errors[e.target.name];
        this.setState({
          [e.target.name]: e.target.value,
          errors
        });
      }
      else{
      this.setState({
        [e.target.name]: e.target.value
      });
    }
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({
            isLoading:true
        })
        const user = {
            email: this.state.email,
            password: this.state.password,
        }
        this.props.loginUser(user);
    }

    componentDidMount() {
        if(this.props.auth.isAuthenticated) {
            this.props.history.push('/');
        }
    }

    componentWillReceiveProps(nextProps) {

        if(nextProps.auth.isAuthenticated) {
           this.props.history.push('/');
        }

        else if(nextProps.errors) {
            this.setState({
                errors: nextProps.errors,
                isLoading:false
            });
        }
    }
    handleClickShowPassword = () => {
       this.setState(state => ({ showPassword: !state.showPassword }));
     };


    render() {
        const {errors} = this.state;
        const {formatMessage} = this.props.intl;

        return(

        <div className="container" style={{ marginTop: '200px'}}>

        {errors.block &&  (
          <MySnackbarContent
             variant="error"
             message={errors.block}
           />)}
           {errors.badCredentials &&  (
             <MySnackbarContent
                variant="error"
                message={errors.badCredentials}
              />)}
         <Typography  component="h2" variant="login"  gutterBottom style={{marginBottom: '40px'}}> <FormattedMessage
                         id="loginId"
                         defaultMessage="Login"
                       />
          </Typography>

            <form style={{width: '100%'}}onSubmit={ this.handleSubmit } autocomplete="off" fullWidth>
            <Grid item xs={11}>
                <div className="form-group">
                    <OutlinedInput
                    type="email"
                    placeholder={formatMessage({id: 'emailPlace'})}
                    className={classNames('form-control form-control-lg', {
                        'is-invalid': errors.email
                    })}
                    name="email"
                    onChange={ this.handleInputChange }
                    value={ this.state.email }
                    />
                    {errors.email && (<div className="invalid-feedback">{errors.email}</div>)}
                </div>
                <div className="form-group">
                    <OutlinedInput
                    type={this.state.showPassword ? 'text' : 'password'}
                    placeholder={formatMessage({id: 'passwordPlace'})}
                    className={classNames('form-control form-control-lg', {
                        'is-invalid': errors.password
                    })}
                    name="password"
                    onChange={ this.handleInputChange }
                    value={ this.state.password }
                    endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="Toggle password visibility"
                onClick={this.handleClickShowPassword}
              >
                {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
                   />
                   {errors.password && (<div className="invalid-feedback">{errors.password}</div>)}

                </div>
                <div className="form-group">
                    <Button  type="submit" variant="contained" color="primary" >
                    {this.state.isLoading &&(<CircularProgress color="inherit" size={30}  />) }
                    {!this.state.isLoading && <FormattedMessage
                                    id="loginBtn"
                                    defaultMessage="Login"
                                  />
                                } </Button>
                </div>
                <Link to="/mail"> <FormattedMessage
                                id="forgot"
                                defaultMessage="Forgot Password?"
                              /></Link>
                              </Grid>
            </form>
        </div>

        )
    }
}

Login.propTypes = {
    loginUser: PropTypes.func.isRequired,
    auth:   PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    intl: intlShape.isRequired

}

const mapStateToProps = (state) => ({
    auth: state.auth,
    errors: state.errors,
    classes: PropTypes.object.isRequired,

})

export  default injectIntl(connect(mapStateToProps, { loginUser })(Login))
