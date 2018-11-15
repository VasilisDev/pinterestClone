import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getToken } from '../actions/resetPassword';
import classnames from 'classnames';
import { resetPassword } from '../actions/resetPassword';
import MySnackbarContent from './MySnackbarContent';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';


class Reset extends Component {

    constructor() {
        super();
        this.state = {

            password: '',
            password_confirm: '',
            errors: {},
            message:{},
            isLoading:false

        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({isLoading:true})

        const user = {
            password: this.state.password,
            password_confirm: this.state.password_confirm,
            token:this.props.match.params
        }
        this.props.resetPassword(user);
        this.handleReset();

    }

    handleReset = () => {
      this.setState({
        password: '',
        password_confirm: ''
          });
    };

    componentWillReceiveProps(nextProps) {

        if(nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
      else  if(nextProps.message) {
            this.setState({
                message: nextProps.message
            });
        }
        this.setState({isLoading:false})
    }
    componentDidMount() {
      const { token } = this.props.match.params;
      this.props.getToken(token);
    }

    render() {
        const { errors } = this.state;
        const {message}=this.props;
      //  const  {token}=this.props.match.params
        return(
        <div className="container" style={{ marginTop: '200px'}}>

        {message.token &&  (
         <MySnackbarContent
                         variant="error"
                message={message.token.error}
              />
       )}

         {message.data &&  (
          <MySnackbarContent
                   variant="success"
                   message={message.data.message}
                 />

        )}

          <Typography component="h2" variant="reset password" gutterBottom style={{marginBottom: '40px'}}>Reset Password</Typography>

            <form onSubmit={ this.handleSubmit } autocomplete="off">
            <Grid item xs={11}>
                <div className="form-group">
                    <OutlinedInput
                    type="password"
                    placeholder="Password"
                    className={classnames('form-control form-control-lg', {
                        'is-invalid': errors.password
                    })}
                    name="password"
                     disabled={message.token}
                    onChange={ this.handleInputChange }
                    value={ this.state.password }
                    />
                    {errors.password && (<div className="invalid-feedback">{errors.password}</div>)}
                </div>
                <div className="form-group">
                    <OutlinedInput
                    type="password"
                    placeholder="Confirm Password"
                    className={classnames('form-control form-control-lg', {
                        'is-invalid': errors.password_confirm
                    })}
                    name="password_confirm"
                    onChange={ this.handleInputChange }
                    value={ this.state.password_confirm }
                     disabled={message.token}
                    />
                    {errors.password_confirm && (<div className="invalid-feedback">{errors.password_confirm}</div>)}
                </div>
                <div className="form-group">
                <Button  type="submit" variant="contained" color="primary" disabled={message.token}>
          {this.state.isLoading &&(<CircularProgress color="inherit"  />) }
          {!this.state.isLoading && 'submit'}
                    </Button>
                </div>
                </Grid>
            </form>
        </div>
        )
    }
}

Reset.propTypes = {
    getToken:PropTypes.func.isRequired,
    errors:PropTypes.object.isRequired,
    message:PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  errors: state.errors,
  message:state.message
});

  const mapDispatchToProps = {
    getToken, // will be wrapped into a dispatch call
    resetPassword, // will be wrapped into a dispatch call
  };

export  default connect(mapStateToProps,mapDispatchToProps)(Reset)
