/* =========================================================================
   MİRAS — Oyun içeriği (eşyalar, anılar, çelişkiler, hikâye)
   Tüm metinler burada. Motor kodu bu dosyayı sadece okur.
   ========================================================================= */

const OYUN = {
  baslik: 'MİRAS',
  altBaslik: 'Kavaklı Sokak No. 7 — Mudurnu, Bolu',
  yil: 'Temmuz 2026',
};

/* Beat tipleri:
   ani      → hatırladığın şey (sıcak, italik)
   gozlem   → gördüğün şey (soğuk, nesnel)
   celiski  → uymayan şey (kırmızı)
   ses      → iç ses / detay (soluk)
   mektup   → anneannenin el yazısı
   kupur    → gazete / resmî belge
*/

const ESYALAR = {

/* ───────────────────────────── ZEMİN KAT — ANTRE ───────────────────────── */

  saat: {
    ad: 'Sarkaçlı Duvar Saati',
    oda: 'Antre',
    katalog: 'Ceviz kasa, sarkaçlı duvar saati, yaklaşık 1950. Sarkaç hareketsiz. Akrep ve yelkovan 11:01\'de durmuş. Kurma anahtarı bulunamadı.',
    beats: [
      { t:'ani', s:'Bu saatin sesiyle uyurdum. Tik. Tik. Tik. Her pazar sabahı anneannem bir sandalye çeker, camını açar, kurardı. "Bu ev bu sesle nefes alır" derdi.' },
      { t:'gozlem', s:'Kasanın arkasındaki tozda bir iz var — birisi saati duvardan indirmiş, sonra geri asmış. Boyanın altında iki ayrı çivi deliği duruyor.' },
      { t:'celiski', s:'11:01. Bir saat bozulunca rastgele bir yerde durur. Ama bu saat bozuk değil; sadece kurulmamış. Yani birisi, bir gün, onu kurmayı bıraktı ve bir daha başlamadı.' },
    ],
    yanki: 'On bir sıfır bir. Onbir-Ocak. Saati okumayı yanlış öğrenmişim: bu bir vakit değil, bir tarih.',
  },

  ayakkabilik: {
    ad: 'Ayakkabılık',
    oda: 'Antre',
    katalog: 'Ahşap ayakkabılık, üç raf. On iki çift ayakkabı; on biri yetişkin. Biri çocuk: 26 numara, siyah rugan, tek tek.',
    beats: [
      { t:'ani', s:'Ayakkabıyla bir adım atarsan tek kelime duyardın: "Ayak." Hiç bağırmazdı. Bağırmasına gerek yoktu.' },
      { t:'gozlem', s:'26 numara. Beş yaşında bir çocuk ayakkabısı. Eşi yok. Ve üstünde diğer on bir çiftin tozu yok — birisi bunu düzenli olarak siliyormuş.' },
      { t:'celiski', s:'Ben bu evden sekiz yaşında ayrıldım. Sekiz yaşında 26 numara giyilmez.' },
      { t:'ses', s:'Tekini alıp yerine koyuyorum. Rafta bıraktığı boşluk, ayakkabının kendisinden daha belirgin.' },
    ],
  },

  telefon: {
    ad: 'Telefon Sehpası ve Adres Defteri',
    oda: 'Antre',
    katalog: 'Sehpa üzerinde çevirmeli telefon (hat kapalı). Çekmecede spiralli adres defteri, deri kaplı.',
    beats: [
      { t:'ani', s:'"Anneannen telefonu hiç açmadı," derdi annem. "Biz de aramaktan vazgeçtik. Bir insan ne kadar denenir, Deniz?"' },
      { t:'gozlem', s:'Defterde "S" harfinde annemin numarası var. Üstü çizilmiş, altına yenisi yazılmış. Sonra o da çizilmiş. Sayıyorum: on bir kez. Son yazılışın mürekkebi hâlâ mavi.' },
      { t:'celiski', s:'Bir numarayı on bir kez güncelleyen kişi, arayan taraftır. Açmayan taraf değil.' },
      { t:'ses', s:'Arka kapağın en altında, farklı bir kalemle: "Sosyal Hizmetler İl Md. — Bolu" ve bir numara. Yanında tarih yok. Neden burada olduğunu bilmiyorum.' },
    ],
    yanki: 'On bir kez. Annemin her taşınmasını, her numara değiştirmesini birileri ona haber vermiş. Ve o, her seferinde, defteri açıp düzeltmiş.',
  },

/* ─────────────────── ZEMİN KAT — ANNEANNENİN OTURMA ODASI ──────────────── */

  koltuk: {
    ad: 'Berjer Koltuk',
    oda: 'Oturma Odası',
    katalog: 'Tek kişilik berjer, yeşil kadife. Kolçaklar aşınmış. Oturma yerinde kalıcı çökme. Değer: düşük.',
    beats: [
      { t:'ani', s:'Bu koltuk yasaktı. "Orası benim yerim." Bir kez oturdum, dört yaşındaydım, kolumdan çekti. Annem bunu her anlattığında sesi yükselirdi.' },
      { t:'gozlem', s:'Onu bu koltukta bulmuşlar. Üç gün sonra. Kapıyı komşu kırmış.' },
      { t:'celiski', s:'Koltuk kapıya bakmıyor. Pencereye de bakmıyor. Merdivene bakıyor — üst kata çıkan merdivene. Yirmi beş yıl boyunca, oturduğu yerden baktığı tek şey buydu.' },
      { t:'ses', s:'Minderin altında sert bir şey var. Küçük, pirinç bir anahtar. Etiketinde tek kelime: KİLER.' },
    ],
    verir: 'key_kiler',
    yanki: 'Merdivene bakıyordu çünkü yukarıda kapalı bir oda vardı ve o odanın kapısının bir gün açılmasını bekliyordu.',
  },

  radyo: {
    ad: 'Masa Tipi Radyo',
    oda: 'Oturma Odası',
    katalog: 'Philips masa tipi radyo, 1970\'ler. Fişi takılı. Çalışır durumda. Ses düğmesi sonuna kadar açık.',
    beats: [
      { t:'ani', s:'Cumartesi sabahları türkü çalardı. Mutfaktan duyulurdu. Ben halının üstüne yatar, tavana bakardım.' },
      { t:'gozlem', s:'Açıyorum. Çalışıyor. Bandı hâlâ aynı istasyonda ama yayın yok — sadece cızırtı. Ve ses düğmesi sonuna kadar açık.' },
      { t:'celiski', s:'Yıllardır cızırtıdan başka bir şey vermeyen bir radyoyu, sonuna kadar açık bırakmazsın. Meğerki evde bir ses olsun istiyorsundur. Herhangi bir ses.' },
    ],
  },

  fotograf: {
    ad: 'Çerçeveli Aile Fotoğrafı',
    oda: 'Oturma Odası',
    katalog: 'Ahşap çerçeve, 18×24 cm, cam çatlak. Siyah-beyaz baskı. Arka kapakta kurşun kalemle: "Ağustos 1997, bahçe."',
    beats: [
      { t:'ani', s:'Bu fotoğrafı biliyorum. Bizim evde de bir kopyası vardı, annemin komodininde. Ağustos 97. Dört yaşındayım, anneannemin kucağındayım. Bu benim ilk hatıram.' },
      { t:'gozlem', s:'Çocuğun sol kolunda, dirseğin hemen altında koyu bir leke var. Doğum lekesi. Baskı hatası değil — kenarı yumuşak, deriye oturmuş.' },
      { t:'celiski', s:'Kolumu çeviriyorum. Orada hiçbir şey yok. Hiç olmadı.' },
      { t:'ses', s:'Belki başka bir kol. Belki ışık. Çerçeveyi geri koyuyorum ama elim camın üstünde biraz fazla kalıyor.' },
    ],
    bayrak: 'f_foto',
    yanki: 'O kucakta neden bu kadar rahat oturduğunu artık biliyorum. Orası gerçekten onun yeriydi.',
  },

/* ───────────────────────────── ZEMİN KAT — SALON ───────────────────────── */

  vitrin: {
    ad: 'Camlı Vitrin',
    oda: 'Salon',
    katalog: 'Camlı vitrin dolabı. On iki kişilik porselen takım, kullanılmamış. Alt rafta altı adet plastik çocuk bardağı.',
    beats: [
      { t:'ani', s:'Bayramlarda bu takım çıkardı. Herkes gelirdi, salon dolardı, ben masanın altında oynardım.' },
      { t:'gozlem', s:'Porselenlerin hiçbirinde çatal izi yok. Bir tanesinde bile. Yirmi yıl önce alınmış ve hiç sofraya konmamış.' },
      { t:'celiski', s:'Alt rafta altı plastik çocuk bardağı var. Beşi tozlu. Biri değil. Biri, sanki dün yıkanmış gibi, ötekilerin yanında sırasını bekliyor.' },
    ],
  },

  dikis: {
    ad: 'Ayaklı Dikiş Makinesi',
    oda: 'Salon',
    katalog: 'Singer ayaklı dikiş makinesi, çalışır. Çekmecede makas, iplik, iğne yastığı ve kesilmiş kumaş kalıpları.',
    beats: [
      { t:'ani', s:'"Annem sana bayramlık dikerdi," derdi annem. "Hatırlamıyor musun? Kırmızı olanı çok severdin."' },
      { t:'gozlem', s:'Çekmecede iki takım kalıp var. Biri beş yaş bedeni; kenarına iğneyle iliştirilmiş kâğıtta 1998. Diğeri yedi yaş: 2000.' },
      { t:'celiski', s:'Arada bir yıl yok. Bir çocuk beş yaşından yedi yaşına bir kalıp atlayarak geçmez. Yaz olur, kış olur, bir beden büyür.' },
      { t:'ses', s:'1999 sadece bir yıl. Ama bu evde her şeyin bir tarafında duruyor.' },
    ],
  },

/* ──────────────────────────── ZEMİN KAT — MUTFAK ───────────────────────── */

  cizelge: {
    ad: 'Kapı Pervazındaki Boy Çizelgesi',
    oda: 'Mutfak',
    katalog: 'Mutfak kapısı pervazı. Kurşun kalemle çizilmiş yatay çizgiler, tarihli. İki ayrı sütun hâlinde.',
    beats: [
      { t:'ani', s:'Her doğum günümde ölçerdi. Sırtımı pervaza yaslar, kafamın üstüne cetvel koyar, çizerdi. Bunu yapan bir insana "soğuk" denmez.' },
      { t:'gozlem', s:'Sol sütun: 1995, 1996, 1997, 1998. Sonra bir çizgi daha — 11 Ocak 1999. Bu sonuncusu farklı; kalem o kadar bastırılmış ki çizgi tahtaya oyulmuş.' },
      { t:'gozlem', s:'Sağ sütunda üç çizgi var. Kasım 1999. Mart 2000. Mart 2001. Sonra hiçbir şey.' },
      { t:'celiski', s:'Sağ sütunun ilk çizgisi, sol sütunun sonuncusundan dokuz santim yukarıda. Dokuz santim. Bir çocuk on ayda dokuz santim uzamaz.' },
      { t:'ses', s:'İki sütun. Aralarında bir parmak boşluk. Aynı pervaz, aynı kalem, aynı el.' },
    ],
    bayrak: 'f_cizelge',
    yanki: 'Dokuz santim iki yaş demek. Sağ sütun benim. Sol sütun hiçbir zaman benim olmadı.',
  },

  kavanozlar: {
    ad: 'Kavanoz Rafı',
    oda: 'Mutfak',
    katalog: 'Duvar rafında 34 cam kavanoz: turşu, reçel, salça. Her kapakta el yazısıyla içerik ve yıl.',
    beats: [
      { t:'ani', s:'Kapakları ben yazardım. Elimi tutar, birlikte yazardık. Harfler çarpık çıkardı, o da hiç düzeltmezdi.' },
      { t:'gozlem', s:'1994. 1995. 1996. 1997. 1998. 2000. 2001... böyle 2019\'a kadar gidiyor, sonra duruyor.' },
      { t:'celiski', s:'1999 yok. Otuz dört kavanoz, yirmi altı yıl, tek bir boşluk. O yıl bu bahçeye kimse inmemiş. O yıl bu mutfakta hiçbir şey kaynatılmamış.' },
    ],
  },

  fincanlar: {
    ad: 'Çay Tepsisi',
    oda: 'Mutfak',
    katalog: 'Bakır tepsi; iki ince belli bardak, iki tabak, iki kaşık. Bardaklardan biri kırılmış ve yapıştırılmış.',
    beats: [
      { t:'ani', s:'Hep iki bardak koyardı. "Misafir gelmese bile," derdi, "yer hazır olsun."' },
      { t:'gozlem', s:'Kırık bardak dikkatle onarılmış. Çatlaklar altın rengi bir tutkalla doldurulmuş. Bu iş saatler sürer, hem de titreyen ellerle.' },
      { t:'celiski', s:'İki bardak. Yirmi beş yıldır tek başına yaşayan bir kadın, her gün iki bardak koymuş. Ve kırılanı atmamış — yapıştırmış.' },
    ],
  },

  cekmece: {
    ad: 'Mutfak Çekmecesi',
    oda: 'Mutfak',
    katalog: 'Karışık çekmece. İlaç kutusu, reçete kâğıtları, tahta cetvel, ucu kırık kurşun kalem.',
    beats: [
      { t:'gozlem', s:'Reçeteler Şubat 1999\'da başlıyor. Uyku ilacı. Sonra bir tane daha, daha yüksek doz.' },
      { t:'gozlem', s:'Doktorun notu: "Hasta uyuyamadığını, evde ses duyduğunu belirtiyor."' },
      { t:'celiski', s:'2003 tarihli son notta şu yazıyor: "Hasta tedaviyi reddetti. Duyduğu şeyin geçmesini istemediğini ifade etti."' },
      { t:'ses', s:'Cetvel. Ve ucu kırık kurşun kalem. Pervazdaki çizgileri çizen kalem bu. Yirmi beş yıldır bu çekmecede bekliyor.' },
    ],
  },

/* ──────────────────────────── ZEMİN KAT — KİLER ────────────────────────── */

  kutu_kiyafet: {
    ad: 'Çocuk Kıyafetleri Kolisi',
    oda: 'Kiler',
    katalog: 'Etiketsiz karton koli. İçinde katlanmış çocuk kıyafetleri, naftalinli, iki grup hâlinde.',
    beats: [
      { t:'ani', s:'Bunları hatırlıyorum. Şu kırmızı kazak — fotoğrafta üstümde var.' },
      { t:'gozlem', s:'Koli ikiye ayrılmış. Altta küçük bedenler: dizler incelmiş, yakalar esnemiş, dirsekler açılmış, bazıları iki kez yamanmış. Üstte büyük bedenler: katları hiç bozulmamış, kokusu naftalinden başka bir şey değil.' },
      { t:'celiski', s:'Bunun tersi olmalıydı. Bir çocuk küçük bedenden birkaç ayda çıkar; o yüzden en az yıpranan hep en küçük olanlardır. Buradaki küçükler ise yıllarca, her gün giyilmiş gibi.' },
      { t:'celiski', s:'Ve büyükler hiç giyilmemiş. Alınmışlar, katlanmışlar, kaldırılmışlar — sanki sahibi eve hiç yerleşmemiş gibi.' },
      { t:'ses', s:'Kırmızı kazak üst grupta. Etiketi bile duruyor. Fotoğrafta gördüğüm kazak bu olamaz; bu kazak hiç kimsenin sırtına girmemiş.' },
    ],
  },

  not_orhan: {
    ad: 'Kapıya Yapıştırılmış Not',
    oda: 'Kiler',
    katalog: 'Bodrum kapısına bantlanmış çizgili kâğıt. Tükenmez kalem. Dayımın el yazısı.',
    beats: [
      { t:'kupur', s:'"Deniz — bodrumu açma. Zemin çürük, tehlikeli. Ben gelince hallederiz. Aşağıdaki her şey zaten atılacak. Orhan dayın."' },
      { t:'gozlem', s:'Not yeni. Mürekkep hâlâ parlak, bant yapışkanlığını kaybetmemiş. Dayım anneannem öldükten sonra bu eve gelmiş. Benden önce.' },
      { t:'celiski', s:'Kilerdeki raflar toz içinde. Ama alttaki iki raf bomboş ve tertemiz. Birisi buradan bir şeyler almış ve tozu da beraberinde götürmüş.' },
    ],
  },

  bodrum_kapisi: {
    ad: 'Bodrum Kapısı',
    oda: 'Kiler',
    katalog: 'Ahşap bodrum kapısı. Dış taraftan asma kilitli. Kilit yeni değil.',
    kilit: 'key_bodrum',
    kilitMesaj: 'Asma kilit. Anahtarı bende yok — ve dayımın notu tam da bu kapı için yazılmış.',
    beats: [
      { t:'gozlem', s:'Asma kilit dışarıdan takılmış. Altında, ahşapta, daha eski bir sürgünün izi var — o da dışarıdan.' },
      { t:'celiski', s:'Bir kapıyı dışarıdan kilitlersin ki kimse aşağı inmesin. Ama bu kapı iki farklı kilitle, iki farklı zamanda, aynı yönde kilitlenmiş. Yani birileri buna iki kez karar vermiş.' },
      { t:'ses', s:'Kapının altından soğuk geliyor. Ve bir su sesi. Damla. Damla. Bu evin suyu yıllar önce kesilmiş.' },
    ],
  },

/* ─────────────────────────── ÜST KAT — KORİDOR ─────────────────────────── */

  cerceveler: {
    ad: 'Koridordaki Çerçeve Sırası',
    oda: 'Üst Koridor',
    katalog: 'Koridor duvarında altı çerçeve, kronolojik dizilmiş. Beşinde fotoğraf var. Biri boş.',
    beats: [
      { t:'ani', s:'Bu koridordan geçerken sayardım. Bir, iki, üç... Karanlıkta sayarsan daha çabuk biterdi.' },
      { t:'gozlem', s:'Çerçeveler tarihli: 1994, 1996, 1997, 1998, [boş], 2001. Boş olanın camı temiz, çivisi yerinde. Fotoğraf çıkarılmış, çerçeve bırakılmış.' },
      { t:'celiski', s:'Duvar kâğıdı bütün çerçevelerin arkasında solmamış — boş olanın arkasında da. Yani o fotoğraf yıllarca orada durdu. Ve yakın zamanda alındı.' },
      { t:'ses', s:'1998\'den 2001\'e. Aradaki çerçeve boş değil. Boşaltılmış.' },
    ],
    yanki: 'Sayarken hiç fark etmemişim: altı çerçeve var ama benim bu evde geçirdiğim iki yıl. Diğer dört yıl kimin?',
  },

/* ───────────────────────── ÜST KAT — ÇOCUK ODASI ───────────────────────── */

  yatak: {
    ad: 'Demir Karyola',
    oda: 'Çocuk Odası',
    katalog: 'Tek kişilik demir karyola, yaylı somya. Yatak takımı serili, yastık kılıfı ütülü. Yüzeyde toz yok.',
    beats: [
      { t:'ani', s:'Tavandaki leke. Hâlâ orada, sağ üst köşede, kirişin yanında — bir tavşan gibi, kulakları var. Bunu kimse bana anlatmadı. Bunu ben buldum, tek başıma, bu yastığın üstünde, altı yaşında.' },
      { t:'gozlem', s:'Yatak yapılı. Çarşaflar temiz. Yastık kılıfı ütülenmiş, kenarı katlanmış.' },
      { t:'celiski', s:'Bu odada yirmi beş yıldır kimse yatmadı. Ama bu yatak, her hafta, birisi gelecekmiş gibi yapıldı.' },
      { t:'ses', s:'Bu, bu evdeki ilk gerçek anım. Ve şimdiye kadar tek gerçek olan.' },
    ],
  },

  pamuk: {
    ad: 'Peluş Ayı — "Pamuk"',
    oda: 'Çocuk Odası',
    katalog: 'Gardırop üstünde bantlanmış ayakkabı kutusu. İçinde peluş oyuncak ayı; bir kulağı beyaz iplikle dikilmiş. Kutu kapağında kurşun kalemle tarih.',
    beats: [
      { t:'ani', s:'Pamuk. Her gece onunla uyurdum. Kulağını çekiştire çekiştire kopardım, anneannem beyaz iplikle dikti. Kokusunu bile hatırlıyorum.' },
      { t:'gozlem', s:'Kutunun üstünde kurşun kalemle: 12 Ocak 1999. Bant hiç açılmamış — kenarları sararmış ama mühür sağlam.' },
      { t:'celiski', s:'Bu kutu 12 Ocak 1999\'da kapatıldı ve bir daha açılmadı. Ben bu eve o tarihten sonra geldim.' },
      { t:'ses', s:'Kulaktaki dikişi görüyorum. Beyaz iplik. Tam hatırladığım gibi. Onu ben koparmadım. Onu ben hiç tutmadım.' },
    ],
    bayrak: 'f_pamuk',
    yanki: 'Anlatılan bir anıyı yaşanmış olandan ayırmanın bir yolu var: yaşanmışın kenarları vardır. Anlatılan hep tam ortadan başlar.',
  },

  resim_defteri: {
    ad: 'Resim Defteri',
    oda: 'Çocuk Odası',
    katalog: 'A4 resim defteri, 40 sayfa. Kuru boya ve keçeli kalem. İlk yarısı dolu, ardından altı boş sayfa, sonra tekrar dolu.',
    beats: [
      { t:'gozlem', s:'İlk yarıdaki resimlerde hep dört kişi var: iki büyük, bir orta boy, bir küçük. Küçüğün elini tutan hep aynı figür — gri saçlı, uzun. Kırk sayfanın on dokuzunda, her seferinde.' },
      { t:'gozlem', s:'Altı boş sayfadan sonra çizim değişiyor. Aynı boya kutusu, farklı bir el: baskı daha sert, çizgiler kapalı, hiçbir figür birbirine değmiyor.' },
      { t:'celiski', s:'İkinci yarıda gri saçlı figür bir kez bile yok. Ve ev hep dışarıdan çizilmiş. Hep uzaktan. Pencereler hep karanlık.' },
      { t:'ses', s:'İlk yarının altında koca harflerle bir imza var, "N"si ters yazılmış. İkinci yarıda hiç imza yok. Sanki çizen kişi adını yazmakta tereddüt etmiş.' },
    ],
  },

  duvar_kagidi: {
    ad: 'Gevşek Duvar Kâğıdı',
    oda: 'Çocuk Odası',
    katalog: 'Odanın kuzey köşesinde duvar kâğıdı nemden kabarmış; yaklaşık 20 cm gevşek. Altında sıva.',
    beats: [
      { t:'ani', s:'Bu köşe. Buraya oturur, kâğıdı tırnaklardım. Fark ettiğinde kızardı — ama kâğıdı hiç yapıştırmadı.' },
      { t:'gozlem', s:'Kâğıdı kaldırıyorum. Sıvanın üstüne bir şey kazınmış — çivi ya da makas ucuyla, çocuk yazısıyla:' },
      { t:'kupur', s:'D E N İ Z' },
      { t:'gozlem', s:'Ve tam altında, çok daha derin kazınmış, çok daha titrek bir el:' },
      { t:'kupur', s:'U M U T' },
      { t:'celiski', s:'İki isim. Aynı duvar, aynı yükseklik, farklı iki el. Bu evde Umut diye biri hiç olmadı. Kimse bana böyle birinden bahsetmedi.' },
    ],
    bayrak: 'f_duvar',
    yanki: 'Kâğıdı ilk kaldırdığımda yabancı bir isim gördüğümü sanmıştım. Şimdi anlıyorum: bu evde ilk kez kendi adımı okumuşum.',
  },

/* ─────────────────────────── ÜST KAT — BANYO ───────────────────────────── */

  ayna: {
    ad: 'Aynalı Dolap',
    oda: 'Banyo',
    katalog: 'Aynalı banyo dolabı. Ayna sırlanmış, kenarlar kararmış. Rafta seramik bardak, içinde iki diş fırçası.',
    beats: [
      { t:'ani', s:'Aynaya bakmayı severdim. Boyum yetmezdi, klozetin kapağına çıkardım.' },
      { t:'gozlem', s:'Bardakta iki fırça var. Biri yetişkin. Diğeri çocuk fırçası ve kılları hâlâ dimdik — bir kez bile kullanılmamış.' },
      { t:'celiski', s:'Aynaya bakıyorum. Otuz üç yaşındayım. Bu yüzü tanıyorum. Ama bu evdeki hiçbir fotoğrafta bu yüz yok.' },
      { t:'ses', s:'Aynanın alt kenarında, sırın döküldüğü yerde bir iz var. Cam buğuya yazılanı hatırlar. Işığı eğince çıkıyor: bir çizgi, bir kavis. Bir harf olabilir. Okuyamıyorum.' },
    ],
  },

/* ──────────────────── ÜST KAT — ANNEANNENİN ODASI ──────────────────────── */

  mucevher: {
    ad: 'Sedef Kakmalı Kutu',
    oda: 'Anneannenin Odası',
    katalog: 'Tuvalet masası üstünde sedef kakmalı ahşap kutu. İçinde birkaç parça takı ve yağlı kâğıda sarılı bir tutam saç.',
    beats: [
      { t:'ani', s:'Bu kutuyu açmama izin verilmezdi. Tek yasak bu değildi ama en net olanı buydu.' },
      { t:'gozlem', s:'Takılar önemsiz — iki yüzük, bir bilezik, kopmuş bir kolye. Altta, yağlı kâğıdın içinde bir tutam saç. İnce, açık kahverengi, çocuk saçı. Kâğıdın üstünde tek satır: 11.01.1999.' },
      { t:'celiski', s:'Kendi saçımdan bir tel çekip ışığa tutuyorum. Benimki koyu. Her zaman koyuydu. Annem "bebekken sarışındın, sonra koyulaştı" derdi. Saç dokuz santim gibi bir şey değildir; renk değiştirir ama tel inceliği değişmez.' },
      { t:'ses', s:'Kutunun astarının altında pirinç bir anahtar var. Uzun dişli. Koridorun sonundaki kapağa uyacak kadar uzun.' },
    ],
    verir: 'key_tavan',
  },

  mektuplar_iade: {
    ad: 'İade Edilmiş Mektuplar',
    oda: 'Anneannenin Odası',
    katalog: 'Komodin çekmecesinde lastikle bağlanmış yaklaşık kırk zarf. Hiçbiri açılmamış.',
    beats: [
      { t:'ani', s:'"Anneannen bizi bir kez bile aramadı," derdi annem. "Bir kez bile, Deniz."' },
      { t:'gozlem', s:'Zarfların hepsi bizim eski adresimize yollanmış. Hepsi geri dönmüş. Üstlerindeki damga postanenin değil — annemin el yazısı: İADE. Kırk zarf, kırk kez, aynı iki hece.' },
      { t:'gozlem', s:'Zarflar tarihli. 2001\'den 2024\'e kadar, yılda iki tane. Biri hep 11 Ocak. Diğeri hep 2 Mart.' },
      { t:'celiski', s:'11 Ocak\'ın bu evde bir anlamı olduğunu artık anlıyorum. Ama 2 Mart? Benim doğum günüm 14 Mart. Bu ailede kimsenin 2 Mart\'ta doğum günü yok.' },
      { t:'ses', s:'Hiçbirini açmıyorum. Henüz değil. Ellerim titriyor ve nedenini bilmiyorum.' },
    ],
    bayrak: 'f_mektup',
    yanki: '2 Mart. Yurt dosyasındaki tarih. Beni buraya getirmeden önceki tarih. Yirmi üç yıl boyunca, gerçek doğum günümde bana mektup yazmış.',
  },

  mont: {
    ad: 'Çocuk Montu',
    oda: 'Anneannenin Odası',
    katalog: 'Gardıropta, yetişkin kışlıkların arasında ayrı bir askıda: 5 yaş bedeni kırmızı çocuk montu. Kurumuş su lekeleri. Yıkanmamış.',
    beats: [
      { t:'gozlem', s:'Mont hiç yıkanmamış. Eteğinde ve kollarında koyu halkalar var — su çekmiş, kurumuş, tekrar su çekmiş. Cebinde ıslanıp kurumuş bir kâğıt topağı; açmaya kalksam parçalanır.' },
      { t:'gozlem', s:'Yakasının içinde dikilmiş bir isim etiketi. Anneannemin dikişi. Yazı solmuş ama harf sayısı çıkıyor: beş harf.' },
      { t:'celiski', s:'Yirmi yedi yıl. Bu evde her şey yıkandı, katlandı, kaldırıldı. Bu mont hariç. Bu mont bulunduğu günden beri aynı askıda.' },
      { t:'ses', s:'Kokusu var. Yosun ve ıslak taş. Yağmur kokusu değil. Durgun su kokusu.' },
    ],
    bayrak: 'f_mont',
    yanki: 'Beş harf. D-E-N-İ-Z. Ve montun yanındaki askı boş — annem beni buraya getirdiğinde bir mont daha alınmış olmalı. O mont evde yok. Onu ben giydim ve giymeye devam ettim.',
  },

/* ─────────────────────────── TAVAN ARASI ───────────────────────────────── */

  album: {
    ad: 'Fotoğraf Albümleri',
    oda: 'Tavan Arası',
    katalog: 'Karton kolide üç fotoğraf albümü. Kapaklarında el yazısıyla yıllar.',
    beats: [
      { t:'gozlem', s:'İlk iki albüm bozulmamış. 1994–1998. Bahçe, kar, doğum günü pastası, denize giden bir araba. Aynı çocuk, her sayfada.' },
      { t:'gozlem', s:'Üçüncü albümün kapağında tek bir yıl var: 1999. İçindeki her fotoğraftan bir figür kesilip çıkarılmış. Makasla, dikkatle, sabırla.' },
      { t:'gozlem', s:'Geriye kalanlar: eller. Bir tabutun kenarı. Beyaz bir çarşafla örtülmüş bir ayna. Boş bir yatak. Karla kaplı bir bahçe ve bahçenin ortasında, taşla kapatılmış yuvarlak bir kapak.' },
      { t:'celiski', s:'Kesilen hep aynı boy, hep aynı yükseklikte bir baş. Ve makas o figürü tutan ellerin etrafından dolanmış — eller bırakılmış. Kesen kişi, kesmeye dayanamadığı yerde durmuş.' },
      { t:'ses', s:'İç kapakta annemin el yazısı: "Anne, konuşmuştuk. Görmesin."' },
    ],
    bayrak: 'f_album',
  },

  gazete: {
    ad: 'Gazete Küpürü',
    oda: 'Tavan Arası',
    katalog: 'Katlanmış, sararmış gazete sayfası. Bolu yerel gazetesi, 14 Ocak 1999.',
    beats: [
      { t:'kupur', s:'MUDURNU\'DA KAYBOLAN ÇOCUK SARNIÇTA BULUNDU' },
      { t:'kupur', s:'"11 Ocak akşamı kar fırtınası sırasında evden çıktığı belirlenen 5 yaşındaki D.A.\'nın cansız bedeni, iki gün süren aramaların ardından evin bahçesindeki kullanılmayan sarnıçta bulundu. Aile üyelerinin ifadesine göre çocuk, arka kapının açık bırakılması sonucu dışarı çıkmış..."' },
      { t:'gozlem', s:'Yazının devamı yırtılmış. Ama fotoğraf duruyor: kar, bir bahçe, arkada bir ev. Bu ev.' },
      { t:'celiski', s:'Beş yaşında. 11 Ocak 1999. Pervazdaki son çizgi. Kavanozlardaki boşluk. Bantlanmış kutu. Saç lülesi. Duran saat. Hepsi aynı günde buluşuyor.' },
      { t:'ses', s:'Bu çocuk kim? Bu evde bir çocuk öldü ve otuz üç yıldır kimse bana bundan bahsetmedi.' },
    ],
    bayrak: 'f_gazete',
  },

  evraklar: {
    ad: 'Metal Evrak Kutusu',
    oda: 'Tavan Arası',
    katalog: 'Kilitsiz metal evrak kutusu. Resmî belgeler, iki nüfus kaydı fotokopisi, bir dosya, bir dilekçe.',
    beats: [
      { t:'gozlem', s:'İki nüfus kaydı. İkisinde de aynı isim yazıyor: DENİZ AYDIN.' },
      { t:'kupur', s:'BİRİNCİ KAYIT — Doğum: 14.03.1993, Mudurnu. Ölüm: 11.01.1999. Kayıt kapalıdır.' },
      { t:'kupur', s:'İKİNCİ KAYIT — Doğum: 14.03.1993, Mudurnu. Kayıt açıktır.' },
      { t:'celiski', s:'İkinci kayıttaki numara, cüzdanımdaki numara. Otuz üç yıldır her forma yazdığım on bir hane.' },
      { t:'gozlem', s:'Altında bir dosya daha var. Sosyal Hizmetler İl Müdürlüğü, Bolu. Çocuk yuvası çıkış evrakı, tarih 03.10.1999. İliştirilmiş fotoğrafta altı yaşında bir çocuk var. Fotoğrafa uzun bakmam gerekmiyor.' },
      { t:'kupur', s:'Ad: UMUT — Soyadı hanesi boş — Doğum: 02.03.1993' },
      { t:'ses', s:'En altta, dayımın imzasını taşıyan bir dilekçe: "nüfus kaydının düzeltilmesi talebi". Ve kutunun köşesinde küçük bir anahtar. Asma kilit anahtarı.' },
    ],
    bayrak: 'f_evrak',
    verir: 'key_bodrum',
  },

/* ──────────────────────── BODRUM VE SARNIÇ ─────────────────────────────── */

  sandik: {
    ad: 'Çinko Kaplı Sandık',
    oda: 'Bodrum',
    katalog: 'Çinko kaplı ahşap sandık, kilitsiz. İçinde sökülmüş bir çocuk karyolası, bir kutu ve bir deste mektup — açılmış, okunmuş, tekrar katlanmış.',
    beats: [
      { t:'gozlem', s:'Mektuplar bana yazılmış. Hepsi. Yukarıdaki iade edilenlerin kopyaları — ve devamı. En üsttekinin tarihi geçen ay.' },
      { t:'mektup', s:'"Umut. Sana bu adla yazıyorum çünkü senin başka bir adın hiç olmadı. Onlar sana bir ad verdiler, ama o ad zaten bir çocuğun üstündeydi ve o çocuk artık onu taşıyamıyordu."' },
      { t:'mektup', s:'"Kızım, Deniz\'i kaybettiğinde on bir gün konuşmadı. On ikinci gün konuştu ve dediği tek şey şuydu: bir tane daha bulacağız. Sanki kırılan bir bardaktan bahsediyordu. Ben o gün kızımı da kaybettim."' },
      { t:'mektup', s:'"Seni ilk gördüğümde altı yaşındaydın ve kapıda duruyordun ve senin hiçbir suçun yoktu. Sana sarılmadım. Bunu her gün düşünüyorum. Sarılsaydım sen de onların hikâyesinin içine girerdin ve bu evde seni tanıyan tek kişi kalmazdı. Yanlış yaptığımı biliyorum. Ama başka türlü nasıl yapılacağını bilmiyordum."' },
      { t:'mektup', s:'"Ev sana kalacak. Ev umurumda değil. Bu sandık kalacak. Ev, bu sandığı sana ulaştırmanın tek yoluydu — çünkü sen buraya ancak bir şey almaya gelirdin. Onlar seni öyle yetiştirdi."' },
      { t:'mektup', s:'"Bir insanın iki adı olabilir. Ama bir adın iki insanı olamaz. Kimin yerine geçtiğini artık biliyorsun. Şimdi sadece kendi yerine geç."' },
      { t:'ses', s:'Sandığın dibinde bir defter var. Her yıl 2 Mart\'ta yazılmış tek satırlık notlar. "Umut bugün dokuz yaşında. Nerede olduğunu bilmiyorum." "Umut bugün on yedi yaşında. Bugün de yazdım." Yirmi üç satır. Sonuncusu bu yıl.' },
    ],
    bayrak: 'f_sandik',
  },

  sarnic: {
    ad: 'Sarnıç Ağzı',
    oda: 'Sarnıç',
    katalog: 'Bodrumun ucunda taş kemer. Arkasında yuvarlak sarnıç ağzı; üstü taş kapakla kapatılmış ve harçla sıvanmış.',
    beats: [
      { t:'gozlem', s:'Kapak açılmıyor. Yirmi yedi yıl önce kapatılmış, harcı taşla bir olmuş.' },
      { t:'gozlem', s:'Harcın üstünde, daha kurumadan, bir parmakla yazılmış tek kelime var. Sağ alt köşede, küçük, acele etmeden.' },
      { t:'kupur', s:'D E N İ Z' },
      { t:'ses', s:'Bu evde adımın hiçbir yerde yazmadığını düşünmüştüm. Meğer yazıyormuş. Sadece benim adım değilmiş.' },
    ],
    bayrak: 'f_sarnic',
    final: true,
  },
};

