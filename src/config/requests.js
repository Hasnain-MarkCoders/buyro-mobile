import axios from "axios";

// Create an Axios instance with a base URL
const apiClient = axios.create({
    baseURL: "https://anton.markcoders.com/buyro-b", // Change this to your actual API base URL
    timeout: 10000, // Optional: set a timeout limit
    headers: {
        "Content-Type": "application/json",
    },
});

// Generic GET method
export const get = async (endpoint) => {
       return new Promise ((resolver, reject)=>{
        apiClient.get(endpoint).then((res) => {
            resolver(res)
        }).catch((err) => {
            reject(err)
        })
       })
        
};

// Generic POST method
export const post = async (endpoint, payload) => {
    try {
        const response = await apiClient.post(endpoint, payload);
        return response.data;
    } catch (err) {
        throw new Error(err.response?.data?.message || "An error occurred");
    }
};