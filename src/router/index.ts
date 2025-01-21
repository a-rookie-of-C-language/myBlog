import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/components/blog/HomePage.vue'
import CategoryBlogs from '@/components/blog/CategoryBlogs.vue'
import BlogDetail from '@/components/blog/BlogDetail.vue'
import BookRecommend from '@/components/blog/BookRecommend.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/category/:category',
    name: 'CategoryBlogs',
    component: CategoryBlogs,
    props: true
  },
  {
    path: '/blog/:id',
    name: 'BlogDetail',
    component: BlogDetail,
    props: true
  },
  {
    path: '/category/recommended-books',
    name: 'BookRecommend',
    component: BookRecommend
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
