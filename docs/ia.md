# NORBIT AI no Norte

O menu **NORBIT AI** oferece explicações de dificuldades, quatro cartões editáveis e de uma a dez questões inéditas por pedido. Em **Questões e erros**, o botão **Entender com IA** leva a dificuldade para o assistente; confira o texto antes de enviar.

1. Escolha a ferramenta e escreva sua dúvida. A primeira mensagem aceita de 20 a 8.000 caracteres; respostas seguintes podem ser curtas.
2. Clique em **Enviar**. O aviso explica o envio do texto e do histórico recente; o resumo da preparação é opcional.
3. Se aparecer a verificação humana, conclua-a. O pedido seguirá automaticamente.
4. Confira o resultado no material original. Nos cartões, edite, selecione uma matéria e salve apenas os cartões desejados.

Os exercícios gerados são treino informal e não entram nas estatísticas. As respostas concluídas ficam salvas no chat mesmo depois de recarregar; um pedido ainda em andamento pode ser interrompido ao fechar a página. Seus registros e backups continuam neste navegador.

## Questões de treino

Escolha de **1 a 10 questões** e a dificuldade **Fácil, Médio ou Difícil** antes de enviar. O nível altera o tipo de raciocínio pedido; a quantidade escolhida é validada no servidor. As questões aparecem uma por vez. Marque uma alternativa e clique em **Responder questão**. A NORBIT mostra se acertou ou errou, destaca a alternativa correta e explica o raciocínio. **Entenda cada alternativa** abre as justificativas das quatro opções. A dica final ajuda a reconhecer a regra em outro exercício.

Use os botões de questão ou **Anterior / Próxima** para navegar. Ao responder a todas as questões, aparece o total de acertos. **Recomeçar este treino** permite tentar as mesmas questões novamente, sem gastar outro pedido à IA. O treino fica salvo na conversa, sem alterar as estatísticas de estudo.

## Interface e atalhos

A NORBIT tem uma interface de conversa, sugestões de estudo, campo de texto e respostas organizadas. A bolha com o símbolo da NORBIT abre a IA em todas as áreas. Use **Ctrl + Enter** (ou **Command + Enter**) para enviar. **Nova conversa** abre um novo assunto; mantém os chats anteriores e os cartões salvos.

As animações acompanham os estados de envio e resposta, com versões para movimento reduzido. A aparência acompanha o tema claro ou escuro do painel. Privacidade e limites ficam disponíveis no rodapé do campo de envio.

## Contexto da preparação

Ative **Usar minha preparação como contexto** para personalizar a resposta. O resumo inclui a preparação ativa, até 8 prazos em aberto, cargo, banca, data da prova, metas, até 15 matérias com progresso, resultados agregados dos últimos 7 dias, até 12 atividades dos próximos 7 dias e 3 prioridades calculadas pelo painel.

**Conferir o contexto que será enviado** mostra o resumo antes do envio. O aviso passa a incluir texto, histórico recente e contexto. Sem essa opção, apenas texto e histórico recente daquele chat são enviados. Anotações dos registros, links de materiais, nome pessoal e backups não entram no resumo. Ao trocar a preparação, o resumo é atualizado. O servidor processa o contexto no pedido e não o armazena.

O contexto orienta a linguagem e os próximos passos; ele não altera metas ou atividades e não substitui o material usado para criar as questões. Cada navegador usa seus próprios registros locais.

## Hospedagem e proteção

- Interface: GitHub Pages.
- API: Cloudflare Worker `norte-gemini`, arquivo `worker/index.js`.
- Chave pública do Turnstile e endereço da API: `src/ai.js`.
- Segredos no Cloudflare: `GEMINI_API_KEY` e `TURNSTILE_SECRET`. Nunca cadastrar como texto simples nem colocar no GitHub.
- Modelo configurável pela variável `GEMINI_MODEL`; inicialmente `gemini-3.5-flash-lite`.
- Cota global persistente e atômica: 30 tentativas por dia, 6 por minuto. Por endereço de rede: 10 por dia e 2 por minuto. Reinício diário à meia-noite UTC. Redes compartilhadas dividem a cota por endereço.
- Tentativas reservadas antes de chamar o Gemini também contam em falhas; isso impede repetição de pedidos que ainda possam ser cobrados.
- Turnstile validado no servidor, com hostname e ação, antes de usar a cota do Gemini.
- CORS restrito ao domínio GitHub Pages; CORS não substitui Turnstile ou as cotas.
- Nenhum texto de estudo é armazenado no Worker. Apenas contadores e hashes do endereço de rede são persistidos para limitar abuso. Google e Cloudflare processam o conteúdo conforme seus próprios termos.
- A IA precisa de internet. O painel de estudos permanece disponível sem a IA.

