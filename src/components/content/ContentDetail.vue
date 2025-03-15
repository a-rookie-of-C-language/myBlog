<template>
  <div class="content-detail-container">
    <!-- 粒子背景 -->
    <div id="particles-js" class="particles-container"></div>

    <div class="content-detail">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-state">
        <el-skeleton :rows="15" animated />
      </div>
      
      <!-- 内容展示 -->
      <div v-else class="content-body">
        <h1 class="title">{{ contentItem.title }}</h1>
        <div class="meta">
          <span class="date" v-if="contentItem.createTime">
            <i class="el-icon-time"></i>
            {{ formatDate(contentItem.createTime) }}
          </span>
          <span class="views" v-if="contentItem.readCount !== undefined">
            <i class="el-icon-view"></i>
            阅读: {{ contentItem.readCount }}
          </span>
          <span class="category">
            <i class="el-icon-folder"></i>
            {{ getCategoryName(contentItem.category) }}
          </span>
        </div>
        <div class="markdown-body" v-if="contentItem.type === ContentType.MARKDOWN" v-html="renderedContent"></div>
        <div class="html-body" v-else-if="contentItem.type === ContentType.HTML" v-html="contentItem.content"></div>
        <div class="text-body" v-else-if="contentItem.type === ContentType.TEXT">{{ contentItem.content }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { contentApi, type ContentItem, ContentType, ContentCategory } from '@/api/content'
import { formatDate } from '@/utils/dateFormat'
import { ElSkeleton } from 'element-plus'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'
import 'github-markdown-css/github-markdown-dark.css'
import 'particles.js'

// 配置 marked 使用 highlight.js 进行代码高亮
marked.setOptions({
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { 
        language: lang,
        ignoreIllegals: true 
      }).value
    }
    return code
  },
  gfm: true,
  breaks: true
})

const route = useRoute()
const loading = ref(true)
const contentItem = ref<ContentItem>({
  id: '',
  title: '',
  category: ContentCategory.DEV_TIPS,
  type: ContentType.MARKDOWN,
  path: '',
  content: ''
})

// 计算属性：渲染 Markdown 内容
const renderedContent = computed(() => {
  if (!contentItem.value.content) return ''
  try {
    return marked(contentItem.value.content)
  } catch (e) {
    console.error('Markdown 渲染失败:', e)
    return '内容渲染失败'
  }
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

const fetchContentDetail = async () => {
  try {
    loading.value = true
    const id = route.params.id as string
    const response = await contentApi.getContentById(id)
    
    if (response.code === 200 && response.data) {
      contentItem.value = response.data
      // 获取内容文件
      const contentResponse = await contentApi.getContentFile(id)
      if (contentResponse.code === 200) {
        contentItem.value.content = contentResponse.data
      }
      
      // 增加阅读计数
      contentApi.incrementReadCount(id).catch(error => {
        console.error('增加阅读计数失败:', error)
      })
    }
  } catch (error) {
    console.error('获取内容详情失败:', error)
  } finally {
    loading.value = false
  }
}

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
  fetchContentDetail()
  initParticles()
})
</script>

<style scoped>
.content-detail-container {
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

.content-detail {
  max-width: 900px;
  margin: 0 auto;
  padding: 30px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.18);
  transition: transform 0.3s ease;
}

.content-detail:hover {
  transform: translateY(-5px);
}

.title {
  font-size: 2.5em;
  color: #fff;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  background: linear-gradient(45deg, #fff, #7eb6ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.meta {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 30px;
  display: flex;
  gap: 20px;
  font-size: 0.9em;
}

.meta i {
  margin-right: 5px;
}

.loading-state {
  padding: 20px;
}

:deep(.markdown-body) {
  color: #e4e4e4;
  background: transparent;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif;
  font-size: 16px;
  line-height: 1.8;
  word-wrap: break-word;
  padding: 20px 0;
}

:deep(.markdown-body h1),
:deep(.markdown-body h2),
:deep(.markdown-body h3),
:deep(.markdown-body h4),
:deep(.markdown-body h5),
:deep(.markdown-body h6) {
  color: #fff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
}

:deep(.markdown-body pre) {
  background-color: rgba(0, 0, 0, 0.3) !important;
  border-radius: 8px;
  padding: 16px;
  overflow: auto;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

:deep(.markdown-body pre code) {
  white-space: pre;
  font-family: 'Fira Code', Consolas, Monaco, 'Courier New', Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
  background: transparent;
  padding: 0;
  border-radius: 0;
}

:deep(.markdown-body code) {
  font-family: 'Fira Code', Consolas, Monaco, 'Courier New', Courier, monospace;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 3px;
  padding: 0.2em 0.4em;
  font-size: 85%;
  color: #e4e4e4;
}

:deep(.markdown-body a) {
  color: #7eb6ff;
  text-decoration: none;
}

:deep(.markdown-body a:hover) {
  text-decoration: underline;
}

:deep(.markdown-body img) {
  max-width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

:deep(.markdown-body table) {
  border-collapse: collapse;
  width: 100%;
  margin: 16px 0;
  display: block;
  overflow-x: auto;
}

:deep(.markdown-body table th),
:deep(.markdown-body table td) {
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 8px 16px;
}

:deep(.markdown-body table th) {
  background-color: rgba(255, 255, 255, 0.05);
}

:deep(.markdown-body table tr:nth-child(2n)) {
  background-color: rgba(255, 255, 255, 0.02);
}

:deep(.markdown-body blockquote) {
  border-left: 4px solid #7eb6ff;
  padding: 0 16px;
  color: rgba(255, 255, 255, 0.7);
  margin: 16px 0;
}

:deep(.html-body),
:deep(.text-body) {
  color: #e4e4e4;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif;
  font-size: 16px;
  line-height: 1.8;
  word-wrap: break-word;
  padding: 20px 0;
}

:deep(.text-body) {
  white-space: pre-wrap;
}
</style>