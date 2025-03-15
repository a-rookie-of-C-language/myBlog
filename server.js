const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// 启用CORS
app.use(cors());

// 解析JSON请求体
app.use(express.json());

// 静态文件服务
app.use(express.static(path.join(__dirname, 'public')));

// 内容类型枚举
const ContentType = {
  MARKDOWN: 'markdown',
  HTML: 'html',
  TEXT: 'text'
};

// 内容分类枚举
const ContentCategory = {
  DEV_TIPS: 'devTips',
  ALGORITHMS: 'algorithms',
  ADVICE_BOOKS: 'adviceBooks'
};

// 内存中的阅读计数器
const readCounters = {};

// 获取文件扩展名对应的内容类型
function getContentTypeByExt(ext) {
  switch (ext.toLowerCase()) {
    case '.md':
      return ContentType.MARKDOWN;
    case '.html':
    case '.htm':
      return ContentType.HTML;
    default:
      return ContentType.TEXT;
  }
}

// 扫描目录获取内容列表
function scanDirectory(category) {
  const dirPath = path.join(__dirname, 'public', 'resources', category);
  const items = [];
  
  try {
    if (!fs.existsSync(dirPath)) {
      return items;
    }
    
    const files = fs.readdirSync(dirPath);
    
    files.forEach((file, index) => {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isFile()) {
        const ext = path.extname(file);
        const basename = path.basename(file, ext);
        
        items.push({
          id: `${category}-${index}`,
          title: basename.replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase()),
          category: category,
          type: getContentTypeByExt(ext),
          path: `resources/${category}/${file}`,
          createTime: stats.birthtime.toISOString(),
          updateTime: stats.mtime.toISOString(),
          readCount: readCounters[`${category}-${index}`] || 0
        });
      }
    });
  } catch (error) {
    console.error(`扫描目录 ${category} 失败:`, error);
  }
  
  return items;
}

// API路由

// 获取指定分类的所有内容项
app.get('/myBlog/contents/category/:category', (req, res) => {
  const { category } = req.params;
  
  if (!Object.values(ContentCategory).includes(category)) {
    return res.status(400).json({
      code: 400,
      message: '无效的内容分类',
      data: null
    });
  }
  
  const items = scanDirectory(category);
  
  res.json({
    code: 200,
    message: 'success',
    data: items
  });
});

// 获取指定ID的内容项
app.get('/myBlog/contents/item/:id', (req, res) => {
  const { id } = req.params;
  const [category, index] = id.split('-');
  
  if (!category || !index) {
    return res.status(400).json({
      code: 400,
      message: '无效的内容ID',
      data: null
    });
  }
  
  const items = scanDirectory(category);
  const item = items.find(item => item.id === id);
  
  if (!item) {
    return res.status(404).json({
      code: 404,
      message: '内容不存在',
      data: null
    });
  }
  
  res.json({
    code: 200,
    message: 'success',
    data: item
  });
});

// 获取指定内容项的文件内容
app.get('/myBlog/contents/file/:id', (req, res) => {
  const { id } = req.params;
  const [category, index] = id.split('-');
  
  if (!category || !index) {
    return res.status(400).json({
      code: 400,
      message: '无效的内容ID',
      data: null
    });
  }
  
  const items = scanDirectory(category);
  const item = items.find(item => item.id === id);
  
  if (!item) {
    return res.status(404).json({
      code: 404,
      message: '内容不存在',
      data: null
    });
  }
  
  try {
    const filePath = path.join(__dirname, 'public', item.path);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    res.json({
      code: 200,
      message: 'success',
      data: content
    });
  } catch (error) {
    console.error(`读取文件 ${item.path} 失败:`, error);
    res.status(500).json({
      code: 500,
      message: '读取文件失败',
      data: null
    });
  }
});

// 增加内容阅读计数
app.post('/myBlog/contents/read/:id', (req, res) => {
  const { id } = req.params;
  
  if (!readCounters[id]) {
    readCounters[id] = 0;
  }
  
  readCounters[id]++;
  
  res.json({
    code: 200,
    message: 'success',
    data: null
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});