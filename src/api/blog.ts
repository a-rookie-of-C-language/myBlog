import request from '@/utils/request'

export const blogApi = {
  getAllBlogs() {
    return request<Blog[]>({
      url: '/blogs',
      method: 'get'
    })
  },

  getBlogById(id: string) {
    return request<Blog>({
      url: `/blogs/${id}`,
      method: 'get'
    })
  },

  getBlogsByCategory(category: string, page = 1, size = 10) {
    return request<PageInfo<Blog>>({
      url: `/blogs/category/${category}`,
      method: 'get',
      params: { page, size }
    })
  },

  getBlogContent(id: string | number) {
    return request<string>({
      url: `/blogs/${id}/content`,
      method: 'get'
    })
  }
}

// 类型定义
export interface Blog {
    id: string;
    title: string;
    content: string;
    createTime: string;
    readCount: number;
    // 添加其他可能的字段
    description?: string;
    category?: string;
    updateTime?: string;
  }

export interface PageInfo<T> {
  list: T[]
  pageNum: number
  pageSize: number
  total: number
} 