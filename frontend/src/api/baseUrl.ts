import axios from "axios";

const baseURL = "https://task-distribution-production.up.railway.app";

const api = axios.create({
  baseURL,
});

export default api;
export { baseURL };
