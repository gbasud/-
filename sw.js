const CACHE_NAME = 'bible-memorize-v3';

// 설치 즉시 활성화
self.addEventListener('install', e => {
  e.waitUntil(self.skipWaiting());
});

// 이전 캐시 전부 삭제 후 즉시 제어권 획득
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// 네트워크 우선 — 실패 시에만 캐시 사용
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, copy));
        return response;
      })
      .catch(() => caches.match(e.request))
  );
});
