import { ref, watchEffect } from 'vue';
import FontChecker, { FontCheckResult, FontCheckerOptions } from '../core/FontChecker';

/**
 * Vue 3 组合式API钩子
 * @param fonts 要检查的字体名称或名称数组
 * @param options 配置选项
 * @returns 响应式的字体加载结果
 */
export function useFontCheck(fonts?: string | string[], options: FontCheckerOptions = {}) {
  const results = ref<FontCheckResult | FontCheckResult[]>();
  const loading = ref(true);
  const error = ref<Error | null>(null);
  
  const checker = new FontChecker(options);
  
  watchEffect(async () => {
    try {
      loading.value = true;
      error.value = null;
      results.value = await checker.check(fonts);
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err));
    } finally {
      loading.value = false;
    }
  });
  
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