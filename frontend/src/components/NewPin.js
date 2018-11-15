import React from 'react';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import SaveIcon from '@material-ui/icons/Save';
import ThreeSixtyIcon from '@material-ui/icons/ThreeSixty';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { injectIntl} from 'react-intl';
import { FormattedMessage } from "react-intl";
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';





function getModalStyle() {
  const top = 50 ;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  },
  button: {
   margin: theme.spacing.unit,
 },
 fab: {
  position: 'fixed',
  zIndex: 1,
  bottom: 10,
  left:0,
  right: 800
}
});

class NewPin extends React.Component {
  constructor(){
    super();
    this.state = {
    url: '',
    description: '',
    openAddModal: false,
    errors: {},
    flag:false

    };
}
  handleOpenAddModal = () => {
    this.setState({ openAddModal: true });
  };

  handleCloseAddModal = () => {
    this.setState({ openAddModal: false });
  };

  handleInputChange = e => {
    if (!!this.state.errors[e.target.name]) {
      let errors = Object.assign({}, this.state.errors);
      delete errors[e.target.name];
      this.setState({
        [e.target.name]: e.target.value,
        errors,
        flag:false
      });
    }
    else{
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  };

  handleSubmit = e => {
    e.preventDefault();

    const { url, description } = this.state;
      this.props.onAddPin({ url, description })
      this.handleReset();

      if(JSON.stringify(this.state.erros) === "{}"){
           this.setState({openAddModal: false })
         }
  };

  handleReset = () => {
    this.setState({
      url: '',
      description: ''
    });
  };

  componentWillReceiveProps(nextProps) {

    if(nextProps.errors) {
        this.setState({
            errors: nextProps.errors,
            flag:true
        });
    }

    else  if(nextProps.message) {

          this.setState({
              message: nextProps.message
          });
      }
  }

  render() {
    const { classes } = this.props;
    const {errors}=this.state;
    const {formatMessage} = this.props.intl;

    return (
      <div>
      <Grid item xs={2}>
      <Tooltip title="add pin">
            <Button  color='primary'  variant="fab" className={classes.fab} onClick={this.handleOpenAddModal}><AddIcon /></Button>
</Tooltip>
            <Modal
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
              open={this.state.openAddModal}
              onClose={this.handleCloseAddModal}
contentStyle={{maxWidth: 100}}            >
              <div style={getModalStyle()} className={classes.paper}>
              <div >
              <Grid item xs={12}>
                  <form  onSubmit={ this.handleSubmit }>


                <div className="form-group">

                  <Typography gutterBottom><FormattedMessage
                                  id="add"
                                  defaultMessage="Add a pin"
                                />
                                </Typography>
                      <OutlinedInput
                      type="text"
                      placeholder={formatMessage({id: 'urlPlace'})}
                      className="form-control"
                      name="url"
                      onChange={ this.handleInputChange }
                      value={ this.state.url }
                      className={classNames('form-control form-control-lg', {
                          'is-invalid': errors.url
                      })}
                    />
                    {errors.url && (<div className="invalid-feedback">{errors.url}</div>)}


                  </div>
                  <div className="form-group">
                    <OutlinedInput
                      type="text"
                      placeholder={formatMessage({id: 'descPlace'})}
                      className="form-control"
                      name="description"
                      onChange={ this.handleInputChange }
                      value={ this.state.description }
                      className={classNames('form-control form-control-lg', {
                          'is-invalid': errors.description
                      })}
                    />
                    {errors.description && (<div className="invalid-feedback">{errors.description}</div>)}

                  </div>
                  <div className="form-group">
                  <Button type="submit" variant="contained" size="medium">
                        <SaveIcon />
                        <FormattedMessage
                                        id="save"
                                        defaultMessage="SAVE"
                                      />
                      </Button>
                        <Button type="button" variant="contained" size="medium" onClick={ this.handleReset }>
                        <FormattedMessage
                                        id="reset"
                                        defaultMessage="RESET"
                                      />
                                      <ThreeSixtyIcon  />
                       </Button>
                    </div>
                  </form>
                  </Grid>
                 </div>
               </div>
            </Modal>
            </Grid>
          </div>
    );
  }
}

NewPin.propTypes = {
  classes: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired

};

const mapStateToProps = (state) => ({
    errors: state.errors
})

export default  injectIntl(connect(mapStateToProps, null)(withStyles(styles)(NewPin)));
