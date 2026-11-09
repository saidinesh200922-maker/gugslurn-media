"""Original soundtrack + SFX for GugsLurn reels. 125 BPM, everything synthesized here.

usage: python3 audio.py <spec.json> <out.wav>
spec: {"dur":19.2,"root":"A","prog":[0,-4,3,-2],"drop":2.88,"break":[a,b],"end_hit":t,
       "sfx":[["whoosh",t],["impact",t],["pop",t],["tick",t],["ding",t],["riser",t0,t1],["type",t0,t1],["swoosh_up",t]]}
"""
import json, sys
import numpy as np
from scipy.signal import butter, sosfilt
from scipy.io import wavfile

SR = 44100
BPM = 125
BEAT = 60 / BPM
rng = np.random.default_rng(7)

NOTES = {"C": 0, "C#": 1, "D": 2, "D#": 3, "E": 4, "F": 5, "F#": 6, "G": 7, "G#": 8, "A": 9, "A#": 10, "B": 11}


def hz(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)


def env(n, a=0.002, d=0.2, curve=4.0):
    t = np.arange(n) / SR
    att = np.clip(t / max(a, 1e-4), 0, 1)
    dec = np.exp(-curve * np.maximum(t - a, 0) / max(d, 1e-4))
    return att * dec


def filt(x, kind, f, order=2):
    if isinstance(f, (list, tuple)):
        sos = butter(order, [v / (SR / 2) for v in f], btype=kind, output="sos")
    else:
        sos = butter(order, f / (SR / 2), btype=kind, output="sos")
    return sosfilt(sos, x)


def add(buf, sig, t, gain=1.0):
    i = int(round(t * SR))
    if i >= len(buf) or i + len(sig) <= 0:
        return
    s = sig
    if i < 0:
        s = s[-i:]
        i = 0
    n = min(len(s), len(buf) - i)
    buf[i:i + n] += gain * s[:n]


def saw(f, n, detune=0.0, phase=None):
    t = np.arange(n) / SR
    ph = rng.random() if phase is None else phase
    return 2 * ((f * (1 + detune) * t + ph) % 1.0) - 1


# ---------- instruments ----------
def kick(n=int(0.45 * SR)):
    t = np.arange(n) / SR
    f = 45 + 110 * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t * 7)
    click = filt(rng.standard_normal(n), "highpass", 3000) * np.exp(-t * 300) * 0.25
    return np.tanh(1.6 * (body + click))


def clap(n=int(0.3 * SR)):
    t = np.arange(n) / SR
    nz = filt(rng.standard_normal(n), "bandpass", [900, 5000])
    e = np.zeros(n)
    for k, o in enumerate([0, 0.011, 0.022]):
        e += (t >= o) * np.exp(-np.maximum(t - o, 0) * (90 if k < 2 else 16))
    tone = np.sin(2 * np.pi * 190 * t) * np.exp(-t * 30) * 0.3
    return (nz * e * 0.55 + tone)


def hat(open_=False):
    n = int((0.22 if open_ else 0.05) * SR)
    t = np.arange(n) / SR
    nz = filt(rng.standard_normal(n), "highpass", 7500)
    return nz * np.exp(-t * (14 if open_ else 80)) * 0.5


def pluck(midi, dur=0.32, bright=4500):
    n = int(dur * SR)
    s = sum(saw(hz(midi), n, d) for d in (-0.006, 0, 0.006)) / 3
    s = filt(s, "lowpass", bright)
    return s * env(n, 0.003, dur * 0.6, 3.5)


def pad(midis, dur, cutoff=2200):
    n = int(dur * SR)
    s = np.zeros(n)
    for m in midis:
        for d in (-0.009, -0.003, 0.003, 0.009):
            s += saw(hz(m), n, d)
    s /= len(midis) * 4
    s = filt(s, "lowpass", cutoff)
    t = np.arange(n) / SR
    a = np.clip(t / 0.06, 0, 1) * np.clip((dur - t) / 0.08, 0, 1)
    return s * a


