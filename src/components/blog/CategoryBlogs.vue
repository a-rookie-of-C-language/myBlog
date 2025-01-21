<template>
  <div class="category-blogs-container">
    <!-- 星空背景 -->
    <div class="stars-container">
      <div id="stars"></div>
      <div id="stars2"></div>
      <div id="stars3"></div>
    </div>

    <!-- 返回首页按钮 -->
    <router-link to="/" class="back-home">
      <el-button type="primary" class="back-btn">
        <i class="el-icon-back"></i>
        返回首页
      </el-button>
    </router-link>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <el-skeleton :rows="6" animated />
    </div>

    <!-- 空状态 -->
    <div v-else-if="blogs.length === 0" class="empty-state">
      <el-empty description="暂无文章" />
    </div>

    <!-- 博客列表 -->
    <div v-else class="blog-list">
      <el-card v-for="blog in blogs" 
               :key="blog.id" 
               class="blog-item"
               :shadow="'hover'">
        <router-link :to="{ name: 'BlogDetail', params: { id: blog.id }}"
                     class="blog-title">
          <h2>{{ blog.title }}</h2>
        </router-link>
        <p class="description">{{ blog.description }}</p>
        <div class="blog-meta">
          <span class="date">{{ formatDate(blog.createTime) }}</span>
          <span class="views">阅读: {{ blog.readCount }}</span>
        </div>
      </el-card>
    </div>

    <!-- 分页 -->
    <el-pagination
      v-if="total > 0"
      v-model:current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      :pager-count="5"
      layout="prev, pager, next"
      @current-change="handlePageChange"
      class="pagination"
      background
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { blogApi } from '@/api/blog'
import { ElMessage } from 'element-plus'
import type { Blog, PageInfo } from '@/api/blog'
import { formatDate } from '@/utils/dateFormat'
import { 
  ElCard,
  ElPagination,
  ElSkeleton,
  ElEmpty,
} from 'element-plus'

const route = useRoute()
const category = ref(route.params.category as string)
const blogs = ref<Blog[]>([])
const loading = ref(true)
const pageInfo = ref<PageInfo<Blog>>({
  list: [],
  pageNum: 1,
  pageSize: 10,
  total: 0
})

const fetchCategoryBlogs = async () => {
  if (!category.value) return
  
  try {
    console.log('当前分类:', category.value)
    loading.value = true
    const response = await blogApi.getBlogsByCategory(category.value, pageInfo.value.pageNum, pageInfo.value.pageSize)
    if (response.code === 200) {
      pageInfo.value = response.data
      blogs.value = response.data.list
    }
  } catch (error) {
    console.error('获取分类博客列表失败:', error)
    ElMessage.error('获取分类博客列表失败')
  } finally {
    loading.value = false
  }
}

// 监听路由参数变化
watch(
  () => route.params.category,
  (newCategory) => {
    if (newCategory) {
      category.value = newCategory as string
      fetchCategoryBlogs()
    }
  }
)

// 处理分页
const handlePageChange = (page: number) => {
  pageInfo.value.pageNum = page
  fetchCategoryBlogs()
  // 平滑滚动到顶部
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  fetchCategoryBlogs()
})
</script>

<style scoped>
.category-blogs-container {
  position: relative;
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  z-index: 1;
  min-height: 100vh;
}

.blog-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.blog-item {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: none;
  border-radius: 12px;
  padding: 20px;
  transition: transform 0.3s ease;
}

.blog-item:hover {
  transform: translateY(-5px);
}

.blog-title {
  text-decoration: none;
}

.blog-title h2 {
  color: #fff;
  margin: 0 0 10px 0;
  font-size: 1.5em;
}

.description {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 15px;
  line-height: 1.6;
}

.blog-meta {
  display: flex;
  justify-content: space-between;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9em;
}

.loading-state,
.empty-state {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  color: #fff;
}

.pagination {
  margin-top: 30px;
  text-align: center;
  padding: 20px 0;
}

