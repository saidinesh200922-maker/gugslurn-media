// Reel 1 — "Your NEET rank is decided by the doubts you never asked."
const DUR = 19.2, B = .48;
const col = (top, html, extra = "") => `<div style="position:absolute;left:70px;right:70px;top:${top}px;text-align:center;${extra}">${html}</div>`;
const H1 = (txt, size, color = "#fff", extra = "") => `<div style="font:900 ${size}px/0.98 'Inter Display';letter-spacing:-.04em;color:${color};${extra}">${txt}</div>`;
const X = `<svg width="64" height="64" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="${C.red}"/><path d="M21 21l22 22M43 21L21 43" stroke="#fff" stroke-width="7" stroke-linecap="round"/></svg>`;
const OK = `<svg width="64" height="64" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="${C.mint}"/><path d="M18 33l9 9 19-20" stroke="#06341f" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const SCENES = [
  { t0: 0, t1: 2.88, exit: "zoom", enter: "none", draw: lt => `
    ${col(660, `<div style="${slam(lt, -.4)}">${H1("Your NEET rank", 128)}</div>`)}
    ${col(820, `<div style="${rise(lt, .48)}">${H1("is decided by the", 78, "#C9D7EA", "font-weight:800")}</div>`)}
    ${col(930, `<div style="${slam(lt, .96, .3, 2.6)}">${H1("DOUBTS", 250, C.orange, `text-shadow:0 0 60px rgba(255,116,23,.65);transform:rotate(-3deg)`)}</div>`)}
    ${col(1220, `<div style="${rise(lt, 1.92)}">${H1("you never asked.", 104)}</div>`)}` },

  { t0: 2.88, t1: 6.72, exit: "zoom", draw: lt => {
    const cards = [["Doubt at 11 PM", "Coaching is closed."], ["Too shy to ask in class", "So the doubt stays."], ["Same mistake, every mock", "Nobody tells you why."]];
    const stamp = lt >= 2.9 ? `<div style="position:absolute;left:0;right:0;top:1000px;text-align:center;z-index:5"><div style="${slam(lt, 2.9, .28, 3)}"><span style="display:inline-block;transform:rotate(-7deg);padding:26px 54px;border:12px solid ${C.orange};border-radius:28px;background:rgba(7,26,54,.92);font:900 118px 'Inter Display';letter-spacing:-.03em;white-space:nowrap;color:${C.orange};box-shadow:0 0 80px rgba(255,116,23,.5)">NOT ANYMORE.</span></div></div>` : "";
    return `${col(430, `<div style="${rise(lt, 0)}">${H1("Sound familiar?", 96, C.gold)}</div>`)}
      <div style="position:absolute;left:90px;right:90px;top:640px;${lt >= 2.9 ? `filter:blur(${6 * P(lt, 2.9, 3.1)}px);opacity:${1 - .45 * P(lt, 2.9, 3.1)}` : ""}">
      ${cards.map((c, i) => `<div style="${slideX(lt, .15 + i * .96, .38, i % 2 ? 900 : -900)}margin-bottom:34px"><div style="display:flex;gap:34px;align-items:center;padding:40px 44px;border-radius:40px;background:rgba(255,255,255,.08);border:2px solid rgba(255,255,255,.14);backdrop-filter:blur(6px)">${X}<div style="text-align:left"><div style="font:800 58px/1.1 Inter;color:#fff">${c[0]}</div><div style="font:600 42px Inter;color:#9fb3cc;margin-top:8px">${c[1]}</div></div></div></div>`).join("")}
      </div>${stamp}`;
  } },

  { t0: 6.72, t1: 12.48, exit: "zoom", draw: lt => {
    const msgs = [
      { who: "me", at: .5, text: "Mitosis vs meiosis — quick difference? 🙏" },
      { who: "ai", at: 1.0, think: .5, cps: 72, text: "Mitosis → 2 identical cells (growth, repair).\nMeiosis → 4 haploid cells with variation (gametes).\n=meiOSIS → makes sex cells\nWant a 3-question quick check?" },
    ];
    const voiceChip = lt >= 4.2 ? `<div style="position:absolute;right:60px;top:1380px;z-index:4;${pop(lt, 4.2)}">${chip("🎙️ Ask by voice too", C.orange, "#fff", "font-size:44px;box-shadow:0 14px 40px rgba(255,116,23,.5)")}</div>` : "";
    return `${col(250, `<div style="${rise(lt, 0)}">${H1("Meet your 24/7", 76, "#C9D7EA", "font-weight:800")}</div>`)}
      ${col(320, `<div style="${slam(lt, .15, .3, 1.6)}">${H1("AI TUTOR", 150, C.orange, "text-shadow:0 0 50px rgba(255,116,23,.5)")}</div>`)}
      <div style="position:absolute;left:50%;top:480px;transform:translateX(-50%) translateY(${(1 - ease.out5(P(lt, .1, .7))) * 900}px) scale(.98) rotate(${lerp(-4, 0, ease.out(P(lt, .1, .9)))}deg);transform-origin:50% 0">${phoneChat(lt, msgs, { voice: 4.3 })}</div>
      ${voiceChip}`;
  } },

  { t0: 12.48, t1: 15.36, exit: "zoom", draw: lt => {
    const rows = ["Real NEET papers 2016–2026", "Full-length mock tests", "Flashcards + smart revision", "A daily plan from <span style='color:" + C.orange + "'>YOUR</span> mistakes"];
    return `${col(440, `<div style="${rise(lt, 0)}">${H1("Plus everything else", 92, C.gold)}</div>`)}
      <div style="position:absolute;left:90px;right:90px;top:650px">${rows.map((r, i) => `<div style="${slideX(lt, .1 + i * .6, .32, -1000)}margin-bottom:30px"><div style="display:flex;gap:30px;align-items:center;padding:34px 40px;border-radius:36px;background:rgba(46,230,166,.10);border:2px solid rgba(46,230,166,.35)">${OK}<div style="font:800 54px/1.15 Inter;color:#fff;text-align:left">${r}</div></div></div>`).join("")}</div>`;
  } },

  { t0: 15.36, t1: 19.2, exit: "cut", draw: lt => `
    ${col(470, `<div style="${slam(lt, 0, .28)}">${H1("Try it", 120)}</div>`)}
    ${col(590, `<div style="${slam(lt, .24, .32, 3)}">${H1("FREE", 290, "transparent", `background:linear-gradient(90deg,${C.orange},${C.gold});-webkit-background-clip:text;background-clip:text;filter:drop-shadow(0 0 40px rgba(255,116,23,.55))`)}</div>`)}
    ${col(890, `<div style="${rise(lt, .72)}">${H1("for 14 days", 104)}</div>`)}
    ${col(1050, `<div style="${pop(lt, 1.2)}">${chip("then from <b style='color:" + C.gold + ";margin-left:10px'>₹299/month</b>", "rgba(255,255,255,.1)", "#fff", "font-size:52px;padding:22px 44px")}</div>`)}
    ${col(1160, `<div style="${rise(lt, 1.5)}font:700 42px Inter;color:#9fb3cc">That's less than ₹10 a day.</div>`)}
    ${col(1290, ctaButton(lt, 1.92))}
    ${col(1480, `<div style="${rise(lt, 2.4)}font:800 46px Inter;color:#fff">🔗 Link in bio</div>`)}` },
];

function render(t) {
  document.getElementById("root").innerHTML = stage(t, SCENES, { dur: DUR, shakes: [1.02, 5.8, 15.62], flashes: [2.88, 6.72, 12.48, 15.36] });
}
const AUDIO = {
  dur: DUR, root: "A", prog: [0, -4, 3, -2], drop: 2.88,
  sfx: [["impact", 0.0], ["pop", .48, 79], ["impact", .96], ["pop", 1.92, 84], ["whoosh", 2.88],
    ["buzz", 3.03], ["buzz", 3.99], ["buzz", 4.95], ["impact", 5.78], ["whoosh", 6.72],
    ["pop", 7.22, 88], ["type", 7.72, 10.6], ["ding", 10.62], ["pop", 10.92, 91], ["whoosh", 12.48],
    ["pop", 12.58, 84], ["pop", 13.18, 86], ["pop", 13.78, 88], ["pop", 14.38, 91], ["riser", 14.0, 15.36],
    ["impact", 15.36], ["impact", 15.62], ["pop", 16.08, 84], ["pop", 16.56, 88], ["ding", 17.28]],
};
