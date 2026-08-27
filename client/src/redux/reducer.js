import { USER_LOGIN_SUCCESS, USER_LOGOUT } from './actionTypes';

const savedUser = localStorage.getItem('user');
const initialState = {
  user: savedUser ? JSON.parse(savedUser) : null,
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload,
      };
    case USER_LOGOUT:
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
};
