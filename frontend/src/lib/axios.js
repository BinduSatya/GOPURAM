import axios from "axios";
// import dotenv/config from "dotenv";
// const BASE_URL =
//   import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api";
// const BASE_URL = import.meta.env.BASE_URL + "/api";
const BASE_URL = "http://localhost:3000/api";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send cookies with the request
});
