import axios from "axios"

// create axios instance
export const apiInstance = () => {
  return axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
      "Content-Type": "application/json",
    },
  })
}
