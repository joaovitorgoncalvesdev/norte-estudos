/* Native, finite motion. Study data and input handling remain synchronous. */
const siteMotion = (() => {
 const preference=matchMedia('(prefers-reduced-motion: reduce)');
 const active=new Set(),owners=new WeakMap();
 let observer=null,lastPage='';
 // A critically damped spring sampled once, without an idle animation loop.
 const spring=Array.from({length:25},(_,i)=>{
  const t=i/24,decay=(1+9*t)*Math.exp(-9*t);
  return {offset:t,opacity:1-.22*decay,transform:`translateY(${8*decay}px)`};
 });
 spring[spring.length-1]={offset:1,opacity:1,transform:'translateY(0)'};
 function play(element,frames,options={}){
  if(!element||!element.isConnected||preference.matches||document.hidden||typeof element.animate!=='function')return;
  owners.get(element)?.cancel();
  const animation=element.animate(frames,{duration:340,easing:'linear',fill:'backwards',...options});
  owners.set(element,animation);
  active.add(animation);
  animation.finished.catch(()=>{}).finally(()=>{active.delete(animation);animation.cancel()});
  return animation;
 }
 function clear(){observer?.disconnect();observer=null;for(const animation of active)animation.cancel();active.clear()}
 function chart(element){
  const bars=[...element.querySelectorAll('.chart-bar,.progress>span')].slice(0,40);
  bars.forEach((bar,i)=>play(bar,[{transform:bar.matches('.chart-bar')?'scaleY(.1)':'scaleX(.1)'},{transform:'scale(1)'}],{duration:420,delay:Math.min(i*14,70),easing:'cubic-bezier(.22,.8,.25,1)'}));
 }
 function page(){
  const key=route+':'+(db.activeExam||'');
  const changed=key!==lastPage;lastPage=key;clear();
  if(!changed||preference.matches||document.hidden||tour||route==='ia')return;
  const content=$('#content');
  // Animate containers, never every row, nested panel or editable control.
  const candidates=[...content.querySelectorAll('.heading,.page-heading,.hero,.panel,.onboarding')].filter(el=>!el.parentElement.closest('.panel,.hero,.onboarding')).slice(0,60);
  let visible=0;
  const reveal=element=>{play(element,spring,{delay:Math.min(visible++*24,72)});chart(element)};
  observer=new IntersectionObserver(entries=>{
   for(const entry of entries)if(entry.isIntersecting){observer?.unobserve(entry.target);reveal(entry.target)}
  },{threshold:.05});
  for(const element of candidates){const rect=element.getBoundingClientRect();if(rect.top<innerHeight&&rect.bottom>0)reveal(element);else observer.observe(element)}
 }
 preference.addEventListener('change',()=>clear());
 document.addEventListener('visibilitychange',()=>{if(document.hidden)clear()});
 document.addEventListener('toggle',event=>{
  if(event.target.matches('details[open]')){
   const body=event.target.querySelector(':scope > div,:scope > section,:scope > p');
   play(body,[{opacity:.5,transform:'translateY(-4px)'},{opacity:1,transform:'translateY(0)'}],{duration:200,easing:'ease-out'});
  }
 },true);
 return {page,play};
})();
const renderWithoutSiteMotion=render;
render=function(){renderWithoutSiteMotion();siteMotion.page()};
const modalWithoutSiteMotion=modal;
modal=function(...args){
 modalWithoutSiteMotion(...args);
 siteMotion.play($('#modal'),[{opacity:.5,transform:'translateY(12px) scale(.98)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:260,easing:'cubic-bezier(.2,.8,.2,1)'});
};
const toastWithoutSiteMotion=toast;
toast=function(...args){
 toastWithoutSiteMotion(...args);
 siteMotion.play($('#toast'),[{opacity:.35,translate:'0 8px'},{opacity:1,translate:'0 0'}],{duration:220,easing:'cubic-bezier(.2,.8,.2,1)'});
};
