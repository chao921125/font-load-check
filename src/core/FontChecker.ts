/**
 * 字体加载检查器
 * 用于检测字体是否已加载到浏览器中，以及动态管理字体
 */

export interface FontCheckResult {
  name: string;
  loaded: boolean;
  status: string;
}

export interface FontLoadResult {
  success: boolean;
  failedFonts?: FontCheckResult[];
}

export interface FontCheckerOptions {
  timeout?: number;
}

// 扩展 FontFaceSet 接口以匹配最新的 Web API
interface ExtendedFontFaceSet {
  add: (font: FontFace) => void;
  delete: (font: FontFace) => boolean;
  clear: () => void;
  check: (font: string) => boolean;
  load: (font: string, text?: string) => Promise<FontFace[]>;
  ready: Promise<FontFaceSet>;
  forEach: (callbackfn: (value: FontFace) => void) => void;
}

class FontChecker {
  private options: FontCheckerOptions;
  private addedFonts: Set<FontFace> = new Set();

  constructor(options: FontCheckerOptions = {}) {
    this.options = {
      timeout: 3000,
      ...options
    };
  }

  /**
   * 动态添加字体
   * @param font FontFace 对象
   * @returns 布尔值，表示是否添加成功
   */
  addFont(font: FontFace): boolean {
    try {
      if (!document.fonts) {
        console.error('当前环境不支持 CSS Font Loading API');
        return false;
      }
      
      (document.fonts as unknown as ExtendedFontFaceSet).add(font);
      this.addedFonts.add(font);
      return true;
    } catch (error) {
      console.error('添加字体失败:', error);
      return false;
    }
  }

  /**
   * 删除之前添加的字体
   * @param font FontFace 对象
   * @returns 布尔值，表示是否删除成功
   */
  deleteFont(font: FontFace): boolean {
    try {
      if (!document.fonts) {
        console.error('当前环境不支持 CSS Font Loading API');
        return false;
      }
      
      (document.fonts as unknown as ExtendedFontFaceSet).delete(font);
      this.addedFonts.delete(font);
      return true;
    } catch (error) {
      console.error('删除字体失败:', error);
      return false;
    }
  }

  /**
   * 清除所有动态添加的字体
   * @returns 布尔值，表示是否清除成功
   */
  clearFonts(): boolean {
    try {
      if (!document.fonts) {
        console.error('当前环境不支持 CSS Font Loading API');
        return false;
      }

      // 删除所有通过 addFont 添加的字体
      this.addedFonts.forEach(font => {
        (document.fonts as unknown as ExtendedFontFaceSet).delete(font);
      });
      
      this.addedFonts.clear();
      return true;
    } catch (error) {
      console.error('清除字体失败:', error);
      return false;
    }
  }

  /**
   * 检查字体是否已加载
   * @param fontNames 字体名称或字体名称数组，如果不提供则检查所有已加载字体
   * @returns 字体加载结果，如果全部加载成功返回 {success: true}，
   * 否则返回 {success: false, failedFonts: 失败的字体列表}
   */
  async check(fontNames?: string | string[]): Promise<FontLoadResult> {
    let results: FontCheckResult[] = [];
    
    if (!fontNames) {
      results = await this.checkAllFonts();
    } else if (Array.isArray(fontNames)) {
      results = await Promise.all(fontNames.map(name => this.checkSingleFont(name)));
    } else {
      const result = await this.checkSingleFont(fontNames);
      results = [result];
    }
    
    const failedFonts = results.filter(font => !font.loaded);
    
    return {
      success: failedFonts.length === 0,
      ...(failedFonts.length > 0 ? { failedFonts } : {})
    };
  }

  /**
   * 检查单个字体是否已加载
   * @param fontName 字体名称
   * @returns 字体加载状态结果
   */
  private async checkSingleFont(fontName: string): Promise<FontCheckResult> {
    // 检查是否支持FontFace API
    if (typeof FontFace !== 'function') {
      const isLoaded = document.fonts.check(`12px '${fontName}'`);
      return {
        name: fontName,
        loaded: isLoaded,
        status: isLoaded ? 'loaded' : 'unloaded'
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
      const isLoaded = document.fonts.check(`12px '${fontName}'`);
      return {
        name: fontName,
        loaded: isLoaded,
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