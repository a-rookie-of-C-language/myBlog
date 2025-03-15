import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'

// 创建 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? '/myBlog' // 生产环境使用相对路径，适配GitHub Pages
    : 'http://localhost:3000',
  timeout: 5000
})

// 响应类型接口
export interface BaseResponse<T = any> {
  code: number
  message: string
  data: T
}

// 请求方法
const requestMethod = async <T = any>(config: AxiosRequestConfig): Promise<BaseResponse<T>> => {
  try {
    const response = await service(config)
    const res = response.data as BaseResponse<T>

    if (res.code !== 200) {
      ElMessage.error(res.message || '请求失败')
      return Promise.reject(new Error(res.message || '请求失败'))
    }

    return res
  } catch (error: any) {
    console.error('请求错误:', error)
    ElMessage.error(error.message || '请求失败')
    return Promise.reject(error)
  }
}

export default requestMethod