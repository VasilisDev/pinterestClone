import axios from 'axios';
import { GET_ERRORS,SEND_MAIL_SUCCES,SEND_TOKEN_SUCCES,RESET_PASSWORD} from './types';

const apiUrl='/api/users';

export const sendMail = (mail) => dispatch => {
    axios.post(apiUrl+'/forgot', mail)
            .then(res => {
              dispatch(sendMailSuccess(res.data))

            })
            .catch(err => {
                dispatch({
                    type: GET_ERRORS,
                    payload: err.response.data
                });
            });
}
export const sendMailSuccess =  (data) => {
  return {
    type: SEND_MAIL_SUCCES,
    payload: {
      info: data.info
    }
  }
};

export const getToken = token => {
  return (dispatch) => {
    return axios.get(`${apiUrl}/reset/${token}`)
      .then(response => {
        dispatch(getTokenSuccess(response.data))
      })
      .catch(error => {
        throw(error);
      });
  };
};

export const getTokenSuccess = token => {
  return {
    type: SEND_TOKEN_SUCCES,
    payload: {
      token
    }
  }
}

export const resetPassword = ({  password,password_confirm,token }) => {
  return (dispatch) => {
    return axios.post(`${apiUrl}/reset`, {token,password,password_confirm})
      .then(response => {
        dispatch(resetPasswordSuccess(response.data))
      })
      .catch(error => {
        dispatch({
            type: GET_ERRORS,
            payload: error.response.data
        });
    });
  };
};

export const resetPasswordSuccess =  (data) => {
  return {
    type: RESET_PASSWORD,
    payload: {
      data
    }
  }
};
