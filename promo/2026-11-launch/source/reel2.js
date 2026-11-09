// Reel 2 — "11:47 PM. Stuck on ONE question." (story)
const DUR = 19.2;
const col = (top, html, extra = "") => `<div style="position:absolute;left:70px;right:70px;top:${top}px;text-align:center;${extra}">${html}</div>`;
const H1 = (txt, size, color = "#fff", extra = "") => `<div style="font:900 ${size}px/0.98 'Inter Display';letter-spacing:-.04em;color:${color};${extra}">${txt}</div>`;
const X = `<svg width="60" height="60" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="${C.red}"/><path d="M21 21l22 22M43 21L21 43" stroke="#fff" stroke-width="7" stroke-linecap="round"/></svg>`;

function clock(min, glow = "rgba(255,77,94,.6)", roll = 0) {
  const mm = String(min).padStart(2, "0");
  return `<div style="display:inline-flex;align-items:baseline;gap:18px;padding:30px 60px;border-radius:40px;background:rgba(0,0,0,.45);border:3px solid rgba(255,255,255,.12)">
    <span style="font:800 230px/1 'DejaVu Sans Mono',monospace;color:#fff;letter-spacing:-.06em;text-shadow:0 0 50px ${glow}">11:<span style="display:inline-block;transform:translateY(${roll}px)">${mm}</span></span>
    <span style="font:800 70px Inter;color:#9fb3cc">PM</span></div>`;
}
function confetti(lt, t0, n = 46) {
  if (lt < t0 || lt > t0 + 1.6) return "";
  const x = lt - t0, cols = [C.orange, C.gold, C.mint, C.sky, "#fff"];
  let h = "";
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + i * .37, v = 700 + (i * 137 % 500);
    const px = 540 + Math.cos(a) * v * x, py = 1000 + Math.sin(a) * v * x * .8 + 1400 * x * x;
    h += `<div style="position:absolute;left:${px}px;top:${py}px;width:20px;height:34px;background:${cols[i % 5]};border-radius:5px;transform:rotate(${i * 47 + x * 720}deg);opacity:${1 - x / 1.6}"></div>`;
  }
  return h;
}

