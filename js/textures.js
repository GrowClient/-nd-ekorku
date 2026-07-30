/* =========================================================================
   Prosedürel dokular — hiçbir dış görsel dosyası kullanılmaz.
   Hepsi <canvas> üstünde çizilir, THREE.CanvasTexture olarak döner.
   ========================================================================= */

const Doku = (() => {

  function tuval(b = 512, y = 512) {
    const c = document.createElement('canvas');
    c.width = b; c.height = y;
    return { c, x: c.getContext('2d') };
  }

  function rastgele(tohum) {           // deterministik rastgele
    let s = tohum >>> 0;
    return () => {
      s ^= s << 13; s >>>= 0;
      s ^= s >> 17;
      s ^= s << 5;  s >>>= 0;
      return s / 4294967296;
    };
  }

  /* Kanvasa ince gren / kir ekle */
  function gren(x, b, y, siddet = 14, tohum = 7) {
    const r = rastgele(tohum);
    const veri = x.getImageData(0, 0, b, y);
    const p = veri.data;
    for (let i = 0; i < p.length; i += 4) {
      const n = (r() - 0.5) * siddet;
      p[i] += n; p[i + 1] += n; p[i + 2] += n;
    }
    x.putImageData(veri, 0, 0);
  }

  /* Rastgele leke / rutubet bulutları */
  function lekeler(x, b, y, sayi, renk, minR, maxR, alfa, tohum) {
    const r = rastgele(tohum);
    for (let i = 0; i < sayi; i++) {
      const cx = r() * b, cy = r() * y, yc = minR + r() * (maxR - minR);
      const g = x.createRadialGradient(cx, cy, 0, cx, cy, yc);
      g.addColorStop(0, `rgba(${renk},${alfa})`);
      g.addColorStop(1, `rgba(${renk},0)`);
      x.fillStyle = g;
      x.beginPath(); x.arc(cx, cy, yc, 0, 7); x.fill();
    }
  }

  function dokuYap(c, tekrarX = 1, tekrarY = 1) {
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(tekrarX, tekrarY);
    t.anisotropy = 4;
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }

  function bumpYap(c, tekrarX = 1, tekrarY = 1) {
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(tekrarX, tekrarY);
    return t;
  }

  /* ── Ahşap döşeme: uzun tahtalar, damar, aşınma ─────────────────────── */
  function ahsapDoseme(koyu = false) {
    const { c, x } = tuval(512, 512);
    const r = rastgele(91);
    const taban = koyu ? [58, 42, 30] : [96, 70, 46];
    x.fillStyle = `rgb(${taban.join(',')})`;
    x.fillRect(0, 0, 512, 512);

    const tahtaY = 64;
    for (let i = 0; i < 512 / tahtaY; i++) {
      const yy = i * tahtaY;
      const t = 0.82 + r() * 0.36;
      x.fillStyle = `rgb(${taban.map(v => Math.min(255, v * t)).join(',')})`;
      x.fillRect(0, yy, 512, tahtaY - 1);

      // damarlar
      for (let d = 0; d < 26; d++) {
        const dy = yy + r() * tahtaY;
        x.strokeStyle = `rgba(0,0,0,${0.03 + r() * 0.09})`;
        x.lineWidth = 0.6 + r() * 1.6;
        x.beginPath();
        x.moveTo(0, dy);
        for (let px = 0; px <= 512; px += 32)
          x.lineTo(px, dy + Math.sin((px + i * 40) * 0.02) * 2.4 + (r() - 0.5) * 1.6);
        x.stroke();
      }
      // tahta ek yeri (dikey)
      const ek = r() * 512;
      x.fillStyle = 'rgba(0,0,0,0.35)';
      x.fillRect(ek, yy, 1.5, tahtaY - 1);
      // derz
      x.fillStyle = 'rgba(0,0,0,0.45)';
      x.fillRect(0, yy + tahtaY - 2, 512, 2);
    }
    lekeler(x, 512, 512, 22, '30,20,12', 20, 90, 0.28, 3);
    gren(x, 512, 512, 16, 12);
    return dokuYap(c, 1, 1);
  }

  /* ── Duvar kâğıdı: solmuş çiçek deseni, dikey şeritler ───────────────── */
  function duvarKagidi(tonu = 0) {
    const { c, x } = tuval(512, 512);
    const r = rastgele(41 + tonu);
    const paletler = [
      ['#6b6250', '#7a705c', '#8a7a5f'],   // salon — kirli krem
      ['#4f5a52', '#5b675e', '#6a766b'],   // koridor — soluk yeşil
      ['#6d5a52', '#7b665d', '#8a746a'],   // yatak odası — solmuş gül
    ];
    const p = paletler[tonu % 3];
    x.fillStyle = p[0]; x.fillRect(0, 0, 512, 512);

    // dikey şeritler
    for (let i = 0; i < 512; i += 42) {
      x.fillStyle = p[1];
      x.fillRect(i, 0, 21, 512);
    }
    // çiçek/damla motifi
    for (let gy = 0; gy < 512; gy += 64) {
      for (let gx = 0; gx < 512; gx += 64) {
        const ox = gx + ((gy / 64) % 2 ? 32 : 0);
        x.save();
        x.translate(ox + 16, gy + 32);
        x.globalAlpha = 0.5;
        x.fillStyle = p[2];
        for (let yap = 0; yap < 5; yap++) {
          x.rotate(Math.PI * 2 / 5);
          x.beginPath();
          x.ellipse(0, -9, 4.4, 9, 0, 0, 7);
          x.fill();
        }
        x.globalAlpha = 0.7;
        x.beginPath(); x.arc(0, 0, 3, 0, 7); x.fill();
        x.restore();
      }
    }
    // rutubet ve sararma
    lekeler(x, 512, 512, 16, '52,38,20', 30, 140, 0.3, 5);
    lekeler(x, 512, 512, 8, '20,18,14', 40, 120, 0.22, 9);
    // soyulma çizgileri
    x.globalAlpha = 0.25;
    for (let i = 0; i < 6; i++) {
      x.strokeStyle = '#2b2318'; x.lineWidth = 1 + r() * 2;
      x.beginPath(); x.moveTo(r() * 512, 0);
      x.bezierCurveTo(r() * 512, 170, r() * 512, 340, r() * 512, 512);
      x.stroke();
    }
    x.globalAlpha = 1;
    gren(x, 512, 512, 12, 21);
    return dokuYap(c, 1, 1);
  }

  /* ── Sıva / badana ───────────────────────────────────────────────────── */
  function siva(karanlik = false) {
    const { c, x } = tuval(512, 512);
    const t = karanlik ? 46 : 74;
    x.fillStyle = `rgb(${t},${t - 5},${t - 13})`;
    x.fillRect(0, 0, 512, 512);
    lekeler(x, 512, 512, 34, '28,22,13', 26, 150, 0.26, 33);
    lekeler(x, 512, 512, 14, '86,80,66', 24, 80, 0.10, 77);
    lekeler(x, 512, 512, 9, '54,44,26', 40, 170, 0.24, 121);   // rutubet
    // ince saç çatlakları
    const r = rastgele(5);
    for (let i = 0; i < 7; i++) {
      let px = r() * 512, py = r() * 512;
      x.strokeStyle = 'rgba(0,0,0,0.22)';
      x.lineWidth = 0.4 + r() * 0.5;
      x.beginPath(); x.moveTo(px, py);
      const yon = r() * Math.PI * 2;
      for (let s = 0; s < 18; s++) {
        px += Math.cos(yon + (r() - .5) * 1.1) * (6 + r() * 12);
        py += Math.sin(yon + (r() - .5) * 1.1) * (6 + r() * 12);
        x.lineTo(px, py);
      }
      x.stroke();
    }
    gren(x, 512, 512, 13, 55);
    return dokuYap(c, 1, 1);
  }

  /* ── Ahşap tahta (mobilya, kapı, lambri) ─────────────────────────────── */
  function ahsap(tonKoyu = 1) {
    const { c, x } = tuval(256, 256);
    const r = rastgele(303);
    const b = [92 / tonKoyu, 64 / tonKoyu, 40 / tonKoyu];
    x.fillStyle = `rgb(${b.map(v => v | 0).join(',')})`;
    x.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 60; i++) {
      const yy = r() * 256;
      x.strokeStyle = `rgba(${(b[0] * 0.55) | 0},${(b[1] * 0.5) | 0},${(b[2] * 0.45) | 0},${0.2 + r() * 0.4})`;
      x.lineWidth = 0.5 + r() * 2.2;
      x.beginPath(); x.moveTo(0, yy);
      for (let px = 0; px <= 256; px += 16)
        x.lineTo(px, yy + Math.sin(px * 0.035 + i) * 3);
      x.stroke();
    }
    // budak
    for (let i = 0; i < 2; i++) {
      const cx = r() * 256, cy = r() * 256;
      for (let k = 7; k > 0; k--) {
        x.strokeStyle = `rgba(40,26,14,${0.1 * k})`;
        x.lineWidth = 1.2;
        x.beginPath(); x.ellipse(cx, cy, k * 2.6, k * 1.5, 0.5, 0, 7); x.stroke();
      }
    }
    gren(x, 256, 256, 14, 99);
    return dokuYap(c, 1, 1);
  }

  /* ── Taş duvar (bodrum, sarnıç) ──────────────────────────────────────── */
  function tas() {
    const { c, x } = tuval(512, 512);
    const r = rastgele(1234);
    x.fillStyle = '#2a2724'; x.fillRect(0, 0, 512, 512);
    const sy = 64;
    for (let sira = 0; sira < 512 / sy; sira++) {
      const kaydir = (sira % 2) * 40;
      let px = -kaydir;
      while (px < 512) {
        const g = 60 + r() * 60;
        const t = 34 + r() * 26;
        x.fillStyle = `rgb(${t + 12},${t + 8},${t})`;
        const yy = sira * sy;
        x.fillRect(px + 3, yy + 3, g - 6, sy - 6);
        // taş yüzeyi gölge
        const grad = x.createLinearGradient(px, yy, px + g, yy + sy);
        grad.addColorStop(0, 'rgba(255,255,255,0.06)');
        grad.addColorStop(1, 'rgba(0,0,0,0.35)');
        x.fillStyle = grad;
        x.fillRect(px + 3, yy + 3, g - 6, sy - 6);
        px += g;
      }
    }
    lekeler(x, 512, 512, 30, '18,26,20', 20, 90, 0.35, 88);   // yosun / rutubet
    lekeler(x, 512, 512, 14, '10,10,12', 30, 120, 0.4, 4);
    gren(x, 512, 512, 18, 66);
    return dokuYap(c, 1, 1);
  }

  /* ── Mutfak karosu ───────────────────────────────────────────────────── */
  function karo() {
    const { c, x } = tuval(256, 256);
    const r = rastgele(777);
    x.fillStyle = '#3b382f'; x.fillRect(0, 0, 256, 256);
    for (let gy = 0; gy < 4; gy++) for (let gx = 0; gx < 4; gx++) {
      const t = 86 + r() * 24;
      x.fillStyle = `rgb(${t},${t - 3},${t - 13})`;
      x.fillRect(gx * 64 + 2, gy * 64 + 2, 60, 60);
      const g = x.createLinearGradient(gx * 64, gy * 64, gx * 64 + 64, gy * 64 + 64);
      g.addColorStop(0, 'rgba(255,255,255,0.05)');
      g.addColorStop(1, 'rgba(0,0,0,0.16)');
      x.fillStyle = g; x.fillRect(gx * 64 + 2, gy * 64 + 2, 60, 60);
      if (r() > 0.78) {
        x.strokeStyle = 'rgba(0,0,0,0.4)'; x.lineWidth = 0.9;
        x.beginPath();
        x.moveTo(gx * 64 + 2 + r() * 60, gy * 64 + 2);
        x.lineTo(gx * 64 + 2 + r() * 60, gy * 64 + 62);
        x.stroke();
      }
    }
    lekeler(x, 256, 256, 18, '46,36,16', 10, 60, 0.34, 12);
    gren(x, 256, 256, 11, 3);
    return dokuYap(c, 1, 1);
  }

  /* ── Halı / kilim ────────────────────────────────────────────────────── */
  function hali() {
    const { c, x } = tuval(256, 256);
    const r = rastgele(2024);
    x.fillStyle = '#5a2a24'; x.fillRect(0, 0, 256, 256);
    x.fillStyle = '#3d1d1a'; x.fillRect(12, 12, 232, 232);
    x.fillStyle = '#6b3128'; x.fillRect(24, 24, 208, 208);
    // göbek motifi
    x.save(); x.translate(128, 128);
    for (let k = 0; k < 4; k++) {
      x.rotate(Math.PI / 2);
      x.fillStyle = '#8a5a3a';
      x.beginPath(); x.moveTo(0, -70); x.lineTo(34, 0); x.lineTo(0, 70); x.lineTo(-34, 0); x.closePath(); x.fill();
      x.fillStyle = '#2e1512';
      x.beginPath(); x.moveTo(0, -46); x.lineTo(22, 0); x.lineTo(0, 46); x.lineTo(-22, 0); x.closePath(); x.fill();
    }
    x.restore();
    // aşınma
    lekeler(x, 256, 256, 24, '30,22,16', 12, 60, 0.4, 6);
    gren(x, 256, 256, 20, 44);
    return dokuYap(c, 1, 1);
  }

  /* ── Kâğıt (fotoğraf, belge, gazete) ─────────────────────────────────── */
  function kagit(sararmis = true) {
    const { c, x } = tuval(128, 128);
    x.fillStyle = sararmis ? '#c9b78e' : '#ded6c4';
    x.fillRect(0, 0, 128, 128);
    lekeler(x, 128, 128, 10, '120,90,40', 6, 40, 0.3, 17);
    gren(x, 128, 128, 10, 23);
    return dokuYap(c, 1, 1);
  }

  /* ── Kumaş (koltuk, perde, yatak) ────────────────────────────────────── */
  function kumas(renk = '#2f4438') {
    const { c, x } = tuval(128, 128);
    const r = rastgele(59);
    x.fillStyle = renk; x.fillRect(0, 0, 128, 128);
    for (let i = 0; i < 128; i += 2) {
      x.strokeStyle = `rgba(255,255,255,${0.03 + r() * 0.03})`;
      x.beginPath(); x.moveTo(0, i); x.lineTo(128, i); x.stroke();
      x.strokeStyle = `rgba(0,0,0,${0.05 + r() * 0.05})`;
      x.beginPath(); x.moveTo(i, 0); x.lineTo(i, 128); x.stroke();
    }
    lekeler(x, 128, 128, 8, '20,16,10', 8, 40, 0.35, 31);
    gren(x, 128, 128, 10, 8);
    return dokuYap(c, 1, 1);
  }

  /* ── Tavan ───────────────────────────────────────────────────────────── */
  function tavan() {
    const { c, x } = tuval(256, 256);
    x.fillStyle = '#8b8272'; x.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 256; i += 32) {
      x.fillStyle = 'rgba(0,0,0,0.10)';
      x.fillRect(0, i, 256, 2);
    }
    lekeler(x, 256, 256, 14, '70,52,26', 18, 80, 0.34, 61);   // su lekesi
    gren(x, 256, 256, 10, 71);
    return dokuYap(c, 1, 1);
  }

  /* ── Bump haritası: yüzey kabartısı ──────────────────────────────────── */
  function bumpGurultu(olcek = 3) {
    const { c, x } = tuval(256, 256);
    const r = rastgele(4321);
    const veri = x.createImageData(256, 256);
    for (let i = 0; i < veri.data.length; i += 4) {
      const v = 110 + (r() - 0.5) * 90;
      veri.data[i] = veri.data[i + 1] = veri.data[i + 2] = v;
      veri.data[i + 3] = 255;
    }
    x.putImageData(veri, 0, 0);
    return bumpYap(c, olcek, olcek);
  }

  /* ── Fotoğraf: bulanık bir çocuk silüeti (yüz hiç net değil) ─────────── */
  function eskiFotograf(kesik = false) {
    const { c, x } = tuval(256, 320);
    x.fillStyle = '#b8a887'; x.fillRect(0, 0, 256, 320);
    x.fillStyle = '#8d8168'; x.fillRect(14, 14, 228, 292);
    // arka plan (bahçe)
    const g = x.createLinearGradient(0, 30, 0, 300);
    g.addColorStop(0, '#9a9079'); g.addColorStop(1, '#6d654f');
    x.fillStyle = g; x.fillRect(14, 14, 228, 292);
    // figürler
    const figur = (cx, h, gen, ton) => {
      x.fillStyle = ton;
      x.beginPath(); x.ellipse(cx, 300 - h, gen * 0.42, gen * 0.42, 0, 0, 7); x.fill();
      x.beginPath();
      x.moveTo(cx - gen * 0.5, 300);
      x.lineTo(cx - gen * 0.42, 300 - h + gen * 0.3);
      x.lineTo(cx + gen * 0.42, 300 - h + gen * 0.3);
      x.lineTo(cx + gen * 0.5, 300);
      x.closePath(); x.fill();
    };
    figur(70, 190, 40, '#3b3527');
    figur(190, 186, 40, '#463d2c');
    figur(128, 150, 34, '#2f2b20');
    if (!kesik) figur(128, 74, 24, '#4a4232');       // çocuk
    else {                                            // kesilmiş: boşluk
      x.fillStyle = '#d8cdb0';
      x.beginPath(); x.moveTo(108, 300); x.lineTo(112, 214); x.lineTo(146, 212); x.lineTo(150, 300); x.closePath(); x.fill();
    }
    // bulanıklık ve yaşlanma
    lekeler(x, 256, 320, 14, '140,110,60', 12, 60, 0.3, 13);
    gren(x, 256, 320, 16, 90);
    return dokuYap(c, 1, 1);
  }

  return { ahsapDoseme, duvarKagidi, siva, ahsap, tas, karo, hali, kagit, kumas, tavan, bumpGurultu, eskiFotograf };
})();
