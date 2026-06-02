/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios'

// 1. 完美擴充 Axios 接口，包含 get, post, put, delete
declare module 'axios' {
  export interface AxiosInstance {
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<BaseVo<T>>
    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<BaseVo<T>>
    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<BaseVo<T>>
    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<BaseVo<T>>
  }
}

const apiBasePath = '/api/v1'

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'}${apiBasePath}`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 2. Request 攔截器 (使用內建的 InternalAxiosRequestConfig 型別更安全)
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const isServer = typeof window === 'undefined'

    console.log(`🚀 [API Request] [${isServer ? 'SERVER_COMPONENT' : 'CLIENT'}]`, `Method: ${config.method?.toUpperCase()} | URL: ${config.url}`, config.params ? `| Params: ${JSON.stringify(config.params)}` : '')

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 3. Response 攔截器
api.interceptors.response.use(
  (response: AxiosResponse) => {
    const isServer = typeof window === 'undefined'
    console.log(`✅ [API Success] [${isServer ? 'SERVER' : 'CLIENT'}] ${response.config.url}`)

    // 這裡強制斷言為 any，因為我們已經在上面透過 declare module 告訴外層：
    // 「別擔心，這個 instance 返回的通通都是 BaseVo」
    return response.data as any
  },
  (error) => {
    const isServer = typeof window === 'undefined'
    console.error(`❌ [API Error] [${isServer ? 'SERVER' : 'CLIENT'}] ${error.config?.url}`, `| Status: ${error.response?.status} | Message: ${error.message}`)

    if (error.response) {
      switch (error.response.status) {
        case 500:
          console.error('💥 伺服器內部錯誤 (500)')
          break
        case 401:
          console.error('🔒 認證失效，請重新登入 (401)')
          break
      }
    }
    return Promise.reject(error)
  }
)

export default api
