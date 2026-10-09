// Six shared, silent clips. No video is embedded in the HTML or required offline.
const mascotClips=new Map(),mascotDocuments=new WeakMap();
const mascotStates=new Set(['welcome','thinking','success','encourage','focus','pause']);
const mascotMediaBase=new URL('assets/',location.href);
function syncMascotMedia(doc=document){
 if(mascotDocuments.has(doc)||!doc.defaultView||location.protocol==='file:')return;
 const win=doc.defaultView,reduce=win.matchMedia('(prefers-reduced-motion: reduce)'),nodes=new Map();
 const allowed=()=>!reduce.matches&&!navigator.connection?.saveData;
 const supported=doc.createElement('video').canPlayType('video/webm; codecs="vp9"');
 if(!supported||!win.IntersectionObserver)return;
 function fallback(root,record){record.failed=true;record.video?.remove();record.video=null;root.classList.remove('is-video-ready')}
 async function play(root,record){
  if(!allowed()||doc.hidden||!record.visible||record.failed||!root.isConnected)return;
  if(record.video){if(!record.video.ended)record.video.play().catch(()=>fallback(root,record));return}
  if(record.loading)return;record.loading=true;
  const state=root.dataset.state;
  try{
   if(!mascotClips.has(state))mascotClips.set(state,fetch(new URL('norbit-'+state+'.webm',mascotMediaBase),{cache:'force-cache',credentials:'omit'}).then(async r=>{if(!r.ok)throw Error('Clip unavailable');const blob=await r.blob();if(blob.size>250000||!blob.type.startsWith('video/'))throw Error('Invalid clip');return URL.createObjectURL(blob)}));
   const url=await mascotClips.get(state);
   if(!root.isConnected||!allowed()||!record.visible||doc.hidden)return;
   const video=doc.createElement('video');record.video=video;
   video.className='mascot-video';video.muted=true;video.defaultMuted=true;video.playsInline=true;video.preload='none';video.loop=state==='thinking';video.setAttribute('aria-hidden','true');video.tabIndex=-1;video.disablePictureInPicture=true;video.disableRemotePlayback=true;
   video.addEventListener('playing',()=>root.classList.add('is-video-ready'));
   video.addEventListener('error',()=>fallback(root,record),{once:true});
   video.src=url;root.append(video);await video.play();
  }catch{fallback(root,record)}finally{record.loading=false}
 }
 const observer=new win.IntersectionObserver(entries=>{for(const entry of entries){const record=nodes.get(entry.target);if(!record)continue;record.visible=entry.isIntersecting&&entry.intersectionRatio>0;if(record.visible)play(entry.target,record);else record.video?.pause()}},{threshold:0.01});
 function scan(node){if(node.nodeType!==1)return;const roots=[...(node.matches('.norbit-mascot')?[node]:[]),...node.querySelectorAll('.norbit-mascot')];for(const root of roots)if(!nodes.has(root)&&mascotStates.has(root.dataset.state)){nodes.set(root,{visible:false,loading:false,failed:false,video:null});observer.observe(root)}}
 function cleanup(){for(const [root,record] of nodes)if(!root.isConnected){observer.unobserve(root);record.video?.pause();record.video?.removeAttribute('src');record.video?.load();nodes.delete(root)}}
 function preference(){for(const [root,record] of nodes){if(!allowed()){record.video?.pause();root.classList.remove('is-video-ready');root.classList.add('is-motion-static')}else{root.classList.remove('is-motion-static');play(root,record)}}}
 const mutations=new win.MutationObserver(entries=>{cleanup();for(const entry of entries)for(const node of entry.addedNodes)scan(node);preference()});
 mutations.observe(doc.body,{childList:true,subtree:true});scan(doc.body);preference();
 doc.addEventListener('visibilitychange',()=>{for(const [root,record] of nodes)doc.hidden?record.video?.pause():play(root,record)});
 reduce.addEventListener('change',preference);navigator.connection?.addEventListener('change',preference);
 win.addEventListener('pagehide',()=>{observer.disconnect();mutations.disconnect();for(const record of nodes.values())record.video?.pause();nodes.clear();reduce.removeEventListener('change',preference);navigator.connection?.removeEventListener('change',preference);mascotDocuments.delete(doc)},{once:true});
 mascotDocuments.set(doc,true);
}
window.addEventListener('pageshow',()=>syncMascotMedia());
