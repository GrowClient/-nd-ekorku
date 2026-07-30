/* =========================================================================
   MİRAS — başlangıç, oyun döngüsü, etkileşim
   ========================================================================= */

(function () {

  let renderer, sahne, kamera, saat;
  const isin = new THREE.Raycaster();
  const merkez = new THREE.Vector2(0, 0);
  let vurguluNesne = null;
  let nabiz = 0, karart = 0;

  function kur() {
    const tuval = document.createElement('canvas');
    document.getElementById('sahne').appendChild(tuval);

    renderer = new THREE.WebGLRenderer({ canvas: tuval, antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
    renderer.setSize(innerWidth, innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    sahne = new THREE.Scene();
    sahne.background = new THREE.Color(0x04050a);
    sahne.fog = new THREE.FogExp2(0x04050a, 0.045);

    kamera = new THREE.PerspectiveCamera(72, innerWidth / innerHeight, .06, 90);
    kamera.rotation.order = 'YXZ';
    sahne.add(kamera);

    /* ışıklar */
    sahne.add(new THREE.HemisphereLight(0x22304e, 0x15130e, .42));
    sahne.add(new THREE.AmbientLight(0x2b2620, .30));
    const ay = new THREE.DirectionalLight(0x9bb2d6, .70);
    ay.position.set(-26, 22, 34);
    sahne.add(ay);

    Ev.kur(sahne);
    Oyuncu.kur(kamera, tuval);
    Efekt.kur(renderer, innerWidth, innerHeight);
    Arayuz.kur();
    Arayuz.girisMetni();
    Arayuz.sayacGuncelle();
    Arayuz.fenerDurum(true, false);

    addEventListener('resize', () => {
      kamera.aspect = innerWidth / innerHeight;
      kamera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
      Efekt.boyut(renderer, innerWidth, innerHeight);
    });

    addEventListener('keydown', e => {
      if (e.code === 'KeyE' && Durum.basladi && !Arayuz.acikPanel && Oyuncu.kilitli) etkilesimYap();
    });
    addEventListener('pointerdown', () => Ses.devamEt());

    tozKur();
    saat = new THREE.Clock();
    dongu();
  }

  /* ── havada asılı toz ────────────────────────────────────────────── */
  let toz = null;
  function tozKur() {
    const n = 420;
    const p = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      p[i * 3]     = (Math.random() - .5) * 12;
      p[i * 3 + 1] = (Math.random() - .5) * 4;
      p[i * 3 + 2] = (Math.random() - .5) * 12;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    toz = new THREE.Points(g, new THREE.PointsMaterial({
      color: 0xd8c8a4, size: .022, transparent: true, opacity: .5,
      depthWrite: false, blending: THREE.AdditiveBlending, fog: true,
    }));
    toz.frustumCulled = false;
    sahne.add(toz);
  }

  function tozGuncelle(t) {
    if (!toz) return;
    toz.position.set(Oyuncu.poz.x, Oyuncu.poz.y + 1.2, Oyuncu.poz.z);
    const p = toz.geometry.attributes.position;
    for (let i = 0; i < p.count; i += 3) {                 // seyrek güncelle
      const j = (i + ((t * 20) | 0) % 3) % p.count;
      p.setY(j, p.getY(j) + Math.sin(t * .6 + j) * .0016 - .0009);
      if (p.getY(j) < -2) p.setY(j, 2);
    }
    p.needsUpdate = true;
  }

  /* ── vurgulama ──────────────────────────────────────────────────── */
  function vurgula(obj, ac) {
    if (!obj) return;
    obj.traverse(o => {
      if (!o.isMesh) return;
      if (ac) {
        if (!o.userData.normalMal) o.userData.normalMal = o.material;
        if (!o.userData.vurguMal) {
          const m = o.material.clone();
          m.emissive = new THREE.Color(0x6a5326);
          m.emissiveIntensity = 1;
          o.userData.vurguMal = m;
        }
        o.material = o.userData.vurguMal;
      } else if (o.userData.normalMal) {
        o.material = o.userData.normalMal;
      }
    });
  }

  /* ── bakılan nesne ──────────────────────────────────────────────── */
  /* Merkezden ışın: duvar/döşeme arkasındaki eşya seçilemez —
     bu yüzden tüm sahneye bakıp yalnızca ilk isabete güveniyoruz. */
  function bakilan() {
    isin.setFromCamera(merkez, kamera);
    isin.far = 2.7;
    const kes = isin.intersectObjects(sahne.children, true);
    for (const v of kes) {
      if (!v.object.isMesh || !v.object.visible) continue;
      if (v.object.material === M.cam) continue;          // camın ardı görünür
      let o = v.object;
      while (o && !o.userData.esya && !o.userData.kapi) o = o.parent;
      if (!o) return null;                                 // önce başka bir yüzey var
      let kok = o;
      while (kok.parent && kok.parent !== sahne) kok = kok.parent;
      return { kok, esya: o.userData.esya, kapiId: o.userData.kapi };
    }
    return null;
  }

  function ipucuGuncelle() {
    if (Arayuz.acikPanel || !Oyuncu.kilitli) { Arayuz.ipucuGizle(); Arayuz.nisanAktif(false); return; }
    const h = bakilan();
    if (vurguluNesne && (!h || h.kok !== vurguluNesne)) { vurgula(vurguluNesne, false); vurguluNesne = null; }
    if (!h) { Arayuz.ipucuGizle(); Arayuz.nisanAktif(false); return; }

    if (h.kok !== vurguluNesne) { vurgula(h.kok, true); vurguluNesne = h.kok; }
    Arayuz.nisanAktif(true);

    if (h.kapiId) {
      const k = Ev.kapilar[h.kapiId];
      if (k && !k.acik) {
        const varMi = Durum.anahtarVar(k.anahtar);
        Arayuz.ipucuGoster(varMi
          ? '<b>E</b> kapıyı aç'
          : '<b>E</b> <span class="kilit">kilitli — anahtar gerek</span>');
        return;
      }
    }
    if (h.esya) {
      const e = ESYALAR[h.esya];
      const yeni = !Durum.esyaVar(h.esya);
      Arayuz.ipucuGoster('<b>E</b> ' + (yeni ? 'incele' : 'tekrar bak') + ' — ' + e.ad);
    }
  }

  /* ── etkileşim ──────────────────────────────────────────────────── */
  function etkilesimYap() {
    const h = bakilan();
    if (!h) return;

    /* kilitli kapı */
    if (h.kapiId) {
      const k = Ev.kapilar[h.kapiId];
      if (k && !k.acik) {
        if (Durum.anahtarVar(k.anahtar)) {
          Ev.kapiAc(h.kapiId);
          Ses.gicirti(1);
          Arayuz.bildirim('KİLİT AÇILDI');
          if (h.kapiId === 'sandikodasi')
            Arayuz.fisilti('Kapı içeri doğru açılıyor. Yukarıdan toz iniyor — merdiven var, ve merdiven kullanılmış.');
        } else {
          Ses.tik();
          Arayuz.fisilti(h.kapiId === 'sandikodasi'
            ? 'Kilitli. Anneannem bu odanın anahtarını yanında taşımış olmalı.'
            : 'Kilitli.');
        }
        return;
      }
    }

    if (!h.esya) return;
    const e = ESYALAR[h.esya];

    /* bodrum asma kilidi */
    if (h.esya === 'bodrum_kapisi') {
      if (Durum.anahtarVar('key_bodrum')) {
        if (Ev.kapiAc('bodrum')) {
          Ses.gicirti(1);
          Arayuz.bildirim('ASMA KİLİT AÇILDI');
        }
      } else if (Durum.esyaVar('bodrum_kapisi')) {
        Ses.tik();
        Arayuz.fisilti(e.kilitMesaj);
        return;
      }
    }

    Arayuz.esyaAc(h.esya);
    if (vurguluNesne) { vurgula(vurguluNesne, false); vurguluNesne = null; }
  }

  /* ── kapı animasyonu ────────────────────────────────────────────── */
  function kapilariGuncelle(dt) {
    for (const id in Ev.kapilar) {
      const k = Ev.kapilar[id];
      if (k.hedefAci === undefined) continue;
      const f = k.hedefAci - k.grup.rotation.y;
      if (Math.abs(f) < .002) { k.hedefAci = undefined; continue; }
      k.grup.rotation.y += f * Math.min(1, 1.6 * dt);
    }
  }

  /* ── ampullerin titremesi ───────────────────────────────────────── */
  function isiklariGuncelle(t) {
    for (const l of Ev.isiklar) {
      if (!l.canli) {
        l.isik.intensity *= .90;
        if (l.ampul.userData.ampulMesh)
          l.ampul.userData.ampulMesh.material.emissiveIntensity *= .90;
        continue;
      }
      const titre = .82 + Math.sin(t * 7.3 + l.isik.position.x) * .05
                        + Math.sin(t * 23.1 + l.isik.position.z) * .04
                        + (Math.random() < .004 ? -.5 : 0);
      l.isik.intensity = l.temelGuc * titre;
    }
  }

  /* ── ana döngü ──────────────────────────────────────────────────── */
  function dongu() {
    requestAnimationFrame(dongu);
    const dt = Math.min(.05, saat.getDelta());
    const t = saat.getElapsedTime();

    if (Durum.basladi && !Durum.bitti) {
      Oyuncu.guncelle(dt);
      Durum.odaGuncelle(Oyuncu.poz.x, Oyuncu.poz.y, Oyuncu.poz.z);
      ipucuGuncelle();
      Arayuz.fenerDurum(Oyuncu.fenerAcik, Durum.pilZayif);
    } else if (!Durum.basladi) {
      // giriş ekranında yavaş kamera kayması
      kamera.position.set(7.5 + Math.sin(t * .09) * .35, 1.62, 10.6);
      kamera.rotation.set(0, 0, 0);
      kamera.rotateY(Math.PI + Math.sin(t * .07) * .16);
      kamera.rotateX(-.04);
    }

    kapilariGuncelle(dt);
    isiklariGuncelle(t);
    tozGuncelle(t);

    nabiz += ((Durum.gerilim > .55 ? (Math.sin(t * 2.1) * .5 + .5) * Durum.gerilim : 0) - nabiz) * dt * 2.4;
    karart += ((Durum.bitti ? 1 : 0) - karart) * dt * .7;

    Efekt.ciz(renderer, sahne, kamera, t, Durum.gerilim, nabiz, karart);
  }

  let kuruldu = false;
  const baslat = () => { if (!kuruldu) { kuruldu = true; kur(); } };
  if (document.readyState === 'loading') addEventListener('DOMContentLoaded', baslat);
  else baslat();

})();
