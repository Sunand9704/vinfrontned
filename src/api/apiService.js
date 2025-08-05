import axios from "axios";

// Create a more resilient axios instance
const api = axios.create({
  baseURL:
    "http://localhost:8081/api" ||
    "https://back3-728k.onrender.com/api" ||
    import.meta.env.VITE_API_URL ||
    "https://vin2grow.in/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 15000, // Increased timeout
  // Add retry logic
  retry: 3,
  retryDelay: (retryCount) => {
    return retryCount * 1000; // time interval between retries
  },
});

// Request queue and throttling
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // Minimum time between requests (1 second)

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    console.log("API request:", config.method.toUpperCase(), config.url);

    // Throttle requests
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      await new Promise((resolve) =>
        setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest)
      );
    }
    lastRequestTime = Date.now();

    // Get token from localStorage
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Token added to request:", token.substring(0, 10) + "...");
    } else {
      console.log("No token found in localStorage");
    }

    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log("API response:", response.status, response.config.url);
    return response;
  },
  async (error) => {
    console.error(
      "Response error:",
      error.response?.status,
      error.config?.url,
      error.message
    );

    // Don't redirect to login for login/register requests
    const isAuthRequest = error.config?.url?.includes("/auth/");

    if (error.response?.status === 401 && !isAuthRequest) {
      // Only clear tokens and redirect if not already on login page
      if (!window.location.pathname.includes("/login")) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }

    // Handle rate limiting
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers["retry-after"] || 5;
      console.log(`Rate limited. Retrying after ${retryAfter} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
      return api(error.config);
    }

    // Handle CORS errors
    if (error.message === "Network Error") {
      console.error(
        "CORS Error: Check if the server is running and CORS is properly configured"
      );

      // Try to reconnect
      if (error.config && !error.config.__retryCount) {
        error.config.__retryCount = 0;
      }

      if (error.config && error.config.__retryCount < error.config.retry) {
        error.config.__retryCount++;
        console.log(
          `Retrying request (${error.config.__retryCount}/${error.config.retry})...`
        );

        // Wait before retrying
        await new Promise((resolve) =>
          setTimeout(
            resolve,
            error.config.retryDelay(error.config.__retryCount)
          )
        );

        // Retry the request
        return api(error.config);
      }
    }

    const originalRequest = error.config;

    // Handle 403 errors
    if (error.response?.status === 403) {
      console.error("Forbidden access:", error.response.data);
      // Clear tokens and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

// API service functions
const apiService = {
  // Generic HTTP methods for backward compatibility
  get: async (url) => {
    return api.get(url);
  },

  post: async (url, data) => {
    return api.post(url, data);
  },

  put: async (url, data) => {
    return api.put(url, data);
  },

  patch: async (url, data) => {
    return api.patch(url, data);
  },

  delete: async (url) => {
    return api.delete(url);
  },

  // Get best sellers
  getBestSellers: async (limit = 6) => {
    try {
      const response = await api.get(`/products/bestsellers?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching best sellers:", error);
      throw error;
    }
  },

  // Get all products
  getAllProducts: async () => {
    try {
      const response = await api.get("/products");
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  // Get product by ID
  getProduct: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  },

  // Get products by category
  getProductsByCategory: async (category) => {
    try {
      const response = await api.get(`/products/category/${category}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching products by category:", error);
      throw error;
    }
  },

  // Cart methods
  getCart: async () => {
    try {
      const response = await api.get("/cart");
      return response;
    } catch (error) {
      console.error("Error fetching cart:", error);
      throw error;
    }
  },

  addToCart: async (item) => {
    try {
      const response = await api.post("/cart/items", item);
      return response;
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  },

  updateCartItem: async (productId, quantity) => {
    try {
      const response = await api.patch(`/cart/items/${productId}`, {
        quantity,
      });
      return response;
    } catch (error) {
      console.error("Error updating cart item:", error);
      throw error;
    }
  },

  removeFromCart: async (productId) => {
    try {
      const response = await api.delete(`/cart/items/${productId}`);
      return response;
    } catch (error) {
      console.error("Error removing from cart:", error);
      throw error;
    }
  },

  clearCart: async () => {
    try {
      const response = await api.delete("/cart");
      return response;
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    }
  },
};

export default apiService;
