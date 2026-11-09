import os
from playwright.sync_api import sync_playwright
H=os.path.dirname(os.path.abspath(__file__)); OUT=os.path.join(H,"..","out")
html=os.path.join(H,"carousel.html")
open(html,"w").write('<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;width:1080px;height:1350px;overflow:hidden}*{box-sizing:border-box}#root{position:relative;width:1080px;height:1350px}</style></head><body><div id="root"></div><script src="engine.js"></script><script src="carousel.js"></script></body></html>')
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={"width":1080,"height":1350})
    pg.goto("file://"+html); pg.wait_for_load_state("networkidle"); pg.evaluate("document.fonts.ready")
    for name,prefix in [("mistakes","carousel-5-neet-mistakes"),("tour","carousel-inside-gugslurn")]:
        n=pg.evaluate(f"SETS.{name}.length")
        for i in range(n):
            pg.evaluate(f"renderSlide('{name}',{i})"); pg.wait_for_timeout(120)
            pg.screenshot(path=os.path.join(OUT,f"{prefix}-{i+1:02d}.jpg"),type="jpeg",quality=93)
    b.close()
