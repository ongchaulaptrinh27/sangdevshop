(async () => {
  if (!('serviceWorker' in navigator)) {
    console.log("Trình duyệt không hỗ trợ Service Worker");
    return;
  }

  // Đăng ký service worker ngay trong file này
  const code = `
    const CACHE_NAME = 'sangdevshop-singlefile-v1';
    const OFFLINE_URLS = ['/', '/index.html', '/favicon.ico'];

    self.addEventListener('install', event => {
      event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(OFFLINE_URLS))
      );
      self.skipWaiting();
    });

    self.addEventListener('activate', event => {
      event.waitUntil(
        caches.keys().then(keys =>
          Promise.all(keys.map(k => k !== CACHE_NAME && caches.delete(k)))
        )
      );
      self.clients.claim();
    });

    self.addEventListener('fetch', event => {
      event.respondWith(
        fetch(event.request)
          .then(response => {
            const resClone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, resClone));
            return response;
          })
          .catch(() => caches.match(event.request))
      );
    });
  `;

  const blob = new Blob([code], { type: "application/javascript" });
  const swURL = URL.createObjectURL(blob);

  try {
    const reg = await navigator.serviceWorker.register(swURL);
    console.log("✅ Service Worker từ single JS đã hoạt động:", reg);
  } catch (err) {
    console.error("❌ Lỗi khi đăng ký Service Worker:", err);
  }
})();
