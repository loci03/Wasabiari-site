"""Copy the built site to OUT with relative links, for the private claude.ai preview.

Usage: python3 tools/preview.py OUT_DIR   (run from the repo root, after tools/build.py)
Then publish OUT_DIR/index.html with every other file under OUT_DIR as supporting files.
"""
import os, re, shutil, sys
OUT = sys.argv[1]
for root, dirs, fs in os.walk("."):
    dirs[:] = [d for d in dirs if d not in (".git", "tools")]
    for f in fs:
        if f in ("CNAME", ".nojekyll"):
            continue
        src = os.path.relpath(os.path.join(root, f), ".")
        dst = os.path.join(OUT, src)
        os.makedirs(os.path.dirname(dst) or OUT, exist_ok=True)
        if not src.endswith(".html"):
            shutil.copy(src, dst)
            continue
        depth = src.count("/")
        pre = "../" * depth if depth else "./"
        def rel(p):
            path, _, frag = p.partition("#")
            if path.endswith("/"):
                path += "index.html"
            return pre + path[1:] + ("#" + frag if frag else "")
        html = re.sub(r'(href|src)="(/[^"/][^"]*|/)"', lambda m: f'{m.group(1)}="{rel(m.group(2))}"', open(src).read())
        html = re.sub(r'url=(/[^"]*)"', lambda m: f'url={rel(m.group(1))}"', html)  # meta refresh redirects
        open(dst, "w").write(html)
