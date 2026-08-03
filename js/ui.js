/* =========================================================================
   Arayüz — HUD, anı paneli, envanter defteri, mesajlar, final
   ========================================================================= */

const $ = s => document.querySelector(s);

const Arayuz = {
  acikPanel: null,        // 'esya' | 'defter' | 'son'
  aktifEsya: null,
  beatIndex: 0,
  fisiltiZaman: 0,

  kur() {
    this.el = {
      hud: $('#hud'), nisan: $('#nisan'), ipucu: $('#ipucu'), oda: $('#oda'),
      sayac: $('#sayac'), fisilti: $('#fisilti'), bildirim: $('#bildirim'),
      esyaPerde: $('#esyaPerde'), esyaKart: $('#esyaKart'),
      defterPerde: $('#defterPerde'), defterKart: $('#defterKart'),
      mesaj: $('#mesajKutu'), giris: $('#giris'), son: $('#son'),
      karart: $('#karart'), fener: $('#fenerIkon'),
      sayim: $('#gerisayim'), sayimBar: $('#gerisayimBar'), sayimYazi: $('#gerisayimYazi'),
      kilitPerde: $('#kilitPerde'), kilitKart: $('#kilitKart'),
      menuPerde: $('#menuPerde'), menuKart: $('#menuKart'), hedef: $('#hedef'),
      devam: $('#devam'),
    };
    if (Kayit.varMi()) this.el.devam.classList.remove('gizli');
    this.el.devam.addEventListener('click', () => this.oyunuBaslat(true));

    $('#basla').addEventListener('click', () => this.oyunuBaslat());

    addEventListener('keydown', e => {
      if (!Durum.basladi || Durum.bitti) return;
      if (e.code === 'Tab') { e.preventDefault(); this.defterCevir(); return; }
      if (e.code === 'KeyM') { const a = Konusma.cevir(); this.bildirim(a ? 'SES AÇIK' : 'SES KAPALI'); return; }
      if (this.acikPanel === 'kilit') { this.kilitTus(e); return; }
      if (this.acikPanel === 'esya') {
        if (e.code === 'Space' || e.code === 'KeyE' || e.code === 'Enter') { e.preventDefault(); this.esyaDevam(); }
        else if (e.code === 'Escape') this.esyaKapat();
      } else if (this.acikPanel === 'defter') {
        if (e.code === 'Escape') this.defterCevir();
      } else if (this.acikPanel === 'menu') {
        if (e.code === 'Escape') this.menuKapat();
      } else if (e.code === 'Escape' && !Durum.sinema) {
        this.menuAc();
      }
    });

    // panel tıklamasıyla ilerle
    this.el.esyaPerde.addEventListener('click', () => this.esyaDevam());
  },

  /* ── açılış ─────────────────────────────────────────────────────── */
  girisMetni() {
    const k = $('#girisMetin');
    ACILIS.forEach((p, i) => {
      const el = document.createElement('p');
      el.textContent = p;
      el.style.animationDelay = (0.5 + i * 0.9) + 's';
      k.appendChild(el);
    });
    $('#kontroller').innerHTML = IPUCLARI.join('<br>');
  },

  oyunuBaslat(devam) {
    Ses.baslat(); Ses.devamEt(); Ayar.uygula();
    this.el.giris.style.transition = 'opacity 1.4s';
    this.el.giris.style.opacity = '0';
    setTimeout(() => {
      this.el.giris.classList.add('gizli');
      Durum.basladi = true;
      if (devam && Kayit.geriYukle()) {
        Oyuncu.imleciKilitle();
        this.fisilti('Kaldığım yerdeyim. Defter hâlâ elimde.');
        return;
      }
      Kayit.sil();
      Sinema.oynat(SAHNELER.acilis, () => {
        Oyuncu.imleciKilitle();
        this.fisilti('Kapıyı arkamdan kapatıyorum. İçerisi dışarıdan soğuk.');
      });
    }, 1400);
  },

  /* Duraklatma menüsü YALNIZCA gerçekten kilitliyken kilit bırakılırsa açılır.
     Panel kapanışında imleç bir an serbest kalıyor; o an menü açılmamalı. */
  imlecDurumu(kilitli) {
    if (kilitli) { this.kilitliydi = true; return; }
    if (!this.kilitliydi) return;
    this.kilitliydi = false;
    if (performance.now() < (this.kilitBekleme || 0)) return;
    if (Durum.basladi && !this.acikPanel && !Durum.bitti && !Durum.sinema)
      this.menuAc();
  },

  /* panel açıp kaparken imleç kilidi zıplar — menüyü kısa süre bastır */
  kilitBekletme() { this.kilitBekleme = performance.now() + 700; },

  /* ══════════════ DURAKLAT / AYARLAR ══════════════ */
  menuAc() {
    if (this.acikPanel || Durum.bitti) return;
    this.acikPanel = 'menu';
    Kayit.kaydet(true);
    document.exitPointerLock && document.exitPointerLock();
    this.menuCiz();
    this.el.menuPerde.classList.add('gor');
  },

  menuKapat() {
    this.kilitBekletme();
    this.el.menuPerde.classList.remove('gor');
    this.acikPanel = null;
    Oyuncu.imleciKilitle();
  },

  menuCiz() {
    const A = Ayar.v;
    const kaydirak = (id, ad, deger, min, max, adim, birim) =>
      '<div class="ayarSatir"><label>' + ad + '</label>' +
      '<input type="range" id="ay_' + id + '" min="' + min + '" max="' + max +
      '" step="' + adim + '" value="' + deger + '">' +
      '<span class="ayarDeger" id="ayd_' + id + '">' +
      Math.round(deger * (birim || 100)) + (birim ? '' : '%') + '</span></div>';
    const anahtarKutu = (id, ad, acik) =>
      '<div class="ayarSatir"><label>' + ad + '</label>' +
      '<button class="anahtar' + (acik ? ' acik' : '') + '" id="ay_' + id + '">' +
      (acik ? 'AÇIK' : 'KAPALI') + '</button><span></span></div>';

    this.el.menuKart.innerHTML =
      '<div class="ustBilgi">Duraklatıldı</div>' +
      '<h2 class="baslik">Ayarlar</h2>' +
      '<div class="katalog">İlerlemen otomatik kaydediliyor. Tarayıcıyı kapatsan bile ' +
      'kaldığın yerden devam edebilirsin.</div>' +
      kaydirak('parlaklik', 'Parlaklık', A.parlaklik, .55, 2.0, .05) +
      kaydirak('duyarlilik', 'Fare duyarlılığı', A.duyarlilik, .3, 2.5, .05) +
      kaydirak('ses', 'Ses', A.ses, 0, 1, .05) +
      kaydirak('muzik', 'Müzik', A.muzik, 0, 1, .05) +
      anahtarKutu('bob', 'Baş sallanması', A.bob) +
      anahtarKutu('gren', 'Film greni', A.gren) +
      anahtarKutu('tersY', 'Y eksenini ters çevir', A.tersY) +
      anahtarKutu('golge', 'Gölgeler (performans)', A.golge) +
      anahtarKutu('seslendirme', 'Türkçe seslendirme', A.seslendirme) +
      '<div class="altBilgi"><button class="menuDugme" id="mnYeni">Yeniden başla</button>' +
      '<button class="menuDugme birincil" id="mnDevam">Devam et</button></div>';

    ['parlaklik', 'duyarlilik', 'ses', 'muzik'].forEach(id => {
      const el = $('#ay_' + id);
      el.addEventListener('input', () => {
        Ayar.v[id] = +el.value;
        $('#ayd_' + id).textContent = Math.round(el.value * 100) + '%';
        Ayar.kaydet();
      });
    });
    ['bob', 'gren', 'tersY', 'golge', 'seslendirme'].forEach(id => {
      const el = $('#ay_' + id);
      el.addEventListener('click', () => {
        Ayar.v[id] = !Ayar.v[id];
        el.classList.toggle('acik', Ayar.v[id]);
        el.textContent = Ayar.v[id] ? 'AÇIK' : 'KAPALI';
        Ayar.kaydet();
      });
    });
    $('#mnDevam').addEventListener('click', () => this.menuKapat());
    $('#mnYeni').addEventListener('click', () => {
      if (!confirm('Baştan başlansın mı? Kayıtlı ilerleme silinecek.')) return;
      Kayit.sil(); location.reload();
    });
  },

  /* ══════════════ HEDEF GÖSTERGESİ ══════════════ */
  hedefGuncelle() {
    if (!Durum.basladi || Durum.bitti) return;
    let m = '';
    for (const h of HEDEFLER) { try { if (h.kosul(Durum)) { m = h.metin; break; } } catch (e) {} }
    if (m !== this._sonHedef) { this._sonHedef = m; this.el.hedef.textContent = m; }
  },

  /* ── HUD ────────────────────────────────────────────────────────── */
  ipucuGoster(html) {
    this.el.ipucu.innerHTML = html;
    this.el.ipucu.classList.add('gor');
  },
  ipucuGizle() { this.el.ipucu.classList.remove('gor'); },

  nisanAktif(v) { this.el.nisan.classList.toggle('aktif', v); },

  odaAdi(ad) {
    const e = this.el.oda;
    e.classList.remove('gor');
    setTimeout(() => { e.textContent = ad; e.classList.add('gor'); }, 260);
    clearTimeout(this._odaZ);
    this._odaZ = setTimeout(() => e.classList.remove('gor'), 5200);
  },

  sayacGuncelle() {
    this.el.sayac.innerHTML = 'Envanter<b>' + Durum.sayac + ' / ' + Durum.toplamEsya + '</b>';
  },

  fenerDurum(acik, zayif) {
    this.el.fener.textContent = acik ? (zayif ? 'fener · zayıf' : 'fener · açık') : 'fener · kapalı';
    this.el.fener.style.opacity = acik ? (zayif ? .55 : .7) : .32;
  },

  fisilti(metin) {
    const e = this.el.fisilti;
    e.textContent = metin;
    e.classList.add('gor');
    clearTimeout(this._fisZ);
    this._fisZ = setTimeout(() => e.classList.remove('gor'), 7600);
  },

  bildirim(metin) {
    const e = this.el.bildirim;
    e.textContent = metin;
    e.classList.add('gor');
    Ses.vurgu();
    clearTimeout(this._bilZ);
    this._bilZ = setTimeout(() => e.classList.remove('gor'), 4200);
  },

  mesaj(m) {
    const e = this.el.mesaj;
    e.querySelector('.kim').textContent = m.baslik;
    e.querySelector('.metin').textContent = m.metin;
    e.classList.add('gor');
    Ses.telefon();
    setTimeout(() => Konusma.soyle(m.metin, { ton: m.ton || 'duz' }), 900);
    clearTimeout(this._mesZ);
    this._mesZ = setTimeout(() => e.classList.remove('gor'), 13000);
  },

  /* ── eşya / anı paneli ──────────────────────────────────────────── */
  /* Küçük eşyalar oyunu durdurmaz: ekranın altında tek satır geçer.
     Tam metin envanter defterinden okunabilir.                        */
  esyaKisa(id) {
    const e = ESYALAR[id];
    const yeni = !Durum.esyaVar(id);
    if (yeni) Durum.esyaAl(id);
    this.sayacGuncelle();
    this.fisilti(e.kisa || e.katalog);
    Ses.sayfa();
    if (yeni) Kayit.kaydet(true);
    const s = Durum.gercekSeviyesi();
    if (e.yanki && !yeni && s >= 1) setTimeout(() => this.fisilti(e.yanki), 6200);
  },

  esyaAc(id, ayar = {}) {
    const e = ESYALAR[id];
    if (!e) return;
    if (!e.panel && !ayar.tam) return this.esyaKisa(id);
    this.aktifEsya = id;
    this.beatIndex = 0;
    this.acikPanel = 'esya';
    this.kilitBekletme();
    document.exitPointerLock && document.exitPointerLock();

    const yeni = !Durum.esyaVar(id);
    const seviye = Durum.gercekSeviyesi();

    this.beatler = (e.tut && !ayar.tam) ? e.tut.map(i => e.beats[i]).filter(Boolean) : e.beats.slice();
    if (ayar.tam && e.kisa) this.beatler.unshift({ t: 'ses', s: e.kisa });
    if (e.yanki && !yeni && seviye >= 1)
      this.beatler.push({ t: 'yanki', s: e.yanki });
    if (e.yanki && yeni && seviye >= 2)
      this.beatler.push({ t: 'yanki', s: e.yanki });

    const k = this.el.esyaKart;
    k.innerHTML =
      '<div class="ustBilgi">' + e.oda + (ayar.tam ? ' · defter kaydı' : (yeni ? '' : ' · yeniden inceleniyor')) + '</div>' +
      '<h2 class="baslik">' + e.ad + '</h2>' +
      '<div class="katalog">' + e.katalog + '</div>' +
      '<div id="beatler"></div>' +
      '<div class="altBilgi"><span id="beatDurum"></span>' +
      '<span><span class="tus">BOŞLUK</span> devam</span></div>';

    this.el.esyaPerde.classList.add('gor');
    this.defterDonus = !!ayar.tam;
    Ses.sayfa();
    this.esyaDevam(true);

    if (yeni && !ayar.tam) { Durum.esyaAl(id); Kayit.kaydet(true); }
    this.sayacGuncelle();
  },

  esyaDevam(ilk) {
    if (this.acikPanel !== 'esya') return;
    if (this.beatIndex >= this.beatler.length) { this.esyaKapat(); return; }
    const b = this.beatler[this.beatIndex++];
    const d = document.createElement('div');
    d.className = 'beat ' + b.t;
    d.textContent = b.s;
    $('#beatler').appendChild(d);
    if (!ilk) Ses.sayfa();
    if (b.t === 'celiski') Ses.kalp(.8);
    if (b.t === 'kupur' || b.t === 'mektup') Ses.gicirti(.3);
    d.scrollIntoView({ behavior: 'smooth', block: 'end' });

    const kalan = this.beatler.length - this.beatIndex;
    $('#beatDurum').textContent = kalan > 0 ? (this.beatIndex + ' / ' + this.beatler.length) : 'kapat';
  },

  esyaKapat() {
    this.kilitBekletme();
    const id = this.aktifEsya;
    const defterdenGeldi = this.defterDonus;
    this.el.esyaPerde.classList.remove('gor');
    this.acikPanel = null;
    this.aktifEsya = null;
    this.defterDonus = false;
    if (defterdenGeldi) { this.defterCevir(); return; }
    Oyuncu.imleciKilitle();
    if (id && ESYALAR[id] && ESYALAR[id].final) setTimeout(() => this.finalAc(), 900);
  },

  /* ── envanter defteri ───────────────────────────────────────────── */
  defterCevir() {
    if (this.acikPanel === 'esya') return;
    if (this.acikPanel === 'defter') {
      this.kilitBekletme();
      this.el.defterPerde.classList.remove('gor');
      this.acikPanel = null;
      Oyuncu.imleciKilitle();
      return;
    }
    this.defterCiz();
    this.el.defterPerde.classList.add('gor');
    this.acikPanel = 'defter';
    this.kilitBekletme();
    document.exitPointerLock && document.exitPointerLock();
    Ses.sayfa();
  },

  defterCiz() {
    const odalar = {};
    let no = 0;
    for (const id of Object.keys(ESYALAR)) {
      if (!Durum.envanter[id]) continue;
      const e = ESYALAR[id];
      (odalar[e.oda] || (odalar[e.oda] = [])).push({ ...e, id, no: ++no });
    }
    let h = '<div class="defterUst"><h2 class="baslik" style="margin:0">Envanter Defteri</h2>' +
            '<span class="ustBilgi" style="margin:0">' + OYUN.altBaslik + '</span></div>';

    if (!no) h += '<div class="bosSatir">Henüz hiçbir şey yazmadım.</div>';

    for (const oda of Object.keys(odalar)) {
      h += '<div class="odaBaslik">' + oda + '</div>';
      for (const e of odalar[oda])
        h += '<div class="satir tikla" data-id="' + e.id + '"><span>' + e.ad +
             '</span><span class="no">' + String(e.no).padStart(2, '0') + ' ›</span></div>';
    }

    const anahtarlar = Object.keys(Durum.anahtar);
    if (anahtarlar.length) {
      h += '<div class="odaBaslik">Anahtarlar</div>';
      const ad = { key_kiler: 'Kiler anahtarı', key_tavan: 'Tavan arası anahtarı', key_bodrum: 'Bodrum asma kilit anahtarı' };
      anahtarlar.forEach(k => { h += '<div class="satir"><span>' + (ad[k] || k) + '</span><span class="no">✓</span></div>'; });
    }

    const s = Durum.gercekSeviyesi();
    const notlar = [
      'Bu evde hatırladığım hiçbir şey, gördüğüm hiçbir şeyle uyuşmuyor. Henüz nedenini bilmiyorum.',
      '1999. Her boşluk aynı yıla açılıyor. Bu evde o yıl bir şey oldu ve kimse bana söylemedi.',
      'İki kayıt. Aynı isim. Bir tanesi kapalı. Envanteri yazmaya devam ediyorum çünkü elimde tutacak başka bir şey yok.',
      'Adım Umut. Bunu bana kimse söylemedi; yirmi üç yıl boyunca yılda iki kez yazıldı ve hiç gönderilmedi.',
    ];
    h += '<div class="defterNot">' + notlar[s] +
         '<br><br><span style="font-style:normal;font-size:12px;letter-spacing:.2em;' +
         'text-transform:uppercase;color:#6e6757">Bir satıra tıkla — o eşyanın tam kaydını oku</span></div>';
    this.el.defterKart.innerHTML = h;
    this.el.defterKart.querySelectorAll('.satir.tikla').forEach(r =>
      r.addEventListener('click', () => {
        this.el.defterPerde.classList.remove('gor');
        this.acikPanel = null;
        this.esyaAc(r.dataset.id, { tam: true });
      }));
  },

  /* ══════════════════ ŞİFRELİ KİLİT ══════════════════ */
  kilitAc(esyaId) {
    const k = KILITLER[esyaId];
    if (!k) return;
    this.kilitEsya = esyaId;
    this.kilitGiris = '';
    this.kilitDeneme = 0;
    this.acikPanel = 'kilit';
    this.kilitBekletme();
    document.exitPointerLock && document.exitPointerLock();
    this.kilitCiz();
    this.el.kilitPerde.classList.add('gor');
    Ses.sayfa();
  },

  kilitCiz(mesaj) {
    const k = KILITLER[this.kilitEsya];
    const haneler = [0, 1, 2, 3].map(i =>
      '<span class="hane' + (i === this.kilitGiris.length ? ' etkin' : '') + '">' +
      (this.kilitGiris[i] || '·') + '</span>').join('');
    // Deftere düşmüş tarihler — şifre buradan çıkar, ezberden değil.
    const tarihler = (Durum.tarihler || []);
    const tarihBlok = tarihler.length
      ? '<div class="tarihKutu"><div class="tarihBaslik">defterindeki tarihler</div>' +
        tarihler.map(t => '<div class="tarihSatir"><b>' + t.ad + '</b>' + t.not + '</div>').join('') +
        '</div>'
      : '<div class="tarihKutu bos">Defterinde henüz tarih yok. Evdeki tarihli şeylere bak: '
        + 'duran saat, pervazdaki boy çizelgesi, zarflar, evraklar.</div>';

    this.el.kilitKart.innerHTML =
      '<div class="ustBilgi">Kilitli' + (this.kilitDeneme ? ' · ' + this.kilitDeneme + ' yanlış deneme' : '') + '</div>' +
      '<h2 class="baslik">' + k.baslik + '</h2>' +
      '<div class="katalog">' + k.altyazi + '</div>' +
      '<div class="kadran">' + haneler + '</div>' +
      '<div class="kilitMesaj">' + (mesaj || '') + '</div>' +
      '<div class="beat ses" style="margin-top:18px">' + k.ipucu +
      (this.kilitDeneme >= 1 && k.ipucu2 ? '<br><br><span style="color:#c2b79c">' + k.ipucu2 + '</span>' : '') +
      (this.kilitDeneme >= 3 && k.ipucu3 ? '<br><br><span style="color:#d8c48f">' + k.ipucu3 + '</span>' : '') + '</div>' +
      tarihBlok +
      '<div class="altBilgi"><span>rakam tuşlarıyla gir</span>' +
      '<span><span class="tus">ENTER</span> dene &nbsp; <span class="tus">ESC</span> vazgeç</span></div>';
  },

  kilitTus(e) {
    if (e.code === 'Escape') { this.kilitKapat(); return; }
    if (e.code === 'Backspace') { this.kilitGiris = this.kilitGiris.slice(0, -1); this.kilitCiz(); Ses.tik(); return; }
    const r = e.key;
    if (/^[0-9]$/.test(r) && this.kilitGiris.length < 4) {
      this.kilitGiris += r; Ses.tik(); this.kilitCiz();
      if (this.kilitGiris.length === 4) setTimeout(() => this.kilitDene(), 260);
      return;
    }
    if (e.code === 'Enter') this.kilitDene();
  },

  kilitDene() {
    const k = KILITLER[this.kilitEsya];
    if (this.kilitGiris === k.kod) {
      Ses.vurgu();
      const id = this.kilitEsya;
      Durum.kilitAcildi[id] = true;
      Kayit.kaydet(true);
      this.el.kilitPerde.classList.remove('gor');
      this.acikPanel = null;
      this.bildirim('KİLİT AÇILDI');
      this.fisilti(k.acilinca);
      if (id === 'bodrum_kapisi') Ev.kapiAc('bodrum');
      setTimeout(() => this.esyaAc(id), 900);
    } else {
      this.kilitDeneme++;
      this.kilitGiris = '';
      Ses.gicirti(.6);
      this.kilitCiz(k.yanlis);
    }
  },

  kilitKapat() {
    this.kilitBekletme();
    this.el.kilitPerde.classList.remove('gor');
    this.acikPanel = null;
    Oyuncu.imleciKilitle();
  },

  /* ══════════════════ GERİ SAYIM ══════════════════ */
  gerisayimGoster(v) { this.el.sayim.classList.toggle('gor', v); },

  gerisayimGuncelle() {
    if (!Durum.gerisayimAktif) return;
    const t = Math.max(0, Durum.kalanSure);
    const dk = Math.floor(t / 60), sn = Math.floor(t % 60);
    this.el.sayimYazi.textContent = dk + ':' + String(sn).padStart(2, '0');
    this.el.sayimBar.style.width = (t / GERISAYIM.sure * 100) + '%';
    this.el.sayim.classList.toggle('kritik', t < 90);
  },

  /* ── FİNAL ──────────────────────────────────────────────────────── */
  finalAc() {
    Durum.bitti = true;
    this.acikPanel = 'son';
    document.exitPointerLock && document.exitPointerLock();
    this.el.karart.classList.add('gor');
    setTimeout(() => {
      this.el.hud.classList.add('gizli');
      const s = this.el.son;
      s.innerHTML =
        '<div class="kutu"><h2>' + FINAL.soru + '</h2><div class="secim">' +
        FINAL.secenekler.map(o =>
          '<button class="sec" data-id="' + o.id + '">' + o.etiket +
          '<small>' + o.alt + '</small></button>').join('') +
        '</div></div>';
      s.classList.add('gor');
      s.querySelectorAll('.sec').forEach(b =>
        b.addEventListener('click', () => this.sonGoster(b.dataset.id)));
      Ses.gerilim(.25);
    }, 1900);
  },

  sonGoster(id) {
    Durum.bitti = true;
    Konusma.sus();
    this.acikPanel = 'son';
    this.gerisayimGoster(false);
    this.gerisayimGoster(false);
    document.exitPointerLock && document.exitPointerLock();
    Durum.sonSecim = id;
    const sahne = SAHNELER['son_' + id];
    if (sahne && !this._sonSahneOynadi) {
      this._sonSahneOynadi = true;
      this.el.son.classList.remove('gor');
      this.el.son.style.opacity = '1';
      Sinema.oynat(sahne, () => { this.el.karart.classList.add('gor');
        setTimeout(() => this.sonGoster(id), 1400); });
      return;
    }
    this.el.karart.classList.add('gor');
    this.el.hud.classList.add('gizli');
    this.el.son.classList.add('gor');
    const son = FINAL.sonlar[id];
    const oran = Durum.sayac / Durum.toplamEsya;
    const epilog = oran > .92 ? FINAL.epilog.tam : oran > .65 ? FINAL.epilog.cok : FINAL.epilog.az;

    const s = this.el.son;
    s.style.opacity = '0';
    s.style.transition = 'opacity .9s';
    setTimeout(() => {
      s.style.opacity = '1';
      Kayit.sil();
      const ist = Kayit.sonuKaydet(id);
      const gorulen = Object.keys(ist.sonlar || {}).length;
      s.innerHTML = '<div class="kutu"><h2>' + son.baslik + '</h2>' +
        son.paragraflar.map(p => '<p>' + p + '</p>').join('') +
        (Durum.bayrak.f_gizli ? '<p>' + FINAL.gizliEk + '</p>' : '') +
        '<div class="kapanis">' + epilog + '</div>' +
        '<div class="ozet">' +
        '<div><b>' + Durum.sayac + ' / ' + Durum.toplamEsya + '</b>eşya kataloglandı</div>' +
        '<div><b>' + gorulen + ' / 3</b>final görüldü</div>' +
        '<div><b>' + (Durum.bayrak.f_gizli ? 'bulundu' : 'bulunamadı') + '</b>' +
        'döşeme altındaki kutu</div></div>' +
        '<div class="imza">Miras · Kavaklı Sokak No. 7' +
        (Durum.sayac < Durum.toplamEsya ? ' · bu evde hâlâ konuşmayı bekleyen ' +
          (Durum.toplamEsya - Durum.sayac) + ' şey var' : '') + '</div>' +
        '<div style="text-align:center;margin-top:34px">' +
        '<button class="dugme" onclick="Kayit.sil();location.reload()">Yeniden oyna</button></div>' +
        '</div>';
      s.style.opacity = '1';
      Ses.gerilim(0);
      Ses.vurgu();
    }, 950);
  },
};
