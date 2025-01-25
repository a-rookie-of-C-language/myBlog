import request from '@/utils/request'
import type { BaseResponse } from '@/utils/request'

export interface Algorithm {
  id: number
  title: string
  difficulty: string
  description: string
  examples: string
  hints: string
  code: string
  solution: string
  timeComplexity: string
  spaceComplexity: string
  category: string
  createTime?: Date
  updateTime?: Date
  readCount?: number
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
  }
} 