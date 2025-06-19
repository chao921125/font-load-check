import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useFontCheck, createFontChecker } from '../react';

// 模拟FontChecker
jest.mock('../core/FontChecker', () => {
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

describe('React Hooks', () => {
  describe('useFontCheck', () => {
    test('应该返回字体检查结果', async () => {
      // 创建测试组件
      function TestComponent() {
        const { results, loading, error } = useFontCheck(['Arial', 'NonExistentFont']);
        
        if (loading) return <div>Loading...</div>;
        if (error) return <div>Error: {error.message}</div>;
        
        return (
          <div data-testid="results">
            {Array.isArray(results) && results.map((font, index) => (
              <div key={index} data-testid={`font-${font.name}`}>
                {font.name}: {font.loaded ? 'Loaded' : 'Not Loaded'}
              </div>
            ))}
          </div>
        );
      }
      
      // 渲染组件
      render(<TestComponent />);
      
      // 等待结果加载
      await waitFor(() => {
        expect(screen.getByTestId('results')).toBeInTheDocument();
      });
      
      // 验证结果
      expect(screen.getByTestId('font-Arial')).toHaveTextContent('Arial: Loaded');
      expect(screen.getByTestId('font-NonExistentFont')).toHaveTextContent('NonExistentFont: Not Loaded');
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