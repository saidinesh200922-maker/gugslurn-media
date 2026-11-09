// GugsLurn reel engine: every frame is a pure function of time t (seconds).
const W = 1080, H = 1920;
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const P = (t, a, b) => clamp((t - a) / (b - a));
const lerp = (a, b, x) => a + (b - a) * x;
const ease = {
  out: x => 1 - Math.pow(1 - x, 3),
  out5: x => 1 - Math.pow(1 - x, 5),
  in: x => x * x * x,
  io: x => (x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
  back: x => { const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); },
  elastic: x => (x <= 0 ? 0 : x >= 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - .75) * (2 * Math.PI / 3)) + 1),
};
const C = { navy: "#0B2548", navy2: "#163B65", ink: "#071A36", orange: "#FF7417", gold: "#FFB827", sky: "#5AA9FF", mint: "#2EE6A6", red: "#FF4D5E" };

// ---------- motion primitives (return inline style strings) ----------
function slam(t, t0, d = .32, from = 1.9) {
  const x = P(t, t0, t0 + d);
  if (t < t0) return "opacity:0;";
  const s = lerp(from, 1, ease.back(x));
  return `opacity:${clamp(x * 3)};transform:scale(${s});filter:blur(${(1 - ease.out(x)) * 10}px);`;
}
function rise(t, t0, d = .45, dy = 90) {
  const x = P(t, t0, t0 + d);
  if (t < t0) return "opacity:0;";
  return `opacity:${ease.out(x)};transform:translateY(${(1 - ease.out5(x)) * dy}px);`;
}
function pop(t, t0, d = .35) {
  const x = P(t, t0, t0 + d);
  if (t < t0) return "opacity:0;transform:scale(0);";
  return `opacity:${clamp(x * 4)};transform:scale(${ease.back(x)});`;
}
function slideX(t, t0, d = .4, dx = -900) {
  const x = P(t, t0, t0 + d);
  if (t < t0) return "opacity:0;";
  return `opacity:1;transform:translateX(${(1 - ease.out5(x)) * dx}px);`;
}
function shake(t, hits, amp = 22, decay = 11) {
  let dx = 0, dy = 0;
  for (const h of hits) {
    if (t < h) continue;
    const a = amp * Math.exp(-(t - h) * decay);
    dx += a * Math.sin((t - h) * 95);
    dy += a * Math.cos((t - h) * 77);
  }
  return `translate(${dx.toFixed(1)}px,${dy.toFixed(1)}px)`;
}
function flash(t, hits, d = .16, max = .55) {
  let o = 0;
  for (const h of hits) if (t >= h) o = Math.max(o, max * Math.exp(-(t - h) / d * 3));
  return o > .01 ? `<div style="position:absolute;inset:0;background:#fff;opacity:${o.toFixed(3)};z-index:50"></div>` : "";
}

// ---------- background ----------
const GRAIN = `url(data:image/svg+xml;base64,${btoa("<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(#n)' opacity='.55'/></svg>")})`;
function bg(t, mood = "brand") {
  const a = t * .35;
  const moods = {
    brand: [C.ink, "#0d2b57", "rgba(255,116,23,.55)", "rgba(90,169,255,.45)"],
    night: ["#03060f", "#07122a", "rgba(80,90,255,.35)", "rgba(255,116,23,.22)"],
    warm: ["#1a0b05", "#3a1606", "rgba(255,116,23,.7)", "rgba(255,184,39,.5)"],
  }[mood];
  const x1 = 30 + 25 * Math.sin(a), y1 = 25 + 12 * Math.cos(a * .8);
  const x2 = 70 + 22 * Math.cos(a * .9), y2 = 75 + 10 * Math.sin(a * 1.1);
  const gx = (t * 18) % 120;
  return `<div style="position:absolute;inset:0;background:linear-gradient(170deg,${moods[0]},${moods[1]})"></div>
  <div style="position:absolute;inset:-10%;background:radial-gradient(circle at ${x1}% ${y1}%,${moods[2]},transparent 38%),radial-gradient(circle at ${x2}% ${y2}%,${moods[3]},transparent 40%);filter:blur(30px)"></div>
  <div style="position:absolute;inset:0;opacity:.09;background-image:linear-gradient(rgba(255,255,255,.6) 2px,transparent 2px),linear-gradient(90deg,rgba(255,255,255,.6) 2px,transparent 2px);background-size:120px 120px;background-position:0 ${gx}px;mask-image:radial-gradient(ellipse at 50% 50%,#000 20%,transparent 75%)"></div>
  <div style="position:absolute;inset:0;background-image:${GRAIN};background-position:${(t * 997) % 300}px ${(t * 613) % 300}px;opacity:.12;mix-blend-mode:overlay"></div>
  <div style="position:absolute;inset:0;background:radial-gradient(ellipse at center,transparent 55%,rgba(0,0,0,.55))"></div>`;
}
function logo(o = 1, y = 128, w = 330) {
  return `<img src="../assets/logo-white.png" style="position:absolute;left:${(W - w) / 2}px;top:${y}px;width:${w}px;opacity:${o}">`;
}
function progressBar(t, dur) {
  return `<div style="position:absolute;left:0;top:0;height:10px;width:${(t / dur) * 100}%;background:linear-gradient(90deg,${C.orange},${C.gold});z-index:60"></div>`;
}

