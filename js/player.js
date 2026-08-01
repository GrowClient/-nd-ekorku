/* =========================================================================
   Oyuncu: fare bakışı, yürüme, çarpışma, kat geçişi, el feneri, adım sesi
   ========================================================================= */

const Oyuncu = {
  poz: new THREE.Vector3(7.5, 0, 10.9),
  yon: { yaw: 0, pitch: -.03 },
  hiz: new THREE.Vector3(),
  yerdeY: 0,
  gozYuk: 1.68,
  yaricap: .3,
  boy: 1.72,
  kilitli: false,
  dondu: false,
  fener: null,
  fenerAcik: true,
  fenerTaban: 0,        // yumuşatılmış temel güç
  fenerCarpan: 1,       // dış etkiler (varlık) buradan kısar; kendiliğinden 1'e döner
  bobFaz: 0,
  adimSayaci: 0,
  koridorHizi: 0,
  duyarlilik: .0022,
  bobAcik: true,
  tersY: false,
  tuslar: {},
  kamera: null,

  kur(kamera, tuval) {
    this.kamera = kamera;

    /* --- el feneri --- */
    const f = new THREE.SpotLight(0xffeec6, 0, 24, .55, .82, 1.28);
    f.castShadow = true;
    f.shadow.mapSize.set(1024, 1024);
    f.shadow.camera.near = .3;
    f.shadow.camera.far = 22;
    f.shadow.bias = -.0016;
    f.shadow.normalBias = .035;
    kamera.add(f);
    kamera.add(f.target);
    f.target.position.set(0, -.14, -1);
    f.position.set(.12, -.12, .1);
    this.fener = f;

    // fenerin yumuşak saçılması
    const halka = new THREE.PointLight(0xffdca8, .9, 6.5, 1.3);
    halka.position.set(0, 0, -.35);
    kamera.add(halka);
    this.fenerHalka = halka;

    /* --- fare --- */
    tuval.addEventListener('click', () => {
      if (!this.kilitli && !Arayuz.acikPanel) tuval.requestPointerLock();
    });
    document.addEventListener('pointerlockchange', () => {
      this.kilitli = document.pointerLockElement === tuval;
      Arayuz.imlecDurumu(this.kilitli);
    });
    document.addEventListener('mousemove', e => {
      if (!this.kilitli) return;
      this.yon.yaw -= e.movementX * this.duyarlilik;
      this.yon.pitch += (this.tersY ? 1 : -1) * e.movementY * this.duyarlilik;
      const s = Math.PI / 2 - .02;
      this.yon.pitch = Math.max(-s, Math.min(s, this.yon.pitch));
    });

    /* --- klavye --- */
    addEventListener('keydown', e => {
      this.tuslar[e.code] = true;
      if (e.code === 'KeyF' && this.kilitli) this.fenerCevir();
      if (e.code === 'Space' && this.kilitli) e.preventDefault();
    });
    addEventListener('keyup', e => { this.tuslar[e.code] = false; });
    addEventListener('blur', () => { this.tuslar = {}; });

    this.yerdeY = Ev.zeminYuksekligi(this.poz.x, this.poz.z, 0) ?? 0;
    this.poz.y = this.yerdeY;
  },

  /* Ayak altındaki yüzey — adım sesi buna göre değişir */
  zeminTipi() {
    const x = this.poz.x, z = this.poz.z, y = this.poz.y;
    if (y < -1) return 'tas';
    if (y > 5.4) return 'ahsap';
    if (y > 2.2) {
      if (x < 5.5 && z < 5) return 'karo';                       // banyo
      if (x < 5.5 && z > 7.8 && z < 9.8 && x > 1.7 && x < 3.7) return 'hali';
      if (x > 9.5 && z > 6.9 && z < 9.9 && x < 13.8) return 'hali';
      return 'ahsap';
    }
    if (x < 5.5 && z > 1.7) return 'karo';                       // mutfak + kiler
    if (x > 6.5 && x < 8.5 && z > 6.6 && z < 11) return 'hali';  // antre halısı
    if (x > 10.7 && x < 14.1 && z > 7.6 && z < 11) return 'hali';
    if (x > 11 && x < 13.8 && z > 1.4 && z < 4.2) return 'hali';
    return 'ahsap';
  },

  fenerCevir() {
    this.fenerAcik = !this.fenerAcik;
    Ses.tik();
  },

  /* Bir noktada (x,z) verilen ayak kotuyla çarpışma var mı? */
  carpisiyorMu(x, z, ayakY) {
    const r = this.yaricap;
    const y0 = ayakY + .25, y1 = ayakY + this.boy;
    const k = Ev.carpismalar;
    for (let i = 0; i < k.length; i++) {
      const b = k[i];
      if (y1 <= b.y0 || y0 >= b.y1) continue;
      if (x + r <= b.x0 || x - r >= b.x1) continue;
      if (z + r <= b.z0 || z - r >= b.z1) continue;
      return true;
    }
    return false;
  },

  guncelle(dt) {
    const t = this.tuslar;
    const hareketVar = this.kilitli && !Arayuz.acikPanel;

    /* --- giriş --- */
    let ileri = 0, yan = 0;
    if (hareketVar) {
      if (t.KeyW || t.ArrowUp) ileri += 1;
      if (t.KeyS || t.ArrowDown) ileri -= 1;
      if (t.KeyD || t.ArrowRight) yan += 1;
      if (t.KeyA || t.ArrowLeft) yan -= 1;
    }
    const kos = (t.ShiftLeft || t.ShiftRight) && ileri > 0;
    const hedefHiz = kos ? 3.05 : 1.62;

    const uz = Math.hypot(ileri, yan) || 1;
    ileri /= uz; yan /= uz;

    const sy = Math.sin(this.yon.yaw), cy = Math.cos(this.yon.yaw);
    const hx = (-sy * ileri + cy * yan) * hedefHiz;
    const hz = (-cy * ileri - sy * yan) * hedefHiz;

    const ivme = (ileri || yan) ? 11 : 15;
    this.hiz.x += (hx - this.hiz.x) * Math.min(1, ivme * dt);
    this.hiz.z += (hz - this.hiz.z) * Math.min(1, ivme * dt);
    if (Math.abs(this.hiz.x) < .002) this.hiz.x = 0;
    if (Math.abs(this.hiz.z) < .002) this.hiz.z = 0;

    /* --- eksen ayrık hareket (duvar boyunca kayma) --- */
    const ayak = this.poz.y;
    let nx = this.poz.x + this.hiz.x * dt;
    if (!this.carpisiyorMu(nx, this.poz.z, ayak)) this.poz.x = nx;
    else this.hiz.x = 0;

    let nz = this.poz.z + this.hiz.z * dt;
    if (!this.carpisiyorMu(this.poz.x, nz, ayak)) this.poz.z = nz;
    else this.hiz.z = 0;

    /* --- kat / zemin --- */
    const zem = Ev.zeminYuksekligi(this.poz.x, this.poz.z, this.poz.y);
    if (zem !== null) {
      this.yerdeY = zem;
      const fark = zem - this.poz.y;
      const enFazla = 3.2 * dt;                       // m/s sınırı: ani sıçrama olmaz
      let adim = fark * Math.min(1, 14 * dt);
      if (adim > enFazla) adim = enFazla;
      else if (adim < -enFazla) adim = -enFazla;
      this.poz.y += adim;
      if (Math.abs(fark) < .004) this.poz.y = zem;
    }

    /* --- baş sallanması --- */
    const hizBuyuk = Math.hypot(this.hiz.x, this.hiz.z);
    this.bobFaz += hizBuyuk * dt * 3.6;
    const bobK = this.bobAcik ? 1 : 0;
    const bobY = Math.sin(this.bobFaz * 2) * (kos ? .055 : .032) * Math.min(1, hizBuyuk) * bobK;
    const bobX = Math.cos(this.bobFaz) * (kos ? .035 : .02) * Math.min(1, hizBuyuk) * bobK;

    /* --- adım sesi --- */
    if (hizBuyuk > .35) {
      this.adimSayaci += hizBuyuk * dt;
      const aralik = kos ? .78 : .95;
      if (this.adimSayaci > aralik) {
        this.adimSayaci = 0;
        Ses.adim(this.zeminTipi());
      }
    }

    /* --- kamera --- */
    const k = this.kamera;
    k.position.set(this.poz.x + bobX * .3, this.poz.y + this.gozYuk + bobY, this.poz.z);
    k.rotation.set(0, 0, 0);
    k.rotateY(this.yon.yaw);
    k.rotateX(this.yon.pitch);
    k.rotateZ(bobX * .045);

    /* --- fener --- */
    const hedefGuc = this.fenerAcik ? (Durum.pilZayif ? 6.4 : 9.8) : 0;
    this.fenerTaban += (hedefGuc - this.fenerTaban) * Math.min(1, 6 * dt);
    // çarpan her karede 1'e geri akar; varlık onu aşağı iter ama birikmez
    this.fenerCarpan += (1 - this.fenerCarpan) * Math.min(1, 5 * dt);
    this.fener.intensity = this.fenerTaban * this.fenerCarpan;
    this.fenerHalka.intensity = this.fener.intensity * .085;
    this.fener.position.x = .12 + Math.sin(this.bobFaz) * .02;
    this.fener.position.y = -.12 + Math.sin(this.bobFaz * 2) * .015;
  },
};
