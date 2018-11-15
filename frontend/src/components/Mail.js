import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { sendMail } from '../actions/resetPassword';
import classnames from 'classnames';
import MySnackbarContent from './MySnackbarContent';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';




class Mail extends Component {

    constructor() {
        super();
        this.state = {
            email: '',
            errors: {},
            message:{},
            isLoading:false
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);


    }

    componentDidMount() {
        if(this.props.auth.isAuthenticated) {
            this.props.history.push('/');
        }
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
        this.setState({isLoading:true})
        const user = {
            email: this.state.email
            }
        this.props.sendMail(user);
        this.handleReset();
    }

  handleReset = () => {
    this.setState({
      email: ''
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


    render() {
        const {errors} = this.state;
        const {message} =this.props;
         return(
        <div className="container" style={{ marginTop: '200px'}}>
        {message.info &&  (
          <MySnackbarContent
             variant="info"
             message={message.info}
           />)}

           <Typography component="h2" variant="reset password" gutterBottom style={{marginBottom: '40px'}}>Reset Password</Typography>
            <form onSubmit={ this.handleSubmit } autocomplete="off">
            <Grid item xs={11}>
                <div className="form-group">
                    <OutlinedInput
                    type="email"
                    placeholder="Email"
                    className={classnames('form-control form-control-lg', {
                        'is-invalid': errors.email
                    })}
                    name="email"
                    onChange={ this.handleInputChange }
                    value={ this.state.email }
                    />
                    {errors.email && (<div className="invalid-feedback">{errors.email}</div>)}
                </div>
                <div className="form-group">
                <Button  type="submit" variant="contained" color="primary">
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
Mail.propTypes = {
    sendMail: PropTypes.func.isRequired,
    errors:   PropTypes.object.isRequired,
    message:  PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    errors: state.errors,
    message:state.message,
    auth: state.auth

})

export  default connect(mapStateToProps, { sendMail })(Mail)
