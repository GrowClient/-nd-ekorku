/* =========================================================================
   VARLIK — evde dolaşan şey.
   Gazete küpürü okunduktan sonra etkinleşir. Bakılmadığı sürece yaklaşır;
   fener üstüne tutulunca donar ve bir süre sonra çekilir. Yakalarsa
   öldürmez: ekran kararır ve oyuncu birkaç saniye önceki yerine döner.
   ========================================================================= */

const Varlik = {
  aktif: false,
  durum: 'uyku',              // uyku | yaklasiyor | donuk | cekiliyor
  mesh: null,
  poz: new THREE.Vector3(),
  bekleme: 26,
  bakilanSure: 0,
  takiliSure: 0,
  sonPoz: new THREE.Vector3(),
  saydam: 0,
  ekmekKirintisi: [],
  kirintiSayaci: 0,
  yakalanmaSayisi: 0,
  yakinlik: 0,          // 0..1 — ekran efekti için
  ekranSag: 0,          // -1 sol, +1 sağ, 0 arkada
  kalpSayaci: 0,
  isin: new THREE.Raycaster(),

  kur(sahne) {
    const g = new THREE.Group();
    // fenerde belli belirsiz seçilecek kadar açık, gölgede siluet kalacak
    // kadar koyu — tam siyah yaparsan hiç görünmüyor.
    const mal = new THREE.MeshStandardMaterial({
      color: 0x24242b, roughness: .97, metalness: 0,
      emissive: 0x090a10, emissiveIntensity: 1,
      transparent: true, opacity: 0, depthWrite: false,
    });
    const ek = (en, yuk, boy, y, z = 0) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(en, yuk, boy), mal);
      m.position.set(0, y, z);
      g.add(m);
    };
    ek(.30, .52, .18, .74);                    // gövde
    ek(.20, .16, .18, 1.06);                   // omuz/boyun
    const kafa = new THREE.Mesh(new THREE.SphereGeometry(.115, 12, 10), mal);
    kafa.position.y = 1.20; g.add(kafa);
    ek(.075, .44, .075, .74, 0);                // kollar
    g.children[g.children.length - 1].position.x = -.19;
    ek(.075, .44, .075, .74, 0);
    g.children[g.children.length - 1].position.x = .19;
    ek(.10, .48, .10, .24, 0);
    g.children[g.children.length - 1].position.x = -.08;
    ek(.10, .48, .10, .24, 0);
    g.children[g.children.length - 1].position.x = .08;

    g.visible = false;
    sahne.add(g);
    this.mesh = g;
    this.malzeme = mal;
    this.sahne = sahne;
  },

  etkinlestir() {
    if (this.aktif) return;
    this.aktif = true;
    this.bekleme = 30;
    Arayuz.fisilti('Evde benden başka bir şey var. Bunu kanıtlayamam ama artık biliyorum.');
  },

  /* Oyuncunun geldiği yolu hatırla — yakalanınca oraya döneceğiz */
  kirintiBirak(dt) {
    this.kirintiSayaci += dt;
    if (this.kirintiSayaci < .5) return;
    this.kirintiSayaci = 0;
    this.ekmekKirintisi.push(Oyuncu.poz.clone());
    if (this.ekmekKirintisi.length > 24) this.ekmekKirintisi.shift();
  },

  /* Oyuncudan uzakta, görüş dışında, geçerli bir zemin noktası bul */
  dogumYeriBul(kamera, enAz = 6.5, enCok = 13.5) {
    const ileri = new THREE.Vector3();
    kamera.getWorldDirection(ileri);
    for (let deneme = 0; deneme < 90; deneme++) {
      const a = Math.random() * Math.PI * 2;
      const d = enAz + Math.random() * (enCok - enAz);
      const x = Oyuncu.poz.x + Math.cos(a) * d;
      const z = Oyuncu.poz.z + Math.sin(a) * d;
      if (x < .6 || x > 14.4 || z < .6 || z > 11.4) continue;
      const y = Ev.zeminYuksekligi(x, z, Oyuncu.poz.y);
      if (y === null || Math.abs(y - Oyuncu.poz.y) > .6) continue;
      if (Oyuncu.carpisiyorMu(x, z, y)) continue;
      // oyuncunun tam karşısında doğmasın
      const yon = new THREE.Vector3(x - Oyuncu.poz.x, 0, z - Oyuncu.poz.z).normalize();
      if (yon.dot(new THREE.Vector3(ileri.x, 0, ileri.z).normalize()) > .25) continue;
      return new THREE.Vector3(x, y, z);
    }
    return null;
  },

  gorunuyorMu(kamera) {
    if (!Oyuncu.fenerAcik) return false;
    const goz = kamera.position;
    const hedef = this.poz.clone().setY(this.poz.y + 1.0);
    const fark = hedef.clone().sub(goz);
    const uzak = fark.length();
    if (uzak > 15) return false;
    const ileri = new THREE.Vector3();
    kamera.getWorldDirection(ileri);
    if (fark.clone().normalize().dot(ileri) < .87) return false;      // ~30°
    this.isin.set(goz, fark.clone().normalize());
    this.isin.far = uzak - .35;
    const kes = this.isin.intersectObjects(this.sahne.children, true);
    for (const v of kes) {
      if (!v.object.isMesh || !v.object.visible) continue;
      if (v.object.material === this.malzeme || v.object.material === M.cam) continue;
      return false;                                                    // arada engel var
    }
    return true;
  },

  ilerle(dt, hiz) {
    const hedef = new THREE.Vector3(Oyuncu.poz.x, 0, Oyuncu.poz.z);
    const yon = hedef.clone().sub(new THREE.Vector3(this.poz.x, 0, this.poz.z));
    const uzak = yon.length();
    if (uzak < .001) return;
    yon.normalize();
    const adim = hiz * dt;
    const dene = (nx, nz) => {
      const y = Ev.zeminYuksekligi(nx, nz, this.poz.y);
      if (y === null || Math.abs(y - this.poz.y) > .8) return false;
      if (Oyuncu.carpisiyorMu(nx, nz, y)) return false;
      this.poz.set(nx, y, nz);
      return true;
    };
    if (dene(this.poz.x + yon.x * adim, this.poz.z + yon.z * adim)) { this.takiliSure = 0; return; }
    if (dene(this.poz.x + yon.x * adim, this.poz.z)) { this.takiliSure += dt; return; }
    if (dene(this.poz.x, this.poz.z + yon.z * adim)) { this.takiliSure += dt; return; }
    this.takiliSure += dt;
  },

  yakala() {
    this.yakalanmaSayisi++;
    Ses.korku(); Ses.kalp(1.6);
    Durum.karartma = 1;
    this.yakinlik = 0;
    this.durum = 'uyku';
    this.bekleme = 55;
    this.mesh.visible = false;
    this.saydam = 0;

    // birkaç saniye önceki, varlıktan uzak bir konuma dön
    let hedef = null;
    for (let i = this.ekmekKirintisi.length - 1; i >= 0; i--) {
      const k = this.ekmekKirintisi[i];
      if (k.distanceTo(this.poz) > 4.5) { hedef = k; break; }
    }
    if (!hedef) hedef = this.ekmekKirintisi[0] || new THREE.Vector3(7.5, 0, 10.5);
    setTimeout(() => {
      Oyuncu.poz.copy(hedef);
      Oyuncu.hiz.set(0, 0, 0);
      this.ekmekKirintisi.length = 0;
      Durum.karartma = 0;
      Arayuz.fisilti(YAKALANDI[this.yakalanmaSayisi % YAKALANDI.length]);
    }, 1100);
  },

  /* Ekran efekti: ne kadar yakın ve hangi yanda */
  yakinlikGuncelle(dt, kamera, mesafe) {
    const menzil = 11;
    let hedef = 0;
    if (this.durum === 'yaklasiyor' || this.durum === 'donuk')
      hedef = Math.max(0, Math.min(1, (menzil - mesafe) / menzil));
    if (this.durum === 'donuk') hedef *= .5;       // bakınca sakinleşir
    this.yakinlik += (hedef - this.yakinlik) * Math.min(1, dt * 2.2);

    const ileri = new THREE.Vector3();
    kamera.getWorldDirection(ileri); ileri.y = 0; ileri.normalize();
    const sag = new THREE.Vector3(-ileri.z, 0, ileri.x);
    const yon = new THREE.Vector3(this.poz.x - Oyuncu.poz.x, 0, this.poz.z - Oyuncu.poz.z).normalize();
    this.ekranSag = yon.dot(ileri) < -.2 ? 0 : (yon.dot(sag) > 0 ? 1 : -1);

    // kalp atışı yaklaştıkça hızlanır
    if (this.yakinlik > .18) {
      this.kalpSayaci -= dt;
      if (this.kalpSayaci <= 0) {
        Ses.kalp(.5 + this.yakinlik * .9);
        this.kalpSayaci = 1.5 - this.yakinlik * .95;
      }
    }
  },

  guncelle(dt, kamera) {
    if (!this.aktif || Durum.bitti) { this.yakinlik = 0; return; }
    if (Arayuz.acikPanel || Durum.sinema) { this.yakinlik *= .9; return; }
    this.kirintiBirak(dt);

    if (this.durum === 'uyku') {
      this.yakinlik *= .93;
      this.bekleme -= dt * (Durum.gerisayimAktif ? 1.7 : 1);
      if (this.bekleme <= 0) {
        const p = this.dogumYeriBul(kamera);
        if (p) {
          this.poz.copy(p);
          this.durum = 'yaklasiyor';
          this.bakilanSure = 0; this.takiliSure = 0; this.saydam = 0;
          this.mesh.visible = true;
          if (Math.random() < .7)
            Arayuz.fisilti(VARLIK_FISILTI[(Math.random() * VARLIK_FISILTI.length) | 0]);
          Ses.gicirti(.8);
        } else this.bekleme = 6;
      }
      return;
    }

    const gorunur = this.gorunuyorMu(kamera);
    const mesafe = Math.hypot(Oyuncu.poz.x - this.poz.x, Oyuncu.poz.z - this.poz.z);
    this.yakinlikGuncelle(dt, kamera, mesafe);

    if (this.durum === 'yaklasiyor') {
      if (gorunur) { this.durum = 'donuk'; this.bakilanSure = 0; }
      else {
        this.ilerle(dt, Durum.gerisayimAktif ? 1.35 : .95);
        if (this.takiliSure > 2.2) {   // duvara sıkıştıysa görünmeden YAKINA geçer
          const p = this.dogumYeriBul(kamera, 2.6, Math.max(3.2, mesafe - .6));
          if (p) { this.poz.copy(p); this.takiliSure = 0; Ses.gicirti(.45); }
        }
        if (mesafe < 1.15 && Math.abs(Oyuncu.poz.y - this.poz.y) < 1) { this.yakala(); return; }
      }
    } else if (this.durum === 'donuk') {
      if (!gorunur) { this.durum = 'yaklasiyor'; }
      else {
        this.bakilanSure += dt;
        if (this.bakilanSure > 1.5) { this.durum = 'cekiliyor'; Ses.gicirti(.5); }
      }
    } else if (this.durum === 'cekiliyor') {
      this.saydam -= dt * 1.6;
      if (this.saydam <= 0) {
        this.durum = 'uyku';
        this.bekleme = 26 + Math.random() * 22;
        this.mesh.visible = false;
      }
    }

    if (this.durum !== 'cekiliyor')
      this.saydam = Math.min(1, this.saydam + dt * 1.2);
    this.malzeme.opacity = this.saydam * .93;

    // duruş: her zaman oyuncuya dönük ama başı hafif eğik
    this.mesh.position.copy(this.poz);
    this.mesh.rotation.y = Math.atan2(Oyuncu.poz.x - this.poz.x, Oyuncu.poz.z - this.poz.z);
    this.mesh.visible = this.saydam > .02;

    // yakınken fener bozulur
    if (mesafe < 7 && this.durum !== 'uyku') {
      const bozulma = 1 - (7 - mesafe) / 7 * .55;
      Oyuncu.fener.intensity *= bozulma + Math.random() * .12;
      if (Math.random() < .012) Ses.adim('ahsap');
    }
  },
};
