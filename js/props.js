/* =========================================================================
   Malzemeler ve mobilya üreticileri.
   Her üretici, orijine (0,0,0) oturan bir THREE.Group döndürür.
   ========================================================================= */

const M = {};          // malzeme kütüphanesi
const G = {};          // geometri önbelleği

function malzemeleriKur() {
  const bump = Doku.bumpGurultu(4);

  M.doseme      = new THREE.MeshStandardMaterial({ map: Doku.ahsapDoseme(),      roughness: .86, bumpMap: bump, bumpScale: .02 });
  M.dosemeKoyu  = new THREE.MeshStandardMaterial({ map: Doku.ahsapDoseme(true),  roughness: .92, bumpMap: bump, bumpScale: .02 });
  M.duvar1      = new THREE.MeshStandardMaterial({ map: Doku.duvarKagidi(0),     roughness: .95 });
  M.duvar2      = new THREE.MeshStandardMaterial({ map: Doku.duvarKagidi(1),     roughness: .95 });
  M.duvar3      = new THREE.MeshStandardMaterial({ map: Doku.duvarKagidi(2),     roughness: .95 });
  M.siva        = new THREE.MeshStandardMaterial({ map: Doku.siva(),             roughness: .97 });
  M.sivaKoyu    = new THREE.MeshStandardMaterial({ map: Doku.siva(true),         roughness: .98 });
  M.ahsap       = new THREE.MeshStandardMaterial({ map: Doku.ahsap(1),           roughness: .78 });
  M.ahsapKoyu   = new THREE.MeshStandardMaterial({ map: Doku.ahsap(1.7),         roughness: .82 });
  M.tas         = new THREE.MeshStandardMaterial({ map: Doku.tas(),              roughness: .99, bumpMap: bump, bumpScale: .06 });
  M.karo        = new THREE.MeshStandardMaterial({ map: Doku.karo(),             roughness: .55 });
  M.hali        = new THREE.MeshStandardMaterial({ map: Doku.hali(),             roughness: .95 });
  M.tavan       = new THREE.MeshStandardMaterial({ map: Doku.tavan(),            roughness: .96 });
  M.kagit       = new THREE.MeshStandardMaterial({ map: Doku.kagit(),            roughness: .9 });
  M.kumasYesil  = new THREE.MeshStandardMaterial({ map: Doku.kumas('#2c3f33'),   roughness: .92 });
  M.kumasKirmizi= new THREE.MeshStandardMaterial({ map: Doku.kumas('#5a221c'),   roughness: .92 });
  M.kumasBeyaz  = new THREE.MeshStandardMaterial({ map: Doku.kumas('#a89f8c'),   roughness: .9 });
  M.metal       = new THREE.MeshStandardMaterial({ color: 0x5d5f61, roughness: .45, metalness: .8 });
  M.pirinc      = new THREE.MeshStandardMaterial({ color: 0xb08d4a, roughness: .35, metalness: .85 });
  M.cam         = new THREE.MeshStandardMaterial({ color: 0x8fa0a6, roughness: .08, metalness: .1, transparent: true, opacity: .22 });
  M.ayna        = new THREE.MeshStandardMaterial({ color: 0x2a2f31, roughness: .12, metalness: .9 });
  M.siyah       = new THREE.MeshStandardMaterial({ color: 0x14120f, roughness: .9 });
  M.toz         = new THREE.MeshStandardMaterial({ color: 0x9a9280, roughness: 1 });
  M.karton      = new THREE.MeshStandardMaterial({ color: 0x8a6f4d, roughness: .95 });
  M.foto        = new THREE.MeshStandardMaterial({ map: Doku.eskiFotograf(),     roughness: .8 });
  M.fotoKesik   = new THREE.MeshStandardMaterial({ map: Doku.eskiFotograf(true), roughness: .8 });
  M.gece        = new THREE.MeshBasicMaterial({ color: 0x1b2536 });   // pencere ardı

  /* Yüzey dokularının metre cinsinden karo boyu (UV ölçekleme için) */
  const olcekler = [
    [M.doseme, 1.7], [M.dosemeKoyu, 1.7],
    [M.duvar1, 1.25], [M.duvar2, 1.25], [M.duvar3, 1.25],
    [M.siva, 2.6], [M.sivaKoyu, 2.6],
    [M.tas, 2.1], [M.karo, 1.0], [M.tavan, 1.9], [M.ahsapKoyu, 1.4],
  ];
  olcekler.forEach(([m, o]) => { m.userData.olcek = o; });

  G.kutu = new THREE.BoxGeometry(1, 1, 1);
  G.sil  = new THREE.CylinderGeometry(1, 1, 1, 14);
  G.kur  = new THREE.SphereGeometry(1, 12, 10);
}

