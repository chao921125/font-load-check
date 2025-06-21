# font-load-checker

一个用于检测、管理和操作字体的现代 JavaScript/TypeScript 库，基于最新的 Web Font API。

[![npm version](https://img.shields.io/npm/v/font-load-checker.svg)](https://www.npmjs.com/package/font-load-checker)
[![license](https://img.shields.io/npm/l/font-load-checker.svg)](https://github.com/huangchao/font-load-checker/blob/main/LICENSE)
[![npm downloads](https://img.shields.io/npm/dm/font-load-checker.svg)](https://www.npmjs.com/package/font-load-checker)

English | [简体中文](README.md)

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
npm install font-load-checker
```

### yarn

```bash
yarn add font-load-checker
```

### pnpm

```bash
pnpm add font-load-checker
```

## 使用示例

### ES模块导入

```javascript
import FontChecker, { checkFont, isFontLoaded } from 'font-load-checker';

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
const FontChecker = require('font-load-checker');

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
<script src="https://unpkg.com/font-load-checker/dist/index.umd.js"></script>
<!-- 或者 -->
<script src="https://cdn.jsdelivr.net/npm/font-load-checker/dist/index.umd.js"></script>

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
import FontChecker from 'font-load-checker';

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
import FontChecker from 'font-load-checker';

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

// 删除字体
checker.deleteFont(fontFace);

// 清除所有动态添加的字体
checker.clearFonts();
```

### 使用工具函数

```javascript
import { checkFont, checkFonts, isFontLoaded, waitForFonts } from 'font-load-checker';

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
import FontChecker from 'font-load-checker';

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
import FontChecker from 'font-load-checker';

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

### 核心类

#### FontChecker

字体检查器的主类，提供字体加载检测和管理功能。

```typescript
constructor(options?: FontCheckerOptions)
```

**方法：**
- `async check(fontNames?: string | string[]): Promise<FontLoadResult>`
- `addFont(font: FontFace): boolean`
- `deleteFont(font: FontFace): boolean`
- `clearFonts(): boolean`

### 工具函数

- `createFontChecker(options?: FontCheckerOptions): FontChecker`
- `checkFont(fontName: string, options?: FontCheckerOptions): Promise<FontCheckResult>`
- `checkFonts(fontNames: string[], options?: FontCheckerOptions): Promise<FontLoadResult>`
- `addFont(font: FontFace, options?: FontCheckerOptions): boolean`
- `deleteFont(font: FontFace, options?: FontCheckerOptions): boolean`
- `clearFonts(options?: FontCheckerOptions): boolean`
- `isFontLoaded(fontName: string): boolean`
- `waitForFonts(fontNames: string[], timeout?: number): Promise<FontLoadResult>`

### 类型定义

```typescript
interface FontCheckerOptions {
  timeout?: number; // 字体加载超时时间（毫秒），默认为 3000
}

interface FontCheckResult {
  name: string;      // 字体名称
  loaded: boolean;   // 是否已加载
  status: string;    // 加载状态：'loaded' | 'unloaded' | 'error' | 'fallback'
}

interface FontLoadResult {
  success: boolean;                    // 是否全部加载成功
  failedFonts?: FontCheckResult[];     // 失败的字体列表（仅在 success 为 false 时存在）
}
```

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
git clone https://github.com/huangchao/font-load-checker.git

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

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开一个 Pull Request

## 许可证

MIT © huangchao

## 相关链接

- [使用指南](docs/README.md)
- [API 文档](docs/API.md)
- [示例代码](examples/)
- [更新日志](CHANGELOG.md)
- [问题反馈](https://github.com/huangchao/font-load-checker/issues)