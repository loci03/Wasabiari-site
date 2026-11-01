import os, sys
OUT = sys.argv[1]
NAV = [("/", "Home"), ("/projects/", "Projects"), ("/about/", "About"), ("/support/", "Contact & Support")]
CSS = """
:root{--bg:#0f1410;--panel:#172019;--ink:#eef3ea;--muted:#a9b8a6;--wasabi:#9bd34a;--wasabi-deep:#6fa52a;--line:#2a372b}
@media (prefers-color-scheme: light){:root{--bg:#f7faf3;--panel:#ffffff;--ink:#17201a;--muted:#55654f;--wasabi:#5f9a1c;--wasabi-deep:#4a7c12;--line:#dde6d4}}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--ink);font:17px/1.6 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
a{color:var(--wasabi)}a:hover{color:var(--wasabi-deep)}
.wrap{max-width:880px;margin:0 auto;padding:0 20px}
header{border-bottom:1px solid var(--line)}
header .wrap{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px;padding-top:16px;padding-bottom:16px}
.brand{font-weight:800;font-size:20px;color:var(--ink);text-decoration:none;letter-spacing:-.01em}
.brand span{color:var(--wasabi)}
nav a{color:var(--muted);text-decoration:none;margin-left:16px;font-size:15px}
nav a:first-child{margin-left:0}
nav a.on,nav a:hover{color:var(--ink)}
main{padding:40px 0 64px}
h1{font-size:clamp(30px,6vw,46px);line-height:1.1;margin:0 0 12px;letter-spacing:-.02em}
h2{font-size:22px;margin:36px 0 10px}
.lede{font-size:19px;color:var(--muted);max-width:620px}
.crumbs{font-size:14px;color:var(--muted);margin-bottom:14px}.crumbs a{color:var(--muted)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px;margin-top:24px}
.card{display:block;background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:20px;text-decoration:none;color:var(--ink)}
.card:hover{border-color:var(--wasabi)}
.card h3{margin:0 0 6px;font-size:19px}.card p{margin:0;color:var(--muted);font-size:15px}
.tag{display:inline-block;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;padding:3px 8px;border-radius:999px;background:var(--line);color:var(--muted);margin-bottom:10px}
.tag.live{background:var(--wasabi);color:#0f1410}
.btn{display:inline-block;background:var(--wasabi);color:#0f1410;font-weight:700;padding:12px 18px;border-radius:10px;text-decoration:none;margin:8px 8px 0 0}
.btn.ghost{background:transparent;color:var(--ink);border:1px solid var(--line)}
.note{background:var(--panel);border:1px dashed var(--wasabi);border-radius:10px;padding:12px 14px;color:var(--muted);font-size:15px}
footer{border-top:1px solid var(--line);color:var(--muted);font-size:14px}
footer .wrap{padding-top:20px;padding-bottom:28px;display:flex;flex-wrap:wrap;gap:6px 18px}
footer a{color:var(--muted)}
.legal h2{font-size:19px}.legal{max-width:680px}
"""
def page(path, title, body, active="/", pre="", extra_head=""):
    nav = "".join(f'<a href="{h}"{" class=on" if h==active else ""}>{t}</a>' for h,t in NAV)
    html = f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title}</title><link rel="stylesheet" href="/assets/style.css">{extra_head}</head>
<body><header><div class="wrap"><a class="brand" href="/">wasabi<span>ari</span></a><nav>{nav}</nav></div></header>
{pre}<main><div class="wrap">{body}</div></main>
<footer><div class="wrap"><span>&copy; 2026 Wasabi Entertainment</span><a href="/support/">Contact &amp; Support</a><a href="/micro-mayhem/privacy/">Micro Mayhem privacy</a><a href="/for-the-waves/privacy/">For the Waves privacy</a><a href="/tetris-beats/privacy/">Tetris Beats privacy</a></div></footer>
</body></html>
"""
    d = os.path.join(OUT, path.strip("/"))
    os.makedirs(d, exist_ok=True)
    open(os.path.join(d, "index.html"), "w").write(html)

def privacy(slug, game):
    return f"""<div class="legal"><div class="crumbs"><a href="/{slug}/">{game}</a> / Privacy</div>
