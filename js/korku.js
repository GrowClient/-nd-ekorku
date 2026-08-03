/* =========================================================================
   YAKALANMA — jump scare.
   Varlık yakaladığında ekranın tamamını kaplayan bir yüz + çığlık.
   Yüz dosyadan gelmiyor, <canvas> üzerine çiziliyor: aynı prosedürel
   yaklaşımın devamı. Amaç fotogerçekçilik değil, bir anda gözünün içine
   bakan bir şey olması.
   ========================================================================= */

const Korku = {
  el: null, tuval: null, cizildi: false, acikMi: false, zamanlayici: null,

  kur() {
    this.el = document.getElementById('korku');
    this.tuval = document.getElementById('korkuYuz');
  },

  /* Yüzü bir kere çiz, sonra yeniden kullan (yakalanınca kare kaybetmeyelim) */
  ciz() {
    if (this.cizildi) return;
    this.cizildi = true;
    const c = this.tuval, G = 1024, Y = 1024;
    c.width = G; c.height = Y;
    const x = c.getContext('2d');
    const R = Math.random;

    x.fillStyle = '#05050a'; x.fillRect(0, 0, G, Y);

    const mx = G / 2, my = Y * .52;

    /* --- kafatası hacmi: içten dışa sönen soluk bir ışık --- */
    const kafa = x.createRadialGradient(mx, my - 40, 40, mx, my, 430);
    kafa.addColorStop(0,   '#c8bda6');
    kafa.addColorStop(.42, '#8d8271');
    kafa.addColorStop(.72, '#3b372f');
    kafa.addColorStop(1,   '#08080c');
    x.fillStyle = kafa;
    x.beginPath();
    x.ellipse(mx, my, 268, 356, 0, 0, Math.PI * 2);
    x.fill();

    /* --- elmacık kemikleri ve çukurlar: yandan gelen fener ışığı --- */
    const golge = (cx, cy, rx, ry, a, guc) => {
      const g = x.createRadialGradient(cx, cy, 2, cx, cy, Math.max(rx, ry));
      g.addColorStop(0, 'rgba(6,6,10,' + guc + ')');
      g.addColorStop(1, 'rgba(6,6,10,0)');
      x.fillStyle = g;
      x.beginPath(); x.ellipse(cx, cy, rx, ry, a, 0, Math.PI * 2); x.fill();
    };
    golge(mx - 148, my + 38, 96, 128, .18, .8);        // sol yanak çukuru
    golge(mx + 148, my + 38, 96, 128, -.18, .8);       // sağ yanak çukuru
    golge(mx, my - 300, 250, 120, 0, .75);             // alın gölgesi
    golge(mx, my + 320, 210, 130, 0, .85);             // çene altı

    /* --- göz çukurları: dipsiz --- */
    const goz = (gx) => {
      const g = x.createRadialGradient(gx, my - 76, 4, gx, my - 76, 96);
      g.addColorStop(0,   '#000000');
      g.addColorStop(.55, '#000000');
      g.addColorStop(1,   'rgba(0,0,0,0)');
      x.fillStyle = g;
      x.beginPath(); x.ellipse(gx, my - 76, 92, 66, 0, 0, Math.PI * 2); x.fill();
      // çukurun dibinde yaş gibi parlayan ince bir nokta
      x.fillStyle = 'rgba(198,208,220,.5)';
      x.beginPath(); x.ellipse(gx + 8, my - 66, 9, 6, 0, 0, Math.PI * 2); x.fill();
      x.fillStyle = 'rgba(255,255,255,.9)';
      x.beginPath(); x.arc(gx + 10, my - 68, 2.6, 0, Math.PI * 2); x.fill();
    };
    goz(mx - 108); goz(mx + 108);

    /* --- burun: sadece iki delik --- */
    x.fillStyle = 'rgba(0,0,0,.88)';
    x.beginPath(); x.ellipse(mx - 26, my + 74, 15, 24, .25, 0, Math.PI * 2); x.fill();
    x.beginPath(); x.ellipse(mx + 26, my + 74, 15, 24, -.25, 0, Math.PI * 2); x.fill();
    golge(mx, my + 20, 46, 90, 0, .45);

    /* --- ağız: açık, çok açık --- */
    x.fillStyle = '#000';
    x.beginPath();
    x.moveTo(mx - 96, my + 168);
    x.quadraticCurveTo(mx, my + 132, mx + 96, my + 168);
    x.quadraticCurveTo(mx + 74, my + 330, mx, my + 344);
    x.quadraticCurveTo(mx - 74, my + 330, mx - 96, my + 168);
    x.closePath(); x.fill();
    // üst diş sırası
    x.fillStyle = 'rgba(206,198,176,.82)';
    for (let i = 0; i < 9; i++) {
      const t = i / 8, dx = mx - 84 + t * 168;
      const dy = my + 172 + Math.sin(t * Math.PI) * -22;
      x.fillRect(dx - 8, dy, 16, 20 + R() * 8);
    }
    x.fillStyle = 'rgba(178,170,150,.6)';
    for (let i = 0; i < 7; i++) {
      const t = i / 6, dx = mx - 64 + t * 128;
      const dy = my + 300 + Math.sin(t * Math.PI) * 14;
      x.fillRect(dx - 7, dy - 18, 14, 18);
    }

    /* --- deri dokusu: çatlaklar ve lekeler --- */
    x.globalAlpha = .32;
    for (let i = 0; i < 260; i++) {
      const a = R() * Math.PI * 2, r = Math.sqrt(R()) * 300;
      const px = mx + Math.cos(a) * r * .88, py = my + Math.sin(a) * r * 1.15;
      x.strokeStyle = R() < .5 ? '#241f18' : '#9d907a';
      x.lineWidth = .5 + R() * 1.4;
      x.beginPath();
      x.moveTo(px, py);
      x.lineTo(px + (R() - .5) * 44, py + (R() - .5) * 44);
      x.stroke();
    }
    x.globalAlpha = 1;

    /* --- saç: seyrek, ıslak --- */
    x.strokeStyle = 'rgba(10,9,12,.9)';
    for (let i = 0; i < 220; i++) {
      const a = -Math.PI * (.08 + R() * .84);
      const sx = mx + Math.cos(a) * 258, sy = my + Math.sin(a) * 330;
      x.lineWidth = .8 + R() * 1.8;
      x.beginPath();
      x.moveTo(sx, sy);
      x.bezierCurveTo(sx + (R() - .5) * 60, sy + 90, sx + (R() - .5) * 130, sy + 220,
                      sx + (R() - .5) * 170, sy + 340 + R() * 180);
      x.stroke();
    }

    /* --- kenar karartma: yüz karanlıktan çıkıyor --- */
    const vin = x.createRadialGradient(mx, my, 260, mx, my, 640);
    vin.addColorStop(0, 'rgba(0,0,0,0)');
    vin.addColorStop(1, 'rgba(0,0,0,1)');
    x.fillStyle = vin; x.fillRect(0, 0, G, Y);

    /* --- gren --- */
    const im = x.getImageData(0, 0, G, Y), d = im.data;
    for (let i = 0; i < d.length; i += 4) {
      const g = (Math.random() - .5) * 34;
      d[i] += g; d[i + 1] += g; d[i + 2] += g * 1.1;
    }
    x.putImageData(im, 0, 0);
  },

  /* Yakalanma anı */
  bas(sure = 900) {
    if (!this.el || this.acikMi) return;
    this.ciz();
    this.acikMi = true;
    this.el.classList.add('gor');
    // animasyonu her seferinde baştan başlat
    this.tuval.style.animation = 'none';
    void this.tuval.offsetWidth;
    this.tuval.style.animation = '';
    Ses.ciglik();
    clearTimeout(this.zamanlayici);
    this.zamanlayici = setTimeout(() => this.kapat(), sure);
  },

  kapat() {
    if (!this.el) return;
    this.acikMi = false;
    this.el.classList.remove('gor');
  },
};
