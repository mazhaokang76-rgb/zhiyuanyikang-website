import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css'
import App from './App.tsx'

// 全面的水印移除函数
const removeWatermarks = () => {
  try {
    // 水印文本检测规则（包含各种可能的变体）
    const watermarkTexts = [
      'Created by', 'MiniMax', 'minimax', 'MINIMAX', 
      'space.minimax', 'Agent', 'Powered by', 
      '由', '创建', '制作', 'Made by'
    ];

    // 全面的水印选择器
    const watermarkSelectors = [
      // 固定定位元素
      'div[style*="position: fixed"]',
      'div[style*="position:fixed"]',
      'span[style*="position: fixed"]',
      'span[style*="position:fixed"]',
      'a[style*="position: fixed"]',
      'a[style*="position:fixed"]',
      // 绝对定位元素
      'div[style*="position: absolute"]',
      'div[style*="position:absolute"]',
      // 可疑的无属性div
      'body > div:not([id]):not([class]):not([role])',
      // 最后的子元素
      'body > div:last-child',
      // 底部右侧定位
      '[style*="bottom"][style*="right"]',
      '[style*="bottom:"][style*="right:"]'
    ];

    // 检查并移除水印
    watermarkSelectors.forEach(selector => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          const text = (el.textContent || '').toLowerCase();
          const hasWatermarkText = watermarkTexts.some(watermarkText => 
            text.includes(watermarkText.toLowerCase())
          );
          
          if (hasWatermarkText && el !== document.getElementById('root')) {
            const htmlEl = el as HTMLElement;
            htmlEl.style.setProperty('display', 'none', 'important');
            htmlEl.style.setProperty('visibility', 'hidden', 'important');
            htmlEl.style.setProperty('opacity', '0', 'important');
            htmlEl.style.setProperty('pointer-events', 'none', 'important');
            htmlEl.remove(); // 直接移除可疑元素
          }
        });
      } catch (selectorError) {
        // 忽略选择器错误，继续处理
      }
    });

    // 检查所有可能包含水印的元素
    const allElements = document.querySelectorAll('*');
    allElements.forEach(el => {
      try {
        const text = (el.textContent || '').toLowerCase();
        const hasWatermarkText = watermarkTexts.some(watermarkText => 
          text.includes(watermarkText.toLowerCase())
        );
        
        if (hasWatermarkText && 
            el !== document.getElementById('root') && 
            !el.closest('#root') &&
            el.textContent && el.textContent.trim().length < 50) {
          const htmlEl = el as HTMLElement;
          htmlEl.style.setProperty('display', 'none', 'important');
        }
      } catch (elementError) {
        // 忽略元素处理错误
      }
    });
  } catch (error) {
    // 静默处理错误，避免影响应用正常运行
  }
};

// 持续的水印移除初始化
const initWatermarkRemoval = () => {
  // 立即执行一次
  removeWatermarks();

  // DOM加载完成后执行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', removeWatermarks);
  }

  // 定时执行，但频率适中
  setTimeout(removeWatermarks, 1000);
  setTimeout(removeWatermarks, 3000);
  setTimeout(removeWatermarks, 8000);

  // 添加MutationObserver监控动态插入的元素
  try {
    const observer = new MutationObserver((mutations) => {
      let shouldCheck = false;
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          shouldCheck = true;
        }
      });
      
      if (shouldCheck) {
        // 延迟执行，避免过于频繁
        setTimeout(removeWatermarks, 100);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false
    });
  } catch (observerError) {
    // 如果MutationObserver不可用，使用定时器作为备选
    setInterval(removeWatermarks, 10000); // 每10秒检查一次
  }
};

// 初始化水印移除
initWatermarkRemoval();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