// ---------- components ----------
function chip(text, bgc = "rgba(255,255,255,.1)", color = "#fff", extra = "") {
  return `<span style="display:inline-flex;align-items:center;gap:14px;padding:16px 30px;border-radius:999px;background:${bgc};color:${color};font:700 40px Inter;border:2px solid rgba(255,255,255,.18);${extra}">${text}</span>`;
}
function ctaButton(t, t0, label = "Start free → gugslurn.ai") {
  const pulse = t > t0 + .4 ? 1 + .035 * Math.sin((t - t0) * 7.5) : 1;
  const sheen = ((t - t0) * 70) % 260 - 60;
  return `<div style="${pop(t, t0, .4)}"><div style="transform:scale(${pulse});display:inline-block;position:relative;overflow:hidden;padding:38px 64px;border-radius:999px;background:linear-gradient(90deg,${C.orange},#ff9a3d);color:#fff;font:900 56px 'Inter Display';letter-spacing:-.01em;box-shadow:0 20px 60px rgba(255,116,23,.55),0 0 0 8px rgba(255,116,23,.18)">${label}<div style="position:absolute;top:0;bottom:0;left:${sheen}%;width:22%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.55),transparent);transform:skewX(-20deg)"></div></div></div>`;
}

// Chat: msgs = [{who:'me'|'ai', text, at, cps, think}] ; lines starting with '=' render as equation rows.
function bubbleHTML(m, t) {
  const lt = t - m.at;
  const think = m.who === "ai" ? (m.think ?? .55) : 0;
  const appear = `transform-origin:${m.who === "me" ? "100% 100%" : "0 100%"};${pop(t, m.at, .3)}`;
  let inner;
  if (m.who === "ai" && lt < think) {
    const dots = [0, 1, 2].map(i => `<span style="display:inline-block;width:18px;height:18px;border-radius:50%;background:#8aa0bd;margin:0 5px;transform:translateY(${-8 * Math.max(0, Math.sin(lt * 9 - i * .9))}px)"></span>`).join("");
    inner = `<div style="padding:10px 6px">${dots}</div>`;
  } else {
    const n = m.who === "ai" ? Math.floor((lt - think) * (m.cps || 55)) : 1e9;
    let left = n, rows = [];
    for (const line of m.text.split("\n")) {
      if (left <= 0) break;
      const eq = line.startsWith("=");
      const raw = eq ? line.slice(1) : line;
      const vis = raw.slice(0, left);
      left -= raw.length;
      rows.push(eq ? `<div style="font:700 38px 'DejaVu Sans Mono',monospace;color:${C.navy2};background:#FFF1E6;border-left:8px solid ${C.orange};padding:10px 18px;border-radius:12px;margin:10px 0">${vis}</div>` : `<div>${vis}</div>`);
    }
    const caret = m.who === "ai" && n < m.text.replace(/\n=/g, "\n").length ? `<span style="display:inline-block;width:4px;height:38px;background:${C.orange};vertical-align:middle;margin-left:4px"></span>` : "";
    inner = rows.join("") + caret;
  }
  const me = m.who === "me";
  return `<div style="display:flex;justify-content:${me ? "flex-end" : "flex-start"};margin:16px 0"><div style="${appear}max-width:86%;padding:24px 30px;border-radius:${me ? "34px 34px 8px 34px" : "34px 34px 34px 8px"};background:${me ? C.navy2 : "#fff"};color:${me ? "#fff" : "#10233d"};font:${me ? 600 : 500} 38px/1.35 Inter;box-shadow:0 6px 18px rgba(16,35,61,.12)">${inner}</div></div>`;
}
function phoneChat(t, msgs, opts = {}) {
  const shown = msgs.filter(m => t >= m.at);
  const voice = opts.voice && t >= opts.voice;
  const bars = Array.from({ length: 22 }, (_, i) => 10 + 36 * Math.abs(Math.sin(t * 9 + i * 1.7) * Math.sin(t * 3.1 + i))).map(h => `<span style="display:inline-block;width:7px;height:${h}px;background:#fff;border-radius:4px;margin:0 3px"></span>`).join("");
  return `<div style="width:640px;height:1180px;border-radius:84px;background:#05080f;padding:18px;box-shadow:0 50px 120px rgba(0,0,0,.6),0 0 0 3px rgba(255,255,255,.12) inset">
   <div style="width:100%;height:100%;border-radius:68px;overflow:hidden;background:linear-gradient(#F5F9FC,#EAF0F8);position:relative">
    <div style="position:absolute;top:18px;left:50%;transform:translateX(-50%);width:190px;height:44px;border-radius:30px;background:#05080f;z-index:3"></div>
    <div style="padding:96px 34px 22px;display:flex;align-items:center;gap:20px;background:#fff;border-bottom:2px solid #e3eaf3">
      <img src="../assets/mark.png" style="width:66px">
      <div><div style="font:800 38px Inter;color:#10233d">AI Tutor</div><div style="font:600 28px Inter;color:#1a9b6c">● online · NEET</div></div>
    </div>
    <div style="position:absolute;top:220px;bottom:150px;left:26px;right:26px;display:flex;flex-direction:column;justify-content:flex-end;overflow:hidden">${shown.map(m => bubbleHTML(m, t)).join("")}</div>
    <div style="position:absolute;left:26px;right:26px;bottom:34px;height:96px;border-radius:50px;background:#fff;border:2px solid #dbe4ef;display:flex;align-items:center;padding:0 14px 0 34px;gap:16px">
      <div style="flex:1;font:500 32px Inter;color:#93a3b8">${voice ? `<span style="color:${C.navy2};font-weight:700">Listening…</span>` : "Ask anything…"}</div>
      <div style="height:72px;min-width:72px;padding:0 ${voice ? 22 : 0}px;border-radius:40px;background:${voice ? C.orange : C.navy2};display:flex;align-items:center;justify-content:center;transform:scale(${voice ? 1 + .06 * Math.sin(t * 10) : 1})">${voice ? bars : `<svg width="34" height="34" viewBox="0 0 24 24" fill="#fff"><path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-2.08A7 7 0 0 0 19 12z"/></svg>`}</div>
    </div>
   </div></div>`;
}
function phoneShot(src) {
  return `<div style="width:560px;height:1020px;border-radius:76px;background:#05080f;padding:16px;box-shadow:0 50px 120px rgba(0,0,0,.6)"><div style="width:100%;height:100%;border-radius:62px;overflow:hidden;background:#fff"><img src="${src}" style="width:100%;height:100%;object-fit:cover;object-position:top"></div></div>`;
}

// ---------- scene runner ----------
// SCENES: [{t0,t1,draw:(lt,t)=>html, enter:'punch'|'none', exit:'zoom'|'cut'}]
function stage(t, SCENES, opts = {}) {
  let html = "";
  for (const s of SCENES) {
    const exitD = s.exitD ?? .2;
    if (t < s.t0 || t >= s.t1 + (s.exit === "zoom" ? exitD : 0)) continue;
    const lt = t - s.t0;
    let tr = "", op = 1;
    if (s.enter !== "none") { const x = P(lt, 0, .3); tr += `scale(${lerp(1.12, 1, ease.out(x))}) `; }
    if (t >= s.t1) { const x = P(t, s.t1, s.t1 + exitD); tr += `scale(${lerp(1, 1.35, ease.in(x))})`; op = 1 - x; }
    html += `<div style="position:absolute;inset:0;transform:${tr};opacity:${op};transform-origin:50% 45%">${s.draw(lt, t)}</div>`;
  }
  const sh = shake(t, opts.shakes || []);
  return `<div style="position:absolute;inset:0;overflow:hidden">${bg(t, opts.mood ? opts.mood(t) : "brand")}<div style="position:absolute;inset:0;transform:${sh}">${html}</div>${flash(t, opts.flashes || [])}${opts.logo === false ? "" : logo(opts.logoOpacity ? opts.logoOpacity(t) : 1)}${progressBar(t, opts.dur)}</div>`;
}
