# Norte — Seu espaço de estudos

Um painel pessoal para organizar a preparação para concursos, acompanhar o aprendizado e transformar o edital em uma rotina de estudo.

**[Abrir o site](https://norte-estudos.jv71.chatgpt.site)** · **[Guia de uso](docs/guia.md)**

![Painel Norte no computador](docs/desktop.png)

## Funcionalidades

- Visão do dia com metas, tarefas e revisões.
- Planejamento conforme disponibilidade, prioridades e desempenho.
- Organização do edital por disciplinas e assuntos.
- Sessões de foco com cronômetro e registro de estudo.
- Questões, caderno de erros e simulados.
- Revisões espaçadas e cartões de memória.
- Evolução, biblioteca e histórico.
- Múltiplas preparações, busca e aparência clara ou escura.
- Backup em JSON, importação e exportação de registros em CSV.
- Interface adaptada a computadores e celulares.

## Usar no computador

Baixe o projeto e abra `index.html` no navegador. O arquivo contém o aplicativo completo e funciona offline, sem instalar dependências.

## Dados de estudo

Os registros são salvos no armazenamento local do navegador (`norte.study.v1`). Cada navegador e aparelho tem seus próprios dados. Use o backup em **Ajustes** para transferir a preparação ou protegê-la antes de limpar os dados do navegador. O aplicativo não sincroniza dados entre aparelhos e não envia seus registros para um servidor.

## Desenvolver

O projeto usa HTML, CSS e JavaScript, sem bibliotecas externas. Para alterar o aplicativo, edite os arquivos de `src/`. Com Node.js instalado, execute:

```sh
npm run check
npm run build
```

O comando de build gera o `index.html` completo. Não é necessário executar `npm install`.

```text
index.html                 Aplicativo completo, pronto para abrir ou hospedar
src/index.template.html    Estrutura da página
src/styles.css             Estilos e responsividade
src/app.js                 Interface e regras de estudo
scripts/build.mjs          Geração do HTML completo
docs/                      Guia e imagens
```

## Hospedar

Publique o `index.html` em uma hospedagem de sites estáticos. O aplicativo não precisa de servidor de aplicação, banco de dados ou chave de API. Ao mudar de endereço, exporte seus dados no site antigo e importe no novo, pois o armazenamento do navegador é separado por endereço.

## Prévia no celular

![Painel Norte no celular](docs/celular.png)
