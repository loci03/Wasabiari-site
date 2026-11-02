"""Builds mocks/<theme>/index.html: the home page in several style directions."""
import os
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WEB=open(os.path.join(ROOT,"tools/home-web.html")).read()
THEMES={
"sticker":dict(name="1 · Sticker Pop",fonts="Fredoka:wght@500;700&family=Inter:wght@400;600;700",head="ari-head.jpg",css="""
:root{--bg:#fff6e6;--panel:#ffffff;--ink:#1b1b1b;--muted:#5d5548;--wasabi:#4f8f12;--acc:#9bd34a;--lilac:#c9a8f2;--line:#efe2c8;--font:'Inter',system-ui,sans-serif;--hfont:'Fredoka',system-ui,sans-serif}
.head{box-shadow:0 0 0 8px #fff,0 0 0 12px var(--ink),10px 12px 0 12px var(--lilac)}
.lines path{stroke:var(--ink);stroke-width:2}
.node{border-radius:18px;border:3px solid var(--ink);box-shadow:3px 3px 0 var(--ink);font-family:var(--hfont);font-size:16px;background:#fff}
.node small{font-family:var(--font);font-size:12px;font-weight:600;color:#40364c}
.node.proj{background:var(--lilac)} .node.big{background:var(--acc);color:var(--ink)}
.hello{font-family:var(--hfont)}
.card{border:3px solid var(--ink)!important;box-shadow:4px 4px 0 var(--ink)} .card h3{font-family:var(--hfont)}
"""),
"paper":dict(name="2 · Ink & Paper",fonts="Fraunces:opsz,wght@9..144,600;9..144,800&family=Inter:wght@400;600",head="ari-head.jpg",css="""
:root{--bg:#f2e8d6;--panel:#fbf5ea;--ink:#2a1c12;--muted:#6d5a48;--wasabi:#466b1e;--acc:#2a1c12;--line:#d9c8ad;--font:'Inter',system-ui,sans-serif;--hfont:'Fraunces',Georgia,serif}
body{background-image:radial-gradient(rgba(90,60,30,.025) 1px,transparent 1.2px),radial-gradient(rgba(90,60,30,.015) 1px,transparent 1.2px);background-size:7px 7px,11px 11px;background-position:0 0,3px 5px}
.head{box-shadow:0 0 0 7px var(--panel),0 0 0 10px var(--ink),0 18px 40px rgba(60,35,10,.25)}
.lines path{stroke:var(--ink);stroke-width:1.8;opacity:.9}
.node{border-radius:4px;border:1.6px solid var(--ink);background:var(--panel);box-shadow:3px 3px 0 rgba(42,28,18,.85);font-family:var(--hfont)}
.node small{font-family:var(--font);font-size:12px;font-weight:600}
.node.big{background:#466b1e;color:#fbf5ea}
.hello{font-family:var(--hfont)}
"""),
"fresh":dict(name="3 · Fresh Wasabi",fonts="Inter:wght@400;600;800",head="ari-head.jpg",css="""
:root{--bg:#f7faf3;--panel:#fff;--ink:#17201a;--muted:#55654f;--wasabi:#5f9a1c;--acc:#9bd34a;--line:#dde6d4;--font:'Inter',system-ui,sans-serif;--hfont:'Inter',system-ui,sans-serif}
.head{box-shadow:0 0 0 8px var(--bg),0 0 0 14px var(--acc),0 0 0 17px var(--ink),0 20px 50px rgba(0,0,0,.18)}
.lines path{stroke:#5f9a1c;stroke-width:2;opacity:1}
.node{border-radius:999px;border:2px solid var(--acc);box-shadow:0 4px 12px rgba(0,0,0,.12)} .node small{font-size:12px;font-weight:600}
.node.big{background:var(--acc);color:#10200a}
"""),
"night":dict(name="4 · Night Arcade",fonts="Space+Grotesk:wght@500;700",head="ari-head.jpg",css="""
:root{--bg:#090d08;--panel:#111a0f;--ink:#eaf7dc;--muted:#a3b898;--wasabi:#b6ff4d;--acc:#b6ff4d;--line:#22301d;--font:'Space Grotesk',system-ui,sans-serif;--hfont:'Space Grotesk',system-ui,sans-serif}
body{background-image:linear-gradient(rgba(182,255,77,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(182,255,77,.025) 1px,transparent 1px);background-size:32px 32px}
.head{box-shadow:0 0 0 6px var(--bg),0 0 0 9px var(--acc),0 0 50px rgba(182,255,77,.3)}
.lines path{stroke:var(--acc);stroke-width:2;opacity:.9}
.node{border-radius:10px;border:1.5px solid var(--acc);background:#111a0f;font-size:15px;font-weight:700} .node small{font-size:12px}
.node.big{background:var(--acc);color:#0b1407}
"""),
"orchard":dict(name="5 · Storybook Orchard (new, Fox)",fonts="Fraunces:opsz,wght@9..144,600;9..144,800&family=Inter:wght@400;600",head="ari-head.jpg",css="""
:root{--bg:#fffaf0;--panel:#ffffff;--ink:#243c2c;--muted:#5b6b5e;--wasabi:#5b8d2a;--acc:#86b94b;--peach:#e8b079;--line:#efe4cf;--font:'Inter',system-ui,sans-serif;--hfont:'Fraunces',Georgia,serif}
.head{box-shadow:0 0 0 8px #fff,0 0 0 13px var(--acc),0 0 0 15px var(--ink),0 18px 40px rgba(36,60,44,.2)}
.lines path{stroke:var(--ink);stroke-width:1.6;opacity:.8}
.node{border-radius:12px;border:1.5px solid var(--ink);background:#fff;font-family:var(--hfont);box-shadow:0 6px 16px rgba(36,60,44,.12)}
.node small{font-family:var(--font);font-size:12px;font-weight:600}
.node.proj{background:#fdf0e1;border-color:var(--peach)} .node.big{background:var(--ink);color:#fffaf0;border-color:var(--ink)}
.hello{font-family:var(--hfont)} .card{border-radius:12px}
"""),
"shelf":dict(name="6 · Family Game Shelf (new, Fox)",fonts="Nunito+Sans:wght@400;700;900",head="ari-head.jpg",css="""
:root{--bg:#f7f5ef;--panel:#ffffff;--ink:#243047;--muted:#5a6377;--wasabi:#4f7f22;--acc:#78a943;--sun:#edba55;--line:#e4e0d4;--font:'Nunito Sans',system-ui,sans-serif;--hfont:'Nunito Sans',system-ui,sans-serif}
.head{box-shadow:0 0 0 8px #fff,0 0 0 12px var(--sun),0 16px 40px rgba(36,48,71,.18)}
.lines path{stroke:#9aa3b5;stroke-width:2;opacity:.9}
.node{border-radius:16px;border:0;background:#fff;box-shadow:0 2px 0 #e4e0d4,0 8px 20px rgba(36,48,71,.12);font-weight:900}
.node small{font-size:12px;font-weight:700}
.node.proj{border-top:6px solid var(--sun)} .node.big{background:var(--ink);color:#fff}
.hello{font-weight:900} .card{border-radius:18px;border:0;box-shadow:0 8px 20px rgba(36,48,71,.08);border-top:6px solid var(--sun)}
"""),
}
BASE="""*{box-sizing:border-box}html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--ink);font:17px/1.6 var(--font)}
a{color:var(--wasabi)}
.wrap{max-width:920px;margin:0 auto;padding:0 16px}
header{position:absolute;top:0;left:0;right:0;z-index:5}
header .wrap{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px;padding-top:12px;padding-bottom:12px}
.brand{display:flex;align-items:center;gap:10px;font-family:var(--hfont);font-weight:800;font-size:22px;color:var(--ink);text-decoration:none;letter-spacing:-.02em}
.brand img{width:40px;height:40px;border-radius:50%;box-shadow:0 0 0 2px var(--acc)}
.brand span{color:var(--wasabi)} .brand small{display:block;font-family:var(--font);font-size:10px;letter-spacing:.24em;color:var(--muted);font-weight:700;margin-top:-2px}
nav a{color:var(--muted);text-decoration:none;margin-left:14px;font-size:15px;display:inline-block;padding:12px 0} nav a:first-child{margin-left:0}
main{padding:40px 0 64px} h1,h2,h3{font-family:var(--hfont)} h2{font-size:26px}
.lede{color:var(--muted)} .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px;margin-top:20px}
.card{display:block;background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:18px;text-decoration:none;color:var(--ink)}
.card h3{margin:0 0 4px}.card .pv{display:inline-block;margin-top:8px;font-size:14px;padding:6px 0}.legal{margin-top:28px;font-size:15px;color:var(--muted)}.legal a{display:inline-block;padding:8px 0;margin-right:16px}.card p{margin:0;color:var(--muted);font-size:15px}
.label{position:fixed;right:10px;bottom:10px;z-index:9;background:#000;color:#fff;font:600 12px system-ui;padding:6px 10px;border-radius:8px;opacity:.75}
"""
CARDS=[("Micro Mayhem","Coming to the App Store",True),("For the Waves","In development",True),("Tetris Beats","In development",True),("InkBleed","Coming soon",False)]
for key,t in THEMES.items():
    web=WEB.replace("/assets/ariel-head.svg","/assets/"+t["head"])
    cards="".join(f'<div class="card"><h3>{n}</h3><p>{st}</p>'+('<a class="pv" href="#">Privacy</a>' if pv else '')+'</div>' for n,st,pv in CARDS)
    web=web.replace('class="node" data-id="inkbleed"','class="node proj" data-id="inkbleed"').replace('class="node" data-id="micro"','class="node proj" data-id="micro"').replace('class="node" data-id="waves"','class="node proj" data-id="waves"').replace('class="node" data-id="tetris"','class="node proj" data-id="tetris"')
    html=f"""<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>wasabiari mock {t['name']}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family={t['fonts']}&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/web.css"><style>{BASE}{t['css']}</style><script defer src="/assets/web.js"></script>
<link rel="icon" href="/assets/ari-face.jpg"></head><body>
<header><div class="wrap"><a class="brand" href="#"><img src="/assets/ari-face.jpg" alt=""><span style="color:inherit">wasabi<span>ari</span><small>WASABI ENTERTAINMENT</small></span></a>
<nav><a href="#">Projects</a><a href="#">About</a><a href="#">Support</a></nav></div></header>
{web}<main><div class="wrap"><h2>Everything in one place</h2><p class="lede">Home of Wasabi Entertainment and Ivan's other projects.</p><div class="grid">{cards}</div><p class="legal"><a href="#">Contact &amp; Support</a><a href="#">Micro Mayhem privacy</a><a href="#">For the Waves privacy</a></p></div></main>
<div class="label">{t['name']}</div></body></html>"""
    d=os.path.join(ROOT,"mocks",key); os.makedirs(d,exist_ok=True)
    open(os.path.join(d,"index.html"),"w").write(html)
print("ok")
