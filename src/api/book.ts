import request from '@/utils/request'
import type { BaseResponse } from '@/utils/request'

interface Book {
  id: number
  title: string
  author: string
  description: string
  coverUrl: string
}

export const bookApi = {
  getAllBooks(): Promise<BaseResponse<Book[]>> {
    return request({
      url: '/books',
      method: 'GET'
    })
  }
}