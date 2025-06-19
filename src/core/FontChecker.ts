/**
 * 字体加载检查器
 * 用于检测字体是否已加载到浏览器中
 */

export interface FontCheckResult {
  name: string;
  loaded: boolean;
  status: string;
}

export interface FontCheckerOptions {
  timeout?: number;
}

class FontChecker {
  private options: FontCheckerOptions;

  constructor(options: FontCheckerOptions = {}) {
    this.options = {
      timeout: 3000,
      ...options
    };
  }

  /**
   * 检查字体是否已加载
   * @param fontNames 字体名称或字体名称数组，如果不提供则检查所有已加载字体
   * @returns 字体加载状态结果
   */
  async check(fontNames?: string | string[]): Promise<FontCheckResult | FontCheckResult[]> {
    if (!fontNames) {
      return this.checkAllFonts();
    }
    
    if (Array.isArray(fontNames)) {
      return Promise.all(fontNames.map(name => this.checkSingleFont(name)));
    }
    
    return this.checkSingleFont(fontNames);
  }

  /**
   * 检查单个字体是否已加载
   * @param fontName 字体名称
   * @returns 字体加载状态结果
   */
  private async checkSingleFont(fontName: string): Promise<FontCheckResult> {
    // 检查是否支持FontFace API
    if (typeof FontFace !== 'function') {
      return {
        name: fontName,
        loaded: document.fonts.check(`12px '${fontName}'`),
        status: document.fonts.check(`12px '${fontName}'`) ? 'loaded' : 'unloaded'
      };
    }

    try {
      // 使用FontFace API检查字体
      const fontFace = new FontFace(fontName, `local(${fontName})`);
      
      // 设置超时
      const timeoutPromise = new Promise<FontFace>((_, reject) => {
        setTimeout(() => reject(new Error('Font load timeout')), this.options.timeout);
      });
      
      // 加载字体或超时
      const loadedFont = await Promise.race([
        fontFace.load(),
        timeoutPromise
      ]).catch(() => null);
      
      return {
        name: fontName,
        loaded: loadedFont !== null,
        status: loadedFont ? 'loaded' : 'error'
      };
    } catch (error) {
      // 回退到传统检测方法
      return {
        name: fontName,
        loaded: document.fonts.check(`12px '${fontName}'`),
        status: 'fallback'
      };
    }
  }

  /**
   * 检查所有已加载的字体
   * @returns 所有已加载字体的状态
   */
  private async checkAllFonts(): Promise<FontCheckResult[]> {
    // 确保字体已加载
    await document.fonts.ready;
    
    const fontList: FontCheckResult[] = [];
    const fontSet = new Set<string>();
    
    // 收集所有字体
    document.fonts.forEach(font => {
      const fontFamily = font.family.replace(/['"]*/g, '');
      if (!fontSet.has(fontFamily)) {
        fontSet.add(fontFamily);
        fontList.push({
          name: fontFamily,
          loaded: true,
          status: 'loaded'
        });
      }
    });
    
    return fontList;
  }
}

export default FontChecker;