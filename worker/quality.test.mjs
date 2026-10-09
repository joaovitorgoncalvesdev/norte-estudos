import assert from 'node:assert/strict';
import worker from './index.js';
const origin='https://joaovitorgoncalvesdev.github.io';
let responseData,prompt='',providerCalls=0;
const env={GEMINI_API_KEY:'fake',TURNSTILE_SECRET:'fake',QUOTA:{idFromName:()=>0,get:()=>({fetch:async()=>Response.json({allowed:true,remaining:29})})}};
globalThis.fetch=async(url,options)=>{if(String(url).includes('siteverify'))return Response.json({success:true,hostname:'joaovitorgoncalvesdev.github.io',action:'study'});providerCalls++;prompt=JSON.parse(options.body).systemInstruction.parts[0].text;return Response.json({candidates:[{finishReason:'STOP',content:{parts:[{text:JSON.stringify(responseData)}]}}]})};
const request=extra=>new Request('https://worker.example/ai',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json','CF-Connecting-IP':'192.0.2.40'},body:JSON.stringify({mode:'explain',content:'Confira a explicação deste assunto com a referência selecionada.',token:'test',...extra})});
responseData={explanation:'Faltam critérios para comparar sua resposta. Envie a referência.',basis:'insufficient',quote:'',hints:[],steps:[]};
assert.equal((await worker.fetch(request({tool:'essay',responseStyle:'simple'}),env)).status,200);
assert.ok(prompt.includes('Não emita nota oficial'));assert.ok(prompt.includes('Use palavras simples'));
const calls=providerCalls;assert.equal((await worker.fetch(request({responseStyle:'invented'}),env)).status,400);assert.equal(providerCalls,calls);
const question={prompt:'Qual prática está descrita?',options:['Lembrar antes de consultar','Copiar sempre','Evitar consultar','Apenas reler'],answer:0,explanation:'A fonte pede tentar lembrar antes de consultar.',quote:'Tente lembrar antes de consultar.',optionExplanations:['Corresponde ao texto.','Não está no texto.','Consultar depois é permitido.','Reler primeiro não corresponde.'],takeaway:'Tente lembrar primeiro.'};
responseData={questions:[question]};
assert.equal((await worker.fetch(request({mode:'quiz',questionCount:1,difficulty:'easy',sourceText:'Tente lembrar antes de consultar.'}),env)).status,200);
assert.ok(prompt.includes('Cada questão deve preencher quote'));
for(const quote of ['', 'Um trecho inventado.', 'x'.repeat(601)]){responseData={questions:[{...question,quote}]};assert.equal((await worker.fetch(request({mode:'quiz',questionCount:1,sourceText:'Tente lembrar antes de consultar.'}),env)).status,502)}
console.log('PASS essay rubric, insufficient reference, explanation style, rejection before provider call and evidence for each quiz question. Mocked provider; not a semantic model evaluation.');
