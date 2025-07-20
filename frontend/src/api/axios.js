import axios from 'axios';

axios.defaults.withCredentials = true;
const instance = axios.create({

  baseURL: "http://localhost:4000/api/v1",
  withCredentials: true,
  
});

export default instance;

// baseURL: 'https://my-e-shop-web-backend.onrender.com/api/v1'
