// Carousels, 1080x1350. Reuses engine.js styles at a fixed time.
const CW = 1080, CH = 1350;
const T = (txt, size, color = "#fff", extra = "") => `<div style="font:900 ${size}px/1.0 'Inter Display';letter-spacing:-.035em;color:${color};${extra}">${txt}</div>`;
const body = (txt, extra = "") => `<div style="font:500 44px/1.38 Inter;color:#D3DEEC;${extra}">${txt}</div>`;
const OKI = `<svg width="56" height="56" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="${C.mint}"/><path d="M18 33l9 9 19-20" stroke="#06341f" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

function frame(i, n, inner, mood = "brand", seed = 1) {
  return `<div style="position:relative;width:${CW}px;height:${CH}px;overflow:hidden">
    <div style="position:absolute;inset:0;transform:scale(1)">${bg(seed * 3.1, mood).replace(/opacity:\.12;mix-blend-mode:overlay/, "opacity:.08;mix-blend-mode:overlay")}</div>
    <img src="../assets/logo-white.png" style="position:absolute;left:70px;top:64px;width:250px">
    <div style="position:absolute;right:70px;top:76px;font:700 34px Inter;color:#9fb3cc">${i}/${n}</div>
    <div style="position:absolute;left:80px;right:80px;top:200px;bottom:150px">${inner}</div>
    <div style="position:absolute;left:80px;right:80px;bottom:62px;display:flex;justify-content:space-between;font:700 34px Inter;color:#9fb3cc"><span>gugslurn.ai</span><span style="color:${C.orange}">${i < n ? "Swipe →" : "Save this 🔖"}</span></div>
  </div>`;
}

const mistake = (num, title, fix, extra = "") => `<div style="height:40px"></div>
  <div style="font:900 210px/1 'Inter Display';color:transparent;-webkit-text-stroke:4px ${C.orange};opacity:.9">#${num}</div>
  ${T(title, 92, "#fff", "margin-top:10px")}
  <div style="margin-top:44px;padding:40px 44px;border-radius:36px;background:rgba(46,230,166,.10);border:2px solid rgba(46,230,166,.35)">
    <div style="font:800 34px Inter;letter-spacing:.08em;color:${C.mint}">THE FIX</div>${body(fix, "margin-top:12px;color:#fff")}</div>${extra}`;

const SETS = {
  mistakes: [
    () => `<div style="position:absolute;top:120px;left:0;right:0">
        ${T("5 mistakes", 150, C.orange)}${T("that silently cost you NEET marks", 104, "#fff", "margin-top:16px")}
        <div style="margin-top:56px">${chip("#3 surprises almost everyone 👀", "rgba(255,184,39,.16)", C.gold, "font-size:44px")}</div></div>`,
    () => mistake(1, "Reading NCERT just once", "Biology questions closely follow NCERT lines. Read it 3+ times, and quiz yourself on its diagrams and tables."),
    () => mistake(2, "Skipping past papers", "Concepts come back year after year. Solve real papers to learn <i>how</i> they get asked, not just what."),
    () => `
      <div style="font:900 210px/1 'Inter Display';color:transparent;-webkit-text-stroke:4px ${C.orange}">#3</div>
      ${T("Being scared of every guess", 88, "#fff", "margin-top:10px")}
      <div style="margin-top:36px;display:flex;gap:26px">
        <div style="flex:1;padding:34px;border-radius:32px;background:rgba(255,255,255,.07);border:2px solid rgba(255,255,255,.14)"><div style="font:700 34px Inter;color:#9fb3cc">Marking</div><div style="font:900 70px 'Inter Display';color:#fff;margin-top:6px">+4 / −1</div></div>
        <div style="flex:1;padding:34px;border-radius:32px;background:rgba(255,116,23,.14);border:2px solid rgba(255,116,23,.45)"><div style="font:700 34px Inter;color:#ffc79f">Ruled out 2 options?</div><div style="font:900 70px 'Inter Display';color:${C.orange};margin-top:6px">+1.5 avg</div></div>
      </div>
      <div style="margin-top:34px;padding:36px 44px;border-radius:36px;background:rgba(46,230,166,.10);border:2px solid rgba(46,230,166,.35)"><div style="font:800 34px Inter;letter-spacing:.08em;color:${C.mint}">THE FIX</div>${body("With 2 options left, a 50% chance of +4 beats a 50% risk of −1. Eliminate first, then attempt. Check the marking scheme in the latest NTA bulletin.", "margin-top:12px;color:#fff;font-size:40px")}</div>`,
    () => mistake(4, "Leaving doubts for “later”", "Later never comes, and one unclear concept breaks the next three. Clear every doubt the same day."),
    () => mistake(5, "Taking mocks without reviewing them", "Spend as long reviewing a mock as taking it. Log every mistake by chapter and fix those chapters first."),
    () => `<div style="position:absolute;top:0;left:0;right:0">
        ${T("GugsLurn helps you", 92)}${T("fix all of this.", 120, C.orange, "margin-top:8px")}
        <div style="margin-top:40px">${["Chapter notes + flashcards for NCERT revision", "Real NEET papers 2016–2026, every answer explained", "An AI tutor for doubts, 24/7, by voice or text", "Mock tests + a daily plan from your mistakes"].map(r => `<div style="display:flex;gap:26px;align-items:center;margin-bottom:20px">${OKI}<div style="font:700 42px/1.22 Inter;color:#fff">${r}</div></div>`).join("")}</div>
        <div style="margin-top:20px;display:inline-block;padding:30px 54px;border-radius:999px;background:linear-gradient(90deg,${C.orange},#ff9a3d);font:900 52px 'Inter Display';color:#fff;box-shadow:0 20px 60px rgba(255,116,23,.5)">Free for 14 days → gugslurn.ai</div>
        <div style="margin-top:22px;font:600 38px Inter;color:#9fb3cc">Then from ₹299/month. Link in bio.</div></div>`,
  ],
  tour: [
    () => `<div style="position:absolute;top:30px;left:0;right:0">
        ${T("Your NEET coach.", 116)}${T("In your pocket.", 116, C.orange, "margin-top:6px")}
        <div style="margin-top:26px">${chip("Less than ₹10 a day", "rgba(255,184,39,.16)", C.gold, "font-size:44px")}</div></div>
      <div style="position:absolute;left:60px;top:545px;transform:rotate(-7deg) scale(.45);transform-origin:0 0">${phoneShot("../assets/phone-01-dashboard.jpg")}</div>
      <div style="position:absolute;right:60px;top:525px;transform:rotate(6deg) scale(.45);transform-origin:100% 0">${phoneShot("../assets/phone-04-chapter.jpg")}</div>`,
    () => `<div style="display:flex;gap:40px;height:100%">
        <div style="flex:1.05;padding-top:20px">${T("An AI tutor that never sleeps", 84)}${body("Stuck at midnight? Ask by <b style='color:#fff'>voice or text</b> and get a step-by-step answer, then a quick question to check you really got it.", "margin-top:30px")}</div>
        <div style="flex:1;position:relative"><div style="position:absolute;left:0;top:0;transform:scale(.66);transform-origin:0 0">${phoneChat(9, [{ who: "me", at: 0, text: "Why is v = 0 at the top? 😩" }, { who: "ai", at: .2, think: 0, cps: 999, text: "At the top the ball stops for an instant, so v = 0.\n=v² = u² − 2gh\n=h = 20 m ✅\nYour turn: 30 m/s?" }])}</div></div></div>`,
    () => `${T("Real NEET papers.", 104)}${T("2016 → 2026.", 150, C.orange, "margin-top:10px")}
      ${body("Practise the actual questions from 11 years of NEET, with every answer explained. Filter by year, subject and difficulty.", "margin-top:36px")}
      <div style="margin-top:44px;padding:40px 44px;border-radius:36px;background:#fff;color:#10233d;box-shadow:0 30px 80px rgba(0,0,0,.45)">
        <div style="font:800 32px Inter;color:#10915f">✓ NEET 2016 (real, cited)</div>
        <div style="font:700 42px/1.35 Inter;margin-top:12px">A colour-blind man marries a woman who is homozygous for normal colour vision. What is the probability their son is colour-blind?</div></div>`,
    () => `<div style="display:flex;gap:40px;height:100%"><div style="flex:1.1;padding-top:20px">${T("A plan built from <span style='color:" + C.orange + "'>your</span> mistakes", 82)}${body("Every day, one clear next step based on what you got wrong, what's due for revision and the time you have.", "margin-top:30px")}<div style="margin-top:34px">${chip("🔥 Study streak", "rgba(255,255,255,.1)", "#fff", "font-size:40px")}</div></div>
      <div style="flex:1;position:relative"><div style="position:absolute;top:0;left:0;transform:scale(.7) rotate(3deg);transform-origin:0 0">${phoneShot("../assets/phone-01-dashboard.jpg")}</div></div></div>`,
    () => `<div style="display:flex;gap:40px;height:100%"><div style="flex:1;position:relative"><div style="position:absolute;top:0;left:0;transform:scale(.7) rotate(-3deg);transform-origin:0 0">${phoneShot("../assets/phone-02-flashcards.jpg")}</div></div>
      <div style="flex:1.1;padding-top:20px">${T("Flashcards that know what you forget", 80)}${body("Rate each card: Don't know, Unsure, Know it, Mastered. Your weak cards come back first.", "margin-top:30px")}</div></div>`,
    () => `<div style="display:flex;gap:40px;height:100%"><div style="flex:1.1;padding-top:20px">${T("Class 11 first. Then Class 12.", 84)}${body("A guided pathway builds your foundations before moving on. Repeaters and Class 12 students can study both straight away.", "margin-top:30px")}</div>
      <div style="flex:1;position:relative"><div style="position:absolute;top:0;left:0;transform:scale(.7) rotate(3deg);transform-origin:0 0">${phoneShot("../assets/phone-03-pathway.jpg")}</div></div></div>`,
    () => `<div style="position:absolute;top:80px;left:0;right:0;text-align:center">
        ${T("Try everything", 110)}${T("FREE", 260, "transparent", `background:linear-gradient(90deg,${C.orange},${C.gold});-webkit-background-clip:text;background-clip:text;margin-top:10px`)}${T("for 14 days", 110, "#fff", "margin-top:4px")}
        <div style="margin-top:40px">${chip("then from <b style='color:" + C.gold + ";margin-left:10px'>₹299/month</b>", "rgba(255,255,255,.1)", "#fff", "font-size:50px;padding:22px 44px")}</div>
        <div style="margin-top:50px;display:inline-block;padding:38px 64px;border-radius:999px;background:linear-gradient(90deg,${C.orange},#ff9a3d);font:900 58px 'Inter Display';color:#fff;box-shadow:0 20px 60px rgba(255,116,23,.5)">Start free → gugslurn.ai</div>
        <div style="margin-top:26px;font:700 40px Inter;color:#9fb3cc">Link in bio · Share with your study group 📲</div></div>`,
  ],
};

function renderSlide(set, i) {
  const s = SETS[set], n = s.length;
  document.getElementById("root").innerHTML = frame(i + 1, n, s[i](), "brand", i + 1);
  return n;
}
