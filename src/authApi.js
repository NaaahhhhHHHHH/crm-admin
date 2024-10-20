import axios from 'axios'

// Base URL configuration (optional, if your API URL is different from your frontend)
//process.env.REACT_APP_API_URL || '' // Use .env file to manage base URLs
const apiUrl =
  import.meta.env.MODE == 'product' ? import.meta.env.VITE_API_URL : import.meta.env.VITE_API_LOCAL
const BASE_URL = `${apiUrl}/api`

const getAuthToken = () => {
  return localStorage.getItem('CRM-token')
}

const axiosInstance = axios.create({
  baseURL: BASE_URL,
})

axiosInstance.interceptors.request.use((config) => {
  const token = getAuthToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Function to handle login API request
export const login = async (username, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/loginAdmin`, {
      username,
      password,
    })

    // Return the response data (e.g., token, user info)
    return response.data
  } catch (error) {
    // Forward error to the calling function (can be used for handling errors)
    throw error.response ? error.response.data : { message: 'An error occurred' }
  }
}

export const auth = async () => {
  return await axiosInstance.get(`/auth`)
}
