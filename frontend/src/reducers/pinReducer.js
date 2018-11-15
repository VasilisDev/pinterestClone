import { ADD_PIN, DELETE_PIN,FETCH_PRIVATE_PINS,LIKE_PIN,UNLIKE_PIN,FETCH_PIN} from '../actions/types';

const initialState={
    pinsUser:{},
    allPins:[]
}
export default function postReducer(state =initialState , action) {
switch (action.type) {
  case ADD_PIN:
      return {
        ...state,
        pinsUser:[action.payload,...state.pinsUser],
        allPins: [action.payload,...state.allPins]

                  };
  case DELETE_PIN:
      return {
        ...state,
        pinsUser:state.pinsUser.filter(post => post._id !== action.payload.id),
        allPins: state.allPins.filter(post => post._id !== action.payload.id)
      };

  case FETCH_PIN:
       return {...state,allPins:action.payload};
  case FETCH_PRIVATE_PINS:
    return {...state,
            pinsUser:action.payload};
  case LIKE_PIN:
       const pins = [...state.allPins];
       const pinsIndex = pins.findIndex(pin => pin._id === action.payload._id);
         if (pinsIndex !== -1)
          pins.splice(pinsIndex, 1, action.payload);
      const pinsPrivate = [...state.pinsUser];
      const pinsPrivateIndex = pinsPrivate.findIndex(pin => pin._id === action.payload._id);
            if (pinsPrivateIndex !== -1)
            pins.splice(pinsPrivateIndex, 1, action.payload);

               return {...state,allPins:pins,pinsUser:pinsPrivate}

  case UNLIKE_PIN:
        const pins2 = [...state.allPins];
        const pinsIndex2 = pins2.findIndex(pin => pin._id === action.payload._id);
        if (pinsIndex2 !== -1)
          pins2.splice(pinsIndex2, 1, action.payload);

          const pins2Private = [...state.pinsUser];
          const pinsPrivateIndex2 = pins2Private.findIndex(pin => pin._id === action.payload._id);
          if (pinsPrivateIndex2 !== -1)
            pins2Private.splice(pinsPrivateIndex2, 1, action.payload);

        return {...state,allPins:pins2,pinsUser:pins2Private}

    default:
      return state;
  }
}