/* Ölçeğe göre UV'leri düzeltilmiş birim kutu geometrisi (önbellekli) */
const geoOnbellek = new Map();
function kutuGeo(en, yuk, boy, olcek) {
  const a = Math.round(en * 20) / 20, b = Math.round(yuk * 20) / 20, c = Math.round(boy * 20) / 20;
  const anahtar = a + ',' + b + ',' + c + ',' + olcek;
  let g = geoOnbellek.get(anahtar);
  if (g) return g;
  g = new THREE.BoxGeometry(1, 1, 1);
  const uv = g.attributes.uv;
  const yuzler = [[c, b], [c, b], [a, c], [a, c], [a, b], [a, b]];  // +X -X +Y -Y +Z -Z
  for (let f = 0; f < 6; f++) {
    const du = yuzler[f][0] / olcek, dv = yuzler[f][1] / olcek;
    for (let i = 0; i < 4; i++) {
      const k = f * 4 + i;
      uv.setXY(k, uv.getX(k) * du, uv.getY(k) * dv);
    }
  }
  uv.needsUpdate = true;
  geoOnbellek.set(anahtar, g);
  return g;
}

/* kısa yardımcılar */
function kutu(g, en, yuk, boy, mal, x = 0, y = 0, z = 0, dondur = 0) {
  const m = new THREE.Mesh(G.kutu, mal);
  m.scale.set(en, yuk, boy);
  m.position.set(x, y, z);
  if (dondur) m.rotation.y = dondur;
  m.castShadow = true; m.receiveShadow = true;
  g.add(m);
  return m;
}
function silindir(g, r1, r2, h, mal, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(G.sil, mal);
  m.scale.set(r1, h, r2);
  m.position.set(x, y, z);
  m.castShadow = true; m.receiveShadow = true;
  g.add(m);
  return m;
}

