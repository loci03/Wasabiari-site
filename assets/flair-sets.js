// The flair sets that fly around Ariel's head (used by flair.js, which loads after this file).
// SP = sprites (small SVG stickers in the Sticker Pop style: bold black outlines, flat colours).
// THEMES = how each set moves. EVERYDAY = the sets in the random rotation (SEASONAL ones only in
// their season). HOLIDAYS = which set takes over on which dates (Boston time).
// To add a set: draw its sprite(s) in SP, add a THEMES entry, then add its name to EVERYDAY or HOLIDAYS.
//
// THEMES fields (a field can also be a function of the part number i, for mixed sets):
//   n        how many things fly          size   [min, max] width as a fraction of the portrait
//   mode     ring  evenly spaced on one tilted ring around her head
//            free  each on its own tilted ring, with a wobble      loop  free + loop-the-loops
//            rise  floats up past her head (balloons)               fall  drifts down (snow, leaves)
//            pop   appears, grows and fades at a random spot (fireworks)
//   speed, r angular speed and ring radius ranges   face  degrees to turn toward travel, or 'flip'
//            (drawn facing right, mirrored when moving left)      spin  keeps turning
//   cls      CSS class on the part (flutter, buzz, hum, blink, glow, twinkle; see flair.css)
//   trail    true (sparkles), 'rainbow', 'dots' or 'bubble'; trailEvery = ms between trail bits
//   zig / bob / hop   small extra wiggles (zigzag, bobbing, hopping); dart = seconds per dart+pause
(() => {
  const INK = '#1b1b1b';
  const svg = (body, vb = '0 0 100 100') => `<svg viewBox="${vb}" aria-hidden="true" focusable="false">${body}</svg>`;
  const st = (w = 4) => `stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
  const mir = (d, a) => `<path d="${d}" ${a}/><path d="${d}" transform="matrix(-1 0 0 1 100 0)" ${a}/>`;
  const around = (n, f, start = 0) => Array.from({ length: n }, (_, k) => f(start + k * 360 / n, k)).join('');
  const line = (d, c, w = 5) => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w + 4}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const eyes = (y = 50, dx = 11, r = 3.6, cx = 50) => `<circle cx="${cx - dx}" cy="${y}" r="${r}" fill="${INK}"/><circle cx="${cx + dx}" cy="${y}" r="${r}" fill="${INK}"/><circle cx="${cx - dx + 1.2}" cy="${y - 1.3}" r="${r / 3}" fill="#fff"/><circle cx="${cx + dx + 1.2}" cy="${y - 1.3}" r="${r / 3}" fill="#fff"/>`;
  const smile = (y = 60, w = 8, cx = 50) => `<path d="M${cx - w} ${y}q${w} ${w * .8} ${w * 2} 0" fill="none" ${st(3)}/>`;
  const blush = (y = 60, dx = 20, cx = 50) => `<ellipse cx="${cx - dx}" cy="${y}" rx="5" ry="3" fill="#ff9fb8" opacity=".8"/><ellipse cx="${cx + dx}" cy="${y}" rx="5" ry="3" fill="#ff9fb8" opacity=".8"/>`;
  const flameD = (x, y, s = 1) => `M${x} ${y - 16 * s}C${x + 7 * s} ${y - 7 * s} ${x + 5 * s} ${y} ${x} ${y}C${x - 5 * s} ${y} ${x - 7 * s} ${y - 7 * s} ${x} ${y - 16 * s}z`;
  const flame = (x, y, s = 1) => `<g class="flick"><path d="${flameD(x, y, s)}" fill="#ffb000" ${st(2.5)}/><path d="${flameD(x, y - 1.5 * s, .5 * s)}" fill="#fff6b0"/></g>`;
  const pixels = (rows, pal) => {  // tiny pixel art: one character per pixel
    const n = Math.max(rows.length, ...rows.map(r => r.length)), c = 100 / n;
    let out = '';
    rows.forEach((r, y) => [...r].forEach((ch, x) => { if (pal[ch]) out += `<rect x="${(x * c).toFixed(2)}" y="${(y * c).toFixed(2)}" width="${(c + .3).toFixed(2)}" height="${(c + .3).toFixed(2)}" fill="${pal[ch]}"/>`; }));
    return `<g shape-rendering="crispEdges">${out}</g>`;
  };

  const C = { lilac: '#c9a8f2', green: '#9bd34a', yellow: '#ffd23f', pink: '#ff8fb1', blue: '#7cc6fe', red: '#e8322f', orange: '#ff8a3d', navy: '#1f4fa8', gold: '#ffd23f', brown: '#8a5a3c' };
  const BRIGHT = [C.lilac, C.green, C.yellow, C.pink, C.blue];
  const BF = [['#c9a8f2', '#e6d6fa'], ['#9bd34a', '#cdeaa0'], ['#ffd23f', '#ffe98f'], ['#ff8fb1', '#ffc4d6'], ['#7cc6fe', '#bfe3ff']];
  const RWB = [C.red, '#fff', C.navy];

  // ---------- sprites ----------
  const SP = {
    // --- the original nine sets ---
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

    // --- critters ---
    ladybug: c => svg(`<g class="flap">${mir('M44 44C28 34 10 46 14 70c3 14 20 16 32 4z', `fill="#e9f6ff" fill-opacity=".85" ${st(3)}`)}</g>
      <path d="M45 15Q40 6 33 5M55 15Q60 6 67 5" fill="none" ${st(3)}/>
      <circle cx="50" cy="24" r="12" fill="${INK}"/><circle cx="45" cy="21" r="2.6" fill="#fff"/><circle cx="55" cy="21" r="2.6" fill="#fff"/>
      ${mir('M50 31C30 31 20 50 23 66c3 16 16 25 27 25z', `fill="${c}" ${st()}`)}
      <circle cx="37" cy="50" r="5.5" fill="${INK}"/><circle cx="35" cy="71" r="4.5" fill="${INK}"/><circle cx="63" cy="50" r="5.5" fill="${INK}"/><circle cx="65" cy="71" r="4.5" fill="${INK}"/>
      <path d="M50 31V91" ${st(3)}/>`),
    bee: () => svg(`<path d="M20 50L5 56 20 62z" fill="${INK}"/>
      <ellipse cx="50" cy="56" rx="32" ry="22" fill="#ffd23f" ${st()}/>
      <path d="M38 36Q33 56 38 76M54 34Q49 56 54 78" fill="none" stroke="${INK}" stroke-width="7"/>
      <circle cx="82" cy="52" r="13" fill="${INK}"/><circle cx="86" cy="48" r="3.4" fill="#fff"/><path d="M82 58q4 3 8 0" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M86 40Q90 28 97 28" fill="none" ${st(3)}/>
      <g class="flap"><ellipse cx="42" cy="26" rx="12" ry="17" transform="rotate(-20 42 26)" fill="#e9f6ff" fill-opacity=".9" ${st(3)}/>
      <ellipse cx="58" cy="25" rx="10" ry="15" transform="rotate(22 58 25)" fill="#e9f6ff" fill-opacity=".9" ${st(3)}/></g>`),
    hummingbird: c => svg(`<path d="M32 56L6 70l4-10-6-6 26-6z" fill="#4f8f12" ${st(3)}/>
      <path d="M26 52c4-14 26-18 40-12 10 4 10 18-2 24-14 6-32 2-38-12z" fill="${c}" ${st()}/>
      <path d="M60 56c6-2 12 0 12 4-6 4-12 2-12-4z" fill="#ff4f7b"/>
      <circle cx="70" cy="42" r="11" fill="${c}" ${st()}/><circle cx="73" cy="40" r="3" fill="${INK}"/><circle cx="74" cy="39" r="1" fill="#fff"/>
      <path d="M80 40L99 37 80 45z" fill="${INK}" ${st(2)}/>
      <g class="flapY"><path d="M46 46C38 18 52 6 68 12c-6 12-8 24-14 36z" fill="#bfe3ff" ${st(3)}/></g>`),
    firefly: () => svg(`<defs><radialGradient id="fl-ff"><stop offset="0" stop-color="#fff9c4"/><stop offset=".5" stop-color="#e8ff6b" stop-opacity=".55"/><stop offset="1" stop-color="#e8ff6b" stop-opacity="0"/></radialGradient></defs>
      <circle class="lit" cx="50" cy="66" r="46" fill="url(#fl-ff)"/>
      <g class="flap"><ellipse cx="36" cy="38" rx="10" ry="17" transform="rotate(-32 36 38)" fill="#e9f6ff" fill-opacity=".85" ${st(3)}/><ellipse cx="64" cy="38" rx="10" ry="17" transform="rotate(32 64 38)" fill="#e9f6ff" fill-opacity=".85" ${st(3)}/></g>
      <ellipse cx="50" cy="46" rx="11" ry="15" fill="#5a4a7a" ${st()}/>
      <ellipse cx="50" cy="67" rx="12" ry="11" fill="#fdfbe0" ${st()}/><ellipse class="lit" cx="50" cy="67" rx="10" ry="9" fill="#e8ff6b"/>
      <circle cx="50" cy="28" r="8" fill="${INK}"/><path d="M46 22Q42 12 36 10M54 22Q58 12 64 10" fill="none" ${st(2.5)}/>`),
    dragonfly: c => svg(`<g class="flap" fill="#e9f6ff" fill-opacity=".85">
      <ellipse cx="27" cy="38" rx="25" ry="7" transform="rotate(-10 27 38)" ${st(3)}/><ellipse cx="73" cy="38" rx="25" ry="7" transform="rotate(10 73 38)" ${st(3)}/>
      <ellipse cx="29" cy="52" rx="23" ry="6.5" transform="rotate(14 29 52)" ${st(3)}/><ellipse cx="71" cy="52" rx="23" ry="6.5" transform="rotate(-14 71 52)" ${st(3)}/></g>
      <rect x="45" y="42" width="10" height="52" rx="5" fill="${c}" ${st(3)}/><path d="M45 58h10M45 70h10M45 82h10" ${st(2)}/>
      <ellipse cx="50" cy="40" rx="9" ry="11" fill="${c}" ${st(3)}/>
      <circle cx="50" cy="23" r="10" fill="${c}" ${st(3)}/><circle cx="44" cy="20" r="5" fill="${INK}"/><circle cx="56" cy="20" r="5" fill="${INK}"/><circle cx="45" cy="18.5" r="1.6" fill="#fff"/><circle cx="57" cy="18.5" r="1.6" fill="#fff"/>`),
    goldfish: () => svg(`<g class="wag"><path d="M32 50C18 34 6 32 3 36c6 8 6 20 0 28 3 4 15 2 29-14z" fill="#ffb347" ${st()}/></g>
      <path d="M48 33c4-12 16-12 22-3z" fill="#ffb347" ${st(3)}/><path d="M54 67c2 10 10 12 14 3z" fill="#ffb347" ${st(3)}/>
      <ellipse cx="57" cy="50" rx="31" ry="20" fill="#ff8a3d" ${st()}/>
      <path d="M68 37q-6 13 0 26" fill="none" stroke="#d9601a" stroke-width="3" stroke-linecap="round"/>
      <path d="M44 42q5 4 0 8M52 52q5 4 0 8M40 56q5 4 0 8" fill="none" stroke="#ffc27a" stroke-width="3" stroke-linecap="round"/>
      <circle cx="77" cy="44" r="5.5" fill="#fff" ${st(2)}/><circle cx="78" cy="44" r="2.6" fill="${INK}"/>
      <path d="M84 55q3 2 5-2" fill="none" ${st(2.5)}/>`),
    jellyfish: c => svg(`<g class="wiggle" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"><path d="M32 54q-6 12 0 22t0 20M44 56q5 12 0 22t0 18M56 56q-5 12 0 22t0 18M68 54q6 12 0 22t0 20"/></g>
      <g class="pulse"><path d="M16 56C16 20 84 20 84 56c-7-4-11 4-18 0s-11-4-16 0-11 4-16 0-11-4-18 0z" fill="${c}" ${st()}/>
      <path d="M30 38q6-10 16-12" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".85"/>
      ${eyes(44, 9, 3.2)}${smile(48, 4)}</g>`),
    duck: () => svg(`<path d="M10 60c0-14 16-16 30-10 6 2 14 2 18-2-2-8 0-20 12-24 14-4 24 6 22 18-2 8-8 12-10 14 10 2 12 14 4 22-8 8-24 10-42 10-20 0-34-10-34-28z" fill="#ffd23f" ${st()}/>
      <path d="M90 38c8 0 12 6 6 10-4 2-8 0-10-2z" fill="#ff8a3d" ${st(3)}/>
      <circle cx="76" cy="34" r="4.2" fill="${INK}"/><circle cx="77.4" cy="32.6" r="1.4" fill="#fff"/><ellipse cx="81" cy="44" rx="4" ry="2.6" fill="#ff9fb8"/>
      <path d="M32 62c8-6 24-4 28 4-6 8-20 8-28-4z" fill="#ffc21a" ${st(3)}/>`),
    kitten: c => svg(`${mir('M18 44L22 8l24 22z', `fill="${c}" ${st()}`)}${mir('M25 34l1-15 11 11z', 'fill="#ffb3c8"')}
      <ellipse cx="50" cy="58" rx="37" ry="31" fill="${c}" ${st()}/>
      <g class="blinky"><ellipse cx="36" cy="53" rx="5" ry="7" fill="${INK}"/><ellipse cx="64" cy="53" rx="5" ry="7" fill="${INK}"/><circle cx="37.5" cy="50.5" r="1.8" fill="#fff"/><circle cx="65.5" cy="50.5" r="1.8" fill="#fff"/></g>
      <path d="M46 63h8l-4 5z" fill="#ff8fb1" ${st(2)}/><path d="M50 68q-5 6-10 2M50 68q5 6 10 2" fill="none" ${st(2.5)}/>
      <path d="M8 60h16M9 70l15-4M92 60H76M91 70l-15-4" fill="none" ${st(2)}/>${blush(64, 22)}`),
    yarn: c => svg(`<path d="M76 74c12 8 14 18 6 24" fill="none" ${st(3)}/>
      <circle cx="50" cy="50" r="34" fill="${c}" ${st()}/>
      <path d="M22 38c18 8 38-6 58 4M18 56c22 6 44-10 64 2M28 76c16-6 32-2 44 4M40 18c-8 22-6 46 6 66" fill="none" stroke="#fff" stroke-width="3" opacity=".7" stroke-linecap="round"/>`),
    unicorn: () => svg(`<path d="M34 28C22 38 22 60 30 76c6-10 4-18 10-24-2 12 2 22 10 28 2-16-2-30-4-44z" fill="#c9a8f2" ${st(3)}/>
      <path d="M40 30c10-8 26-8 36 2 8 8 16 18 14 26-2 8-10 10-18 6-6-2-10 2-12 10l-2 14H38l2-28c-4-12-6-22 0-30z" fill="#fff" ${st()}/>
      <ellipse cx="82" cy="58" rx="10" ry="8" fill="#ffd6e4" ${st(3)}/><circle cx="85" cy="56" r="1.6" fill="${INK}"/>
      <path d="M56 27L70 3l-4 26z" fill="#ffd23f" ${st(3)}/><path d="M60 22l7-2M58 15l8-2" ${st(2)}/>
      <path d="M48 26l-2-14 10 10z" fill="#fff" ${st(3)}/>
      <path d="M61 42q5-5 10 0" fill="none" ${st(3)}/><ellipse cx="70" cy="50" rx="4" ry="2.5" fill="#ff9fb8"/>
      <path d="M36 32c-6 10-6 24 0 36M42 30c-2 8 0 16 4 22" fill="none" stroke="#ff8fb1" stroke-width="4" stroke-linecap="round"/>
      <path d="M38 40c-4 8-2 18 2 26" fill="none" stroke="#7cc6fe" stroke-width="4" stroke-linecap="round"/>`),

    // --- treats ---
    donut: c => svg(`<path d="M10 50a40 40 0 1 0 80 0 40 40 0 1 0-80 0zM39 50a11 11 0 1 0 22 0 11 11 0 1 0-22 0z" fill="#e3a35b" fill-rule="evenodd" ${st()}/>
      <path d="M50 15c20 0 35 13 35 30 0 6-4 8-5 13-2 6 2 12-6 16-8 6-12 0-18 6-6 6-12-2-20 0-10 2-12-8-18-14-4-6-4-14-4-20 0-18 16-31 36-31zM39 50a11 11 0 1 0 22 0 11 11 0 1 0-22 0z" fill="${c}" fill-rule="evenodd" ${st(3)}/>
      <path d="M30 30l6 3M66 27l5-4M28 56l-2 6M62 68l5 4" stroke="#ffd23f" stroke-width="4.5" stroke-linecap="round"/>
      <path d="M72 46l6 2M44 25l6-1M40 70l-5 3M24 42l1 6" stroke="#7cc6fe" stroke-width="4.5" stroke-linecap="round"/>
      <path d="M56 32l3 5M74 60l-5 3M33 64l5 2" stroke="#fff" stroke-width="4.5" stroke-linecap="round"/>`),
    cupcake: (c, candle) => svg(`<path d="M22 56h56l-8 36H30z" fill="#7cc6fe" ${st()}/><path d="M37 58l3 32M50 58v32M63 58l-3 32" ${st(2.5)}/>
      <path d="M18 58c-8-8 0-20 10-18-2-12 12-18 20-12 6-10 22-6 22 4 12-2 18 12 10 20 6 6 0 10-8 8H28c-8 2-14 2-10-2z" fill="${c}" ${st()}/>
      <path d="M32 48l4 3M46 40l5-1M62 46l3 4M70 38l4-2" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
      ${candle ? `<rect x="46" y="10" width="8" height="22" rx="3" fill="#ff8fb1" ${st(3)}/><path d="M46 18l8-3M46 25l8-3" ${st(2)}/>${flame(50, 9)}`
        : `<g class="bounce"><path d="M55 12Q58 4 66 2" fill="none" ${st(3)}/><circle cx="54" cy="20" r="8" fill="#d9432f" ${st(3)}/><circle cx="51" cy="17" r="2" fill="#fff"/></g>`}`),
    icecream: (a, b) => svg(`<path d="M30 52l20 44 20-44z" fill="#e8b46a" ${st()}/>
      <path d="M38 58l16 22M48 54l14 16M62 56L46 78M54 54L38 68" stroke="#b9823c" stroke-width="3" stroke-linecap="round"/>
      <path d="M30 52l20 44 20-44z" fill="none" ${st()}/>
      <g class="wobble"><circle cx="50" cy="44" r="20" fill="${a}" ${st()}/><path d="M32 50q2 9 6 1 3 10 8 1 4 8 8 0 4 9 8-1 3 8 7-1" fill="${a}" ${st(3)}/>
      <circle cx="50" cy="24" r="16" fill="${b}" ${st()}/><circle cx="44" cy="19" r="3" fill="#fff" opacity=".8"/></g>`),
    taco: () => svg(`<g class="flap">${mir('M22 54C8 36 0 44 2 52c-4 6 8 12 22 10z', `fill="#fff" ${st(3)}`)}</g>
      <g transform="rotate(-12 50 56)"><path d="M14 30c0-6 72-6 72 0v24H14z" fill="#f7d77a" ${st(3)}/>
      <path d="M16 48c2-6 8-4 10-8 4 4 8-2 12 0 4-6 8 0 12-2 4 4 8-2 12 2 4-4 8 2 12 0 2 4 6 4 6 8z" fill="#8a5a3c" ${st(2.5)}/>
      <path d="M14 46c4-8 8-2 12-8 4 6 8-2 12 2 4-6 8 2 12-2 4 6 8-2 12 2 4-4 8 2 12-2l2 10H14z" fill="#7bd651" ${st(2.5)}/>
      <circle cx="30" cy="42" r="4.5" fill="#e8322f" ${st(2)}/><circle cx="58" cy="40" r="4.5" fill="#e8322f" ${st(2)}/><path d="M42 40l3 5M70 40l3 5M22 40l2 4" stroke="#ffd23f" stroke-width="4" stroke-linecap="round"/>
      <path d="M10 50c0 44 80 44 80 0z" fill="#f2c14e" ${st()}/><path d="M16 52q34 6 68 0" fill="none" stroke="#f7d77a" stroke-width="4" stroke-linecap="round"/>
      <circle cx="28" cy="70" r="1.8" fill="#d9a032"/><circle cx="72" cy="68" r="1.8" fill="#d9a032"/><circle cx="58" cy="82" r="1.8" fill="#d9a032"/>
      ${eyes(66, 10, 3.4)}${smile(72, 5)}</g>`),
    dumpling: () => svg(`<g class="steam">${line('M36 24c-6-8 6-12 0-20M52 22c-6-8 6-12 0-20M68 24c-6-8 6-12 0-20', '#fff', 4)}</g>
      <path d="M10 70c0-22 20-36 40-36s40 14 40 36c0 12-14 16-40 16S10 82 10 70z" fill="#fff4e0" ${st()}/>
      <path d="M30 40q4 10 0 18M42 35q4 11 0 21M58 35q-4 11 0 21M70 40q-4 10 0 18" fill="none" stroke="#d8c3a0" stroke-width="3" stroke-linecap="round"/>
      ${eyes(66, 12, 3.4)}${smile(72, 5)}${blush(72, 22)}`),
    boba: () => svg(`<path d="M58 2L52 32" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M58 2L52 32" stroke="#ff8fb1" stroke-width="6" stroke-linecap="round"/>
      <path d="M22 34c0-18 56-18 56 0z" fill="#fff" fill-opacity=".85" ${st(3)}/>
      <path d="M20 34h60l-8 60H28z" fill="#e8c9a0" ${st()}/>
      <g class="bob"><circle cx="36" cy="84" r="5" fill="#3b2a20"/><circle cx="48" cy="86" r="5" fill="#3b2a20"/><circle cx="60" cy="84" r="5" fill="#3b2a20"/><circle cx="42" cy="77" r="5" fill="#3b2a20"/><circle cx="55" cy="77" r="5" fill="#3b2a20"/></g>
      <rect x="17" y="30" width="66" height="9" rx="4.5" fill="#fff" ${st(3)}/>
      ${eyes(54, 10, 3.4)}${smile(60, 5)}${blush(60, 19)}`),
    watermelon: () => svg(`<path d="M8 32a42 42 0 0 0 84 0z" fill="#7bd651" ${st()}/><path d="M16 32a34 34 0 0 0 68 0z" fill="#ff5a6e" ${st(3)}/>
      <path d="M8 32h84" ${st()}/><path d="M36 42l2 5M50 46v5M64 42l-2 5M44 56l1 4M57 56l-1 4" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`),
    orange: () => svg(`<circle cx="50" cy="50" r="40" fill="#ff9a1f" ${st()}/><circle cx="50" cy="50" r="31" fill="#ffd27a"/>
      ${around(8, a => `<path d="M50 50L50 22" transform="rotate(${a} 50 50)" stroke="#ff9a1f" stroke-width="4" stroke-linecap="round"/>`, 22.5)}<circle cx="50" cy="50" r="4" fill="#fff"/>`),
    strawberry: () => svg(`<path d="M50 92C26 76 12 52 16 36c4-12 20-14 34-8 14-6 30-4 34 8 4 16-10 40-34 56z" fill="#ff4a5a" ${st()}/>
      <path d="M50 30C40 16 26 20 22 24c8 2 14 6 16 10-8 0-14 4-16 8 12-4 22-2 28-12zM50 30c10-14 24-10 28-6-8 2-14 6-16 10 8 0 14 4 16 8-12-4-22-2-28-12z" fill="#4f8f12" ${st(3)}/>
      <path d="M50 30V16" ${st(4)}/>
      <g fill="#fff3a0"><ellipse cx="34" cy="48" rx="2" ry="3"/><ellipse cx="50" cy="52" rx="2" ry="3"/><ellipse cx="66" cy="48" rx="2" ry="3"/><ellipse cx="40" cy="64" rx="2" ry="3"/><ellipse cx="60" cy="64" rx="2" ry="3"/><ellipse cx="50" cy="76" rx="2" ry="3"/></g>`),
    lollipop: c => svg(`<rect x="46" y="54" width="8" height="44" rx="4" fill="#fff" ${st(3)}/>
      <circle cx="50" cy="38" r="30" fill="${c}" ${st()}/>
      <path d="M50 38a4 4 0 0 1 8 0 8 8 0 0 1-16 0 12 12 0 0 1 24 0 16 16 0 0 1-32 0 20 20 0 0 1 40 0" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`),
    candy: (a, b) => svg(`${mir('M30 50L8 32l4 18-4 18z', `fill="${b}" ${st(3)}`)}
      <ellipse cx="50" cy="50" rx="24" ry="19" fill="${a}" ${st()}/><path d="M36 38l10 24M50 33l10 30" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".8"/>`),

    // --- sky and space ---
    rocket: () => svg(`<path class="flame" d="M40 76c0 14 10 22 10 22s10-8 10-22z" fill="#ffb000" ${st(3)}/>
      ${mir('M34 54L20 78l18-6z', `fill="#e8322f" ${st(3)}`)}
      <path d="M50 4c16 12 20 34 16 72H34c-4-38 0-60 16-72z" fill="#fff" ${st()}/>
      <path d="M50 4c8 6 12 12 14 20H36c2-8 6-14 14-20z" fill="#e8322f" ${st(3)}/>
      <circle cx="50" cy="44" r="9" fill="#7cc6fe" ${st(3)}/><circle cx="47" cy="41" r="2.5" fill="#fff"/>`),
    planet: (c, ring) => svg(`<g transform="rotate(-20 50 50)"><ellipse cx="50" cy="50" rx="46" ry="13" fill="none" stroke="${INK}" stroke-width="10"/><ellipse cx="50" cy="50" rx="46" ry="13" fill="none" stroke="${ring}" stroke-width="4.5"/></g>
      <circle cx="50" cy="50" r="27" fill="${c}" ${st()}/><path d="M30 44q20-8 40 0M28 56q22 8 44 0" fill="none" stroke="#fff" stroke-width="3.5" opacity=".55" stroke-linecap="round"/>
      <g transform="rotate(-20 50 50)"><path d="M4 50a46 13 0 0 0 92 0" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M4 50a46 13 0 0 0 92 0" fill="none" stroke="${ring}" stroke-width="4.5" stroke-linecap="round"/></g>`),
    moonlet: c => svg(`<circle cx="50" cy="50" r="38" fill="${c}" ${st()}/><circle cx="36" cy="40" r="8" fill="#fff" opacity=".35"/><circle cx="62" cy="62" r="6" fill="#fff" opacity=".35"/><circle cx="64" cy="34" r="4" fill="#fff" opacity=".35"/>`),
    ufo: () => svg(`<circle cx="50" cy="38" r="9" fill="#9bd34a" ${st(2.5)}/><circle cx="46" cy="37" r="2.4" fill="${INK}"/><circle cx="54" cy="37" r="2.4" fill="${INK}"/>
      <path d="M46 29l-3-7M54 29l3-7" ${st(2)}/><circle cx="43" cy="21" r="2.4" fill="#9bd34a" ${st(1.5)}/><circle cx="57" cy="21" r="2.4" fill="#9bd34a" ${st(1.5)}/>
      <path d="M28 48c0-28 44-28 44 0z" fill="#bfe3ff" fill-opacity=".75" ${st(3)}/>
      <ellipse cx="50" cy="55" rx="45" ry="14" fill="#b8b2c6" ${st()}/>
      <g class="lights"><circle cx="24" cy="57" r="4.5" fill="#ffd23f" ${st(2)}/><circle cx="50" cy="62" r="4.5" fill="#ff8fb1" ${st(2)}/><circle cx="76" cy="57" r="4.5" fill="#9bd34a" ${st(2)}/></g>`),
    hotair: (a, b) => svg(`<path d="M50 4C22 4 10 26 14 44c4 14 18 22 24 30h24c6-8 20-16 24-30 4-18-8-40-36-40z" fill="${a}" ${st()}/>
      <path d="M50 4c-12 16-14 46-8 70h16c6-24 4-54-8-70z" fill="${b}" ${st(3)}/>
      <path d="M40 74l2 10M60 74l-2 10" ${st(2.5)}/><rect x="39" y="83" width="22" height="14" rx="3" fill="#c98b4a" ${st(3)}/><path d="M40 89h20" ${st(2)}/>`),
    rainbow: () => svg(`<path d="M12 70a38 38 0 0 1 76 0" fill="none" stroke="${INK}" stroke-width="31"/>
      ${['#ff5a6e', '#ffd23f', '#9bd34a', '#7cc6fe'].map((c, k) => `<path d="M${16 + k * 6.5} 70a${34 - k * 6.5} ${34 - k * 6.5} 0 0 1 ${2 * (34 - k * 6.5)} 0" fill="none" stroke="${c}" stroke-width="6.5"/>`).join('')}
      ${mir('M2 76c-2-12 10-18 18-12 4-10 20-8 20 4 8 0 10 12 2 16H8c-6 0-6-4-6-8z', `fill="#fff" ${st(3)}`)}`),
    cloud: () => svg(`<path d="M14 70c-12-2-10-22 4-20 0-16 18-24 30-14 6-12 28-12 32 4 14-2 20 18 8 26-4 6-12 6-16 4z" fill="#fff" ${st()}/>${eyes(56, 10, 3.2)}${smile(62, 5)}${blush(62, 20)}`),
    kite: (a, b) => svg(`<g class="wiggle"><path d="M50 66c-8 8 8 14 0 22-6 6 4 10 0 12" fill="none" ${st(3)}/>
      <path d="M44 76l6 3 6-3-6-3zM44 90l6 3 6-3-6-3z" fill="${b}" ${st(2)}/></g>
      <path d="M50 2l30 32-30 32-30-32z" fill="${a}" ${st()}/><path d="M50 2l30 32H50zM50 34H20l30 32z" fill="${b}"/>
      <path d="M50 2l30 32-30 32-30-32z" fill="none" ${st()}/><path d="M50 2v64M20 34h60" ${st(2.5)}/>`),

    // --- make and play ---
    pixcoin: () => svg(`<g class="spin3d">${pixels(['..KKKK..', '.KYYYYK.', 'KYWYYYOK', 'KYWYYYOK', 'KYWYYYOK', 'KYYYYYOK', '.KYOOOK.', '..KKKK..'], { K: INK, Y: '#ffd23f', W: '#fff6b0', O: '#e0a800' })}</g>`),
    pixheart: () => svg(pixels(['.KK..KK.', 'KRRKKRRK', 'KRWRRRRK', 'KRRRRRRK', '.KRRRRK.', '..KRRK..', '...KK...', '........'], { K: INK, R: '#ff4f7b', W: '#fff' })),
    pixstar: () => svg(pixels(['....K....', '...KYK...', 'KKKKYKKKK', 'KYYYYYYYK', '.KYWYYYK.', '..KYYYK..', '.KYYKYYK.', 'KYK...KYK', 'KK.....KK'], { K: INK, Y: '#ffd23f', W: '#fff6b0' })),
    crayon: c => svg(`<path d="M14 40h56l22 10-22 10H14z" fill="${c}" ${st()}/><path d="M70 40l22 10-22 10z" fill="#f5d7a8" ${st(3)}/><path d="M84 46l8 4-8 4z" fill="${c}"/>
      <rect x="28" y="40" width="28" height="20" fill="#fff" fill-opacity=".55" ${st(2.5)}/><rect x="8" y="40" width="8" height="20" rx="2" fill="${c}" ${st(3)}/>`),
    splat: c => svg(`<path d="M50 14c8 0 10 12 16 14 8 2 18-6 22 2s-8 14-6 22c2 10 12 14 6 22s-16-2-24 4c-6 6-4 16-14 16s-8-10-14-16c-8-6-18 4-24-4s4-12 6-22c2-8-10-14-6-22s18 0 22-2c6-2 8-14 16-14z" fill="${c}" ${st()}/>
      <circle cx="88" cy="16" r="5" fill="${c}" ${st(2.5)}/><circle cx="10" cy="88" r="4" fill="${c}" ${st(2.5)}/><circle cx="40" cy="40" r="5" fill="#fff" opacity=".6"/>`),
    crane: c => svg(`<path d="M26 60L4 40l26 18z" fill="${c}" ${st(3)}/>
      <path d="M18 62l32-12 28 12-28 10z" fill="${c}" ${st(3)}/>
      <path d="M70 60l18-30 8 4-12 4-8 24z" fill="${c}" ${st(3)}/>
      <g class="flapY"><path d="M36 56L58 10l4 46z" fill="#fff" ${st(3)}/></g>`),

    // --- seasons ---
    blossom: () => svg(`${around(5, a => `<ellipse cx="50" cy="28" rx="15" ry="19" transform="rotate(${a} 50 50)" fill="#ffc4d6" ${st(3)}/>`)}
      <circle cx="50" cy="50" r="11" fill="#ff8fb1" ${st(3)}/>${around(5, a => `<circle cx="50" cy="42" r="2.2" fill="#ffd23f" transform="rotate(${a} 50 50)"/>`, 36)}`),
    petal: () => svg(`<path d="M50 8l5 8 5-6c12 14 12 46-10 78C28 56 28 24 40 10l5 6z" fill="#ffc4d6" ${st(3)}/><path d="M50 30v40" stroke="#ff8fb1" stroke-width="3" stroke-linecap="round"/>`),
    sun: () => svg(`${around(8, a => line('M50 14V4', '#ffb000', 5).replace(/<path /g, `<path transform="rotate(${a} 50 50)" `))}
      <circle cx="50" cy="50" r="30" fill="#ffd23f" ${st()}/>
      <path d="M24 44h22v6c0 10-20 10-22 0zM54 44h22v6c-2 10-22 10-22 0z" fill="${INK}"/><path d="M46 46h8" ${st(3)}/>
      <path d="M29 47l6-1M59 47l6-1" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>${smile(63, 9)}`),
    shades: c => svg(`<path d="M6 40h40v10c0 16-36 16-38 0zM54 40h40l-2 10c-2 16-38 16-38 0z" fill="${INK}" ${st(3)}/><path d="M46 44q4-4 8 0" fill="none" ${st(4)}/>
      <path d="M14 44l14 0M62 44h14" stroke="${c}" stroke-width="4" stroke-linecap="round"/>`),
    maple: c => svg(`<path d="M50 4l8 18 12-6-4 20 20-8-6 16 16 6-18 10 6 12-22-4-8 16-4 12-4-12-8-16-22 4 6-12-18-10 16-6-6-16 20 8-4-20 12 6z" fill="${c}" ${st(3.5)}/>
      <path d="M50 94V40M50 62l18-16M50 62L32 46" fill="none" ${st(2.5)}/>`),
    oak: c => svg(`<path d="M50 6c10 4 6 14 14 18s2 14 8 20-4 14-2 22-12 10-14 18l-6 12-6-12c-2-8-14-10-12-18s-8-14-2-22 0-14 8-20 4-14 12-18z" fill="${c}" ${st(3.5)}/>
      <path d="M50 96V20M50 44l10-6M50 58l-10-6M50 72l10-6" fill="none" ${st(2.5)}/>`),
    snowflake: () => svg(around(6, a => `<g transform="rotate(${a} 50 50)">${line('M50 50V8M50 22l-9-8M50 22l9-8M50 36l-7-6M50 36l7-6', '#eaf6ff', 4.5)}</g>`) + `<circle cx="50" cy="50" r="6" fill="#eaf6ff" ${st(3)}/>`),

    // --- holidays ---
    firework: c => svg(around(12, a => `<g transform="rotate(${a} 50 50)">${line('M50 32V12', c, 4.5)}<circle cx="50" cy="5" r="4" fill="${c}" ${st(2.5)}/></g>`) + `<circle cx="50" cy="50" r="7" fill="${c}" ${st(3)}/>`),
    confetti: (c, k) => svg(`<g class="spin3d">${k % 2 ? `<rect x="32" y="16" width="36" height="68" rx="6" fill="${c}" ${st(4)}/>` : `<path d="M20 30c10-12 20 12 30 0s20 12 30 0v40c-10 12-20-12-30 0s-20-12-30 0z" fill="${c}" ${st(4)}/>`}</g>`),
    horn: (a, b) => svg(`<path d="M8 62l60-28 6 16-60 20z" fill="${a}" ${st()}/><path d="M24 55l4 10M40 48l4 11M56 41l4 12" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
      <path d="M6 58l4 12" ${st(6)}/>
      <g class="wiggle">${line('M72 42c16-10 26 4 16 10-8 6-12-4-4-6', b, 5)}</g>`),
    dove: () => svg(`<path d="M24 56L4 46l2 16 18 2z" fill="#fff" ${st(3)}/>
      <path d="M20 58c10-14 36-16 50-12 8 2 14-6 16-12 2-6 10-4 10 2 0 10-6 22-20 28-16 8-42 8-56-6z" fill="#fff" ${st()}/>
      <circle cx="88" cy="36" r="2.6" fill="${INK}"/><path d="M95 36l7 3-7 2z" fill="#ffb000" ${st(2)}/><path d="M98 42q8 2 10 8-8 0-10-8z" fill="#9bd34a" ${st(2)}/>
      <g class="flapY"><path d="M40 52c2-22 18-38 36-40-6 14-10 30-18 42z" fill="#f2f2f7" ${st(3)}/></g>`),
    heart: c => svg(`<g class="beat"><path d="M50 88C20 66 6 48 10 30c4-16 26-20 40-2 14-18 36-14 40 2 4 18-10 36-40 58z" fill="${c}" ${st()}/>
      <path d="M24 30q4-8 12-8" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/></g>`),
    letter: () => svg(`<rect x="10" y="24" width="80" height="54" rx="6" fill="#fff" ${st()}/><path d="M12 28l38 28 38-28" fill="none" ${st()}/>
      <path d="M50 66c-8-6-12-10-10-15 2-4 8-4 10 0 2-4 8-4 10 0 2 5-2 9-10 15z" fill="#ff4f7b" ${st(2.5)}/>`),
    arrow: () => svg(`<path d="M10 50h70" ${st(5)}/><path d="M76 40l20 10-20 10z" fill="#ff4f7b" ${st(3)}/>
      <path d="M10 50L2 40h12l8 10-8 10H2z" fill="#ff8fb1" ${st(3)}/>`),
    lantern: () => svg(`<defs><radialGradient id="fl-lamp"><stop offset="0" stop-color="#fff2a0" stop-opacity=".9"/><stop offset="1" stop-color="#ffb000" stop-opacity="0"/></radialGradient></defs>
      <g class="swing"><path d="M50 0v14" ${st(3)}/><circle cx="50" cy="48" r="48" fill="url(#fl-lamp)"/>
      <rect x="36" y="12" width="28" height="8" rx="2" fill="#ffd23f" ${st(3)}/>
      <ellipse cx="50" cy="48" rx="34" ry="30" fill="#e8322f" ${st()}/>
      <path d="M50 18c-14 12-14 48 0 60M50 18c14 12 14 48 0 60M50 18v60" fill="none" stroke="#a51d1d" stroke-width="3"/>
      <rect x="36" y="76" width="28" height="8" rx="2" fill="#ffd23f" ${st(3)}/>
      ${line('M44 84l-2 14M50 84v16M56 84l2 14', '#ffd23f', 3)}</g>`),
    luckycoin: () => svg(`<g class="spin3d"><path d="M12 50a38 38 0 1 0 76 0 38 38 0 1 0-76 0zM40 40h20v20H40z" fill="#ffd23f" fill-rule="evenodd" ${st()}/>
      <circle cx="50" cy="50" r="29" fill="none" stroke="#e0a800" stroke-width="3"/><path d="M40 40h20v20H40z" fill="none" ${st(3)}/></g>`),
    goat: () => svg(`${mir('M34 26C24 10 10 14 12 26c6-6 14-4 18 6z', `fill="#e8d8b8" ${st(3)}`)}
      ${mir('M30 40C20 36 8 40 6 46c8 4 18 4 26 0z', `fill="#fff" ${st(3)}`)}
      <path d="M44 76l6 20 6-20z" fill="#f2efe8" ${st(3)}/>
      <path d="M30 30c0-10 40-10 40 0 4 20-2 44-20 50-18-6-24-30-20-50z" fill="#fff" ${st()}/>
      ${eyes(46, 10, 3.6)}<ellipse cx="50" cy="64" rx="9" ry="6" fill="#ffc4d6" ${st(2.5)}/><circle cx="46" cy="64" r="1.4" fill="${INK}"/><circle cx="54" cy="64" r="1.4" fill="${INK}"/>${blush(56, 16)}`),
    mask: (c, f) => svg(`<path d="M76 36c2-18 14-28 20-30-2 14-8 26-16 34z" fill="${f}" ${st(3)}/><path d="M68 34c-2-16 6-26 12-30 2 12 0 24-6 32z" fill="#9bd34a" ${st(3)}/>
      <path d="M6 40c14-10 32-8 44 2 12-10 30-12 44-2-2 20-18 30-32 24-6-4-8-8-12-8s-6 4-12 8C24 70 8 60 6 40zM21 48a9 6 0 1 0 18 0 9 6 0 1 0-18 0zM61 48a9 6 0 1 0 18 0 9 6 0 1 0-18 0z" fill="${c}" fill-rule="evenodd" ${st()}/>
      <circle cx="18" cy="40" r="2.4" fill="#ffd23f"/><circle cx="82" cy="40" r="2.4" fill="#ffd23f"/><circle cx="50" cy="48" r="3" fill="#ffd23f" ${st(1.5)}/>`),
    beads: () => svg(around(12, (a, k) => `<circle cx="50" cy="14" r="8" transform="rotate(${a} 50 50)" fill="${['#8e44c9', '#4f8f12', '#ffd23f'][k % 3]}" ${st(2.5)}/>`)),
    flag: () => svg(`<path d="M14 8v88" ${st(5)}/>
      <g class="wave"><path d="M16 14c18-8 34 8 70 0v40c-36 8-52-8-70 0z" fill="#fff" ${st(3)}/>
      <path d="M16 22c18-8 34 8 70 0M16 38c18-8 34 8 70 0" fill="none" stroke="#e8322f" stroke-width="6"/>
      <path d="M16 14c10-4 18-2 26 1v20c-8-3-16-5-26-1z" fill="${C.navy}" ${st(2)}/><circle cx="24" cy="21" r="1.8" fill="#fff"/><circle cx="33" cy="22" r="1.8" fill="#fff"/><circle cx="28" cy="29" r="1.8" fill="#fff"/>
      <path d="M16 14c18-8 34 8 70 0v40c-36 8-52-8-70 0z" fill="none" ${st()}/></g>`),
    crescent: c => svg(`<path d="M62 8C38 12 22 32 24 54s22 40 46 38C52 84 42 68 42 50s8-34 20-42z" fill="${c}" ${st()}/>`),
    fanous: () => svg(`<circle class="lit" cx="50" cy="52" r="48" fill="url(#fl-lamp2)"/><defs><radialGradient id="fl-lamp2"><stop offset="0" stop-color="#fff2a0" stop-opacity=".9"/><stop offset="1" stop-color="#ffb000" stop-opacity="0"/></radialGradient></defs>
      <path d="M50 2v8" ${st(3)}/><path d="M32 26L50 8l18 18z" fill="#e0a800" ${st(3)}/>
      <path d="M30 26h40v44H30z" fill="#ffe46b" ${st()}/><path class="lit" d="M34 30h32v36H34z" fill="#fff6b0"/>
      <path d="M43 26v44M57 26v44M30 48h40" ${st(2.5)}/><path d="M50 36l3 6-3 6-3-6z" fill="#7cc6fe" ${st(1.5)}/>
      <path d="M30 70l20 18 20-18z" fill="#e0a800" ${st(3)}/>`),
    shamrock: () => svg(`<path d="M50 52q4 24 16 40" fill="none" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M50 52q4 24 16 40" fill="none" stroke="#3fae3f" stroke-width="4" stroke-linecap="round"/>
      ${around(3, a => `<path d="M50 50C30 50 22 30 32 22c8-6 16 0 18 8 2-8 10-14 18-8 10 8 2 28-18 28z" transform="rotate(${a} 50 50)" fill="#3fae3f" ${st(3.5)}/>`)}
      <circle cx="50" cy="50" r="4" fill="#3fae3f"/>`),
    gold: () => svg(`<g class="spin3d"><circle cx="50" cy="50" r="38" fill="#ffd23f" ${st()}/><circle cx="50" cy="50" r="28" fill="none" stroke="#e0a800" stroke-width="3"/>
      <path d="M40 34q10 10 20 0M40 66q10-10 20 0" fill="none" stroke="#e0a800" stroke-width="3" stroke-linecap="round"/><circle cx="38" cy="38" r="4" fill="#fff6b0"/></g>`),
    puff: c => svg(`<path d="M20 66C6 62 8 44 22 44c-2-16 16-24 26-14 6-14 28-12 28 6 16 0 20 20 6 26 4 14-14 22-24 14-8 12-30 8-28-4-4 0-8-2-10-6z" fill="${c}" ${st(3)}/>
      <circle cx="10" cy="30" r="4" fill="${c}"/><circle cx="88" cy="22" r="5" fill="${c}"/><circle cx="92" cy="80" r="3.5" fill="${c}"/><circle cx="16" cy="88" r="3" fill="${c}"/>`),
    egg: (a, b) => svg(`<path d="M50 6c22 0 36 38 36 56 0 20-16 32-36 32S14 82 14 62C14 44 28 6 50 6z" fill="${a}" ${st()}/>
      <path d="M17 54l11-8 11 8 11-8 11 8 11-8 11 8" fill="none" stroke="${b}" stroke-width="6" stroke-linejoin="round"/>
      <circle cx="32" cy="72" r="4" fill="${b}"/><circle cx="50" cy="76" r="4" fill="${b}"/><circle cx="68" cy="72" r="4" fill="${b}"/><circle cx="50" cy="28" r="5" fill="${b}"/>`),
    bunny: () => svg(`<g class="wiggle">${mir('M32 46C24 20 28 2 38 4c10 2 8 26 6 42z', `fill="#fff" ${st()}`)}${mir('M35 38c-4-14-2-26 3-27 5 1 4 15 3 27z', 'fill="#ffc4d6"')}</g>
      <ellipse cx="50" cy="64" rx="30" ry="26" fill="#fff" ${st()}/>${eyes(58, 11, 3.6)}
      <path d="M46 66h8l-4 4z" fill="#ff8fb1" ${st(2)}/><path d="M50 70v4" ${st(2)}/><rect x="46" y="74" width="8" height="7" rx="1.5" fill="#fff" ${st(2)}/>
      <path d="M12 64h16M14 72l14-4M88 64H72M86 72l-14-4" fill="none" ${st(2)}/>${blush(70, 20)}`),
    chick: () => svg(`<circle cx="50" cy="52" r="34" fill="#ffd23f" ${st()}/><path d="M46 19c-2-10 6-12 4-2 6-8 10-2 4 4" fill="none" ${st(3)}/>
      <g class="flapY"><path d="M18 56c-8-4-10 6-4 10 4 2 8 0 8-4z" fill="#ffc21a" ${st(3)}/></g>
      ${eyes(46, 10, 3.6)}<path d="M44 54h12l-6 7z" fill="#ff8a3d" ${st(2.5)}/>${blush(56, 20)}
      <path d="M14 66l10-8 10 8 10-8 10 8 10-8 10 8 12-8c2 24-14 36-36 36S12 88 14 66z" fill="#fff" ${st()}/>`),
    shoe: () => svg(`<path d="M8 70c0-12 6-20 14-24l22-6c6 10 18 12 28 14 14 2 22 8 22 18v6H8z" fill="#1f4fa8" ${st()}/>
      <path d="M6 78h90c0 8-6 10-12 10H12c-4 0-6-4-6-10z" fill="#fff" ${st()}/>
      <path d="M30 48l8 10M38 44l8 10M46 42l6 9" stroke="#ffd23f" stroke-width="4" stroke-linecap="round"/><path d="M60 64q16-2 30 4" fill="none" stroke="#ffd23f" stroke-width="4" stroke-linecap="round"/>`),
    medal: (rib, one) => svg(`<path d="M30 4l16 40h8L70 4H58l-8 26-8-26z" fill="${rib}" ${st(3)}/>
      <circle cx="50" cy="64" r="27" fill="#ffd23f" ${st()}/><circle cx="50" cy="64" r="19" fill="none" stroke="#e0a800" stroke-width="3"/>
      ${one ? `<path d="M45 56l6-4v24M45 76h12" fill="none" ${st(4.5)}/>` : `<path d="M50 50l4 9h10l-8 6 3 10-9-6-9 6 3-10-8-6h10z" fill="#fff6b0" ${st(2.5)}/>`}`),
    frog: () => svg(`${mir('M18 82c-8 2-12 8-8 10h18z', `fill="#5fbf3f" ${st(3)}`)}
      <ellipse cx="50" cy="64" rx="38" ry="26" fill="#7bd651" ${st()}/>
      <circle cx="30" cy="38" r="13" fill="#7bd651" ${st()}/><circle cx="70" cy="38" r="13" fill="#7bd651" ${st()}/>
      <circle cx="30" cy="38" r="7" fill="#fff" ${st(2)}/><circle cx="70" cy="38" r="7" fill="#fff" ${st(2)}/><circle cx="31" cy="39" r="3.4" fill="${INK}"/><circle cx="71" cy="39" r="3.4" fill="${INK}"/>
      <path d="M28 64q22 16 44 0" fill="none" ${st(3.5)}/>${blush(60, 26)}`),
    matzah: () => svg(`<rect x="12" y="12" width="76" height="76" rx="6" fill="#f2d39b" ${st()}/>
      <path d="M24 28h52M24 44h52M24 60h52M24 76h52" stroke="#b9823c" stroke-width="3.5" stroke-dasharray="1 7" stroke-linecap="round"/>
      <circle cx="34" cy="36" r="4" fill="#d9a35b"/><circle cx="64" cy="52" r="5" fill="#d9a35b"/><circle cx="44" cy="68" r="3.5" fill="#d9a35b"/>`),
    earth: () => svg(`<circle cx="50" cy="50" r="40" fill="#5ab4ff" ${st()}/>
      <path d="M28 22c10-4 18 4 14 12s-14 4-18 12c-4 6-12 0-12-6 2-10 8-16 16-18zM60 46c10-4 22 2 20 12s-12 14-18 22c-6 4-8-8-4-16 2-6-4-12 2-18z" fill="#7bd651" ${st(3)}/>
      ${eyes(52, 9, 3.2)}${smile(60, 5)}`),
    leaf: c => svg(`<path d="M50 94C24 72 18 36 50 6c32 30 26 66 0 88z" fill="${c}" ${st(3.5)}/><path d="M50 94V24M50 46l12-8M50 62l-12-8M50 76l12-8" fill="none" ${st(2.5)}/>`),
    seedling: () => svg(`<path d="M50 88V50" ${st(6)}/><path d="M50 88V50" stroke="#4f8f12" stroke-width="2.5"/>
      <path d="M50 58C30 60 20 46 22 32c14 0 26 8 28 26z" fill="#7bd651" ${st(3)}/><path d="M50 52c16 0 28-12 26-24-14 0-24 8-26 24z" fill="#9bd34a" ${st(3)}/>
      <path d="M26 94c4-12 44-12 48 0z" fill="#8a5a3c" ${st(3)}/>`),
    picado: c => svg(`<path d="M10 6h80" ${st(3)}/><g class="wave"><path d="M16 8h68v66l-8 10-8-10-8 10-10-10-8 10-8-10-10 10-8-10zM50 22l10 14-10 14-10-14zM26 30a5 5 0 1 0 10 0 5 5 0 1 0-10 0zM64 30a5 5 0 1 0 10 0 5 5 0 1 0-10 0zM26 58a5 5 0 1 0 10 0 5 5 0 1 0-10 0zM64 58a5 5 0 1 0 10 0 5 5 0 1 0-10 0zM46 60h8v6h-8z" fill="${c}" fill-rule="evenodd" ${st(3)}/></g>`),
    maraca: c => svg(`<g class="shake"><path d="M56 60l28 32" stroke="${INK}" stroke-width="14" stroke-linecap="round"/><path d="M56 60l28 32" stroke="#e8b46a" stroke-width="7" stroke-linecap="round"/>
      <ellipse cx="40" cy="38" rx="27" ry="30" transform="rotate(-38 40 38)" fill="${c}" ${st()}/>
      <path d="M22 54l8-10 8 8 8-10 8 8" fill="none" stroke="#fff" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><circle cx="30" cy="28" r="4" fill="#fff" opacity=".7"/></g>`),
    flower: (c, mid = '#ffd23f') => svg(`${around(6, a => `<circle cx="50" cy="27" r="16" transform="rotate(${a} 50 50)" fill="${c}" ${st(3)}/>`)}<circle cx="50" cy="50" r="14" fill="${mid}" ${st(3)}/>`),
    poppy: () => svg(`${around(4, a => `<circle cx="50" cy="29" r="20" transform="rotate(${a} 50 50)" fill="#e8322f" ${st(3)}/>`, 45)}
      <circle cx="50" cy="50" r="12" fill="${INK}"/>${around(8, a => `<circle cx="50" cy="40" r="2" fill="#8a8a8a" transform="rotate(${a} 50 50)"/>`)}`),
    nova: c => svg(`<path d="${Array.from({ length: 24 }, (_, k) => { const r = k % 2 ? 26 : 46, a = k * Math.PI / 12 - Math.PI / 2; return (k ? 'L' : 'M') + (50 + r * Math.cos(a)).toFixed(1) + ' ' + (50 + r * Math.sin(a)).toFixed(1); }).join('')}z" fill="${c}" ${st(3.5)}/>
      <path d="M50 32l5 12h13l-10 8 4 13-12-8-12 8 4-13-10-8h13z" fill="#fff" ${st(2.5)}/>`),
    tie: c => svg(`<path d="M44 26l-10 52 16 16 16-16-10-52z" fill="${c}" ${st()}/><path d="M38 52l20-14M36 68l26-18" stroke="#fff" stroke-width="4" opacity=".6" stroke-linecap="round"/>
      <path d="M40 10h20l2 12-12 6-12-6z" fill="${c}" ${st(3.5)}/>`),
    mug: () => svg(`<g class="steam">${line('M36 18c-5-6 5-10 0-16M50 16c-5-6 5-10 0-16', '#fff', 3.5)}</g>
      <path d="M70 42c20-2 22 28 0 28" fill="none" stroke="${INK}" stroke-width="12"/><path d="M70 42c20-2 22 28 0 28" fill="none" stroke="#fff" stroke-width="5"/>
      <path d="M18 28h52v50c0 10-8 14-16 14H34c-8 0-16-4-16-14z" fill="#fff" ${st()}/>
      <path d="M44 66c-8-6-12-10-10-15 2-4 8-4 10 0 2-4 8-4 10 0 2 5-2 9-10 15z" fill="#e8322f" ${st(2.5)}/>`),
    icepop: (a, b, c) => svg(`<rect x="42" y="70" width="16" height="28" rx="6" fill="#e8b46a" ${st(3)}/>
      <path d="M28 18c0-14 44-14 44 0v54H28z" fill="${b}"/><path d="M28 18c0-14 44-14 44 0v14H28z" fill="${a}"/><path d="M28 54h44v18H28z" fill="${c}"/>
      <path d="M28 18c0-14 44-14 44 0v54H28z" fill="none" ${st()}/><path d="M36 20v26" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".7"/>`),
    beachball: () => svg(`<circle cx="50" cy="50" r="40" fill="#fff"/>
      <path d="M50 10C22 30 22 70 50 90 36 70 36 30 50 10z" fill="#e8322f"/><path d="M50 10c28 20 28 60 0 80 14-20 14-60 0-80z" fill="#7cc6fe"/>
      <path d="M50 10c-6 24-6 56 0 80 6-24 6-56 0-80z" fill="#ffd23f"/>
      <circle cx="50" cy="50" r="40" fill="none" ${st()}/><path d="M50 10C22 30 22 70 50 90M50 10c28 20 28 60 0 80" fill="none" ${st(2.5)}/>`),
    apple: () => svg(`<path d="M50 28C30 14 8 26 12 52c4 26 22 42 38 34 16 8 34-8 38-34 4-26-18-38-38-24z" fill="#e8322f" ${st()}/>
      <path d="M50 28c0-10 4-18 8-22" fill="none" ${st(4)}/><path d="M54 16c10-12 24-8 26-4-8 8-18 10-26 4z" fill="#7bd651" ${st(3)}/>
      <path d="M24 40q4-8 12-10" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".8"/>`),
    honey: () => svg(`<path d="M62 32L76 4" ${st(5)}/>
      <path d="M22 38c-8 14-8 42 8 52h40c16-10 16-38 8-52z" fill="#ffb000" ${st()}/>
      <rect x="18" y="28" width="64" height="12" rx="6" fill="#e08a00" ${st()}/>
      <path d="M30 40c0 12 8 12 8 4 2 12 10 12 10 0v-4z" fill="#ffd23f" ${st(2.5)}/>
      <path d="M52 70c-8-6-12-10-10-15 2-4 8-4 10 0 2-4 8-4 10 0 2 5-2 9-10 15z" fill="#fff6b0" ${st(2.5)}/>`),
    pumpkin: () => svg(`<path d="M46 26c0-10 4-18 12-20l2 6c-6 2-6 8-6 14z" fill="#4f8f12" ${st(3)}/>
      <path d="M50 24C30 18 10 30 10 56s18 36 40 34c22 2 40-10 40-34S70 18 50 24z" fill="#ff8a1f" ${st()}/>
      <path d="M50 26c-10 14-10 50 0 64M50 26c10 14 10 50 0 64M32 24c-10 16-8 52 4 66M68 24c10 16 8 52-4 66" fill="none" stroke="#d96a00" stroke-width="3"/>
      <path d="M28 52l10-12 6 12zM72 52L62 40l-6 12z" fill="#ffe46b" ${st(3)}/>
      <path d="M28 64l8 6 6-6 8 6 8-6 6 6 8-6c-4 16-40 16-44 0z" fill="#ffe46b" ${st(3)}/>`),
    ghost: () => svg(`<path d="M18 92V44c0-22 16-36 32-36s32 14 32 36v48l-10-8-10 8-12-8-12 8-10-8z" fill="#fff" ${st()}/>
      <ellipse cx="39" cy="42" rx="5" ry="7" fill="${INK}"/><ellipse cx="61" cy="42" rx="5" ry="7" fill="${INK}"/><ellipse cx="50" cy="58" rx="5" ry="6" fill="${INK}"/>${blush(54, 20)}`),
    bat: () => svg(`<g class="flap">${mir('M50 46C40 30 22 26 4 34c8 6 8 14 4 22 8-4 14-2 18 6 4-8 12-10 18-4z', `fill="#3b2a4a" ${st(3)}`)}</g>
      ${mir('M42 42l-3-14 10 8z', `fill="#3b2a4a" ${st(2.5)}`)}<ellipse cx="50" cy="52" rx="13" ry="16" fill="#3b2a4a" ${st(3)}/>
      <circle cx="45" cy="48" r="3" fill="#ffd23f"/><circle cx="55" cy="48" r="3" fill="#ffd23f"/><path d="M46 57l2 4 2-4M50 57l2 4 2-4" fill="#fff" stroke="#fff" stroke-width="1"/>`),
    candycorn: () => svg(`<path d="M50 6c10 0 36 64 36 76 0 10-72 10-72 0C14 70 40 6 50 6z" fill="#fff"/>
      <path d="M20 66h60c4 8 6 12 6 16 0 10-72 10-72 0 0-4 2-8 6-16z" fill="#ffd23f"/><path d="M31 40h38l11 26H20z" fill="#ff8a1f"/>
      <path d="M50 6c10 0 36 64 36 76 0 10-72 10-72 0C14 70 40 6 50 6z" fill="none" ${st()}/>`),
    marigold: () => svg(`${around(12, a => `<circle cx="50" cy="20" r="13" transform="rotate(${a} 50 50)" fill="#ff9a1f" ${st(3)}/>`)}
      ${around(8, a => `<circle cx="50" cy="34" r="12" transform="rotate(${a} 50 50)" fill="#ffb81f" ${st(2.5)}/>`, 22.5)}<circle cx="50" cy="50" r="10" fill="#e07800" ${st(3)}/>`),
    skull: () => svg(`<path d="M50 8C26 8 12 24 12 46c0 14 8 22 16 26v12c0 6 6 10 12 8h20c6 2 12-2 12-8V72c8-4 16-12 16-26C88 24 74 8 50 8z" fill="#fff" ${st()}/>
      <circle cx="34" cy="46" r="12" fill="#7cc6fe" ${st(3)}/><circle cx="66" cy="46" r="12" fill="#ff8fb1" ${st(3)}/><circle cx="34" cy="46" r="6" fill="${INK}"/><circle cx="66" cy="46" r="6" fill="${INK}"/>
      <path d="M50 66c-4-3-6-5-5-7 1-2 4-2 5 0 1-2 4-2 5 0 1 2-1 4-5 7z" fill="${INK}"/>
      <path d="M36 80h28M42 76v8M50 76v8M58 76v8" ${st(2.5)}/>
      ${around(5, a => `<circle cx="50" cy="20" r="3.4" transform="rotate(${a} 50 26)" fill="#ffd23f" ${st(1.5)}/>`)}<circle cx="50" cy="26" r="3" fill="#ff8a3d"/>
      <path d="M18 60q4-4 8 0M74 60q4-4 8 0" fill="none" stroke="#9bd34a" stroke-width="3" stroke-linecap="round"/>`),
    diya: () => svg(`<defs><radialGradient id="fl-diya"><stop offset="0" stop-color="#fff2a0" stop-opacity=".95"/><stop offset="1" stop-color="#ffb000" stop-opacity="0"/></radialGradient></defs>
      <circle class="lit" cx="50" cy="44" r="40" fill="url(#fl-diya)"/>
      <g class="flick"><path d="M50 22c12 16 10 32 0 34-10-2-12-18 0-34z" fill="#ffb000" ${st(3)}/><path d="M50 36c5 8 4 16 0 17-4-1-5-9 0-17z" fill="#fff6b0"/></g>
      <path d="M8 58c12 30 72 30 84 0-14 8-70 8-84 0z" fill="#d9822b" ${st()}/>
      <path d="M24 70l4 4 4-4M46 76l4 4 4-4M68 70l4 4 4-4" fill="none" stroke="#ffd23f" stroke-width="3" stroke-linecap="round"/>`),
    turkey: () => svg(`${['#e8322f', '#ff8a1f', '#ffd23f', '#ff8a1f', '#e8322f'].map((c, k) => `<ellipse cx="50" cy="22" rx="11" ry="22" transform="rotate(${-60 + k * 30} 50 56)" fill="${c}" ${st(3)}/>`).join('')}
      <ellipse cx="50" cy="66" rx="26" ry="24" fill="#8a5a3c" ${st()}/><circle cx="50" cy="40" r="14" fill="#a8703f" ${st()}/>
      ${eyes(37, 5.5, 2.8)}<path d="M46 43h8l-4 6z" fill="#ffb000" ${st(2)}/><path d="M52 47c4 2 4 8 0 10-2-4-2-6 0-10z" fill="#e8322f" ${st(2)}/>
      <path d="M40 90v6M60 90v6" ${st(3)}/>`),
    pie: () => svg(`<path d="M50 90L12 26c22-12 54-12 76 0z" fill="#ff8a3d" ${st()}/>
      <path d="M12 26c22-12 54-12 76 0l-4 8c-20-10-48-10-68 0z" fill="#e8b46a" ${st(3)}/>
      <path d="M40 42c0-10 20-10 20 0 0 6-20 6-20 0z" fill="#fff" ${st(3)}/><path d="M46 34c2-4 6-4 8 0" fill="none" ${st(2.5)}/>`),
    dreidel: () => svg(`<g class="spin3d"><rect x="44" y="6" width="12" height="22" rx="4" fill="${C.navy}" ${st(3)}/>
      <path d="M50 96L26 70V30h48v40z" fill="#7cc6fe" ${st()}/>${line('M38 44v10c0 8 24 8 24 0V44M50 44v14', '#fff', 4)}</g>`),
    gelt: () => svg(`<g class="spin3d"><circle cx="50" cy="50" r="38" fill="#ffd23f" ${st()}/><circle cx="50" cy="50" r="29" fill="none" stroke="#e0a800" stroke-width="3"/>
      <path d="M50 30l16 28H34zM50 70L34 42h32z" fill="none" stroke="#b8860b" stroke-width="3.5" stroke-linejoin="round"/></g>`),
    menorah: night => {  // the shamash plus `night` candles lit, the newest on the left, as candles are added right to left
      const xs = [14, 23, 32, 41, 59, 68, 77, 86];
      let arms = '', cand = '';
      for (let k = 1; k <= 4; k++) arms += line(`M${50 - 9 * k} 50c0 ${10 + 6 * k} ${18 * k} ${10 + 6 * k} ${18 * k} 0`, '#ffd23f', 3);
      xs.forEach((x, k) => { const lit = 7 - k < night; cand += `<rect x="${x - 3}" y="34" width="6" height="16" rx="1.5" fill="#7cc6fe" ${st(2)}/>` + (lit ? flame(x, 33, .55) : ''); });
      return svg(`${arms}${line('M50 40v44M34 92h32', '#ffd23f', 4)}${line('M50 84l-12 8M50 84l12 8', '#ffd23f', 3)}
        <rect x="47" y="22" width="6" height="18" rx="1.5" fill="#7cc6fe" ${st(2)}/>${flame(50, 21, .55)}${cand}`);
    },
    candycane: () => svg(`${line('M60 94V36c0-16-20-16-20-2', '#fff', 11).replace('stroke-width="15"', 'stroke-width="18"')}<path d="M60 94V36c0-16-20-16-20-2" fill="none" stroke="#e8322f" stroke-width="11" stroke-dasharray="7 7"/>`),
    ornament: c => svg(`<g class="swing"><path d="M50 16c-6-10 6-14 4-6" fill="none" ${st(3)}/><rect x="40" y="16" width="20" height="12" rx="3" fill="#ffd23f" ${st(3)}/>
      <circle cx="50" cy="60" r="33" fill="${c}" ${st()}/><path d="M18 60l10-8 10 8 10-8 10 8 10-8 10 8 8-6" fill="none" stroke="#fff" stroke-width="5" stroke-linejoin="round"/>
      <path d="M30 44q6-8 14-10" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".8"/></g>`),
    gingerbread: () => svg(`<path d="M50 6c10 0 16 8 14 18-2 6-6 8-6 10h18c10 0 10 12 0 12H64l6 30c2 10-8 14-12 6l-8-16-8 16c-4 8-14 4-12-6l6-30H24c-10 0-10-12 0-12h18c0-2-4-4-6-10-2-10 4-18 14-18z" fill="#c98b4a" ${st()}/>
      <path d="M22 40l3-3 3 3 3-3M69 40l3-3 3 3 3-3M36 82l3-3 3 3M58 82l3-3 3 3" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>
      ${eyes(18, 5, 2.6)}<path d="M45 24q5 4 10 0" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="50" cy="44" r="3.4" fill="#e8322f" ${st(1.5)}/><circle cx="50" cy="56" r="3.4" fill="#4f8f12" ${st(1.5)}/>`),
    kinara: day => {  // 3 red, the black centre, 3 green; lit in the traditional order, one more each day
      const xs = [14, 26, 38, 50, 62, 74, 86], cols = ['#e8322f', '#e8322f', '#e8322f', INK, '#3fae3f', '#3fae3f', '#3fae3f'], order = [3, 0, 6, 1, 5, 2, 4];
      const lit = new Set(order.slice(0, day));
      return svg(`<path d="M8 72h84l-8 18H16z" fill="#8a5a3c" ${st()}/>
        ${xs.map((x, k) => `<rect x="${x - 4}" y="${k === 3 ? 32 : 40}" width="8" height="${k === 3 ? 40 : 32}" rx="2" fill="${cols[k]}" ${st(2.5)}/>${lit.has(k) ? flame(x, k === 3 ? 31 : 39, .6) : ''}`).join('')}`);
    },
    candle: c => svg(`<rect x="38" y="36" width="24" height="58" rx="4" fill="${c}" ${st()}/>${flame(50, 34, 1.2)}`),
    balloon: c => svg(`<path class="wiggle" d="M50 80c-6 8 6 12 0 20" fill="none" ${st(2.5)}/>
      <path d="M50 6C28 6 18 22 18 38c0 20 18 34 32 36 14-2 32-16 32-36 0-16-10-32-32-32z" fill="${c}" ${st()}/><path d="M46 74h8l-4 6z" fill="${c}" ${st(2.5)}/>
      <path d="M30 30q4-10 14-12" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".8"/>`),
  };

  // ---------- sets ----------
  const cyc = (arr, i) => arr[i % arr.length];
  const THEMES = {
    // the original nine
    butterflies: { n: 7, size: [0.12, 0.156], mode: 'free', speed: [.4, .65], r: [.36, .44], face: 90, sprite: i => SP.butterfly(cyc(BF, i)), cls: 'flutter' },
    fairies: { n: 5, size: [0.132, 0.156], mode: 'loop', speed: [.45, .6], r: [.36, .42], trail: true, sprite: i => SP.fairy(cyc(BRIGHT, i)), cls: 'buzz' },
    pizza: { n: 8, size: [0.12, 0.132], mode: 'ring', speed: [.38, .38], r: [.41, .41], spin: true, sprite: () => SP.pizza() },
    lightbulbs: { n: 7, size: [0.132, 0.156], mode: 'free', speed: [.2, .32], r: [.37, .44], sprite: () => SP.bulb(), cls: 'blink' },
    stars: { n: 12, size: [0.054, 0.096], mode: 'free', speed: [.15, .3], r: [.33, .46], sprite: i => i % 3 ? SP.star(['#ffd23f', '#fff', '#c9a8f2'][i % 3]) : SP.sparkle('#fff6b0'), cls: 'twinkle' },
    music: { n: 9, size: [0.096, 0.12], mode: 'free', speed: [.3, .45], r: [.36, .44], sprite: i => (i % 2 ? SP.note : SP.notes)(cyc(BRIGHT, i)) },
    planes: { n: 5, size: [0.12, 0.144], mode: 'free', speed: [.5, .7], r: [.37, .44], face: 37.7, sprite: () => SP.plane() },
    bubbles: { n: 10, size: [0.072, 0.132], mode: 'free', speed: [.15, .3], r: [.34, .46], pop: true, sprite: i => SP.bubble(['#7cc6fe', '#c9a8f2', '#9bd34a'][i % 3]) },
    sushi: { n: 9, size: [0.114, 0.126], mode: 'ring', speed: [.3, .3], r: [.41, .41], sprite: i => [SP.nigiri, () => SP.maki(['#ff8a5b', '#9bd34a', '#ffd23f'][i % 3]), SP.wasabi][i % 3]() },

    // critters (1-10)
    ladybugs: { n: 7, size: [.09, .11], mode: 'free', speed: [.35, .55], face: 90, cls: 'flutter', sprite: i => SP.ladybug(cyc(['#e8322f', '#ff8fb1', '#ff6a3d'], i)) },
    bees: { n: 7, size: [.09, .11], mode: 'free', speed: [.45, .7], zig: .02, face: 'flip', cls: 'buzz', trail: 'dots', trailEvery: 160, trailColor: () => '#ffd23f', sprite: () => SP.bee() },
    hummingbirds: { n: 5, size: [.12, .14], mode: 'free', speed: [.55, .8], dart: 2.4, face: 'flip', cls: 'hum', sprite: i => SP.hummingbird(cyc(['#3fbf9f', '#7cc6fe', '#9bd34a'], i)) },
    fireflies: { n: 10, size: [.06, .09], mode: 'free', speed: [.1, .22], r: [.3, .46], zig: .01, cls: 'glow buzz', sprite: () => SP.firefly() },
    dragonflies: { n: 5, size: [.12, .15], mode: 'free', speed: [.55, .85], dart: 1.7, face: 90, cls: 'buzz', sprite: i => SP.dragonfly(cyc(['#3fbf9f', '#7cc6fe', '#c9a8f2'], i)) },
    goldfish: { n: 6, size: [.11, .13], mode: 'free', speed: [.3, .45], face: 'flip', trail: 'bubble', trailEvery: 380, sprite: () => SP.goldfish() },
    jellyfish: { n: 7, size: [.09, .13], mode: 'rise', life: [7, 10], sprite: i => SP.jellyfish(cyc(['#ffc4d6', '#c9a8f2', '#bfe3ff'], i)) },
    ducks: { n: 6, size: [.11, .13], mode: 'ring', speed: [.3, .3], r: [.41, .41], face: 'flip', bob: .015, sprite: () => SP.duck() },
    kittens: { n: 7, size: [.1, .13], mode: 'free', speed: [.3, .45], spin: i => i % 2 === 1, sprite: i => i % 2 ? SP.yarn(cyc(['#ff8fb1', '#7cc6fe', '#c9a8f2'], i)) : SP.kitten(cyc(['#ffb347', '#d9d4e8', '#f5e3c8', '#8a8a8a'], i >> 1)) },
    unicorns: { n: 4, size: [.14, .16], mode: 'free', speed: [.4, .55], face: 'flip', trail: 'rainbow', trailEvery: 90, sprite: () => SP.unicorn() },
    // treats (11-18)
    donuts: { n: 8, size: [.11, .12], mode: 'ring', speed: [.35, .35], r: [.41, .41], spin: true, sprite: i => SP.donut(cyc(['#ff8fb1', '#8a5a3c', '#c9a8f2', '#fff'], i)) },
    cupcakes: { n: 7, size: [.11, .13], mode: 'free', speed: [.3, .45], sprite: i => SP.cupcake(cyc(['#ffc4d6', '#c9a8f2', '#fff', '#cdeaa0'], i)) },
    icecream: { n: 7, size: [.11, .13], mode: 'free', speed: [.3, .45], sprite: i => SP.icecream(...cyc([['#ffc4d6', '#8a5a3c'], ['#cdeaa0', '#fff4e0'], ['#bfe3ff', '#ffc4d6'], ['#fff4e0', '#c9a8f2']], i)) },
    tacos: { n: 6, size: [.12, .14], mode: 'free', speed: [.35, .5], cls: 'flutter', sprite: () => SP.taco() },
    dumplings: { n: 7, size: [.11, .12], mode: 'ring', speed: [.3, .3], r: [.41, .41], sprite: () => SP.dumpling() },
    boba: { n: 6, size: [.11, .13], mode: 'free', speed: [.3, .45], sprite: () => SP.boba() },
    fruit: { n: 9, size: [.1, .12], mode: 'free', speed: [.3, .45], spin: true, sprite: i => [SP.watermelon, SP.orange, SP.strawberry][i % 3]() },
    candy: { n: 9, size: [.09, .12], mode: 'free', speed: [.3, .45], spin: i => i % 2 === 1, sprite: i => i % 2 ? SP.candy(...cyc([['#ff8fb1', '#ffc4d6'], ['#7cc6fe', '#bfe3ff'], ['#9bd34a', '#cdeaa0']], i)) : SP.lollipop(cyc(['#ff4f7b', '#c9a8f2', '#ffb000'], i)) },
    // sky and space (19-23)
    space: { n: 7, size: i => i % 3 === 0 ? [.12, .14] : [.1, .13], mode: i => i % 3 === 0 ? 'loop' : 'free', speed: [.3, .45], face: i => i % 3 === 0 ? 90 : undefined, sprite: i => i % 3 === 0 ? SP.rocket() : i % 3 === 1 ? SP.planet(cyc(['#c9a8f2', '#7cc6fe', '#ff8a3d'], i), '#ffd23f') : SP.moonlet(cyc(['#9bd34a', '#ff8fb1', '#b8b2c6'], i)) },
    ufos: { n: 5, size: [.12, .14], mode: 'free', speed: [.35, .55], zig: .02, sprite: () => SP.ufo() },
    hotair: { n: 6, size: [.12, .15], mode: 'rise', life: [8, 11], sprite: i => SP.hotair(...cyc([['#ff8fb1', '#ffd23f'], ['#7cc6fe', '#fff'], ['#9bd34a', '#c9a8f2'], ['#ff8a3d', '#ffd23f']], i)) },
    rainbows: { n: 5, size: [.14, .16], mode: 'free', speed: [.15, .25], sprite: i => i % 2 ? SP.cloud() : SP.rainbow() },
    kites: { n: 5, size: [.13, .15], mode: 'free', speed: [.25, .4], bob: .02, sprite: i => SP.kite(...cyc([['#ff8fb1', '#ffd23f'], ['#7cc6fe', '#9bd34a'], ['#c9a8f2', '#fff'], ['#ff8a3d', '#7cc6fe']], i)) },
    // make and play (24-26)
    pixels: { n: 9, size: [.08, .1], mode: 'free', speed: [.3, .45], sprite: i => [SP.pixcoin, SP.pixheart, SP.pixstar][i % 3]() },
    paint: { n: 8, size: i => i % 2 ? [.09, .12] : [.12, .14], mode: i => i % 2 ? 'pop' : 'free', speed: [.35, .5], face: i => i % 2 ? undefined : 0, life: [2.4, 3.4], trail: 'dots', trailEvery: 110, trailColor: i => cyc(BRIGHT, i >> 1), sprite: i => i % 2 ? SP.splat(cyc(['#ff8fb1', '#7cc6fe', '#ffd23f', '#9bd34a'], i)) : SP.crayon(cyc(BRIGHT, i >> 1)) },
    cranes: { n: 6, size: [.12, .14], mode: 'free', speed: [.3, .45], face: 'flip', sprite: i => SP.crane(cyc(['#ff8fb1', '#7cc6fe', '#9bd34a', '#ffd23f'], i)) },
    // seasons (27-30)
    blossoms: { n: 12, size: [.06, .09], mode: 'fall', life: [7, 10], spin: true, sprite: i => i % 3 ? SP.petal() : SP.blossom() },
    sunny: { n: 6, size: i => i % 2 ? [.11, .13] : [.13, .15], mode: 'free', speed: [.25, .4], sprite: i => i % 2 ? SP.shades(cyc(['#ff8fb1', '#7cc6fe', '#9bd34a'], i)) : SP.sun() },
    leaves: { n: 12, size: [.07, .1], mode: 'fall', life: [7, 10], spin: true, sprite: i => (i % 2 ? SP.oak : SP.maple)(cyc(['#e8322f', '#ff8a1f', '#ffd23f', '#c06a2b'], i)) },
    snow: { n: 14, size: [.05, .09], mode: 'fall', life: [8, 12], spin: true, sprite: () => SP.snowflake() },

    // holidays
    newyear: { n: 12, size: i => i < 3 ? [.16, .2] : i < 10 ? [.05, .07] : [.12, .14], mode: i => i < 3 ? 'pop' : i < 10 ? 'fall' : 'free', life: i => i < 3 ? [1.8, 2.6] : [6, 9], speed: [.35, .5], spin: i => i >= 3 && i < 10, sprite: i => i < 3 ? SP.firework(cyc(['#ffd23f', '#ff8fb1', '#7cc6fe'], i)) : i < 10 ? SP.confetti(cyc(BRIGHT, i), i) : SP.horn(cyc(['#c9a8f2', '#ff8fb1'], i), '#ffd23f') },
    mlk: { n: 7, size: i => i % 2 ? [.07, .09] : [.12, .14], mode: 'free', speed: [.2, .32], face: i => i % 2 ? undefined : 'flip', sprite: i => i % 2 ? SP.heart(cyc(['#ff8fb1', '#e8322f'], i)) : SP.dove() },
    lunarnewyear: { n: 8, size: i => i === 7 ? [.15, .15] : i % 2 ? [.08, .1] : [.12, .14], mode: 'free', speed: [.2, .32], sprite: (i, ctx) => i === 7 && SP[ZODIAC[ctx.year]] ? SP[ZODIAC[ctx.year]]() : i % 2 ? SP.luckycoin() : SP.lantern() },
    mardigras: { n: 8, size: [.11, .14], mode: 'free', speed: [.3, .45], spin: i => i % 2 === 1, sprite: i => i % 2 ? SP.beads() : SP.mask(cyc(['#8e44c9', '#4f8f12', '#ffd23f'], i >> 1), cyc(['#ffd23f', '#8e44c9'], i)) },
    valentines: { n: 9, size: [.09, .12], mode: 'free', speed: [.3, .45], face: i => i % 3 === 2 ? 0 : undefined, sprite: i => i % 3 === 0 ? SP.heart(cyc(['#ff4f7b', '#ff8fb1', '#e8322f'], i)) : i % 3 === 1 ? SP.letter() : SP.arrow() },
    presidents: { n: 9, size: i => i % 3 === 2 ? [.12, .14] : [.07, .1], mode: 'free', speed: [.2, .32], cls: i => i % 3 === 2 ? '' : 'twinkle', sprite: i => i % 3 === 2 ? SP.flag() : SP.star(cyc(['#fff', '#e8322f', '#7cc6fe'], i)) },
    eid: { n: 8, size: i => i % 4 === 3 ? [.13, .15] : [.08, .12], mode: 'free', speed: [.15, .28], cls: i => i % 4 === 3 ? 'glow' : i % 4 === 1 ? 'twinkle' : '', sprite: i => [() => SP.crescent('#ffd23f'), () => SP.star('#fff6b0'), () => SP.crescent('#fff'), SP.fanous][i % 4]() },
    stpatricks: { n: 9, size: [.09, .12], mode: 'free', speed: [.3, .45], spin: i => i % 3 === 0, sprite: i => [SP.shamrock, SP.gold, SP.rainbow][i % 3]() },
    holi: { n: 11, size: [.12, .17], mode: 'pop', life: [1.8, 2.8], sprite: i => SP.puff(cyc(['#ff4f7b', '#ffd23f', '#9bd34a', '#7cc6fe', '#c9a8f2', '#ff8a3d'], i)) },
    easter: { n: 8, size: [.1, .13], mode: 'free', speed: [.3, .42], hop: i => i % 4 === 1 ? .03 : 0, sprite: i => i % 4 === 1 ? SP.bunny() : i % 4 === 3 ? SP.chick() : SP.egg(...cyc([['#ffc4d6', '#7cc6fe'], ['#cdeaa0', '#c9a8f2'], ['#bfe3ff', '#ffd23f'], ['#fff4a0', '#ff8fb1']], i >> 1)) },
    patriots: { n: 7, size: [.11, .13], mode: 'free', speed: [.4, .55], face: i => i % 2 ? undefined : 'flip', hop: i => i % 2 ? 0 : .025, sprite: i => i % 2 ? SP.medal('#1f4fa8') : SP.shoe() },
    passover: { n: 7, size: [.1, .13], mode: 'free', speed: [.3, .45], hop: i => i % 2 ? 0 : .04, sprite: i => i % 2 ? SP.matzah() : SP.frog() },
    earthday: { n: 8, size: [.1, .13], mode: 'free', speed: [.2, .32], sprite: i => [SP.earth, () => SP.leaf('#7bd651'), SP.seedling, () => SP.leaf('#4fbf6f')][i % 4]() },
    cinco: { n: 8, size: [.11, .13], mode: 'free', speed: [.3, .45], sprite: i => i % 2 ? SP.maraca(cyc(['#e8322f', '#3fae3f', '#ffd23f'], i)) : SP.picado(cyc(['#ff4f7b', '#7cc6fe', '#ffd23f', '#9bd34a'], i >> 1)) },
    mothersday: { n: 9, size: [.09, .12], mode: 'free', speed: [.25, .4], spin: i => i % 3 !== 2, sprite: i => i % 3 === 2 ? SP.heart(cyc(['#ff8fb1', '#ff4f7b'], i)) : SP.flower(cyc(['#ffc4d6', '#c9a8f2', '#ff8fb1', '#fff'], i)) },
    memorial: { n: 8, size: [.09, .12], mode: 'free', speed: [.12, .2], cls: i => i % 2 ? 'twinkle' : '', sprite: i => i % 2 ? SP.star(cyc(['#fff', '#7cc6fe'], i)) : SP.poppy() },
    juneteenth: { n: 10, size: i => i % 2 ? [.16, .2] : [.1, .12], mode: i => i % 2 ? 'pop' : 'free', speed: [.25, .4], life: [2, 2.8], spin: i => i % 2 === 0, sprite: i => i % 2 ? SP.firework(cyc(RWB, i >> 1)) : SP.nova(cyc(['#fff', '#e8322f', '#7cc6fe'], i >> 1)) },
    fathersday: { n: 7, size: [.1, .13], mode: 'free', speed: [.3, .45], sprite: i => [() => SP.tie(cyc(['#7cc6fe', '#e8322f', '#9bd34a'], i)), SP.mug, () => SP.medal('#e8322f', true)][i % 3]() },
    july4: { n: 11, size: i => i < 4 ? [.16, .2] : [.09, .12], mode: i => i < 4 ? 'pop' : 'free', life: [1.8, 2.6], speed: [.3, .45], cls: i => i >= 4 && i % 2 ? 'twinkle' : '', sprite: i => i < 4 ? SP.firework(cyc(RWB, i)) : i % 2 ? SP.star(cyc(['#fff', '#e8322f', '#7cc6fe'], i)) : SP.icepop(C.red, '#fff', C.navy) },
    laborday: { n: 7, size: [.11, .13], mode: 'free', speed: [.3, .45], spin: i => i % 2 === 0, sprite: i => i % 2 ? SP.icepop(...cyc([['#ff8fb1', '#fff4a0', '#c9a8f2'], ['#9bd34a', '#fff', '#7cc6fe']], i)) : SP.beachball() },
    roshhashanah: { n: 7, size: [.1, .13], mode: 'free', speed: [.25, .4], sprite: i => i % 2 ? SP.honey() : SP.apple() },
    halloween: { n: 9, size: [.1, .13], mode: 'free', speed: [.3, .45], zig: i => i % 4 === 2 ? .02 : 0, cls: i => i % 4 === 2 ? 'flutter' : '', spin: i => i % 4 === 3, sprite: i => [SP.pumpkin, SP.ghost, SP.bat, SP.candycorn][i % 4]() },
    muertos: { n: 9, size: [.1, .13], mode: 'free', speed: [.25, .4], spin: i => i % 2 === 0, sprite: i => i % 2 ? SP.skull() : SP.marigold() },
    diwali: { n: 9, size: i => i % 3 === 2 ? [.14, .17] : [.11, .13], mode: i => i % 3 === 2 ? 'pop' : 'free', life: [1.6, 2.4], speed: [.2, .32], sprite: i => i % 3 === 2 ? SP.firework(cyc(['#ffd23f', '#ff8a3d'], i)) : SP.diya() },
    veterans: { n: 8, size: i => i % 2 ? [.12, .14] : [.07, .1], mode: 'free', speed: [.12, .2], cls: i => i % 2 ? '' : 'twinkle', sprite: i => i % 2 ? SP.flag() : SP.star(cyc(['#fff', '#e8322f', '#7cc6fe'], i)) },
    thanksgiving: { n: 8, size: [.1, .13], mode: 'free', speed: [.25, .4], face: i => i % 4 === 0 ? undefined : undefined, spin: i => i % 4 >= 2, sprite: i => [SP.turkey, SP.pie, () => SP.maple('#ff8a1f'), () => SP.oak('#c06a2b')][i % 4]() },
    hanukkah: { n: 8, size: i => i === 0 ? [.2, .2] : [.09, .11], mode: 'free', speed: [.2, .32], r: i => i === 0 ? [.42, .42] : [.36, .44], spin: i => i > 0 && i % 2 === 0, sprite: (i, ctx) => i === 0 ? SP.menorah(ctx.night) : i % 2 ? SP.dreidel() : SP.gelt() },
    christmas: { n: 12, size: i => i >= 7 ? [.05, .08] : [.1, .13], mode: i => i >= 7 ? 'fall' : 'free', life: [8, 12], speed: [.25, .4], spin: i => i >= 7, sprite: i => i >= 7 ? SP.snowflake() : [() => SP.ornament(cyc(['#e8322f', '#3fae3f', '#7cc6fe', '#c9a8f2'], i)), SP.candycane, SP.gingerbread][i % 3]() },
    kwanzaa: { n: 7, size: i => i === 0 ? [.2, .2] : [.07, .09], mode: 'free', speed: [.15, .28], r: i => i === 0 ? [.42, .42] : [.34, .44], sprite: (i, ctx) => i === 0 ? SP.kinara(ctx.kday) : SP.candle(cyc(['#e8322f', INK, '#3fae3f'], i)) },
    birthday: { n: 11, size: i => i < 4 ? [.11, .14] : i < 9 ? [.05, .07] : [.12, .14], mode: i => i < 4 ? 'rise' : i < 9 ? 'fall' : 'free', life: [6, 9], speed: [.3, .4], spin: i => i >= 4 && i < 9, sprite: i => i < 4 ? SP.balloon(cyc(['#ff8fb1', '#7cc6fe', '#ffd23f', '#c9a8f2'], i)) : i < 9 ? SP.confetti(cyc(BRIGHT, i), i) : SP.cupcake(cyc(['#ffc4d6', '#cdeaa0'], i), true) },
  };

  // Lunar New Year shows that year's zodiac animal when it's drawn (add the next one in SP before its New Year).
  const ZODIAC = { 2027: 'goat' };

  // the random everyday rotation; SEASONAL sets only join it between these month-day dates
  const EVERYDAY = ['butterflies', 'fairies', 'pizza', 'lightbulbs', 'stars', 'music', 'planes', 'bubbles', 'sushi',
    'ladybugs', 'bees', 'hummingbirds', 'fireflies', 'dragonflies', 'goldfish', 'jellyfish', 'ducks', 'kittens', 'unicorns',
    'donuts', 'cupcakes', 'icecream', 'tacos', 'dumplings', 'boba', 'fruit', 'candy',
    'space', 'ufos', 'hotair', 'rainbows', 'kites', 'pixels', 'paint', 'cranes',
    'blossoms', 'sunny', 'leaves', 'snow'];
  const SEASONAL = { blossoms: ['03-20', '05-31'], sunny: ['06-01', '08-31'], leaves: ['09-22', '11-30'], snow: ['12-01', '02-29'] };

  // ---------- holiday dates (Boston time) ----------
  const iso = (y, m, d) => new Date(Date.UTC(y, m - 1, d)).toISOString().slice(0, 10);
  const add = (s, k) => { const t = new Date(s + 'T00:00:00Z'); t.setUTCDate(t.getUTCDate() + k); return t.toISOString().slice(0, 10); };
  const nth = (y, m, wd, n) => {  // nth weekday (0 = Sunday) of a month; n = -1 for the last one
    if (n > 0) return iso(y, m, 1 + (wd - new Date(Date.UTC(y, m - 1, 1)).getUTCDay() + 7) % 7 + 7 * (n - 1));
    const last = new Date(Date.UTC(y, m, 0)); return iso(y, m, last.getUTCDate() - (last.getUTCDay() - wd + 7) % 7);
  };
  const easter = y => {  // Anonymous Gregorian algorithm
    const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
    return iso(y, Math.floor((h + l - 7 * m + 114) / 31), ((h + l - 7 * m + 114) % 31) + 1);
  };
  const span = (d, a, b) => d ? [[add(d, a), add(d, b)]] : [];
  // Moon and lunisolar holidays, 2026-2035 (main day). Hebrew dates are the first full day (they start the evening before).
  // Sources: Chinese and Hebrew calendar conversions (lunardate, convertdate), tabular Islamic calendar (can be a day off
  // the moon sighting, so Eid shows for 3 days), Diwali and Holi from published calendars. Extend before 2036.
  const LUNAR = { 2026: '02-17', 2027: '02-06', 2028: '01-26', 2029: '02-13', 2030: '02-03', 2031: '01-23', 2032: '02-11', 2033: '01-31', 2034: '02-19', 2035: '02-08' };
  const HOLI = { 2026: '03-03', 2027: '03-22', 2028: '03-11', 2029: '03-01', 2030: '03-20', 2031: '03-09', 2032: '03-27', 2033: '03-16', 2034: '03-05', 2035: '03-24' };
  const DIWALI = { 2026: '11-08', 2027: '10-29', 2028: '10-17', 2029: '11-05', 2030: '10-26', 2031: '11-14', 2032: '11-02', 2033: '10-22', 2034: '11-10', 2035: '10-30' };
  const PASSOVER = { 2026: '04-02', 2027: '04-22', 2028: '04-11', 2029: '03-31', 2030: '04-18', 2031: '04-08', 2032: '03-27', 2033: '04-14', 2034: '04-04', 2035: '04-24' };
  const ROSH = { 2026: '09-12', 2027: '10-02', 2028: '09-21', 2029: '09-10', 2030: '09-28', 2031: '09-18', 2032: '09-06', 2033: '09-24', 2034: '09-14', 2035: '10-04' };
  const HANUKKAH = { 2026: '12-05', 2027: '12-25', 2028: '12-13', 2029: '12-02', 2030: '12-21', 2031: '12-10', 2032: '11-28', 2033: '12-17', 2034: '12-07', 2035: '12-26' };
  const EID = ['2026-03-20', '2026-05-27', '2027-03-10', '2027-05-17', '2028-02-27', '2028-05-05', '2029-02-15', '2029-04-24', '2030-02-05', '2030-04-14',
    '2031-01-25', '2031-04-03', '2032-01-14', '2032-03-22', '2033-01-03', '2033-03-12', '2033-12-23', '2034-03-01', '2034-12-12', '2035-02-18', '2035-12-02'];
  const T = (tab, y) => tab[y] && `${y}-${tab[y]}`;
  const hanukkahEve = y => T(HANUKKAH, y) && add(T(HANUKKAH, y), -1);
  const HOLIDAYS = {  // name -> date ranges [from, to] (inclusive) in year y
    newyear: y => [[iso(y, 1, 1), iso(y, 1, 2)], [iso(y, 12, 31), iso(y, 12, 31)]],
    mlk: y => span(nth(y, 1, 1, 3), 0, 0),
    lunarnewyear: y => span(T(LUNAR, y), 0, 2),
    mardigras: y => span(add(easter(y), -47), -2, 0),
    valentines: y => [[iso(y, 2, 10), iso(y, 2, 14)]],
    presidents: y => span(nth(y, 2, 1, 3), 0, 0),
    eid: y => EID.filter(d => d.startsWith(y + '-')).flatMap(d => span(d, 0, 2)),
    stpatricks: y => [[iso(y, 3, 14), iso(y, 3, 17)]],
    holi: y => span(T(HOLI, y), 0, 1),
    easter: y => span(easter(y), -3, 0),
    patriots: y => span(nth(y, 4, 1, 3), 0, 0),  // Patriots' Day and the Boston Marathon
    passover: y => span(T(PASSOVER, y), -1, 7),
    earthday: y => [[iso(y, 4, 22), iso(y, 4, 22)]],
    cinco: y => [[iso(y, 5, 5), iso(y, 5, 5)]],
    mothersday: y => span(nth(y, 5, 0, 2), 0, 0),
    memorial: y => span(nth(y, 5, 1, -1), 0, 0),
    juneteenth: y => [[iso(y, 6, 19), iso(y, 6, 19)]],
    fathersday: y => span(nth(y, 6, 0, 3), 0, 0),
    july4: y => [[iso(y, 7, 1), iso(y, 7, 4)]],
    laborday: y => span(nth(y, 9, 1, 1), -2, 0),
    roshhashanah: y => span(T(ROSH, y), 0, 1),
    halloween: y => [[iso(y, 10, 24), iso(y, 10, 31)]],
    muertos: y => [[iso(y, 11, 1), iso(y, 11, 2)]],
    diwali: y => span(T(DIWALI, y), -2, 2),
    veterans: y => [[iso(y, 11, 11), iso(y, 11, 11)]],
    thanksgiving: y => span(nth(y, 11, 4, 4), -3, 0),
    hanukkah: y => span(hanukkahEve(y), 0, 8),
    christmas: y => [[iso(y, 12, 1), iso(y, 12, 26)]],
    kwanzaa: y => [[iso(y, 1, 1), iso(y, 1, 1)], [iso(y, 12, 26), iso(y, 12, 31)]],
    birthday: y => [[iso(y, 12, 7), iso(y, 12, 7)]],  // Ariel's birthday (month and day only)
  };
  const days = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 864e5);

  // What a given day (YYYY-MM-DD, Boston time) looks like: its holidays, which seasonal sets are in, Hanukkah night, Kwanzaa day.
  const context = date => {
    const y = +date.slice(0, 4), md = date.slice(5);
    const holidays = Object.keys(HOLIDAYS).filter(n => [y - 1, y].some(yy => HOLIDAYS[n](yy).some(([a, b]) => a <= date && date <= b)));
    const inSeason = n => { const [a, b] = SEASONAL[n]; return a <= b ? a <= md && md <= b : md >= a || md <= b; };
    let night = 8;
    for (const yy of [y - 1, y]) { const eve = hanukkahEve(yy); if (eve && eve <= date && date <= add(eve, 8)) night = Math.min(8, days(eve, date) + 1); }
    const kday = md >= '12-26' ? days(iso(y, 12, 25), date) : md === '01-01' ? 7 : 7;
    return { date, year: y, holidays, inSeason, night, kday };
  };

  window.WASABI_FLAIR = { SP, THEMES, EVERYDAY, SEASONAL, HOLIDAYS, context };
})();
