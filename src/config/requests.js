import axios from "axios";
import useAuthStore from "../zustand/authStore";
const headers = {
    "Content-Type": "application/json",
}
const apiClient = axios.create({
    // baseURL: "https://anton.markcoders.com/buyro-b", // Change this to your actual API base URL
    baseURL: "https://buyro-b.vercel.app", // Change this to your actual API base URL
    // baseURL: "https://9hjl5qp6-3001.inc1.devtunnels.ms", // Change this to your actual API base URL
    timeout: 10000, // Optional: set a timeout limit
    headers
});
export const get = async (endpoint, payload) => {
    return new Promise((resolver, reject) => {
        apiClient.get(endpoint, payload).then((res) => {
            resolver(res)
        }).catch((err) => {
            reject(err)
        })
    })
};
apiClient.interceptors.request.use(
    async (config) => {
        const user = useAuthStore.getState()?.user;
        if (user) {
            config.headers.Authorization = `Bearer ${user?.accessToken ?? ""}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error?.response?.status === 401) {
            useAuthStore.getState().logout()
        }
        return Promise.reject(error);
    }
)
export const post = async (endpoint, body) => {
    try {
        const response = await apiClient.post(endpoint, body);
        return response;
    } catch (err) {
        console.log(err.status)
        throw new Error(err.response?.data?.message || "An error occurred");
    }
};

