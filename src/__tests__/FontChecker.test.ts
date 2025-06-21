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

// 存储添加的字体，用于测试
const addedFonts = new Set<any>();

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
    
    // 添加动态添加的字体
    addedFonts.forEach(font => {
      mockFontList.push(font);
    });
    
    mockFontList.forEach(callback);
  },
  // 新增模拟方法
  add: (font: any) => {
    addedFonts.add(font);
    return undefined;
  },
  delete: (font: any) => {
    return addedFonts.delete(font);
  },
  clear: () => {
    addedFonts.clear();
    return undefined;
  }
};

describe('FontChecker', () => {
  // 保存原始全局对象
  const originalFontFace = (global as any).FontFace;
  const originalDocumentFonts = document.fonts;
  
  beforeAll(() => {
    // 模拟全局对象
    (global as any).FontFace = MockFontFace;
    Object.defineProperty(document, 'fonts', {
      value: mockFonts,
      writable: true
    });
  });
  
  afterAll(() => {
    // 恢复原始全局对象
    (global as any).FontFace = originalFontFace;
    Object.defineProperty(document, 'fonts', {
      value: originalDocumentFonts,
      writable: true
    });
  });
  
  beforeEach(() => {
    // 每个测试前清空添加的字体
    addedFonts.clear();
  });
  
  describe('check', () => {
    test('应该检查单个字体并返回加载状态', async () => {
      const checker = new FontChecker();
      const result = await checker.check('Arial');
      
      expect(result).toEqual({
        success: true
      });
    });
    
    test('应该检查多个字体并返回加载状态，包含失败字体', async () => {
      const checker = new FontChecker();
      const result = await checker.check(['Arial', 'NonExistentFont']);
      
      expect(result.success).toBe(false);
      expect(result.failedFonts).toHaveLength(1);
      expect(result.failedFonts![0].name).toBe('NonExistentFont');
      expect(result.failedFonts![0].loaded).toBe(false);
    });
    
    test('应该检查所有已加载的字体', async () => {
      const checker = new FontChecker();
      const result = await checker.check();
      
      expect(result.success).toBe(true);
    });
  });

  describe('动态字体管理', () => {
    test('应该能够添加字体', () => {
      const checker = new FontChecker();
      const font = new MockFontFace('CustomFont', 'url(/path/to/custom-font.woff2)');
      
      const result = checker.addFont(font as any);
      
      expect(result).toBe(true);
      expect(addedFonts.size).toBe(1);
      expect(addedFonts.has(font)).toBe(true);
    });
    
    test('应该能够删除字体', () => {
      const checker = new FontChecker();
      const font = new MockFontFace('CustomFont', 'url(/path/to/custom-font.woff2)');
      
      // 先添加字体
      checker.addFont(font as any);
      expect(addedFonts.size).toBe(1);
      
      // 然后删除字体
      const result = checker.deleteFont(font as any);
      
      expect(result).toBe(true);
      expect(addedFonts.size).toBe(0);
    });
    
    test('应该能够清除所有添加的字体', () => {
      const checker = new FontChecker();
      
      // 添加多个字体
      const font1 = new MockFontFace('CustomFont1', 'url(/path/to/custom-font1.woff2)');
      const font2 = new MockFontFace('CustomFont2', 'url(/path/to/custom-font2.woff2)');
      checker.addFont(font1 as any);
      checker.addFont(font2 as any);
      
      expect(addedFonts.size).toBe(2);
      
      // 清除所有字体
      const result = checker.clearFonts();
      
      expect(result).toBe(true);
      expect(addedFonts.size).toBe(0);
    });
    
    test('添加字体后可以在检查所有字体中发现', async () => {
      const checker = new FontChecker();
      
      // 添加自定义字体
      const customFont = new MockFontFace('CustomFont', 'url(/path/to/custom-font.woff2)');
      customFont.status = 'loaded';
      checker.addFont(customFont as any);
      
      const result = await checker.check();
      
      expect(result.success).toBe(true);
      
      // 清理
      checker.clearFonts();
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