/* ══════════════════════ ANNENİN SESLİ MESAJLARI ═════════════════════════ */

const MESAJLAR = [
  { id:'m1', kosul: (d)=> d.sayac >= 1,
    baslik:'Annem — sesli mesaj (0:22)',
    metin:'"Deniz, vardın mı? Anahtar kapının yanındaki taşın altındaydı. Listeyi tut, her odayı yaz, fotoğraf çekme uğraşma. Bir de — üst kata çıkmana gerek yok. Orada bir şey kalmadı."' },

  { id:'m2', kosul: (d)=> d.sayac >= 5,
    baslik:'Annem — sesli mesaj (0:14)',
    metin:'"Çok oyalanma. O ev insanı yorar, ben bilirim. Anneannen son yıllarda... neyse. Yazdıklarını bana yolla, ben Orhan\'a iletirim, o halleder."' },

  { id:'m3', kosul: (d)=> d.bayrak.f_cizelge,
    baslik:'Annem — cevapsız çağrı ×4',
    metin:'"Aradım açmadın. Neden açmıyorsun? Deniz, oradaki eşyaların hepsi çöp. Uğraşma. Yarın Orhan kamyonla gelir, hepsini birden alır."' },

  { id:'m4', kosul: (d)=> d.ustKat || d.bayrak.f_pamuk || d.bayrak.f_duvar,
    baslik:'Annem — sesli mesaj (0:31)',
    metin:'"Neredesin? Üst kata mı çıktın? ... Deniz, o oda kapalıydı. O odanın kapalı olması gerekiyordu. Kapat ve aşağı in."' },

  { id:'m5', kosul: (d)=> d.bayrak.f_album || d.bayrak.f_gazete,
    baslik:'Annem — sesli mesaj (0:47)',
    metin:'"Beni dinle. Ne bulduysan yerine koy. Onlar seni ilgilendirmez, hiçbiri seni ilgilendirmez. Sen benim çocuğumsun. Bunu bir kere söylüyorum ve bir daha söylemeyeceğim: SEN BENİM ÇOCUĞUMSUN."' },

  { id:'m6', kosul: (d)=> d.bayrak.f_evrak,
    baslik:'Annem — sesli mesaj (0:41)',
    metin:'İçinde konuşma yok. Kırk bir saniye boyunca sadece nefes sesi. Sonunda bir araba kapısı kapanıyor.' },

  { id:'m7', kosul: (d)=> d.bayrak.f_sandik,
    baslik:'Annem — mesaj',
    metin:'"Yoldayım."' },
];

