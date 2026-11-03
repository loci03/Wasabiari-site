import os, sys
BRAND = "WASABI Entertainment"
OUT = sys.argv[1]
NAV = [("/", "Home"), ("/projects/", "Projects"), ("/shop/", "Shop & Merch"), ("/support/", "Contact & Support")]
CSS = """
:root{--bg:#fff6e6;--panel:#ffffff;--ink:#1b1b1b;--muted:#5d5548;--wasabi:#4f8f12;--acc:#9bd34a;--lilac:#c9a8f2;--line:#efe2c8;
  --font:'Inter',system-ui,-apple-system,sans-serif;--hfont:'Fredoka',system-ui,sans-serif}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--ink);font:17px/1.6 var(--font)}
a{color:var(--wasabi);font-weight:600}a:hover{color:var(--ink)}
.wrap{max-width:920px;margin:0 auto;padding:0 16px}
header{position:relative;z-index:5;background:var(--bg);border-bottom:3px solid var(--ink)}
body.home header{position:absolute;top:0;left:0;right:0;background:transparent;border-bottom:0}
header .wrap{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:4px 14px;padding-top:10px;padding-bottom:10px}
.brand{display:flex;align-items:center;gap:10px;color:var(--ink);text-decoration:none}
.brand img{width:42px;height:42px;border-radius:50%;box-shadow:0 0 0 2px #fff,0 0 0 4px var(--ink),3px 3px 0 4px var(--lilac)}
.brand b{display:block;font-family:var(--hfont);font-weight:700;font-size:23px;line-height:1.05;letter-spacing:-.01em}
.brand b span{color:var(--wasabi)}
.brand small{display:block;font-size:10px;letter-spacing:.24em;color:var(--muted);font-weight:700}
nav{display:flex;flex-wrap:wrap;gap:0 16px}
nav a{color:var(--muted);text-decoration:none;font-size:15px;font-weight:600;display:inline-block;padding:11px 0}
@media (max-width:430px){nav{flex-wrap:nowrap;gap:0 12px}nav a{font-size:14px;white-space:nowrap}}
@media (max-width:374px){nav{gap:0 9px}nav a{font-size:13px}}
nav a.on,nav a:hover{color:var(--ink);text-decoration:underline;text-decoration-thickness:3px;text-decoration-color:var(--acc);text-underline-offset:5px}
main{padding:40px 0 64px}
h1,h2,h3{font-family:var(--hfont);font-weight:700}
h1{font-size:clamp(32px,7vw,50px);line-height:1.08;margin:0 0 12px}
h2{font-size:24px;margin:36px 0 10px}
.lede{font-size:19px;color:var(--muted);max-width:620px}
.crumbs{font-size:14px;color:var(--muted);margin-bottom:14px}.crumbs a{color:var(--muted);display:inline-block;padding:6px 0}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:18px;margin-top:24px}
.card{display:block;background:var(--panel);border:3px solid var(--ink);border-radius:18px;padding:18px;color:var(--ink);box-shadow:4px 4px 0 var(--ink);transition:transform .12s,box-shadow .12s}
a.card{text-decoration:none}a.card:hover{transform:translate(-2px,-2px);box-shadow:6px 6px 0 var(--ink)}
.card.proj{background:#f4ecff}
.card.shop{background:#eaf6d9}
.card h3{margin:0 0 4px;font-size:21px}.card h3 a{color:var(--ink);text-decoration:none}
.card p{margin:0;color:var(--muted);font-size:15px}
.card .pv{display:inline-block;margin-top:8px;font-size:14px;padding:6px 0}
.tag{display:inline-block;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;padding:3px 10px;border-radius:999px;border:2px solid var(--ink);background:#fff;color:var(--ink);margin-bottom:10px}
.tag.live{background:var(--acc)}
.btn{display:inline-block;background:var(--acc);color:var(--ink);font-family:var(--hfont);font-weight:700;font-size:18px;padding:12px 20px;border-radius:14px;border:3px solid var(--ink);box-shadow:3px 3px 0 var(--ink);text-decoration:none;margin:8px 10px 0 0}
.btn.ghost{background:#fff}
.note{background:#fff;border:2px dashed var(--ink);border-radius:12px;padding:12px 14px;color:var(--muted);font-size:15px}
.links{margin-top:28px;font-size:15px}.links a{display:inline-block;padding:8px 0;margin-right:18px}
footer{border-top:3px solid var(--ink);color:var(--muted);font-size:14px;background:#fff}
footer .wrap{padding-top:14px;padding-bottom:22px;display:flex;flex-wrap:wrap;gap:0 18px;align-items:center}
footer a{color:var(--muted);display:inline-block;padding:8px 0}
.legal{max-width:680px}.legal h2{font-size:20px}
"""
FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;700&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">'
def page(path, title, body, active="/", pre="", extra_head=""):
    nav = "".join(f'<a href="{h}"{" class=on" if h==active else ""}>{t}</a>' for h,t in NAV)
    html = f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title}</title>{FONTS}<link rel="stylesheet" href="/assets/style.css"><link rel="icon" href="/assets/ari-face.jpg"><link rel="apple-touch-icon" href="/assets/ari-face.jpg">{extra_head}</head>
