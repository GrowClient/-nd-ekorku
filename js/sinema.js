/* =========================================================================
   SİNEMA — motor içi ara sahneler.
   Video dosyası yok: kamera evin içinde yolculuk eder, üstüne siyah
   bantlar ve altyazı iner. Her plan {baslangic, bitis, bak, bakBitis,
   sure, yazi} olarak tanımlanır. BOŞLUK/ESC ile geçilebilir.
   ========================================================================= */

const Sinema = {
  aktif: false,
  planlar: [], i: 0, t: 0,
  bitince: null,
  siluetler: [],
  _v1: new THREE.Vector3(), _v2: new THREE.Vector3(),

  kur(sahne, kamera) {
    this.sahne = sahne;
    this.kamera = kamera;
    this.el = document.getElementById('sinema');
    this.yaziEl = document.getElementById('sinemaYazi');
    addEventListener('keydown', e => {
      if (!this.aktif) return;
      if (e.code === 'Space' || e.code === 'Escape' || e.code === 'Enter') {
        e.preventDefault();
        this.atla();
      }
    });
  },

  oynat(planlar, bitince) {
    this.planlar = planlar;
    this.i = 0; this.t = 0;
    this.bitince = bitince || null;
    this.aktif = true;
    Durum.sinema = true;
    document.exitPointerLock && document.exitPointerLock();
    this.el.classList.add('gor');
    document.getElementById('hud').classList.add('gizli');
    this.planBasla();
  },

  planBasla() {
    const p = this.planlar[this.i];
    if (!p) return;
    this.yaziEl.classList.remove('gor');
    setTimeout(() => {
      if (!this.aktif) return;
      this.yaziEl.textContent = p.yazi || '';
      if (p.yazi) this.yaziEl.classList.add('gor');
    }, 420);
    this.disari(!!p.dis);
    if (p.baslarken) p.baslarken();
    // Ara sahneler artık varsayılan olarak seslendirilir. Bu Deniz'in
    // iç sesi: kırılgan ton. Plan kendi tonunu belirtebilir.
    if (p.seslendir !== false && p.yazi)
      setTimeout(() => Konusma.soyle(p.yazi, { ton: p.ton || 'kirilgan' }), 700);
  },

  atla() {
    this.temizle();
    const bit = this.bitince;
    this.bitince = null;
    if (bit) bit();
  },

  temizle() {
    this.disari(false);
    this.aktif = false;
    Durum.sinema = false;
    this.el.classList.remove('gor');
    this.yaziEl.classList.remove('gor');
    if (!Durum.bitti) document.getElementById('hud').classList.remove('gizli');
    this.siluetler.forEach(s => this.sahne.remove(s));
    this.siluetler.length = 0;
    Konusma.sus();
  },

  /* karanlıkta duran bir insan silueti (varlık gövdesinden türetilir) */
  /* parlak=true: karartma yapılmaz. Uzaktan, camın ardından bakılan
     figürler koyu tutulunca hiç seçilmiyor.                        */
  siluet(x, y, z, olcek = 1, bakYaw = 0, parlak = false) {
    const g = Varlik.mesh.clone(true);
    // Gövde dokulu bir düzlem: malzemeyi tamamen değiştirirsek silüet
    // dolu bir dikdörtgene döner. Kopyalayıp yalnızca tonunu değiştiriyoruz;
    // alfa kesimi (alphaTest) böylece korunuyor.
    g.traverse(o => {
      if (!o.isMesh) return;
      let m;
      if (parlak) {
        /* Camın ardında, iç mekân ışığı almayan bir figür. Işığa bağlı
           bir malzemeyle görünmesi imkânsız — yayım haritası da dokuyla
           çarpıldığı için yetmiyor. Bu yüzden ışıktan tamamen bağımsız
           bir malzeme: dokunun kendi parlaklığı neyse o kadar görünür. */
        m = new THREE.MeshBasicMaterial({
          map: o.material.map,
          color: 0xcac3b5,       // camın ardından seçilebilecek kadar açık
          transparent: true, opacity: .96,
          alphaTest: .34, side: THREE.DoubleSide,
        });
      } else {
        m = o.material.clone();
        m.color = new THREE.Color(0x2a2b33);
        m.emissive = new THREE.Color(0x05050a);
        m.opacity = .97;
      }
      o.material = m;
    });
    g.scale.setScalar(olcek);
    g.position.set(x, y, z);
    g.rotation.y = bakYaw;
    g.visible = true;
    this.sahne.add(g);
    this.siluetler.push(g);
    return g;
  },

  /* Dış mekân kipi: sahne sisi iç mekâna göre ayarlı (yoğunluk .085),
     dışarıda 20 metrede her şey kayboluyor. Çıkış planları için sisi
     seyreltip ay ışığını açıyoruz; sahne bitince geri alınıyor.     */
  disari(acik) {
    const s = this.sahne;
    if (!s) return;
    if (acik) {
      if (this._sisYedek === undefined) {
        this._sisYedek = s.fog.density;
        this._sisRenk = s.fog.color.getHex();
        this._gokYedek = s.background.getHex();
      }
      // gece göğü tam siyah değil: evin silueti ayrışsın diye biraz açık
      s.fog.density = .0092;
      s.fog.color.setHex(0x0d1526);
      s.background.setHex(0x0d1526);
      if (Ev.dinamik.disIsik) {
        Ev.dinamik.disIsik.ay.intensity = 3.4;
        Ev.dinamik.disIsik.dolgu.intensity = 1.15;
      }
    } else if (this._sisYedek !== undefined) {
      s.fog.density = this._sisYedek;
      s.fog.color.setHex(this._sisRenk);
      s.background.setHex(this._gokYedek);
      this._sisYedek = undefined;
      if (Ev.dinamik.disIsik) {
        Ev.dinamik.disIsik.ay.intensity = 0;
        Ev.dinamik.disIsik.dolgu.intensity = 0;
      }
    }
  },

  guncelle(dt) {
    if (!this.aktif) return;
    const p = this.planlar[this.i];
    if (!p) { this.atla(); return; }

    this.t += dt;
    let k = Math.min(1, this.t / p.sure);
    const y = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;   // yumuşak giriş/çıkış

    this._v1.fromArray(p.baslangic).lerp(this._v2.fromArray(p.bitis), y);
    this.kamera.position.copy(this._v1);
    this._v1.fromArray(p.bak).lerp(this._v2.fromArray(p.bakBitis || p.bak), y);
    this.kamera.up.set(0, 1, 0);
    this.kamera.lookAt(this._v1);

    if (Oyuncu.fener) Oyuncu.fener.intensity = p.fener !== undefined ? p.fener : 5.5;
    if (Oyuncu.fenerHalka) Oyuncu.fenerHalka.intensity = 1.3;
    if (p.surerken) p.surerken(y);

    if (k >= 1) {
      this.i++; this.t = 0;
      if (this.i >= this.planlar.length) { this.atla(); return; }
      this.planBasla();
    }
  },
};
