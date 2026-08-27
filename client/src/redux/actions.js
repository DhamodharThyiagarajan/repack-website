import { USER_LOGIN_SUCCESS, USER_LOGOUT } from './actionTypes';

export const loginUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
  return {
    type: USER_LOGIN_SUCCESS,
    payload: user,
  };
};

export const logoutUser = () => {
  localStorage.removeItem('user');
  return {
    type: USER_LOGOUT,
  };
};
