const CACHE_NOM = "cv-auto-v1";
const RESSOURCES_PRINCIPALES = ["/", "/hors-ligne", "/icons/icon-192.png", "/icons/icon-512.png"];

self.addEventListener("install", (evenement) => {
  evenement.waitUntil(
    caches.open(CACHE_NOM).then((cache) => cache.addAll(RESSOURCES_PRINCIPALES))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (evenement) => {
  evenement.waitUntil(
    caches.keys().then((cles) =>
      Promise.all(cles.filter((cle) => cle !== CACHE_NOM).map((cle) => caches.delete(cle)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (evenement) => {
  if (evenement.request.method !== "GET") return;

  if (evenement.request.mode === "navigate") {
    evenement.respondWith(
      fetch(evenement.request).catch(() =>
        caches.match("/hors-ligne").then((reponse) => reponse || caches.match("/"))
      )
    );
    return;
  }

  evenement.respondWith(
    caches.match(evenement.request).then((reponseEnCache) => {
      return (
        reponseEnCache ||
        fetch(evenement.request)
          .then((reponseReseau) => {
            const clone = reponseReseau.clone();
            caches.open(CACHE_NOM).then((cache) => cache.put(evenement.request, clone));
            return reponseReseau;
          })
          .catch(() => undefined)
      );
    })
  );
});