# font-load-check

一个用于检测、管理和操作字体的现代 JavaScript/TypeScript 库，基于最新的 Web Font API。

[![npm version](https://img.shields.io/npm/v/font-load-check.svg)](https://www.npmjs.com/package/font-load-check)
[![license](https://img.shields.io/npm/l/font-load-check.svg)](https://github.com/chao921125/font-load-check/blob/main/LICENSE)
[![npm downloads](https://img.shields.io/npm/dm/font-load-check.svg)](https://www.npmjs.com/package/font-load-check)

[English](README.en.md) | 简体中文

## 特性

* 🚀 轻量级，无外部依赖
* 🔄 支持字体加载状态检测
* 📦 支持动态字体管理（添加、删除、清除）
* 💻 支持在浏览器环境中使用
* 📱 支持 TypeScript，提供完整的类型定义
* 🛠️ 提供丰富的工具函数
* 🔧 支持多种导入方式（ES模块、CommonJS、UMD）

## 功能

### 字体检测

* `check`: 检查字体是否已加载
* `checkFont`: 检查单个字体
* `checkFonts`: 检查多个字体
* `isFontLoaded`: 同步检查字体加载状态

### 字体管理

* `addFont`: 动态添加字体
* `deleteFont`: 删除字体
* `clearFonts`: 清除所有动态添加的字体

### 工具函数

* `createFontChecker`: 创建字体检查器实例
* `waitForFonts`: 等待字体加载完成

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

## 使用示例

### ES模块导入

```javascript
import FontChecker, { checkFont, isFontLoaded } from 'font-load-check';

// 创建实例
const checker = new FontChecker();

// 检查字体
const result = await checker.check('Arial');
console.log(result.success); // true/false

// 使用工具函数
const loaded = isFontLoaded('Arial');
console.log(loaded); // true/false
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

## 快速开始

### 基本用法

```javascript
import FontChecker from 'font-load-check';

// 创建字体检查器
const checker = new FontChecker();

// 检查单个字体
const result = await checker.check('Arial');
if (result.success) {
  console.log('Arial 字体已加载');
} else {
  console.log('Arial 字体加载失败');
}

// 检查多个字体
const result = await checker.check(['Arial', 'Helvetica', 'Times New Roman']);
if (result.success) {
  console.log('所有字体已加载');
} else {
  console.log('部分字体加载失败:', result.failedFonts);
}
```

### 动态字体管理

```javascript
import { addFont, deleteFont, clearFonts } from 'font-load-check';

// 直接添加字体，无需创建FontFace对象
addFont('MyCustomFont', '/fonts/custom-font.woff2');

// 检查字体是否加载成功
checkFont('MyCustomFont').then(result => {
  if (result.loaded) {
    console.log('字体加载成功');
  } else {
    console.log('字体加载失败');
  }
});

// 通过字体名称删除字体
deleteFont('MyCustomFont');

// 清除所有动态添加的字体
clearFonts();
```

如果需要更高级的控制，也可以使用FontChecker实例：

```javascript
import FontChecker from 'font-load-check';

// 创建自定义配置的字体检查器
const checker = new FontChecker({ timeout: 5000 });

// 添加字体
checker.addFont('CustomFont', '/fonts/custom-font.woff2');

// 检查字体
checker.check('CustomFont').then(result => {
  console.log(result);
});

// 删除字体
checker.deleteFont('CustomFont');
```

```javascript
// 使用工厂函数创建一个新实例
import { createFontChecker } from 'font-load-check';

// 创建自定义配置的字体检查器
const checker = createFontChecker({ timeout: 5000 });

// 添加字体
checker.addFont('CustomFont', '/fonts/custom-font.woff2');

// 检查字体
checker.check('CustomFont').then(result => {
  console.log(result);
});

// 删除字体
checker.deleteFont('CustomFont');
```

### 使用工具函数

```javascript
import { checkFont, checkFonts, isFontLoaded, waitForFonts } from 'font-load-check';

// 检查单个字体
const result = await checkFont('Arial');
console.log(result.loaded);

// 检查多个字体
const result = await checkFonts(['Arial', 'Helvetica']);
console.log(result.success);

// 同步检查字体
const loaded = isFontLoaded('Arial');
console.log(loaded);

// 等待字体加载
const result = await waitForFonts(['MyFont', 'Arial'], 10000);
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

## API 文档

详细的 API 文档请查看 [API 文档](docs/API.md)。

## 浏览器兼容性

该库依赖于 [CSS Font Loading API](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Font_Loading_API)，支持以下浏览器：

- Chrome 35+
- Firefox 41+
- Safari 10+
- Edge 79+

对于不支持 CSS Font Loading API 的浏览器，库会回退到使用传统的字体检测方法。

## 开发

```bash
# 克隆项目
git clone https://github.com/chao921125/font-load-check.git

# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建库
pnpm build

# 运行测试
pnpm test
```

## 贡献指南

如果你想为这个项目做出贡献，请查看 [贡献指南](docs/CONTRIBUTING.md)。

## 许可证

MIT © chao921125

## 相关链接

- [使用指南](docs/README.md)
- [API 文档](docs/API.md)
- [贡献指南](docs/CONTRIBUTING.md)
- [English Documentation](README.en.md)