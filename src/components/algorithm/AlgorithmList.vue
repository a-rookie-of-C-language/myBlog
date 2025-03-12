<template>
  <div class="algorithm-list-container">
    <!-- 粒子背景 -->
    <div id="particles-js" class="particles-container"></div>

    <div class="algorithm-list">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-state">
        <el-skeleton :rows="10" animated />
      </div>

      <!-- 算法列表 -->
      <div v-else class="list-content">
        <div v-for="item in algorithms" :key="item.id" class="algorithm-item">
          <router-link :to="`/algorithm/${item.id}`" class="item-link">
            <div class="item-header">
              <h2 class="item-title">{{ item.title }}</h2>
              <el-tag :type="getDifficultyType(item.difficulty)" size="large">
                {{ item.difficulty }}
              </el-tag>
            </div>
            
            <div class="item-info">
              <span class="category">
                <el-icon><Folder /></el-icon>
                {{ item.category }}
              </span>
              <span class="complexity">
                <el-icon><Timer /></el-icon>
                时间复杂度: {{ item.timeComplexity }}
              </span>
              <span class="complexity">
                <el-icon><Monitor /></el-icon>
                空间复杂度: {{ item.spaceComplexity }}
              </span>
              <span class="read-count">
                <el-icon><View /></el-icon>
                {{ item.readCount || 0 }}
              </span>
            </div>
          </router-link>
        </div>

        <!-- 分页 -->
        <div class="pagination" v-if="total > 0">
          <el-pagination
            v-model:current-page="currentPage"
            :page-size="pageSize"
            :total="total"
            @current-change="handlePageChange"
            layout="prev, pager, next"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElSkeleton, ElTag, ElPagination } from 'element-plus'
import { Folder, Timer, Monitor, View } from '@element-plus/icons-vue'
import { algorithmApi, type Algorithm } from '@/api/algorithm'
import 'particles.js'

const loading = ref(true)
const algorithms = ref<Algorithm[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 获取难度标签类型
const getDifficultyType = (difficulty: string) => {
  switch (difficulty?.toLowerCase()) {
    case '简单':
      return 'success'
    case '中等':
      return 'warning'
    case '困难':
      return 'danger'
    default:
      return 'info'
  }
}

// 获取算法列表
const getAlgorithms = async () => {
  try {
    loading.value = true
    const response = await algorithmApi.getAllAlgorithms()
    if (response.code === 200) {
      algorithms.value = response.data
      total.value = response.data.length
    }
  } catch (error) {
    console.error('获取算法列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 处理页码变化
const handlePageChange = (page: number) => {
  currentPage.value = page
  getAlgorithms()
}

// 初始化粒子效果
const initParticles = () => {
  window.particlesJS('particles-js', {
    particles: {
      number: { value: 80, density: { enable: true, value_area: 800 } },
      color: { value: '#ffffff' },
      shape: { type: 'circle' },
      opacity: { value: 0.5, random: false },
      size: { value: 3, random: true },
      line_linked: {
        enable: true,
        distance: 150,
        color: '#ffffff',
        opacity: 0.4,
        width: 1
      },
      move: {
        enable: true,
        speed: 6,
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
        onhover: { enable: true, mode: 'grab' },
        onclick: { enable: true, mode: 'push' },
        resize: true
      },
      modes: {
        grab: { distance: 140, line_linked: { opacity: 1 } },
        push: { particles_nb: 4 }
      }
    },
    retina_detect: true
  })
}

onMounted(() => {
  getAlgorithms()
  initParticles()
})
</script>

<style scoped>
.algorithm-list-container {
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

.algorithm-list {
  max-width: 1200px;
  margin: 0 auto;
}

.loading-state {
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.algorithm-item {
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.algorithm-item:hover {
  transform: translateY(-2px);
}

.item-link {
  display: block;
  padding: 20px;
  color: #fff;
  text-decoration: none;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.item-title {
  margin: 0;
  font-size: 1.5em;
  color: #fff;
}

.item-info {
  display: flex;
  gap: 20px;
  color: #a8a8a8;
  font-size: 0.9em;
}

.item-info span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.pagination {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}

:deep(.el-pagination) {
  --el-pagination-bg-color: transparent;
  --el-pagination-hover-color: #409eff;
  --el-text-color-primary: #fff;
}
</style> 