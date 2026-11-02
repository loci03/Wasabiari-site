"""Builds mocks/<theme>/index.html: the home page in several style directions."""
import os
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WEB=open(os.path.join(ROOT,"tools/home-web.html")).read()
THEMES={
"fresh":dict(name="A · Fresh Wasabi",fonts="Inter:wght@400;600;800",head="ari-head.jpg",css="""
:root{--bg:#f7faf3;--panel:#fff;--ink:#17201a;--muted:#55654f;--wasabi:#5f9a1c;--acc:#9bd34a;--line:#dde6d4;--font:'Inter',system-ui,sans-serif;--hfont:'Inter',system-ui,sans-serif}
.head{box-shadow:0 0 0 8px var(--bg),0 0 0 14px var(--acc),0 0 0 17px var(--ink),0 20px 50px rgba(0,0,0,.18)}
.node{border-radius:999px;border:2px solid var(--acc)} .node.big{background:var(--acc);color:#10200a}
"""),
"paper":dict(name="B · Ink & Paper",fonts="Fraunces:opsz,wght@9..144,600;9..144,800&family=Inter:wght@400;600",head="ari-head.jpg",css="""
:root{--bg:#f2e8d6;--panel:#fbf5ea;--ink:#2a1c12;--muted:#6d5a48;--wasabi:#5d8a25;--acc:#2a1c12;--line:#d9c8ad;--font:'Inter',system-ui,sans-serif;--hfont:'Fraunces',Georgia,serif}
body{background-image:radial-gradient(rgba(90,60,30,.06) 1px,transparent 1.2px),radial-gradient(rgba(90,60,30,.04) 1px,transparent 1.2px);background-size:7px 7px,11px 11px;background-position:0 0,3px 5px}
.head{box-shadow:0 0 0 7px var(--panel),0 0 0 10px var(--ink),0 18px 40px rgba(60,35,10,.25)}
.lines path{stroke:var(--ink);stroke-width:1.8;opacity:.9}
.node{border-radius:4px;border:1.6px solid var(--ink);background:var(--panel);box-shadow:3px 3px 0 rgba(42,28,18,.85);font-family:var(--hfont);transform-origin:center}
.node.big{background:var(--wasabi);color:#fbf5ea}
.hello{font-family:var(--hfont)}
"""),
"night":dict(name="C · Night Arcade",fonts="Space+Grotesk:wght@500;700",head="ari-duo.jpg",css="""
:root{--bg:#090d08;--panel:#111a0f;--ink:#eaf7dc;--muted:#93a888;--wasabi:#b6ff4d;--acc:#b6ff4d;--line:#22301d;--font:'Space Grotesk',system-ui,sans-serif;--hfont:'Space Grotesk',system-ui,sans-serif}
body{background-image:linear-gradient(rgba(182,255,77,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(182,255,77,.05) 1px,transparent 1px);background-size:32px 32px}
.head{box-shadow:0 0 0 6px var(--bg),0 0 0 9px var(--acc),0 0 60px rgba(182,255,77,.45)}
.lines path{stroke:var(--acc);filter:drop-shadow(0 0 4px rgba(182,255,77,.8))}
.node{border-radius:10px;border:1.5px solid var(--acc);background:rgba(17,26,15,.9);box-shadow:0 0 18px rgba(182,255,77,.25);text-transform:uppercase;letter-spacing:.04em;font-size:13px}
.node.big{background:var(--acc);color:#0b1407}
.hello span,.brand span{color:var(--acc)}
"""),
"sticker":dict(name="D · Sticker Pop",fonts="Fredoka:wght@500;700",head="ari-head.jpg",css="""
:root{--bg:#fff6e6;--panel:#ffffff;--ink:#1b1b1b;--muted:#5d5548;--wasabi:#4f8f12;--acc:#9bd34a;--lilac:#c9a8f2;--line:#efe2c8;--font:'Fredoka',system-ui,sans-serif;--hfont:'Fredoka',system-ui,sans-serif}
.head{box-shadow:0 0 0 8px #fff,0 0 0 12px var(--ink),10px 12px 0 12px var(--lilac)}
.lines path{stroke:var(--ink);stroke-width:3;stroke-dasharray:none}
.node{border-radius:18px;border:3px solid var(--ink);box-shadow:4px 4px 0 var(--ink);font-size:16px}
.node:nth-of-type(odd){background:var(--lilac)} .node.big{background:var(--acc);color:var(--ink)}
.card{border:3px solid var(--ink)!important;box-shadow:5px 5px 0 var(--ink)}
"""),
}
BASE="""*{box-sizing:border-box}html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--ink);font:17px/1.6 var(--font)}
a{color:var(--wasabi)}
.wrap{max-width:920px;margin:0 auto;padding:0 16px}
header{position:relative;z-index:5;border-bottom:1px solid var(--line);background:var(--bg)}
header .wrap{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px;padding-top:12px;padding-bottom:12px}
.brand{display:flex;align-items:center;gap:10px;font-family:var(--hfont);font-weight:800;font-size:22px;color:var(--ink);text-decoration:none;letter-spacing:-.02em}
.brand img{width:40px;height:40px;border-radius:50%;box-shadow:0 0 0 2px var(--acc)}
.brand span{color:var(--wasabi)} .brand small{display:block;font-family:var(--font);font-size:10px;letter-spacing:.24em;color:var(--muted);font-weight:700;margin-top:-2px}
nav a{color:var(--muted);text-decoration:none;margin-left:14px;font-size:15px} nav a:first-child{margin-left:0}
main{padding:40px 0 64px} h1,h2,h3{font-family:var(--hfont)} h2{font-size:26px}
.lede{color:var(--muted)} .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px;margin-top:20px}
.card{display:block;background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:18px;text-decoration:none;color:var(--ink)}
.card h3{margin:0 0 4px}.card p{margin:0;color:var(--muted);font-size:15px}
.label{position:fixed;right:10px;bottom:10px;z-index:9;background:#000;color:#fff;font:600 12px system-ui;padding:6px 10px;border-radius:8px;opacity:.75}
"""
CARDS=[("Micro Mayhem","Coming to the App Store"),("For the Waves","In development"),("Tetris Beats","In development"),("InkBleed","Coming soon")]
for key,t in THEMES.items():
    web=WEB.replace("/assets/ariel-head.svg","/assets/"+t["head"])
    cards="".join(f'<a class="card" href="#"><h3>{n}</h3><p>{s}</p></a>' for n,s in CARDS)
    html=f"""<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>wasabiari mock {t['name']}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family={t['fonts']}&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/web.css"><style>{BASE}{t['css']}</style><script defer src="/assets/web.js"></script>
<link rel="icon" href="/assets/ari-face.jpg"></head><body>
<header><div class="wrap"><a class="brand" href="#"><img src="/assets/ari-face.jpg" alt=""><span style="color:inherit">wasabi<span>ari</span><small>WASABI ENTERTAINMENT</small></span></a>
<nav><a href="#">Projects</a><a href="#">About</a><a href="#">Support</a></nav></div></header>
{web}<main><div class="wrap"><h2>Everything in one place</h2><p class="lede">Home of Wasabi Entertainment and Ivan's other projects.</p><div class="grid">{cards}</div></div></main>
<div class="label">{t['name']}</div></body></html>"""
    d=os.path.join(ROOT,"mocks",key); os.makedirs(d,exist_ok=True)
    open(os.path.join(d,"index.html"),"w").write(html)
print("ok")
