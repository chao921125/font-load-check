# Font-Check

一个用于检测、管理和操作字体的现代 JavaScript/TypeScript 库，基于最新的 Web Font API。

## 功能特点

- 检查字体是否已加载到浏览器中
- 动态添加字体（使用 `document.fonts.add(font)`）
- 动态删除添加的字体（使用 `document.fonts.delete(font)`）
- 清除所有动态添加的字体
- 支持 Promise 异步操作
- 完全使用 TypeScript 编写，提供类型定义
- 可在任何 JavaScript 项目中使用（Vue、React、原生 JS 等）

## 安装

```bash
# 使用 npm
npm install font-load-checker

# 使用 yarn
yarn add font-load-checker

# 使用 pnpm
pnpm add font-load-checker
```

## 基本用法

### 引入库

```javascript
// ES 模块
import FontChecker from 'font-load-checker';

// CommonJS
const FontChecker = require('font-load-checker');
```

### 创建实例

```javascript
// 使用默认配置
const fontChecker = new FontChecker();

// 使用自定义配置
const fontChecker = new FontChecker({
  timeout: 5000 // 设置字体加载超时时间（毫秒）
});
```

### 检查字体

```javascript
// 检查单个字体
fontChecker.check('Arial')
  .then(result => {
    if (result.success) {
      console.log('字体已加载');
    } else {
      console.log('字体加载失败', result.failedFonts);
    }
  });

// 检查多个字体
fontChecker.check(['Arial', 'Helvetica', 'Times New Roman'])
  .then(result => {
    if (result.success) {
      console.log('所有字体已加载');
    } else {
      console.log('部分字体加载失败', result.failedFonts);
    }
  });

// 检查所有已加载的字体
fontChecker.check()
  .then(result => {
    if (result.success) {
      console.log('所有字体已加载');
    } else {
      console.log('部分字体加载失败', result.failedFonts);
    }
  });

// 使用 async/await
async function checkFont() {
  const result = await fontChecker.check('Arial');
  console.log(result);
}
```

### 动态添加字体

```javascript
// 创建一个新的字体实例
const fontFace = new FontFace('MyFont', 'url(/path/to/font.woff2)');

// 加载字体
fontFace.load().then(() => {
  // 添加到字体检查器
  const success = fontChecker.addFont(fontFace);
  
  if (success) {
    console.log('字体添加成功');
  } else {
    console.log('字体添加失败');
  }
});
```

### 删除字体

```javascript
// 删除特定字体
const success = fontChecker.deleteFont(fontFace);
```

### 清除所有添加的字体

```javascript
// 清除所有通过 fontChecker.addFont() 添加的字体
fontChecker.clearFonts();
```

## 在 Vue 项目中使用

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

<script>
import FontChecker from 'font-load-checker';
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const loading = ref(true);
    const result = ref(null);
    
    onMounted(async () => {
      const fontChecker = new FontChecker();
      result.value = await fontChecker.check(['Arial', 'Helvetica']);
      loading.value = false;
    });
    
    return {
      loading,
      result
    };
  }
};
</script>
```

## 在 React 项目中使用

```jsx
import React, { useState, useEffect } from 'react';
import FontChecker from 'font-load-checker';

function FontCheckComponent() {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  
  useEffect(() => {
    async function checkFonts() {
      const fontChecker = new FontChecker();
      const checkResult = await fontChecker.check(['Arial', 'Helvetica']);
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

## API 参考

### FontChecker 类

#### 构造函数

```typescript
constructor(options?: FontCheckerOptions)
```

- `options.timeout`: 字体加载超时时间（毫秒），默认为 3000。

#### 方法

- `async check(fontNames?: string | string[]): Promise<FontLoadResult>`
  检查字体是否已加载。如果不提供参数，则检查所有已加载的字体。

- `addFont(font: FontFace): boolean`
  动态添加字体，返回是否添加成功。

- `deleteFont(font: FontFace): boolean`
  删除之前通过 `addFont` 添加的字体，返回是否删除成功。

- `clearFonts(): boolean`
  清除所有通过 `addFont` 添加的字体，返回是否清除成功。

### 类型定义

```typescript
interface FontCheckerOptions {
  timeout?: number;
}

interface FontCheckResult {
  name: string;
  loaded: boolean;
  status: string;
}

interface FontLoadResult {
  success: boolean;
  failedFonts?: FontCheckResult[];
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
git clone https://github.com/your-username/font-check.git

# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建库
pnpm build

# 运行测试
pnpm test
```

## 许可证

MIT