import axios from 'axios';

// Configure standard Axios setup
const apiProcessor = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    timeout: 10000, // 10 seconds timeout
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Request Interceptor
apiProcessor.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor (e.g. for global error handling)
apiProcessor.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle specific status codes (like 401 Unauthorized) globally
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default apiProcessor;
