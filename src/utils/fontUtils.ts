import FontChecker, { FontCheckerOptions, FontCheckResult, FontLoadResult } from '../core/FontChecker';

// 全局字体检查器实例
let globalFontChecker: FontChecker | null = null;

/**
 * 获取或创建全局字体检查器实例
 */
function getGlobalFontChecker(options?: FontCheckerOptions): FontChecker {
  if (!globalFontChecker) {
    globalFontChecker = new FontChecker(options);
  }
  return globalFontChecker;
}

/**
 * 创建字体检查器实例
 */
export function createFontChecker(options?: FontCheckerOptions): FontChecker {
  return new FontChecker(options);
}

/**
 * 检查单个字体是否已加载
 */
export async function checkFont(fontName: string, options?: FontCheckerOptions): Promise<FontCheckResult> {
  const checker = getGlobalFontChecker(options);
  const result = await checker.check(fontName);
  
  // 如果检查成功，说明字体已加载
  if (result.success) {
    return { name: fontName, loaded: true, status: 'loaded' };
  }
  
  // 如果检查失败，查找失败的字体
  const failedFont = result.failedFonts?.find(font => font.name === fontName);
  if (failedFont) {
    return failedFont;
  }
  
  // 如果没有找到失败的字体，说明字体已加载
  return { name: fontName, loaded: true, status: 'loaded' };
}

/**
 * 检查多个字体是否已加载
 */
export async function checkFonts(fontNames: string[], options?: FontCheckerOptions): Promise<FontLoadResult> {
  const checker = getGlobalFontChecker(options);
  return await checker.check(fontNames);
}

/**
 * 动态添加字体
 */
export function addFont(font: FontFace, options?: FontCheckerOptions): boolean {
  const checker = getGlobalFontChecker(options);
  return checker.addFont(font);
}

/**
 * 删除字体
 */
export function deleteFont(font: FontFace, options?: FontCheckerOptions): boolean {
  const checker = getGlobalFontChecker(options);
  return checker.deleteFont(font);
}

/**
 * 清除所有动态添加的字体
 */
export function clearFonts(options?: FontCheckerOptions): boolean {
  const checker = getGlobalFontChecker(options);
  return checker.clearFonts();
}

/**
 * 检查字体是否已加载（同步方法）
 */
export function isFontLoaded(fontName: string): boolean {
  if (!document.fonts) {
    return false;
  }
  return document.fonts.check(`12px '${fontName}'`);
}

/**
 * 等待字体加载完成
 */
export async function waitForFonts(fontNames: string[], timeout?: number): Promise<FontLoadResult> {
  const checker = new FontChecker({ timeout });
  return await checker.check(fontNames);
} 