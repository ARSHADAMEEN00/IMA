import axiosApi from 'axios';
import { useGetToken } from '../../hooks/useHandleSessions';

// const BASE_URL = 'https://installment-managing-app.onrender.com'
// apply base url for axios
export const TOKEN_PREFIX = 'vk-en-t';
const API_URL_DEV = 'https://installment-managing-app.onrender.com/api';

const axios = axiosApi.create({
  baseURL: API_URL_DEV,
});

axios.interceptors.request.use(
  (config) => {
    const { token } = useGetToken(TOKEN_PREFIX);
    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => error
);

axios.interceptors.response.use(
  (response) => response,
  (err) => {
    console.log(err.response.status);
    if (err.response.status === 401) {
      sessionStorage.clear('token');
      window.location.replace('/');
      return Promise.reject(err);
    }
    return Promise.reject(err);
  }
);

export async function get(url, config = {}) {
  return axios.get(url, { ...config }).then((response) => response.data);
}

export async function post(url, data, config = {}) {
  return axios.post(url, { ...data }, { ...config }).then((response) => response.data);
}

export async function put(url, data, config = {}) {
  return axios.put(url, { ...data }, { ...config }).then((response) => response.data);
}

export async function del(url, config = {}) {
  return axios.delete(url, { ...config }).then((response) => response.data);
}