/* ══════════════════════════════ FİNAL ═══════════════════════════════════ */

const FINAL = {
  soru: 'Envanter defteri elinde. Son sayfada tek bir boş satır var: "devralan".',
  secenekler: [
    { id:'imzala', etiket:'Formu her zamanki gibi imzala.',
      alt:'DENİZ AYDIN. Otuz üç yıldır attığın imza.' },
    { id:'yaz', etiket:'Boş satıra kendi adını yaz.',
      alt:'Bu evde bir kez, tek bir yerde yazılı olan ad değil. Diğeri.' },
  ],
  sonlar: {
    imzala: {
      baslik:'SON — "Devralan"',
      paragraflar: [
        'Formun altına imzamı atıyorum. D E N İ Z  A Y D I N. Kalem kâğıdı biraz yırtıyor, çünkü elim otuz üç yıldır bu dört harfi aynı hızda yazıyor ve bugün ilk kez yavaşladı.',
        'Ev üç ay sonra satıldı. Alıcı bahçeyi düzledi, sarnıcın üstüne beton döktü, havuz yaptırdı. Yaz aylarında çocuklar oynuyormuş.',
        'Annem bir daha bu evi hiç sormadı. Ben de sormadım. Otuz üç yıldır süren bir sessizliğe otuz dördüncü yılı eklemek zor değil; alışkanlık kolay bir şey.',
        'Bazen gece, uykuyla uyanıklık arasında, bir saatin tik sesini duyduğumu sanıyorum. Ama o saat artık başka birinin duvarında. Ve onu kimse kurmuyor.',
      ],
    },
    yaz: {
      baslik:'SON — "Kendi Yerine Geç"',
      paragraflar: [
        'Formu çeviriyorum. En altta boş bir satır var: devralan. Kalemi tutuyorum ve ilk harfte elim duruyor — otuz üç yıllık bir kas hafızası D yazmak istiyor.',
        'Yazmıyorum. U — M — U — T. Harfler yabancı geliyor, çocuk yazısı gibi çıkıyorlar. Zaten çocuk yazısı: bu ismi en son yazan kişi altı yaşındaydı ve bir duvara kazımıştı.',
        'Ev satılmadı. Sarnıcın üstündeki taşı açtırdım. İçi boştu; zaten yıllardır boştu. Ama artık kapalı da değil.',
        'Mudurnu mezarlığında iki mezar var: Nesrin Aydın ve, aynı adı taşıyan, beş yaşında bir çocuk. Taşı yeniden yazdırdım — doğum ve ölüm tarihleri artık doğru.',
        'Ben üçüncüsü değilim. Ben başka birisiyim. Ve bunu bana bu dünyada bir tek o söyledi — yirmi üç yıl boyunca, yılda iki kez, hiç ulaşmayan zarflarla.',
      ],
    },
  },
  /* Ne kadar eşya bulunduysa o kadar uzun kapanış */
  epilog: {
    tam: 'Envanterdeki her kalemi yazdım. Hepsini. Her birinin yanına, ikinci bir sütun açıp ne hatırladığımı da yazdım — çünkü bir evi değerlemek istiyorsan iki liste tutman gerekiyor: içindekiler, ve içindekilerin sana anlattığı yalanlar.',
    cok: 'Listeyi tamamlayamadım. Bazı çekmeceleri açmadım. Bir evde bilerek açılmayan çekmece, açılanlardan daha ağır olur; bunu artık biliyorum.',
    az:  'Listeyi yarıda bıraktım. Bu evde hâlâ konuşmayı bekleyen eşyalar var ve ben kapıyı arkamdan kapattım. Bir gün geri döneceğim ya da dönmeyeceğim.',
  },
};

