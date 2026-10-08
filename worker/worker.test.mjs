import assert from 'node:assert/strict';
import worker,{StudyQuota,validResult} from './index.js';
const origin='https://joaovitorgoncalvesdev.github.io';
const req=(data={},headers={},method='POST')=>new Request('https://norte-gemini.example/ai',{method,headers:{Origin:origin,'Content-Type':'application/json','CF-Connecting-IP':'192.0.2.1',...headers},...(method==='POST'?{body:JSON.stringify({mode:'explain',content:'Uma dificuldade sobre concordância verbal.',token:'test-token',...data})}:{})});
const map=new Map();let lock=Promise.resolve();const storage={get:async key=>structuredClone(map.get(key)),put:async(k,v)=>map.set(k,structuredClone(v)),transaction:fn=>{const next=lock.then(()=>fn(storage));lock=next.catch(()=>{});return next}};
const quota=new StudyQuota({storage});
const env={GEMINI_API_KEY:'fake-api-key',TURNSTILE_SECRET:'fake-turnstile-secret',QUOTA:{idFromName:()=>0,get:()=>({fetch:(url,init)=>quota.fetch(new Request(url,init))})}};
let count=0,aiCalls=0,verified={success:true,hostname:'joaovitorgoncalvesdev.github.io',action:'study'},answer={explanation:'Uma explicação com um exemplo.'},modelStatus=200;
globalThis.fetch=async(url,options)=>{if(String(url).includes('siteverify'))return Response.json(verified);aiCalls++;const body=JSON.parse(options.body);assert.equal(body.contents[0].parts[0].text,'Uma dificuldade sobre concordância verbal.');assert.equal(options.headers['x-goog-api-key'],'fake-api-key');return modelStatus===200?Response.json({candidates:[{finishReason:'STOP',content:{parts:[{text:JSON.stringify(answer)}]}}]}):new Response('{}',{status:modelStatus})};
async function status(request,expected,config=env){const response=await worker.fetch(request,config);assert.equal(response.status,expected);assert.equal(response.headers.get('cache-control'),'no-store');count++;return response}
await status(req({}, {Origin:'https://evil.example'}),403);
assert.equal(aiCalls,0);
await status(req({}, {},'GET'),405);
await status(req({}, {},'OPTIONS'),204);
await status(req(),503,{});
await status(req({mode:'unknown'}),400);
await status(req({content:'short'}),400);
await status(req({content:'x'.repeat(8001)}),400);
await status(req({token:''}),403);
verified={success:false};await status(req(),403);
verified={success:true,hostname:'evil.example',action:'study'};await status(req(),403);
verified={success:true,hostname:'joaovitorgoncalvesdev.github.io',action:'other'};await status(req(),403);
assert.equal(aiCalls,0);
verified={success:true,hostname:'joaovitorgoncalvesdev.github.io',action:'study'};
const response=await status(req(),200);assert.equal((await response.json()).remaining,29);
modelStatus=429;await status(req(),429);
await status(req(),429);assert.equal(aiCalls,2);
// Durable global budget remains enforced after object reconstruction.
map.clear();const now=Date.now,clock=Date.now();Date.now=()=>clock;
for(let n=0;n<30;n++){Date.now=()=>clock+Math.floor(n/6)*60000;const r=await (await quota.fetch(new Request('https://quota/reserve',{method:'POST',body:JSON.stringify({ipHash:'visitor-'+n})}))).json();assert.equal(r.allowed,true)}
const restart=new StudyQuota({storage});const r=await (await restart.fetch(new Request('https://quota/reserve',{method:'POST',body:'{"ipHash":"new-visitor"}'}))).json();assert.equal(r.allowed,false);Date.now=now;count++;
assert.equal(validResult('cards',{cards:[{front:'a',back:'b'}]}),false);
assert.equal(validResult('quiz',{questions:Array(3).fill({prompt:'p',options:['a','b','c','d'],answer:4,explanation:'e'})}),false);
assert.equal(validResult('quiz',{questions:Array(3).fill({prompt:'p',options:['a','a','c','d'],answer:1,explanation:'e'})}),false);
console.log(`PASS: ${count} checks for origin, validation, secrets, challenge, errors and persistent quota.`);
