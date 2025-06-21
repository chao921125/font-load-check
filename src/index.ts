// 核心功能
import FontChecker, { FontCheckResult, FontLoadResult, FontCheckerOptions } from './core/FontChecker';
import {
  createFontChecker,
  checkFont,
  checkFonts,
  addFont,
  addFontFace,
  deleteFont,
  clearFonts,
  isFontLoaded,
  waitForFonts,
  loadFont,
  isCrossDomainUrl,
  isFontCORSError
} from './utils/fontUtils';

// 导出核心功能
export {
  FontChecker,
  FontCheckResult,
  FontLoadResult,
  FontCheckerOptions,
  createFontChecker,
  checkFont,
  checkFonts,
  addFont,
  addFontFace,
  deleteFont,
  clearFonts,
  isFontLoaded,
  waitForFonts,
  loadFont,
  isCrossDomainUrl,
  isFontCORSError
};

// 默认导出核心类
export default FontChecker;