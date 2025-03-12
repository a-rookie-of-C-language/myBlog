<template>
  <div class="blog-detail-container">
    <div class="blog-detail">
      <div v-if="loading" class="loading-state">
        <el-skeleton :rows="15" animated />
      </div>

      <div v-else class="algorithm-content">
        <div class="content-wrapper">
          <div class="left-column">
            <div class="description-section markdown-body" v-html="descriptionContent"></div>
          </div>
          
          <div class="right-column">
            <div class="solution-section markdown-body" v-html="solutionContent"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { algorithmApi, type Algorithm } from '@/api/algorithm'
import { ElSkeleton } from 'element-plus'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'
import 'github-markdown-css/github-markdown-dark.css'

const route = useRoute()
const loading = ref(true)
const algorithm = ref<Algorithm>({
  id : 1,
  title: '',
  category: '',
  difficulty: '',
  timeComplexity: '',
  spaceComplexity: '',
  content: ''  // API 返回的 markdown 内容
})

// 配置 marked 使用 highlight.js 进行代码高亮
marked.setOptions({
  highlight: function(code:never, lang:never) {
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

// 将内容分割为描述和解决方案两部分
const descriptionContent = computed(() => {
  if (!algorithm.value.content) return ''
  const content = algorithm.value.content
  const sections = content.split('## 代码')
  return marked(sections[0]) // 包含描述和提示部分
})

const solutionContent = computed(() => {
  if (!algorithm.value.content) return ''
  const content = algorithm.value.content
  const sections = content.split('## 代码')
  if (sections.length > 1) {
    return marked('## 代码' + sections[1]) // 包含代码和解题思路部分
  }
  return ''
})

const fetchAlgorithmDetail = async () => {
  try {
    loading.value = true
    const id = route.params.id as string
    const response = await algorithmApi.getAlgorithmById(id)
    if(response.code === 200){
      algorithm.value = response.data
    }
  } catch (error) {
    console.error('获取博客详情失败:', error)
  } finally {
    loading.value = false
  }
}

// 禁用窗口滚动
const disableScroll = () => {
  document.body.style.overflow = 'hidden'
  document.documentElement.style.overflow = 'hidden' // html元素
}

// 启用窗口滚动
const enableScroll = () => {
  document.body.style.overflow = ''
  document.documentElement.style.overflow = '' // html元素
}

onMounted(() => {
  fetchAlgorithmDetail()
  disableScroll() // 组件挂载时禁用滚动
})

onUnmounted(() => {
  enableScroll() // 组件卸载时恢复滚动
})
</script>

<style scoped>
/* 禁止整体页面滚动 */
.blog-detail-container {
  min-height: 100vh;
  position: relative;
  background: linear-gradient(45deg, #1b2735 0%, #090a0f 100%);
  padding: 0;
  overflow: hidden; /* 禁止滚动 */
}

.blog-detail {
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 20px 40px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  overflow: hidden; /* 禁止滚动 */
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
  background-color: #1e1e1e !important;
  border-radius: 8px;
  padding: 16px;
  overflow: auto;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: none;
  tab-size: 2;
  -moz-tab-size: 2;
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
  background-color: #2d2d2d;
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
@media (max-width: 1280px) {
  .blog-detail {
    max-width: 95%;
    padding: 30px;
  }
}

@media (max-width: 768px) {
  .content-wrapper {
    flex-direction: column;
  }
  
  .left-column,
  .right-column {
    width: 100%;
    max-height: none;
    padding: 20px;
  }
}

.algorithm-content {
  width: 100%;
}

.content-wrapper {
  display: flex;
  gap: 30px;
  margin-top: 20px;
  height: calc(100vh - 100px);
  overflow: hidden; /* 禁止滚动 */
}

.left-column,
.right-column {
  flex: 1;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 30px;
  height: 100%;
  overflow-y: auto; /* 保持内容区域可滚动 */
}

/* 自定义滚动条样式 */
.left-column::-webkit-scrollbar,
.right-column::-webkit-scrollbar {
  width: 6px;
}

.left-column::-webkit-scrollbar-thumb,
.right-column::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

/* 解题思路部分的样式优化 */
:deep(.solution-section) {
  background: transparent;
}

/* 移除列表符号并优化间距 */
:deep(.solution-section ul),
:deep(.solution-section ol) {
  list-style: none;
  padding: 0;
  margin: 0;
}

:deep(.solution-section li) {
  padding: 8px 0;
  color: #e4e4e4;
}

/* 缩进处理 */
:deep(.solution-section ul li),
:deep(.solution-section ol li) {
  padding-left: 16px;
}

/* 代码块的滚动条样式 */
:deep(.markdown-body pre::-webkit-scrollbar) {
  height: 6px;
  width: 6px;
}

:deep(.markdown-body pre::-webkit-scrollbar-thumb) {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

:deep(.markdown-body pre::-webkit-scrollbar-track) {
  background: transparent;
}

/* 隐藏空格的背景色 */
:deep(.hljs .hljs-space),
:deep(.hljs .hljs-tab) {
  background: transparent !important;
}

/* 添加全局样式 */
:deep(body) {
  overflow: hidden;
  margin: 0;
  padding: 0;
}
</style>