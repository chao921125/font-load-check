import { mount } from '@vue/test-utils';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import { useFontCheck, createFontChecker } from '../vue';
import { defineComponent, nextTick, ref } from 'vue';

// 模拟FontChecker
vi.mock('../core/FontChecker', () => {
  return {
    default: class MockFontChecker {
      check(fonts) {
        if (!fonts) {
          return Promise.resolve([
            { name: 'Arial', loaded: true, status: 'loaded' },
            { name: 'Helvetica', loaded: true, status: 'loaded' }
          ]);
        }
        
        if (Array.isArray(fonts)) {
          return Promise.resolve(
            fonts.map(font => ({
              name: font,
              loaded: ['Arial', 'Helvetica'].includes(font),
              status: ['Arial', 'Helvetica'].includes(font) ? 'loaded' : 'error'
            }))
          );
        }
        
        return Promise.resolve({
          name: fonts,
          loaded: ['Arial', 'Helvetica'].includes(fonts),
          status: ['Arial', 'Helvetica'].includes(fonts) ? 'loaded' : 'error'
        });
      }
    }
  };
});

describe('Vue Hooks', () => {
  describe('useFontCheck', () => {
    test('应该返回字体检查结果', async () => {
      // 创建测试组件
      const TestComponent = defineComponent({
        setup() {
          const { results, loading } = useFontCheck(['Arial', 'NonExistentFont']);
          return { results, loading };
        },
        template: `
          <div>
            <div v-if="loading">Loading...</div>
            <div v-else class="results">{{ results }}</div>
          </div>
        `
      });
      
      const wrapper = mount(TestComponent);
      
      // 等待异步操作完成
      await nextTick();
      await nextTick();
      
      // 验证结果
      expect(wrapper.find('.results').exists()).toBe(true);
      const results = wrapper.vm.results;
      
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
  });
  
  describe('createFontChecker', () => {
    test('应该创建字体检查器实例', () => {
      const checker = createFontChecker({ timeout: 5000 });
      expect(checker).toBeDefined();
      expect(typeof checker.check).toBe('function');
    });
  });
});