/* The tour uses the same renderers as the application, with temporary records. */
const tourSetupConnected=studyTourSetup;
studyTourSetup=function(){tourSetupConnected();norbitSubject='';norbitTopic='';norbitDepth='standard';norbitInlineSource='';tutorTool='explain';tutorSource='';bankNotebook='';bankDueOnly=false;bankFilterOpen=true;notePending=null;practiceOpenedAt=0;practiceOpenedIndex=null};
const tourCaptureConnected=studyTourCapture;
studyTourCapture=function(){flushNote();return {...tourCaptureConnected(),connectedState:{norbitSubject,norbitTopic,norbitDepth,norbitInlineSource,bankNotebook,bankDueOnly,bankFilterOpen}}};
const tourRestoreConnected=studyTourRestore;
studyTourRestore=function(state){tourRestoreConnected(state);notePending=null;clearTimeout(noteSaveTimer);practiceOpenedAt=0;practiceOpenedIndex=null;if(state?.connectedState)({norbitSubject,norbitTopic,norbitDepth,norbitInlineSource,bankNotebook,bankDueOnly,bankFilterOpen}=state.connectedState)};
tourAreas.hoje.steps=[
 tStep('#connected-start','Um bloco, do começo ao fim.','Sessão guiada reúne lembrança, perguntas, correção e próximo passo. Não registra estudo antes de você conferir.'),
 tStep('#quick-start','Escolha uma fila que cabe hoje.','Cartões, assuntos e perguntas a revisar entram em uma fila local. Escolha o tempo disponível.'),
 tStep('.toolbar [data-action="session"]','Registre o que estudou.','Abra o formulário. Planejar um bloco não soma tempo ao histórico.',{click:'open'}),
 tStep('#modal [name="minutes"]','Tempo real e resultados.','Confira minutos, quantidade e acertos. O mesmo estudo deve entrar uma única vez.',{prepare:()=>sessionForm(),modal:true}),
 tStep('#content [data-action="dashboard-edit"]','Seu painel, suas prioridades.','Personalize os blocos do painel. A fila também permanece acessível em Revisões.',{observeOnly:true})
];
tourAreas.ia.steps=[
 tStep('#norbit-task','Escolha a tarefa junto da mensagem.','Explicar, dar pistas, revisar notas, comparar conceitos, analisar erros, revisar cartões, orientar a semana ou dar feedback discursivo. Criar cartões e gerar questões ficam neste mesmo seletor.',{onEnter:()=>{aiResult=null;aiMode='explain';render()}}),
 tStep('#norbit-depth','Uma explicação no seu ritmo.','Escolha linguagem simples, exemplos, etapas de cálculo ou aprofundamento. A escolha é guardada no chat.'),
 tStep('#norbit-chat-context','Cada dúvida tem seu contexto.','Vincule matéria e assunto. O vínculo ajuda a encontrar a conversa depois; o resumo completo da preparação continua opcional.'),
 tStep('#tutor-source','Escolha a referência.','A IA recebe somente o texto da fonte selecionada. Links não são abertos automaticamente. Uma citação válida não garante uma interpretação correta.'),
 tStep('#ai-content','Continue a conversa.','Pergunte e responda no mesmo chat. As mensagens recentes são enviadas para manter a continuidade; assuntos diferentes podem ter chats separados.'),
 tStep('[name="studyContext"]','Controle seu planejamento no pedido.','Ative quando quiser incluir o resumo da preparação. Confira a prévia antes de enviar.'),
 tStep('#norbit-saved-search','Busque antes de pedir de novo.','Reabra respostas salvas sem um novo pedido. Respostas sinalizadas ficam fora da reutilização automática.'),
 tStep('#norbit-task','Prepare um treino.','Selecione Gerar questões. Escolha de uma a dez e o nível. Questões com fonte devem apresentar um trecho de apoio.',{onEnter:()=>{aiMode='quiz';aiResult=null;render()}}),
 tStep('[name="questionCount"]','Escolha o tamanho do lote.','Um lote que você consegue corrigir costuma ser mais útil que muitas questões acumuladas.'),
 tStep('[name="difficulty"]','Ajuste a dificuldade.','Comece pelo nível que permite explicar o raciocínio, e aumente ao consolidar o assunto.'),
 tStep('.ai-rationale','Confira o porquê.','Responda, leia a justificativa e analise as alternativas. Confira questões geradas com seu material.',{onEnter:()=>studyAIPractice('quiz',true)}),
 tStep('[data-action="ai-bank-save"]','Guarde a prática.','Escolha matéria e assunto ao salvar no banco. Registrar resultados é uma ação separada.',{observeOnly:true}),
 tStep('[data-action="norbit-apply"]','Uma resposta pode virar um próximo passo.','Abra uma prévia editável para criar cartão, marcar revisão ou planejar uma atividade. Nada é aplicado automaticamente.',{onEnter:()=>tutorTourResult('explain'),observeOnly:true}),
 tStep('[data-action="norbit-report"]','Sinalize o que parece incorreto.','Descreva o problema e guarde para conferir. Isso impede que o resultado volte automaticamente pelo cache.',{observeOnly:true}),
 tStep('.norbit-details','Disponibilidade e privacidade.','A cota é compartilhada. Se a IA estiver indisponível, seus chats, cartões e banco local continuam funcionando.')
];
tourAreas.banco.steps=[
 tStep('.practice-subnav','As áreas de prática ficam juntas.','Banco de questões, questões e erros e simulados têm navegação própria.',{onEnter:()=>{delete writeStudio().draft;resetBankFilters();studioTourBank()}}),
 tStep('#bank-search','Encontre a pergunta certa.','Pesquise pelo enunciado e combine os filtros.'),
 tStep('#bank-filter-details','Filtros sem ocupar toda a tela.','Abra os filtros e veja matéria, assunto, dificuldade, origem, caderno e revisões. No celular eles começam recolhidos.'),
 tStep('[data-action="notebooks"]','Crie cadernos do seu jeito.','Organize conjuntos por tema, prova ou revisão. As perguntas continuam no banco.',{observeOnly:true}),
 tStep('[data-action="bank-new"]','Escolha o formato da pergunta.','Alternativas, certo ou errado, resposta curta e discursiva.',{click:'open'}),
 tStep('#bank-question-type','Cada formato tem sua correção.','Resposta curta compara as respostas aceitas. Discursivas usam uma referência e sua autoavaliação pelos critérios.',{prepare:()=>bankEditor(),modal:true}),
 tStep('#modal [name="explanation"]','Guarde o raciocínio.','A explicação e a referência ajudam a corrigir. Confira gabaritos antes de salvar.',{prepare:()=>bankEditor(),modal:true}),
 tStep('[data-action="bank-import"]','Importe associando os nomes.','JSON ou CSV podem usar os nomes existentes de matérias e assuntos. Confira a prévia; nomes desconhecidos precisam ser ajustados.',{onEnter:()=>studioTourBank(),observeOnly:true}),
 tStep('#practice-confidence','Confiança antes da resposta.','Registre se estava seguro ou em dúvida. Ela ajuda a escolher a próxima revisão; não muda seu gabarito.',{onEnter:studioTourDraft}),
 tStep('[data-action="practice-flag"]','Marque o que quer retomar.','A marca permanece na correção final. O tempo por questão também fica guardado.',{click:'flag'}),
 tStep('.practice-correction','Compare resposta, referência e tempo.','Respostas discursivas precisam de autoavaliação antes de registrar. Você pode pedir feedback à NORBIT pelos critérios, sem nota oficial.',{onEnter:studioTourResult}),
 tStep('[data-action="practice-register"]','Registre uma vez.','Confira os minutos. O resultado distribui o estudo entre os assuntos; evita lançar o mesmo treino duas vezes.',{observeOnly:true}),
 tStep('[data-action="bank-history"]','Compare as tentativas.','O histórico da pergunta reúne respostas, confiança e tempo. Revisões futuras consideram o resultado e a confiança.',{onEnter:()=>{practiceResultId=null;render()},observeOnly:true})
];
tourAreas.ia.steps.push(
 tStep('.chat-sidebar','Uma conversa para cada dúvida.','Abra e continue os chats guardados nesta preparação. No celular use Conversas.',{onEnter:studyChatDemo}),
 tStep('#chat-search','Encontre o chat pelo nome.','As conversas ficam neste navegador e entram no backup manual.'),
 tStep('.chat-tools','Organize suas conversas.','Renomeie, exclua ou comece uma nova. Cada pedido usa o histórico recente do chat.'),
 tStep('.tutor-hints','Uma pista por vez.','As três pistas são geradas juntas. Revelar as próximas não usa outro pedido.',{onEnter:()=>{aiTourChat=false;aiChatId=null;tutorTourResult('hints')}}),
 tStep('.tutor-mission','Uma missão que você executa.','Marcar os passos não registra tempo nem consome pedidos.',{onEnter:()=>tutorTourResult('mission')}),
 tStep('#ai-save-form','Revise antes de guardar os cartões.','Edite e escolha os cartões e a matéria. Confira a referência antes de adicionar.',{onEnter:()=>studyAIPractice('cards')})
);
function guidedTourStep(step){const s=exam().subjects[0],t=s.topics[0];studioTourBank();writeConnected().guided={id:id(),sid:s.id,tid:t.id,step,minutes:25,startedAt:Date.now(),recall:'Exemplo local: tento lembrar antes de consultar.',reflection:'Retomar as lacunas.',questions:clone(studio().bank.slice(0,1)),choices:[0],grades:[null]};render()}
tourAreas.jornada={label:'Sessão guiada',caption:'Lembrar, praticar, conferir e registrar',steps:[
 tStep('.guided-track','Um caminho que você pode interromper.','A sessão fica salva neste aparelho quando você sai.',{onEnter:()=>guidedTourStep(0)}),
 tStep('#guided-recall','Lembre antes de consultar.','Escreva com suas palavras. A anotação não é enviada à IA.',{onEnter:()=>guidedTourStep(1)}),
 tStep('.guided-question','Pratique o assunto escolhido.','Até cinco perguntas do banco aparecem nesta etapa.',{onEnter:()=>guidedTourStep(2)}),
 tStep('#guided-reflection','Confira o que faltou.','Compare com a referência e anote a próxima dúvida.',{onEnter:()=>guidedTourStep(3)}),
 tStep('[data-action="guided-register"]','Finalize com intenção.','Confira o tempo antes de registrar. Ou crie um cartão e marque uma revisão.',{onEnter:()=>guidedTourStep(4),observeOnly:true})
]};
tourAreas.assuntos.steps[0].body='Abra o assunto para reunir notas, materiais, cartões, questões e chats explicitamente vinculados.';
tourAreas.assuntos.steps[1].body='As anotações são salvas automaticamente neste aparelho. Espere o indicador de salvamento; selecione o texto que quiser enviar à IA.';
tourAreas.ajustes.steps.push(tStep('[data-action="local-restore"]','Uma recuperação local complementar.','Confira a cópia diária antes de restaurar. Ela não sobrevive à limpeza do navegador. O backup manual continua essencial.',{observeOnly:true}));
tourAreas.intro={label:'Primeiros passos',caption:'O caminho essencial em cinco passos',steps:[
 tStep('.sidebar','Seu espaço de estudos.','Organize matérias, pratique e acompanhe. Esta demonstração usa dados temporários.',{route:'hoje',onEnter:()=>setSidebarOpen(true)}),
 tStep('[data-action="subject-new"]','Reúna as matérias e assuntos.','Comece pelo que você quer aprender. Cada matéria pode ter vários assuntos.',{route:'edital',observeOnly:true}),
 tStep('#connected-start','Escolha um bloco possível.','A sessão guiada ajuda a lembrar, praticar e conferir.',{route:'hoje'}),
 tStep('.practice-subnav','Pratique e volte às dúvidas.','Guarde perguntas no banco, retome os erros e compare seus treinos.',{route:'banco',onEnter:()=>{delete writeStudio().draft;studioTourBank()}}),
 tStep('.toolbar [data-action="session"]','Veja seu progresso real.','Registre tempo e resultados depois de estudar. Explore o tutorial de cada área quando precisar.',{route:'historico',observeOnly:true})
]};
const hubBeforeRefreshed=viewTourHub;viewTourHub=function(){return `<section class="panel short-tour-card"><div><span class="tag blue">COMECE AQUI</span><h2>Cinco passos para encontrar seu caminho.</h2><p>Uma introdução curta, seguida dos tutoriais de cada área.</p></div>${btn('Começar em cinco passos','tour-start','data-area="intro"','primary')}</section>`+hubBeforeRefreshed()};
guideInvitation=function(){return tourProgress.completed.includes('intro')?'':`<aside class="guide-invitation"><div><h2>Seu primeiro estudo começa aqui.</h2><p>Conheça o essencial em cinco passos nas telas reais.</p></div><div class="actions">${btn('Primeiros passos','tour-start','data-area="intro"','primary small')}${btn('Todos os tutoriais','guide-open','','quiet small')}</div></aside>`};
const validityBeforeQuestionEvidence=aiValidResult;
aiValidResult=function(mode,result,count=3){return validityBeforeQuestionEvidence(mode,result,count)&&(mode!=='quiz'||result.questions.every(q=>q.quote===undefined||typeof q.quote==='string'&&q.quote.length<=600))};
const panelBeforeAvailability=tutorPanel;tutorPanel=function(){const html=panelBeforeAvailability();if(!html)return html;const text=aiBusy?'Aguardando resposta':aiError?'Último pedido indisponível':tutorRemaining===0?'Cota compartilhada esgotada':tutorRemaining!==null?tutorRemaining+' pedidos na cota compartilhada (última consulta)':'A disponibilidade será conferida ao enviar';return html.replace('<section class="panel tutor-workbench" id="tutor-workbench">','<section class="panel tutor-workbench" id="tutor-workbench"><p class="norbit-availability" role="status"><span aria-hidden="true">●</span> '+esc(text)+'</p>')};
const validateBeforeChatContext=validateBackup;
validateBackup=function(data){validateBeforeChatContext(data);for(const c of data.aiChats||[])for(const row of [c,...c.messages]){const s=row.study;if(!s)continue;if(typeof s!=='object'||Array.isArray(s)||['subjectId','topicId','sourceId'].some(k=>s[k]!==null&&(typeof s[k]!=='string'||s[k].length>150))||typeof s.inlineSource!=='string'||s.inlineSource.length>8000||!['standard','simple','example','calculation','deep'].includes(s.depth)||!tutorTools.some(t=>t[0]===s.tool))throw Error('Contexto de conversa inválido no backup.')}for(const e of data.exams){const g=connected(e).guided;if(g&&(!Number.isFinite(g.minutes)||!num(g.minutes,10,45)||g.startedAt<0||g.choices.some((c,i)=>!choiceValid(g.questions[i],c))||g.grades.length!==g.questions.length))throw Error('Respostas da sessão guiada inválidas.')}return true};
document.addEventListener('visibilitychange',()=>{practiceTimeFlush();persist();practiceOpenedAt=document.hidden||route!=='banco'||!studio().draft?0:Date.now()});
let norbitPreparation=db.activeExam;const renderBeforePreparationContext=render;render=function(){if(!tour&&norbitPreparation!==db.activeExam){flushNote();norbitPreparation=db.activeExam;norbitSubject='';norbitTopic='';norbitDepth='standard';norbitInlineSource='';tutorSource='';tutorRemaining=null;bankNotebook='';bankDueOnly=false;practiceResultId=null;studyTopicId=null;studySubjectId=null;}return renderBeforePreparationContext()};
if(tourProgress.version!==4){tourProgress={area:'intro',index:0,completed:[],version:4};tourSave()}
try{validateBackup(db)}catch(e){storageProblem=e.message+' Exporte seus dados antes de fazer alterações.'}