const SCENES = [
  { t0: 0, t1: 2.88, exit: "zoom", enter: "none", draw: lt => `
    ${col(560, `<div style="${slam(lt, -.4)}">${clock(47)}</div>`)}
    ${col(900, `<div style="${rise(lt, .48)}">${H1("6 months to NEET.", 84, "#C9D7EA", "font-weight:800")}</div>`)}
    ${col(1030, `<div style="${slam(lt, .96, .3, 2.2)}">${H1(`Stuck on <span style="color:${C.orange}">ONE</span><br>question.`, 140)}</div>`)}` },

  { t0: 2.88, t1: 6.72, exit: "zoom", draw: lt => {
    const rows = [["Teacher", "asleep 😴"], ["Friends", "offline"], ["YouTube", "a 42-minute video"]];
    return `<div style="position:absolute;left:90px;right:90px;top:420px;${rise(lt, 0)}"><div style="padding:44px 48px;border-radius:40px;background:#fff;color:#10233d;box-shadow:0 30px 80px rgba(0,0,0,.5)">
        <div style="font:800 34px Inter;color:${C.orange};letter-spacing:.06em">PHYSICS · KINEMATICS</div>
        <div style="font:700 50px/1.3 Inter;margin-top:16px">A ball is thrown straight up at <b>20 m/s</b>. How high does it go? <span style="color:#6b7f99">(g = 10 m/s²)</span></div></div></div>
      <div style="position:absolute;left:90px;right:90px;top:930px">${rows.map((r, i) => `<div style="${slideX(lt, .96 + i * .96 - .9, .3, i % 2 ? 900 : -900)}margin-bottom:26px"><div style="display:flex;gap:28px;align-items:center;padding:30px 40px;border-radius:32px;background:rgba(255,255,255,.07);border:2px solid rgba(255,255,255,.12)">${X}<div style="font:800 54px Inter;color:#fff">${r[0]} <span style="color:#7d8fa8;font-weight:600">→ ${r[1]}</span></div></div></div>`).join("")}</div>`;
  } },

  { t0: 6.72, t1: 12.96, exit: "zoom", draw: lt => {
    const msgs = [
      { who: "me", at: .4, text: "why is v = 0 at the top?? 😩" },
      { who: "ai", at: .9, think: .45, cps: 78, text: "At the very top the ball stops for an instant — so v = 0.\n=v² = u² − 2gh\n=0 = 20² − 2(10)h\n=h = 20 m ✅\nYour turn: thrown at 30 m/s?" },
      { who: "me", at: 3.7, text: "45 m?" },
      { who: "ai", at: 4.1, think: .4, cps: 60, text: "Exactly! You've got it 🎯" },
    ];
    return `${col(250, `<div style="${rise(lt, 0)}">${H1("So you ask", 76, "#C9D7EA", "font-weight:800")}</div>`)}
      ${col(330, `<div style="${slam(lt, .12, .3, 1.6)}">${H1("GugsLurn AI", 140, C.orange, "text-shadow:0 0 50px rgba(255,116,23,.5)")}</div>`)}
      <div style="position:absolute;left:50%;top:480px;transform:translateX(-50%) translateY(${(1 - ease.out5(P(lt, .05, .6))) * 900}px) scale(.98);transform-origin:50% 0">${phoneChat(lt, msgs)}</div>
      ${confetti(lt, 4.95)}`;
  } },

  { t0: 12.96, t1: 15.36, exit: "zoom", draw: lt => {
    const m = Math.min(52, 47 + Math.floor(P(lt, .1, .7) * 5.99));
    const roll = lt < .7 ? -10 * Math.sin(lt * 40) : 0;
    return `${col(560, `<div style="${slam(lt, -.1, .25, 1.3)}">${clock(m, "rgba(46,230,166,.7)", roll)}</div>`)}
      ${col(900, `<div style="${slam(lt, .75, .3, 1.8)}">${H1(`Doubt solved in<br><span style="color:${C.mint}">5 minutes.</span>`, 120)}</div>`)}
      ${col(1180, `<div style="${rise(lt, 1.4)}">${H1("Now go sleep. 😴", 80, "#C9D7EA", "font-weight:800")}</div>`)}`;
  } },

  { t0: 15.36, t1: 19.2, exit: "cut", draw: lt => `
    ${col(450, `<div style="${slam(lt, 0, .28)}">${H1("A tutor that", 110)}</div>`)}
    ${col(580, `<div style="${slam(lt, .24, .32, 2.6)}">${H1("never sleeps.", 160, "transparent", `background:linear-gradient(90deg,${C.orange},${C.gold});-webkit-background-clip:text;background-clip:text;filter:drop-shadow(0 0 40px rgba(255,116,23,.55))`)}</div>`)}
    ${col(830, `<div style="${pop(lt, .9)}">${chip("<b style='color:" + C.gold + "'>FREE</b>&nbsp;for 14 days", "rgba(255,255,255,.1)", "#fff", "font-size:60px;padding:24px 50px")}</div>`)}
    ${col(965, `<div style="${rise(lt, 1.3)}font:700 46px Inter;color:#9fb3cc">then from ₹299/month — under ₹10 a day</div>`)}
    ${col(1120, ctaButton(lt, 1.92))}
    ${col(1310, `<div style="${rise(lt, 2.4)}font:800 46px Inter;color:#fff">🔗 Link in bio</div>`)}` },
];

function render(t) {
  const night = t < 6.72 || (t >= 12.96 && t < 15.36);
  document.getElementById("root").innerHTML = stage(t, SCENES, { dur: DUR, mood: () => (night ? "night" : "brand"), shakes: [1.02, 15.62], flashes: [2.88, 6.72, 12.96, 15.36] });
}
const AUDIO = {
  dur: DUR, root: "F", prog: [0, -4, 3, -2], drop: 6.72, break: [[12.96, 14.4]],
  sfx: [["impact", 0.0], ["tick", .5], ["tick", 1.5], ["impact", .96], ["whoosh", 2.88], ["pop", 2.95, 79],
    ["buzz", 3.0], ["buzz", 3.96], ["buzz", 4.92], ["riser", 5.4, 6.72], ["whoosh", 6.72],
    ["pop", 7.12, 88], ["type", 8.07, 10.0], ["pop", 10.42, 88], ["type", 11.27, 11.65], ["ding", 11.67], ["pop", 11.7, 96],
    ["whoosh_down", 12.96], ["tick", 13.1], ["tick", 13.22], ["tick", 13.34], ["tick", 13.46], ["tick", 13.58], ["ding", 13.71],
    ["riser", 14.2, 15.36], ["impact", 15.36], ["impact", 15.6], ["pop", 16.26, 84], ["ding", 17.28]],
};
