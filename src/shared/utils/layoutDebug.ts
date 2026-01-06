/**
 * 布局高度诊断工具
 * 用于调试页面高度溢出问题
 */

export function debugLayoutHeights() {
  const html = document.documentElement;
  const body = document.body;
  const header = document.querySelector('header');
  const main = document.querySelector('main');
  const mobileNav = document.querySelector('[role="navigation"]');
  
  const viewport = window.innerHeight;
  const headerH = header?.offsetHeight ?? 0;
  const mainH = main?.offsetHeight ?? 0;
  const navH = mobileNav?.offsetHeight ?? 0;

  const htmlH = html.scrollHeight;
  const bodyH = body.scrollHeight;

  console.group('📐 Layout Height Debug');
  console.log('Viewport Height:', viewport);
  console.log('Header Height:', headerH);
  console.log('Main Height:', mainH);
  console.log('Mobile Nav Height:', navH);
  console.log('---');
  console.log('HTML scrollHeight:', htmlH);
  console.log('Body scrollHeight:', bodyH);
  console.log('---');
  console.log('Sum (Header + Main + Nav):', headerH + mainH + navH);
  console.log('Overflow Amount:', Math.max(0, (headerH + mainH + navH) - viewport));
  console.log('---');
  console.log('Safe Areas:');
  console.log('  safe-area-inset-top:', getComputedStyle(html).getPropertyValue('--safe-area-inset-top'));
  console.log('  safe-area-inset-bottom:', getComputedStyle(html).getPropertyValue('--safe-area-inset-bottom'));
  console.groupEnd();
}

export function monitorHeightChanges() {
  const observer = new ResizeObserver(() => {
    debugLayoutHeights();
  });

  document.querySelectorAll('header, main, [role="navigation"]').forEach(el => {
    observer.observe(el);
  });

  return () => observer.disconnect();
}

// 快捷调用
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).debugLayout = debugLayoutHeights;
}