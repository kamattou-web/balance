/* Balance : service worker. Le site kamattou-web.github.io héberge d'autres applications :
   on ne supprime que nos propres anciens caches (préfixe "tpac-v"), jamais ceux des autres. */
const V="tpac-v1-2026-11-14-2026-11-14";
const FILES=["./", "index.html", "balance-hors-ligne.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "icon-maskable-512.png", "apple-touch-icon.png", "favicon.png", "voix/neural.js"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith("tpac-v")&&k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{const r=e.request;const U=new URL(r.url);if(r.method!=="GET"||U.origin!==location.origin)return;
const scope=new URL(self.registration.scope).pathname;if(!U.pathname.startsWith(scope))return;
if(U.pathname.includes("/voix/")&&!U.pathname.endsWith("neural.js"))return;
e.respondWith(caches.open(V).then(c=>c.match(r,{ignoreSearch:true}).then(hit=>{const net=fetch(r).then(res=>{if(res&&res.ok)c.put(r,res.clone());return res;}).catch(()=>hit||c.match("index.html"));return hit?(e.waitUntil(net.catch(()=>{})),hit):net;})));});
