# font-load-check

A modern JavaScript/TypeScript library for detecting, managing, and manipulating fonts, based on the latest Web Font API.

[![npm version](https://img.shields.io/npm/v/font-load-check.svg)](https://www.npmjs.com/package/font-load-check)
[![license](https://img.shields.io/npm/l/font-load-check.svg)](https://github.com/chao921125/font-load-check/blob/main/LICENSE)
[![npm downloads](https://img.shields.io/npm/dm/font-load-check.svg)](https://www.npmjs.com/package/font-load-check)

English | [简体中文](README.md)

## Features

* 🚀 Lightweight with no external dependencies
* 🔄 Font loading status detection
* 📦 Dynamic font management (add, delete, clear)
* 💻 Browser environment support
* 📱 TypeScript support with complete type definitions
* 🛠️ Rich utility functions
* 🔧 Multiple import methods (ES modules, CommonJS, UMD)

## Functionality

### Font Detection

* `check`: Check if fonts are loaded
* `checkFont`: Check a single font
* `checkFonts`: Check multiple fonts
* `isFontLoaded`: Synchronously check font loading status

### Font Management

* `addFont`: Dynamically add a font
* `deleteFont`: Delete a font
* `clearFonts`: Clear all dynamically added fonts

### Utility Functions

* `createFontChecker`: Create a font checker instance
* `waitForFonts`: Wait for fonts to load

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

## Usage Examples

### ES Module Import

```javascript
import FontChecker, { checkFont, isFontLoaded } from 'font-load-check';

// Create an instance
const checker = new FontChecker();

// Check a font
const result = await checker.check('Arial');
console.log(result.success); // true/false

// Use utility functions
const loaded = isFontLoaded('Arial');
console.log(loaded); // true/false
```

### CommonJS Import

```javascript
const FontChecker = require('font-load-check');

// Create an instance
const checker = new FontChecker();

// Check a font
checker.check('Arial').then(result => {
  console.log(result.success);
});
```

### Using in the Browser

```html
<!-- Import via CDN -->
<script src="https://unpkg.com/font-load-check/dist/index.umd.js"></script>
<!-- Or -->
<script src="https://cdn.jsdelivr.net/npm/font-load-check/dist/index.umd.js"></script>

<script>
  // Global variable FontChecker
  const checker = new FontChecker();
  checker.check('Arial').then(result => {
    console.log(result.success);
  });
</script>
```

## Quick Start

### Basic Usage

```javascript
import FontChecker from 'font-load-check';

// Create a font checker
const checker = new FontChecker();

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

### Dynamic Font Management

```javascript
import { addFont, deleteFont, clearFonts } from 'font-load-check';

// Directly add a font without creating a FontFace object
addFont('MyCustomFont', '/fonts/custom-font.woff2');

// Check if the font loaded successfully
checkFont('MyCustomFont').then(result => {
  if (result.loaded) {
    console.log('Font loaded successfully');
  } else {
    console.log('Font failed to load');
  }
});

// Delete a font by name
deleteFont('MyCustomFont');

// Clear all dynamically added fonts
clearFonts();
```

For more advanced control, you can also use a FontChecker instance:

```javascript
import FontChecker from 'font-load-check';

// Create a font checker with custom configuration
const checker = new FontChecker({ timeout: 5000 });

// Add a font
checker.addFont('CustomFont', '/fonts/custom-font.woff2');

// Check the font
checker.check('CustomFont').then(result => {
  console.log(result);
});

// Delete the font
checker.deleteFont('CustomFont');
```

```javascript
// Use the factory function to create a new instance
import { createFontChecker } from 'font-load-check';

// Create a font checker with custom configuration
const checker = createFontChecker({ timeout: 5000 });

// Add a font
checker.addFont('CustomFont', '/fonts/custom-font.woff2');

// Check the font
checker.check('CustomFont').then(result => {
  console.log(result);
});

// Delete the font
checker.deleteFont('CustomFont');
```

### Using Utility Functions

```javascript
import { checkFont, checkFonts, isFontLoaded, waitForFonts } from 'font-load-check';

// Check a single font
const result = await checkFont('Arial');
console.log(result.loaded);

// Check multiple fonts
const result = await checkFonts(['Arial', 'Helvetica']);
console.log(result.success);

// Synchronously check a font
const loaded = isFontLoaded('Arial');
console.log(loaded);

// Wait for fonts to load
const result = await waitForFonts(['MyFont', 'Arial'], 10000);
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

## API Documentation

For detailed API documentation, see the [API Documentation](docs/API.en.md).

## Browser Compatibility

This library relies on the [CSS Font Loading API](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Font_Loading_API) and supports the following browsers:

- Chrome 35+
- Firefox 41+
- Safari 10+
- Edge 79+

For browsers that don't support the CSS Font Loading API, the library falls back to using traditional font detection methods.

## Development

```bash
# Clone the project
git clone https://github.com/chao921125/font-load-check.git

# Install dependencies
pnpm install

# Development mode
pnpm dev

# Build the library
pnpm build

# Run tests
pnpm test
```

## Contributing

If you want to contribute to this project, please see the [Contributing Guide](docs/CONTRIBUTING.en.md).

## License

MIT © chao921125

## Related Links

- [User Guide](docs/README.en.md)
- [API Documentation](docs/API.en.md)
- [Contributing Guide](docs/CONTRIBUTING.en.md)
- [中文文档](README.md) 