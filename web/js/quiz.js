/* Datenschutz-Quiz – Quiz-Logik ohne Abhängigkeiten.
   Inhalte: js/fragen.js (globalThis.QUIZ_DATA). Fortschritt: localStorage dieses Geräts. */
(() => {
  'use strict';

  const app = document.getElementById('app');
  const topbar = document.getElementById('topbar');
  const bar = document.getElementById('actionbar');
  const DATA = globalThis.QUIZ_DATA;
  if (!DATA || !Array.isArray(DATA.kapitel) || !DATA.kapitel.length) {
    app.innerHTML = '<p class="load-error">Die Fragen konnten nicht geladen werden. Bitte die Seite neu laden.</p>';
    return;
  }

  // Geschützte Leerzeichen, damit „Art. 5“, „z. B.“, „§ 64“ oder „72 Stunden“ nicht auseinanderbrechen
  const NBSP = ' ';
  const nb = t => String(t)
    .replace(/\b(z|u|d)\. (B|a|h)\./g, '$1.' + NBSP + '$2.')
    .replace(/\b(Art|Abs|Nr|lit|Aufg|Kap)\. (?=[\dIVXa-j])/g, '$1.' + NBSP)
    .replace(/(§§?|EG) (?=\d)/g, '$1' + NBSP)
    .replace(/(\d) (Stunden|Jahre|Beschäftigte|Monat)/g, '$1' + NBSP + '$2');

  const KAP = DATA.kapitel.map(k => ({ nr: k.nr, titel: nb(k.titel), bereich: nb(k.bereich) }));
  const QS = [];
  for (const k of DATA.kapitel) {
    for (const f of k.fragen) {
      QS.push({
        id: k.nr + '-' + f.nr,
        kap: k.nr,
        nr: f.nr,
        ctx: (f.sachverhalt || []).map(nb),
        frage: nb(f.frage),
        opts: f.antworten.map(nb),
        key: f.loesung.slice().sort((a, b) => a - b),
        neg: !!f.negativ,
        bg: nb(f.begruendung)
      });
    }
  }
  const BY_ID = Object.fromEntries(QS.map(q => [q.id, q]));
  const LETTERS = 'ABCDEFGH';
  const STORE = 'datenschutz-quiz:v1';
  const reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const kapVon = KAP[0].nr, kapBis = KAP[KAP.length - 1].nr;

  const ICON = {
    check: '<svg class="ico" viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.4l3 3 6-7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    x: '<svg class="ico" viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 4.5l7 7M11.5 4.5l-7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
    back: '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M10 3.5L5.5 8l4.5 4.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  // ---------------------------------------------------------------- Zustand
  const fresh = () => ({ view: 'start', filter: 'all', shuffle: false, run: null, review: null, last: null });
  let state = fresh();
  const FILTERS = ['all', 'wrong'].concat(KAP.map(k => String(k.nr)));

  const validIds = ids => Array.isArray(ids) && ids.length > 0 && ids.every(id => BY_ID[id]);
  const clampIdx = (i, n) => Math.min(Math.max(0, i | 0), n - 1);

  function sanitize(s) {
    const out = fresh();
    if (!s || typeof s !== 'object') return out;
    if (FILTERS.includes(s.filter)) out.filter = s.filter;
    out.shuffle = !!s.shuffle;
    if (s.run && validIds(s.run.ids)) {
      const sel = {}, done = {};
      for (const id of s.run.ids) {
        const raw = s.run.sel && Array.isArray(s.run.sel[id]) ? s.run.sel[id] : [];
        sel[id] = raw.filter(n => Number.isInteger(n) && n >= 1 && n <= BY_ID[id].opts.length);
        if (s.run.done && s.run.done[id]) done[id] = true;
      }
      out.run = { ids: s.run.ids.slice(), idx: clampIdx(s.run.idx, s.run.ids.length), sel, done, finished: !!s.run.finished };
    }
    if (s.review && validIds(s.review.ids)) {
      out.review = { ids: s.review.ids.slice(), idx: clampIdx(s.review.idx, s.review.ids.length), from: s.review.from === 'result' ? 'result' : 'start' };
    }
    if (s.last && typeof s.last.score === 'number' && typeof s.last.total === 'number' && Array.isArray(s.last.wrong)) {
      out.last = { score: s.last.score, total: s.last.total, wrong: s.last.wrong.filter(id => BY_ID[id]) };
    }
    if (['start', 'quiz', 'result', 'review', 'notes'].includes(s.view)) out.view = s.view;
    if (out.view === 'quiz' && (!out.run || out.run.finished)) out.view = 'start';
    if (out.view === 'result' && (!out.run || !out.run.finished)) out.view = 'start';
    if (out.view === 'review' && !out.review) out.view = 'start';
    if (out.filter === 'wrong' && !(out.last && out.last.wrong.length)) out.filter = 'all';
    return out;
  }
  function load() {
    try { const raw = localStorage.getItem(STORE); return raw ? JSON.parse(raw) : null; } catch (e) { return null; }
  }
  function save() {
    try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (e) { /* ohne Speicher läuft das Quiz trotzdem */ }
  }

  // ---------------------------------------------------------------- Logik
  const isRight = (q, sel) => {
    const s = sel || [];
    return s.length === q.key.length && q.key.every(n => s.includes(n));
  };
  function idsFor(filter) {
    if (filter === 'wrong' && state.last && state.last.wrong.length) return state.last.wrong.slice();
    if (filter !== 'all' && filter !== 'wrong') return QS.filter(q => String(q.kap) === filter).map(q => q.id);
    return QS.map(q => q.id);
  }
  function shuffled(list) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function joinLetters(nums) {
    const l = nums.slice().sort((a, b) => a - b).map(n => LETTERS[n - 1]);
    return l.length < 2 ? l.join('') : l.slice(0, -1).join(', ') + ' und ' + l[l.length - 1];
  }
  const ref = q => 'Kap. ' + q.kap + ' · Aufgabe ' + q.nr;
  const plural = (n, one, many) => n + ' ' + (n === 1 ? one : many);
  const runWrong = run => run.ids.filter(id => !isRight(BY_ID[id], run.sel[id]));
  const runRight = run => run.ids.filter(id => run.done[id] && isRight(BY_ID[id], run.sel[id])).length;

  function startRun(ids) {
    const list = state.shuffle ? shuffled(ids) : ids.slice();
    state.run = { ids: list, idx: 0, sel: {}, done: {}, finished: false };
    state.view = 'quiz';
    render(true);
  }
  function finishRun() {
    const run = state.run;
    run.finished = true;
    const wrong = runWrong(run);
    state.last = { score: run.ids.length - wrong.length, total: run.ids.length, wrong };
    if (state.filter === 'wrong' && !wrong.length) state.filter = 'all';
    state.view = 'result';
    render(true);
  }
  function openReview(ids, idx, from) {
    state.review = { ids, idx, from };
    state.view = 'review';
    render(true);
  }

  // ---------------------------------------------------------------- Bausteine
  function hideTopbar() {
    topbar.hidden = true;
    topbar.innerHTML = '';
  }
  function renderTopbar(label, ids, idx, segClass, backAct, backLabel) {
    topbar.hidden = false;
    topbar.innerHTML =
      '<div class="topbar-row">' +
        '<button type="button" class="back" data-act="' + backAct + '">' + ICON.back + '<span>' + backLabel + '</span></button>' +
        '<span class="pos">' + label + ' <strong>' + (idx + 1) + '</strong> / ' + ids.length + '</span>' +
      '</div>' +
      '<div class="track" aria-hidden="true">' + ids.map((id, i) => '<span class="seg ' + segClass(id, i) + '"></span>').join('') + '</div>';
  }

  const questionHead = q =>
    '<p class="q-meta">' + ref(q) + '</p>' +
    q.ctx.map(t => '<p class="q-ctx">' + t + '</p>').join('') +
    '<p class="q-text">' + q.frage + '</p>';

  function optionHTML(q, n, sel, mode) {
    const L = LETTERS[n - 1];
    const isKey = q.key.includes(n);
    const picked = sel.includes(n);
    const text = q.opts[n - 1];
    if (mode === 'pick') {
      return '<button type="button" class="opt" role="checkbox" aria-checked="' + picked + '" data-act="opt" data-n="' + n + '">' +
        '<span class="box" aria-hidden="true">' + ICON.check + '</span><span class="ltr">' + L + '</span>' +
        '<span class="opt-text">' + text + '</span></button>';
    }
    let cls = 'is-idle', icon = '', tag = '';
    if (mode === 'solution') {
      if (isKey) { cls = 'is-key'; icon = ICON.check; tag = q.neg ? 'Ankreuzen · falsche Aussage' : 'Ankreuzen'; }
    } else if (isKey && picked) { cls = 'is-hit'; icon = ICON.check; tag = 'Richtig angekreuzt'; }
    else if (isKey) { cls = 'is-miss'; icon = ICON.check; tag = 'Hätte angekreuzt werden müssen'; }
    else if (picked) { cls = 'is-wrong'; icon = ICON.x; tag = 'Falsch angekreuzt'; }
    return '<div class="opt ' + cls + '" data-n="' + n + '">' +
      '<span class="box" aria-hidden="true">' + icon + '</span><span class="ltr">' + L + '</span>' +
      '<span class="opt-text">' + text + (tag ? '<span class="opt-tag">' + tag + '</span>' : '') + '</span></div>';
  }

  function solutionText(q) {
    const many = q.key.length > 1;
    const letters = joinLetters(q.key);
    return q.neg
      ? 'Gesucht ' + (many ? 'sind die falschen Aussagen ' : 'ist die falsche Aussage ') + letters + '.'
      : 'Richtig ' + (many ? 'sind ' : 'ist ') + letters + '.';
  }
  function verdictHTML(q, sel, mode) {
    if (mode === 'solution') {
      return '<div class="verdict info" id="verdict" tabindex="-1">' + ICON.check + '<p>' + solutionText(q) + '</p></div>';
    }
    return isRight(q, sel)
      ? '<div class="verdict ok" id="verdict" tabindex="-1" role="status">' + ICON.check + '<p><strong>Richtig.</strong> Alle Kreuze stimmen.</p></div>'
      : '<div class="verdict bad" id="verdict" tabindex="-1" role="status">' + ICON.x + '<p><strong>Nicht ganz.</strong> ' + solutionText(q) + '</p></div>';
  }
  const whyHTML = q => '<section class="why"><h2 class="label">Begründung</h2><p>' + q.bg + '</p></section>';

  // ---------------------------------------------------------------- Ansichten
  function renderStart() {
    hideTopbar();
    const options = [{ id: 'all', title: 'Alle Kapitel', sub: 'Kapitel ' + kapVon + ' bis ' + kapBis, n: QS.length }].concat(
      KAP.map(k => ({ id: String(k.nr), title: 'Kapitel ' + k.nr, sub: k.titel + ' · ' + k.bereich, n: QS.filter(q => q.kap === k.nr).length })));
    const wrongN = state.last ? state.last.wrong.length : 0;
    if (wrongN) options.push({ id: 'wrong', title: 'Nur meine Fehler', sub: 'aus dem letzten Durchgang', n: wrongN });
    const run = state.run && !state.run.finished ? state.run : null;

    app.innerHTML =
      '<section class="hero">' +
        '<p class="eyebrow">LEK · Datenschutz</p>' +
        '<h1>Datenschutz-Quiz</h1>' +
        '<p class="lead">Die ' + QS.length + ' eingegrenzten Aufgaben aus Kapitel ' + kapVon + ' bis ' + kapBis + '. Wie in der LEK können mehrere Antworten richtig sein. Nach jeder Frage siehst du die Lösung mit Begründung.</p>' +
      '</section>' +
      (run ? '<div class="resume"><p><strong>Angefangener Durchgang:</strong> Frage ' + (run.idx + 1) + ' von ' + run.ids.length +
        ', bisher ' + runRight(run) + ' richtig.</p></div>' : '') +
      '<p class="section-label" id="lbl-filter">Welche Aufgaben?</p>' +
      '<div class="choices" role="radiogroup" aria-labelledby="lbl-filter">' +
        options.map(o => '<button type="button" class="choice" role="radio" aria-checked="' + (state.filter === o.id) + '" data-act="filter" data-id="' + o.id + '">' +
          '<span class="dot" aria-hidden="true"></span>' +
          '<span><span class="choice-title">' + o.title + '</span><span class="choice-sub">' + o.sub + '</span></span>' +
          '<span class="count">' + o.n + '</span></button>').join('') +
      '</div>' +
      '<button type="button" class="switch-row" role="switch" aria-checked="' + state.shuffle + '" data-act="shuffle">' +
        '<span><span class="choice-title">Reihenfolge mischen</span><span class="choice-sub">Fragen in zufälliger Reihenfolge</span></span>' +
        '<span class="switch" aria-hidden="true"></span></button>' +
      '<p class="section-label">Zum Nachlesen</p>' +
      '<div class="tools">' +
        '<button type="button" class="tool" data-act="review-all"><strong>Lösungen durchblättern</strong><span>Alle ' + QS.length + ' Aufgaben mit Begründung</span></button>' +
        '<button type="button" class="tool" data-act="notes"><strong>Merkzettel</strong><span>Fristen, Begriffe, Verwechslungen</span></button>' +
        (DATA.pdf ? '<a class="tool wide" href="./' + encodeURI(DATA.pdf) + '" target="_blank" rel="noopener"><strong>PDF zum Ausdrucken</strong><span>Fragen und Lösungsblatt mit Begründungen</span></a>' : '') +
      '</div>' +
      (state.last ? '<p class="last">Letzter Durchgang: ' + state.last.score + ' von ' + state.last.total + ' richtig.</p>' : '');

    const n = idsFor(state.filter).length;
    bar.innerHTML = '<div class="actionbar-in">' + (run
      ? '<button type="button" class="btn" data-act="start">Neu starten</button><button type="button" class="btn primary grow" data-act="resume">Weitermachen</button>'
      : '<button type="button" class="btn primary" data-act="start">Quiz starten · ' + plural(n, 'Frage', 'Fragen') + '</button>') + '</div>';
  }

  function renderQuiz() {
    const run = state.run;
    const id = run.ids[run.idx];
    const q = BY_ID[id];
    const sel = run.sel[id] || [];
    const done = !!run.done[id];
    renderTopbar('Frage', run.ids, run.idx, (qid, i) => run.done[qid]
      ? (isRight(BY_ID[qid], run.sel[qid]) ? 'ok' : 'bad')
      : (i === run.idx ? 'cur' : ''), 'home', 'Übersicht');
    app.innerHTML = questionHead(q) +
      (done ? '' : '<p class="q-hint">Alle zutreffenden Antworten antippen.</p>') +
      '<div class="opts" role="group" aria-label="Antworten">' + q.opts.map((_, i) => optionHTML(q, i + 1, sel, done ? 'answer' : 'pick')).join('') + '</div>' +
      (done ? verdictHTML(q, sel, 'answer') + whyHTML(q) : '');
    const isLast = run.idx === run.ids.length - 1;
    bar.innerHTML = '<div class="actionbar-in">' + (done
      ? '<button type="button" class="btn primary" data-act="next">' + (isLast ? 'Zur Auswertung' : 'Nächste Frage') + '</button>'
      : '<button type="button" class="btn primary" data-act="check" id="btn-check"' + (sel.length ? '' : ' disabled') + '>Antwort prüfen</button>') + '</div>';
  }

  function renderResult() {
    hideTopbar();
    const run = state.run;
    const wrong = runWrong(run);
    const total = run.ids.length;
    const score = total - wrong.length;
    const pct = Math.round(score / total * 100);
    const rows = KAP.map(k => {
      const ids = run.ids.filter(id => BY_ID[id].kap === k.nr);
      return { k, n: ids.length, r: ids.filter(id => isRight(BY_ID[id], run.sel[id])).length };
    }).filter(x => x.n > 0);
    app.innerHTML =
      '<section class="hero">' +
        '<p class="eyebrow">Auswertung</p>' +
        '<p class="score" id="score">' + score + '<small> / ' + total + '</small></p>' +
        '<p class="score-sub">' + pct + ' % richtig · ' + (wrong.length ? plural(wrong.length, 'Fehler', 'Fehler') : 'keine Fehler') + '</p>' +
      '</section>' +
      '<div class="bars">' + rows.map(x =>
        '<div class="bar-row"><span class="name">Kapitel ' + x.k.nr + ' · ' + x.k.titel + '</span>' +
        '<span class="val">' + x.r + ' / ' + x.n + '</span>' +
        '<span class="bar"><span style="width:' + (x.r / x.n * 100) + '%"></span></span></div>').join('') + '</div>' +
      (wrong.length
        ? '<p class="section-label">Nochmal ansehen</p><div class="redo-list">' + wrong.map((id, i) => {
            const q = BY_ID[id];
            return '<button type="button" class="redo" data-act="review-wrong" data-i="' + i + '"><span class="ref">' + ref(q) + '</span>' +
              '<span class="txt">' + q.frage + '</span></button>';
          }).join('') + '</div>'
        : '<p class="lead all-right">Alle Aufgaben richtig. Für den nächsten Durchgang kannst du auf der Übersicht die Reihenfolge mischen.</p>');
    bar.innerHTML = '<div class="actionbar-in"><button type="button" class="btn" data-act="home">Übersicht</button>' + (wrong.length
      ? '<button type="button" class="btn primary grow" data-act="redo">Fehler wiederholen (' + wrong.length + ')</button>'
      : '<button type="button" class="btn primary grow" data-act="start">Neuer Durchgang</button>') + '</div>';
  }

  function renderReview() {
    const rv = state.review;
    const q = BY_ID[rv.ids[rv.idx]];
    const backAct = rv.from === 'result' && state.run && state.run.finished ? 'to-result' : 'home';
    renderTopbar('Lösung', rv.ids, rv.idx, (id, i) => i === rv.idx ? 'cur' : (i < rv.idx ? 'seen' : ''),
      backAct, backAct === 'to-result' ? 'Auswertung' : 'Übersicht');
    app.innerHTML = questionHead(q) +
      '<div class="opts">' + q.opts.map((_, i) => optionHTML(q, i + 1, [], 'solution')).join('') + '</div>' +
      verdictHTML(q, [], 'solution') + whyHTML(q);
    const isLast = rv.idx === rv.ids.length - 1;
    bar.innerHTML = '<div class="actionbar-in">' +
      '<button type="button" class="btn" data-act="prev-sol"' + (rv.idx === 0 ? ' disabled' : '') + '>Zurück</button>' +
      '<button type="button" class="btn primary grow" data-act="next-sol">' + (isLast ? 'Fertig' : 'Weiter') + '</button></div>';
  }

  function renderNotes() {
    hideTopbar();
    const N = DATA.merkzettel || {};
    const list = (rows, fn) => '<dl class="facts">' + (rows || []).map(fn).join('') + '</dl>';
    app.innerHTML =
      '<section class="hero"><p class="eyebrow">Zum Auswendiglernen</p><h1>Merkzettel</h1>' +
        '<p class="lead">Fristen, Begriffe und typische Verwechslungen aus den ' + QS.length + ' Aufgaben.</p></section>' +
      '<h2 class="notes-h">Zahlen und Fristen</h2>' +
        list(N.fristen, ([a, b]) => '<div class="fact"><dt>' + nb(a) + '</dt><dd>' + nb(b) + '</dd></div>') +
      '<h2 class="notes-h">Begriffe aus Art. 4 DSGVO</h2>' +
        list(N.begriffe, ([a, b, c]) => '<div class="fact"><dt>' + nb(a) + '</dt><dd><strong>' + nb(b) + '</strong><br>' + nb(c) + '</dd></div>') +
      '<h2 class="notes-h">Verwechslungsgefahren</h2>' +
        list(N.verwechslungen, ([a, b]) => '<div class="fact"><dt class="plain">' + nb(a) + '</dt><dd>' + nb(b) + '</dd></div>') +
      (N.tipp ? '<section class="tip"><h2 class="label">Prüfungstipp · Negativfragen</h2><p>' + nb(N.tipp) + '</p></section>' : '');
    bar.innerHTML = '<div class="actionbar-in"><button type="button" class="btn" data-act="home">Übersicht</button>' +
      '<button type="button" class="btn primary grow" data-act="start">Quiz starten</button></div>';
  }

  function render(toTop) {
    const v = state.view;
    if (v === 'quiz') renderQuiz();
    else if (v === 'result') renderResult();
    else if (v === 'review') renderReview();
    else if (v === 'notes') renderNotes();
    else renderStart();
    if (toTop) window.scrollTo(0, 0);
    save();
  }

  // Nach dem Prüfen so weit scrollen, dass die Begründung sichtbar wird – ohne das Ergebnis aus dem Blick zu schieben.
  function revealFeedback() {
    const v = document.getElementById('verdict');
    const w = app.querySelector('.why');
    if (!v || !w) return;
    const headerBottom = topbar.hidden ? 0 : topbar.getBoundingClientRect().bottom;
    const visibleBottom = window.innerHeight - bar.getBoundingClientRect().height - 12;
    const overflow = w.getBoundingClientRect().bottom - visibleBottom;
    if (overflow <= 0) return;
    const room = v.getBoundingClientRect().top - headerBottom - 12;
    const delta = Math.min(overflow, Math.max(0, room));
    if (delta > 0) window.scrollBy({ top: delta, behavior: reduced ? 'auto' : 'smooth' });
  }

  // ---------------------------------------------------------------- Bedienung
  function refocus(selector) {
    const el = document.querySelector(selector);
    if (el) { try { el.focus({ preventScroll: true }); } catch (e) { el.focus(); } }
  }

  document.addEventListener('click', e => {
    const el = e.target.closest('[data-act]');
    if (!el || el.disabled) return;
    const act = el.dataset.act;
    const run = state.run;
    switch (act) {
      case 'filter':
        state.filter = el.dataset.id;
        render();
        refocus('[data-act="filter"][data-id="' + state.filter + '"]');
        break;
      case 'shuffle':
        state.shuffle = !state.shuffle;
        render();
        refocus('[data-act="shuffle"]');
        break;
      case 'start':
        startRun(idsFor(state.filter));
        break;
      case 'resume':
        state.view = 'quiz';
        render(true);
        break;
      case 'opt': {
        const id = run.ids[run.idx];
        if (run.done[id]) return;
        const n = Number(el.dataset.n);
        const sel = (run.sel[id] || []).slice();
        const at = sel.indexOf(n);
        if (at >= 0) sel.splice(at, 1); else sel.push(n);
        run.sel[id] = sel;
        el.setAttribute('aria-checked', String(at < 0));
        const btn = document.getElementById('btn-check');
        if (btn) btn.disabled = sel.length === 0;
        save();
        break;
      }
      case 'check': {
        const id = run.ids[run.idx];
        if (!(run.sel[id] || []).length) return;
        run.done[id] = true;
        render();
        refocus('#verdict');
        revealFeedback();
        break;
      }
      case 'next':
        if (run.idx < run.ids.length - 1) { run.idx++; render(true); } else finishRun();
        break;
      case 'home':
        state.view = 'start';
        render(true);
        break;
      case 'to-result':
        state.view = 'result';
        render(true);
        break;
      case 'review-all':
        openReview(QS.map(q => q.id), 0, 'start');
        break;
      case 'review-wrong':
        openReview(runWrong(run), Number(el.dataset.i) || 0, 'result');
        break;
      case 'prev-sol':
        if (state.review.idx > 0) { state.review.idx--; render(true); }
        break;
      case 'next-sol':
        if (state.review.idx < state.review.ids.length - 1) { state.review.idx++; render(true); }
        else { state.view = state.review.from === 'result' && run && run.finished ? 'result' : 'start'; render(true); }
        break;
      case 'redo':
        startRun(state.last.wrong);
        break;
      case 'notes':
        state.view = 'notes';
        render(true);
        break;
    }
  });

  // ---------------------------------------------------------------- Start
  state = sanitize(load());
  render();

  // Offline-Cache (Service Worker) – nur über HTTPS oder lokal verfügbar
  const local = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || local)) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => { /* ohne Offline-Cache weiter */ });
    });
  }
})();
