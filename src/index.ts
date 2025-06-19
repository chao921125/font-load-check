// 核心功能
import FontChecker, { FontCheckResult, FontCheckerOptions } from './core/FontChecker';

// Vue 集成
import { useFontCheck as useVueFontCheck, createFontChecker as createVueFontChecker } from './vue';

// React 集成
import { useFontCheck as useReactFontCheck, createFontChecker as createReactFontChecker } from './react';

// 导出核心功能
export { FontChecker, FontCheckResult, FontCheckerOptions };

// 导出Vue集成
export { useVueFontCheck };

// 导出React集成
export { useReactFontCheck };

// 导出工厂函数
export const createFontChecker = (options?: FontCheckerOptions) => new FontChecker(options);

// 默认导出核心类
export default FontChecker;