<template>
  <div class="algorithm-detail-container">
    <!-- 粒子背景 -->
    <div id="particles-js" class="particles-container"></div>

    <div class="algorithm-detail">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-state">
        <el-skeleton :rows="15" animated />
      </div>

      <!-- 算法内容 -->
      <div v-else class="content">
        <h1 class="title">{{ algorithm.title }}</h1>
        <div class="difficulty-tag">
          <el-tag :type="difficultyType">{{ algorithm.difficulty }}</el-tag>
        </div>

        <div class="content-wrapper">
          <!-- 左侧内容：题目描述、示例、提示、复杂度分析 -->
          <div class="left-panel">
            <div class="description">
              <h3>题目描述</h3>
              <div class="markdown-body" v-html="renderedDescription"></div>
            </div>

            <div class="hints">
              <h3>提示</h3>
              <div class="markdown-body" v-html="renderedHints"></div>
            </div>

            <div class="complexity">
              <h3>复杂度分析</h3>
              <p>时间复杂度: {{ algorithm.timeComplexity }}</p>
              <p>空间复杂度: {{ algorithm.spaceComplexity }}</p>
            </div>
          </div>

          <!-- 右侧内容：代码实现和解题思路 -->
          <div class="right-panel">
            <div class="panel-header">
              <h3>{{ showSolution ? '解题思路' : '代码实现' }}</h3>
              <el-button 
                type="primary" 
                size="small" 
                @click="toggleSolution"
              >
                {{ showSolution ? '查看代码' : '查看解题思路' }}
              </el-button>
            </div>
            <div class="markdown-body code-section" v-if="!showSolution" v-html="renderedCode"></div>
            <div class="markdown-body solution-section" v-else v-html="renderedSolution"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { algorithmApi, type Algorithm } from '@/api/algorithm'
import { ElSkeleton, ElButton } from 'element-plus'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'
import 'github-markdown-css/github-markdown-dark.css'
import 'particles.js'

const route = useRoute()
const loading = ref(true)
const algorithm = ref<Algorithm>({} as Algorithm)

// 配置 marked
marked.setOptions({
  highlight: function(code: string, lang: string) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value
    }
    return hljs.highlightAuto(code).value
  },
  breaks: true
})

// 计算属性：难度标签类型
const difficultyType = computed(() => {
  switch (algorithm.value.difficulty?.toLowerCase()) {
    case '简单':
      return 'success'
    case '中等':
      return 'warning'
    case '困难':
      return 'danger'
    default:
      return 'info'
  }
})

// 渲染 Markdown 内容
const renderedDescription = computed(() => {
  return algorithm.value.description ? marked(algorithm.value.description) : ''
})

const renderedCode = computed(() => {
  return algorithm.value.content ? marked(algorithm.value.content) : ''
})

// 添加解题思路切换状态
const showSolution = ref(false)

// 切换解题思路/代码实现
const toggleSolution = () => {
  showSolution.value = !showSolution.value
}

// 渲染解题思路
const renderedSolution = computed(() => {
  return algorithm.value.solution ? marked(algorithm.value.solution) : ''
})

// 初始化粒子效果
const initParticles = () => {

  window.particlesJS('particles-js', {
    particles: {
      number: { 
        value: 80, 
        density: { enable: true, value_area: 800 } 
      },
      color: { value: '#ffffff' },
      shape: { type: 'circle' },
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
        speed: 6,
        direction: 'none',
        random: false,
        straight: false,
        out_mode: 'out',
        bounce: false
      }
    },
    interactivity: {  // 添加交互配置
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
    retina_detect: true  // 添加视网膜显示检测
  })
}

// 获取算法详情
const getAlgorithmDetail = async () => {
  try {
    const id = route.params.id
    if (!id) {
      console.error('未找到算法ID')
      return
    }
    
    loading.value = true
    console.log('正在获取数据，ID:', id)
    const response = await algorithmApi.getAlgorithmById(id as string)
    console.log('API响应:', response)
    if (response.code === 200) {
      algorithm.value = response.data
      console.log('设置的算法数据:', algorithm.value)
    } else {
      console.error('API返回错误:', response)
    }
  } catch (error) {
    console.error('获取算法详情失败:', error)
  } finally {
    loading.value = false
  }
}

// 添加路由参数监听
watch(
  () => route.params.id,
  (newId) => {
    console.log('路由参数变化:', newId)
    if (newId) {
      getAlgorithmDetail()
    }
  },
  { immediate: true }
)

onMounted(() => {
  getAlgorithmDetail()
  initParticles()
})
</script>

<style scoped>
.algorithm-detail-container {
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

.algorithm-detail {
  max-width: 1600px;
  margin: 0 auto;
  color: #fff;
}

.content-wrapper {
  display: flex;
  gap: 24px;
  margin-top: 24px;
}

.left-panel {
  flex: 1;
  min-width: 0;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 8px;
}

.right-panel {
  flex: 1;
  min-width: 0;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 8px;
}

.title {
  font-size: 2em;
  margin-bottom: 16px;
}

.difficulty-tag {
  margin-bottom: 24px;
}

.description, .examples, .hints, .complexity {
  margin-bottom: 32px;
}

h3 {
  color: #fff;
  margin-bottom: 16px;
  font-size: 1.5em;
}

.markdown-body {
  background: rgba(0, 0, 0, 0.3);
  padding: 16px;
  border-radius: 8px;
  margin-top: 12px;
}

:deep(.markdown-body) {
  color: #e1e1e1;
}

:deep(.markdown-body pre) {
  background-color: #1e1e1e !important;
}

:deep(.markdown-body code) {
  color: #e1e1e1;
  background-color: #1e1e1e;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.panel-header h3 {
  margin: 0;
}

:deep(.el-button) {
  background-color: rgba(64, 158, 255, 0.1);
  border: 1px solid rgba(64, 158, 255, 0.2);
  color: #409eff;
}

:deep(.el-button:hover) {
  background-color: #409eff;
  border-color: #409eff;
  color: #fff;
}

@media (max-width: 1024px) {
  .content-wrapper {
    flex-direction: column;
  }

  .left-panel,
  .right-panel {
    width: 100%;
  }
}
</style> 