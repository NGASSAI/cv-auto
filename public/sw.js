const CACHE_NOM = "cv-auto-v2";
const RESSOURCES_PRINCIPALES = ["/", "/hors-ligne", "/icons/icon-192.png", "/icons/icon-512.png"];

// Ne pas mettre en cache les routes API et les routes dynamiques
function devraitMettreEnCache(url) {
  const pathname = new URL(url).pathname;
  // Ignorer les API
  if (pathname.startsWith("/api/")) return false;
  // Ignorer les routes dynamiques avec paramètres
  if (pathname.includes("/editor/")) return false;
  // Ignorer les routes d'auth
  if (pathname.startsWith("/connexion") || pathname.startsWith("/inscription")) return false;
  return true;
}

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
  // Ne pas intercepter les requêtes POST, PUT, DELETE, etc.
  if (evenement.request.method !== "GET") return;

  // Ne pas mettre en cache les routes API et dynamiques
  if (!devraitMettreEnCache(evenement.request.url)) {
    evenement.respondWith(fetch(evenement.request));
    return;
  }

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
            // Ne mettre en cache que les réponses réussies
            if (!reponseReseau || reponseReseau.status !== 200) {
              return reponseReseau;
            }
            const clone = reponseReseau.clone();
            caches.open(CACHE_NOM).then((cache) => cache.put(evenement.request, clone));
            return reponseReseau;
          })
          .catch(() => undefined)
      );
    })
  );
});