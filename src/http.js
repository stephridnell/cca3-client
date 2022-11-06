import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://m6cueo29r0.execute-api.ap-southeast-2.amazonaws.com/'
})

instance.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  ({ data }) => data,
  (error) => {
    return Promise.reject(error.response?.data)
  }
)

export default instance
