// 核心功能
import FontChecker, { FontCheckResult, FontCheckerOptions, FontLoadResult } from './src/core/FontChecker';

// 工具函数
import { 
  createFontChecker,
  checkFont,
  checkFonts,
  addFont,
  deleteFont,
  clearFonts,
  isFontLoaded,
  waitForFonts
} from './src/utils/fontUtils';

// 导出核心功能
export { 
  FontChecker, 
  FontCheckResult, 
  FontCheckerOptions, 
  FontLoadResult 
};

// 导出工具函数
export {
  createFontChecker,
  checkFont,
  checkFonts,
  addFont,
  deleteFont,
  clearFonts,
  isFontLoaded,
  waitForFonts
};

// 默认导出核心类
export default FontChecker; 