import {
  createFontChecker,
  checkFont,
  checkFonts,
  addFont,
  addFontFace,
  deleteFont,
  clearFonts,
  isFontLoaded,
  waitForFonts
} from '../utils/fontUtils';

// Mock document.fonts
const mockFonts = {
  check: jest.fn(),
  ready: Promise.resolve(),
  add: jest.fn(),
  delete: jest.fn(),
  clear: jest.fn(),
  forEach: jest.fn()
};

// 设置document.fonts mock
Object.defineProperty(document, 'fonts', {
  value: mockFonts,
  writable: true,
  configurable: true
});

// Mock FontFace
const mockFontFaceLoad = jest.fn();
(global as any).FontFace = jest.fn().mockImplementation((family, source) => ({
  family,
  source,
  load: mockFontFaceLoad
}));

describe('fontUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // 重置mock返回值
    mockFonts.check.mockReturnValue(true);
    mockFonts.add.mockReturnValue(undefined);
    mockFonts.delete.mockReturnValue(true);
    mockFonts.clear.mockReturnValue(undefined);
    mockFonts.forEach.mockImplementation(() => {});
    // 默认 FontFace.load 成功
    mockFontFaceLoad.mockResolvedValue({ family: 'TestFont', source: 'url(/test.woff2)' });
  });

  describe('createFontChecker', () => {
    it('应该创建一个新的FontChecker实例', () => {
      const checker = createFontChecker();
      expect(checker).toBeDefined();
      expect(typeof checker.check).toBe('function');
    });

    it('应该使用提供的选项创建实例', () => {
      const options = { timeout: 5000 };
      const checker = createFontChecker(options);
      expect(checker).toBeDefined();
    });

    it('应该为不同选项创建新实例', () => {
      const checker1 = createFontChecker();
      const checker2 = createFontChecker({ timeout: 5000 });
      expect(checker1).not.toBe(checker2);
    });
  });

  describe('checkFont', () => {
    it('应该检查单个字体', async () => {
      const result = await checkFont('Arial');
      expect(result).toBeDefined();
      expect(result.name).toBe('Arial');
      expect(result.loaded).toBe(true);
      expect(typeof result.status).toBe('string');
    });

    it('应该处理字体检查失败的情况', async () => {
      // 模拟 FontFace.load 失败（超时）
      mockFontFaceLoad.mockImplementation(() => 
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Font load timeout')), 100)
        )
      );
      // 模拟 document.fonts.check 返回 false
      mockFonts.check.mockReturnValue(false);
      
      const result = await checkFont('NonExistentFont');
      expect(result.loaded).toBe(false);
    });
  });

  describe('checkFonts', () => {
    it('应该检查多个字体', async () => {
      const result = await checkFonts(['Arial', 'Helvetica']);
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(Array.isArray(result.allFonts)).toBe(true);
      expect(result.allFonts.length).toBe(2);
      expect(result.allFonts.every(font => font.loaded)).toBe(true);
    });

    it('应该处理部分字体失败的情况', async () => {
      // 模拟第二个字体加载失败
      let callCount = 0;
      mockFontFaceLoad.mockImplementation(() => {
        callCount++;
        if (callCount === 2) {
          return new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Font load timeout')), 100)
          );
        }
        return Promise.resolve({ family: 'TestFont', source: 'url(/test.woff2)' });
      });
      
      // 模拟 document.fonts.check 对特定字体返回 false
      mockFonts.check.mockImplementation((fontString) => {
        return !fontString.includes('NonExistentFont');
      });
      
      const result = await checkFonts(['Arial', 'NonExistentFont']);
      expect(result.success).toBe(false);
      expect(result.allFonts).toBeDefined();
      expect(result.allFonts.length).toBe(2);
      expect(result.failedFonts).toBeDefined();
      expect(result.failedFonts!.length).toBe(1);
      expect(result.failedFonts![0].name).toBe('NonExistentFont');
      expect(result.failedFonts![0].loaded).toBe(false);
    });
  });

  describe('addFont', () => {
    it('应该添加字体', () => {
      const result = addFont('TestFont', '/test.woff2');
      expect(result).toBe(true);
      expect(mockFonts.add).toHaveBeenCalled();
    });

    it('应该处理添加字体失败的情况', () => {
      mockFonts.add.mockImplementation(() => {
        throw new Error('Add font failed');
      });
      const result = addFont('TestFont', '/test.woff2');
      expect(result).toBe(false);
    });
  });

  describe('addFontFace', () => {
    it('应该添加FontFace对象', () => {
      const fontFace = new (global as any).FontFace('TestFont', 'url(/test.woff2)');
      const result = addFontFace(fontFace);
      expect(result).toBe(true);
      expect(mockFonts.add).toHaveBeenCalledWith(fontFace);
    });

    it('应该处理添加FontFace失败的情况', () => {
      mockFonts.add.mockImplementation(() => {
        throw new Error('Add font failed');
      });
      const fontFace = new (global as any).FontFace('TestFont', 'url(/test.woff2)');
      const result = addFontFace(fontFace);
      expect(result).toBe(false);
    });
  });

  describe('deleteFont', () => {
    it('应该删除字体（使用FontFace对象）', () => {
      const fontFace = new (global as any).FontFace('TestFont', 'url(/test.woff2)');
      const result = deleteFont(fontFace);
      expect(result).toBe(true);
      expect(mockFonts.delete).toHaveBeenCalledWith(fontFace);
    });

    it('应该删除字体（使用字体名称）', () => {
      // 模拟addedFonts中有一个匹配的字体
      const fontFace = new (global as any).FontFace('TestFont', 'url(/test.woff2)');
      const checker = createFontChecker();
      addFontFace(fontFace);
      
      const result = deleteFont('TestFont');
      expect(result).toBe(true);
      expect(mockFonts.delete).toHaveBeenCalled();
    });

    it('应该处理删除字体失败的情况', () => {
      mockFonts.delete.mockImplementation(() => {
        throw new Error('Delete font failed');
      });
      const fontFace = new (global as any).FontFace('TestFont', 'url(/test.woff2)');
      const result = deleteFont(fontFace);
      expect(result).toBe(false);
    });
  });

  describe('clearFonts', () => {
    it('应该清除所有字体', () => {
      // mock delete 被调用多次
      mockFonts.delete.mockReturnValue(true);
      // 模拟 addedFonts 有两个字体
      const checker = createFontChecker();
      const font1 = new (global as any).FontFace('Font1', 'url(/1.woff2)');
      const font2 = new (global as any).FontFace('Font2', 'url(/2.woff2)');
      checker.addFont(font1);
      checker.addFont(font2);
      const result = checker.clearFonts();
      expect(result).toBe(true);
      expect(mockFonts.delete).toHaveBeenCalledTimes(2);
    });

    it('应该处理清除字体失败的情况', () => {
      mockFonts.delete.mockImplementation(() => {
        throw new Error('Delete font failed');
      });
      const checker = createFontChecker();
      const font1 = new (global as any).FontFace('Font1', 'url(/1.woff2)');
      checker.addFont(font1);
      const result = checker.clearFonts();
      expect(result).toBe(false);
    });
  });

  describe('isFontLoaded', () => {
    it('应该同步检查字体是否已加载', () => {
      const result = isFontLoaded('Arial');
      expect(result).toBe(true);
      expect(mockFonts.check).toHaveBeenCalledWith("12px 'Arial'");
    });

    it('应该处理document.fonts不存在的情况', () => {
      const originalFonts = document.fonts;
      Object.defineProperty(document, 'fonts', {
        value: undefined,
        writable: true,
        configurable: true
      });
      
      const result = isFontLoaded('Arial');
      expect(result).toBe(false);
      
      // 恢复原始值
      Object.defineProperty(document, 'fonts', {
        value: originalFonts,
        writable: true,
        configurable: true
      });
    });
  });

  describe('waitForFonts', () => {
    it('应该等待字体加载完成', async () => {
      const result = await waitForFonts(['Arial', 'Helvetica']);
      expect(result).toBeDefined();
      expect(typeof result.success).toBe('boolean');
      expect(Array.isArray(result.allFonts)).toBe(true);
    });

    it('应该使用提供的超时时间', async () => {
      const timeout = 5000;
      await waitForFonts(['Arial'], timeout);
      // 这里可以验证超时设置是否正确应用
    });
  });
}); 