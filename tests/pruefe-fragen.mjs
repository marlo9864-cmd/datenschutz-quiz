// Prüft das Quiz, bevor es veröffentlicht wird (läuft im GitHub-Workflow, lokal: node tests/pruefe-fragen.mjs).
//  1. web/js/fragen.js: Aufbau jeder Aufgabe, gültige Lösungsnummern, keine doppelten Aufgaben,
//     geschlossene <b>/<mark>-Auszeichnungen, Merkzettel vollständig
//  2. web/js/quiz.js und web/sw.js: Syntax
//  3. Offline-Liste in web/sw.js: jede Datei existiert, und jede Datei aus web/ steht in der Liste
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const WEB = join(ROOT, 'web');
const errors = [];
const fail = (msg) => errors.push(msg);

// ---------------------------------------------------------------- 1. Fragen
const sandbox = {};
try {
  vm.runInNewContext(readFileSync(join(WEB, 'js', 'fragen.js'), 'utf8'), sandbox, { filename: 'fragen.js' });
} catch (e) {
  console.error('web/js/fragen.js lässt sich nicht ausführen:\n' + e.message);
  process.exit(1);
}
const data = sandbox.QUIZ_DATA;
const isText = (t) => typeof t === 'string' && t.trim().length > 0;

function checkMarkup(text, where) {
  for (const tag of ['b', 'mark', 'strong']) {
    const open = (text.match(new RegExp('<' + tag + '>', 'g')) || []).length;
    const close = (text.match(new RegExp('</' + tag + '>', 'g')) || []).length;
    if (open !== close) fail(`${where}: <${tag}> ${open}× geöffnet, ${close}× geschlossen`);
  }
  const unknown = (text.match(/<\/?([a-z]+)[^>]*>/gi) || [])
    .map((t) => t.replace(/[<>/]/g, '').split(/\s/)[0].toLowerCase())
    .filter((t) => !['b', 'mark', 'strong', 'br'].includes(t));
  if (unknown.length) fail(`${where}: unbekannte Auszeichnung <${unknown[0]}>`);
}

let total = 0;
if (!data || !Array.isArray(data.kapitel) || data.kapitel.length === 0) {
  fail('QUIZ_DATA.kapitel fehlt oder ist leer');
} else {
  const seen = new Set();
  for (const k of data.kapitel) {
    const kw = `Kapitel ${k.nr}`;
    if (!Number.isInteger(k.nr)) fail(`${kw}: "nr" muss eine ganze Zahl sein`);
    if (!isText(k.titel)) fail(`${kw}: "titel" fehlt`);
    if (!isText(k.bereich)) fail(`${kw}: "bereich" fehlt`);
    if (!Array.isArray(k.fragen) || k.fragen.length === 0) { fail(`${kw}: keine Fragen`); continue; }
    for (const f of k.fragen) {
      total++;
      const w = `Kapitel ${k.nr}, Aufgabe ${f.nr}`;
      const id = `${k.nr}-${f.nr}`;
      if (!Number.isInteger(f.nr)) fail(`${w}: "nr" muss eine ganze Zahl sein`);
      if (seen.has(id)) fail(`${w}: doppelt vorhanden`);
      seen.add(id);
      if (f.sachverhalt !== undefined && (!Array.isArray(f.sachverhalt) || !f.sachverhalt.every(isText))) {
        fail(`${w}: "sachverhalt" muss eine Liste von Absätzen sein`);
      }
      if (!isText(f.frage)) fail(`${w}: "frage" fehlt`);
      if (!Array.isArray(f.antworten) || f.antworten.length < 2 || f.antworten.length > 8 || !f.antworten.every(isText)) {
        fail(`${w}: "antworten" braucht 2 bis 8 Texte`);
        continue;
      }
      const n = f.antworten.length;
      if (!Array.isArray(f.loesung) || f.loesung.length === 0) fail(`${w}: "loesung" ist leer`);
      else {
        if (!f.loesung.every((x) => Number.isInteger(x) && x >= 1 && x <= n)) fail(`${w}: "loesung" enthält Nummern außerhalb von 1–${n}`);
        if (new Set(f.loesung).size !== f.loesung.length) fail(`${w}: "loesung" enthält eine Nummer doppelt`);
      }
      if (typeof f.negativ !== 'boolean') fail(`${w}: "negativ" muss true oder false sein`);
      if (!isText(f.begruendung)) fail(`${w}: "begruendung" fehlt`);
      for (const t of [...(f.sachverhalt || []), f.frage, ...f.antworten, f.begruendung]) {
        if (typeof t === 'string') checkMarkup(t, w);
      }
    }
  }
  const m = data.merkzettel;
  if (m) {
    const rows = (key, len) => {
      if (!Array.isArray(m[key]) || !m[key].every((r) => Array.isArray(r) && r.length === len && r.every(isText))) {
        fail(`Merkzettel: "${key}" muss Zeilen mit je ${len} Texten enthalten`);
      } else m[key].forEach((r) => r.forEach((t) => checkMarkup(t, `Merkzettel/${key}`)));
    };
    rows('fristen', 2);
    rows('begriffe', 3);
    rows('verwechslungen', 2);
    if (m.tipp !== undefined && !isText(m.tipp)) fail('Merkzettel: "tipp" ist leer');
  }
  if (data.pdf !== undefined && !existsSync(join(WEB, data.pdf))) fail(`PDF "${data.pdf}" fehlt in web/`);
}

// ---------------------------------------------------------------- 2. Syntax
for (const file of ['js/quiz.js', 'sw.js']) {
  try {
    new vm.Script(readFileSync(join(WEB, file), 'utf8'), { filename: file });
  } catch (e) {
    fail(`web/${file}: ${e.message}`);
  }
}

// ---------------------------------------------------------------- 3. Offline-Liste
const sw = readFileSync(join(WEB, 'sw.js'), 'utf8');
const listMatch = sw.match(/const FILES = \[([\s\S]*?)\];/);
if (!listMatch) fail('web/sw.js: Liste FILES nicht gefunden');
else {
  const listed = [...listMatch[1].matchAll(/'([^']+)'/g)].map((x) => x[1]);
  for (const f of listed) {
    if (f === './') continue;
    if (!existsSync(join(WEB, f))) fail(`web/sw.js: "${f}" steht in FILES, existiert aber nicht`);
  }
  const walk = (dir) => readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
  for (const p of walk(WEB)) {
    const rel = './' + relative(WEB, p).split(sep).join('/');
    if (rel === './sw.js' || rel.endsWith('.txt') || rel.endsWith('/.nojekyll')) continue;
    if (!listed.includes(rel)) fail(`web/sw.js: "${rel}" fehlt in FILES (sonst offline nicht verfügbar)`);
  }
}

// ---------------------------------------------------------------- Ergebnis
if (errors.length) {
  console.error(`${errors.length} Problem(e) gefunden:\n- ` + errors.join('\n- '));
  process.exit(1);
}
const kap = data.kapitel.map((k) => `Kapitel ${k.nr}: ${k.fragen.length}`).join(', ');
console.log(`OK – ${total} Aufgaben geprüft (${kap}), Skripte und Offline-Liste in Ordnung.`);
