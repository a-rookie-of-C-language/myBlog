<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { bookApi } from '@/api/book'
import { ElMessage } from 'element-plus'

interface Book {
  id: number
  title: string
  author: string
  description: string
  coverUrl: string
}

const books = ref<Book[]>([])
const loading = ref(true)

const fetchBooks = async () => {
  try {
    const response = await bookApi.getAllBooks()
    console.log('书籍数据:', response) // 添加日志
    if (response.code === 200) {
      books.value = response.data
    } else {
      ElMessage.error(response.message || '获取书籍列表失败')
    }
  } catch (error) {
    console.error('获取书籍列表失败:', error)
    ElMessage.error('获取书籍列表失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchBooks()
})

const showBookDetail = (book: Book) => {
  console.log('查看书籍详情:', book.title)
}
</script>

<template>
  <div class="book-recommend">
    <div class="animated-background">
      <div class="wave"></div>
      <div class="wave"></div>
      <div class="wave"></div>
    </div>
    
    <div class="content">
      <div class="page-header">
        <h1>推荐书籍</h1>
        <p class="subtitle">精选技术书籍推荐与读书笔记</p>
      </div>

      <div v-if="loading" class="loading-container">
        <el-skeleton :rows="3" animated />
      </div>

      <div v-else class="books-container">
        <div v-for="book in books" :key="book.id" class="book-card">
          <div class="book-cover">
            <img :src="book.coverUrl" :alt="book.title">
          </div>
          <div class="book-info">
            <h3 class="book-title">{{ book.title }}</h3>
            <p class="book-author">作者：{{ book.author }}</p>
            <p class="book-description">{{ book.description }}</p>
            <el-button type="primary" size="small" @click="showBookDetail(book)">
              查看详情
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.book-recommend {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  min-height: 100vh;
  overflow: hidden;
}

.animated-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background: linear-gradient(135deg, #fff6e5, #ffecd2, #ffe4e1);
  overflow: hidden;
}

.wave {
  position: absolute;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, rgba(255, 173, 122, 0.05), rgba(255, 204, 153, 0.05));
  transform-origin: 50% 50%;
  border-radius: 43%;
  animation: drift linear infinite;
  pointer-events: none;
}

.wave:nth-child(1) {
  animation-duration: 20s;
}

.wave:nth-child(2) {
  animation-duration: 25s;
  background: linear-gradient(45deg, rgba(255, 198, 112, 0.03), rgba(255, 228, 196, 0.03));
}

.wave:nth-child(3) {
  animation-duration: 30s;
  background: linear-gradient(45deg, rgba(255, 182, 193, 0.02), rgba(255, 218, 185, 0.02));
}

@keyframes drift {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.content {
  position: relative;
  z-index: 1;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(5px);
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-header h1 {
  font-size: 2.5em;
  color: #2c3e50;
  margin-bottom: 10px;
}

.subtitle {
  color: #666;
  font-size: 1.2em;
}

.books-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  padding: 20px 0;
}

.book-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
}

.book-cover {
  height: 300px;
  overflow: hidden;
}

.book-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.book-info {
  padding: 20px;
}

.book-title {
  font-size: 1.4em;
  color: #2c3e50;
  margin-bottom: 10px;
}

.book-author {
  color: #666;
  font-size: 0.9em;
  margin-bottom: 15px;
}

.book-description {
  color: #666;
  font-size: 0.95em;
  line-height: 1.6;
  margin-bottom: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.loading-container {
  padding: 20px;
}

@media (max-width: 768px) {
  .content {
    padding: 20px;
  }
  
  .books-container {
    grid-template-columns: 1fr;
  }
  
  .book-cover {
    height: 200px;
  }
  
  .wave {
    animation-duration: 40s;
  }
}
</style> 