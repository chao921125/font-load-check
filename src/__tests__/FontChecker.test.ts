import FontChecker from '../core/FontChecker';

// 模拟FontFace API
class MockFontFace {
  family: string;
  status: string = 'unloaded';
  
  constructor(family: string, source: string) {
    this.family = family;
  }
  
  async load() {
    // 模拟加载成功的字体
    if (['Arial', 'Helvetica', 'Times New Roman'].includes(this.family)) {
      this.status = 'loaded';
      return this;
    }
    // 模拟加载失败的字体
    throw new Error(`Failed to load font: ${this.family}`);
  }
}

// 模拟document.fonts
const mockFonts = {
  ready: Promise.resolve(),
  check: (font: string) => {
    // 模拟已加载的字体
    return ['Arial', 'Helvetica', 'Times New Roman'].some(name => font.includes(name));
  },
  forEach: (callback: (font: any) => void) => {
    // 模拟已加载的字体列表
    const mockFontList = [
      { family: 'Arial' },
      { family: 'Helvetica' },
      { family: 'Times New Roman' }
    ];
    mockFontList.forEach(callback);
  }
};

describe('FontChecker', () => {
  // 保存原始全局对象
  const originalFontFace = global.FontFace;
  const originalDocumentFonts = document.fonts;
  
  beforeAll(() => {
    // 模拟全局对象
    global.FontFace = MockFontFace as any;
    Object.defineProperty(document, 'fonts', {
      value: mockFonts,
      writable: true
    });
  });
  
  afterAll(() => {
    // 恢复原始全局对象
    global.FontFace = originalFontFace;
    Object.defineProperty(document, 'fonts', {
      value: originalDocumentFonts,
      writable: true
    });
  });
  
  describe('check', () => {
    test('应该检查单个字体并返回加载状态', async () => {
      const checker = new FontChecker();
      const result = await checker.check('Arial');
      
      expect(result).toEqual({
        name: 'Arial',
        loaded: true,
        status: 'loaded'
      });
    });
    
    test('应该检查多个字体并返回加载状态数组', async () => {
      const checker = new FontChecker();
      const results = await checker.check(['Arial', 'NonExistentFont']);
      
      expect(Array.isArray(results)).toBe(true);
      expect(results).toHaveLength(2);
      
      expect(results[0]).toEqual({
        name: 'Arial',
        loaded: true,
        status: 'loaded'
      });
      
      expect(results[1]).toEqual({
        name: 'NonExistentFont',
        loaded: false,
        status: 'error'
      });
    });
    
    test('应该检查所有已加载的字体', async () => {
      const checker = new FontChecker();
      const results = await checker.check();
      
      expect(Array.isArray(results)).toBe(true);
      expect(results).toHaveLength(3);
      
      // 验证所有返回的字体都已加载
      results.forEach(font => {
        expect(font.loaded).toBe(true);
        expect(font.status).toBe('loaded');
      });
      
      // 验证包含了所有模拟的字体
      const fontNames = results.map(font => font.name);
      expect(fontNames).toContain('Arial');
      expect(fontNames).toContain('Helvetica');
      expect(fontNames).toContain('Times New Roman');
    });
  });
  
  describe('配置选项', () => {
    test('应该使用自定义超时选项', async () => {
      const checker = new FontChecker({ timeout: 5000 });
      // 这里我们只是验证创建实例不会抛出错误
      expect(checker).toBeInstanceOf(FontChecker);
    });
  });
});