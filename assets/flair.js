// Flair around Ariel's portrait on the home page. Each visit picks a different set
// (butterflies, fairies, pizza, lightbulbs, ...); tapping her portrait shows the next one.
// The official logo itself never changes: this only adds things flying around it.
// Add ?flair=pizza (any name in THEMES) to the URL to force one.
(() => {
  const head = document.getElementById('head');
  const back = document.getElementById('flair-back'), front = document.getElementById('flair-front');
  if (!head || !back || !front) return;

  const INK = '#1b1b1b';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease = t => 1 - Math.pow(1 - t, 3);
  const TAU = Math.PI * 2;
  const svg = (body, vb = '0 0 100 100') => `<svg viewBox="${vb}" aria-hidden="true" focusable="false">${body}</svg>`;
  const st = (w = 4) => `stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;

  // ---------- sprites (Sticker Pop: bold black outlines, flat colours) ----------
  const SP = {
    butterfly: ([a, b]) => svg(`<g class="flap">
      <path d="M50 47C34 8 4 12 8 39c3 15 26 17 42 11z" fill="${a}" ${st()}/>
      <path d="M50 47C66 8 96 12 92 39c-3 15-26 17-42 11z" fill="${a}" ${st()}/>
      <path d="M50 54C35 57 17 69 25 85c8 11 22-5 25-25z" fill="${b}" ${st()}/>
      <path d="M50 54C65 57 83 69 75 85c-8 11-22-5-25-25z" fill="${b}" ${st()}/>
      <circle cx="26" cy="32" r="5" fill="#fff"/><circle cx="74" cy="32" r="5" fill="#fff"/></g>
      <path d="M47 38Q42 24 35 19M53 38Q58 24 65 19" fill="none" ${st(3)}/>
      <ellipse cx="50" cy="55" rx="5" ry="19" fill="${INK}"/>`),
    fairy: c => svg(`<defs><radialGradient id="fl-glow"><stop offset="0" stop-color="#fffbe0"/><stop offset=".45" stop-color="#ffe46b" stop-opacity=".7"/><stop offset="1" stop-color="#ffe46b" stop-opacity="0"/></radialGradient></defs>
      <circle cx="50" cy="50" r="50" fill="url(#fl-glow)"/>
      <g class="flap"><ellipse cx="35" cy="42" rx="12" ry="19" transform="rotate(-35 35 42)" fill="#e3f6ff" fill-opacity=".92" ${st(3)}/>
      <ellipse cx="65" cy="42" rx="12" ry="19" transform="rotate(35 65 42)" fill="#e3f6ff" fill-opacity=".92" ${st(3)}/></g>
      <path d="M44 54h12l7 18H37z" fill="${c}" ${st(3)}/>
      <circle cx="50" cy="45" r="8" fill="#8a5a3c" ${st(3)}/>
      <path d="M62 52l12-12" ${st(3)}/><path d="M74 34l2 4 4 2-4 2-2 4-2-4-4-2 4-2z" fill="#fff" ${st(2)}/>`),
    pizza: () => svg(`<path d="M15 26L50 95 85 26z" fill="#ffd45c" ${st()}/>
      <path d="M10 22Q50 2 90 22l-4 9Q50 13 14 31z" fill="#e39b4f" ${st()}/>
      <circle cx="40" cy="42" r="7" fill="#d9432f" ${st(3)}/><circle cx="61" cy="46" r="6" fill="#d9432f" ${st(3)}/>
      <circle cx="49" cy="65" r="5.5" fill="#d9432f" ${st(3)}/><path d="M57 60l4 3M33 33l3 2" stroke="#4f8f12" stroke-width="4" stroke-linecap="round"/>`),
    bulb: () => svg(`<defs><radialGradient id="fl-bulb"><stop offset="0" stop-color="#fff6b0"/><stop offset=".55" stop-color="#ffe46b" stop-opacity=".6"/><stop offset="1" stop-color="#ffe46b" stop-opacity="0"/></radialGradient></defs>
      <circle class="lit" cx="50" cy="40" r="62" fill="url(#fl-bulb)"/>
      <g class="lit" stroke="#ffb000" stroke-width="5" stroke-linecap="round"><path d="M50-14v10M12 2l8 8M88 2l-8 8M-8 40h11M97 40h11"/></g>
      <path d="M50 10a28 28 0 0 0-17 50c4 4 5 8 5 12h24c0-4 1-8 5-12a28 28 0 0 0-17-50z" fill="#fffbe8"/>
      <path class="lit" d="M50 10a28 28 0 0 0-17 50c4 4 5 8 5 12h24c0-4 1-8 5-12a28 28 0 0 0-17-50z" fill="#ffe46b"/>
      <path d="M50 10a28 28 0 0 0-17 50c4 4 5 8 5 12h24c0-4 1-8 5-12a28 28 0 0 0-17-50z" fill="none" ${st()}/>
      <path d="M42 54l4-12 4 9 4-9 4 12" fill="none" stroke="#c77a00" stroke-width="3" stroke-linejoin="round"/>
      <rect x="37" y="72" width="26" height="15" rx="4" fill="#b8b2c6" ${st()}/><path d="M39 78h22M39 83h22" ${st(2.5)}/><path d="M45 92h10" ${st()}/>`, '-20 -20 140 140'),
    star: c => svg(`<path d="M50 6l11 32h34L67 58l11 34-28-20-28 20 11-34L5 38h34z" fill="${c}" ${st(5)}/>`),
    sparkle: c => svg(`<path d="M50 4c4 30 16 42 46 46-30 4-42 16-46 46-4-30-16-42-46-46 30-4 42-16 46-46z" fill="${c}" ${st(5)}/>`),
    note: c => svg(`<ellipse cx="36" cy="74" rx="16" ry="12" transform="rotate(-22 36 74)" fill="${c}" ${st()}/>
      <path d="M50 72V14" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>
      <path d="M50 14c4 12 24 14 22 34-4-10-12-14-22-14z" fill="${c}" ${st()}/>`),
    notes: c => svg(`<ellipse cx="24" cy="78" rx="14" ry="10" transform="rotate(-22 24 78)" fill="${c}" ${st()}/>
      <ellipse cx="72" cy="70" rx="14" ry="10" transform="rotate(-22 72 70)" fill="${c}" ${st()}/>
      <path d="M36 76V22M84 68V14" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M36 20l48-8v12l-48 8z" fill="${INK}" ${st(3)}/>`),
    plane: () => svg(`<path d="M6 52L94 16 62 86 48 60z" fill="#fff" ${st()}/>
      <path d="M48 60l14 26-5-31z" fill="#dcd2ec" ${st()}/><path d="M48 60L94 16" fill="none" ${st(3)}/>`),
    bubble: c => svg(`<circle cx="50" cy="50" r="44" fill="${c}" fill-opacity=".3" stroke="${INK}" stroke-width="4"/>
      <path d="M27 36a26 26 0 0 1 19-15" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round"/><circle cx="70" cy="68" r="4" fill="#fff"/>`),
    nigiri: () => svg(`<rect x="14" y="46" width="72" height="34" rx="16" fill="#fff" ${st()}/>
      <path d="M10 54C14 28 86 28 90 54 72 46 28 46 10 54z" fill="#ff8a5b" ${st()}/>
      <path d="M33 38l5 9M50 35v10M67 38l-5 9" stroke="#ffd0bb" stroke-width="4" stroke-linecap="round"/>
      <path d="M43 40h14v40H43z" fill="#25342c" ${st(3)}/>`),
    maki: c => svg(`<circle cx="50" cy="50" r="40" fill="#25342c" ${st()}/><circle cx="50" cy="50" r="30" fill="#fff"/>
      <circle cx="50" cy="50" r="13" fill="${c}" ${st(3)}/><circle cx="34" cy="40" r="2" fill="#e8e0d0"/><circle cx="64" cy="64" r="2" fill="#e8e0d0"/><circle cx="62" cy="34" r="2" fill="#e8e0d0"/>`),
    wasabi: () => svg(`<path d="M16 78c-2-18 10-30 22-36 2-12 12-20 22-18 12 2 16 14 12 22 12 4 16 16 12 26-2 8-12 10-34 10-20 0-32 2-34-4z" fill="#9bd34a" ${st()}/>
      <path d="M44 40c4-4 10-4 12 0M34 60c6-4 14-4 18 0" fill="none" stroke="#cdeaa0" stroke-width="4" stroke-linecap="round"/>`),
  };

  const BF = [['#c9a8f2', '#e6d6fa'], ['#9bd34a', '#cdeaa0'], ['#ffd23f', '#ffe98f'], ['#ff8fb1', '#ffc4d6'], ['#7cc6fe', '#bfe3ff']];
  const BRIGHT = ['#c9a8f2', '#9bd34a', '#ffd23f', '#ff8fb1', '#7cc6fe'];

  // mode: ring = evenly spaced on one tilted orbit; free = each on its own orbit with wobble;
  // loop = free + loop-the-loops; rise = drift up past her sides.
  const THEMES = {
    butterflies: { n: 8, size: [.19, .25], mode: 'free', speed: [.35, .6], r: [1.12, 1.4], face: 90, sprite: i => SP.butterfly(BF[i % BF.length]), cls: 'flutter' },
    fairies: { n: 6, size: [.2, .24], mode: 'loop', speed: [.4, .6], r: [1.12, 1.3], trail: true, sprite: i => SP.fairy(BRIGHT[i % BRIGHT.length]), cls: 'buzz' },
    pizza: { n: 8, size: [.19, .21], mode: 'ring', speed: [.34, .34], r: [1.22, 1.22], spin: true, sprite: () => SP.pizza() },
    lightbulbs: { n: 7, size: [.2, .24], mode: 'free', speed: [.14, .26], r: [1.14, 1.36], sprite: () => SP.bulb(), cls: 'blink' },
    stars: { n: 14, size: [.08, .16], mode: 'free', speed: [.1, .26], r: [1.05, 1.42], sprite: i => i % 3 ? SP.star(['#ffd23f', '#fff', '#c9a8f2'][i % 3]) : SP.sparkle('#fff6b0'), cls: 'twinkle' },
    music: { n: 10, size: [.14, .19], mode: 'rise', life: [4, 6.5], sprite: i => (i % 2 ? SP.note : SP.notes)(BRIGHT[i % BRIGHT.length]) },
    planes: { n: 6, size: [.19, .22], mode: 'free', speed: [.45, .7], r: [1.15, 1.38], face: 37.7, sprite: () => SP.plane() },
    bubbles: { n: 12, size: [.1, .21], mode: 'rise', life: [4.5, 7.5], pop: true, sprite: i => SP.bubble(['#7cc6fe', '#c9a8f2', '#9bd34a'][i % 3]) },
    sushi: { n: 9, size: [.18, .2], mode: 'ring', speed: [.28, .28], r: [1.22, 1.22], sprite: i => [SP.nigiri, () => SP.maki(['#ff8a5b', '#9bd34a', '#ffd23f'][i % 3]), SP.wasabi][i % 3]() },
  };
  const NAMES = Object.keys(THEMES);
  const KEY = 'wasabiari.flair';

  let R = 0, parts = [], theme = null, t0 = 0, running = false, raf = 0, lastSpark = 0;
  const measure = () => { R = back.offsetWidth / 2; };

  function build(name) {
    parts.forEach(p => { p.el.classList.add('bye'); setTimeout(() => p.el.remove(), 400); });
    theme = THEMES[name];
    const T = theme, ringPsi = rnd(-.35, .35), ringK = rnd(.76, .86), ringDir = Math.random() < .5 ? -1 : 1;
    parts = Array.from({ length: T.n }, (_, i) => {
      const el = document.createElement('div');
      el.className = 'fp' + (T.cls ? ' ' + T.cls : '');
      const size = rnd(...T.size);
      el.style.setProperty('--w', (size * 100).toFixed(2) + '%');
      el.style.setProperty('--d', rnd(1.4, 3.4).toFixed(2) + 's');
      el.style.setProperty('--dl', (-rnd(0, 3)).toFixed(2) + 's');
      el.innerHTML = T.sprite(i);
      const r0 = T.r ? rnd(...T.r) : 1;
      const p = {
        el, size, front: true, rot: 0, px: null, py: null,
        th0: T.mode === 'ring' ? i * TAU / T.n : rnd(0, TAU),
        w: rnd(...(T.speed || [0, 0])),
        dir: T.mode === 'ring' ? ringDir : (Math.random() < .5 ? -1 : 1),
        r0,
        // keep the front pass of each orbit out at the edge of the portrait, away from her face
        k: T.mode === 'ring' ? ringK : rnd(Math.max(.6, .9 / r0), .95),
        psi: T.mode === 'ring' ? ringPsi : rnd(-.6, .6),
        ph: rnd(0, TAU), ph2: rnd(0, TAU), ph3: rnd(0, TAU),
        delay: i * .07,
        spinV: rnd(25, 60) * (Math.random() < .5 ? -1 : 1),
        life: T.life ? rnd(...T.life) : 0, off: rnd(0, 8),
        side: i % 2 ? 1 : -1, xr: rnd(1.02, 1.3),
      };
      front.appendChild(el);
      return p;
    });
    t0 = performance.now();
  }

  function sparkAt(layer, x, y) {
    const s = document.createElement('div');
    s.className = 'spark';
    s.style.left = `calc(50% + ${x.toFixed(1)}px)`; s.style.top = `calc(50% + ${y.toFixed(1)}px)`;
    s.addEventListener('animationend', () => s.remove());
    layer.appendChild(s);
  }

  function frame(now) {
    raf = 0;
    const t = (now - t0) / 1000, T = theme;
    const doSpark = T.trail && now - lastSpark > 70;
    if (doSpark) lastSpark = now;
    for (const p of parts) {
      const intro = ease(clamp((t - p.delay) / 1.1));
      let x, y, depth = 1, op = intro, sc = 1;
      if (T.mode === 'rise') {
        const u = ((t + p.off) % p.life) / p.life;
        x = p.side * p.xr * R + .14 * R * Math.sin(u * TAU * 2 + p.ph);
        y = R * (1.25 - 2.75 * u);
        op *= clamp(u / .12) * clamp((1 - u) / .15);
        if (T.pop && u > .88) { sc = 1 + (u - .88) * 5; op *= clamp((1 - u) / .12); }
      } else {
        const wob = T.mode !== 'ring';
        const th = p.th0 + p.dir * p.w * t + (wob ? .5 * Math.sin(1.3 * t + p.ph) : 0);
        const r = p.r0 * R * (wob ? 1 + .07 * Math.sin(2.3 * t + p.ph2) : 1) * (.35 + .65 * intro);
        let ex = r * Math.cos(th), ey = r * Math.sin(th) * p.k;
        if (T.mode === 'loop') { const a = p.ph3 + p.dir * 4.2 * t; ex += .18 * R * Math.cos(a); ey += .18 * R * Math.sin(a); }
        if (wob) ey += .05 * R * Math.sin(3.1 * t + p.ph);
        const c = Math.cos(p.psi), s = Math.sin(p.psi);
        x = ex * c - ey * s; y = ex * s + ey * c;
        depth = Math.sin(th);
        sc = 1 + .14 * depth;
      }
      const wantFront = depth > 0;
      if (wantFront !== p.front) { (wantFront ? front : back).appendChild(p.el); p.front = wantFront; }
      if (T.face !== undefined && p.px !== null) {
        const dx = x - p.px, dy = y - p.py;
        if (dx * dx + dy * dy > .01) {
          const target = Math.atan2(dy, dx) * 180 / Math.PI + T.face;
          let d = ((target - p.rot) % 360 + 540) % 360 - 180;
          p.rot += d * .2;
        }
      } else if (T.spin) p.rot = p.spinV * t;
      else if (T.face === undefined) p.rot = 10 * Math.sin(1.7 * t + p.ph);
      p.px = x; p.py = y;
      p.el.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) rotate(${p.rot.toFixed(1)}deg) scale(${sc.toFixed(3)})`;
      p.el.style.opacity = op.toFixed(3);
      if (doSpark && intro > .5) sparkAt(p.front ? front : back, x + rnd(-4, 4), y + rnd(-4, 4));
    }
    if (running && !reduce) raf = requestAnimationFrame(frame);
  }

  function play() { if (!raf) raf = requestAnimationFrame(frame); }
  function show(name) {
    build(name);
    try { localStorage.setItem(KEY, name); } catch (e) {}
    if (reduce) { t0 = performance.now() - 3000; frame(performance.now()); } else play();
  }

  // a different set from last visit (or ?flair=name)
  let last = null;
  try { last = localStorage.getItem(KEY); } catch (e) {}
  const forced = new URLSearchParams(location.search).get('flair');
  let current = NAMES.includes(forced) ? forced : (() => { const pool = NAMES.filter(n => n !== last); return pool[Math.floor(Math.random() * pool.length)]; })();

  measure();
  addEventListener('resize', measure);
  const sec = document.getElementById('web') || head;
  running = true;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(es => { running = es[0].isIntersecting && !document.hidden; if (running) play(); }).observe(sec);
  }
  document.addEventListener('visibilitychange', () => { running = !document.hidden; if (running) play(); });

  // tap or press Enter on her portrait for the next set
  const next = () => { current = NAMES[(NAMES.indexOf(current) + 1) % NAMES.length]; show(current); };
  head.addEventListener('click', next);
  head.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); next(); } });

  show(current);
})();
