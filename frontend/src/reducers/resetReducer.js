import { SEND_MAIL_SUCCES,SEND_TOKEN_SUCCES,RESET_PASSWORD} from '../actions/types';

const initialState = {};

export default function resetReducer(state = initialState, action) {
  switch (action.type) {
    case SEND_MAIL_SUCCES:
         return  action.payload;
    case SEND_TOKEN_SUCCES:
         return action.payload;
    case RESET_PASSWORD:
        return action.payload;
    default:
      return state;
  }
}
