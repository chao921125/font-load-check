import React, { useState, useEffect } from 'react';
import FontChecker, { FontCheckResult, FontCheckerOptions } from '../core/FontChecker';

/**
 * 字体检查Hook
 * @param fonts 要检查的字体名称或名称数组
 * @param options 配置选项
 */
export function useFontCheck(fonts?: string | string[], options?: FontCheckerOptions) {
  const [results, setResults] = useState<FontCheckResult | FontCheckResult[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // 创建新的字体检查器实例
  const checker = React.useMemo(
    () => new FontChecker(options),
    [options]
  );
  
  useEffect(() => {
    let isMounted = true;
    
    const checkFonts = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await checker.check(fonts);
        if (isMounted) {
          setResults(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    checkFonts();
    
    return () => {
      isMounted = false;
    };
  }, [checker, fonts]);
  
  return { results, loading, error };
}

/**
 * 创建字体检查器实例
 * @param options 配置选项
 * @returns 字体检查器实例
 */
export function createFontChecker(options: FontCheckerOptions = {}) {
  return new FontChecker(options);
}

export default { useFontCheck, createFontChecker };