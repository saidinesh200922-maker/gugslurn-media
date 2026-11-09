"""usage: render.py <reel> frames t1,t2,...   -> out/<reel>_t.jpg (full size stills)
          render.py <reel> full               -> out/<reel>.mp4 (video + soundtrack)"""
import json, os, subprocess, sys
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "..", "out")
FPS = 30
reel, mode = sys.argv[1], sys.argv[2]
html = os.path.join(HERE, f"{reel}.html")
open(html, "w").write(f"""<!doctype html><html><head><meta charset="utf-8"><style>
html,body{{margin:0;width:1080px;height:1920px;overflow:hidden;background:#000}}#root{{position:relative;width:1080px;height:1920px}}
*{{box-sizing:border-box}}</style></head><body><div id="root"></div>
<script src="engine.js"></script><script src="{reel}.js"></script></body></html>""")

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 1080, "height": 1920})
    pg.goto("file://" + html)
    pg.wait_for_load_state("networkidle")
    pg.evaluate("document.fonts.ready")
    dur = pg.evaluate("DUR")
    if mode == "frames":
        for ts in sys.argv[3].split(","):
            pg.evaluate(f"render({float(ts)})")
            pg.wait_for_timeout(60)
            pg.screenshot(path=os.path.join(OUT, f"{reel}_{ts}.jpg"), type="jpeg", quality=92)
        print("frames done")
    else:
        spec = pg.evaluate("JSON.stringify(AUDIO)")
        spath = os.path.join(HERE, f"{reel}_audio.json")
        open(spath, "w").write(spec)
        wav = os.path.join(HERE, f"{reel}.wav")
        subprocess.run([sys.executable, os.path.join(HERE, "audio.py"), spath, wav], check=True)
        silent = os.path.join(HERE, f"{reel}_v.tmp.mp4")
        ff = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "image2pipe", "-framerate", str(FPS), "-c:v", "mjpeg", "-i", "-",
                               "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-pix_fmt", "yuv420p", "-movflags", "+faststart", silent],
                              stdin=subprocess.PIPE)
        n = int(round(dur * FPS))
        for i in range(n):
            pg.evaluate(f"render({i / FPS})")
            ff.stdin.write(pg.screenshot(type="jpeg", quality=92))
        ff.stdin.close()
        assert ff.wait() == 0
        tmp = os.path.join(OUT, f"{reel}.tmp.mp4")
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", silent, "-i", wav, "-map", "0:v", "-map", "1:a", "-c:v", "copy",
                        "-c:a", "aac", "-b:a", "192k", "-af", "loudnorm=I=-14:TP=-1.5:LRA=9", "-ar", "44100", "-shortest", tmp], check=True)
        os.replace(tmp, os.path.join(OUT, f"{reel}.mp4"))
        os.remove(silent)
        print("video done", n, "frames")
    b.close()
