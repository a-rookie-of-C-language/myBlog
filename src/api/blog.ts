import request from '@/utils/request'
import type { BaseResponse } from '@/utils/request'

// 博客分类枚举
export enum BlogCategory {
  TECHNOLOGY = 'technology',
  PROGRAMMING = 'programming',
  DESIGN = 'design',
  OTHER = 'other'
}

// 博客接口
export interface Blog {
  id: string
  title: string
  category: string
  createTime: string
  updateTime?: string
  readCount: number
  description?: string
  content?: string
}

// 博客服务API
export const blogApi = {
  // 获取所有博客
  getAllBlogs(): Promise<BaseResponse<Blog[]>> {
    return request({
      url: '/myBlog/contents/category/devTips',
      method: 'GET'
    })
  },

  // 获取指定ID的博客
  getBlogById(id: string): Promise<BaseResponse<Blog>> {
    return request({
      url: `/myBlog/contents/item/${id}`,
      method: 'GET'
    })
  },

  // 获取指定分类的博客
  getBlogsByCategory(category: string): Promise<BaseResponse<Blog[]>> {
    return request({
      url: `/myBlog/contents/category/${category}`,
      method: 'GET'
    })
  },

  // 获取博客内容
  getBlogContent(id: string): Promise<BaseResponse<string>> {
    return request({
      url: `/myBlog/contents/file/${id}`,
      method: 'GET'
    })
  },
  
  // 增加博客阅读计数
  incrementReadCount(id: string): Promise<BaseResponse<void>> {
    return request({
      url: `/myBlog/contents/read/${id}`,
      method: 'POST'
    })
  }
}