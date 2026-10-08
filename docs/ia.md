# Assistente Gemini no Norte

O menu **Assistente de IA** oferece explicações de dificuldades, quatro cartões editáveis e três questões inéditas por pedido. Em **Questões e erros**, o botão **Entender com IA** leva a dificuldade para o assistente; confira o texto antes de enviar.

1. Escolha a ferramenta e cole de 20 a 8.000 caracteres.
2. Autorize o envio apenas desse trecho ao Google Gemini e ao Cloudflare.
3. Aguarde a verificação de segurança e clique em **Gerar com Gemini**.
4. Confira o resultado no material original. Nos cartões, edite, selecione uma matéria e salve apenas os cartões desejados.

Os exercícios gerados são treino informal e não entram nas estatísticas. Fechar ou recarregar a página descarta a resposta que ainda não foi salva. Seus registros e backups continuam neste navegador.

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