<h1>{game} privacy policy</h1><p class="lede">Last updated: November 1, 2026</p>
<p class="note">DRAFT: written assuming the game has no accounts, ads, analytics, or online features. Confirm before publishing.</p>
<p>{game} is made by Ivan (Wasabi Entertainment) in Boston, Massachusetts. This policy explains what the game does with your information. Short version: nothing leaves your device.</p>
<h2>What we collect</h2><p>We do not collect, store, or share any personal information. The game has no accounts, no ads, and no analytics or tracking.</p>
<h2>What stays on your device</h2><p>Your progress and settings are saved only on your device (and in your own iCloud backup if you use one). We cannot see them.</p>
<h2>Children</h2><p>The game is suitable for all ages. Because we collect no information from anyone, we collect none from children.</p>
<h2>Third parties</h2><p>We do not sell or share data with anyone. Apple may collect data under its own privacy policy when you download apps from the App Store.</p>
<h2>Changes</h2><p>If this ever changes, for example if online features are added, we will update this page and the date above before the change ships.</p>
<h2>Contact</h2><p>Questions? Email <a href="mailto:support@wasabiari.com">support@wasabiari.com</a>.</p></div>"""

HOME_PRE = open(os.path.join(os.path.dirname(__file__), "home-web.html")).read()
page("/", "wasabiari", """<h2 style="margin-top:0">Everything in one place</h2>
<p class="lede">Home of Wasabi Entertainment and my other projects. Built by Ivan in Boston.</p>
<div class="grid">
<a class="card" href="/micro-mayhem/"><span class="tag live">Coming to the App Store</span><h3>Micro Mayhem</h3><p>DRAFT: one line about the game.</p></a>
<a class="card" href="/for-the-waves/"><span class="tag">In development</span><h3>For the Waves</h3><p>DRAFT: one line about the game.</p></a>
<a class="card" href="/tetris-beats/"><span class="tag">In development</span><h3>Tetris Beats</h3><p>DRAFT: one line about the game.</p></a>
<a class="card" href="/inkbleed/"><span class="tag">Coming soon</span><h3>InkBleed</h3><p>A creative studio for comics, art, video and sound.</p></a>
</div>""", "/", pre=HOME_PRE, extra_head='<link rel="stylesheet" href="/assets/web.css"><script defer src="/assets/web.js"></script>')
page("/projects/", "Projects · wasabiari", """<h1>Projects</h1><p class="lede">Everything I'm building, in one place.</p>
<h2>Wasabi Entertainment</h2><p>My games label.</p><div class="grid">
<a class="card" href="/micro-mayhem/"><span class="tag live">Coming to the App Store</span><h3>Micro Mayhem</h3><p>DRAFT: one line about the game.</p></a>
<a class="card" href="/for-the-waves/"><span class="tag">In development</span><h3>For the Waves</h3><p>DRAFT: one line about the game.</p></a>
<a class="card" href="/tetris-beats/"><span class="tag">In development</span><h3>Tetris Beats</h3><p>DRAFT: one line about the game.</p></a></div>
<h2>Other projects</h2><div class="grid">
<a class="card" href="/inkbleed/"><span class="tag">Coming soon</span><h3>InkBleed</h3><p>A creative studio for comics, art, video and sound.</p></a></div>""", "/projects/")
page("/wasabi-entertainment/", "Wasabi Entertainment", """<div class="crumbs"><a href="/projects/">Projects</a> / Wasabi Entertainment</div>
<h1>Wasabi Entertainment</h1><p class="lede">Small games with big personality, made in Boston. Named after Wasabi.</p><div class="grid">
<a class="card" href="/micro-mayhem/"><span class="tag live">Coming to the App Store</span><h3>Micro Mayhem</h3><p>DRAFT: one line about the game.</p></a>
<a class="card" href="/for-the-waves/"><span class="tag">In development</span><h3>For the Waves</h3><p>DRAFT: one line about the game.</p></a>
<a class="card" href="/tetris-beats/"><span class="tag">In development</span><h3>Tetris Beats</h3><p>DRAFT: one line about the game.</p></a></div>""", "/projects/")
for slug, game, status in [("micro-mayhem","Micro Mayhem","Coming to the App Store"),("for-the-waves","For the Waves","In development"),("tetris-beats","Tetris Beats","In development")]:
    page(f"/{slug}/", f"{game} · Wasabi Entertainment", f"""<div class="crumbs"><a href="/projects/">Projects</a> / <a href="/wasabi-entertainment/">Wasabi Entertainment</a> / {game}</div>
<span class="tag{' live' if 'App' in status else ''}">{status}</span><h1>{game}</h1>
<p class="lede">DRAFT: two sentences about the game go here, from Ivan.</p>
<p class="note">Screenshots and the App Store button go here once the game is live.</p>
<h2>Free, no ads, no tracking</h2><p>The game is free and collects no personal data. <a href="/{slug}/privacy/">Read the privacy policy</a>.</p>
<h2>Need help?</h2><p>Found a bug or have an idea? <a href="/support/">Contact support</a>.</p>""", "/projects/")
    page(f"/{slug}/privacy/", f"{game} privacy policy", privacy(slug, game), "/projects/")
page("/inkbleed/", "InkBleed · coming soon", """<div class="crumbs"><a href="/projects/">Projects</a> / InkBleed</div>
<span class="tag">Coming soon</span><h1>InkBleed</h1><p class="lede">A creative studio for comics, art, video and sound, running on open models you own.</p>
<p>It's being built and tested at home first. Check back for news.</p>""", "/projects/")
page("/about/", "About · wasabiari", """<h1>About</h1><p class="lede">I'm Ivan, a maker in Boston, Massachusetts.</p>
<p>DRAFT: a few sentences from Ivan about himself and why he makes games and tools.</p>
<p>The name wasabiari comes from Wasabi, Ariel's nickname, plus the first three letters of her name.</p>""", "/about/")
page("/support/", "Contact & Support · wasabiari", """<h1>Contact &amp; Support</h1><p class="lede">Questions, bugs, or ideas about any of my games or projects? I read every message.</p>
<a class="btn" href="mailto:support@wasabiari.com">Email support@wasabiari.com</a>
<h2>When you write about a bug</h2><p>Tell me which game, what you were doing, and your iPhone model. A screenshot helps a lot.</p>
<h2>Privacy policies</h2><p><a href="/micro-mayhem/privacy/">Micro Mayhem</a> · <a href="/for-the-waves/privacy/">For the Waves</a> · <a href="/tetris-beats/privacy/">Tetris Beats</a></p>
<p>I usually reply within a few days.</p>""", "/support/")
os.makedirs(os.path.join(OUT,"assets"), exist_ok=True)
open(os.path.join(OUT,"assets/style.css"),"w").write(CSS)
open(os.path.join(OUT,"CNAME"),"w").write("wasabiari.com\n")
open(os.path.join(OUT,"404.html"),"w").write('<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><link rel=stylesheet href="/assets/style.css"><main><div class=wrap><h1>Page not found</h1><p><a href="/">Back home</a></p></div></main>')
