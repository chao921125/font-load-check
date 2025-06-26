# 使用指南

## 安装

### npm

```bash
npm install font-load-check
```

### yarn

```bash
yarn add font-load-check
```

### pnpm

```bash
pnpm add font-load-check
```

## 基本用法

### ES模块导入

```javascript
import FontChecker from 'font-load-check';

// 创建实例
const checker = new FontChecker();

// 检查字体
const result = await checker.check('Arial');
console.log(result.success); // true/false
```

### CommonJS导入

```javascript
const FontChecker = require('font-load-check');

// 创建实例
const checker = new FontChecker();

// 检查字体
checker.check('Arial').then(result => {
  console.log(result.success);
});
```

### 在浏览器中使用

```html
<!-- 通过 CDN 引入 -->
<script src="https://unpkg.com/font-load-check/dist/index.umd.js"></script>
<!-- 或者 -->
<script src="https://cdn.jsdelivr.net/npm/font-load-check/dist/index.umd.js"></script>

<script>
  // 全局变量 FontChecker
  const checker = new FontChecker();
  checker.check('Arial').then(result => {
    console.log(result.success);
  });
</script>
```

## 详细示例

### 检查单个字体

```javascript
import FontChecker from 'font-load-check';

const checker = new FontChecker();

// 检查单个字体
const result = await checker.check('Arial');
if (result.success) {
  console.log('Arial 字体已加载');
} else {
  console.log('Arial 字体加载失败');
}
```

### 检查多个字体

```javascript
import FontChecker from 'font-load-check';

const checker = new FontChecker();

// 检查多个字体
const result = await checker.check(['Arial', 'Helvetica', 'Times New Roman']);
if (result.success) {
  console.log('所有字体已加载');
} else {
  console.log('部分字体加载失败:', result.failedFonts);
}
```

### 检查所有字体

```javascript
import FontChecker from 'font-load-check';

const checker = new FontChecker();

// 检查所有已加载的字体
const result = await checker.check();
console.log('所有字体加载状态:', result);
```

### 动态添加字体

```javascript
import FontChecker from 'font-load-check';

const checker = new FontChecker();

// 创建字体实例
const fontFace = new FontFace('MyCustomFont', 'url(/fonts/myfont.woff2)');

// 加载字体
fontFace.load().then(() => {
  // 添加到字体检查器
  const success = checker.addFont(fontFace);
  if (success) {
    console.log('字体添加成功');
  } else {
    console.log('字体添加失败');
  }
});
```

### 使用工具函数

```javascript
import { checkFont, checkFonts, isFontLoaded } from 'font-load-check';

// 检查单个字体
const result = await checkFont('Arial');
console.log(result.loaded);

// 检查多个字体
const result = await checkFonts(['Arial', 'Helvetica']);
console.log(result.success);

// 同步检查字体
const loaded = isFontLoaded('Arial');
console.log(loaded);
```

## 在框架中使用

### Vue 3

```vue
<template>
  <div>
    <div v-if="loading">正在检查字体...</div>
    <div v-else-if="result && result.success">所有字体已加载</div>
    <div v-else-if="result">
      <p>部分字体加载失败：</p>
      <ul>
        <li v-for="font in result.failedFonts" :key="font.name">
          {{ font.name }}: {{ font.status }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import FontChecker from 'font-load-check';

const loading = ref(true);
const result = ref(null);

onMounted(async () => {
  const checker = new FontChecker();
  result.value = await checker.check(['Arial', 'Helvetica']);
  loading.value = false;
});
</script>
```

### React

```jsx
import React, { useState, useEffect } from 'react';
import FontChecker from 'font-load-check';

function FontCheckComponent() {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  
  useEffect(() => {
    async function checkFonts() {
      const checker = new FontChecker();
      const checkResult = await checker.check(['Arial', 'Helvetica']);
      setResult(checkResult);
      setLoading(false);
    }
    
    checkFonts();
  }, []);
  
  if (loading) {
    return <div>正在检查字体...</div>;
  }
  
  if (result && result.success) {
    return <div>所有字体已加载</div>;
  } else if (result) {
    return (
      <div>
        <p>部分字体加载失败：</p>
        <ul>
          {result.failedFonts.map(font => (
            <li key={font.name}>{font.name}: {font.status}</li>
          ))}
        </ul>
      </div>
    );
  }
  
  return null;
}

export default FontCheckComponent;
```

## 配置选项

### 超时设置

```javascript
import FontChecker from 'font-load-check';

// 设置5秒超时
const checker = new FontChecker({ timeout: 5000 });

// 检查字体
const result = await checker.check('Arial');
```

### 错误处理

```javascript
import FontChecker from 'font-load-check';

const checker = new FontChecker();

try {
  const result = await checker.check('MyFont');
  console.log(result);
} catch (error) {
  if (error instanceof TypeError) {
    console.error('浏览器不支持字体加载API');
  } else if (error.message === 'Font load timeout') {
    console.error('字体加载超时');
  } else {
    console.error('字体加载失败:', error);
  }
}
```

## 最佳实践

### 1. 检查字体可用性

```javascript
import { isFontLoaded } from 'font-load-check';

// 在页面加载时检查关键字体
document.addEventListener('DOMContentLoaded', () => {
  const criticalFonts = ['Arial', 'Helvetica'];
  const missingFonts = criticalFonts.filter(font => !isFontLoaded(font));
  
  if (missingFonts.length > 0) {
    console.warn('缺少关键字体:', missingFonts);
  }
});
```

### 2. 等待字体加载

```javascript
import { waitForFonts } from 'font-load-check';

// 等待字体加载完成后再显示内容
async function initializeApp() {
  const fonts = ['MyCustomFont', 'Arial'];
  
  try {
    await waitForFonts(fonts, 10000); // 10秒超时
    console.log('所有字体已加载，可以显示内容');
    showContent();
  } catch (error) {
    console.error('字体加载失败，使用备用方案');
    showFallbackContent();
  }
}
```

## 常见问题

### Q: 为什么某些字体检查失败？

A: 可能的原因包括：
- 字体文件不存在或路径错误
- 字体格式不支持
- 网络问题导致字体加载失败
- 浏览器不支持该字体格式

### Q: 如何处理字体加载超时？

A: 可以增加超时时间或实现重试机制：

```javascript
const checker = new FontChecker({ timeout: 10000 }); // 10秒超时

// 或者实现重试
async function checkFontWithRetry(fontName, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await checker.check(fontName);
      if (result.success) return result;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000)); // 等待1秒后重试
    }
  }
}
``` 