O teto de pedidos reduz exposição a uso excessivo; não é uma garantia de custo monetário fixo. Custos e cotas do Gemini dependem da conta e do modelo no Google AI Studio. Não habilitar faturamento sem revisar os limites e o uso.

## Manutenção

Para compilar a interface: `npm run build`. Para publicar a API usando a ferramenta oficial: `npx wrangler deploy --config worker/wrangler.jsonc`. As credenciais são cadastradas diretamente em **Workers & Pages → norte-gemini → Settings → Variables and Secrets**.

O segredo do Turnstile corresponde ao widget **Norte · Assistente Gemini**, autorizado para `joaovitorgoncalvesdev.github.io`. Se mudar o domínio, atualizar hostname do widget, origem permitida e verificação de hostname no Worker.

Se uma chave for exposta em uma conversa, arquivo ou repositório, revogue-a no provedor e cadastre outra diretamente no serviço. Atualizar `src/ai.js` nunca é necessário para trocar a chave do Gemini.


## Conversas salvas e cartões com movimento
Na NORBIT AI, cada primeira mensagem abre uma conversa por assunto. Use Conversas no celular ou a lista lateral no computador para buscar e reabrir um chat. Você pode renomear, excluir e desfazer a exclusão. Os chats ficam neste navegador, separados por preparação, e entram no backup exportado; não são sincronizados entre aparelhos.

Responda normalmente às perguntas do tutor: o histórico recente é enviado com a nova mensagem, mantendo o assunto. Até 12 mensagens recentes, com limite de tamanho, são usadas como contexto; detalhes antigos de chats muito longos podem ficar de fora. Confira as respostas no seu material.

Não há caixa de autorização: clicar em Enviar autoriza o envio da mensagem e do histórico recente daquele chat. O resumo da preparação continua opcional. A verificação humana só aparece quando você pede uma resposta, e o envio segue automaticamente depois que ela termina. Você pode cancelar enquanto verifica. As cotas existentes continuam valendo.

Nos flashcards, clique ou use espaço para virar. O movimento pode ser invertido antes de terminar, e a próxima pergunta entra suavemente. Com movimento reduzido, a troca é estática. Os intervalos agora consideram a avaliação, o histórico de lembrança e o desempenho recente.

## Ferramentas e qualidade das respostas

A NORBIT organiza explicações em ideia principal, raciocínio, exemplo, confusões frequentes e pergunta de recuperação. As ferramentas incluem diagnóstico por lote, avaliação da própria explicação, três pistas graduais, missão de estudo, organização de notas, comparação, revisão de cartões e orientação semanal. Elas sugerem ações; não alteram automaticamente o planejamento.

Uma referência opcional envia até 8.000 caracteres das notas do material selecionado. URLs externas não são lidas automaticamente. A API distingue explicação geral, resposta baseada na fonte e fonte insuficiente; verifica se a citação pertence ao texto recebido e recusa formatos incompletos. Essas verificações não garantem a correção de todo o conteúdo: confira interpretações, cálculos, gabaritos e fatos no material.

Respostas são guardadas por preparação, até 20 itens, e podem ser reabertas sem chamadas. Pedidos iguais, com o mesmo contexto, histórico e referência, podem reutilizar o resultado local. Revelar pistas e marcar passos não usa a API.

Além das cotas de pedidos, há reserva diária de unidades estimadas de texto, padrão de 150.000, configurável em AI_DAILY_TOKEN_BUDGET. A reserva inclui entrada, contexto, histórico, referência e teto de saída. É uma proteção adicional da aplicação, não a contagem real de tokens do Google nem garantia de custo. A explicação tem teto de 2.600 tokens de saída; as questões usam teto proporcional à quantidade. Não há repetição automática de resposta inválida.
