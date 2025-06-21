// 核心功能
import FontChecker, { FontCheckResult, FontCheckerOptions, FontLoadResult } from './core/FontChecker';

// 导出核心功能
export { FontChecker, FontCheckResult, FontCheckerOptions, FontLoadResult };

// 导出工厂函数
export const createFontChecker = (options?: FontCheckerOptions) => new FontChecker(options);

// 默认导出核心类
export default FontChecker;