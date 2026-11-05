// "Coming soon" pill toys (Ivan, 11-05): spin the C in "Coming" and stretch the n in "soon".
// Tap the C to spin it (tap again to spin faster). Drag the n out like taffy, or tap it for a boing.
// Works with touch (iPhone) and mouse; mouse hover gives a small taste of each.
(() => {
  const tag = document.getElementById('soon-tag');
  if (!tag) return;
  const C = tag.querySelector('.tc'), W = tag.querySelector('.tw'), N = tag.querySelector('.tn');
  const [, nl, nb, nr] = N.children, bar = nb.firstElementChild;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let F = 26, nW = 15, A = 7, maxX = 120, ready = false;

  // ---- measuring -----------------------------------------------------------------
  function measure() {
    F = parseFloat(getComputedStyle(tag).fontSize);
    nW = N.firstElementChild.offsetWidth;
    // The n is cut at A, the middle of the top of its arch, between the two stems. Stretching slides
    // the right half over by x and fills the gap with a bar the same height as the arch there.
    // A and the bar come from drawing the n on a canvas, so they fit whatever font is showing.
    A = .29 * F; let top = .49 * F, bot = .32 * F;
    try {
      const cs = getComputedStyle(tag), k = 4, cw = Math.ceil(nW * k) + 4, ch = Math.ceil(F * k * 1.6), by = Math.round(F * k * 1.2);
      const cv = document.createElement('canvas'); cv.width = cw; cv.height = ch;
      const g = cv.getContext('2d', { willReadFrequently: true });
      g.font = `${cs.fontWeight} ${F * k}px ${cs.fontFamily}`; g.fillText('n', 0, by);
      const d = g.getImageData(0, 0, cw, ch).data, cols = [];
      let tall = 0;
      for (let x = 0; x < cw; x++) {
        let t = -1, b = -1;
        for (let y = 0; y < ch; y++) if (d[(y * cw + x) * 4 + 3] > 127) { if (t < 0) t = y; b = y; }
        cols.push([t, b]); if (t >= 0) tall = Math.max(tall, b - t);
      }
      const isStem = x => cols[x][0] >= 0 && cols[x][1] - cols[x][0] > .6 * tall;
      let x = 0; while (x < cw && !isStem(x)) x++;
      while (x < cw && isStem(x)) x++;
      const s1 = x; while (x < cw && !isStem(x)) x++;
      if (x < cw && x - s1 > 2) {
        const c = Math.round((s1 + x) / 2), [t, b] = cols[c];
        A = c / k; top = (by - t) / k; bot = (by - b - 1) / k;
      }
    } catch (e) { /* keep the Fredoka numbers */ }
    nl.style.clipPath = nl.style.webkitClipPath = `inset(-60% ${nW - A}px -60% -30%)`;
    nr.style.clipPath = nr.style.webkitClipPath = `inset(-60% -30% -60% ${A}px)`;
    nb.style.left = A - .5 + 'px';
    bar.style.height = top - bot + 'px';
    bar.style.verticalAlign = bot + 'px'; // sits on the text baseline, so it lines up with the glyph exactly
    const base = tag.offsetWidth - Math.max(0, n.x);
    maxX = Math.max(nW, Math.min(9 * F, innerWidth - 32 - base));
    // Spin the C around the middle of its ink, not the middle of its text box.
    try {
      const cs = getComputedStyle(C), cx = document.createElement('canvas').getContext('2d');
      cx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      const m = cx.measureText('C');
      const fa = m.fontBoundingBoxAscent || .975 * F, fd = m.fontBoundingBoxDescent || .235 * F;
      const baseline = (C.offsetHeight - fa - fd) / 2 + fa;
      C.style.transformOrigin = `${(m.actualBoundingBoxRight - m.actualBoundingBoxLeft) / 2}px ${baseline - (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2}px`;
    } catch (e) { /* keep the CSS default */ }
    ready = true;
    drawN();
  }

  // ---- the n ---------------------------------------------------------------------
  const n = { x: 0, v: 0, T: 0, drag: null };
  function drawN() {
    const x = Math.max(-.4 * nW, n.x);
    if (x >= 0) {
      N.style.width = nW + x + 'px';
      N.style.transform = '';
      bar.style.width = x > .05 ? x + 1 + 'px' : '0';
      nr.style.transform = `translateX(${x}px)`;
    } else { // springing back past rest: a quick squash
      N.style.width = nW + x + 'px';
      N.style.transform = `scaleX(${(nW + x) / nW})`;
      bar.style.width = '0';
      nr.style.transform = '';
    }
  }
  // Follows the finger, then gets stiffer near the edge of the screen.
  function rubber(r) {
    if (r <= 0) return -.4 * nW * (1 - Math.exp(r / 40));
    const k = .7 * maxX;
    return r < k ? r : k + (maxX - k) * (1 - Math.exp(-(r - k) / (maxX - k)));
  }

  // ---- the C ---------------------------------------------------------------------
  const c = { a: 0, v: 0, T: 0 };
  function spin(turns) { c.T += 360 * turns; go(); }

  // ---- animation loop --------------------------------------------------------------
  let raf = 0, last = 0;
  function go() { if (!raf) { last = performance.now(); raf = requestAnimationFrame(step); } }
  function step(now) {
    const dt = Math.min(.032, (now - last) / 1000); last = now;
    let busy = false;
    // C: a springy wheel; every tap adds a turn, so fast taps make it whizz.
    c.v += (-70 * (c.a - c.T) - 10 * c.v) * dt; c.a += c.v * dt;
    if (Math.abs(c.a - c.T) < .2 && Math.abs(c.v) < 2) { c.a = c.T = c.v = 0; } else busy = true;
    C.style.transform = c.a ? `rotate(${c.a}deg)` : '';
    // n: a bouncy spring, unless a finger is holding it.
    if (!n.drag) {
      n.v += (-170 * (n.x - n.T) - 9 * n.v) * dt; n.x += n.v * dt;
      if (Math.abs(n.x - n.T) < .15 && Math.abs(n.v) < 3) { n.x = n.T; n.v = 0; } else busy = true;
    } else busy = true;
    if (ready) drawN();
    raf = busy ? requestAnimationFrame(step) : 0;
  }

  // ---- input ---------------------------------------------------------------------
  C.addEventListener('pointerdown', e => { e.preventDefault(); spin(1); });
  C.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse' && Math.abs(c.T - c.a) < 30) spin(1); });

  let tapTimer = 0;
  W.addEventListener('pointerdown', e => {
    e.preventDefault();
    clearTimeout(tapTimer);
    try { W.setPointerCapture(e.pointerId); } catch (err) {}
    n.drag = { id: e.pointerId, x0: e.clientX, from: Math.max(0, n.x), t0: performance.now(), moved: false, lx: n.x, lt: performance.now() };
    n.v = 0; W.classList.add('drag'); go();
  });
  W.addEventListener('pointermove', e => {
    const d = n.drag;
    if (!d || e.pointerId !== d.id) return;
    const dx = e.clientX - d.x0;
    if (Math.abs(dx) > 6) d.moved = true;
    if (!d.moved) return;
    // The pill stays centred, so the n has to grow twice as far for its end to keep up with the finger.
    const now = performance.now(), x = rubber(d.from + 2 * dx);
    if (now > d.lt) { n.v = (x - d.lx) / ((now - d.lt) / 1000); d.lx = x; d.lt = now; }
    n.x = x;
  });
  function release(e) {
    const d = n.drag;
    if (!d || e.pointerId !== d.id) return;
    n.drag = null; W.classList.remove('drag');
    n.v = Math.max(-3000, Math.min(3000, n.v));
    if (!d.moved) boing(); else n.T = 0;
    go();
  }
  W.addEventListener('pointerup', release);
  W.addEventListener('pointercancel', release);
  W.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse' && !n.drag) { n.T = Math.min(maxX, .9 * F); go(); } });
  W.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse' && !n.drag) { n.T = 0; go(); } });
  function boing(len = 4 * F, hold = 380) {
    n.T = Math.min(maxX, len); go();
    tapTimer = setTimeout(() => { n.T = 0; go(); }, hold);
  }

  // ---- start ---------------------------------------------------------------------
  const start = () => {
    measure();
    if (reduce) return;
    // A little hint that these letters do things.
    setTimeout(() => spin(1), 900);
    setTimeout(() => boing(2.4 * F, 260), 1900);
  };
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(start, start);
  addEventListener('resize', () => { if (ready) measure(); });
})();
