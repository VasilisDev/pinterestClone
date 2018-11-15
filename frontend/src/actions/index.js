import { ADD_PIN, DELETE_PIN, FETCH_PIN ,FETCH_PRIVATE_PINS,LIKE_PIN,GET_ERRORS,UNLIKE_PIN} from './types';
import axios from 'axios';

const apiUrl = '/api/pins';

export const createPin = ({ url, description }) => {
  return (dispatch) => {
    return axios.post(`${apiUrl}/add`, {url, description})
      .then(response => {
        dispatch(createPinSuccess(response.data))
      })
      .catch(error => {
        dispatch({
            type: GET_ERRORS,
            payload: error.response.data
        });
      });
  };
};

export const createPinSuccess =  (data) => {

  return {
      type: ADD_PIN ,
    payload: {
      _id: data._id,
      url: data.url,
      description: data.description,
      addedBy:data.addedBy,
      addedOn:data.addedOn,
      likedBy:data.likedBy
    }
  }
};

export const deletePinSuccess = id => {
  return {
    type: DELETE_PIN,
    payload: {
     id:id
     }
   }
}


export const deletePin = id => {
  return (dispatch) => {
    return axios.delete(`${apiUrl}/delete/${id}`)
      .then(response => {
        dispatch(deletePinSuccess(id))
      })
      .catch(error => {



        throw(error);
      });
  };
};

export const fetchPins = (pins) => {
  return {
    type: FETCH_PIN,
    payload:pins
  }
};


export const fetchAllPins = () => {
  return (dispatch) => {
    return axios.get(`${apiUrl}/all`)
      .then(response => {
        console.log(response.data)
        dispatch(fetchPins(response.data))

      })
      .catch(error => {
        throw(error);
      });
  };
};


export const fetchAllUserPins = () => {
  return (dispatch) => {
    return axios.get(`${apiUrl}/user`)
      .then(response => {
        console.log(response.data)
        dispatch(fetchUserPins(response.data))

      })
      .catch(error => {
        throw(error);
      });
  };
};


export const fetchUserPins = (posts) => {
  return {
    type: FETCH_PRIVATE_PINS,
    payload:posts
  }
};

export const likePin = pinId => {
  return (dispatch) => {

  return axios.put(`${apiUrl}/like/${pinId}`)
    .then(res => {
      dispatch(likePinSuccess(res.data ));

    })
    .catch(err => {
      throw err;
    });
  };
};


export const likePinSuccess = (posts) => {
  return {
    type: LIKE_PIN,
    payload:posts
  }
};


export const unlikePin = pinId => {
  return (dispatch) => {

  return axios.put(`${apiUrl}/unlike/${pinId}`)
    .then(res => {
      dispatch(unlikePinSuccess(res.data ));
    })
    .catch(err => {
      throw err;
    });
  };
};


export const unlikePinSuccess = (posts) => {
  return {
    type: UNLIKE_PIN,
    payload:posts
  }
};
