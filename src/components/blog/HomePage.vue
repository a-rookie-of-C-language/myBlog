<template>
  <div class="home-container">
    <!-- Banner区域 -->
    <div class="banner">
      <div class="banner-content">
        <h1 class="animate__animated animate__fadeInDown">欢迎来到我的博客</h1>
        <p class="animate__animated animate__fadeInUp">分享技术与生活的点点滴滴</p>
      </div>
      <div class="wave-wrapper">
        <div class="wave"></div>
      </div>
    </div>

    <!-- 分类卡片区域 -->
    <div class="content-section">
      <div class="code-particles">
        <div class="particle-line" v-for="n in 15" :key="n"></div>
      </div>
      <div class="category-cards">
        <router-link 
          v-for="(item, index) in menuItems" 
          :key="index"
          :to="item.path"
          class="category-card">
          <div class="card-content">
            <el-icon class="card-icon"><component :is="item.icon" /></el-icon>
            <h3>{{ item.name }}</h3>
            <p>{{ item.description }}</p>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {blogApi} from '@/api/blog'
import {ElMessage} from 'element-plus'
import { 
  Monitor,
  Reading,
  DataLine,
  FolderOpened,
  Coffee,
  User,
  ArrowDown,
  Location,
  ChatDotRound,
  Connection,
  Collection,
  Folder,
  Right
} from '@element-plus/icons-vue'

// 获取分类列表
const fetchCategories = async () => {
  try {
    const response = await blogApi.getAllBlogs()
    if (response.data && Array.isArray(response.data)) {
      categories.value = [...new Set(
        response.data
          .map(blog => blog.category)
          .filter((category): category is string => category !== undefined)
      )]
    }
  } catch (error) {
    console.error('获取分类失败:', error)
    ElMessage.error('获取分类列表失败')
  }
}

onMounted(() => {
  fetchCategories()
})

const categories = ref<string[]>([])
// 导航菜单项
const menuItems = [
  { 
    name: '开发技巧', 
    path: '/content/category/devTips',
    icon: Monitor,
    description: '分享实用的编程技巧和开发经验',
  },
  { 
    name: '推荐书籍', 
    path: '/content/category/adviceBooks', 
    icon: Reading,
    description: '精选技术书籍推荐与读书笔记',
  },
  { 
    name: '算法分析', 
    path: '/content/category/algorithms', 
    icon: DataLine,
    description: '深入浅出的算法解析与实现',
  },
  { 
    name: '项目实战', 
    path: '/category/projects', 
    icon: FolderOpened,
    description: '实际项目经验与技术难点攻克',
  },
  { 
    name: '个人日常', 
    path: '/category/daily', 
    icon: Coffee,
    description: '记录生活点滴与技术感悟',
  }
]
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
}

.banner {
  height: 400px;
  background: linear-gradient(120deg, #2b5876 0%, #4e4376 100%);
  position: relative;
  overflow: hidden;
}

.banner-content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;
}

.banner h1 {
  font-size: 3em;
  margin-bottom: 20px;
  font-weight: 700;
}

.banner p {
  font-size: 1.2em;
  opacity: 0.9;
}

/* 波浪动效 */
.wave-wrapper {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100px;
  overflow: hidden;
}

.wave {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 400%;
  height: 100%;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23f6f8fa' fill-opacity='1' d='M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E") repeat-x;
  background-size: 25% 100%;
  animation: wave 20s cubic-bezier(0.36, 0, 0.64, 1) infinite;
}

@keyframes wave {
  0% { 
    transform: translateX(0); 
  }
  100% { 
    transform: translateX(-50%);
  }
}

.wave::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: inherit;
  opacity: 0.5;
  animation: wave 15s cubic-bezier(0.36, 0, 0.64, 1) infinite reverse;
}

.wave::after {
  content: '';
  position: absolute;
  top: 10px;
  left: 0;
  width: 100%;
  height: 100%;
  background: inherit;
  opacity: 0.3;
  animation: wave 18s cubic-bezier(0.36, 0, 0.64, 1) infinite;
}
.category-cards {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  padding: 20px;
  position: relative;
  z-index: 1;
}

.category-card {
  text-decoration: none;
  color: inherit;
}

.card-content {
  background: white;
  border-radius: 15px;
  padding: 5px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.card-content:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.card-icon {
  font-size: 36px;
  color: #11998e;
  margin-bottom: 20px;
  transition: transform 0.3s ease;
}

.card-content:hover .card-icon {
  transform: scale(1.1);
}

.card-content h3 {
  font-size: 1.4em;
  color: #2c3e50;
  margin-bottom: 15px;
}

.card-content p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;
  flex-grow: 1;
}

.article-count {
  background: #f8f9fa;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.9em;
  color: #666;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .content-section {
    padding: 20px;
  }
  
  .category-cards {
    gap: 20px;
    padding: 10px;
  }
  
  .card-content {
    padding: 20px;
  }
}
</style>