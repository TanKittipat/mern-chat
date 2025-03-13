import axios from "axios";

const baseUrl = import.meta.env.VITE_BASEURL;

const instance = axios.create({
  baseURL: baseUrl,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export default instance;
