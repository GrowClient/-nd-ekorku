/* =========================================================================
   YAKALANMA — jump scare.
   Varlık yakaladığında ekranın tamamını kaplayan bir yüz + çığlık.
   Yüz dosyadan gelmiyor, <canvas> üzerine çiziliyor: aynı prosedürel
   yaklaşımın devamı. Amaç fotogerçekçilik değil, bir anda gözünün içine
   bakan bir şey olması.
   ========================================================================= */

const Korku = {
  el: null, tuval: null, cizildi: false, hazir: false, acikMi: false, zamanlayici: null,

  kur() {
    this.el = document.getElementById('korku');
    this.tuval = document.getElementById('korkuYuz');
    // Görseli şimdiden yükle: yakalanma anında kare kaybetmeyelim.
    const g = new Image();
    g.onload = () => { this.gorsel = g; this.ciz(); };
    g.src = VARLIK_YUZ;
    addEventListener('resize', () => { if (this.gorsel) this.ciz(); });
  },

  /* Yüzü ekran oranında çiz.
     Kaynak kare (768×768); tuvali pencere oranına kurup kapla-kes
     yapıyoruz, yoksa CSS kareyi enine geriyor ve yüz yayvanlaşıyor.
     Göz hattı ekranın %44'üne oturtuluyor: üstten kırpma olsa bile
     bakan gözler her zaman kadrajda kalıyor.                        */
  ciz() {
    const g = this.gorsel;
    if (!g) return;
    const c = this.tuval;
    const G = Math.min(1600, Math.max(640, Math.round(innerWidth * 1.1)));
    const Y = Math.round(G * innerHeight / innerWidth);
    c.width = G; c.height = Y;
    const x = c.getContext('2d');

    x.fillStyle = '#000'; x.fillRect(0, 0, G, Y);

    // yüz, kısa kenarın 1.15 katı olacak kadar büyük
    const o = Math.max(G, Y) * 1.15 / g.width;
    const w = g.width * o, h = g.height * o;
    const GOZ = .70;                       // kaynakta göz hattının dikey oranı
    x.drawImage(g, (G - w) / 2, Y * .44 - h * GOZ, w, h);

    // kenar karartma
    const vin = x.createRadialGradient(G / 2, Y * .44, Math.min(G, Y) * .30,
                                       G / 2, Y * .44, Math.max(G, Y) * .62);
    vin.addColorStop(0, 'rgba(0,0,0,0)');
    vin.addColorStop(1, 'rgba(0,0,0,1)');
    x.fillStyle = vin; x.fillRect(0, 0, G, Y);

    // film greni — oyunun geri kalanıyla aynı dokuda dursun
    const im = x.getImageData(0, 0, G, Y), d = im.data;
    for (let i = 0; i < d.length; i += 4) {
      const n = (Math.random() - .5) * 24;
      d[i] += n; d[i + 1] += n; d[i + 2] += n * 1.1;
    }
    x.putImageData(im, 0, 0);
    this.cizildi = true;
  },

  /* Yakalanma anı */
  bas(sure = 900) {
    if (!this.el || this.acikMi) return;
    if (!this.cizildi) this.ciz();
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
