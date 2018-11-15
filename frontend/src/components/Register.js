import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { registerUser } from '../actions/authentication';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import {intlShape, injectIntl} from 'react-intl';
import { FormattedMessage } from "react-intl";
import Grid from '@material-ui/core/Grid';




class Register extends Component {

    constructor() {
        super();
        this.state = {
            name: '',
            email: '',
            password: '',
            password_confirm: '',
            errors: {}
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
        const user = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            password_confirm: this.state.password_confirm
        }
        this.props.registerUser(user, this.props.history);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.auth.isAuthenticated) {
            this.props.history.push('/')
        }
        if(nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
    }

    componentDidMount() {
        if(this.props.auth.isAuthenticated) {
            this.props.history.push('/');
        }
    }
    render() {
        const {formatMessage} = this.props.intl;
        const { errors } = this.state;
        return(
        <div className="container" style={{ marginTop: '200px'}}>
        <Typography component="h2" variant="Registration" gutterBottom style={{marginBottom: '40px'}}><FormattedMessage
                        id="register"
                        defaultMessage="Register"
                      /></Typography>
                      <Grid item xs={11}>
            <form onSubmit={ this.handleSubmit } autocomplete="off">
                <div className="form-group">
                    <OutlinedInput
                    type="text"
                    placeholder={formatMessage({id: 'usernamePlace'})}
                    className={classnames('form-control form-control-lg', {
                        'is-invalid': errors.name
                    })}
                    name="name"
                    onChange={ this.handleInputChange }
                    value={ this.state.name }
                    />
                    {errors.name && (<div className="invalid-feedback">{errors.name}</div>)}
                </div>
                <div className="form-group">
                    <OutlinedInput
                    type="email"
                    placeholder={formatMessage({id: 'emailPlace'})}
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
                    <OutlinedInput
                    type="password"
                    placeholder={formatMessage({id: 'passwordPlace'})}
                    className={classnames('form-control form-control-lg', {
                        'is-invalid': errors.password
                    })}
                    name="password"
                    onChange={ this.handleInputChange }
                    value={ this.state.password }
                    />
                    {errors.password && (<div className="invalid-feedback">{errors.password}</div>)}
                </div>
                <div className="form-group">
                    <OutlinedInput
                    type="password"
                    placeholder={formatMessage({id: 'passwordConfirmPlace'})}
                    className={classnames('form-control form-control-lg', {
                        'is-invalid': errors.password_confirm
                    })}
                    name="password_confirm"
                    onChange={ this.handleInputChange }
                    value={ this.state.password_confirm }
                    />
                    {errors.password_confirm && (<div className="invalid-feedback">{errors.password_confirm}</div>)}
                </div>
                <div className="form-group">
                    <Button  type="submit" variant="contained" color="primary">
                    <FormattedMessage
                                    id="registerBtn"
                                    defaultMessage="Register"
                                  />                    </Button>
                </div>
                <Link to="/Login"><FormattedMessage
                                id="already"
                                defaultMessage="Already Member?"
                              /></Link>

            </form>
            </Grid>

        </div>
        )
    }
}

Register.propTypes = {
    registerUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    intl: intlShape.isRequired

};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default injectIntl(connect(mapStateToProps,{ registerUser })(withRouter(Register)))
