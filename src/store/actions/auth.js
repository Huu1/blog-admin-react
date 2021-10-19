import { setUserToken, setUserInfo } from "./user";
import { reqLogin } from "@/api/login";
import { setToken, removeToken } from "@/utils/auth";
export const login = (username, password) => (dispatch) => {
  return new Promise((resolve, reject) => {
    reqLogin({ username: username.trim(), password: password })
      .then((response) => {
        const { code, data, msg } = response;
        if (code === 0) {
          setToken(data.token);
          dispatch(setUserInfo(data.user));
          dispatch(setUserToken(data.token));
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

export const logout = (token) => (dispatch) => {
  removeToken();
  setTimeout(() => {
    window.location.reload();
  }, 300);
};
