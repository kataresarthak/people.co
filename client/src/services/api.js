import axios from "axios";

const API = axios.create({ baseURL: "/api" });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export const loginUser = (data) => API.post("/users/login", data);
export const registerUser = (data) => API.post("/users/register", data);
export const verifyToken = () => API.get("/users/verify");

export const getEmployees = (params) => API.get("/employees", { params });
export const getEmployee = (id) => API.get(`/employees/${id}`);
export const createEmployee = (data) => API.post("/employees", data);
export const updateEmployee = (id, data) => API.put(`/employees/${id}`, data);
export const deleteEmployee = (id) => API.delete(`/employees/${id}`);

export const getDashboard = () => API.get("/dashboard");

export default API;
