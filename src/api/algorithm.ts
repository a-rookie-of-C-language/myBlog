import request from '@/utils/request'
import type { BaseResponse } from '@/utils/request'

export interface Algorithm {
  id: number
  title: string
  category: string
  difficulty: string
  timeComplexity: string
  spaceComplexity: string
  createTime?: Date
  updateTime?: Date
  readCount?: number
  content?: string  // API 返回的 markdown 内容
}

// API 响应类型
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export const algorithmApi = {
  getAllAlgorithms(): Promise<BaseResponse<Algorithm[]>> {
    return request({
      url: '/algorithms',
      method: 'GET'
    })
  },

  getAlgorithmById(id: string): Promise<BaseResponse<Algorithm>> {
    return request({
      url: `/algorithms/${id}`,
      method: 'GET'
    })
  },

  updateAlgorithmById(id: string, data: Algorithm): Promise<BaseResponse<Algorithm>> {
    return request({
      url: `/algorithms/${id}`,
      method: 'PUT',
      data
    })
  }
} 