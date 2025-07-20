import axios from 'axios';

axios.defaults.withCredentials = true;
const instance = axios.create({

  baseURL: "https://my-e-shop-mern.onrender.com/api/v1",
  withCredentials: true,
  
});

export default instance;