/* ═══════════════════════ AÇILIŞ / GİRİŞ METNİ ═══════════════════════════ */

const ACILIS = [
  'Anneannem üç hafta önce öldü. Onu koltuğunda bulmuşlar, üç gün sonra.',
  'Ona en son yirmi beş yıl önce, sekiz yaşındayken sarıldım — ya da sarılmadım; ailem bu konuda çok net: o bana hiç sarılmadı.',
  'Evi bana bıraktı. Sadece bana. Annem ve dayım avukatı üç kez aradı, sonuç değişmedi.',
  'Şimdi buradayım, elimde bir envanter defteri var ve tek bir işim var: satış için içerideki her şeyi yazmak.',
  'Kavaklı Sokak No. 7. Çocukluğumun evi.',
  'Kapıyı açtığımda, hatırladığım hiçbir şeyi bulamayacağım.',
];

const IPUCLARI = [
  'W A S D · yürü &nbsp;&nbsp;—&nbsp;&nbsp; FARE · bak &nbsp;&nbsp;—&nbsp;&nbsp; SHIFT · koş',
  'E · incele &nbsp;&nbsp;—&nbsp;&nbsp; BOŞLUK · anıyı ilerlet &nbsp;&nbsp;—&nbsp;&nbsp; F · el feneri',
  'TAB · envanter defteri &nbsp;&nbsp;—&nbsp;&nbsp; ESC · imleci bırak',
];
