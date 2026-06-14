/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import Cookies from 'js-cookie'

declare module 'axios' {
  export interface AxiosInstance {
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<BaseVo<T>>
    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<BaseVo<T>>
    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<BaseVo<T>>
    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<BaseVo<T>>
  }
}

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response 攔截器
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data as any
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 500:
          console.error('💥 伺服器內部錯誤 (500)')
          break
        case 401: {
          console.error('🔒 認證失效，請重新登入 (401)')

          // 移除token
          Cookies.remove('token')
          break
        }
      }
    }
    return Promise.reject(error)
  }
)

export default api
