import { readFile, writeFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const modules = ['study-tools','practice','tutor-tools','studio-tour','arrival-bank','learning','advanced-bank','import-mapping','norbit-context','refreshed-tour'];
const extraJS = (await Promise.all(modules.map(name=>readFile(new URL('src/'+name+'.js',root),'utf8')))).join('\n');
const extraCSS = (await Promise.all(['studio','arrival-bank','connected'].map(name=>readFile(new URL('src/'+name+'.css',root),'utf8')))).join('\n');
const [template, css, js, favicon, aiJS, aiCSS, timerJS, timerCSS, profileJS, profileCSS, mascot, chatJS, motionJS, chatCSS, siteMotionJS, siteMotionCSS, enhancementsJS, enhancementsCSS] = await Promise.all([
  readFile(new URL('src/index.template.html', root), 'utf8'),
  readFile(new URL('src/styles.css', root), 'utf8'),
  readFile(new URL('src/app.js', root), 'utf8'),
  readFile(new URL('favicon.svg', root), 'utf8'),
  readFile(new URL('src/ai.js', root), 'utf8'),
  readFile(new URL('src/ai.css', root), 'utf8'),
  readFile(new URL('src/timer.js', root), 'utf8'),
  readFile(new URL('src/timer.css', root), 'utf8'),
  readFile(new URL('src/profile.js', root), 'utf8'),
  readFile(new URL('src/profile.css', root), 'utf8'),
  readFile(new URL('assets/norbit.webp', root)),
  readFile(new URL('src/chats.js', root), 'utf8'),
  readFile(new URL('src/card-motion.js', root), 'utf8'),
  readFile(new URL('src/chats.css', root), 'utf8'),
  readFile(new URL('src/motion.js', root), 'utf8'),
  readFile(new URL('src/motion.css', root), 'utf8'),
  readFile(new URL('src/enhancements.js', root), 'utf8'),
  readFile(new URL('src/enhancements.css', root), 'utf8'),
]);
if (!template.includes('/* STYLES */') || !template.includes('/* SCRIPT */')) {
  throw new Error('Marcadores de CSS ou JavaScript ausentes no template.');
}
const bundledJS = js.replace("go(location.hash.slice(1)||'hoje');", () => aiJS + "\n" + timerJS + "\n" + profileJS.replace('__NORBIT_MASCOT__','data:image/webp;base64,'+mascot.toString('base64')) + "\n" + chatJS + "\n" + motionJS + "\n" + siteMotionJS + "\n" + enhancementsJS + "\n" + extraJS + "\ngo(location.hash.slice(1)||'hoje');");
const html = template.replace('/* STYLES */', () => css+'\n'+aiCSS+'\n'+timerCSS+'\n'+profileCSS+'\n'+chatCSS+'\n'+siteMotionCSS+'\n'+enhancementsCSS+'\n'+extraCSS).replace('/* SCRIPT */', () => bundledJS).replace('__FAVICON__', () => 'data:image/svg+xml,' + encodeURIComponent(favicon.replace(/\r\n/g, '\n')));
await writeFile(new URL('index.html', root), html, 'utf8');
console.log('index.html atualizado.');
