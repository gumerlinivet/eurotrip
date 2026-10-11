// Atlas Historico: funciona sem internet. Versao 1062af9a3f
const C='atlas-1062af9a3f';
const F=['guia-atlas.html','atlas.webmanifest','atlas-icon-192.png','atlas-icon-512.png','atlas-touch.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F.map(f=>new Request(f,{cache:'reload'})))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('atlas-')&&k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);if(u.origin!==location.origin)return;
  if(/guia-atlas\.html$/.test(u.pathname)){e.respondWith(fetch(r,{cache:'no-store'}).then(res=>{const c=res.clone();caches.open(C).then(x=>x.put('guia-atlas.html',c));return res;}).catch(()=>caches.match('guia-atlas.html')));return;}
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(m=>m||fetch(r)));});
