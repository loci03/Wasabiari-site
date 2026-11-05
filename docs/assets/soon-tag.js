// "Coming soon" pill toys (Ivan, 11-05): spin the C in "Coming" and stretch the n in "soon".
// C: tap to spin it. Quick taps make it whizz, and a whizzing C flicks through colours and lands on
//    a new one. Spin it a LOT and it lands rainbow.
// n: grab "soon" and pull the n's last leg anywhere. The arch stretches and thins like taffy, the leg
//    flops about, and on release it twangs back. A tap makes it hop.
// Works with touch (iPhone) and mouse; mouse hover gives a small taste of each.
(() => {
  const tag = document.getElementById('soon-tag');
  if (!tag) return;
  const C = tag.querySelector('.tc'), W = tag.querySelector('.tw'), N = tag.querySelector('.tn');
  const [, nl, nb, nr] = N.children, nk = nb.firstElementChild, neckPath = nk.querySelector('path');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let F = 26, nW = 15, A = 7, th = 3.5, maxX = 120, maxY = 30, ready = false;

  // ---- measuring -----------------------------------------------------------------
  function measure() {
    F = parseFloat(getComputedStyle(tag).fontSize);
    nW = N.firstElementChild.offsetWidth;
    // The n is cut at A, the middle of the top of its arch, between the two stems. Pulling moves the
    // right half (the leg) and a drawn neck the same thickness as the arch joins the two halves.
    // A and the arch thickness come from drawing the n on a canvas, so they fit whatever font shows.
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
    th = top - bot;
    nl.style.clipPath = nl.style.webkitClipPath = `inset(-60% ${nW - A}px -60% -30%)`;
    nr.style.clipPath = nr.style.webkitClipPath = `inset(-60% -30% -60% ${A}px)`;
    nb.style.left = A - .5 + 'px';
    nk.style.height = th + 'px';
    nk.style.verticalAlign = bot + 'px'; // sits on the text baseline, so the neck lines up with the glyph
    nr.style.transformOrigin = `${A}px ${nk.offsetTop + th / 2}px`; // the leg swings from the cut
    const base = tag.offsetWidth - Math.max(0, n.x);
    maxX = Math.max(nW, Math.min(9 * F, innerWidth - 32 - base));
    maxY = 1.3 * F;
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
  // x, y: where the leg is pulled to. tilt: how far the leg leans. sag: the neck's droop and twang.
  const n = { x: 0, y: 0, vx: 0, vy: 0, T: 0, tilt: 0, tv: 0, sag: 0, sv: 0, px: 0, py: 0, drag: null };
  const f2 = v => Math.round(v * 100) / 100;
  function drawN() {
    const x = Math.max(-.4 * nW, n.x), y = n.y, a = n.tilt, moved = Math.abs(y) > .05 || Math.abs(a) > .05;
    N.style.width = nW + x + 'px';
    if (x >= 0) {
      N.style.transform = '';
      nr.style.transform = x > .05 || moved ? `translate(${f2(x)}px,${f2(y)}px) rotate(${f2(a)}deg)` : '';
      neck(x, y, a);
    } else { // springing back past rest: a quick squash
      N.style.transform = `scaleX(${(nW + x) / nW})`;
      nr.style.transform = moved ? `translate(0,${f2(y)}px) rotate(${f2(a)}deg)` : '';
      neck(0, y, a);
    }
  }
  // The neck runs from the cut on the left half to the cut on the leg, with handles along each end
  // so it leaves both halves smoothly. It thins as it gets longer and droops by n.sag.
  function neck(x, y, a) {
    const L = Math.hypot(x, y);
    if (L < .3 && Math.abs(a) < .5) { neckPath.setAttribute('d', ''); return; }
    const r = a * Math.PI / 180, co = Math.cos(r), si = Math.sin(r), h = th / 2;
    const jx = .5 + x, jy = h + y; // the leg's cut, in the neck's own coordinates (left cut is at .5, h)
    const tx = jx + .5 * co + h * si, ty = jy + .5 * si - h * co; // leg end, top corner (turned with the leg)
    const bx = jx + .5 * co - h * si, by = jy + .5 * si + h * co; // leg end, bottom corner
    const k = Math.max(L * .42, 1), dx = k * co, dy = k * si;
    const pinch = h * (1 - Math.max(.6, 1 / (1 + L / (6 * F))));
    const s = n.sag * Math.min(1, L / (2 * F));
    neckPath.setAttribute('d', `M0,0C${f2(k)},${f2(s + pinch)} ${f2(tx - dx)},${f2(ty - dy + s + pinch)} ${f2(tx)},${f2(ty)}` +
      `L${f2(bx)},${f2(by)}C${f2(bx - dx)},${f2(by - dy + s - pinch)} ${f2(k)},${f2(th + s - pinch)} 0,${f2(th)}Z`);
  }
  // Follows the finger, then gets stiffer near the edge of the screen.
  function rubberX(r) {
    if (r <= 0) return -.4 * nW * (1 - Math.exp(r / 40));
    const k = .7 * maxX;
    return r < k ? r : k + (maxX - k) * (1 - Math.exp(-(r - k) / (maxX - k)));
  }
  const rubberY = v => maxY * Math.tanh(v / maxY);

  // ---- the C ---------------------------------------------------------------------
  const COLORS = ['#1b1b1b', '#e8338a', '#6a35d9', '#1e5fd9', '#d9342b', '#ff7a00'];
  const c = { a: 0, v: 0, T: 0, pop: 0, ci: 0, whizz: false, from: 0, acc: 0, spun: 0, wild: false };
  function spin(turns) { c.T += 360 * turns; go(); }
  function paintC() {
    C.style.color = COLORS[c.ci];
    C.classList.toggle('rainbow', c.wild && !c.whizz);
  }

  // ---- animation loop --------------------------------------------------------------
  let raf = 0, last = 0;
  function go() { if (!raf) { last = performance.now(); raf = requestAnimationFrame(step); } }
  function step(now) {
    const dt = Math.min(.032, (now - last) / 1000 || .016); last = now;
    let busy = false;
    // C: a springy wheel; every tap adds a turn, so fast taps make it whizz.
    c.v += (-70 * (c.a - c.T) - 10 * c.v) * dt; c.a += c.v * dt;
    const sp = Math.abs(c.v);
    if (sp > 2100) { // whizzing: flick through the colours as it goes round
      if (!c.whizz) { c.whizz = true; c.from = c.ci; c.acc = c.spun = 0; c.wild = false; }
      c.acc += sp * dt; c.spun += sp * dt;
      if (c.spun > 1500) c.wild = true; // about four whizzing turns: six or so quick taps
      while (c.acc >= 150) { c.acc -= 150; c.ci = (c.ci + 1) % COLORS.length; }
      paintC();
    } else if (c.whizz) { // slowing down: land on a new colour, with a little pop
      c.whizz = false;
      if (c.ci === c.from) c.ci = (c.ci + 1) % COLORS.length;
      c.pop = .35; paintC();
    }
    c.pop *= Math.exp(-7 * dt); if (c.pop < .005) c.pop = 0; else busy = true;
    if (Math.abs(c.a - c.T) < .2 && Math.abs(c.v) < 2) { c.a = c.T = c.v = 0; } else busy = true;
    C.style.transform = c.a || c.pop ? `rotate(${f2(c.a)}deg) scale(${f2(1 + c.pop)})` : '';
    // n: springs, unless a finger is holding the leg.
    const L = Math.hypot(Math.max(0, n.x), n.y);
    if (n.drag) {
      const k = Math.min(1, dt * 18); // smoothed finger speed, so the leg can lean into the pull
      n.vx += ((n.x - n.px) / dt - n.vx) * k; n.vy += ((n.y - n.py) / dt - n.vy) * k;
      busy = true;
    } else {
      n.vx += (-170 * (n.x - n.T) - 9 * n.vx) * dt; n.x += n.vx * dt;
      n.vy += (-150 * n.y - 7 * n.vy) * dt; n.y += n.vy * dt;
    }
    n.px = n.x; n.py = n.y;
    // The leg leans against its motion like a floppy noodle, and the stretched neck droops.
    const lean = Math.max(-28, Math.min(28, n.vx * .012 + n.vy * .004));
    n.tv += (-140 * (n.tilt - lean) - 7 * n.tv) * dt; n.tilt += n.tv * dt;
    const droop = n.drag ? Math.min(.45 * F, L * .05) : 0;
    n.sv += (-220 * (n.sag - droop) - 4 * n.sv) * dt; n.sag += n.sv * dt;
    const still = Math.abs(n.x - n.T) < .15 && Math.abs(n.vx) < 3 && Math.abs(n.y) < .15 && Math.abs(n.vy) < 3 &&
      Math.abs(n.tilt) < .1 && Math.abs(n.tv) < 2 && Math.abs(n.sag) < .1 && Math.abs(n.sv) < 2;
    if (!n.drag && still) { n.x = n.T; n.y = n.vx = n.vy = n.tilt = n.tv = n.sag = n.sv = 0; } else busy = true;
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
    n.drag = { id: e.pointerId, x0: e.clientX, y0: e.clientY, fx: Math.max(0, n.x), fy: n.y, moved: false };
    W.classList.add('drag'); go();
  });
  W.addEventListener('pointermove', e => {
    const d = n.drag;
    if (!d || e.pointerId !== d.id) return;
    const dx = e.clientX - d.x0, dy = e.clientY - d.y0;
    if (Math.hypot(dx, dy) > 6) d.moved = true;
    if (!d.moved) return;
    // The pill stays centred, so the n grows twice as far for its leg to keep up with the finger.
    n.x = rubberX(d.fx + 2 * dx);
    n.y = rubberY(d.fy + dy);
  });
  function release(e) {
    const d = n.drag;
    if (!d || e.pointerId !== d.id) return;
    n.drag = null; W.classList.remove('drag');
    n.vx = Math.max(-3000, Math.min(3000, n.vx)); n.vy = Math.max(-3000, Math.min(3000, n.vy));
    if (!d.moved) boing();
    else { n.T = 0; n.sv -= Math.min(Math.hypot(n.x, n.y), 6 * F) * 1.5; } // let go: twang
    go();
  }
  W.addEventListener('pointerup', release);
  W.addEventListener('pointercancel', release);
  W.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse' && !n.drag) { n.T = Math.min(maxX, .9 * F); go(); } });
  W.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse' && !n.drag) { n.T = 0; go(); } });
  function boing(len = 4 * F, hold = 380) { // stretch out, hop up, then twang back
    n.T = Math.min(maxX, len); n.vy -= 9 * F; go();
    tapTimer = setTimeout(() => { n.T = 0; n.sv -= len * .8; go(); }, hold);
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
