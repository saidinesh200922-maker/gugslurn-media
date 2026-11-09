# Source for the November 2026 reels and carousels

Everything is drawn in HTML and filmed with Playwright. The music and sound effects are synthesized in `audio.py`, so there's no licensed audio.

- Edit text and timing in `reel1.js`, `reel2.js`, `reel3.js` (scenes) and `carousel.js` (slides).
- Re-render a reel: `python3 render.py reel1 full` (needs Python with playwright, numpy and scipy, plus ffmpeg). Output goes to `../out/`.
- Preview frames: `python3 render.py reel1 frames 0,5,10`.
- Re-shoot carousels: `python3 shoot.py`.
- Expected layout: put `source/` files in a `build/` folder, `assets/` beside it, and an `out/` folder next to both.
