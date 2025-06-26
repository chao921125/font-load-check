// 全局 mock canvas.getContext，避免 jsdom 报错和警告
if (!HTMLCanvasElement.prototype.getContext || HTMLCanvasElement.prototype.getContext.name === 'notImplemented') {
  HTMLCanvasElement.prototype.getContext = function () {
    return {
      measureText: () => ({ width: 100 }),
      font: '',
      canvas: this,
    };
  };
}

// 直接全局 mock 掉 console.error 和 console.warn，让测试输出更干净
console.error = () => {};
console.warn = () => {}; 