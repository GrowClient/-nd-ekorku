/* =========================================================================
   Oyun durumu, hikâye bayrakları, senaryo olayları
   ========================================================================= */

const Durum = {
  basladi: false,
  bitti: false,
  envanter: {},          // esyaId -> true
  sayac: 0,
  bayrak: {},
  anahtar: {},
  ustKat: false, tavanArasi: false, bodrumda: false,
  gerilim: 0,
  pilZayif: false,
  mesajlar: {},
  defter: [],
  oda: '',
  olaylar: {},
  sonSecim: null,
  karartma: 0,
  gerisayimAktif: false,
  kalanSure: 0,
  gerisayimOlaylari: {},
  kilitAcildi: {},
  sinema: false,

  toplamEsya: Object.keys(ESYALAR).length,

  esyaVar(id) { return !!this.envanter[id]; },
  anahtarVar(k) { return !!this.anahtar[k]; },

  /* Evrak kutusu açılınca annem yola çıkar */
  gerisayimBaslat() {
    if (this.gerisayimAktif) return;
    this.gerisayimAktif = true;
    this.kalanSure = GERISAYIM.sure;
    Arayuz.gerisayimGoster(true);
  },

  gerisayimGuncelle(dt) {
    if (!this.gerisayimAktif || this.bitti) return;
    this.kalanSure -= dt;
    for (const o of GERISAYIM.olaylar) {
      if (this.kalanSure <= o.kalan && !this.gerisayimOlaylari[o.kalan]) {
        this.gerisayimOlaylari[o.kalan] = true;
        Arayuz.fisilti(o.metin);
        Ses.korku();
      }
    }
    // çıkmaz sokak olmasın: süre azalırken bodrum hâlâ kilitliyse hatırlat
    if (this.kalanSure < 210 && !this.kilitAcildi.bodrum_kapisi && !this.gerisayimOlaylari.ipucu) {
      this.gerisayimOlaylari.ipucu = true;
      Arayuz.fisilti('Bodrum kilidi dört haneli. Anneannem onu benim gerçek doğum günüme kurmuş — ' +
                     'kimsenin bilmediği güne. Gün, sonra ay.');
    }
    if (this.kalanSure <= 0) {
      this.kalanSure = 0;
      this.gerisayimAktif = false;
      Arayuz.sonGoster('yetisemedin');
    }
  },

  esyaAl(id) {
    const e = ESYALAR[id];
    if (!e) return;
    if (!this.envanter[id]) {
      this.envanter[id] = true;
      this.sayac++;
      this.defter.push({ id, ad: e.ad, oda: e.oda, katalog: e.katalog });
    }
    if (e.bayrak) this.bayrak[e.bayrak] = true;
    if (e.verir) {
      this.anahtar[e.verir] = true;
      Arayuz.bildirim('ANAHTAR ALINDI — ' + ({
        key_kiler: 'kiler', key_tavan: 'tavan arası', key_bodrum: 'bodrum asma kilidi',
      })[e.verir]);
    }
    this.gerilimGuncelle();
    this.mesajKontrol();
    this.olayKontrol();
  },

  gerilimGuncelle() {
    let g = Math.min(.55, this.sayac / this.toplamEsya * .8);
    if (this.bayrak.f_cizelge) g += .08;
    if (this.bayrak.f_pamuk) g += .06;
    if (this.bayrak.f_mont) g += .08;
    if (this.bayrak.f_album) g += .1;
    if (this.bayrak.f_gazete) g += .14;
    if (this.bayrak.f_evrak) g += .2;
    if (this.bayrak.f_sandik) g += .1;
    if (this.bodrumda) g += .1;
    this.gerilim = Math.min(1, g);
    Ses.gerilim(this.gerilim);
  },

  /* Gerçeği ne kadar biliyoruz? — anıların "yankısı" buna göre açılır */
  gercekSeviyesi() {
    if (this.bayrak.f_sandik) return 3;
    if (this.bayrak.f_evrak) return 2;
    if (this.bayrak.f_gazete) return 1;
    return 0;
  },

  mesajKuyrugu: [],
  mesajOynuyor: false,

  mesajKontrol() {
    for (const m of MESAJLAR) {
      if (this.mesajlar[m.id]) continue;
      let uygun = false;
      try { uygun = m.kosul(this); } catch (e) { uygun = false; }
      if (uygun) {
        this.mesajlar[m.id] = true;
        this.mesajKuyrugu.push(m);
      }
    }
    this.mesajAkit();
  },

  /* Aynı anda birden fazla mesaj tetiklenirse sıraya girer, üst üste binmez */
  mesajAkit(gecikme = 1400) {
    if (this.mesajOynuyor || !this.mesajKuyrugu.length) return;
    this.mesajOynuyor = true;
    const m = this.mesajKuyrugu.shift();
    setTimeout(() => {
      Arayuz.mesaj(m);
      setTimeout(() => { this.mesajOynuyor = false; this.mesajAkit(2200); }, 14500);
    }, gecikme);
  },

  /* ── senaryo olayları: ev sessizce değişir ─────────────────────────── */
  olayKontrol() {
    const O = this.olaylar;

    // Gazete: koridordaki bir çerçeve daha boşalır + saat değişir + ninni
    if (this.bayrak.f_gazete && !O.cerceve) {
      O.cerceve = true;
      const c = Ev.dinamik.cerceveler;
      if (c && c[3]) {
        const yeni = P.bosCerceve(.3, .38);
        yeni.position.copy(c[3].position);
        yeni.rotation.copy(c[3].rotation);
        yeni.traverse(o => { if (o.isMesh) o.userData.esya = 'cerceveler'; });
        Ev.sahne.remove(c[3]);
        const i = Ev.etkilesimliler.indexOf(c[3]);
        if (i >= 0) Ev.etkilesimliler.splice(i, 1);
        Ev.sahne.add(yeni);
        Ev.etkilesimliler.push(yeni);
        c[3] = yeni;
      }
      setTimeout(() => { Ses.ninni(); Arayuz.fisilti('Üst kattan bir ses geliyor. Mırıldanma gibi.'); }, 5000);
    }

    // Evraklar: koltuk kapıya döner, ışıklar zayıflar
    if (this.bayrak.f_evrak && !O.koltuk) {
      O.koltuk = true;
      if (Ev.dinamik.koltuk) Ev.dinamik.koltuk.rotation.y = -Math.PI * .1;
      this.pilZayif = true;
      Ev.isiklar.forEach(l => { l.temelGuc *= .45; });
      setTimeout(() => { Ses.korku(); Arayuz.fisilti('El fenerinin ışığı sarardı.'); }, 800);
    }

    // Gazete: evde artık yalnız değiliz
    if (this.bayrak.f_gazete && !O.varlik) {
      O.varlik = true;
      setTimeout(() => Varlik.etkinlestir(), 6500);
    }

    // Evraklar: annem yola çıktı + iki tarih zihinde birleşir
    if (this.bayrak.f_evrak && !O.yolda) {
      O.yolda = true;
      this.gerisayimBaslat();
      setTimeout(() => Arayuz.fisilti(
        'İki tarih. 11 Ocak ve 2 Mart. Bu evdeki her kilit, her çizgi, her zarf ' +
        'bu iki günün etrafında dönüyor.'), 3200);
    }
  },

  /* ── oda tespiti ───────────────────────────────────────────────────── */
  odaBul(x, y, z) {
    if (y < -1.2) return (x > 5.4 && z > 2 && z < 6.6) ? 'Sarnıç' : 'Bodrum';
    if (y > 5.4) return 'Tavan Arası';
    if (y > 2.2) {
      if (x < 5.5) return z < 5 ? 'Banyo' : 'Çocuk Odası';
      if (x > 9.5) return z < 5 ? 'Sandık Odası' : 'Anneannenin Odası';
      return 'Üst Koridor';
    }
    if (x < 5.5) return z < 5 ? (z < 1.7 ? 'Bodrum Merdiveni' : 'Kiler') : 'Mutfak';
    if (x > 9.5) return z < 5 ? 'Oturma Odası' : 'Salon';
    return 'Antre';
  },

  odaGuncelle(x, y, z) {
    const o = this.odaBul(x, y, z);
    if (o === this.oda) return;
    this.oda = o;
    Arayuz.odaAdi(o);

    if (o === 'Üst Koridor' && !this.ustKat) {
      this.ustKat = true; this.mesajKontrol();
      setTimeout(() => Arayuz.fisilti('Merdivenin başında duruyorum. Bu koridoru hatırlıyorum — ama daha kısaydı.'), 2200);
    }
    if (o === 'Tavan Arası' && !this.tavanArasi) {
      this.tavanArasi = true;
      const a = Ev.dinamik.sofaAmpul;
      if (a) { a.canli = false; setTimeout(() => { Ses.korku(); }, 3000); }
      Arayuz.fisilti('Toz. Yirmi yıllık toz. Ve ayak izleri — benimkinden küçük değil, ama benimki de değil.');
    }
    if (o === 'Bodrum' && !this.bodrumda) {
      this.bodrumda = true; this.gerilimGuncelle();
      Arayuz.fisilti('Aşağısı soğuk. Ve su sesi gerçekmiş.');
    }
    if (o === 'Sarnıç') Ses.gerilim(1);
  },
};
