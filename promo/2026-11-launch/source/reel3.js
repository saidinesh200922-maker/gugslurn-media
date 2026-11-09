// Reel 3 — "NEET coaching can cost lakhs. This costs ₹299."
const DUR = 19.2;
const col = (top, html, extra = "") => `<div style="position:absolute;left:70px;right:70px;top:${top}px;text-align:center;${extra}">${html}</div>`;
const H1 = (txt, size, color = "#fff", extra = "") => `<div style="font:900 ${size}px/0.98 'Inter Display';letter-spacing:-.04em;color:${color};${extra}">${txt}</div>`;

function rupeeRain(lt) {
  let h = "";
  for (let i = 0; i < 18; i++) {
    const x = (i * 211) % 1000 + 20, sp = 600 + (i * 97) % 500, y = -200 + ((lt * sp + i * 173) % 2300);
    h += `<div style="position:absolute;left:${x}px;top:${y}px;font:900 ${60 + (i % 4) * 22}px Inter;color:rgba(255,77,94,${.12 + (i % 3) * .07});transform:rotate(${i * 31 + lt * 90}deg)">₹</div>`;
  }
  return h;
}

const ROWS = [["Fixed batch timings", "Study any time, 24/7"], ["Wait your turn to ask", "Ask instantly — voice or text"], ["Same pace for 100 students", "A plan built from your mistakes"], ["Fees in lakhs", "From ₹299 / month"]];
const RT = (i) => .48 + i * 1.92;

const SCENES = [
  { t0: 0, t1: 2.88, exit: "zoom", enter: "none", draw: lt => `${rupeeRain(lt)}
    ${col(600, `<div style="${slam(lt, -.4)}">${H1("NEET coaching", 120)}</div>`)}
    ${col(740, `<div style="${rise(lt, .3)}">${H1("can cost", 84, "#C9D7EA", "font-weight:800")}</div>`)}
    ${col(840, `<div style="${slam(lt, .96, .3, 2.8)}">${H1("LAKHS.", 270, C.red, "text-shadow:0 0 60px rgba(255,77,94,.55)")}</div>`)}
    ${col(1150, `<div style="${slam(lt, 1.92, .3, 1.8)}">${H1(`This costs <span style="color:${C.orange}">₹299.</span>`, 110)}</div>`)}` },

  { t0: 2.88, t1: 11.52, exit: "zoom", draw: lt => {
    const head = `<div style="display:flex;gap:24px;${rise(lt, 0)}"><div style="flex:1;text-align:center;font:800 44px Inter;color:#8ea2bd">Typical coaching</div><div style="flex:1;text-align:center"><img src="../assets/logo-white.png" style="height:64px;vertical-align:middle"></div></div>`;
    const rows = ROWS.map((r, i) => {
      const t0 = RT(i);
      const struck = P(lt, t0 + .55, t0 + .8);
      return `<div style="display:flex;gap:24px;margin-top:30px">
        <div style="flex:1;${slideX(lt, t0, .3, -700)}"><div style="height:200px;display:flex;align-items:center;justify-content:center;padding:0 26px;border-radius:30px;background:rgba(255,255,255,.06);border:2px solid rgba(255,255,255,.1);font:700 44px/1.2 Inter;color:${struck > .5 ? "#6d7f97" : "#dbe5f1"};text-align:center;position:relative">${r[0]}<div style="position:absolute;left:8%;top:50%;height:7px;width:${84 * struck}%;background:${C.red};border-radius:4px;transform:rotate(-4deg)"></div></div></div>
        <div style="flex:1;${pop(lt, t0 + .48, .32)}"><div style="height:200px;display:flex;align-items:center;justify-content:center;padding:0 26px;border-radius:30px;background:linear-gradient(135deg,rgba(255,116,23,.95),rgba(255,154,61,.95));box-shadow:0 18px 50px rgba(255,116,23,.4);font:800 46px/1.2 Inter;color:#fff;text-align:center">${r[1]}</div></div></div>`;
    }).join("");
    return `${col(300, `<div style="${slam(lt, 0, .3, 1.6)}">${H1("Let's compare.", 110, C.gold)}</div>`)}
      <div style="position:absolute;left:60px;right:60px;top:470px">${head}${rows}</div>`;
  } },

  { t0: 11.52, t1: 14.4, exit: "zoom", draw: lt => `
    ${col(520, `<div style="${slam(lt, 0, .3, 1.8)}">${H1("Already in<br>coaching?", 120)}</div>`)}
    ${col(860, `<div style="${rise(lt, .6)}">${H1(`Use it for the doubts you'd<br><span style="color:${C.orange}">never raise your hand for.</span>`, 76, "#fff", "font-weight:800;line-height:1.15")}</div>`)}
    ${col(1130, `<div style="${pop(lt, 1.5)}">${chip("🎙️ Voice or text · day or night", "rgba(255,255,255,.1)", "#fff", "font-size:46px")}</div>`)}` },

  { t0: 14.4, t1: 19.2, exit: "cut", draw: lt => `
    ${col(420, `<div style="${slam(lt, 0, .28)}">${H1("Your first 14 days", 100)}</div>`)}
    ${col(540, `<div style="${slam(lt, .24, .32, 3)}">${H1("are FREE.", 200, "transparent", `background:linear-gradient(90deg,${C.orange},${C.gold});-webkit-background-clip:text;background-clip:text;filter:drop-shadow(0 0 40px rgba(255,116,23,.55))`)}</div>`)}
    ${col(790, `<div style="${pop(lt, .96)}">${chip("then from <b style='color:" + C.gold + ";margin-left:10px'>₹299/month</b>", "rgba(255,255,255,.1)", "#fff", "font-size:52px;padding:22px 44px")}</div>`)}
    ${col(950, ctaButton(lt, 1.44))}
    ${col(1150, `<div style="${rise(lt, 2.2)}font:800 46px Inter;color:#fff">🔗 Link in bio</div>`)}
    ${col(1250, `<div style="${rise(lt, 2.9)}font:700 42px Inter;color:#9fb3cc">Send this to a NEET aspirant 📲</div>`)}` },
];

function render(t) {
  const hits = [1.02, 14.66];
  document.getElementById("root").innerHTML = stage(t, SCENES, { dur: DUR, mood: tt => (tt < 2.88 ? "warm" : "brand"), shakes: hits, flashes: [2.88, 11.52, 14.4] });
}
const AUDIO = {
  dur: DUR, root: "D", prog: [0, -4, 3, -2], drop: 2.88,
  sfx: [["impact", 0.0], ["pop", .3, 79], ["impact", .96], ["ding", 1.92], ["whoosh", 2.88], ["impact", 2.9],
    ...ROWS.flatMap((_, i) => [["whoosh", 2.88 + RT(i) + .25], ["pop", 2.88 + RT(i) + .48, 84 + i * 2], ["buzz", 2.88 + RT(i) + .6]]),
    ["whoosh", 11.52], ["pop", 13.02, 88], ["riser", 13.1, 14.4], ["impact", 14.4], ["impact", 14.64], ["pop", 15.36, 84], ["ding", 15.84], ["pop", 17.3, 91]],
};
