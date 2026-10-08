# NORBIT AI no Norte

O menu **NORBIT AI** oferece explicações de dificuldades, quatro cartões editáveis e de uma a dez questões inéditas por pedido. Em **Questões e erros**, o botão **Entender com IA** leva a dificuldade para o assistente; confira o texto antes de enviar.

1. Escolha a ferramenta e cole de 20 a 8.000 caracteres.
2. Autorize o envio apenas desse trecho ao Google e ao Cloudflare.
3. Aguarde a verificação de segurança e clique em **Enviar**.
4. Confira o resultado no material original. Nos cartões, edite, selecione uma matéria e salve apenas os cartões desejados.

Os exercícios gerados são treino informal e não entram nas estatísticas. Fechar ou recarregar a página descarta a resposta que ainda não foi salva. Seus registros e backups continuam neste navegador.

## Questões de treino

Escolha de **1 a 10 questões** e a dificuldade **Fácil, Médio ou Difícil** antes de enviar. O nível altera o tipo de raciocínio pedido; a quantidade escolhida é validada no servidor. As questões aparecem uma por vez. Marque uma alternativa e clique em **Responder questão**. A NORBIT mostra se acertou ou errou, destaca a alternativa correta e explica o raciocínio. **Entenda cada alternativa** abre as justificativas das quatro opções. A dica final ajuda a reconhecer a regra em outro exercício.

Use os botões de questão ou **Anterior / Próxima** para navegar. Ao responder a todas as questões, aparece o total de acertos. **Recomeçar este treino** permite tentar as mesmas questões novamente, sem gastar outro pedido à IA. O resultado permanece apenas nesta sessão, sem alterar as estatísticas de estudo.

## Interface e atalhos

A NORBIT tem uma interface de conversa, sugestões de estudo, campo de texto e respostas organizadas. A bolha com o símbolo da NORBIT abre a IA em todas as áreas. Use **Ctrl + Enter** (ou **Command + Enter**) para enviar após autorizar e concluir a verificação. **Nova conversa** limpa o texto e a resposta desta sessão; não apaga cartões salvos.

As animações acompanham os estados de envio e resposta, com versões para movimento reduzido. A aparência acompanha o tema claro ou escuro do painel. Privacidade e limites ficam disponíveis no rodapé do campo de envio.

## Contexto da preparação

Ative **Usar minha preparação como contexto** para personalizar a resposta. O resumo inclui objetivo, momento, curso/área, etapa, base declarada, ajuda desejada e preferência de prática do espaço ativo; até 8 prazos em aberto; cargo e banca quando for concurso; data-alvo, metas, até 15 matérias com progresso, resultados agregados dos últimos 7 dias, até 12 atividades dos próximos 7 dias e 3 prioridades calculadas pelo painel.

**Conferir o contexto que será enviado** mostra o resumo antes do envio. O consentimento passa a incluir texto e contexto. Sem essa opção, apenas o texto é enviado. Anotações dos registros, links de materiais, nome pessoal e backups não entram no resumo. Ao trocar a preparação, o resumo é atualizado. O servidor processa o contexto no pedido e não o armazena.

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