<body{' class="home"' if pre else ''}><header><div class="wrap"><a class="brand" href="/"><img src="/assets/ari-face.jpg" alt=""><span><b>wasabi<span>ari</span></b><small>WASABI ENTERTAINMENT</small></span></a><nav>{nav}</nav></div></header>
{pre}<main><div class="wrap">{body}</div></main>
<footer><div class="wrap"><span>&copy; 2026 {BRAND} &middot; Boston, MA</span><a href="/support/">Contact &amp; Support</a><a href="/support/#privacy">Privacy policies</a></div></footer>
</body></html>
"""
    d = os.path.join(OUT, path.strip("/"))
    os.makedirs(d, exist_ok=True)
    open(os.path.join(d, "index.html"), "w").write(html)

MIC_SECTION = """<h2>Microphone and speech recognition</h2><p>One level, Walk It, asks you to shout &ldquo;HIDE!&rdquo; at your phone. For that level only, the game asks for permission to use the microphone and speech recognition. Speech recognition runs entirely on your iPhone: your voice is never recorded, saved, or sent to us, to Apple, or to anyone else. The game listens only while that level is on screen and stops as soon as it ends. If recognition doesn't catch the word, the game also accepts a loud shout, which it detects by measuring loudness only.</p>
<p>When you first play the level, iOS shows its standard speech recognition prompt, which mentions that speech data may be sent to Apple. Micro Mayhem! asks only for on-device recognition, so your audio stays on your iPhone.</p>
<p>You can say no. If you do, a big HIDE button appears instead and the level plays the same way. You can change this any time in Settings &gt; Privacy &amp; Security &gt; Microphone and Speech Recognition.</p>"""

EXTRA_PRIVACY = {
    "stryde-rider": """<h2>Bluetooth and your bike</h2><p>Stryde Rider connects to your cadence sensor over Bluetooth to read how fast you pedal. That reading is used for the ride and stays on your device.</p>""",
    "turner": """<h2>Your TV subscription</h2><p class="note">DRAFT: Turner signs in to the IPTV service you choose. This section needs to say where that login is kept and what the provider sees, once it's settled how Turner ships.</p>""",
}

