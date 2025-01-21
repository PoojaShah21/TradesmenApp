const actions = {
  SET_USER_DATA: 'auth/SET_USER_DATA',
  SET_ACCESSTOKEN: 'auth/SET_ACCESSTOKEN',

  setUserData: userData => dispatch =>
    dispatch({
      type: actions.SET_USER_DATA,
      userData,
    }),
  setAccessToken: accessToken => dispatch =>
    dispatch({
      type: actions.SET_ACCESSTOKEN,
      accessToken,
    }),
};
export default actions;
