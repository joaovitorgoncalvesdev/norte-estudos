import { readFile, writeFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const [template, css, js] = await Promise.all([
  readFile(new URL('src/index.template.html', root), 'utf8'),
  readFile(new URL('src/styles.css', root), 'utf8'),
  readFile(new URL('src/app.js', root), 'utf8'),
]);
if (!template.includes('/* STYLES */') || !template.includes('/* SCRIPT */')) {
  throw new Error('Marcadores de CSS ou JavaScript ausentes no template.');
}
const html = template.replace('/* STYLES */', () => css).replace('/* SCRIPT */', () => js);
await writeFile(new URL('index.html', root), html, 'utf8');
console.log('index.html atualizado.');
