import React from 'react';
import { deletePin } from '../actions';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Dialog from 'material-ui/Dialog';
import IconButton from '@material-ui/core/IconButton';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import CardMedia from '@material-ui/core/CardMedia';
import FlatButton from 'material-ui/FlatButton';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import ZoomIn from 'material-ui/svg-icons/action/zoom-in';
import red from '@material-ui/core/colors/red';
import { FormattedMessage,injectIntl } from "react-intl";
import Tooltip from '@material-ui/core/Tooltip';





const styles = theme => ({

  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      width: 1230,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  cardGrid: {
    padding: `${theme.spacing.unit * 8}px 0`,
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardContent: {
    flexGrow: 1,
  },
  media: {
    height: 255,
    maxWidth: 400,
    overflow: 'hidden',
    display: 'block',
    width: '100%',
  },
  avatar: {
  backgroundColor: red[500],
},
});

class  PinList extends React.Component {

constructor(){
  super();
  this.state = {
   openDel:false,
   open: false,
   currentImg: '',
   currId:""
 };
 this.handleCloseModal=this.handleCloseModal.bind(this)
}
 handleClickOpen = () => {
   this.setState({ openDel: true });
 };

 handleClose = () => {
   this.setState({ openDel: false });
 };
 handleOpen = img => {
   this.setState({ open: true, currentImg: img });
 };

 handleCloseModal = () => {
   this.setState({ open: false });
 };

 onBrokenImage(ev){
   ev.target.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4g-FP5XzYkRJnVrayJNe5GYGFXBkdM9VlBwyrnkTBuT0rGfY1';
  }

render(){
const {classes}=this.props;
const {pinsUser}=this.props
const {onDelete}=this.props;
const actions = [
  <FlatButton label="Close" primary={true} onClick={this.handleCloseModal} />
];


  if(!pinsUser.length) {
    return (
      <div style={{marginTop:'100px',textAlign:'center'}}>
        No Pins
      </div>
    )
  }
  return (
    <React.Fragment>
    <CssBaseline />
    <main>
    <div className={classNames(classes.layout, classes.cardGrid)}  >
    <Grid container spacing={40}>
      {pinsUser.map(pin => {

        const year= pin.addedOn.split("T")[0].split("-")[0];
        const month= pin.addedOn.split("T")[0].split("-")[1];
        const day= pin.addedOn.split("T")[0].split("-")[2];
        const hour=pin.addedOn.split("T")[1].split(".")[0].split(":")[0]
        const minutes=pin.addedOn.split("T")[1].split(".")[0].split(":")[1]
        const seconds=pin.addedOn.split("T")[1].split(".")[0].split(":")[2]


        var addedOn = new Date(Date.UTC(year,month-1,day, hour, minutes, seconds));
        var date =addedOn.toUTCString();

        return (
      <Grid item key={pin } sm={6} md={4} lg={3} >
        <Card className={classes.card}>
          <CardContent className={classes.cardContent}>
          <CardHeader
            avatar={
              <Avatar className={classes.avatar} aria-label="Recipe" >
                {pin.addedBy.name.substr(0,1).toUpperCase()}
              </Avatar>
            }
            title={pin.description}
            subheader={date}
                    />
            <CardMedia>
                    <img onClick={() => this.handleOpen(pin.url)} style={{cursor:'zoom-in'}} className={classes.media}
                    src={pin.url}
                    alt=""
                    onError={this.onBrokenImage}

                       />
              </CardMedia>
           <Typography>
           <FormattedMessage
                           id="by"
                           defaultMessage="By"
                         />:<strong>{pin.addedBy.name}</strong>
           </Typography>
          <CardActions>
          <Tooltip title="view a pin">
          <IconButton onClick={() =>
             this.handleOpen(pin.url)}>
                  <ZoomIn color="black" />
                </IconButton>
                </Tooltip>
                <Tooltip title="delete a pin">
              <IconButton   aria-label="Delete" size="small" color="primary"  type="button"  onClick={()=>onDelete(pin._id)}>
              <DeleteIcon />
              </IconButton>
              </Tooltip>
          </CardActions>
          </CardContent>
      </Card>
    </Grid>
        );
      })}
      </Grid>
      <Dialog
         actions={actions}
         modal={false}
         open={this.state.open}
         onRequestClose={this.handleCloseModal}
       >
         <img src={this.state.currentImg} alt="" style={{     height: 255,
             maxWidth: 700,
             display: 'block',
             width: '100%', }} />
       </Dialog>
    </div>
    </main>
    </React.Fragment>
  );
}
}
const mapStateToProps = state => {
  return {
    pinsUser:state.pins.pinsUser,
    allPins:state.pins.allPins,
    auth: state.auth

  };
};

const mapDispatchToProps = dispatch => {
  return {
    onDelete: _id => {
      dispatch(deletePin(_id));
    }
  };
};
PinList.propTypes = {
  classes: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired

};

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(PinList)));
