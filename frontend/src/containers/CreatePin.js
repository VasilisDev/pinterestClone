import { connect } from 'react-redux';
import { createPin } from '../actions';
import NewPin from '../components/NewPin';




const mapDispatchToProps = dispatch => {
  return {
    onAddPin: pin => {
      dispatch(createPin(pin));
    }
  };
};
export default connect(
  null,
  mapDispatchToProps
)(NewPin);
