<template>
  <div class="dev-tips-container">
    <div class="page-header">
      <h1>开发技巧</h1>
      <p>分类下的文章</p>
    </div>
    
    <el-container>
      <el-main>
        <el-row :gutter="30">
          <!-- 左侧博客列表 -->
          <el-col :span="18">
            <!-- 添加加载状态 -->
            <div v-if="loading" class="loading-state">
              <el-skeleton :rows="6" animated />
            </div>
            
            <!-- 添加空状态 -->
            <div v-else-if="blogs.length === 0" class="empty-state">
              <el-empty description="暂无文章" />
            </div>
            
            <!-- 博客列表 -->
            <div v-else class="blog-list">
              <el-card v-for="blog in blogs" 
                      :key="blog.id" 
                      class="blog-item"
                      shadow="hover">
                <router-link :to="{ name: 'BlogDetail', params: { id: blog.id }}"
                           class="blog-title">
                  <h2>{{ blog.title }}</h2>
                </router-link>
                <p class="description">{{ blog.description }}</p>
                <div class="blog-meta">
                  <div class="meta-left">
                    <span class="meta-item">
                      <i class="el-icon-date"></i> {{ formatDate(blog.createTime) }}
                    </span>
                    <span class="meta-item">
                      <i class="el-icon-collection-tag"></i> {{ blog.category }}
                    </span>
                    <span class="meta-item">
                      <i class="el-icon-view"></i> {{ blog.readCount }} 阅读
                    </span>
                  </div>
                  <router-link :to="{ name: 'BlogDetail', params: { id: blog.id }}" 
                             class="read-more">
                    阅读全文 <i class="el-icon-right"></i>
                  </router-link>
                </div>
              </el-card>
            </div>
          </el-col>
          
          <!-- 右侧边栏 -->
          <el-col :span="6">
            <el-card class="sidebar" shadow="hover">
              <div class="categories">
                <h3 class="sidebar-title">
                  <i class="el-icon-collection-tag"></i> 文章分类
                </h3>
                <ul class="category-list">
                  <li v-for="category in categories" 
                      :key="category"
                      @click="navigateToCategory(category)"
                      class="category-item">
                    <span class="category-name">
                      <i class="el-icon-folder"></i>
                      {{ category }}
                    </span>
                    <span class="category-count">12</span>
                  </li>
                </ul>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { blogApi } from '@/api/blog'
import { formatDate } from '@/utils/dateFormat'

const router = useRouter()
const blogs = ref([])
const loading = ref(true)
const categories = ref(['前端开发', '后端开发', '数据库', '系统设计', '工具使用'])

const fetchBlogs = async () => {
  try {
    loading.value = true
    const response = await blogApi.getAllBlogs()
    console.log('API响应:', response)
    
    if (response && response.data) {
      blogs.value = response.data.filter(blog => blog.category === '开发技巧')
      console.log('过滤后的博客:', blogs.value)
    }
  } catch (error) {
    console.error('获取博客列表失败:', error)
  } finally {
    loading.value = false
  }
}

const navigateToCategory = (category: string) => {
  router.push({
    name: 'Category',
    params: { category }
  })
}

onMounted(() => {
  fetchBlogs()
})
</script>

<style scoped>
.dev-tips-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 30px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

/* 博客卡片样式 */
.blog-item {
  margin-bottom: 25px;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
}

.blog-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
}

.blog-title {
  text-decoration: none;
}

.blog-title h2 {
  color: #2c3e50;
  margin: 0 0 15px 0;
  font-size: 1.5em;
  transition: color 0.3s ease;
}

.blog-title h2:hover {
  color: #409EFF;
}

.description {
  color: #5c6b7f;
  margin-bottom: 20px;
  line-height: 1.6;
}

.blog-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #8c9bab;
  font-size: 14px;
}

.meta-left {
  display: flex;
  gap: 20px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.read-more {
  color: #409EFF;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s ease;
}

.read-more:hover {
  transform: translateX(5px);
}

/* 侧边栏样式 */
.sidebar {
  border-radius: 12px;
  position: sticky;
  top: 20px;
}

.sidebar-title {
  font-size: 18px;
  color: #2c3e50;
  margin-bottom: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.category-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  margin-bottom: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-item:hover {
  background-color: #f0f7ff;
  color: #409EFF;
}

.category-name {
  display: flex;
  align-items: center;
  color: #5c6b7f;
}

.category-name i {
  margin-right: 8px;
  font-size: 16px;
}

.category-count {
  background-color: #f0f2f5;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 12px;
  color: #8c9bab;
  font-weight: 500;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .dev-tips-container {
    padding: 15px;
  }
  
  .el-col-18 {
    width: 100%;
  }
  
  .el-col-6 {
    width: 100%;
    margin-top: 20px;
  }
  
  .blog-title h2 {
    font-size: 1.3em;
  }
  
  .meta-left {
    gap: 10px;
    flex-wrap: wrap;
  }
}

/* 添加新的样式 */
.page-header {
  text-align: center;
  padding: 40px 0;
  color: #2c3e50;
}

.page-header h1 {
  font-size: 2em;
  margin-bottom: 10px;
}

.page-header p {
  color: #5c6b7f;
}

.loading-state {
  padding: 20px;
}

.empty-state {
  padding: 40px;
  text-align: center;
}
</style> 