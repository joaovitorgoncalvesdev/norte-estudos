import { readFile, writeFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const [template, css, js, favicon, aiJS, aiCSS] = await Promise.all([
  readFile(new URL('src/index.template.html', root), 'utf8'),
  readFile(new URL('src/styles.css', root), 'utf8'),
  readFile(new URL('src/app.js', root), 'utf8'),
  readFile(new URL('favicon.svg', root), 'utf8'),
  readFile(new URL('src/ai.js', root), 'utf8'),
  readFile(new URL('src/ai.css', root), 'utf8'),
]);
if (!template.includes('/* STYLES */') || !template.includes('/* SCRIPT */')) {
  throw new Error('Marcadores de CSS ou JavaScript ausentes no template.');
}
const bundledJS = js.replace("go(location.hash.slice(1)||'hoje');", () => aiJS + "\ngo(location.hash.slice(1)||'hoje');");
const html = template.replace('/* STYLES */', () => css+'\n'+aiCSS).replace('/* SCRIPT */', () => bundledJS).replace('__FAVICON__', () => 'data:image/svg+xml,' + encodeURIComponent(favicon.replace(/\r\n/g, '\n')));
await writeFile(new URL('index.html', root), html, 'utf8');
console.log('index.html atualizado.');
