import request from '@/utils/request'
import type { BaseResponse } from '@/utils/request'

// 算法难度枚举
export enum AlgorithmDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

// 算法分类枚举
export enum AlgorithmCategory {
  ARRAY = 'array',
  STRING = 'string',
  LINKED_LIST = 'linkedList',
  TREE = 'tree',
  GRAPH = 'graph',
  DYNAMIC_PROGRAMMING = 'dynamicProgramming',
  GREEDY = 'greedy',
  BACKTRACKING = 'backtracking',
  OTHER = 'other'
}

// 算法项接口
export interface Algorithm {
  id: string
  title: string
  category: AlgorithmCategory
  difficulty: AlgorithmDifficulty
  timeComplexity: string
  spaceComplexity: string
  createTime?: string
  updateTime?: string
  readCount?: number
  content?: string  // API 返回的 markdown 内容
}

// 算法服务API
export const algorithmApi = {
  // 获取所有算法
  getAllAlgorithms(): Promise<BaseResponse<Algorithm[]>> {
    return request({
      url: '/myBlog/contents/category/algorithms',
      method: 'GET'
    })
  },

  // 获取指定ID的算法
  getAlgorithmById(id: string): Promise<BaseResponse<Algorithm>> {
    return request({
      url: `/myBlog/contents/item/${id}`,
      method: 'GET'
    })
  },

  // 获取算法内容
  getAlgorithmContent(id: string): Promise<BaseResponse<string>> {
    return request({
      url: `/myBlog/contents/file/${id}`,
      method: 'GET'
    })
  },

  // 增加算法阅读计数
  incrementReadCount(id: string): Promise<BaseResponse<void>> {
    return request({
      url: `/myBlog/contents/read/${id}`,
      method: 'POST'
    })
  }
}