/* ═══════════════════════════ MOBİLYALAR ════════════════════════════════ */
const P = {

  masa(en = 1.2, boy = .8, yuk = .76, mal = M.ahsap) {
    const g = new THREE.Group();
    kutu(g, en, .05, boy, mal, 0, yuk, 0);
    const ax = en / 2 - .08, az = boy / 2 - .08;
    [[-ax, -az], [ax, -az], [-ax, az], [ax, az]].forEach(([x, z]) =>
      kutu(g, .07, yuk, .07, mal, x, yuk / 2, z));
    return g;
  },

  sandalye(mal = M.ahsapKoyu) {
    const g = new THREE.Group();
    kutu(g, .44, .04, .44, mal, 0, .45, 0);
    [[-.18, -.18], [.18, -.18], [-.18, .18], [.18, .18]].forEach(([x, z]) =>
      kutu(g, .045, .45, .045, mal, x, .225, z));
    kutu(g, .44, .5, .05, mal, 0, .70, -.20);
    return g;
  },

  berjer() {
    const g = new THREE.Group();
    kutu(g, .82, .38, .80, M.kumasYesil, 0, .30, 0);       // oturak
    kutu(g, .82, .78, .16, M.kumasYesil, 0, .62, -.34);    // sırt
    kutu(g, .14, .46, .80, M.kumasYesil, -.36, .50, 0);    // kolçak
    kutu(g, .14, .46, .80, M.kumasYesil, .36, .50, 0);
    [[-.34, -.32], [.34, -.32], [-.34, .32], [.34, .32]].forEach(([x, z]) =>
      kutu(g, .07, .14, .07, M.ahsapKoyu, x, .07, z));
    return g;
  },

  gardirop(en = 1.2, yuk = 2.0, boy = .58) {
    const g = new THREE.Group();
    kutu(g, en, yuk, boy, M.ahsapKoyu, 0, yuk / 2, 0);
    kutu(g, en * .47, yuk * .88, .03, M.ahsap, -en * .24, yuk / 2, boy / 2 + .01);
    kutu(g, en * .47, yuk * .88, .03, M.ahsap, en * .24, yuk / 2, boy / 2 + .01);
    silindir(g, .02, .02, .1, M.pirinc, -.03, yuk * .52, boy / 2 + .04);
    silindir(g, .02, .02, .1, M.pirinc, .03, yuk * .52, boy / 2 + .04);
    return g;
  },

  komodin() {
    const g = new THREE.Group();
    kutu(g, .5, .62, .42, M.ahsapKoyu, 0, .31, 0);
    kutu(g, .44, .18, .02, M.ahsap, 0, .44, .215);
    kutu(g, .44, .18, .02, M.ahsap, 0, .22, .215);
    silindir(g, .018, .018, .06, M.pirinc, 0, .44, .25);
    silindir(g, .018, .018, .06, M.pirinc, 0, .22, .25);
    return g;
  },

  raf(en = 1.0, yuk = 1.9, boy = .32, kat = 4) {
    const g = new THREE.Group();
    kutu(g, .05, yuk, boy, M.ahsapKoyu, -en / 2, yuk / 2, 0);
    kutu(g, .05, yuk, boy, M.ahsapKoyu, en / 2, yuk / 2, 0);
    kutu(g, en, .04, boy, M.ahsapKoyu, 0, yuk, 0);
    for (let i = 0; i <= kat; i++)
      kutu(g, en, .035, boy, M.ahsapKoyu, 0, (yuk / (kat + 1)) * i + .05, 0);
    return g;
  },

  karyola() {
    const g = new THREE.Group();
    kutu(g, .95, .1, 1.95, M.ahsapKoyu, 0, .32, 0);
    kutu(g, .92, .18, 1.9, M.kumasBeyaz, 0, .46, 0);          // yatak
    kutu(g, .5, .1, .32, M.kumasBeyaz, 0, .58, -.72);         // yastık
    // demir baş ve ayak
    for (const [z, h] of [[-.98, 1.0], [.98, .62]]) {
      kutu(g, .06, h, .06, M.metal, -.46, h / 2, z);
      kutu(g, .06, h, .06, M.metal, .46, h / 2, z);
      kutu(g, .98, .05, .05, M.metal, 0, h, z);
      for (let i = -3; i <= 3; i++)
        kutu(g, .025, h * .6, .025, M.metal, i * .13, h * .42, z);
    }
    return g;
  },

  ocak() {
    const g = new THREE.Group();
    kutu(g, .62, .85, .58, M.metal, 0, .425, 0);
    kutu(g, .64, .04, .60, M.siyah, 0, .87, 0);
    for (const [x, z] of [[-.15, -.14], [.15, -.14], [-.15, .14], [.15, .14]])
      silindir(g, .09, .09, .02, M.siyah, x, .90, z);
    kutu(g, .5, .3, .02, M.siyah, 0, .45, .30);
    return g;
  },

  tezgah(en = 2.2) {
    const g = new THREE.Group();
    kutu(g, en, .82, .6, M.ahsapKoyu, 0, .41, 0);
    kutu(g, en + .04, .06, .64, M.karo, 0, .85, 0);
    // lavabo
    kutu(g, .5, .04, .42, M.metal, -en / 2 + .55, .87, 0);
    kutu(g, .44, .18, .36, M.siyah, -en / 2 + .55, .78, 0);
    silindir(g, .022, .022, .3, M.metal, -en / 2 + .55, 1.0, -.18);
    kutu(g, .1, .03, .03, M.metal, -en / 2 + .55, 1.14, -.12);
    // kapaklar
    for (let i = 0; i < Math.floor(en / .55); i++)
      kutu(g, .5, .6, .02, M.ahsap, -en / 2 + .3 + i * .55, .45, .31);
    return g;
  },

  vitrin() {
    const g = new THREE.Group();
    kutu(g, 1.1, 1.9, .42, M.ahsapKoyu, 0, .95, 0);
    kutu(g, .96, 1.2, .02, M.cam, 0, 1.25, .215);
    for (let i = 0; i < 3; i++)
      kutu(g, .96, .025, .36, M.ahsap, 0, .78 + i * .38, 0);
    // porselen
    for (let i = 0; i < 8; i++)
      silindir(g, .055, .055, .02, M.toz, -.38 + (i % 4) * .25, 1.19 + Math.floor(i / 4) * .38, 0);
    return g;
  },

  dikisMakinesi() {
    const g = new THREE.Group();
    kutu(g, .9, .05, .45, M.ahsapKoyu, 0, .76, 0);
    kutu(g, .05, .74, .40, M.metal, -.38, .38, 0);
    kutu(g, .05, .74, .40, M.metal, .38, .38, 0);
    kutu(g, .5, .04, .30, M.metal, 0, .12, 0);              // pedal
    kutu(g, .42, .13, .16, M.siyah, -.1, .85, 0);           // gövde
    kutu(g, .12, .22, .14, M.siyah, .12, .90, 0);
    silindir(g, .12, .12, .02, M.metal, .34, .85, 0);
    return g;
  },

  radyo() {
    const g = new THREE.Group();
    kutu(g, .42, .26, .2, M.ahsapKoyu, 0, .13, 0);
    kutu(g, .2, .14, .02, M.siyah, -.08, .15, .105);
    kutu(g, .14, .05, .02, M.toz, .1, .17, .105);
    silindir(g, .025, .025, .02, M.pirinc, .1, .07, .11);
    return g;
  },

  duvarSaati() {
    const g = new THREE.Group();
    kutu(g, .3, .48, .14, M.ahsapKoyu, 0, 0, 0);
    silindir(g, .12, .12, .02, M.toz, 0, .12, .075).rotation.x = Math.PI / 2;
    // akrep/yelkovan → 11:01
    const ak = kutu(g, .012, .07, .008, M.siyah, 0, .12, .09);
    ak.rotation.z = -Math.PI * 2 * (11 / 12) - Math.PI;
    ak.position.y = .12 + Math.cos(Math.PI * 2 * (11 / 12)) * .035;
    ak.position.x = Math.sin(Math.PI * 2 * (11 / 12)) * .035;
    const ye = kutu(g, .01, .1, .008, M.siyah, 0, .12, .09);
    ye.rotation.z = -Math.PI * 2 * (1 / 60) - Math.PI;
    ye.position.y = .12 + Math.cos(Math.PI * 2 / 60) * .05;
    ye.position.x = Math.sin(Math.PI * 2 / 60) * .05;
    kutu(g, .16, .2, .02, M.cam, 0, -.12, .075);            // sarkaç camı
    silindir(g, .05, .05, .015, M.pirinc, 0, -.16, .04).rotation.x = Math.PI / 2;
    return g;
  },

  cerceve(en = .34, yuk = .42, mal = M.foto) {
    const g = new THREE.Group();
    kutu(g, en, yuk, .04, M.ahsapKoyu, 0, 0, 0);
    kutu(g, en - .06, yuk - .06, .01, mal, 0, 0, .026);
    return g;
  },

  bosCerceve(en = .34, yuk = .42) {
    const g = new THREE.Group();
    kutu(g, en, yuk, .04, M.ahsapKoyu, 0, 0, 0);
    kutu(g, en - .06, yuk - .06, .008, M.sivaKoyu, 0, 0, .022);
    return g;
  },

  koli(en = .5, yuk = .38, boy = .4) {
    const g = new THREE.Group();
    kutu(g, en, yuk, boy, M.karton, 0, yuk / 2, 0);
    kutu(g, en * .5, .01, boy + .01, M.kagit, 0, yuk + .005, 0);
    return g;
  },

  sandik() {
    const g = new THREE.Group();
    kutu(g, 1.1, .55, .62, M.ahsapKoyu, 0, .275, 0);
    kutu(g, 1.14, .08, .66, M.metal, 0, .58, 0);
    for (const x of [-.42, 0, .42]) kutu(g, .05, .58, .66, M.metal, x, .29, 0);
    kutu(g, .1, .1, .04, M.pirinc, 0, .3, .33);
    return g;
  },

  ayakkabilik() {
    const g = new THREE.Group();
    kutu(g, 1.0, .04, .32, M.ahsapKoyu, 0, .12, 0);
    kutu(g, 1.0, .04, .32, M.ahsapKoyu, 0, .42, 0);
    kutu(g, 1.0, .04, .32, M.ahsapKoyu, 0, .72, 0);
    kutu(g, .04, .76, .32, M.ahsapKoyu, -.5, .38, 0);
    kutu(g, .04, .76, .32, M.ahsapKoyu, .5, .38, 0);
    // ayakkabılar
    const yerler = [[-.36, .16], [-.22, .16], [.1, .16], [.24, .16], [-.3, .46], [.2, .46], [.34, .46], [-.1, .76]];
    yerler.forEach(([x, y], i) => kutu(g, .1, .07, .24, i === 7 ? M.siyah : M.ahsapKoyu, x, y, 0));
    kutu(g, .07, .05, .16, M.siyah, .36, .76, 0);           // 26 numara, tek
    return g;
  },

  tuvaletMasasi() {
    const g = new THREE.Group();
    kutu(g, 1.1, .74, .45, M.ahsapKoyu, 0, .37, 0);
    kutu(g, .9, .9, .03, M.ayna, 0, 1.25, -.18);
    kutu(g, .96, .96, .03, M.ahsapKoyu, 0, 1.25, -.21);
    kutu(g, .5, .18, .02, M.ahsap, -.26, .5, .23);
    kutu(g, .5, .18, .02, M.ahsap, .26, .5, .23);
    return g;
  },

  aynaliDolap() {
    const g = new THREE.Group();
    kutu(g, .62, .7, .18, M.ahsap, 0, 0, 0);
    kutu(g, .56, .64, .02, M.ayna, 0, 0, .1);
    return g;
  },

  lavabo() {
    const g = new THREE.Group();
    silindir(g, .16, .2, .5, M.toz, 0, .25, 0);
    kutu(g, .5, .16, .38, M.toz, 0, .58, 0);
    kutu(g, .4, .08, .28, M.siyah, 0, .62, 0);
    silindir(g, .02, .02, .22, M.metal, 0, .74, -.12);
    return g;
  },

  kavanoz(h = .18, r = .06) {
    const g = new THREE.Group();
    silindir(g, r, r, h, M.cam, 0, h / 2, 0);
    silindir(g, r * .95, r * .95, h * .7, new THREE.MeshStandardMaterial({ color: 0x4b4326, roughness: .8 }), 0, h * .36, 0);
    silindir(g, r * .8, r * .8, .02, M.metal, 0, h + .01, 0);
    return g;
  },

  ayi() {
    const g = new THREE.Group();
    const k = new THREE.MeshStandardMaterial({ color: 0x8a7250, roughness: 1 });
    silindir(g, .07, .07, .14, k, 0, .09, 0);
    const kafa = new THREE.Mesh(G.kur, k); kafa.scale.setScalar(.06); kafa.position.set(0, .2, 0);
    kafa.castShadow = true; g.add(kafa);
    for (const x of [-.05, .05]) {
      const kl = new THREE.Mesh(G.kur, k); kl.scale.setScalar(.022); kl.position.set(x, .245, 0); g.add(kl);
    }
    for (const x of [-.09, .09]) silindir(g, .022, .022, .1, k, x, .1, 0);
    for (const x of [-.04, .04]) silindir(g, .025, .025, .08, k, x, .025, .02);
    return g;
  },

  telefon() {
    const g = new THREE.Group();
    kutu(g, .24, .1, .2, M.siyah, 0, .05, 0);
    silindir(g, .07, .07, .015, M.toz, 0, .105, .02).rotation.x = 0;
    kutu(g, .22, .05, .05, M.siyah, 0, .13, -.06);
    return g;
  },

  gazeteYigini() {
    const g = new THREE.Group();
    for (let i = 0; i < 7; i++)
      kutu(g, .3, .012, .22, M.kagit, (Math.sin(i * 3) * .02), .006 + i * .013, (Math.cos(i * 5) * .02), i * .12);
    return g;
  },

  perde(en = 1.2, yuk = 1.6) {
    const g = new THREE.Group();
    const mal = new THREE.MeshStandardMaterial({ color: 0x50493c, roughness: 1, side: THREE.DoubleSide });
    kutu(g, en * .45, yuk, .04, mal, -en * .27, 0, 0);
    kutu(g, en * .45, yuk, .04, mal, en * .27, 0, 0);
    silindir(g, .015, .015, en + .2, M.metal, 0, yuk / 2 + .04, 0).rotation.z = Math.PI / 2;
    return g;
  },

  ampul() {
    const g = new THREE.Group();
    silindir(g, .004, .004, .5, M.siyah, 0, .25, 0);
    const b = new THREE.Mesh(G.kur, new THREE.MeshStandardMaterial({
      color: 0xffe0a8, emissive: 0xffcf88, emissiveIntensity: 1.2, roughness: .4,
    }));
    b.scale.setScalar(.045); b.position.y = -.02; g.add(b);
    g.userData.ampulMesh = b;
    return g;
  },

  kapiKanadi(en = 0.95, yuk = 2.05) {
    const g = new THREE.Group();
    kutu(g, en, yuk, .05, M.ahsapKoyu, en / 2, yuk / 2, 0);
    kutu(g, en * .7, yuk * .35, .02, M.ahsap, en / 2, yuk * .28, .03);
    kutu(g, en * .7, yuk * .35, .02, M.ahsap, en / 2, yuk * .68, .03);
    silindir(g, .03, .03, .06, M.pirinc, en - .1, yuk * .45, .06).rotation.x = Math.PI / 2;
    return g;
  },

  merdivenKorkulugu(uzunluk, yukselme, yatay = false) {
    const g = new THREE.Group();
    const n = Math.max(3, Math.round(uzunluk / .3));
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const y = yatay ? 0 : yukselme * t;
      silindir(g, .022, .022, .9, M.ahsapKoyu, t * uzunluk, y + .45, 0);
    }
    const el = kutu(g, uzunluk * 1.02, .06, .06, M.ahsapKoyu, uzunluk / 2, .92 + yukselme / 2, 0);
    if (!yatay) el.rotation.z = Math.atan2(yukselme, uzunluk);
    return g;
  },

  sarnicKapagi() {
    const g = new THREE.Group();
    silindir(g, .62, .62, .12, M.tas, 0, .06, 0);
    silindir(g, .5, .5, .06, new THREE.MeshStandardMaterial({ color: 0x38352f, roughness: 1 }), 0, .13, 0);
    for (let i = 0; i < 12; i++) {
      const a = i / 12 * Math.PI * 2;
      kutu(g, .18, .14, .16, M.tas, Math.cos(a) * .68, .07, Math.sin(a) * .68, -a);
    }
    return g;
  },

  bavul() {
    const g = new THREE.Group();
    kutu(g, .62, .22, .42, M.ahsapKoyu, 0, .11, 0);
    kutu(g, .64, .04, .44, M.siyah, 0, .13, 0);
    kutu(g, .1, .05, .03, M.pirinc, 0, .23, -.21);
    return g;
  },

  besik() {
    const g = new THREE.Group();
    kutu(g, .7, .06, 1.2, M.ahsapKoyu, 0, .4, 0);
    for (const z of [-.6, .6]) {
      kutu(g, .7, .55, .05, M.ahsapKoyu, 0, .62, z);
    }
    for (let i = -4; i <= 4; i++) {
      silindir(g, .018, .018, .5, M.ahsapKoyu, i * .08, .65, -.6);
      silindir(g, .018, .018, .5, M.ahsapKoyu, i * .08, .65, .6);
    }
    return g;
  },
};
