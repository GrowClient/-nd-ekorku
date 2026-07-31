/* =========================================================================
   EV — Kavaklı Sokak No. 7
   Geometri, çarpışma kutuları, kat yükseklik alanı, eşya yerleşimi.
   ========================================================================= */

const KAT = { bodrum: -2.6, zemin: 0, ust: 3.2, catik: 6.2 };
const TY  = { bodrum: 2.2, zemin: 2.9, ust: 2.7 };

const Ev = {
  carpismalar: [],        // {x0,x1,y0,y1,z0,z1}
  zeminler:    [],        // {x0,x1,z0,z1,y}
  rampalar:    [],        // {x0,x1,z0,z1,eksen,bas,son,y0,y1}
  etkilesimliler: [],
  kapilar:     {},
  dinamik:     {},
  isiklar:     [],
  sahne: null,
};

(function () {

  /* ─────────────────────────── yardımcılar ──────────────────────────── */

  function carp(x0, x1, y0, y1, z0, z1) {
    const k = { x0, x1, y0, y1, z0, z1 };
    Ev.carpismalar.push(k);
    return k;
  }
  function bolge(x0, z0, x1, z1, y) {
    Ev.zeminler.push({
      x0: Math.min(x0, x1), x1: Math.max(x0, x1),
      z0: Math.min(z0, z1), z1: Math.max(z0, z1), y,
    });
  }

  /* Eksen hizalı duvar. bosluklar = [{t0,t1,y0,y1}] (t: duvar boyunca metre) */
  function duvar(ax, az, bx, bz, o = {}) {
    const y0 = o.y0 ?? 0, y1 = o.y1 ?? TY.zemin;
    const kal = o.kal ?? .16, mal = o.mal ?? M.duvar1;
    const dx = bx - ax, dz = bz - az;
    const uzun = Math.hypot(dx, dz);
    if (uzun < .001) return;
    const nx = dx / uzun, nz = dz / uzun;
    const yatay = Math.abs(nx) > .5;

    const bos = (o.bosluklar || []).slice().sort((a, b) => a.t0 - b.t0);
    const parca = [];
    let t = 0;
    for (const b of bos) {
      const by0 = b.y0 ?? y0, by1 = b.y1 ?? (y0 + 2.10);
      if (b.t0 > t) parca.push({ a: t, b: b.t0, y0, y1 });
      if (by0 > y0 + .001) parca.push({ a: b.t0, b: b.t1, y0, y1: by0 });
      if (by1 < y1 - .001) parca.push({ a: b.t0, b: b.t1, y0: by1, y1 });
      t = b.t1;
    }
    if (t < uzun - .001) parca.push({ a: t, b: uzun, y0, y1 });

    const kagitli = mal === M.duvar1 || mal === M.duvar2 || mal === M.duvar3;

    for (const p of parca) {
      const l = p.b - p.a;
      if (l < .005) continue;
      const cx = ax + nx * (p.a + p.b) / 2;
      const cz = az + nz * (p.a + p.b) / 2;
      const en  = yatay ? l : kal;
      const boy = yatay ? kal : l;
      const h   = p.y1 - p.y0;
      const kaydir = (Math.abs(Math.sin(cx * 12.9898 + cz * 78.233)) * 43758.5453) % 1;
      const m = new THREE.Mesh(
        kutuGeo(en, h, boy, (mal.userData && mal.userData.olcek) || 2, kaydir, kagitli), mal);
      m.scale.set(en, h, boy);
      m.position.set(cx, (p.y0 + p.y1) / 2, cz);
      m.castShadow = true; m.receiveShadow = true;
      Ev.sahne.add(m);
      carp(cx - en / 2, cx + en / 2, p.y0, p.y1, cz - boy / 2, cz + boy / 2);

      /* Mimari profiller — odaların çıplak kutu görünmesini kıran şey. */
      if (o.trim === false) continue;
      const tabanda = Math.abs(p.y0 - y0) < .01;
      const tepede  = Math.abs(p.y1 - y1) < .01;
      const seritKoy = (mal2, yMerkez, yuk, tasma) => {
        const s = new THREE.Mesh(G.kutu, mal2);
        s.scale.set(yatay ? l - .02 : kal + tasma, yuk, yatay ? kal + tasma : l - .02);
        s.position.set(cx, yMerkez, cz);
        s.castShadow = true; s.receiveShadow = true;
        Ev.sahne.add(s);
      };
      if (tabanda && h > .9) seritKoy(M.ahsapKoyu, p.y0 + .07, .14, .06);      // süpürgelik
      if (tepede  && h > .9) seritKoy(M.tavan,     p.y1 - .06, .1,  .09);      // kartonpiyer
      if (tabanda && !tepede) seritKoy(M.ahsapKoyu, p.y1 + .02, .06, .12);     // pencere denizliği
      if (tepede && !tabanda && h < .95) {                                     // kapı/pencere lentosu
        const pv = new THREE.Mesh(G.kutu, M.ahsapKoyu);
        pv.scale.set(yatay ? l + .14 : kal + .08, .1, yatay ? kal + .08 : l + .14);
        pv.position.set(cx, p.y0 - .04, cz);
        pv.castShadow = true; pv.receiveShadow = true;
        Ev.sahne.add(pv);
      }
    }
  }

  /* Yatay levha: üst yüzeyi y kotunda */
  function levha(x0, z0, x1, z1, y, mal, kalinlik = .14) {
    const en = Math.abs(x1 - x0), boy = Math.abs(z1 - z0);
    const m = new THREE.Mesh(kutuGeo(en, kalinlik, boy, (mal.userData && mal.userData.olcek) || 2), mal);
    m.scale.set(en, kalinlik, boy);
    m.position.set((x0 + x1) / 2, y - kalinlik / 2, (z0 + z1) / 2);
    m.receiveShadow = true;
    Ev.sahne.add(m);
    return m;
  }
  function levhalar(liste, y, mal, kal) { liste.forEach(p => levha(p[0], p[1], p[2], p[3], y, mal, kal)); }

  /* Merdiven: her basamak, tabandan basamak üstüne kadar dolu bir blok
     olarak çizilir — böylece altta boşluk/dikiş kalmaz. Rampayı kaydeder. */
  function merdiven(x0, z0, x1, z1, yAlt, yUst, eksen, n, korkulukKoord) {
    const uzun = eksen === 'x' ? Math.abs(x1 - x0) : Math.abs(z1 - z0);
    const gen  = eksen === 'x' ? Math.abs(z1 - z0) : Math.abs(x1 - x0);
    const yuks = yUst - yAlt;
    const taban = Math.min(yAlt, yUst) - .12;
    const basamakBoy = uzun / n;

    for (let i = 0; i < n; i++) {
      const t = (i + .5) / n;
      const yTop = yAlt + yuks * ((i + 1) / n);

      // dolu gövde (tabandan basamak üstüne)
      const g = new THREE.Mesh(G.kutu, M.ahsap);
      const h = yTop - taban;
      if (eksen === 'x') { g.scale.set(basamakBoy + .01, h, gen); g.position.set(x0 + (x1 - x0) * t, taban + h / 2, (z0 + z1) / 2); }
      else               { g.scale.set(gen, h, basamakBoy + .01); g.position.set((x0 + x1) / 2, taban + h / 2, z0 + (z1 - z0) * t); }
      g.castShadow = true; g.receiveShadow = true;
      Ev.sahne.add(g);

      // basamak tahtası (üst yüzey, biraz taşkın)
      const m = new THREE.Mesh(G.kutu, M.ahsapKoyu);
      if (eksen === 'x') { m.scale.set(basamakBoy + .06, .06, gen + .02); m.position.set(x0 + (x1 - x0) * t, yTop - .03, (z0 + z1) / 2); }
      else               { m.scale.set(gen + .02, .06, basamakBoy + .06); m.position.set((x0 + x1) / 2, yTop - .03, z0 + (z1 - z0) * t); }
      m.castShadow = true; m.receiveShadow = true;
      Ev.sahne.add(m);
    }

    Ev.rampalar.push({
      x0: Math.min(x0, x1), x1: Math.max(x0, x1),
      z0: Math.min(z0, z1), z1: Math.max(z0, z1),
      eksen, bas: eksen === 'x' ? x0 : z0, son: eksen === 'x' ? x1 : z1,
      y0: yAlt, y1: yUst,
    });

    if (korkulukKoord !== null && korkulukKoord !== undefined) {
      const k = P.merdivenKorkulugu(uzun, yuks);
      if (eksen === 'z') { k.rotation.y = z1 > z0 ? -Math.PI / 2 : Math.PI / 2; k.position.set(korkulukKoord, yAlt, z0); }
      else               { k.rotation.y = x1 > x0 ? 0 : Math.PI;               k.position.set(x0, yAlt, korkulukKoord); }
      Ev.sahne.add(k);
    }
  }

  function koy(obj, x, y, z, ry = 0) {
    obj.position.set(x, y, z);
    if (ry) obj.rotation.y = ry;
    Ev.sahne.add(obj);
    return obj;
  }
  function etk(obj, esyaId) {
    obj.traverse(o => { if (o.isMesh) o.userData.esya = esyaId; });
    obj.userData.esya = esyaId;
    Ev.etkilesimliler.push(obj);
    return obj;
  }

  /* Mobilyayı katı yap: dünya sınır kutusundan çarpışma üretir.
     Alçak nesneler (halı, tepsi, kilit) engel sayılmaz.  */
  function kati(obj, o = {}) {
    obj.updateMatrixWorld(true);
    const k = new THREE.Box3().setFromObject(obj);
    if (k.max.y - k.min.y < (o.enAz ?? .34)) return obj;
    const ic = o.ic ?? .05;
    carp(k.min.x + ic, k.max.x - ic, k.min.y, Math.max(k.max.y, k.min.y + .5),
         k.min.z + ic, k.max.z - ic);
    return obj;
  }
  function yerHalisi(x, z, en, boy, y) {
    const h = new THREE.Mesh(new THREE.PlaneGeometry(en, boy), M.hali);
    h.rotation.x = -Math.PI / 2;
    h.position.set(x, y + .012, z);
    h.receiveShadow = true;
    Ev.sahne.add(h);
    return h;
  }

  /* Kapı kanadı (+ kilitliyse çarpışma) */
  function kapi(id, x, z, yon, taban, o = {}) {
    const en = o.en || .95;
    const g = P.kapiKanadi(en, 2.05);
    g.position.set(x, taban, z);
    g.rotation.y = yon + (o.acik || 0);
    Ev.sahne.add(g);
    const kayit = { grup: g, taban, yon, en, acik: !o.kilitli, anahtar: o.anahtar || null, carpisma: null, x, z };
    if (o.kilitli) {
      const yatay = Math.abs(Math.cos(yon)) > .5;
      const cx = x + Math.cos(yon) * en / 2;
      const cz = z - Math.sin(yon) * en / 2;
      const dx = yatay ? en : .12, dz = yatay ? .12 : en;
      kayit.carpisma = carp(cx - dx / 2, cx + dx / 2, taban, taban + 2.05, cz - dz / 2, cz + dz / 2);
      g.traverse(m => { if (m.isMesh) m.userData.kapi = id; });
      g.userData.kapi = id;
      Ev.etkilesimliler.push(g);
    }
    Ev.kapilar[id] = kayit;
    return kayit;
  }

  Ev.kapiAc = function (id) {
    const k = Ev.kapilar[id];
    if (!k || k.acik) return false;
    k.acik = true;
    if (k.carpisma) {
      const i = Ev.carpismalar.indexOf(k.carpisma);
      if (i >= 0) Ev.carpismalar.splice(i, 1);
    }
    k.hedefAci = k.yon - 1.15;
    return true;
  };

  function pencere(x, y, z, en, yuk, yatayMi) {
    const c = new THREE.Mesh(G.kutu, M.cam);
    c.scale.set(yatayMi ? en : .05, yuk, yatayMi ? .05 : en);
    c.position.set(x, y, z);
    Ev.sahne.add(c);
    for (let i = 1; i < 3; i++) {
      const b = new THREE.Mesh(G.kutu, M.ahsapKoyu);
      b.scale.set(yatayMi ? .05 : .07, yuk, yatayMi ? .07 : .05);
      b.position.set(x + (yatayMi ? (i - 1.5) * en / 2 : 0), y, z + (yatayMi ? 0 : (i - 1.5) * en / 2));
      Ev.sahne.add(b);
    }
    const yb = new THREE.Mesh(G.kutu, M.ahsapKoyu);
    yb.scale.set(yatayMi ? en : .07, .06, yatayMi ? .07 : en);
    yb.position.set(x, y, z);
    Ev.sahne.add(yb);
  }

  /* ══════════════════════════ EV KURULUMU ═══════════════════════════════ */

  Ev.kur = function (sahne) {
    Ev.sahne = sahne;
    malzemeleriKur();

    /* ---------------- DIŞ ÇEVRE ---------------- */
    const yer = new THREE.Mesh(new THREE.PlaneGeometry(160, 160),
      new THREE.MeshStandardMaterial({ color: 0x12160f, roughness: 1 }));
    yer.rotation.x = -Math.PI / 2; yer.position.y = -.2; yer.receiveShadow = true;
    sahne.add(yer);

    const agacMal = new THREE.MeshStandardMaterial({ color: 0x0b110d, roughness: 1 });
    for (let i = 0; i < 28; i++) {
      const a = i / 28 * Math.PI * 2, r = 24 + (i % 5) * 5;
      const g = new THREE.Group();
      const gov = new THREE.Mesh(G.sil, agacMal);
      gov.scale.set(.3, 5 + (i % 3) * 1.5, .3); gov.position.y = 2.6; g.add(gov);
      const tac = new THREE.Mesh(G.kur, agacMal);
      tac.scale.set(2.4, 3.6, 2.4); tac.position.y = 6.6; g.add(tac);
      g.position.set(7.5 + Math.cos(a) * r, 0, 6 + Math.sin(a) * r);
      sahne.add(g);
    }

    /* ---------------- ZEMİN KAT DÖŞEMESİ ----------------
       Bodrum merdiveni boşluğu: x 0..3.5, z 0..1.7                          */
    levhalar([[0, 1.7, 15, 12], [3.5, 0, 15, 1.7]], KAT.zemin, M.doseme, .16);
    levha(0, 5, 5.5, 12, KAT.zemin + .004, M.karo, .01);      // mutfak
    levha(0, 1.75, 5.5, 5, KAT.zemin + .004, M.karo, .01);    // kiler

    bolge(5.5, 0, 9.5, 12, KAT.zemin);      // sofa
    bolge(9.5, 5, 15, 12, KAT.zemin);       // salon
    bolge(9.5, 0, 15, 5, KAT.zemin);        // oturma odası
    bolge(0, 5, 5.5, 12, KAT.zemin);        // mutfak
    bolge(0, 1.7, 5.5, 5, KAT.zemin);       // kiler
    bolge(3.5, 0, 5.5, 1.7, KAT.zemin);     // bodrum sahanlığı

    /* ---------------- DIŞ DUVARLAR (zemin) ---------------- */
    const DIS = { kal: .3, mal: M.siva, y1: TY.zemin };
    duvar(0, 12, 15, 12, { ...DIS, bosluklar: [
      { t0: 7.0, t1: 8.2, y0: 0, y1: 2.15 },
      { t0: 1.6, t1: 2.8, y0: 1.0, y1: 2.1 },
      { t0: 3.6, t1: 4.8, y0: 1.0, y1: 2.1 },
      { t0: 10.4, t1: 11.6, y0: 1.0, y1: 2.1 },
      { t0: 12.6, t1: 13.8, y0: 1.0, y1: 2.1 },
    ] });
    duvar(0, 0, 15, 0, { ...DIS, bosluklar: [
      { t0: 6.2, t1: 7.4, y0: 1.0, y1: 2.1 },
      { t0: 11.0, t1: 12.2, y0: 1.0, y1: 2.1 },
    ] });
    duvar(0, 0, 0, 12, { ...DIS, bosluklar: [
      { t0: 6.4, t1: 7.6, y0: 1.0, y1: 2.1 },
      { t0: 9.2, t1: 10.4, y0: 1.0, y1: 2.1 },
    ] });
    duvar(15, 0, 15, 12, { ...DIS, bosluklar: [
      { t0: 1.4, t1: 2.6, y0: 1.0, y1: 2.1 },
      { t0: 7.0, t1: 8.2, y0: 1.0, y1: 2.1 },
      { t0: 9.4, t1: 10.6, y0: 1.0, y1: 2.1 },
    ] });
    [[2.2, 12, true], [4.2, 12, true], [11.0, 12, true], [13.2, 12, true],
     [6.8, 0, true], [11.6, 0, true]].forEach(([a, b, c]) => pencere(a, 1.55, b, 1.2, 1.1, c));
    [[0, 7.0], [0, 9.8], [15, 2.0], [15, 7.6], [15, 10.0]].forEach(([a, b]) => pencere(a, 1.55, b, 1.2, 1.1, false));

    /* ---------------- İÇ DUVARLAR (zemin) ---------------- */
    duvar(5.5, 0, 5.5, 12, { mal: M.duvar1, bosluklar: [{ t0: 7.5, t1: 8.5 }] });
    duvar(9.5, 0, 9.5, 12, { mal: M.duvar1, bosluklar: [{ t0: 2.0, t1: 3.0 }, { t0: 8.0, t1: 9.0 }] });
    duvar(0, 5, 5.5, 5, { mal: M.siva, bosluklar: [{ t0: 1.0, t1: 2.0 }] });
    duvar(0, 1.7, 5.5, 1.7, { mal: M.siva, bosluklar: [{ t0: 3.7, t1: 4.7 }] });
    duvar(9.5, 5, 15, 5, { mal: M.duvar1, bosluklar: [{ t0: 1.5, t1: 2.5 }] });

    /* ---------------- ANA MERDİVEN (zemin → üst) ----------------
       Merdivene yalnızca güney ucundan (z≈6.5) girilir; doğu yanı
       boydan boya küpeşteyle kapalıdır, böylece oyuncu basamakların
       altına yandan girip yüksekliğe takılmaz.                         */
    merdiven(5.62, 6.5, 7.08, 1.0, KAT.zemin, KAT.ust, 'z', 18, 7.06);
    carp(7.02, 7.18, 0, KAT.ust, 1.5, 6.05);
    // üst kat boşluk korkulukları
    const k1 = P.merdivenKorkulugu(5.0, 0, true);
    k1.rotation.y = -Math.PI / 2; k1.position.set(7.12, KAT.ust, 1.5); sahne.add(k1);
    carp(7.04, 7.20, KAT.ust, KAT.ust + 1.0, 1.5, 6.6);
    const k1b = P.merdivenKorkulugu(1.5, 0, true);
    k1b.position.set(5.6, KAT.ust, 6.55); sahne.add(k1b);
    carp(5.5, 7.15, KAT.ust, KAT.ust + 1.0, 6.48, 6.62);

    /* ---------------- ÜST DÖŞEME + ZEMİN TAVANI (merdiven boşluklu) ------ */
    const ustParcalar = [
      [0, 0, 5.6, 12], [7.1, 0, 15, 12],
      [5.6, 0, 7.1, 1.0], [5.6, 6.5, 7.1, 12],
    ];
    levhalar(ustParcalar, KAT.ust, M.doseme, .16);
    levhalar(ustParcalar, KAT.zemin + TY.zemin, M.tavan, .06);

    bolge(7.1, 0, 9.5, 12, KAT.ust);
    bolge(5.5, 6.5, 9.5, 12, KAT.ust);
    bolge(5.5, 0, 9.5, 1.5, KAT.ust);      // merdiven ağzı sahanlığa dahil
    bolge(9.5, 5, 15, 12, KAT.ust);
    bolge(9.5, 0, 15, 5, KAT.ust);
    bolge(0, 0, 5.5, 5, KAT.ust);
    bolge(0, 5, 5.5, 12, KAT.ust);

    /* ---------------- ÜST KAT DUVARLARI ---------------- */
    const U = { y0: KAT.ust, y1: KAT.ust + TY.ust };
    const UD = { ...U, kal: .3, mal: M.siva };
    duvar(0, 12, 15, 12, { ...UD, bosluklar: [
      { t0: 2.0, t1: 3.2, y0: KAT.ust + 1.0, y1: KAT.ust + 2.1 },
      { t0: 11.0, t1: 12.2, y0: KAT.ust + 1.0, y1: KAT.ust + 2.1 },
    ] });
    duvar(0, 0, 15, 0, { ...UD, bosluklar: [
      { t0: 2.0, t1: 3.2, y0: KAT.ust + 1.0, y1: KAT.ust + 2.1 },
      { t0: 11.4, t1: 12.6, y0: KAT.ust + 1.0, y1: KAT.ust + 2.1 },
    ] });
    duvar(0, 0, 0, 12, { ...UD, bosluklar: [{ t0: 8.0, t1: 9.2, y0: KAT.ust + 1.0, y1: KAT.ust + 2.1 }] });
    duvar(15, 0, 15, 12, { ...UD, bosluklar: [{ t0: 8.0, t1: 9.2, y0: KAT.ust + 1.0, y1: KAT.ust + 2.1 }] });
    [[2.6, 12, true], [11.6, 12, true], [2.6, 0, true], [12.0, 0, true]]
      .forEach(([a, b, c]) => pencere(a, KAT.ust + 1.55, b, 1.2, 1.1, c));
    pencere(0, KAT.ust + 1.55, 8.6, 1.2, 1.1, false);
    pencere(15, KAT.ust + 1.55, 8.6, 1.2, 1.1, false);

    duvar(5.5, 0, 5.5, 12, { ...U, mal: M.duvar2, bosluklar: [
      { t0: .2, t1: 1.2, y0: KAT.ust, y1: KAT.ust + 2.05 },
      { t0: 9.0, t1: 10.0, y0: KAT.ust, y1: KAT.ust + 2.05 },
    ] });
    duvar(9.5, 0, 9.5, 12, { ...U, mal: M.duvar2, bosluklar: [
      { t0: 1.6, t1: 2.6, y0: KAT.ust, y1: KAT.ust + 2.05 },
      { t0: 8.0, t1: 9.0, y0: KAT.ust, y1: KAT.ust + 2.05 },
    ] });
    duvar(0, 5, 5.5, 5, { ...U, mal: M.siva });
    duvar(9.5, 5, 15, 5, { ...U, mal: M.duvar3 });

    // üst kat tavanı — tavan arası merdiven boşluğu hariç
    levhalar([[0, 0, 11.9, 12], [13.5, 0, 15, 12], [11.9, 4.7, 13.5, 12], [11.9, 0, 13.5, .8]],
      KAT.ust + TY.ust, M.tavan, .08);

    /* ---------------- TAVAN ARASI MERDİVENİ ---------------- */
    merdiven(12.0, .9, 13.4, 4.6, KAT.ust, KAT.catik, 'z', 16, 11.98);
    levha(1.5, 4.6, 13.5, 11, KAT.catik, M.doseme, .16);
    levha(1.5, .8, 12.0, 4.6, KAT.catik, M.doseme, .16);
    bolge(1.5, 4.6, 13.5, 11, KAT.catik);
    bolge(1.5, .8, 12.0, 4.6, KAT.catik);
    const k2 = P.merdivenKorkulugu(3.8, 0, true);
    k2.rotation.y = -Math.PI / 2; k2.position.set(11.95, KAT.catik, .8); sahne.add(k2);
    carp(11.88, 12.02, KAT.catik, KAT.catik + 1.0, .8, 4.6);

    /* ---------------- TAVAN ARASI KABUĞU ---------------- */
    (function cati() {
      const yTav = KAT.catik + 3.05;                     // düz ahşap tavan
      const D = { y0: KAT.catik, y1: yTav, mal: M.ahsapKoyu, kal: .22 };
      duvar(1.5, .8, 1.5, 11, D);
      duvar(13.5, .8, 13.5, 11, D);
      duvar(1.5, .8, 13.5, .8, { ...D, bosluklar: [
        { t0: 5.0, t1: 6.2, y0: KAT.catik + .95, y1: KAT.catik + 1.85 }] });
      duvar(1.5, 11, 13.5, 11, { ...D, bosluklar: [
        { t0: 5.0, t1: 6.2, y0: KAT.catik + .95, y1: KAT.catik + 1.85 }] });
      levha(1.5, .8, 13.5, 11, yTav, M.ahsapKoyu, .14);
      pencere(7.1, KAT.catik + 1.4, .8, 1.2, .9, true);
      pencere(7.1, KAT.catik + 1.4, 11, 1.2, .9, true);

      // mertekler ve mahya kirişi
      const kiris = new THREE.Mesh(G.kutu, M.ahsapKoyu);
      kiris.scale.set(12.0, .26, .3);
      kiris.position.set(7.5, yTav - .28, 5.9);
      kiris.castShadow = true; kiris.receiveShadow = true;
      sahne.add(kiris);
      for (let i = 0; i < 9; i++) {
        const z = 1.4 + i * 1.15;
        const m = new THREE.Mesh(G.kutu, M.ahsapKoyu);
        m.scale.set(11.9, .18, .16);
        m.position.set(7.5, yTav - .42, z);       // baş hizasının üstünde
        m.castShadow = true; m.receiveShadow = true;
        sahne.add(m);
      }
    })();

    /* ---------------- BODRUM ---------------- */
    levha(0, 0, 5.5, 7, KAT.bodrum, M.tas, .25);
    levha(5.5, 2, 9, 6.5, KAT.bodrum, M.tas, .25);
    bolge(.25, .25, 5.3, 6.8, KAT.bodrum);
    bolge(5.3, 2.25, 8.8, 6.3, KAT.bodrum);

    const B = { y0: KAT.bodrum, y1: KAT.bodrum + TY.bodrum, mal: M.tas, kal: .3 };
    duvar(0, 0, 5.5, 0, B);
    duvar(0, 7, 5.5, 7, B);
    duvar(0, 0, 0, 7, B);
    duvar(5.5, 0, 5.5, 7, { ...B, bosluklar: [{ t0: 3.5, t1: 5.0, y0: KAT.bodrum, y1: KAT.bodrum + 1.95 }] });
    duvar(9, 2, 9, 6.5, B);
    duvar(5.5, 2, 9, 2, B);
    duvar(5.5, 6.5, 9, 6.5, B);
    levhalar([[0, 1.7, 5.5, 7], [3.5, 0, 5.5, 1.7], [5.5, 2, 9, 6.5]],
      KAT.bodrum + TY.bodrum, M.tas, .12);

    (function kemer() {
      for (let i = 0; i <= 10; i++) {
        const a = Math.PI * (i / 10);
        const m = new THREE.Mesh(G.kutu, M.tas);
        m.scale.set(.34, .32, .3);
        m.position.set(5.5, KAT.bodrum + 1.58 + Math.sin(a) * .44, 4.25 - Math.cos(a) * .8);
        m.rotation.x = -a + Math.PI / 2;
        m.receiveShadow = true;
        sahne.add(m);
      }
    })();

    merdiven(3.4, .2, .6, 1.6, KAT.zemin, KAT.bodrum, 'x', 14, null);

    /* ---------------- KAPILAR ---------------- */
    kapi('on', 8.2, 12, Math.PI, KAT.zemin, { acik: -.06 });
    carp(6.95, 8.25, KAT.zemin, KAT.zemin + 2.15, 11.82, 12.06);   // ev terk edilemez
    kapi('mutfak', 5.5, 8.5, Math.PI / 2, KAT.zemin, { acik: -.9 });
    kapi('salon', 9.5, 8.0, -Math.PI / 2, KAT.zemin, { acik: .85 });
    kapi('kiler', 1.0, 5, 0, KAT.zemin, { acik: 1.0 });
    kapi('oturma', 11.0, 5, 0, KAT.zemin, { acik: -1.0 });
    kapi('oturmaSofa', 9.5, 3.0, -Math.PI / 2, KAT.zemin, { acik: .9 });
    kapi('bodrum', 3.7, 1.7, 0, KAT.zemin, { kilitli: true, anahtar: 'key_bodrum' });
    kapi('cocuk', 5.5, 10.0, Math.PI / 2, KAT.ust, { acik: -1.2 });
    kapi('banyo', 5.5, 1.2, Math.PI / 2, KAT.ust, { acik: -.7 });
    kapi('anneanne', 9.5, 8.0, -Math.PI / 2, KAT.ust, { acik: .6 });
    kapi('sandikodasi', 9.5, 1.6, -Math.PI / 2, KAT.ust, { kilitli: true, anahtar: 'key_tavan' });

    /* ---------------- IŞIKLAR ---------------- */
    function ampulIsigi(x, y, z, renk, guc, mesafe) {
      const l = new THREE.PointLight(renk, guc, mesafe, 1.35);
      l.position.set(x, y, z);
      sahne.add(l);
      const g = P.ampul(); g.position.set(x, y + .48, z); sahne.add(g);
      const kay = { isik: l, ampul: g, temelGuc: guc, canli: true };
      Ev.isiklar.push(kay);
      return kay;
    }
    Ev.dinamik.sofaAmpul    = ampulIsigi(7.5, 2.42, 8.6, 0xffb45c, 3.1, 8.0);
    Ev.dinamik.mutfakAmpul  = ampulIsigi(3.2, 2.42, 8.8, 0xffc078, 2.0, 7.0);
    Ev.dinamik.oturmaAmpul  = ampulIsigi(12.3, 2.42, 2.6, 0xffa54e, 1.3, 6.0);
    Ev.dinamik.koridorAmpul = ampulIsigi(8.3, KAT.ust + 2.25, 7.0, 0xffab52, 1.1, 6.0);
    Ev.dinamik.salonAmpul   = ampulIsigi(12.4, 2.42, 9.3, 0xffb060, 1.2, 6.0);

    yerlestir();
    return Ev;
  };

  /* ═══════════════════ MOBİLYA VE EŞYA YERLEŞİMİ ══════════════════════ */

  function yerlestir() {
    const S = Ev.sahne;

    /* ---- ANTRE / SOFA ---- */
    yerHalisi(7.5, 8.8, 2.0, 4.4, KAT.zemin);
    etk(kati(koy(P.ayakkabilik(), 8.9, 0, 11.0, -Math.PI / 2)), 'ayakkabilik');

    const saat = P.duvarSaati();
    saat.position.set(5.66, 1.95, 9.6); saat.rotation.y = Math.PI / 2;
    S.add(saat); etk(saat, 'saat'); Ev.dinamik.saat = saat;

    const sehpa = P.masa(.62, .46, .72, M.ahsapKoyu);
    koy(sehpa, 6.2, 0, 10.7);
    koy(P.telefon(), 6.2, .74, 10.7);
    etk(kati(sehpa), 'telefon');
    kati(koy(P.bavul(), 8.9, 0, 9.4, .5));

    /* ---- ANNEANNENİN OTURMA ODASI ----
       Koltuk, sofaya açılan kapıdan doğrudan merdiveni görüyor.        */
    const berjer = P.berjer();
    koy(berjer, 11.6, 0, 2.5, -Math.PI / 2);
    etk(kati(berjer), 'koltuk');
    Ev.dinamik.koltuk = berjer;

    kati(koy(P.masa(.52, .52, .6, M.ahsapKoyu), 12.6, 0, 1.5));
    etk(koy(P.radyo(), 12.6, .62, 1.5, .4), 'radyo');

    kati(koy(P.raf(1.2, 1.8, .3, 3), 14.55, 0, 1.6, -Math.PI / 2));
    koy(P.gazeteYigini(), 14.45, 1.02, 1.6);

    const fr = P.cerceve(.42, .52, M.foto);
    fr.position.set(14.8, 1.72, 3.7); fr.rotation.y = -Math.PI / 2;
    S.add(fr); etk(fr, 'fotograf');

    koy(P.perde(1.3, 1.3), 14.75, 1.55, 2.0, -Math.PI / 2);
    yerHalisi(12.4, 2.8, 2.8, 2.8, KAT.zemin);

    /* ---- SALON ---- */
    etk(kati(koy(P.vitrin(), 14.6, 0, 7.0, -Math.PI / 2)), 'vitrin');
    const bayram = new THREE.Group();
    kutu(bayram, .26, .21, .03, M.ahsapKoyu, 0, .105, 0);
    kutu(bayram, .21, .16, .01, M.foto, 0, .105, .02);
    kutu(bayram, .04, .14, .02, M.ahsapKoyu, 0, .07, -.06, .5);
    koy(bayram, 14.5, 1.9, 6.35, -Math.PI / 2 + .3); etk(bayram, 'bayram_fotografi');
    etk(kati(koy(P.dikisMakinesi(), 10.4, 0, 6.1, .3)), 'dikis');
    kati(koy(P.masa(1.6, .95, .76), 12.4, 0, 9.3));
    [[-1.0, 0, Math.PI / 2], [1.0, 0, -Math.PI / 2], [0, -.78, 0], [0, .78, Math.PI]]
      .forEach(([dx, dz, r]) => kati(koy(P.sandalye(), 12.4 + dx, 0, 9.3 + dz, r)));
    yerHalisi(12.4, 9.3, 3.4, 3.4, KAT.zemin);
    koy(P.perde(1.3, 1.3), 11.0, 1.55, 11.75);
    koy(P.perde(1.3, 1.3), 13.2, 1.55, 11.75);

    /* ---- MUTFAK ----
       Tezgah batı duvarında; kiler kapısının (z=5, x 1–2) önü boş.     */
    kati(koy(P.tezgah(3.4), .52, 0, 9.0, -Math.PI / 2));
    kati(koy(P.ocak(), .55, 0, 6.6, -Math.PI / 2));
    // tezgah üstü fayans + asma dolap
    (function mutfakDuvari() {
      const f = new THREE.Mesh(kutuGeo(.06, .78, 4.4, 1.0, .3), M.karo);
      f.scale.set(.06, .78, 4.4); f.position.set(.19, 1.28, 8.7);
      f.receiveShadow = true; S.add(f);
      const d = new THREE.Group();
      kutu(d, .34, .7, 1.9, M.ahsapKoyu, 0, 0, 0);
      kutu(d, .03, .6, .88, M.ahsap, .18, 0, -.46);
      kutu(d, .03, .6, .88, M.ahsap, .18, 0, .46);
      silindir(d, .018, .018, .07, M.pirinc, .21, 0, -.06);
      silindir(d, .018, .018, .07, M.pirinc, .21, 0, .06);
      koy(d, .36, 2.02, 9.4);
    })();
    kati(koy(P.masa(1.3, .8, .76, M.ahsapKoyu), 3.2, 0, 8.8));
    kati(koy(P.sandalye(), 2.25, 0, 8.8, Math.PI / 2));
    kati(koy(P.sandalye(), 4.15, 0, 8.8, -Math.PI / 2));

    const tepsi = new THREE.Group();
    kutu(tepsi, .36, .02, .26, M.pirinc, 0, .01, 0);
    silindir(tepsi, .036, .046, .1, M.cam, -.085, .06, 0);
    silindir(tepsi, .036, .046, .1, M.cam, .085, .06, 0);
    kutu(tepsi, .07, .006, .07, M.toz, -.085, .001, .09);
    kutu(tepsi, .07, .006, .07, M.toz, .085, .001, .09);
    koy(tepsi, 3.2, .78, 8.8); etk(tepsi, 'fincanlar');

    kati(koy(P.raf(2.0, 1.9, .3, 4), 5.2, 0, 10.4, -Math.PI / 2));
    const kavGrup = new THREE.Group();
    for (let s = 0; s < 4; s++) for (let i = 0; i < 8; i++) {
      const k = P.kavanoz(.15 + (i % 3) * .03, .055);
      k.position.set(-.84 + i * .24, .06 + s * .38, 0);
      kavGrup.add(k);
    }
    koy(kavGrup, 5.12, .04, 10.4, -Math.PI / 2); etk(kavGrup, 'kavanozlar');

    const perv = new THREE.Group();
    kutu(perv, .12, 2.1, .22, M.ahsap, 0, 1.05, 0);
    for (let i = 0; i < 5; i++) kutu(perv, .125, .01, .012, M.siyah, 0, .8 + i * .062, .112);
    for (let i = 0; i < 3; i++) kutu(perv, .125, .01, .012, M.siyah, 0, 1.19 + i * .07, .112);
    koy(perv, 5.4, 0, 7.42); etk(perv, 'cizelge');
    const tkv = new THREE.Group();
    kutu(tkv, .28, .40, .015, M.kagit, 0, 0, 0);
    kutu(tkv, .28, .09, .02, M.ahsapKoyu, 0, .17, .005);
    silindir(tkv, .008, .008, .05, M.metal, 0, .23, 0);
    koy(tkv, 5.35, 1.62, 6.6, -Math.PI / 2); etk(tkv, 'takvim');

    const cek = new THREE.Group();
    kutu(cek, .17, .18, .62, M.ahsap, 0, 0, 0);
    kutu(cek, .02, .05, .5, M.kagit, .09, .03, 0);
    silindir(cek, .022, .022, .09, M.pirinc, .11, 0, 0);
    koy(cek, .78, .62, 7.9); etk(cek, 'cekmece');

    /* ---- KİLER ---- */
    kati(koy(P.raf(1.6, 1.9, .34, 4), 4.9, 0, 3.6, -Math.PI / 2));
    etk(kati(koy(P.koli(.62, .44, .48), 1.2, 0, 2.6, .3)), 'kutu_kiyafet');
    kati(koy(P.koli(.5, .34, .4), 2.1, 0, 2.35, -.4));
    koy(P.koli(.42, .3, .34), 1.5, .44, 2.7, .8);

    const not = new THREE.Mesh(G.kutu, M.kagit);
    not.scale.set(.17, .23, .006); not.position.set(4.2, 1.55, 1.79);
    S.add(not); etk(not, 'not_orhan');

    const kilit = new THREE.Group();
    kutu(kilit, .13, .16, .05, M.metal, 0, 0, 0);
    silindir(kilit, .045, .045, .1, M.metal, 0, .11, 0);
    kutu(kilit, .34, .09, .04, M.metal, .12, 0, -.02);
    kilit.position.set(4.42, 1.1, 1.79); S.add(kilit); etk(kilit, 'bodrum_kapisi');

    /* ---- ÜST KORİDOR ---- */
    Ev.dinamik.cerceveler = [];
    [1, 1, 1, 1, 0, 1].forEach((dolu, i) => {
      const c = dolu ? P.cerceve(.3, .38, M.foto) : P.bosCerceve(.3, .38);
      c.position.set(9.4, KAT.ust + 1.78, 2.4 + i * 1.5);
      c.rotation.y = -Math.PI / 2;
      S.add(c);
      Ev.dinamik.cerceveler.push(c);
      etk(c, 'cerceveler');
    });
    kati(koy(P.masa(.7, .36, .8, M.ahsapKoyu), 8.0, KAT.ust, 11.4));

    /* ---- ÇOCUK ODASI ---- */
    etk(kati(koy(P.karyola(), 1.3, KAT.ust, 10.2)), 'yatak');
    const tahta = new THREE.Mesh(G.kutu, M.doseme);
    tahta.scale.set(.26, .045, 1.0);
    tahta.position.set(2.15, KAT.ust + .028, 10.3);
    tahta.receiveShadow = true; S.add(tahta);
    etk(tahta, 'gizli_bolme');
    Ev.dinamik.gizliTahta = tahta;
    kati(koy(P.gardirop(1.3, 2.0, .58), 4.65, KAT.ust, 6.8, -Math.PI / 2));
    const kutuAyi = new THREE.Group();
    kutu(kutuAyi, .44, .2, .32, M.karton, 0, .1, 0);
    kutu(kutuAyi, .46, .025, .05, M.kagit, 0, .2, 0);
    kutu(kutuAyi, .05, .025, .34, M.kagit, 0, .2, 0);
    koy(kutuAyi, 4.65, KAT.ust + 2.0, 6.8); etk(kutuAyi, 'pamuk');

    kati(koy(P.masa(.9, .56, .62, M.ahsapKoyu), 1.1, KAT.ust, 6.6));
    const defter = new THREE.Mesh(G.kutu, M.kagit);
    defter.scale.set(.32, .035, .42);
    defter.position.set(1.1, KAT.ust + .65, 6.6); defter.rotation.y = .2;
    S.add(defter); etk(defter, 'resim_defteri');
    kati(koy(P.sandalye(), 1.1, KAT.ust, 7.4, Math.PI));

    const kagitParca = new THREE.Mesh(G.kutu, M.duvar3);
    kagitParca.scale.set(.38, .52, .05);
    kagitParca.position.set(.7, KAT.ust + .6, 5.24); kagitParca.rotation.z = .13;
    S.add(kagitParca); etk(kagitParca, 'duvar_kagidi');

    kati(koy(P.besik(), 4.4, KAT.ust, 10.7, .25));
    yerHalisi(2.7, 8.8, 2.0, 2.0, KAT.ust);

    /* ---- BANYO ---- */
    levha(0, 0, 5.5, 5, KAT.ust + .006, M.karo, .01);
    kati(koy(P.lavabo(), 1.1, KAT.ust, .9));
    const ayn = P.aynaliDolap();
    ayn.position.set(1.1, KAT.ust + 1.5, .42);
    S.add(ayn); etk(ayn, 'ayna');
    const ecza = new THREE.Group();
    kutu(ecza, .34, .40, .16, M.ahsap, 0, 0, 0);
    kutu(ecza, .30, .03, .14, M.toz, 0, .06, .01);
    kutu(ecza, .07, .11, .05, M.kagit, -.08, .13, .02);
    kutu(ecza, .07, .11, .05, M.kagit, .02, .13, .02);
    silindir(ecza, .03, .03, .1, M.cam, .11, .13, .02);
    koy(ecza, 2.3, KAT.ust + 1.45, .40); etk(ecza, 'ecza_dolabi');
    const kuvet = new THREE.Group();
    kutu(kuvet, 1.7, .56, .8, M.toz, 0, .28, 0);
    kutu(kuvet, 1.54, .42, .64, M.siyah, 0, .38, 0);
    kati(koy(kuvet, 3.5, KAT.ust, 1.2));

    /* ---- ANNEANNENİN ODASI ---- */
    const kar2 = P.karyola(); kar2.scale.set(1.28, 1, 1.05);
    kati(koy(kar2, 11.4, KAT.ust, 10.2));
    kati(koy(P.tuvaletMasasi(), 13.7, KAT.ust, 6.1, Math.PI));
    const muc = new THREE.Group();
    kutu(muc, .28, .13, .19, M.ahsapKoyu, 0, .065, 0);
    kutu(muc, .22, .018, .14, M.pirinc, 0, .135, 0);
    koy(muc, 13.7, KAT.ust + .76, 6.3); etk(muc, 'mucevher');

    kati(koy(P.komodin(), 12.7, KAT.ust, 11.2));
    const deste = new THREE.Group();
    for (let i = 0; i < 10; i++)
      kutu(deste, .23, .013, .14, M.kagit, (i % 3) * .007, .007 + i * .014, (i % 2) * .007, i * .06);
    koy(deste, 12.7, KAT.ust + .63, 11.2); etk(deste, 'mektuplar_iade');

    kati(koy(P.gardirop(1.6, 2.1, .62), 14.55, KAT.ust, 9.0, -Math.PI / 2));
    const montG = new THREE.Group();
    kutu(montG, .36, .46, .15, M.kumasKirmizi, 0, 0, 0);
    kutu(montG, .13, .3, .13, M.kumasKirmizi, -.21, -.05, 0);
    kutu(montG, .13, .3, .13, M.kumasKirmizi, .21, -.05, 0);
    silindir(montG, .016, .016, .18, M.metal, 0, .3, 0);
    koy(montG, 14.15, KAT.ust + 1.32, 9.0, -Math.PI / 2); etk(montG, 'mont');
    yerHalisi(12.3, 8.4, 3.0, 3.0, KAT.ust);

    /* ---- SANDIK ODASI ---- */
    kati(koy(P.raf(1.2, 1.7, .3, 3), 10.3, KAT.ust, 4.5, Math.PI));
    kati(koy(P.koli(.5, .36, .4), 10.5, KAT.ust, 1.2, .4));
    kati(koy(P.bavul(), 10.4, KAT.ust, 3.2, -.3));
    const hesap = new THREE.Mesh(G.kutu, M.kagit);
    hesap.scale.set(.22, .035, .3);
    hesap.position.set(10.3, KAT.ust + 1.18, 4.45); hesap.rotation.y = .25;
    S.add(hesap); etk(hesap, 'hesap_defteri');

    /* ---- TAVAN ARASI ---- */
    const albumG = new THREE.Group();
    kutu(albumG, .52, .32, .44, M.karton, 0, .16, 0);
    for (let i = 0; i < 3; i++) kutu(albumG, .32, .055, .36, M.ahsapKoyu, 0, .35 + i * .06, 0, i * .12);
    kati(koy(albumG, 4.4, KAT.catik, 6.4, .3)); etk(albumG, 'album');

    koy(P.gazeteYigini(), 6.4, KAT.catik, 7.4);
    const gaz = new THREE.Mesh(G.kutu, M.kagit);
    gaz.scale.set(.36, .016, .28);
    gaz.position.set(6.4, KAT.catik + .1, 7.4); gaz.rotation.y = -.4;
    S.add(gaz); etk(gaz, 'gazete');

    const evrakG = new THREE.Group();
    kutu(evrakG, .44, .24, .34, M.metal, 0, .12, 0);
    kutu(evrakG, .46, .035, .36, M.metal, 0, .25, 0);
    koy(evrakG, 8.8, KAT.catik, 5.6, -.5); etk(evrakG, 'evraklar');
    const asi = new THREE.Mesh(G.kutu, M.kagit);
    asi.scale.set(.16, .01, .22);
    asi.position.set(9.35, KAT.catik + .06, 6.1); asi.rotation.y = .8;
    S.add(asi); etk(asi, 'asi_karti');

    kati(koy(P.bavul(), 3.0, KAT.catik, 8.6, .7));
    kati(koy(P.koli(.6, .5, .5), 9.8, KAT.catik, 8.2, .2));
    kati(koy(P.koli(.5, .4, .42), 2.4, KAT.catik, 5.2, -.3));
    kati(koy(P.koli(.45, .35, .38), 10.4, KAT.catik, 6.8, .9));
    kati(koy(P.sandalye(), 5.0, KAT.catik, 9.4, 2.2));
    kati(koy(P.besik(), 2.6, KAT.catik, 9.8, 1.1));

    /* ---- BODRUM ---- */
    etk(kati(koy(P.sandik(), 1.8, KAT.bodrum, 5.2, .2)), 'sandik');
    const parca = new THREE.Group();
    for (let i = 0; i < 4; i++)
      kutu(parca, .06, 1.05, .5, M.ahsapKoyu, i * .09, .55, 0, .07 + i * .03);
    kutu(parca, .34, .05, .5, M.ahsapKoyu, .15, .04, .1, .3);
    kutu(parca, .12, .1, .09, M.kagit, .32, .06, -.14);
    koy(parca, .55, KAT.bodrum, 1.5, .35); etk(parca, 'sokulmus_karyola');
    kati(koy(P.raf(1.4, 1.7, .32, 3), .5, KAT.bodrum, 3.0, Math.PI / 2));
    kati(koy(P.koli(.5, .4, .42), 3.4, KAT.bodrum, 6.2, .5));
    kati(koy(P.koli(.44, .34, .36), 4.4, KAT.bodrum, 5.6, -.2));

    etk(koy(P.sarnicKapagi(), 7.2, KAT.bodrum, 4.3), 'sarnic');
  }

  /* ══════════════ ZEMİN YÜKSEKLİĞİ (kat mantığı) ══════════════════════ */

  Ev.zeminYuksekligi = function (x, z, mevcutY) {
    let adaylar = null;
    for (let i = 0; i < Ev.zeminler.length; i++) {
      const r = Ev.zeminler[i];
      if (x >= r.x0 && x <= r.x1 && z >= r.z0 && z <= r.z1) (adaylar || (adaylar = [])).push(r.y);
    }
    for (let i = 0; i < Ev.rampalar.length; i++) {
      const r = Ev.rampalar[i];
      if (x >= r.x0 && x <= r.x1 && z >= r.z0 && z <= r.z1) {
        let t = ((r.eksen === 'x' ? x : z) - r.bas) / (r.son - r.bas);
        t = t < 0 ? 0 : t > 1 ? 1 : t;
        (adaylar || (adaylar = [])).push(r.y0 + (r.y1 - r.y0) * t);
      }
    }
    if (!adaylar) return null;
    const tavan = mevcutY + .75;
    let en = -Infinity;
    for (let i = 0; i < adaylar.length; i++)
      if (adaylar[i] <= tavan && adaylar[i] > en) en = adaylar[i];
    if (en > -Infinity) return en;
    let alt = Infinity;
    for (let i = 0; i < adaylar.length; i++) if (adaylar[i] < alt) alt = adaylar[i];
    return alt;
  };

})();
