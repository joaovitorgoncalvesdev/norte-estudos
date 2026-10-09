/* Every new workflow has a local demonstration; no API quota is consumed. */
function studioDemoQuestion(){const s=exam().subjects[0],t=s.topics[0];return {id:id(),subjectId:s.id,topicId:t.id,prompt:'Na recuperação ativa, qual é o primeiro passo?',options:['Tentar lembrar sem consultar','Copiar o resumo completo','Reler imediatamente','Evitar conferir o resultado'],answer:0,explanation:'Tente recuperar de memória. Depois consulte a fonte, corrija as lacunas e programe uma nova prática. Exemplo local do tutorial.',difficulty:'easy',source:'Demonstração local'}}
function studioTourBank(){if(!studio().bank.length)writeStudio().bank.push(studioDemoQuestion());practiceResultId=null;bankSubject='';bankTopic='';bankOnlyWrong=false;bankDifficulty='all';bankOrigin='all';render()}
function studioTourDraft(){studioTourBank();if(!studio().draft)writeStudio().draft={id:id(),title:'Treino de prática',date:today(),minutes:0,questions:clone(studio().bank.slice(0,1)),choices:[null],flags:[],startedAt:Date.now(),limitSeconds:1800};practiceIndex=0;render()}
function studioTourResult(){studioTourDraft();writeStudio().draft.choices[0]=0;completePractice();render()}
const captureBeforeStudio=studyTourCapture;
studyTourCapture=function(){return {...captureBeforeStudio(),studioState:{studyTopicId,studySubjectId,concentration,bankSubject,bankTopic,bankDifficulty,bankOrigin,bankOnlyWrong,practiceIndex,practiceResultId,tutorTool,tutorSource,tutorRemaining,tutorHintsShown,tutorMissionDone:clone(tutorMissionDone),tutorCacheHit,quickMinutes}}};
const restoreBeforeStudio=studyTourRestore;
studyTourRestore=function(state){restoreBeforeStudio(state);if(state?.studioState)({studyTopicId,studySubjectId,concentration,bankSubject,bankTopic,bankDifficulty,bankOrigin,bankOnlyWrong,practiceIndex,practiceResultId,tutorTool,tutorSource,tutorRemaining,tutorHintsShown,tutorMissionDone,tutorCacheHit,quickMinutes}=state.studioState)};
tourAreas.hoje.steps.push(
 tStep('#quick-start','Uma fila conecta seus estudos.','Fora do tutorial, o painel Hoje reúne cartões, revisões, erros e assuntos em uma sequência. O tempo escolhido limita a fila; iniciar não registra resultados sozinho.'),
 tStep('.sidebar-bottom [data-action="theme"]','Um painel com suas prioridades.','Em Hoje, Personalizar painel permite mostrar, esconder e mover blocos com botões. Revisões mantém a fila acessível, mesmo se você esconder o bloco.',{onEnter:()=>setSidebarOpen(true)})
);
tourAreas.assuntos={label:'Meus assuntos',caption:'Materiais, notas, prática e histórico',steps:[
 tStep('[data-action="topic-hub"]','Tudo relacionado ao assunto.','Abra um assunto. Esta página reúne notas, materiais vinculados, erros, cartões, estudos e conversas que mencionam seu nome.',{click:'topic'}),
 tStep('#topic-notes','Explique com suas palavras.','Salve notas locais. Criar cartão desta nota abre uma pergunta e resposta editáveis. Notas não são enviadas à IA automaticamente.',{prepare:()=>{studySubjectId=exam().subjects[0].id;studyTopicId=exam().subjects[0].topics[0].id;render()}}),
 tStep('[data-action="bank-topic"]','Pratique aquele assunto.','O banco abre com a matéria e o assunto selecionados. Você pode montar um treino das questões vinculadas.',{observeOnly:true}),
 tStep('[data-action="topic-tutor"]','Continue com uma dúvida específica.','Conversar sobre o assunto prepara uma mensagem com a nota escolhida. Revise antes de enviar. O tutorial não faz pedidos externos.',{observeOnly:true})
]};
tourAreas.plano.steps.push(tStep('[data-action="plan-recover"]','Retome atividades atrasadas.','Reorganizar atrasadas encontra horários livres para os próximos sete dias. Confira a prévia; atividades que não couberem permanecem pendentes. Aplicar permite desfazer.',{observeOnly:true}));
tourAreas.foco.steps.push(
 tStep('#focus-workspace','Material e notas durante o foco.','O espaço de concentração reúne materiais ligados ao assunto e uma anotação local. Salvar anotação não registra tempo.'),
 tStep('[data-action="concentration-toggle"]','Menos distrações para estudar.','Modo concentração recolhe o menu. O mesmo botão permite sair, e mudar para outra área restaura a navegação.',{click:'concentrate'}),
 tStep('[data-action="timer-finish"]','Feche a sessão com um próximo passo.','Ao registrar o cronômetro, escreva o que aprendeu e o que precisa retomar. Você pode abrir a criação de cartão ou agendar revisão para amanhã.',{prepare:()=>{if(!db.timer)tourEnsureTimer();render()},observeOnly:true})
);
tourAreas.revisoes.steps.push(tStep('[data-action="queue-open"]','Memória, revisão e prática juntas.','Minha fila de estudo oferece uma sequência local. A avaliação de lembrança e o desempenho recente ajustam próximos intervalos; isso não prevê sua retenção com certeza.',{click:'open'}));
tourAreas.ajustes.steps.push(tStep('[data-action="export"]','Backup manual, com lembrete.','A preparação registra a data da exportação e lembra depois de sete dias. Não há sincronização automática. Guarde o arquivo fora deste navegador.',{observeOnly:true}));
tourAreas.banco={label:'Banco de questões',caption:'Cadastro, importação e simulado interativo',steps:[
 tStep('[data-action="bank-new"]','Seu banco pessoal.','Crie questões próprias ou salve questões da NORBIT. Origem, dificuldade e assunto ajudam a escolher treinos.',{prepare:studioTourBank,click:'open'}),
 tStep('#modal [name="prompt"]','Enunciado, alternativas e justificativa.','Use quatro alternativas diferentes, uma correta e uma explicação. Confira o gabarito no material antes de salvar.',{prepare:()=>bankEditor(),modal:true}),
 tStep('[data-action="bank-import"]','Importe com prévia.','Cole JSON ou CSV usando o modelo disponível. A prévia valida os campos e remove enunciados repetidos antes de adicionar. Até 100 questões por importação.',{observeOnly:true}),
 tStep('#bank-wrong','Retome os erros de treinos anteriores.','Combine matéria, dificuldade, origem e Somente questões erradas. A opção usa suas respostas dos treinos salvos.',{prepare:studioTourBank}),
 tStep('[data-action="practice-setup"]','Monte um simulado interativo.','Escolha quantidade e tempo. O relógio segue ao sair da tela; o treino permanece neste navegador.',{prepare:studioTourBank,observeOnly:true}),
 tStep('.practice-tabs','Responda e volte às dúvidas.','Navegue entre questões. O gabarito fica escondido até finalizar. Marcar para revisar adiciona um sinal na navegação.',{prepare:studioTourDraft}),
 tStep('[data-action="practice-flag"]','Marque para retomar antes de terminar.','Você pode retirar a marcação. A resposta pode ser alterada enquanto houver tempo.',{prepare:studioTourDraft,click:'flag'}),
 tStep('.practice-correction','Confira o raciocínio.','Após finalizar, cada questão mostra sua resposta, o gabarito e a explicação cadastrada. Você pode criar um cartão ou anotar a dificuldade.',{prepare:studioTourResult}),
 tStep('[data-action="practice-register"]','Registre sem duplicar.','Confira os minutos antes de registrar. O tempo é distribuído entre assuntos; o mesmo resultado só entra uma vez. Desfazer permite corrigir um engano.',{observeOnly:true})
]};
function tutorTourResult(tool){tutorTool=tool;aiMode='explain';aiTourChat=false;aiChatId=null;aiError='';aiResult={explanation:'## Ideia principal\nRecuperar de memória é tentar lembrar antes de consultar.\n\n## Exemplo\nFeche a nota, explique a ideia e depois confira o que faltou. DEMONSTRAÇÃO LOCAL: não houve envio à IA.',basis:'general',quote:'',hints:tool==='hints'?['Pense no que você faz antes de consultar.','Tentar lembrar revela o que ainda falta.','Compare lembrar sozinho com apenas reconhecer um texto.']:[],steps:tool==='mission'?['Explique a ideia sem consultar.','Responda uma pergunta sobre o conceito.','Confira a nota e corrija as lacunas.']:[]};aiExamId=exam().id;tutorHintsShown=0;tutorMissionDone=[];render()}
tourAreas.ia.steps.push(
 tStep('#tutor-workbench','O tutor ajuda de várias formas.','Escolha uma tarefa. Os pedidos continuam protegidos pelo orçamento compartilhado e pela verificação de segurança.',{prepare:()=>{aiResult=null;render()}}),
 tStep('[data-tool="diagnosis"]','Diagnóstico de um lote de erros.','Prepare até oito dificuldades em um pedido. A IA separa observações de hipóteses; não deve inventar causas nem rotular sua capacidade.',{observeOnly:true}),
 tStep('[data-tool="feedback"]','Confira sua própria explicação.','Escreva com suas palavras e selecione uma referência. A NORBIT mostra acertos, lacunas e uma versão mais clara. Sem referência suficiente, deve pedir contexto.',{observeOnly:true}),
 tStep('[data-tool="notes"]','Organize suas anotações.','A NORBIT estrutura conceitos e perguntas usando suas notas, sem completar lacunas com fatos inventados.',{observeOnly:true}),
 tStep('[data-tool="compare"]','Distinga conceitos próximos.','Informe os dois conceitos e escolha o material. Peça diferenças, exemplos e limites da comparação.',{observeOnly:true}),
 tStep('[data-tool="cardcheck"]','Revise um pequeno lote de cartões.','Até seis cartões entram no pedido. As sugestões ajudam a separar ideias e encurtar respostas; confira o conteúdo antes de editar.',{observeOnly:true}),
 tStep('[data-tool="weekly"]','Orientação com seus números.','A mensagem inclui os registros recentes e as metas. A IA sugere ajustes; não modifica horários nem promete resultados.',{observeOnly:true}),
 tStep('#tutor-source','Você escolhe a fonte.','Somente as notas do material selecionado serão enviadas. Um link não é aberto automaticamente. O trecho citado é conferido; isso não garante que toda interpretação esteja correta.'),
 tStep('.tutor-hints','Revele uma pista por vez.','Três pistas são geradas juntas e guardadas. Revelar a próxima não consome chamadas. Tente responder antes de avançar.',{prepare:()=>tutorTourResult('hints')}),
 tStep('.tutor-mission','Execute uma missão localmente.','Marque os passos concluídos. O progresso fica salvo junto ao resultado; marcar passos não adiciona tempo ao histórico.',{prepare:()=>tutorTourResult('mission')}),
 tStep('#tutor-saved','Reutilize sem consumir pedidos.','Resultados novos são guardados nesta preparação. Reabrir não usa a API. Um pedido idêntico, com as mesmas fontes e contexto, também pode ser reutilizado.',{prepare:()=>{aiResult=null;render()}}),
 tStep('[data-action="ai-bank-save"]','Guarde e registre os treinos da IA.','Salvar questões no banco pede o assunto. Depois de responder tudo, Registrar resultado pede o tempo e adiciona o treino uma única vez.',{prepare:()=>{studyAIPractice('quiz');render()},observeOnly:true})
);

