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
    sahne.background = new THREE.Color(0x030407);
    sahne.fog = new THREE.FogExp2(0x030407, 0.085);

    kamera = new THREE.PerspectiveCamera(72, innerWidth / innerHeight, .06, 90);
    kamera.rotation.order = 'YXZ';
    sahne.add(kamera);

    /* ışıklar */
    sahne.add(new THREE.HemisphereLight(0x141d33, 0x0a0908, .16));
    sahne.add(new THREE.AmbientLight(0x1a1713, .10));
    const ay = new THREE.DirectionalLight(0x7f96bb, .40);
    ay.position.set(-26, 22, 34);
    sahne.add(ay);

    Ev.kur(sahne);
    Varlik.kur(sahne);
    Oyuncu.kur(kamera, tuval);
    Konusma.kur();
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

    saat = new THREE.Clock();
    dongu();
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
      if (KILITLER[h.esya] && !Durum.kilitAcildi[h.esya]) {
        Arayuz.ipucuGoster('<b>E</b> <span class="kilit">şifreli kilit</span> — ' + e.ad);
        return;
      }
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

    /* şifreli kilitler: kadran panelini aç */
    if (KILITLER[h.esya] && !Durum.kilitAcildi[h.esya]) {
      Arayuz.kilitAc(h.esya);
      if (vurguluNesne) { vurgula(vurguluNesne, false); vurguluNesne = null; }
      return;
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
      Durum.gerisayimGuncelle(dt);
      Varlik.guncelle(dt, kamera);
      Arayuz.gerisayimGuncelle();
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

    nabiz += ((Durum.gerilim > .55 ? (Math.sin(t * 2.1) * .5 + .5) * Durum.gerilim : 0) - nabiz) * dt * 2.4;
    const hedefKarart = Durum.bitti ? 1 : Durum.karartma;
    karart += (hedefKarart - karart) * dt * (Durum.karartma ? 7 : .9);

    Efekt.ciz(renderer, sahne, kamera, t, Durum.gerilim, nabiz, karart);
  }

  let kuruldu = false;
  const baslat = () => { if (!kuruldu) { kuruldu = true; kur(); } };
  if (document.readyState === 'loading') addEventListener('DOMContentLoaded', baslat);
  else baslat();

})();
