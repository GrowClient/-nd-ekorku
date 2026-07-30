/* =========================================================================
   Ses — tamamı WebAudio ile sentezlenir, hiçbir ses dosyası yok.
   ========================================================================= */

const Ses = {
  ctx: null, ana: null, ambiyans: null, drone: null,
  hazir: false, kapali: false,
  gurultuTampon: null,

  baslat() {
    if (this.hazir) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    this.ana = this.ctx.createGain();
    this.ana.gain.value = .9;
    this.ana.connect(this.ctx.destination);
    this.gurultuTamponuYap();
    this.odaTonu();
    this.droneKur();
    this.hazir = true;
    this.rastgeleOlaylar();
  },

  devamEt() { if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume(); },

  gurultuTamponuYap() {
    const n = this.ctx.sampleRate * 2;
    const b = this.ctx.createBuffer(1, n, this.ctx.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    this.gurultuTampon = b;
  },

  gurultu(dongu = false) {
    const s = this.ctx.createBufferSource();
    s.buffer = this.gurultuTampon;
    s.loop = dongu;
    return s;
  },

  /* ── sürekli oda tonu: rüzgâr + uğultu ─────────────────────────────── */
  odaTonu() {
    const c = this.ctx;
    const src = this.gurultu(true);
    const bp = c.createBiquadFilter();
    bp.type = 'lowpass'; bp.frequency.value = 320; bp.Q.value = .6;
    const g = c.createGain(); g.gain.value = .045;
    src.connect(bp); bp.connect(g); g.connect(this.ana);
    src.start();

    // rüzgârın yavaş nefes alışı
    const lfo = c.createOscillator(); lfo.frequency.value = .07;
    const lfoG = c.createGain(); lfoG.gain.value = .028;
    lfo.connect(lfoG); lfoG.connect(g.gain); lfo.start();

    // yüksek ıslık
    const src2 = this.gurultu(true);
    const bp2 = c.createBiquadFilter();
    bp2.type = 'bandpass'; bp2.frequency.value = 1650; bp2.Q.value = 7;
    const g2 = c.createGain(); g2.gain.value = .012;
    src2.connect(bp2); bp2.connect(g2); g2.connect(this.ana);
    src2.start();
    const lfo2 = c.createOscillator(); lfo2.frequency.value = .043;
    const lfo2g = c.createGain(); lfo2g.gain.value = 500;
    lfo2.connect(lfo2g); lfo2g.connect(bp2.frequency); lfo2.start();

    this.ambiyans = { g, g2 };
  },

  /* ── gerilim dronu: hikâye ilerledikçe yükselir ────────────────────── */
  droneKur() {
    const c = this.ctx;
    const o1 = c.createOscillator(); o1.type = 'sine'; o1.frequency.value = 42;
    const o2 = c.createOscillator(); o2.type = 'sine'; o2.frequency.value = 42.7;
    const o3 = c.createOscillator(); o3.type = 'triangle'; o3.frequency.value = 84.4;
    const g = c.createGain(); g.gain.value = 0;
    const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 240;
    o1.connect(g); o2.connect(g); o3.connect(lp); lp.connect(g);
    g.connect(this.ana);
    o1.start(); o2.start(); o3.start();
    this.drone = g;
  },

  gerilim(seviye) {                       // 0..1
    if (!this.hazir) return;
    this.drone.gain.setTargetAtTime(seviye * .10, this.ctx.currentTime, 2.5);
  },

  /* ── adım ─────────────────────────────────────────────────────────── */
  adim(tip = 'ahsap') {
    if (!this.hazir || this.kapali) return;
    const c = this.ctx, t = c.currentTime;
    const s = this.gurultu();
    const f = c.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.setValueAtTime(tip === 'tas' ? 900 : 480, t);
    f.frequency.exponentialRampToValueAtTime(tip === 'tas' ? 260 : 130, t + .12);
    const g = c.createGain();
    const v = .07 + Math.random() * .03;
    g.gain.setValueAtTime(v, t);
    g.gain.exponentialRampToValueAtTime(.0008, t + (tip === 'tas' ? .18 : .13));
    s.connect(f); f.connect(g); g.connect(this.ana);
    s.start(t); s.stop(t + .25);
    if (tip === 'ahsap' && Math.random() < .22) this.gicirti(.25 + Math.random() * .3);
  },

  /* ── ahşap gıcırtısı ──────────────────────────────────────────────── */
  gicirti(guc = .5) {
    if (!this.hazir || this.kapali) return;
    const c = this.ctx, t = c.currentTime;
    const o = c.createOscillator();
    o.type = 'sawtooth';
    const temel = 120 + Math.random() * 180;
    o.frequency.setValueAtTime(temel, t);
    o.frequency.exponentialRampToValueAtTime(temel * (1.3 + Math.random()), t + .5);
    const f = c.createBiquadFilter();
    f.type = 'bandpass'; f.frequency.value = 900 + Math.random() * 700; f.Q.value = 12;
    const g = c.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(.02 * guc, t + .08);
    g.gain.exponentialRampToValueAtTime(.0004, t + .55);
    o.connect(f); f.connect(g); g.connect(this.ana);
    o.start(t); o.stop(t + .6);
  },

  /* ── su damlası ───────────────────────────────────────────────────── */
  damla() {
    if (!this.hazir || this.kapali) return;
    const c = this.ctx, t = c.currentTime;
    const o = c.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(1400 + Math.random() * 500, t);
    o.frequency.exponentialRampToValueAtTime(420, t + .09);
    const g = c.createGain();
    g.gain.setValueAtTime(.05, t);
    g.gain.exponentialRampToValueAtTime(.0004, t + .3);
    const kv = c.createConvolver();
    o.connect(g); g.connect(this.ana);
    o.start(t); o.stop(t + .35);
  },

  /* ── kalp atışı ───────────────────────────────────────────────────── */
  kalp(guc = 1) {
    if (!this.hazir || this.kapali) return;
    const c = this.ctx;
    const vur = (gecikme, v) => {
      const t = c.currentTime + gecikme;
      const o = c.createOscillator();
      o.type = 'sine';
      o.frequency.setValueAtTime(64, t);
      o.frequency.exponentialRampToValueAtTime(28, t + .18);
      const g = c.createGain();
      g.gain.setValueAtTime(v * guc, t);
      g.gain.exponentialRampToValueAtTime(.0005, t + .3);
      o.connect(g); g.connect(this.ana);
      o.start(t); o.stop(t + .35);
    };
    vur(0, .16); vur(.26, .11);
  },

  /* ── ninni: uzaktan, mırıldanarak ─────────────────────────────────── */
  ninni() {
    if (!this.hazir || this.kapali) return;
    const c = this.ctx;
    const notalar = [392, 392, 349.2, 329.6, 293.7, 329.6, 349.2, 293.7, 261.6, 293.7, 261.6];
    const sure = [.5, .32, .5, .5, .8, .35, .35, .5, .6, .35, 1.0];
    let t = c.currentTime + .2;
    const bus = c.createGain(); bus.gain.value = .5;
    const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900;
    bus.connect(lp); lp.connect(this.ana);
    notalar.forEach((f, i) => {
      const o = c.createOscillator(); o.type = 'sine'; o.frequency.value = f;
      const vib = c.createOscillator(); vib.frequency.value = 5.2;
      const vg = c.createGain(); vg.gain.value = 3.2;
      vib.connect(vg); vg.connect(o.frequency); vib.start(t); vib.stop(t + sure[i]);
      const g = c.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(.028, t + .1);
      g.gain.setValueAtTime(.028, t + sure[i] * .7);
      g.gain.exponentialRampToValueAtTime(.0004, t + sure[i]);
      o.connect(g); g.connect(bus);
      o.start(t); o.stop(t + sure[i] + .05);
      t += sure[i] * .92;
    });
  },

  /* ── arayüz sesleri ───────────────────────────────────────────────── */
  tik() {
    if (!this.hazir) return;
    const c = this.ctx, t = c.currentTime;
    const s = this.gurultu();
    const f = c.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 2400;
    const g = c.createGain();
    g.gain.setValueAtTime(.07, t);
    g.gain.exponentialRampToValueAtTime(.0004, t + .045);
    s.connect(f); f.connect(g); g.connect(this.ana);
    s.start(t); s.stop(t + .06);
  },

  sayfa() {
    if (!this.hazir) return;
    const c = this.ctx, t = c.currentTime;
    const s = this.gurultu();
    const f = c.createBiquadFilter();
    f.type = 'bandpass'; f.frequency.setValueAtTime(2600, t);
    f.frequency.exponentialRampToValueAtTime(900, t + .18); f.Q.value = 1.4;
    const g = c.createGain();
    g.gain.setValueAtTime(.045, t);
    g.gain.exponentialRampToValueAtTime(.0005, t + .2);
    s.connect(f); f.connect(g); g.connect(this.ana);
    s.start(t); s.stop(t + .25);
  },

  telefon() {
    if (!this.hazir) return;
    const c = this.ctx;
    for (let i = 0; i < 3; i++) {
      const t = c.currentTime + i * .34;
      const o = c.createOscillator(); o.type = 'square'; o.frequency.value = 46;
      const g = c.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(.05, t + .02);
      g.gain.setValueAtTime(.05, t + .18);
      g.gain.exponentialRampToValueAtTime(.0005, t + .22);
      o.connect(g); g.connect(this.ana);
      o.start(t); o.stop(t + .25);
    }
  },

  vurgu() {                            // keşif / açığa çıkma
    if (!this.hazir) return;
    const c = this.ctx, t = c.currentTime;
    [110, 164.8, 220].forEach((f, i) => {
      const o = c.createOscillator(); o.type = 'sine'; o.frequency.value = f;
      const g = c.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(.045 / (i + 1), t + .3);
      g.gain.exponentialRampToValueAtTime(.0004, t + 2.6);
      o.connect(g); g.connect(this.ana);
      o.start(t); o.stop(t + 2.7);
    });
  },

  korku() {                            // ani gerilim vuruşu
    if (!this.hazir) return;
    const c = this.ctx, t = c.currentTime;
    const o = c.createOscillator(); o.type = 'sawtooth';
    o.frequency.setValueAtTime(160, t);
    o.frequency.exponentialRampToValueAtTime(38, t + 1.6);
    const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 500;
    const g = c.createGain();
    g.gain.setValueAtTime(.001, t);
    g.gain.linearRampToValueAtTime(.075, t + .06);
    g.gain.exponentialRampToValueAtTime(.0005, t + 1.8);
    o.connect(f); f.connect(g); g.connect(this.ana);
    o.start(t); o.stop(t + 1.9);
  },

  /* ── arka planda gelişigüzel ev sesleri ───────────────────────────── */
  rastgeleOlaylar() {
    const dongu = () => {
      if (!this.kapali && Durum && Durum.basladi) {
        const r = Math.random();
        if (Oyuncu.poz.y < -1) { this.damla(); if (r < .3) this.gicirti(.4); }
        else if (r < .35) this.gicirti(.3 + Math.random() * .4);
        else if (r < .45 && Durum.gerilim > .4) this.kalp(.7);
      }
      setTimeout(dongu, 2600 + Math.random() * 6000);
    };
    setTimeout(dongu, 4000);
  },
};

/* =========================================================================
   Türkçe seslendirme — tarayıcının kendi konuşma motoru (Web Speech API).
   Ses dosyası gerektirmez. Türkçe ses yoksa sessizce yazıya düşer.
   ========================================================================= */
const Konusma = {
  destek: false, ses: null, acik: true, hazir: false,

  kur() {
    if (!('speechSynthesis' in window)) return;
    this.destek = true;
    const sec = () => {
      const hepsi = speechSynthesis.getVoices();
      if (!hepsi.length) return;
      this.ses = hepsi.find(v => v.lang && v.lang.toLowerCase().startsWith('tr'))
              || hepsi.find(v => /turkish|türk/i.test(v.name))
              || null;
      this.hazir = true;
    };
    sec();
    speechSynthesis.onvoiceschanged = sec;
  },

  /* metni konuş; tırnak ve sahne yönergelerini temizler */
  soyle(metin, o = {}) {
    if (!this.destek || !this.acik || !this.ses) return false;
    const temiz = metin.replace(/[""«»]/g, '').replace(/\s+/g, ' ').trim();
    if (!temiz) return false;
    try { speechSynthesis.cancel(); } catch (e) {}
    const u = new SpeechSynthesisUtterance(temiz);
    u.voice = this.ses;
    u.lang = this.ses.lang || 'tr-TR';
    u.rate = o.hiz ?? .94;
    u.pitch = o.perde ?? .85;
    u.volume = o.ses ?? 1;
    // konuşurken ortam sesini kıs
    if (Ses.ana) {
      Ses.ana.gain.setTargetAtTime(.45, Ses.ctx.currentTime, .3);
      u.onend = u.onerror = () => Ses.ana.gain.setTargetAtTime(.9, Ses.ctx.currentTime, .6);
    }
    speechSynthesis.speak(u);
    return true;
  },

  sus() { if (this.destek) try { speechSynthesis.cancel(); } catch (e) {} },

  cevir() {
    this.acik = !this.acik;
    if (!this.acik) this.sus();
    return this.acik;
  },
};
