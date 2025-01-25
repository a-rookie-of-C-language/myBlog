import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/components/blog/HomePage.vue'
import CategoryBlogs from '@/components/blog/CategoryBlogs.vue'
import BlogDetail from '@/components/blog/BlogDetail.vue'
import BookRecommend from '@/components/blog/BookRecommend.vue'
import { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
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
  },
  {
    path: '/category/algorithm',
    name: 'AlgorithmList',
    component: () => import('@/components/algorithm/AlgorithmList.vue'),
    meta: {
      title: '算法列表',
      requireAuth: true
    }
  },
  {
    path: '/algorithm/:id',
    name: 'AlgorithmDetail',
    component: () => import('@/components/algorithm/AlgorithmDetail.vue'),
    meta: {
      title: '算法详情',
      requireAuth: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title || '博客'} - My Blog`
  next()
})

export default router
