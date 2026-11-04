// Flair around Ariel's head, inside her portrait (home page and the coming-soon page).
// The sets themselves (sprites, how each set moves, holiday dates) are in flair-sets.js, loaded first.
// Each visit picks a set: on a holiday (Boston time) that holiday's set (on Ariel's birthday, hers),
// otherwise a random everyday set that's in season, never the same as last visit. Tapping her
// portrait shows the next set. Things pass behind her head (under ari-head-cut.webp, her head and
// hair cut out of the same art) and in front of it; the official logo art is unchanged.
// Testing: ?flair=pizza forces a set (any name in THEMES); ?date=2026-12-25 pretends it's that day.
(() => {
  const F = window.WASABI_FLAIR;
  const head = document.getElementById('head');
  const back = document.getElementById('flair-back'), front = document.getElementById('flair-front');
  if (!F || !head || !back || !front) return;
  const { THEMES, EVERYDAY, SEASONAL } = F;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease = t => 1 - Math.pow(1 - t, 3);
  const TAU = Math.PI * 2;
  const per = (v, i) => typeof v === 'function' ? v(i) : v;  // a theme field, or a function of the part number
  const range = v => Array.isArray(v) ? rnd(v[0], v[1]) : v;
  const RAINBOW = ['#ff5a6e', '#ff8a3d', '#ffd23f', '#9bd34a', '#7cc6fe', '#c9a8f2'];

  // today in Boston, or ?date=YYYY-MM-DD for testing
  const qs = new URLSearchParams(location.search);
  const boston = () => {
    const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date()).map(x => [x.type, x.value]));
    return `${p.year}-${p.month}-${p.day}`;
  };
  const today = /^\d{4}-\d{2}-\d{2}$/.test(qs.get('date') || '') ? qs.get('date') : boston();
  const ctx = F.context(today);
  const everyday = EVERYDAY.filter(n => THEMES[n] && (!SEASONAL[n] || ctx.inSeason(n)));
  const pool = ctx.holidays.includes('birthday') ? ['birthday'] : ctx.holidays.length ? ctx.holidays : everyday;
  const NAMES = [...new Set([...pool, ...ctx.holidays, ...everyday])];  // the order a tap steps through
  const KEY = 'wasabiari.flair';

  // Orbits are centred on her head in the art, in fractions of the portrait width:
  // CX/CY = centre of the halo (hair/forehead height). Rings are tilted so the near side crosses her
  // forehead on a slant instead of covering it; front passes stay above her eyes.
  const CX = .5, CY = .345;
  let W = 0, parts = [], theme = null, t0 = 0, running = false, raf = 0, lastSpark = 0, sparkN = 0, inView = true, fade = 1;
  const measure = () => { W = back.offsetWidth; };
  const ox = () => (CX - .5) * W, oy = () => (CY - .5) * W;

  function build(name) {
    parts.forEach(p => { p.el.classList.add('bye'); setTimeout(() => p.el.remove(), 400); });
    theme = THEMES[name];
    const T = theme, tiltSign = Math.random() < .5 ? -1 : 1, ringPsi = tiltSign * rnd(.3, .42), ringK = rnd(.22, .27), ringDir = Math.random() < .5 ? -1 : 1;
    const modes = Array.from({ length: T.n }, (_, i) => per(T.mode, i) || 'free');
    const ringN = modes.filter(m => m === 'ring').length;
    let ringI = 0;
    parts = modes.map((mode, i) => {
      const el = document.createElement('div');
      const cls = per(T.cls, i);
      el.className = 'fp' + (cls ? ' ' + cls : '');
      el.style.setProperty('--w', (range(per(T.size, i)) * 100).toFixed(2) + '%');
      el.style.setProperty('--d', rnd(1.4, 3.4).toFixed(2) + 's');
      el.style.setProperty('--dl', (-rnd(0, 3)).toFixed(2) + 's');
      el.innerHTML = T.sprite(i, ctx);
      const ring = mode === 'ring';
      const drift = mode === 'rise' || mode === 'fall' || mode === 'pop';
      const p = {
        el, mode, i, front: true, rot: 0, px: null, py: null, sx: 1, sxT: 1, cyc: -1,
        th0: ring ? ringI++ * TAU / ringN : rnd(0, TAU),
        w: range(T.speed || [.3, .45]),
        dir: ring ? ringDir : (Math.random() < .5 ? -1 : 1),
        r0: range(per(T.r, i) || [.36, .44]),
        k: ring ? ringK : rnd(.14, .28),
        psi: ring ? ringPsi : (Math.random() < .75 ? tiltSign : -tiltSign) * rnd(.25, .45),
        ph: rnd(0, TAU), ph2: rnd(0, TAU), ph3: rnd(0, TAU),
        delay: i * .07,
        face: per(T.face, i), spin: per(T.spin, i),
        zig: per(T.zig, i) || 0, bob: per(T.bob, i) || 0, hop: per(T.hop, i) || 0,
        tc: T.trailColor ? T.trailColor(i) : null,
        spinV: rnd(25, 60) * (Math.random() < .5 ? -1 : 1),
        life: range(per(T.life, i) || (mode === 'pop' ? [1.8, 3] : drift ? [6, 9] : [3, 5.5])),
        off: drift ? rnd(0, 12) : rnd(0, 6),
      };
      if (mode === 'pop') p.off = i * .37 + rnd(0, .5);  // stagger the bursts so they don't all go at once
      front.appendChild(el);
      return p;
    });
    t0 = performance.now();
  }

  // a new spot for things that float up, drift down or pop
  function place(p) {
    if (p.mode === 'pop') {
      for (let k = 0; k < 12; k++) {  // never over her lower face, where nothing can hide behind her
        const a = rnd(0, TAU), r = rnd(.24, .46) * W;
        p.x0 = ox() + r * Math.cos(a); p.y0 = oy() + r * Math.sin(a) * .8;
        if (!(Math.abs(p.x0) < .3 * W && p.y0 > 0)) break;
      }
      p.fr = Math.abs(p.x0) > .25 * W || p.y0 < -.36 * W;  // in front only where it can't cover her face
    } else {
      p.fr = Math.random() < .5;
      p.x0 = p.fr ? (Math.random() < .5 ? -1 : 1) * rnd(.3, .44) * W : rnd(-.42, .42) * W;
      p.sway = rnd(.015, .04); p.sf = rnd(.8, 1.8);
    }
  }

  function sparkAt(layer, x, y, kind, color) {
    const s = document.createElement('div');
    s.className = 'spark' + (kind === 'bubble' ? ' bub' : kind === 'dots' ? ' dot' : '');
    const c = kind === 'rainbow' ? RAINBOW[sparkN++ % RAINBOW.length] : color;
    if (c) s.style[kind === 'bubble' ? 'borderColor' : 'background'] = c;
    s.style.left = `calc(50% + ${x.toFixed(1)}px)`; s.style.top = `calc(50% + ${y.toFixed(1)}px)`;
    s.addEventListener('animationend', () => s.remove());
    layer.appendChild(s);
  }

  function frame(now) {
    raf = 0;
    const t = (now - t0) / 1000, T = theme;
    const doSpark = T.trail && now - lastSpark > (T.trailEvery || 70);
    if (doSpark) lastSpark = now;
    for (const p of parts) {
      const intro = ease(clamp((t - p.delay) / 1.1));
      let x, y, sc = 1, op = intro, wantFront, rot;
      if (p.mode === 'rise' || p.mode === 'fall' || p.mode === 'pop') {
        const tt = t + p.off, cyc = Math.floor(tt / p.life), u = (tt % p.life) / p.life;
        if (cyc !== p.cyc) { p.cyc = cyc; place(p); }
        if (p.mode === 'pop') {
          x = p.x0; y = p.y0;
          sc = u < .25 ? .3 + .7 * ease(u / .25) : 1 + .12 * (u - .25);
          op *= clamp(u / .08) * clamp((1 - u) / .4);
          rot = 0;
        } else {
          y = (p.mode === 'rise' ? .44 - .98 * u : -.52 + .98 * u) * W;
          x = p.x0 + p.sway * W * Math.sin(p.sf * t + p.ph);
          op *= clamp(u / .12) * clamp((1 - u) / .12);
          rot = p.spin ? p.spinV * t : (p.mode === 'fall' ? 18 : 6) * Math.sin(1.2 * t + p.ph);
        }
        // The head cutout only reaches down to her nose, so things behind her fade out
        // before they would show over her cheeks and chin.
        if (!p.fr && Math.abs(x) < .3 * W) op *= clamp((.1 * W - y) / (.06 * W));
        wantFront = p.fr;
      } else {
        const wob = p.mode !== 'ring';
        const prog = T.dart ? t - (T.dart / TAU) * Math.sin(TAU * t / T.dart + p.ph) : t;  // dart: zip, then hover
        const th = p.th0 + p.dir * p.w * prog + (wob ? .35 * Math.sin(1.3 * t + p.ph) : 0);
        const r = p.r0 * W * (wob ? 1 + .05 * Math.sin(2.3 * t + p.ph2) : 1) * (.4 + .6 * intro);
        let ex = r * Math.cos(th), ey = r * Math.sin(th) * p.k;
        if (p.mode === 'loop') { const a = p.ph3 + p.dir * 4.2 * t; ex += .05 * W * Math.cos(a); ey += .03 * W * Math.sin(a); }
        if (wob) ey += .015 * W * Math.sin(3.1 * t + p.ph);
        if (p.zig) ey += p.zig * W * Math.sin(11 * t + p.ph);
        if (p.bob) ey += p.bob * W * Math.sin(3.4 * t + p.ph);
        if (p.hop) ey -= p.hop * W * Math.abs(Math.sin(2.6 * t + p.ph));
        const c = Math.cos(p.psi), sn = Math.sin(p.psi);
        x = ox() + ex * c - ey * sn; y = oy() + ex * sn + ey * c;
        const depth = Math.sin(th);
        sc = 1 + .18 * depth;
        if (T.pop) {  // bubbles grow in, drift, then pop and come back
          const u = ((t + p.off) % p.life) / p.life;
          op *= clamp(u / .15);
          if (u > .85) { sc *= 1 + (u - .85) * 5; op *= clamp((1 - u) / .1); }
        }
        wantFront = depth > 0;
        rot = 10 * Math.sin(1.7 * t + p.ph);
        if (p.face === 'flip') {  // drawn facing right; turn around when heading left
          if (p.px !== null && Math.abs(x - p.px) > .05) p.sxT = x < p.px ? -1 : 1;
          rot = 6 * Math.sin(1.7 * t + p.ph);
        } else if (typeof p.face === 'number') {
          if (p.px !== null) {
            const dx = x - p.px, dy = y - p.py;
            if (dx * dx + dy * dy > .01) {
              const target = Math.atan2(dy, dx) * 180 / Math.PI + p.face;
              const d = ((target - p.rot) % 360 + 540) % 360 - 180;
              p.rot += d * .2;
            }
          }
          rot = p.rot;
        } else if (p.spin) rot = p.spinV * t;
      }
      p.sx += (p.sxT - p.sx) * .15;
      if (wantFront !== p.front) { (wantFront ? front : back).appendChild(p.el); p.front = wantFront; }
      p.rot = rot; p.px = x; p.py = y;
      p.el.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) rotate(${rot.toFixed(1)}deg) scale(${(sc * p.sx).toFixed(3)},${sc.toFixed(3)})`;
      p.el.style.opacity = op.toFixed(3);
      if (doSpark && intro > .5 && op > .3) sparkAt(p.front ? front : back, x + rnd(-3, 3), y + rnd(-3, 3), T.trail, p.tc);
    }
    if (running && fade > 0 && !reduce) raf = requestAnimationFrame(frame);
  }

  function play() { if (!raf && fade > 0) raf = requestAnimationFrame(frame); }
  function show(name) {
    build(name);
    try { localStorage.setItem(KEY, name); } catch (e) {}
    if (reduce) { t0 = performance.now() - 3000; frame(performance.now()); } else play();
  }

  // a holiday's set on its dates, otherwise a different everyday set from last visit (or ?flair=name)
  let last = null;
  try { last = localStorage.getItem(KEY); } catch (e) {}
  const forced = qs.get('flair');
  const choices = pool.length > 1 ? pool.filter(n => n !== last) : pool;
  let current = THEMES[forced] ? forced : choices[Math.floor(Math.random() * choices.length)];

  // pick up the scroll fade if the page opened part-way down
  if (typeof window.flairFade === 'number') { fade = window.flairFade; back.style.opacity = front.style.opacity = fade; }
  measure();
  addEventListener('resize', measure);
  const sec = document.getElementById('web') || head;
  running = true;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(es => { inView = es[0].isIntersecting; running = inView && !document.hidden; if (running) play(); }).observe(sec);
  }
  document.addEventListener('visibilitychange', () => { running = inView && !document.hidden; if (running) play(); });
  // as you scroll down, web.js fades the flair out and the portrait goes back to the plain logo
  addEventListener('flairfade', e => {
    const was = fade; fade = e.detail;
    back.style.opacity = front.style.opacity = fade;
    if (fade > 0 && was === 0) play();
  });

  // tap or press Enter on her portrait for the next set
  const next = () => {
    if (fade === 0) return;
    const k = NAMES.indexOf(current);
    current = NAMES[(k + 1) % NAMES.length];
    show(current);
  };
  head.addEventListener('click', next);
  head.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); next(); } });

  show(current);
})();