:deep(.el-pagination) {
  --el-pagination-bg-color: transparent;
  --el-pagination-hover-color: #7eb6ff;
  --el-pagination-button-color: #fff;
  --el-pagination-button-bg-color: rgba(255, 255, 255, 0.1);
  --el-pagination-button-disabled-color: #606266;
  --el-pagination-button-disabled-bg-color: rgba(255, 255, 255, 0.05);
  --el-pagination-hover-bg-color: rgba(255, 255, 255, 0.2);
}

:deep(.el-pagination.is-background .el-pager li:not(.is-disabled)) {
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
}

:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
  background-color: #7eb6ff;
}

:deep(.el-pagination.is-background .el-pager li:not(.is-disabled):hover) {
  background-color: rgba(255, 255, 255, 0.2);
}

:deep(.btn-prev),
:deep(.btn-next) {
  background-color: rgba(255, 255, 255, 0.1) !important;
  color: #fff !important;
}

:deep(.btn-prev:hover),
:deep(.btn-next:hover) {
  background-color: rgba(255, 255, 255, 0.2) !important;
}

/* 星空背景样式 */
@keyframes animStar {
  from { transform: translateY(0); }
  to { transform: translateY(-2000px); }
}

#stars {
  width: 1px;
  height: 1px;
  background: transparent;
  box-shadow: 
    1744px 1437px 1px #FFF,
    1487px 1px 1px #FFF,
    1003px 1047px 1px #FFF,
    524px 859px 1px #FFF,
    1736px 1208px 1px #FFF,
    656px 1073px 1px #FFF,
    1897px 1670px 1px #FFF,
    1743px 1576px 1px #FFF,
    1013px 1107px 1px #FFF,
    1452px 1570px 1px #FFF;
  animation: animStar 50s linear infinite;
}

#stars2 {
  width: 2px;
  height: 2px;
  background: transparent;
  box-shadow: 
    1744px 1437px 1px #FFF,
    1487px 1px 1px #FFF,
    452px 939px 1px #FFF,
    1252px 1752px 1px #FFF,
    1905px 1381px 1px #FFF,
    1022px 1928px 1px #FFF,
    1431px 1357px 1px #FFF,
    1646px 1196px 1px #FFF,
    1318px 1086px 1px #FFF,
    39px 1901px 1px #FFF;
  animation: animStar 100s linear infinite;
}

#stars3 {
  width: 3px;
  height: 3px;
  background: transparent;
  box-shadow: 
    1744px 1437px 1px #FFF,
    1487px 1px 1px #FFF,
    1003px 1047px 1px #FFF,
    524px 859px 1px #FFF,
    1736px 1208px 1px #FFF,
    656px 1073px 1px #FFF,
    1897px 1670px 1px #FFF,
    1743px 1576px 1px #FFF,
    1013px 1107px 1px #FFF,
    1452px 1570px 1px #FFF;
  animation: animStar 150s linear infinite;
}

.stars-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
  overflow: hidden;
  z-index: -1;
}

/* 添加星星闪烁效果 */
@keyframes twinkle {
  0% { opacity: 1; }
  50% { opacity: 0.3; }
  100% { opacity: 1; }
}

#stars::after,
#stars2::after,
#stars3::after {
  content: '';
  position: absolute;
  top: 2000px;
  width: 100%;
  height: 100%;
  background: inherit;
  box-shadow: inherit;
}

/* 添加流星效果 */
@keyframes shootingStar {
  0% {
    transform: translateX(0) translateY(0) rotate(-45deg);
    opacity: 1;
  }
  100% {
    transform: translateX(-2000px) translateY(2000px) rotate(-45deg);
    opacity: 0;
  }
}

.shooting-star {
  position: absolute;
  width: 100px;
  height: 1px;
  background: linear-gradient(90deg, #fff, transparent);
  animation: shootingStar 3s linear infinite;
}

.back-home {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 10;
  text-decoration: none;
}

.back-btn {
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  backdrop-filter: blur(10px);
  color: #fff !important;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.2) !important;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.back-btn i {
  margin-right: 5px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .back-home {
    top: 10px;
    left: 10px;
  }
  
  .back-btn {
    padding: 8px 15px;
    font-size: 14px;
  }
}
</style> 