BEAT_STACK_PRIVACY = """<p>{game} is made by Ivan ({brand}) in Boston, Massachusetts. This policy explains what the game does with your information. Short version: there are no accounts, ads or tracking. Only the initials and scores you choose to post, and your moves during a battle, go to our server.</p>
<h2>What we collect</h2>
<p><b>Shared leaderboard.</b> When you get a high score, the game asks for your initials. If you enter them, it sends those initials (up to 3 letters or numbers), your score, lines, level and game mode, plus your finish time in Sprint. We keep that with the date in a public top-50 list for each mode, which everyone who plays can see. Please use initials, not your name. If you&rsquo;re offline, the score waits on your device and is sent when you&rsquo;re back online.</p>
<p><b>Battles.</b> In a head-to-head game, both players join a room with a 4-character code. Our server passes your initials and your moves to your opponent while the match runs. Battles are not saved.</p>
<p><b>Your IP address.</b> Like any website, our server sees your device&rsquo;s IP address when the game connects. We use it only to limit score uploads to 10 a minute, keep it in memory for about a minute, and never store it.</p>
<h2>What stays on your device</h2><p>Your settings (sound, volume, voice, ghost piece, AI difficulty and starting level), your replays and your own score list are saved only on your device. We cannot see them.</p>
<h2>Third parties</h2><p>We do not sell or share your data. The leaderboard and battle server runs on Cloudflare, which handles connection data under <a href="https://www.cloudflare.com/privacypolicy/">its own privacy policy</a>. The game&rsquo;s fonts load from Google Fonts, which sees your IP address under <a href="https://policies.google.com/privacy">Google&rsquo;s privacy policy</a>. If the game comes to the App Store, Apple may collect data under its own policy when you download it.</p>
<h2>Children</h2><p>The game has no accounts and asks for nothing but optional initials, so we don&rsquo;t knowingly collect personal information from children.</p>
<h2>Changes</h2><p>If this changes, we will update this page and the date above before the change ships.</p>
<h2>Contact</h2><p>Questions, or want a leaderboard entry removed? Email <a href="mailto:support@wasabiari.com">support@wasabiari.com</a>.</p>"""

DRAFT_NOTE = """<p class="note">DRAFT: written assuming the game has no accounts, ads, analytics, or online features. Confirm before publishing.</p>
"""

def privacy(slug, game, updated="November 1, 2026", extra="", online=False, draft=True):
    head = f"""<div class="legal"><div class="crumbs"><a href="/{slug}/">{game}</a> / Privacy</div>
<h1>{game} privacy policy</h1><p class="lede">Last updated: {updated}</p>
"""
    if online:
        return head + BEAT_STACK_PRIVACY.format(game=game, brand=BRAND) + "</div>"
    return head + f"""{DRAFT_NOTE if draft else ""}<p>{game} is made by Ivan ({BRAND}) in Boston, Massachusetts. This policy explains what the game does with your information. Short version: nothing leaves your device.</p>
<h2>What we collect</h2><p>We do not collect, store, or share any personal information. The game has no accounts, no ads, and no analytics or tracking.</p>
<h2>What stays on your device</h2><p>Your progress and settings are saved only on your device (and in your own iCloud backup if you use one). We cannot see them.</p>
{extra}<h2>Children</h2><p>Because we collect no information from anyone, we collect none from children.</p>
<h2>Third parties</h2><p>We do not sell or share data with anyone. Apple may collect data under its own privacy policy when you download apps from the App Store.</p>
<h2>Changes</h2><p>If this ever changes, for example if online features are added, we will update this page and the date above before the change ships.</p>
<h2>Contact</h2><p>Questions? Email <a href="mailto:support@wasabiari.com">support@wasabiari.com</a>.</p></div>"""

HOME_PRE = open(os.path.join(os.path.dirname(__file__), "home-web.html")).read()

# Ivan's structure (03:32Z 11-03): InkBleed / WASABI Entertainment (games) / Shop & Merch / Contact & Support.
# About moved into Contact & Support (Ivan, 15:08Z 11-03); /about/ redirects to /support/#about.
# Parked for now (Ivan, 16:04Z 11-03): add back to GAMES and tools/home-web.html to bring it back.
PARKED = [
    ("turner", "Turner", "Coming soon", "A clean, simple player for your own IPTV subscription: live channels, a TV guide and movies on your phone or TV."),
]
GAMES = [  # slug, name, status tag, blurb (from each project's earlier sessions/repos; Ivan can rewrite)
    ("micro-mayhem", "Micro Mayhem!", "App Store soon", "26 tiny, frantic games, a few seconds each. Milk the cow, zip the babbler, shout HIDE!"),
    ("beat-stack", "Beat Stack", "Coming soon", "A block-stacking puzzle set to music: 19 themed levels, story battles, a shared leaderboard and head-to-head play."),
    ("for-the-waves", "For the Waves", "Coming soon", "A neon pixel wave racer. Carve across open water, hit ramps and rings, and outrun a hungry shark."),
    ("stryde-rider", "Stryde Rider", "Coming soon", "A cycling game for your exercise bike. Your pedaling drives the ride: race AI riders and chase your own ghost."),
]
def tag(status):
    return f'<span class="tag{" live" if "App Store" in status else ""}">{status}</span>'
