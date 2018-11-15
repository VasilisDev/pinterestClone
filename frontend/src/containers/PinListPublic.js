import React from 'react';
import { connect } from 'react-redux';
import { likePin,unlikePin } from '../actions';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import IconButton from 'material-ui/IconButton';
import ZoomIn from 'material-ui/svg-icons/action/zoom-in';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import FavoriteIcon from '@material-ui/icons/Favorite';
import red from '@material-ui/core/colors/red';
import Badge from '@material-ui/core/Badge';
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
    maxWidth: 400,

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
badge: {
    top: 1,
    right: -15,
    // The border color match the background color.
    border: `2px solid ${
      theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[900]
    }`,
  },


});


class  PinListPublic extends React.Component {

  state = {
     open: false,
     currentImg: ''
   };

   handleOpen = img => {
     this.setState({ open: true, currentImg: img });
   };

   handleClose = () => {
     this.setState({ open: false });
   };

   likeButton(pin,isAuthenticated,user){
     if(!isAuthenticated){
     return   (
       <Tooltip title="you need to login">

       <IconButton   aria-label="Add to favorites" disabled>

           <Badge badgeContent={pin.likedBy.length} color="primary" classes={{ badge: this.props.classes.badge }}>
             <FavoriteIcon style={{color:'grey',cursor: 'not-allowed'}} />
            </Badge>
           </IconButton>
</Tooltip>
         );
       }

         else {
           const index = pin.likedBy.findIndex(userData => userData._id === user.id);
           console.log(index)
           if (!pin.likedBy.includes(user.id)&& index ===-1)
           return (
             <Tooltip title="like a pin">
             <IconButton onClick={()=>this.props.onLike(pin._id)} aria-label="Add to favorites">
              <Badge badgeContent={pin.likedBy.length} color="primary" classes={{ badge: this.props.classes.badge }}>
               <FavoriteIcon style={{color:'grey'}} />;
               </Badge>
              </IconButton>
            </Tooltip>
          );

             else
                return (
                  <Tooltip title="Dislike a pin">
          <IconButton onClick={()=>this.props.onDislike(pin._id)} aria-label="Add to favorites">
           <Badge badgeContent={pin.likedBy.length} color="primary" classes={{ badge: this.props.classes.badge }}>
            <FavoriteIcon style={{color:'red'}} />;
            </Badge>

           </IconButton>
           </Tooltip>
          );
        }
      }

      onBrokenImage(ev){
        ev.target.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4g-FP5XzYkRJnVrayJNe5GYGFXBkdM9VlBwyrnkTBuT0rGfY1';
       }

render(){
const {classes}=this.props;
const {allPins}=this.props;
const {isAuthenticated,user} = this.props.auth;

const actions = [
  <FlatButton label="Close" primary={true} onClick={this.handleClose} />
];

  if(!allPins.length) {
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
      {allPins.map(pin => {

        const year= pin.addedOn.split("T")[0].split("-")[0];
        const month= pin.addedOn.split("T")[0].split("-")[1];
        const day= pin.addedOn.split("T")[0].split("-")[2];
        const hour=pin.addedOn.split("T")[1].split(".")[0].split(":")[0]
        const minutes=pin.addedOn.split("T")[1].split(".")[0].split(":")[1]
        const seconds=pin.addedOn.split("T")[1].split(".")[0].split(":")[2]

        var addedOn = new Date(Date.UTC(year,month-1,day, hour, minutes, seconds));
        var date =addedOn.toUTCString();
        return (
      <Grid item key={pin} sm={6} md={4} lg={3} >
        <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar className={classes.avatar} aria-label="Recipe" >
              {pin.addedBy.name.substr(0,1).toUpperCase()}
            </Avatar>
          }
          title={pin.description}
          subheader={date}
                  />
          <CardContent className={classes.cardContent}>
          <CardMedia>
          <img onClick={() => this.handleOpen(pin.url)} style={{cursor:'zoom-in'}} className={classes.media}
          src={pin.url}
          alt=""
          onError={this.onBrokenImage}
             />

           </ CardMedia>
           <Typography>
           <FormattedMessage
                           id="byPublic"
                           defaultMessage="By"
                         /> :<strong>{pin.addedBy.name}</strong>
           </Typography>
          <CardActions>
          <Tooltip title="view a pin">
          <IconButton onClick={() => this.handleOpen(pin.url)}>
                  <ZoomIn color="black" />
                </IconButton>
                </Tooltip>

{this.likeButton(pin,isAuthenticated,user)}
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
         onRequestClose={this.handleClose}
       >
         <img src={this.state.currentImg} alt="" style={{      height: 255,
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
    allPins: state.pins.allPins,
    pinsUser:state.pins.pinsUser,
    pins:state.pins,
    auth: state.auth
    };
};

const mapDispatchToProps = dispatch => {
  return {
    onLike: _id => {
      dispatch(likePin(_id));
    },
    onDislike: _id => {
      dispatch(unlikePin(_id));
    }
  };
};
PinListPublic.propTypes = {
  classes: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired

};

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(PinListPublic)));
