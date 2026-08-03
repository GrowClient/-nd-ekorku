/* =========================================================================
   KAYIP ÇOCUK — evde dolaşan şeyin gövdesi.

   Gövde artık kodla modellenmiyor. Karakter tasarımı kaynak/ dizinindeki
   turnaround görselinden geliyor; js/varlikDoku.js o görselden üretilmiş
   iki görünüşlük (ön / arka) bir sprite sayfası taşıyor.

   Neden düzlem (billboard), neden 3B ağ değil:
     · Varlık oyun boyunca her zaman oyuncuya dönük duruyor — davranışı
       böyle. Yani pratikte hep ön görünüş görülüyor; düzlemin yassı
       olması fark edilmiyor.
     · Prosedürel kutu-küre bir gövde, referanstaki fotogerçekçi
       karakterin yanına yaklaşamıyor. Yassı ama doğru görünen bir figür,
       hacimli ama yanlış görünen bir figürden iyidir.
     · Gerçek hacim isteniyorsa doğru yol bir .glb yüklemek; o zaman
       yalnızca burası GLTFLoader ile değişir, kalan kod aynı kalır.

   Düzlemin ayakları y=0'da: grup zemin kotuna konuluyor.
   ========================================================================= */

const Cocuk = {
  BOY: 1.32,                       // metre — dokuz yaşında bir çocuk

  yap() {
    const grup = new THREE.Group();
    const malzemeler = [];

    const doku = new THREE.TextureLoader().load(VARLIK_SAYFA);
    doku.colorSpace = THREE.SRGBColorSpace;
    doku.magFilter = THREE.LinearFilter;
    doku.minFilter = THREE.LinearMipmapLinearFilter;
    doku.anisotropy = 8;
    doku.wrapS = doku.wrapT = THREE.ClampToEdgeWrapping;
    doku.repeat.set(1 / VARLIK_KARE.sayi, 1);     // sayfadaki tek kare
    doku.offset.set(0, 0);

    const mal = new THREE.MeshStandardMaterial({
      map: doku,
      color: 0x9d9a94,              // fenerin dibinde patlamasın diye kısık
      emissive: 0x0d0e13,           // menzil dışında da belli belirsiz seçilsin
      emissiveMap: doku,
      roughness: 1, metalness: 0,
      transparent: true, opacity: 0,
      alphaTest: .34,               // saç tellerinin arası delik kalsın
      side: THREE.DoubleSide,
      depthWrite: true,
    });
    malzemeler.push(mal);

    const en = Cocuk.BOY * VARLIK_KARE.oran;
    const geo = new THREE.PlaneGeometry(en, Cocuk.BOY);
    geo.translate(0, Cocuk.BOY / 2, 0);           // ayaklar y=0'da
    const levha = new THREE.Mesh(geo, mal);
    levha.castShadow = false;                     // yassı kartın gölgesi yanlış durur
    levha.receiveShadow = false;
    grup.add(levha);

    return {
      grup, malzemeler, doku, levha,
      gozMal: null, gozler: [],
      /* Hangi kare gösterilsin: 0 ön, 1 arka */
      kareSec(i) { doku.offset.x = (i % VARLIK_KARE.sayi) / VARLIK_KARE.sayi; },
    };
  },
};
