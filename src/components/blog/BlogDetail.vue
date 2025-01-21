<template>
  <div class="blog-detail-container">
    <!-- 粒子背景 -->
    <div id="particles-js" class="particles-container"></div>

    <div class="blog-detail">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-state">
        <el-skeleton :rows="15" animated />
      </div>
      
      <!-- 博客内容 -->
      <div v-else class="blog-content">
        <h1 class="title">{{ blog.title }}</h1>
        <div class="meta">
          <span class="date">
            <i class="el-icon-time"></i>
            {{ formatDate(blog.createTime) }}
          </span>
          <span class="views">
            <i class="el-icon-view"></i>
            阅读: {{ blog.readCount }}
          </span>
        </div>
        <div class="markdown-body" v-html="renderedContent"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { blogApi, type Blog } from '@/api/blog'
import { formatDate } from '@/utils/dateFormat'
import { ElSkeleton } from 'element-plus'
import { marked } from 'marked'
import 'highlight.js/styles/github-dark.css'
import 'github-markdown-css/github-markdown-dark.css'
import 'particles.js'

const route = useRoute()
const loading = ref(true)
const blog = ref<Blog>({
  id: '',
  title: '',
  content: '',
  createTime: '',
  readCount: 0
})

// 计算属性：渲染 Markdown 内容
const renderedContent = computed(() => {
  if (!blog.value.content) return ''
  try {
    return marked(blog.value.content)
  } catch (e) {
    console.error('Markdown 渲染失败:', e)
    return '内容渲染失败'
  }
})

const fetchBlogDetail = async () => {
  try {
    loading.value = true
    const id = route.params.id as string
    const response = await blogApi.getBlogById(id)
    
    if (response.code === 200 && response.data) {
      blog.value = response.data as Blog
      // 获取博客内容
      const contentResponse = await blogApi.getBlogContent(id)
      if (contentResponse.code === 200) {
        blog.value.content = contentResponse.data
      }
    }
  } catch (error) {
    console.error('获取博客详情失败:', error)
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
  fetchBlogDetail()
  initParticles()
})
</script>

<style scoped>
.blog-detail-container {
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

.blog-detail {
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

.blog-detail:hover {
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

:deep(.markdown-body code) {
  font-family: 'Fira Code', Consolas, Monaco, 'Courier New', Courier, monospace;
  background-color: rgba(255, 255, 255, 0.1);
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

:deep(.markdown-body blockquote) {
  border-left: 4px solid rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.7);
  padding: 0 1em;
}

:deep(.markdown-body table) {
  border-collapse: collapse;
  width: 100%;
  margin: 16px 0;
}

:deep(.markdown-body table th),
:deep(.markdown-body table td) {
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 6px 13px;
}

:deep(.markdown-body table tr) {
  background-color: rgba(255, 255, 255, 0.05);
}

:deep(.markdown-body table tr:nth-child(2n)) {
  background-color: rgba(255, 255, 255, 0.02);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .blog-detail {
    padding: 20px;
  }

  .title {
    font-size: 2em;
  }

  :deep(.markdown-body) {
    font-size: 15px;
  }
}
</style> 