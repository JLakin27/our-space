/* Independent PWA registration. Does not change Firebase or app startup. */
(() => {
  if (!('serviceWorker' in navigator)) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js', { scope: './' })
      .catch(error => console.warn('Our Space PWA registration failed:', error));
  });
})();
