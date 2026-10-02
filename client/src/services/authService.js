import axiosInstance from "../api/api";

const authService = {
  register: async(body) => {
    const response = await axiosInstance.post(`/auth/register`, body)
    return response.data
  },
  login: async(body) => {
    const response = await axiosInstance.post(`/auth/login`, body)
    return response.data
  },

  logout: async() => {
    const response = await axiosInstance.post(`/auth/logout`)
    return response.data
  },

  profile: async() => {
    const response = await axiosInstance.get(`/auth/profile`)
    return response.data
  }
}

export default authService