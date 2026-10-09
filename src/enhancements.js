/* Practical tools use existing records and work offline. */
let quickMinutes=25,smartSearchKind='all',smartSearchResults=[],smartSearchIndex=[];
const searchGlyph='<svg class="search-lens" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 4.5 4.5"/></svg>';
const searchTrigger=$('.toolbar [data-action="search"]');
searchTrigger.classList.add('search-trigger');searchTrigger.innerHTML=searchGlyph+'<span>Buscar</span><kbd>Ctrl K</kbd>';
searchTrigger.setAttribute('aria-label','Buscar no Norte');searchTrigger.setAttribute('aria-keyshortcuts','Control+k Meta+k');
const normalizeSearch=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR');
function searchRecords(){
 const list=routes.map(([r,title])=>({kind:'areas',title,sub:'Área do Norte',action:'navigate',data:{route:r}}));
 if(!exam())return list;
 const add=(kind,title,sub,action,data,text='')=>list.push({kind,title,sub,action,data,text});
 allTopics().filter(x=>!x.s.archived).forEach(x=>add('assuntos',x.t.name,x.s.name,'topic-edit',{sid:x.s.id,tid:x.t.id},x.t.notes));
 exam().cards.filter(c=>!c.suspended).forEach(c=>add('cartoes',c.front,'Cartão · '+subjectName(c.subjectId),'card-edit',{id:c.id},c.back));
 exam().resources.forEach(r=>add('materiais',r.title,'Biblioteca · '+subjectName(r.subjectId),'resource-edit',{id:r.id},r.notes));
 exam().mistakes.forEach(m=>add('erros',m.title,(m.resolved?'Resolvido':'Pendente')+' · '+subjectName(m.subjectId),'mistake-edit',{id:m.id},m.explanation));
 (exam().studyTasks||[]).forEach(t=>add('prazos',t.title,dateLabel(t.date)+' · '+t.kind,'deadline-edit',{id:t.id}));
 (db.aiChats||[]).filter(c=>c.examId===exam().id).forEach(c=>add('chats',c.title,'Conversa da NORBIT AI','search-chat',{id:c.id}));
 return list;
}
openSearch=function(){
 smartSearchKind='all';
 smartSearchIndex=searchRecords().map(r=>({...r,normalized:normalizeSearch(r.title+' '+r.sub+' '+(r.text||''))}));
 modal('Encontre seu próximo passo','Busque na preparação atual. Use as setas para escolher e Enter para abrir.',`<div class="smart-search-field">${searchGlyph}<input id="global-search" maxlength="160" placeholder="Assunto, dúvida ou prazo…" aria-label="Busca global" aria-controls="search-results" autofocus>${btn('Limpar','search-clear','aria-label="Limpar busca"','quiet small')}</div><label class="smart-search-filter">Buscar em<select id="search-kind">${[['all','Tudo'],['areas','Áreas do Norte'],['assuntos','Assuntos'],['cartoes','Cartões'],['materiais','Biblioteca'],['erros','Caderno de erros'],['prazos','Prazos'],['chats','Conversas da IA']].map(([key,label])=>`<option value="${key}">${label}</option>`).join('')}</select></label><p id="search-summary" class="form-help" role="status" aria-live="polite"></p><div class="search-results" id="search-results"></div>`);
 $('#global-search').addEventListener('input',e=>showSearch(e.target.value));
 $('#search-kind').addEventListener('change',e=>{smartSearchKind=e.target.value;showSearch($('#global-search').value)});
 showSearch('');
};
showSearch=function(query){
 const terms=normalizeSearch(query).trim().split(/\s+/).filter(Boolean);
 const matched=smartSearchIndex.filter(r=>(smartSearchKind==='all'||r.kind===smartSearchKind)&&terms.every(term=>r.normalized.includes(term)));
 // On an empty search, show destinations; a chosen category shows its records.
 const visible=!terms.length&&smartSearchKind==='all'?matched.filter(r=>r.kind==='areas'):matched;
 smartSearchResults=visible.slice(0,50);
 $('#search-summary').textContent=visible.length>50?`Mostrando 50 de ${visible.length} resultados. Refine a busca.`:`${visible.length} ${visible.length===1?'resultado':'resultados'}${terms.length?' para “'+query.trim()+'”':''}.`;
 $('#search-results').innerHTML=smartSearchResults.map((r,i)=>`<button class="search-result" data-action="smart-result" data-index="${i}"><span class="search-result-icon">${sidebarIcon(r.kind==='areas'?r.data.route:r.kind==='chats'?'ia':r.kind==='prazos'?'prazos':r.kind==='erros'?'questoes':r.kind==='cartoes'?'cartoes':r.kind==='materiais'?'biblioteca':'edital')}</span><span><strong>${esc(r.title)}</strong><small>${esc(r.sub)}</small></span><span aria-hidden="true">↗</span></button>`).join('')||'<div class="empty"><h3>Nada por aqui ainda.</h3><p>Tente outro termo ou escolha Tudo.</p></div>';
};
$('#modal').addEventListener('keydown',event=>{
 if(!$('#global-search')||!['ArrowDown','ArrowUp'].includes(event.key))return;
 if(event.target.id!=='global-search'&&!event.target.matches('.search-result'))return;
 const results=$$('.search-result'),index=results.indexOf(document.activeElement);
 if(!results.length)return;event.preventDefault();
 if(index===0&&event.key==='ArrowUp')$('#global-search').focus();
 else results[Math.max(0,Math.min(results.length-1,index+(event.key==='ArrowDown'?1:-1)))].focus();
});
function quickTargets(){
 if(!exam())return [];
 const choices=[],seen=new Set();
 const add=(s,t,reason)=>{if(!s||s.archived||!t||seen.has(s.id+':'+t.id))return;seen.add(s.id+':'+t.id);choices.push({s,t,reason})};
 dueTopics().forEach(x=>add(x.s,x.t,'Revisão disponível · tente lembrar antes de consultar'));
 exam().mistakes.filter(m=>!m.resolved).forEach(m=>add(subject(m.subjectId),topic(m.subjectId,m.topicId),'Dificuldade em aberto · recupere a regra e pratique'));
 exam().plans.filter(p=>p.date===today()&&p.status==='planned').sort((a,b)=>a.start.localeCompare(b.start)).forEach(p=>add(subject(p.subjectId),topic(p.subjectId,p.topicId),'No plano de hoje · avance em um bloco possível'));
 recommendations().forEach(x=>add(x.s,x.t,reason(x.s,x.t)));
 return choices.slice(0,3);
}
function quickStartPanel(){return `<section class="panel quick-start" id="quick-start">${panelHead('Cabe no seu tempo.','Escolha um bloco e retome um assunto importante.')}<div class="quick-start-controls"><label for="quick-minutes">Quanto tempo você tem?</label><select id="quick-minutes">${[10,15,25,45,60].map(n=>`<option value="${n}" ${quickMinutes===n?'selected':''}>${n} minutos</option>`).join('')}</select><span class="tag blue">Contagem regressiva</span></div><div class="quick-targets">${quickTargets().map(x=>`<div class="row"><div class="row-main"><h3>${esc(x.t.name)}</h3><p>${esc(x.s.name)} · ${esc(x.reason)}</p></div>${btn('Começar','quick-focus',`data-sid="${esc(x.s.id)}" data-tid="${esc(x.t.id)}"`,'secondary small')}</div>`).join('')||empty('Seu próximo passo precisa de um assunto','Adicione matérias e assuntos para receber sugestões.',btn('Organizar assuntos','navigate','data-route="edital"'))}</div><p class="form-help">A sessão só entra no histórico quando você a registra. Seu planejamento não é alterado.</p></section>`}
const todayBeforeEnhancements=viewPersonalToday;
viewPersonalToday=function(){return todayBeforeEnhancements().replace('<div class="grid two">',quickStartPanel()+'<div class="grid two">')};
document.addEventListener('change',event=>{if(event.target.id==='quick-minutes')quickMinutes=Number(event.target.value)});
Object.assign(actions,{
 'search':()=>openSearch(),
 'search-clear':()=>{$('#global-search').value='';showSearch('');$('#global-search').focus()},
 'smart-result':b=>{const r=smartSearchResults[Number(b.dataset.index)];if(!r)return;closeModal();actions[r.action]?.({dataset:r.data})},
 'search-chat':b=>{if(aiBusy)return toast('Aguarde ou cancele a resposta atual antes de trocar de conversa.');go('ia');aiOpenChat(b.dataset.id)},
 'quick-focus':b=>{
  if(db.timer){go('foco');return toast('Sua sessão em andamento foi preservada.')}
  if(!quickTargets().some(x=>x.s.id===b.dataset.sid&&x.t.id===b.dataset.tid))return;
  focusMode='countdown';startFocus(b.dataset.sid,b.dataset.tid);
  if(!db.timer)return;db.timer.duration=quickMinutes*60;
  if(db.timer.alarm.atSeconds>=db.timer.duration)db.timer.alarm.atSeconds=0;
  persist();render();
 },
 'mistake-review':b=>{const m=exam()?.mistakes.find(m=>m.id===b.dataset.id),t=m&&topic(m.subjectId,m.topicId);if(!t)return toast('Associe esta dificuldade a um assunto para agendar a revisão.');snapshot();const date=addDays(today(),1);t.nextReview=t.nextReview&&t.nextReview<=date?t.nextReview:date;commit('Revisão agendada. Uma revisão mais próxima foi preservada.',true)},
 'calendar-export':()=>exportStudyCalendar()
});
const questionsBeforeEnhancements=viewQuestions;
viewQuestions=function(){return questionsBeforeEnhancements().replace(/(<button[^>]+data-action="card-from-mistake"[^>]+data-id="([^"]+)"[^>]*>[^<]*<\/button>)/g,(match,button,id)=>match+btn('Agendar revisão','mistake-review',`data-id="${esc(id)}"`,'quiet small'))};
const deadlinesBeforeEnhancements=deadlinePanel;
deadlinePanel=function(){const html=deadlinesBeforeEnhancements();return html.replace('<section class="panel study-deadlines">','<section class="panel study-deadlines">'+(studyTasks().length?'<div class="calendar-action">'+btn('Exportar para calendário','calendar-export','','quiet small')+'</div>':''))};
function studyCalendar(){
 const escape=value=>String(value||'').replace(/\\/g,'\\\\').replace(/\r?\n|\r/g,'\\n').replace(/;/g,'\\;').replace(/,/g,'\\,');
 const stamp=new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');
 const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Norte//Prazos de estudo//PT','CALSCALE:GREGORIAN','METHOD:PUBLISH'];
 for(const task of studyTasks())lines.push('BEGIN:VEVENT','UID:'+String(task.id).replace(/[^a-zA-Z0-9_-]/g,'_')+'@norte.local','DTSTAMP:'+stamp,'DTSTART;VALUE=DATE:'+task.date.replace(/-/g,''),'DTEND;VALUE=DATE:'+addDays(task.date,1).replace(/-/g,''),'SUMMARY:'+escape(task.title),'DESCRIPTION:'+escape(task.kind+(task.subjectId?' · '+subjectName(task.subjectId):'')+'\nPreparação: '+exam().name),'END:VEVENT');
 lines.push('END:VCALENDAR');
 const encoder=new TextEncoder();
 return lines.map(line=>{let part='',folded=[];for(const char of line){if(encoder.encode(part+char).length>74){folded.push(part);part=' '+char}else part+=char}folded.push(part);return folded.join('\r\n')}).join('\r\n')+'\r\n';
}
function exportStudyCalendar(){if(!studyTasks().length)return toast('Cadastre um prazo em aberto antes de exportar.');download('norte-prazos-'+today()+'.ics',studyCalendar(),'text/calendar;charset=utf-8');toast('Agenda exportada. Importe o arquivo no seu calendário. Exportar novamente pode duplicar eventos no aplicativo escolhido.')}
function weeklyBalance(){
 const current=stats(periodSessions(7)),previous=stats(exam().sessions.filter(s=>s.date>=addDays(today(),-13)&&s.date<=addDays(today(),-7)));
 const delta=(a,b,unit)=>a===b?'Mesmo resultado da semana anterior':Math.abs(a-b)+' '+unit+(a>b?' a mais':' a menos')+' que na semana anterior';
 return `<section class="panel weekly-balance" id="weekly-balance">${panelHead('Seu ritmo, em perspectiva.','Últimos 7 dias, comparados aos 7 dias anteriores · inclui hoje')}<div class="balance-grid"><div><span>Tempo estudado</span><strong>${minutesLabel(current.m)}</strong><small>${delta(current.m,previous.m,'minutos')}</small></div><div><span>Questões resolvidas</span><strong>${current.q}</strong><small>${delta(current.q,previous.q,'questões')}</small></div><div><span>Acerto nas questões</span><strong>${current.accuracy===null?'Sem dados':current.accuracy+'%'}</strong><small>${current.accuracy===null||previous.accuracy===null?'Compare quando houver questões nos dois períodos.':delta(current.accuracy,previous.accuracy,'pontos percentuais')}</small></div></div><p class="form-help">São registros reais, sem meta de competição. O tamanho e a dificuldade dos treinos podem variar.</p></section>`;
}
const analyticsBeforeEnhancements=viewAnalytics;
viewAnalytics=function(){return analyticsBeforeEnhancements()+weeklyBalance()};
tourAreas.hoje.steps.push(
 tStep('#quick-start','Um começo que cabe no seu dia.','O Começo rápido reúne revisões disponíveis, dificuldades e assuntos do plano. As sugestões evitam repetir o mesmo assunto.'),
 tStep('#quick-minutes','Escolha o tempo disponível.','Experimente 10, 15, 25, 45 ou 60 minutos. Começar abre uma contagem regressiva; uma sessão que já esteja aberta é preservada.'),
 tStep('#quick-start [data-action="quick-focus"]','Estude e registre depois.','Começar abre o foco com esse assunto e tempo. Ao terminar, registre o estudo para que ele conte no histórico. O plano não é alterado.',{click:'timer'}),
 tStep('.toolbar [data-action="search"]','Uma busca, vários caminhos.','Clique na lupa ou use Ctrl K. Encontre assuntos, cartões, biblioteca, erros, prazos e conversas na preparação atual.',{click:'open'}),
 tStep('#global-search','Encontre mesmo sem acentos.','Digite interpretacao ou o assunto que procura. Limpar apaga apenas o termo de busca; seus registros permanecem intactos.',{prepare:()=>openSearch(),modal:true}),
 tStep('#search-kind','Escolha onde procurar.','Filtre por categoria. Use seta para baixo no campo para selecionar um resultado, Enter para abrir e Escape para sair.',{prepare:()=>openSearch(),modal:true})
);
tourAreas.questoes.steps.push(tStep('[data-action="mistake-review"]','Dê um próximo passo à dificuldade.','Agendar revisão coloca o assunto para amanhã. Se já houver uma data anterior, ela é preservada. Você pode desfazer; o erro continua em aberto.',{click:'review'}));
tourAreas.prazos.steps.push(tStep('[data-action="calendar-export"]','Leve os prazos para sua agenda.','Exportar para calendário baixa um arquivo ICS com prazos em aberto, de dia inteiro. Importe na sua agenda e confira possíveis duplicações. O arquivo é gerado neste aparelho.',{observeOnly:true,prepare:()=>{if(!studyTasks().length){exam().studyTasks.push({id:id(),title:'Entrega de prática',date:addDays(today(),2),kind:'Trabalho',subjectId:null,status:'open'});render()}}}));
tourAreas.evolucao.steps.push(tStep('#weekly-balance','Compare períodos com contexto.','O balanço sempre compara os últimos 7 dias aos 7 anteriores, independentemente do filtro do gráfico. Sem questões em ambos, não inventamos uma variação de acerto.'));
tourAreas.ajustes.steps.push(tStep('.sidebar-bottom [data-action="theme"]','Uma aparência para cada momento.','Alterne entre claro e escuro no menu. No celular, abra Menu para alcançar o controle. Movimento reduzido segue a configuração de acessibilidade do aparelho.',{prepare:()=>setSidebarOpen(true),onEnter:()=>setSidebarOpen(true)}));
