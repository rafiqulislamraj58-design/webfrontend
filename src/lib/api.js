import axios from "axios";
const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL || "https://itbackend-1.onrender.com",
  withCredentials: true,
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("it_access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config;
    if (
      error.response?.status === 401 &&
      !original?._retry &&
      !original?.url?.includes("/login") &&
      !original?.url?.includes("/refresh")
    ) {
      original._retry = true;
      try {
        const refreshed = await api.post("/api/auth/refresh");
        const token = refreshed.data?.data?.accessToken;
        if (token) {
          localStorage.setItem("it_access_token", token);
          original.headers.Authorization = `Bearer ${token}`;
          return api(original);
        }
      } catch {
        localStorage.removeItem("it_access_token");
        localStorage.removeItem("it_user");
      }
    }
    return Promise.reject(error);
  },
);
export const getData = async (path) => (await api.get(path)).data;
export const postData = async (path, data, config = {}) =>
  (await api.post(path, data, config)).data;
export const patchData = async (path, data, config = {}) =>
  (await api.patch(path, data, config)).data;
export const deleteData = async (path) => (await api.delete(path)).data;
export default api;