def bass(midi, dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = np.sin(2 * np.pi * hz(midi) * t) + 0.35 * np.sin(4 * np.pi * hz(midi) * t) + 0.25 * saw(hz(midi), n, 0, 0)
    s = filt(s, "lowpass", 900)
    a = np.clip(t / 0.005, 0, 1) * np.clip((dur - t) / 0.03, 0, 1)
    return np.tanh(1.4 * s) * a


# ---------- sfx ----------
def whoosh(dur=0.45, up=True):
    n = int(dur * SR)
    t = np.arange(n) / SR
    nz = rng.standard_normal(n)
    out = np.zeros(n)
    seg = 512
    for i in range(0, n, seg):
        x = i / n
        fc = 400 + (6000 if up else 2500) * (x if up else 1 - x) ** 1.5
        out[i:i + seg] = filt(nz[i:i + seg], "bandpass", [fc * 0.6, min(fc * 1.6, 20000)], 1)
    shape = np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 1.5
    return out * shape * 0.9


def impact():
    n = int(1.1 * SR)
    t = np.arange(n) / SR
    f = 38 + 70 * np.exp(-t * 14)
    boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 3.2)
    crack = filt(rng.standard_normal(n), "bandpass", [1200, 9000]) * np.exp(-t * 22) * 0.6
    tail = filt(rng.standard_normal(n), "lowpass", 900) * np.exp(-t * 4) * 0.25
    return np.tanh(1.8 * (boom + crack + tail))


def pop(midi=84):
    n = int(0.12 * SR)
    t = np.arange(n) / SR
    f = hz(midi) * (1 + 0.6 * np.exp(-t * 60))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 40)


def tick():
    n = int(0.03 * SR)
    t = np.arange(n) / SR
    return filt(rng.standard_normal(n), "bandpass", [2500, 6000]) * np.exp(-t * 250) * 0.8


def ding(root_midi=84):
    n = int(1.2 * SR)
    t = np.arange(n) / SR
    s = 0
    for m, g in ((root_midi, 1), (root_midi + 7, 0.5), (root_midi + 12, 0.35), (root_midi + 19, 0.15)):
        s = s + g * np.sin(2 * np.pi * hz(m) * t)
    return s * np.exp(-t * 3.5) * np.clip(t / 0.003, 0, 1) * 0.45


