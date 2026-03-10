if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', function(e) {
    if (e.reason && e.reason.message && e.reason.message.indexOf('module factory is not available') !== -1) {
      e.preventDefault();
      e.stopImmediatePropagation();
      console.warn('[HMR] Suppressed stale module factory error - this is harmless');
    }
  });
}