def game_cards(privacy_links=False):
    out = []
    for slug, name, status, blurb in GAMES:
        if privacy_links:
            out.append(f'<div class="card proj">{tag(status)}<h3><a href="/{slug}/">{name}</a></h3><p>{blurb}</p><a class="pv" href="/{slug}/privacy/">Privacy</a></div>')
        else:
            out.append(f'<a class="card proj" href="/{slug}/">{tag(status)}<h3>{name}</h3><p>{blurb}</p></a>')
    return "\n".join(out)
INK_CARD = '<a class="card" href="/inkbleed/"><span class="tag">Coming soon</span><h3>InkBleed</h3><p>A creative studio for comics, art, video and sound.</p></a>'
SHOP_CARD = '<a class="card shop" href="/shop/"><span class="tag">Opening soon</span><h3>Shop &amp; Merch</h3><p>3D prints, art prints, cards, comics and merch from my projects.</p></a>'

page("/", f"wasabiari · {BRAND}", f"""<h2 style="margin-top:0">Everything in one place</h2>
<p class="lede">Home of {BRAND} and Ivan's other projects, made in Boston.</p>
<div class="grid">
{INK_CARD}
{SHOP_CARD}
</div>
<h2>{BRAND}</h2>
<div class="grid">
{game_cards(True)}
</div>
<p class="links"><a href="/support/">Contact &amp; Support</a><a href="/support/#about">About</a></p>""", "/", pre=HOME_PRE, extra_head='<link rel="stylesheet" href="/assets/web.css"><script defer src="/assets/web.js"></script><script defer src="/assets/flair.js"></script>')
page("/projects/", "Projects · wasabiari", f"""<h1>Projects</h1><p class="lede">Everything I'm building, in one place.</p>
<div class="grid">
{INK_CARD}
</div>
<h2><a href="/wasabi-entertainment/" style="color:inherit">{BRAND}</a></h2><p>My games label.</p><div class="grid">
{game_cards()}
</div>
<h2>Shop &amp; Merch</h2><div class="grid">
{SHOP_CARD}
</div>""", "/projects/")
page("/wasabi-entertainment/", BRAND, f"""<div class="crumbs"><a href="/projects/">Projects</a> / {BRAND}</div>
<h1>{BRAND}</h1><p class="lede">Small games with big personality, made in Boston. Named after Wasabi.</p><div class="grid">
{game_cards()}
</div>""", "/projects/")
for slug, game, status, blurb in GAMES:
    online = slug == "beat-stack"
    free = ('<h2>Free, no ads</h2><p>The game is free, with a shared leaderboard and online battles. ' if online
            else '<h2>Free, no ads, no tracking</h2><p>The game is free and collects no personal data. ')
    page(f"/{slug}/", f"{game} · {BRAND}", f"""<div class="crumbs"><a href="/projects/">Projects</a> / <a href="/wasabi-entertainment/">{BRAND}</a> / {game}</div>
{tag(status)}<h1>{game}</h1>
<p class="lede">{blurb}</p>
<p class="note">Screenshots{" and the App Store button" if "App Store" in status else ""} go here once the game is out.</p>
{free}<a href="/{slug}/privacy/">Read the privacy policy</a>.</p>
<h2>Need help?</h2><p>Found a bug or have an idea? <a href="/support/">Contact support</a>.</p>""", "/projects/")
    # Checked against the code 11-03: Micro Mayhem! (Games' STORE-FACTS) and For the Waves make no
    # network calls; Beat Stack's Worker stores initials + scores only. Stryde Rider unchecked.
    checked = slug in ("micro-mayhem", "for-the-waves")
    if slug == "micro-mayhem":
        priv = privacy(slug, game, "November 3, 2026", MIC_SECTION, draft=False)
    elif slug in EXTRA_PRIVACY:
        priv = privacy(slug, game, "November 3, 2026", EXTRA_PRIVACY[slug])
    else:
        priv = privacy(slug, game, "November 3, 2026", online=online, draft=not checked)
    page(f"/{slug}/privacy/", f"{game} privacy policy", priv, "/projects/")