def riser(dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = t / dur
    f = 200 + 1800 * x ** 2
    tone = saw(1, n) * 0
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.25
    nz = rng.standard_normal(n)
    out = np.zeros(n)
    seg = 512
    for i in range(0, n, seg):
        fc = 300 + 9000 * (i / n) ** 2
        out[i:i + seg] = filt(nz[i:i + seg], "bandpass", [fc * 0.7, min(fc * 1.5, 20000)], 1)
    return (out * 0.8 + tone) * x ** 2


def typing(dur):
    n = int(dur * SR)
    out = np.zeros(n)
    t = 0.0
    while t < dur - 0.03:
        add(out, tick() * (0.35 + 0.4 * rng.random()), t)
        t += 0.055 + 0.05 * rng.random()
    return out


# ---------- arrangement ----------
def build(spec):
    dur = spec["dur"]
    n = int((dur + 0.6) * SR)
    drums = np.zeros(n)
    music = np.zeros(n)
    bassb = np.zeros(n)
    sfx = np.zeros(n)
    root = 45 + NOTES[spec.get("root", "A")] - 9  # A2 = 45
    prog = spec.get("prog", [0, -4, 3, -2])
    drop = spec.get("drop", 2.88)
    brk = spec.get("break", [])
    bar = 4 * BEAT
    nbeats = int(dur / BEAT) + 1

    def in_break(t):
        return any(a <= t < b for a, b in brk)

    # side-chain envelope from kicks
    sc = np.ones(n)
    for b in range(nbeats):
        t = b * BEAT
        if t >= dur or in_break(t):
            continue
        pre = t < drop
        add(drums, kick(), t, 0.95 if not pre else 0.75)
        i = int(t * SR)
        m = min(int(0.22 * SR), n - i)
        sc[i:i + m] = np.minimum(sc[i:i + m], 1 - 0.65 * np.exp(-np.arange(m) / SR * 14))
        if not pre:
            if b % 2 == 1:
                add(drums, clap(), t, 0.55)
            for k in range(2):
                add(drums, hat(), t + k * BEAT / 2 + (0 if k == 0 else 0.008), 0.25 if k == 0 else 0.4)
            if b % 4 == 3:
                add(drums, hat(True), t + BEAT / 2, 0.22)
        else:
            add(drums, hat(), t + BEAT / 2, 0.22)

    # harmony
    nbars = int(dur / bar) + 2
    for k in range(nbars):
        t = k * bar
        if t >= dur:
            break
        r = root + prog[k % len(prog)]
        minor = prog[k % len(prog)] in (0, 5, -7) or spec.get("all_minor", False)
        third = 3 if minor else 4
        chord = [r + 12, r + 12 + third, r + 19, r + 24]
        pre = t < drop
        add(music, pad(chord, bar, 900 if pre else 2600), t, 0.32 if pre else 0.26)
        if not pre:
            # bass: offbeat-pumping 8ths
            for e in range(8):
                tt = t + e * BEAT / 2
                if tt < dur and not in_break(tt):
                    add(bassb, bass(r, BEAT / 2 * 0.9), tt, 0.55)
            # pluck arp
            arp = [chord[0] + 12, chord[1] + 12, chord[2] + 12, chord[3] + 12, chord[2] + 12, chord[1] + 12, chord[3] + 12, chord[2] + 12]
            for e in range(8):
                tt = t + e * BEAT / 2
                if tt < dur and not in_break(tt):
                    add(music, pluck(arp[e], 0.3), tt, 0.16)
    music *= sc
    bassb *= sc

    # sfx
    for ev in spec.get("sfx", []):
        kind, t = ev[0], ev[1]
        if kind == "whoosh":
            add(sfx, whoosh(0.42, True), t - 0.3, 0.5)
        elif kind == "whoosh_down":
            add(sfx, whoosh(0.5, False), t, 0.45)
        elif kind == "impact":
            add(sfx, impact(), t, 0.75)
        elif kind == "pop":
            add(sfx, pop(ev[2] if len(ev) > 2 else 84), t, 0.45)
        elif kind == "tick":
            add(sfx, tick(), t, 0.6)
        elif kind == "ding":
            add(sfx, ding(), t, 0.7)
        elif kind == "riser":
            add(sfx, riser(ev[2] - t), t, 0.5)
        elif kind == "type":
            add(sfx, typing(ev[2] - t), t, 0.5)
        elif kind == "buzz":  # wrong / strike
            m = int(0.22 * SR)
            tt = np.arange(m) / SR
            add(sfx, filt(saw(110, m, 0, 0) + saw(116, m, 0, 0), "lowpass", 1400) * np.exp(-tt * 9) * 0.6, t, 0.55)

    mix = drums * 0.9 + music + bassb * 0.9 + sfx
    # fade out last 0.5s
    end = int(dur * SR)
    fade = int(0.5 * SR)
    mix[end - fade:end] *= np.linspace(1, 0, fade)
    mix[end:] = 0
    mix = mix[:end]
    # stereo widen music slightly
    l = mix + 0.06 * np.roll(music[:end], 300)
    r = mix + 0.06 * np.roll(music[:end], -300)
    st = np.stack([l, r], 1)
    st = np.tanh(1.2 * st / (np.max(np.abs(st)) + 1e-9))
    st = st / np.max(np.abs(st)) * 0.89
    return st


if __name__ == "__main__":
    spec = json.load(open(sys.argv[1]))
    st = build(spec)
    wavfile.write(sys.argv[2], SR, (st * 32767).astype(np.int16))
    print("wrote", sys.argv[2], len(st) / SR, "s")
