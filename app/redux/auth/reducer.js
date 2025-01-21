import types from './actions';

const initialState = {
  userData: {},
  accessToken: '',
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case types.SET_USER_DATA:
      return {
        ...state,
        userData: action.userdata,
      };
    case types.SET_ACCESSTOKEN:
      return {
        ...state,
        accessToken: action.accessToken,
      };
    default:
      return state;
  }
}
