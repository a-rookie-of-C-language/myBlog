/**
 * 静态文件生成脚本
 * 用于生成静态JSON文件，以便在GitHub Pages等静态托管环境中使用
 */

const fs = require('fs');
const path = require('path');

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
          readCount: 0
        });
      }
    });
  } catch (error) {
    console.error(`扫描目录 ${category} 失败:`, error);
  }
  
  return items;
}

// 确保目录存在
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`创建目录: ${dirPath}`);
  }
}

// 生成静态JSON文件
function generateStaticFiles() {
  const baseDir = path.join(__dirname, 'public', 'myBlog', 'contents');
  
  // 确保目录结构存在
  ensureDirectoryExists(path.join(baseDir, 'category'));
  ensureDirectoryExists(path.join(baseDir, 'item'));
  ensureDirectoryExists(path.join(baseDir, 'file'));
  
  // 处理每个分类
  Object.values(ContentCategory).forEach(category => {
    const items = scanDirectory(category);
    
    // 生成分类列表JSON
    const categoryFilePath = path.join(baseDir, 'category', `${category}.json`);
    fs.writeFileSync(categoryFilePath, JSON.stringify({
      code: 200,
      message: 'success',
      data: items
    }, null, 2));
    console.log(`生成分类列表文件: ${categoryFilePath}`);
    
    // 为每个内容项生成单独的JSON文件
    items.forEach(item => {
      // 生成内容项详情JSON
      const itemFilePath = path.join(baseDir, 'item', `${item.id}.json`);
      fs.writeFileSync(itemFilePath, JSON.stringify({
        code: 200,
        message: 'success',
        data: item
      }, null, 2));
      console.log(`生成内容项文件: ${itemFilePath}`);
      
      // 生成内容文件JSON
      try {
        const contentFilePath = path.join(__dirname, 'public', item.path);
        const content = fs.readFileSync(contentFilePath, 'utf-8');
        
        const fileJsonPath = path.join(baseDir, 'file', `${item.id}.json`);
        fs.writeFileSync(fileJsonPath, JSON.stringify({
          code: 200,
          message: 'success',
          data: content
        }, null, 2));
        console.log(`生成内容文件: ${fileJsonPath}`);
      } catch (error) {
        console.error(`读取文件 ${item.path} 失败:`, error);
      }
    });
  });
  
  console.log('静态文件生成完成！');
}

// 执行生成
generateStaticFiles();