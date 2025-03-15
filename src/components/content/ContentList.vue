<template>
  <div class="content-list-container">
    <!-- 粒子背景 -->
    <div id="particles-js" class="particles-container"></div>

    <div class="content-list">
      <h1 class="category-title">{{ getCategoryName(category) }}</h1>
      
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-state">
        <el-skeleton :rows="10" animated />
      </div>
      
      <!-- 内容列表 -->
      <div v-else-if="contentItems.length > 0" class="content-items">
        <el-card 
          v-for="item in contentItems" 
          :key="item.id"
          class="content-item"
          shadow="hover"
          @click="navigateToDetail(item.id)">
          <div class="item-content">
            <h2 class="item-title">{{ item.title }}</h2>
            <p class="item-description" v-if="item.description">{{ item.description }}</p>
            <div class="item-meta">
              <span class="date" v-if="item.createTime">
                <i class="el-icon-time"></i>
                {{ formatDate(item.createTime) }}
              </span>
              <span class="views" v-if="item.readCount !== undefined">
                <i class="el-icon-view"></i>
                阅读: {{ item.readCount }}
              </span>
            </div>
          </div>
        </el-card>
      </div>
      
      <!-- 空状态 -->
      <el-empty v-else description="暂无内容" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { contentApi, type ContentItem, ContentCategory } from '@/api/content'
import { formatDate } from '@/utils/dateFormat'
import { ElSkeleton, ElCard, ElEmpty } from 'element-plus'
import 'particles.js'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const contentItems = ref<ContentItem[]>([])

// 从路由参数获取分类
const category = computed(() => {
  const routeCategory = route.params.category as string
  if (Object.values(ContentCategory).includes(routeCategory as ContentCategory)) {
    return routeCategory as ContentCategory
  }
  return ContentCategory.DEV_TIPS // 默认分类
})

// 获取分类名称
const getCategoryName = (category: ContentCategory): string => {
  const categoryMap = {
    [ContentCategory.DEV_TIPS]: '开发技巧',
    [ContentCategory.ALGORITHMS]: '算法分析',
    [ContentCategory.ADVICE_BOOKS]: '推荐书籍'
  }
  return categoryMap[category] || category
}

// 获取内容列表
const fetchContentList = async () => {
  try {
    loading.value = true
    const response = await contentApi.getContentsByCategory(category.value)
    
    if (response.code === 200 && response.data) {
      contentItems.value = response.data
    }
  } catch (error) {
    console.error('获取内容列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 导航到详情页
const navigateToDetail = (id: string) => {
  router.push(`/content/${id}`)
}

// 初始化粒子效果
const initParticles = () => {
  window.particlesJS('particles-js', {
    particles: {
      number: {
        value: 80,
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: {
        value: '#ffffff'
      },
      shape: {
        type: 'circle'
      },
      opacity: {
        value: 0.5,
        random: false
      },
      size: {
        value: 3,
        random: true
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: '#ffffff',
        opacity: 0.4,
        width: 1
      },
      move: {
        enable: true,
        speed: 2,
        direction: 'none',
        random: false,
        straight: false,
        out_mode: 'out',
        bounce: false
      }
    },
    interactivity: {
      detect_on: 'canvas',
      events: {
        onhover: {
          enable: true,
          mode: 'grab'
        },
        onclick: {
          enable: true,
          mode: 'push'
        },
        resize: true
      },
      modes: {
        grab: {
          distance: 140,
          line_linked: {
            opacity: 1
          }
        },
        push: {
          particles_nb: 4
        }
      }
    },
    retina_detect: true
  })
}

onMounted(() => {
  fetchContentList()
  initParticles()
})
</script>

<style scoped>
.content-list-container {
  min-height: 100vh;
  padding: 20px;
  position: relative;
  z-index: 1;
}

.particles-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #1b2735 0%, #090a0f 100%);
  z-index: -1;
}

.content-list {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.category-title {
  font-size: 2.5em;
  color: #fff;
  margin-bottom: 30px;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  background: linear-gradient(45deg, #fff, #7eb6ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.content-items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.content-item {
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  overflow: hidden;
}

.content-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.item-content {
  padding: 10px;
}

.item-title {
  font-size: 1.5em;
  margin-bottom: 10px;
  color: #fff;
}

.item-description {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-meta {
  display: flex;
  justify-content: space-between;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9em;
}

.loading-state {
  padding: 20px;
}
</style>