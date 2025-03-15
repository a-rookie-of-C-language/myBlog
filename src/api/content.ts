import request from '@/utils/request'
import type { BaseResponse } from '@/utils/request'

// 内容类型枚举
export enum ContentType {
  MARKDOWN = 'markdown',
  HTML = 'html',
  TEXT = 'text'
}

// 内容分类枚举
export enum ContentCategory {
  DEV_TIPS = 'devTips',
  ALGORITHMS = 'algorithms',
  ADVICE_BOOKS = 'adviceBooks'
}

// 内容项接口
export interface ContentItem {
  id: string
  title: string
  category: ContentCategory
  type: ContentType
  path: string
  description?: string
  createTime?: string
  updateTime?: string
  readCount?: number
  content?: string
}

// 内容服务API
export const contentApi = {
  // 获取指定分类的所有内容项
  getContentsByCategory(category: ContentCategory): Promise<BaseResponse<ContentItem[]>> {
    return request({
      url: `/myBlog/contents/category/${category}`,
      method: 'GET'
    })
  },

  // 获取指定ID的内容项
  getContentById(id: string): Promise<BaseResponse<ContentItem>> {
    return request({
      url: `/myBlog/contents/item/${id}`,
      method: 'GET'
    })
  },

  // 获取指定内容项的文件内容
  getContentFile(id: string): Promise<BaseResponse<string>> {
    return request({
      url: `/myBlog/contents/file/${id}`,
      method: 'GET'
    })
  },

  // 增加内容阅读计数
  incrementReadCount(id: string): Promise<BaseResponse<void>> {
    return request({
      url: `/myBlog/contents/read/${id}`,
      method: 'POST'
    })
  }
}