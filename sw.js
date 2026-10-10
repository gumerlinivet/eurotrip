const SHELL='shell-202610101217-b72f9c469a';
const FILES=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(SHELL).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('shell-')&&k!==SHELL).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET') return;
  const u=new URL(r.url); if(u.origin!==location.origin) return;
  if(u.pathname.endsWith('/meta.json')){
    e.respondWith(fetch(r,{cache:'no-store'}).then(res=>{const c=res.clone(); caches.open('meta').then(m=>m.put('meta.json',c)); return res;}).catch(()=>caches.match('meta.json')));
    return;
  }
  if(/\/guia-[^/]*\.html$/.test(u.pathname)){
    // guias: internet primeiro (versao nova); sem internet, a copia guardada pelo app
    e.respondWith(fetch(r,{cache:'no-store'}).catch(()=>caches.match(r,{ignoreSearch:true})));
    return;
  }
  if(r.mode==='navigate'){
    e.respondWith(fetch(r,{cache:'no-store'}).then(res=>{const c=res.clone(); caches.open(SHELL).then(s=>s.put('index.html',c)); return res;}).catch(()=>caches.match('index.html')));
    return;
  }
  // pedacos do app (.bin?v=...) e icones: so a copia EXATA (com a versao na URL); senao, internet
  e.respondWith(caches.match(r).then(m=>m||fetch(r)));
});
