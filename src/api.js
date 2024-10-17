// src/api.js
import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_URL
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

export const getData = async (typeData) => {
  return await axiosInstance.get(`/${typeData}`)
}

export const createData = async (typeData, data) => {
  return await axiosInstance.post(`/${typeData}`, data)
}

export const updateData = async (typeData, id, data) => {
  return await axiosInstance.put(`/${typeData}/${id}`, data)
}

export const deleteData = async (typeData, id) => {
  return await axiosInstance.delete(`/${typeData}/${id}`)
}
