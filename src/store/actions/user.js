import * as types from "../action-types";
import { reqUserInfo } from "@/api/user";

export const getUserInfo = (token) => (dispatch) => {
  return new Promise((resolve, reject) => {
    reqUserInfo(token)
      .then((response) => {
        const { code, msg, data } = response;
        if (code === 0) {
          dispatch(setUserInfo(data.user));
          resolve(data);
        } else {
          reject(msg);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const setUserToken = (token) => {
  return {
    type: types.USER_SET_USER_TOKEN,
    token,
  };
};

export const setUserInfo = (userInfo) => {
  return {
    type: types.USER_SET_USER_INFO,
    ...userInfo,
  };
};

export const resetUser = () => {
  return {
    type: types.USER_RESET_USER,
  };
};
