(() => {
  const sec = document.getElementById('web'), stage = document.getElementById('stage');
  const svg = document.getElementById('lines'), head = document.getElementById('head');
  const hello = document.getElementById('hello'), hint = document.getElementById('hint'), tag = document.getElementById('tagline');
  const nodes = [...stage.querySelectorAll('.node')];
  const flairs = [...stage.querySelectorAll('.flair')];  // flair.js layers ride along with the head
  const byId = {}; nodes.forEach(n => byId[n.dataset.id] = n);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease = t => 1 - Math.pow(1 - t, 3);
  let W, H, portrait, headEnd, paths = [];

  // reveal order: head's children first, then grandchildren
  const depth = n => n.dataset.from === 'head' ? 0 : 1 + depth(byId[n.dataset.from]);
  const order = [...nodes].sort((a, b) => depth(a) - depth(b));
  const step = Math.min(0.075, 0.46 / Math.max(1, order.length - 1));
  order.forEach((n, i) => n._start = 0.32 + i * step);

  function layout() {
    W = stage.clientWidth; H = stage.clientHeight; portrait = W < H;
    headEnd = { x: W * 0.5, y: H * (portrait ? 0.2 : 0.17), s: portrait ? 0.48 : 0.42 };
    nodes.forEach(n => {
      const [x, y] = (portrait ? n.dataset.p : n.dataset.l).split(',').map(Number);
      let cx = W * x / 100, cy = H * y / 100;
      const hw = n.offsetWidth / 2 + 10, hh = n.offsetHeight / 2 + 10;
      n._x = clamp(cx, hw, W - hw); n._y = clamp(cy, hh, H - hh);
      n.style.left = n._x + 'px'; n.style.top = n._y + 'px';
    });
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.innerHTML = '';
    paths = nodes.map(n => {
      const from = n.dataset.from === 'head' ? { _x: headEnd.x, _y: headEnd.y } : byId[n.dataset.from];
      const x1 = from._x, y1 = from._y, x2 = n._x, y2 = n._y;
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1;
      const bend = (x2 < x1 ? -1 : 1) * 0.18;
      const qx = mx - dy * bend, qy = my + dx * bend;
      const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      p.setAttribute('d', `M${x1},${y1} Q${qx},${qy} ${x2},${y2}`);
      svg.appendChild(p);
      const len = p.getTotalLength();
      p.style.strokeDasharray = len; p._len = len; p._node = n;
      return p;
    });
    update();
  }

  function update() {
    const range = sec.offsetHeight - stage.clientHeight;
    const p = reduce ? 1 : clamp((scrollY - sec.offsetTop) / (range || 1));
    const h = ease(clamp(p / 0.3));
    const y0 = H * 0.42; const x = W * 0.5, y = y0 + (headEnd.y - y0) * h, s = 1 + (headEnd.s - 1) * h;
    head.style.transform = `translate(${x - W / 2}px, ${y - H / 2}px) translate(-50%,-50%) scale(${s})`;
    flairs.forEach(f => f.style.transform = head.style.transform);
    if (tag) tag.style.opacity = 1 - clamp(p / 0.15);
    head.style.left = '50%'; head.style.top = '50%';
    hello.style.opacity = 1 - clamp(p / 0.15);
    hint.style.opacity = 1 - clamp(p / 0.1);
    paths.forEach(path => {
      const n = path._node, t = ease(clamp((p - n._start) / 0.14));
      path.style.strokeDashoffset = path._len * (1 - t);
      const nt = ease(clamp((p - n._start - 0.08) / 0.1));
      n.style.opacity = nt;
      n.style.transform = `translate(-50%,-50%) scale(${0.6 + 0.4 * nt})`;
      n.style.pointerEvents = nt > 0.5 ? 'auto' : 'none';
    });
  }

  let raf = 0;
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; update(); }); }, { passive: true });
  addEventListener('resize', layout);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
  layout();
})();