page("/inkbleed/", "InkBleed · coming soon", """<div class="crumbs"><a href="/projects/">Projects</a> / InkBleed</div>
<span class="tag">Coming soon</span><h1>InkBleed</h1><p class="lede">A creative studio for comics, art, video and sound, running on open models you own.</p>
<p>It's being built and tested at home first. Check back for news.</p>""", "/projects/")
page("/shop/", "Shop & Merch · wasabiari", f"""<h1>Shop &amp; Merch</h1><p class="lede">Things I make at home in Boston, from 3D prints and art prints to greeting cards, comics and {BRAND} merch. New projects show up here as they&rsquo;re ready. The shop opens soon.</p>
<div class="grid">
<div class="card shop"><span class="tag">Coming soon</span><h3>3D prints</h3><p>Figures, gifts and useful bits, printed to order on my own printer.</p></div>
<div class="card shop"><span class="tag">Coming soon</span><h3>Art prints</h3><p>Prints of my illustrations and comic art, made in InkBleed.</p></div>
<div class="card shop"><span class="tag">Coming soon</span><h3>Greeting cards</h3><p>Card sets I design for birthdays, holidays and just because.</p></div>
<div class="card shop"><span class="tag">Coming soon</span><h3>Comics</h3><p>Comics I write and draw in InkBleed, in print and digital.</p></div>
<div class="card shop"><span class="tag">Coming soon</span><h3>Merch</h3><p>Stickers, shirts and more from the {BRAND} games.</p></div>
</div>
<h2>Paying</h2><p>Checkout runs on Stripe, so you can pay with Apple Pay or a card. I never see or store your card details.</p>
<h2>Want something custom?</h2><p>A print with your name on it, a card set for an event, a one-off 3D print? Email <a href="mailto:support@wasabiari.com">support@wasabiari.com</a> and tell me what you have in mind.</p>""", "/shop/")
PRIV_LIST = " · ".join(f'<a href="/{slug}/privacy/">{name}</a>' for slug, name, _, _ in GAMES)
page("/support/", "Contact & Support · wasabiari", f"""<h1>Contact &amp; Support</h1><p class="lede">Questions, bugs, or ideas about any of my games or projects? I read every message.</p>
<a class="btn" href="mailto:support@wasabiari.com">Email support@wasabiari.com</a>
<h2>When you write about a bug</h2><p>Tell me which game, what you were doing, and your iPhone model. A screenshot helps a lot.</p>
<h2 id="privacy">Privacy policies</h2><p>{PRIV_LIST}</p>
<p>I usually reply within a few days.</p>
<h2 id="about">About</h2><p>I'm Ivan, a maker in Boston, Massachusetts. I make games, art, 3D prints and other projects at home, first for family and friends, and share the ones that turn out well here.</p>
<p>The name wasabiari comes from Wasabi, Ariel's nickname, plus the first three letters of her name.</p>""", "/support/")
# old /about/ link: send it to the About section on Contact & Support
os.makedirs(os.path.join(OUT, "about"), exist_ok=True)
open(os.path.join(OUT, "about", "index.html"), "w").write('<!doctype html><meta charset=utf-8><title>About · wasabiari</title><meta http-equiv="refresh" content="0; url=/support/#about"><link rel="canonical" href="/support/#about"><a href="/support/#about">About</a>')
os.makedirs(os.path.join(OUT,"assets"), exist_ok=True)
open(os.path.join(OUT,"assets/style.css"),"w").write(CSS)
open(os.path.join(OUT,"CNAME"),"w").write("wasabiari.com\n")
open(os.path.join(OUT,"404.html"),"w").write('<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><link rel=stylesheet href="/assets/style.css"><main><div class=wrap><h1>Page not found</h1><p><a href="/">Back home</a></p></div></main>')
