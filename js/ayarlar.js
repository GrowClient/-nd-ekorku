/* =========================================================================
   AYARLAR ve KAYIT
   - Ayarlar localStorage'da tutulur, anında uygulanır.
   - Kayıt: eşyalar, bayraklar, kilitler, konum, geri sayım. Otomatik.
   ========================================================================= */

const Ayar = {
  anahtar: 'miras.ayar.v1',
  v: {
    parlaklik: 1.0,      // pozlama çarpanı
    duyarlilik: 1.0,     // fare
    ses: 0.9,
    muzik: 0.75,
    bob: true,           // baş sallanması
    gren: true,          // film greni
    tersY: false,
    golge: true,
    seslendirme: true,
  },

  yukle() {
    try {
      const h = JSON.parse(localStorage.getItem(this.anahtar) || '{}');
      Object.assign(this.v, h);
    } catch (e) {}
    this.uygula();
  },

  kaydet() {
    try { localStorage.setItem(this.anahtar, JSON.stringify(this.v)); } catch (e) {}
    this.uygula();
  },

  uygula() {
    if (typeof Efekt !== 'undefined' && Efekt.malzeme) {
      Efekt.malzeme.uniforms.pozlama.value = 1.38 * this.v.parlaklik;
      Efekt.malzeme.uniforms.grenGuc.value = this.v.gren ? 1 : 0;
    }
    if (typeof Oyuncu !== 'undefined') {
      Oyuncu.duyarlilik = .0022 * this.v.duyarlilik;
      Oyuncu.bobAcik = this.v.bob;
      Oyuncu.tersY = this.v.tersY;
    }
    if (typeof Ses !== 'undefined' && Ses.ana)
      Ses.ana.gain.setTargetAtTime(this.v.ses, Ses.ctx.currentTime, .1);
    if (typeof Ses !== 'undefined') Ses.muzikHedef = this.v.muzik;
    if (typeof Konusma !== 'undefined') Konusma.acik = this.v.seslendirme;
    // gölge: fenerin gölge üretimini kapatmak en pahalı geçişi kaldırır
    if (typeof Oyuncu !== 'undefined' && Oyuncu.fener)
      Oyuncu.fener.castShadow = this.v.golge;
  },
};

/* ══════════════════════════════ KAYIT ═══════════════════════════════════ */

const Kayit = {
  anahtar: 'miras.kayit.v1',
  istatistik: 'miras.istatistik.v1',
  sonKayit: 0,

  varMi() {
    try { return !!localStorage.getItem(this.anahtar); } catch (e) { return false; }
  },

  kaydet(zorla) {
    if (!Durum.basladi || Durum.bitti || Durum.sinema) return;
    const t = performance.now();
    if (!zorla && t - this.sonKayit < 4000) return;
    this.sonKayit = t;
    const d = {
      s: 1,
      envanter: Durum.envanter, bayrak: Durum.bayrak, anahtar: Durum.anahtar,
      kilitAcildi: Durum.kilitAcildi, sayac: Durum.sayac, defter: Durum.defter,
      mesajlar: Durum.mesajlar, olaylar: Durum.olaylar,
      ustKat: Durum.ustKat, tavanArasi: Durum.tavanArasi, bodrumda: Durum.bodrumda,
      pilZayif: Durum.pilZayif,
      gerisayimAktif: Durum.gerisayimAktif, kalanSure: Durum.kalanSure,
      gerisayimOlaylari: Durum.gerisayimOlaylari,
      varlikAktif: Varlik.aktif,
      poz: [Oyuncu.poz.x, Oyuncu.poz.y, Oyuncu.poz.z],
      yaw: Oyuncu.yon.yaw, pitch: Oyuncu.yon.pitch,
      kapilar: Object.keys(Ev.kapilar).filter(k => Ev.kapilar[k].acik),
      tarih: new Date().toISOString(),
    };
    try { localStorage.setItem(this.anahtar, JSON.stringify(d)); } catch (e) {}
  },

  oku() {
    try { return JSON.parse(localStorage.getItem(this.anahtar) || 'null'); }
    catch (e) { return null; }
  },

  sil() { try { localStorage.removeItem(this.anahtar); } catch (e) {} },

  /* Kaydı yükle ve dünyayı o hâle getir */
  geriYukle() {
    const d = this.oku();
    if (!d) return false;

    Object.assign(Durum, {
      envanter: d.envanter || {}, bayrak: d.bayrak || {}, anahtar: d.anahtar || {},
      kilitAcildi: d.kilitAcildi || {}, sayac: d.sayac || 0, defter: d.defter || [],
      mesajlar: d.mesajlar || {}, ustKat: !!d.ustKat, tavanArasi: !!d.tavanArasi,
      bodrumda: !!d.bodrumda, pilZayif: !!d.pilZayif,
      gerisayimOlaylari: d.gerisayimOlaylari || {},
      olaylar: {},                         // dünya değişikliklerini yeniden uygula
    });

    (d.kapilar || []).forEach(k => Ev.kapiAc(k));
    Object.keys(Ev.kapilar).forEach(k => {
      const kp = Ev.kapilar[k];
      if (kp.hedefAci !== undefined) { kp.grup.rotation.y = kp.hedefAci; kp.hedefAci = undefined; }
    });

    Durum.gerilimGuncelle();
    Durum.olayKontrol();                   // çerçeve, koltuk, ışıklar tekrar uygulanır
    Durum.mesajKuyrugu.length = 0;         // eski mesajlar tekrar oynamasın

    if (d.gerisayimAktif) {
      Durum.gerisayimAktif = true;
      Durum.kalanSure = d.kalanSure;
      Arayuz.gerisayimGoster(true);
    }
    if (d.varlikAktif) { Varlik.aktif = true; Varlik.durum = 'uyku'; Varlik.bekleme = 25; }

    Oyuncu.poz.set(d.poz[0], d.poz[1], d.poz[2]);
    Oyuncu.yon.yaw = d.yaw; Oyuncu.yon.pitch = d.pitch;
    Oyuncu.hiz.set(0, 0, 0);
    Durum.oda = '';
    Arayuz.sayacGuncelle();
    return true;
  },

  /* Biten oyunların özeti (finaller, en iyi tamamlama) */
  sonuKaydet(sonId) {
    let ist = {};
    try { ist = JSON.parse(localStorage.getItem(this.istatistik) || '{}'); } catch (e) {}
    ist.sonlar = ist.sonlar || {};
    ist.sonlar[sonId] = (ist.sonlar[sonId] || 0) + 1;
    ist.enIyi = Math.max(ist.enIyi || 0, Durum.sayac);
    ist.gizli = ist.gizli || !!Durum.bayrak.f_gizli;
    try { localStorage.setItem(this.istatistik, JSON.stringify(ist)); } catch (e) {}
    return ist;
  },

  istatistikOku() {
    try { return JSON.parse(localStorage.getItem(this.istatistik) || '{}'); } catch (e) { return {}; }
  },
};
