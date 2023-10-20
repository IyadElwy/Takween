/* eslint-disable no-param-reassign */
import axios from "axios";
import Cookies from "js-cookie";

const AxiosWrapper = axios.create();

AxiosWrapper.interceptors.request.use(async (config) => {
  const { accessToken } = config;

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  } else {
    const cookieToken = Cookies.get("accessToken");
    if (cookieToken) {
      config.headers.Authorization = `Bearer ${cookieToken}`;
    }
  }

  return config;
});

export default AxiosWrapper;
