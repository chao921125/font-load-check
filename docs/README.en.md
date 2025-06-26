# font-load-check User Guide

## Overview

font-load-check is a modern JavaScript/TypeScript library for detecting, managing, and manipulating fonts, based on the latest Web Font API. It provides a simple and easy-to-use API that helps you check if fonts are loaded, dynamically add and remove fonts, and handle various scenarios during font loading.

## Installation

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

## Basic Usage

### Importing the Library

```javascript
// ES module import
import FontChecker, { checkFont, isFontLoaded } from 'font-load-check';

// CommonJS import
const FontChecker = require('font-load-check');
```

### Creating a Font Checker

```javascript
// With default configuration
const checker = new FontChecker();

// With custom configuration
const checker = new FontChecker({ timeout: 5000 });
```

### Checking Fonts

```javascript
// Check a single font
const result = await checker.check('Arial');
if (result.success) {
  console.log('Arial font is loaded');
} else {
  console.log('Arial font failed to load');
}

// Check multiple fonts
const result = await checker.check(['Arial', 'Helvetica', 'Times New Roman']);
if (result.success) {
  console.log('All fonts are loaded');
} else {
  console.log('Some fonts failed to load:', result.failedFonts);
}
```

### Dynamically Adding Fonts

```javascript
// Method 1: Using font name and URL
checker.addFont('MyCustomFont', '/fonts/custom-font.woff2');

// Method 2: Using FontFace object
const fontFace = new FontFace('MyCustomFont', 'url(/fonts/custom-font.woff2)');
checker.addFontFace(fontFace);
```

### Removing Fonts

```javascript
// Remove by font name
checker.deleteFont('MyCustomFont');

// Remove by FontFace object
checker.deleteFont(fontFace);
```

### Clearing All Fonts

```javascript
checker.clearFonts();
```

## Utility Functions

In addition to instance methods, font-load-check provides a series of convenient utility functions that can be used directly:

### Checking Fonts

```javascript
import { checkFont, checkFonts, isFontLoaded } from 'font-load-check';

// Check a single font
const result = await checkFont('Arial');
console.log(result.loaded);

// Check multiple fonts
const result = await checkFonts(['Arial', 'Helvetica']);
console.log(result.success);

// Synchronously check a font
const loaded = isFontLoaded('Arial');
console.log(loaded);
```

### Adding and Removing Fonts

```javascript
import { addFont, deleteFont, clearFonts } from 'font-load-check';

// Add a font
addFont('MyCustomFont', '/fonts/custom-font.woff2');

// Remove a font
deleteFont('MyCustomFont');

// Clear all fonts
clearFonts();
```

### Waiting for Fonts to Load

```javascript
import { waitForFonts } from 'font-load-check';

// Wait for fonts to load with a 10-second timeout
const result = await waitForFonts(['MyFont', 'Arial'], 10000);
if (result.success) {
  console.log('All fonts are loaded');
} else {
  console.log('Some fonts failed to load:', result.failedFonts);
}
```

## Advanced Usage

### Handling Cross-Origin Fonts

When loading font files from different domains, you may encounter CORS (Cross-Origin Resource Sharing) restrictions. font-load-check provides functionality to handle cross-origin issues:

```javascript
import { loadFont, isCrossDomainUrl } from 'font-load-check';

// Check if a URL might have cross-origin issues
const url = 'https://fonts.googleapis.com/css2?family=Roboto';
const mightHaveCORSIssue = isCrossDomainUrl(url);
console.log(`Might have CORS issues: ${mightHaveCORSIssue}`);

// Load a font and handle potential cross-origin errors
loadFont(
  'Roboto', 
  url,
  { display: 'swap' },
  () => console.log('Font loaded successfully'),
  (error, isCORSError) => {
    if (isCORSError) {
      console.error('Loading failed: CORS error');
      console.error('Make sure the font server has the correct CORS headers set');
    } else {
      console.error('Loading failed, reason:', error);
    }
  }
);
```

### Creating Independent Font Checker Instances

For improved performance and state consistency, the library internally uses a global FontChecker instance. If you need a completely independent font checker instance, you can use the `createFontChecker` function:

```javascript
import { createFontChecker } from 'font-load-check';

// Create an independent font checker instance
const myChecker = createFontChecker({ timeout: 5000 });
myChecker.addFont('CustomFont', '/fonts/custom-font.woff2');
myChecker.check('CustomFont').then(result => console.log(result));
```

## Using with Frameworks

### Vue 3

```vue
<template>
  <div>
    <div v-if="loading">Checking fonts...</div>
    <div v-else-if="result && result.success">All fonts are loaded</div>
    <div v-else-if="result">
      <p>Some fonts failed to load:</p>
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
    return <div>Checking fonts...</div>;
  }
  
  if (result && result.success) {
    return <div>All fonts are loaded</div>;
  } else if (result) {
    return (
      <div>
        <p>Some fonts failed to load:</p>
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

## Browser Compatibility

font-load-check relies on the [CSS Font Loading API](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Font_Loading_API) and supports the following browsers:

- Chrome 35+
- Firefox 41+
- Safari 10+
- Edge 79+

For browsers that don't support the CSS Font Loading API, the library falls back to using traditional font detection methods.

## More Information

- [Complete API Documentation](API.en.md)
- [Contributing Guide](CONTRIBUTING.en.md)
- [中文文档](README.md) 