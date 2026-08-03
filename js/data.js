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
    tarihNotu: 'Duvar saati 11:01\'de durmuş. Saat değil, tarih gibi duruyor: 11 — 01.',
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
    tarihNotu: 'Pervazdaki son çizgi: 11 Ocak 1999. Kalem tahtaya oyulacak kadar bastırılmış.',
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
    tarihNotu: 'Zarf damgaları yılda iki güne yığılmış. Biri 11 Ocak. Ötekinin mürekkebi dağılmış — o günü başka bir yerde bulmam lazım.',
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
    tarihNotu: 'Yuva çıkış evrakı: UMUT — Doğum 02.03.1993. Yani 2 Mart.',
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
  { id:'m1', ton:'duz', kosul: (d)=> d.sayac >= 1,
    baslik:'Annem — sesli mesaj (0:22)',
    metin:'"Deniz, vardın mı? Anahtar kapının yanındaki taşın altındaydı. Listeyi tut, her odayı yaz, fotoğraf çekme uğraşma. Bir de — üst kata çıkmana gerek yok. Orada bir şey kalmadı."' },

  { id:'m2', ton:'soguk', kosul: (d)=> d.sayac >= 5,
    baslik:'Annem — sesli mesaj (0:14)',
    metin:'"Çok oyalanma. O ev insanı yorar, ben bilirim. Anneannen son yıllarda... neyse. Yazdıklarını bana yolla, ben Orhan\'a iletirim, o halleder."' },

  { id:'m3', ton:'endiseli', kosul: (d)=> d.bayrak.f_cizelge,
    baslik:'Annem — cevapsız çağrı ×4',
    metin:'"Aradım açmadın. Neden açmıyorsun? Deniz, oradaki eşyaların hepsi çöp. Uğraşma. Yarın Orhan kamyonla gelir, hepsini birden alır."' },

  { id:'m4', ton:'endiseli', kosul: (d)=> d.ustKat || d.bayrak.f_pamuk || d.bayrak.f_duvar,
    baslik:'Annem — sesli mesaj (0:31)',
    metin:'"Neredesin? Üst kata mı çıktın? ... Deniz, o oda kapalıydı. O odanın kapalı olması gerekiyordu. Kapat ve aşağı in."' },

  { id:'m5', ton:'kizgin', kosul: (d)=> d.bayrak.f_album || d.bayrak.f_gazete,
    baslik:'Annem — sesli mesaj (0:47)',
    metin:'"Beni dinle. Ne bulduysan yerine koy. Onlar seni ilgilendirmez, hiçbiri seni ilgilendirmez. Sen benim çocuğumsun. Bunu bir kere söylüyorum ve bir daha söylemeyeceğim: SEN BENİM ÇOCUĞUMSUN."' },

  { id:'m6', ton:'soguk', kosul: (d)=> d.bayrak.f_evrak,
    baslik:'Annem — sesli mesaj (0:41)',
    metin:'İçinde konuşma yok. Kırk bir saniye boyunca sadece nefes sesi. Sonunda bir araba kapısı kapanıyor.' },

  { id:'m7', ton:'soguk', kosul: (d)=> d.bayrak.f_sandik,
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
  'TAB · envanter defteri &nbsp;&nbsp;—&nbsp;&nbsp; M · seslendirme &nbsp;&nbsp;—&nbsp;&nbsp; ESC · imleci bırak',
];

/* ═════════════════════════════════════════════════════════════════════════
   TEMPO AYARI
   Oyuncuyu her eşyada tam ekran metne boğmamak için:
     kisa  → oyun durmadan ekranın altında görünen tek satır
     panel → yalnızca bu eşyalar tam ekran paneli açar
     tut   → panelde gösterilecek beat'ler (kalanı deftere düşer)
   Panel açmayan eşyaların tam metni envanter defterinden okunabilir.
   ═════════════════════════════════════════════════════════════════════════ */

const TEMPO = {
  saat:        { kisa:'Duvar saati 11:01\'de durmuş. Bozuk değil — birisi bir gün onu kurmayı bırakmış.' },
  ayakkabilik: { kisa:'Ayakkabılıkta tek bir çocuk ayakkabısı. 26 numara. Ve üstünde hiç toz yok.' },
  telefon:     { kisa:'Annemin numarası defterde on bir kez düzeltilmiş. Demek arayan taraf oymuş.' },
  koltuk:      { kisa:'Koltuk kapıya değil, merdivene bakıyor. Minderin altında pirinç bir anahtar var.' },
  radyo:       { kisa:'Radyo yıllardır sadece cızırtı veriyor — ve sesi sonuna kadar açık bırakılmış.' },
  vitrin:      { kisa:'Altı plastik çocuk bardağı. Beşi tozlu. Biri sanki dün yıkanmış.' },
  dikis:       { kisa:'İki kalıp: beş yaş 1998, yedi yaş 2000. Aradaki yıl yok.' },
  fincanlar:   { kisa:'Her gün iki bardak koymuş. Kırılanı atmamış, altın tutkalla yapıştırmış.' },
  kavanozlar:  { kisa:'Otuz dört kavanoz, yirmi altı yıl. Tek bir yıl eksik: 1999.' },
  cekmece:     { kisa:'Uyku ilacı reçeteleri Şubat 1999\'da başlıyor: "hasta evde ses duyduğunu belirtiyor."' },
  kutu_kiyafet:{ kisa:'Küçük bedenler yıllarca giyilmiş, büyükler hiç giyilmemiş. Tersi olmalıydı.' },
  not_orhan:   { kisa:'Dayımın notu: "Bodrumu açma." Mürekkep hâlâ parlak — benden önce gelmiş.' },
  bodrum_kapisi:{kisa:'Asma kilit dışarıdan takılmış. Altından soğuk geliyor, ve bir su sesi.' },
  cerceveler:  { kisa:'Altı çerçeve: 1994, 1996, 1997, 1998, [boş], 2001. Boş değil — boşaltılmış.' },
  yatak:       { kisa:'Tavandaki tavşan biçimli leke hâlâ orada. Bunu kimse bana anlatmadı; ben bulmuştum.' },
  resim_defteri:{kisa:'Defterin iki yarısını iki ayrı el çizmiş. İkinci yarıda gri saçlı figür bir kez bile yok.' },
  ayna:        { kisa:'Bardakta iki diş fırçası. Çocuğunkinin kılları hiç kullanılmamış gibi dimdik.' },
  mucevher:    { kisa:'Yağlı kâğıtta bir tutam açık kahve çocuk saçı: 11.01.1999. Altında pirinç bir anahtar.' },

  /* Tam ekran açanlar — hikâyenin omurgası */
  fotograf:      { panel:true, tut:[0,1,2] },
  cizelge:       { panel:true, tut:[0,1,3] },
  pamuk:         { panel:true, tut:[0,1,2] },
  duvar_kagidi:  { panel:true, tut:[1,2,4,5] },
  mektuplar_iade:{ panel:true, tut:[0,1,3] },
  mont:          { panel:true, tut:[0,1,2] },
  album:         { panel:true, tut:[1,2,3,4] },
  gazete:        { panel:true, tut:[0,1,3] },
  evraklar:      { panel:true, tut:[1,2,4,5], verir:null },
  sandik:        { panel:true, tut:[0,1,2,5] },
  sarnic:        { panel:true, tut:[1,2,3] },
};
for (const id in TEMPO) Object.assign(ESYALAR[id], TEMPO[id]);

/* ═══════════════════════════ ŞİFRELİ KİLİTLER ══════════════════════════ */

const KILITLER = {
  evraklar: {
    kod: '1101',
    baslik: 'Metal Evrak Kutusu',
    altyazi: 'Kapakta dört haneli pirinç kadran. Rakamlar aşınmış — bu kilit çok açılmış.',
    ipucu: 'Bu evde bir tarih her yerde tekrar ediyor: duran saatte, pervazdaki son çizgide, saç lülesinin kâğıdında.',
    ipucu2: 'Saat 11:01\'de durmuş. Pervazdaki son çizgi 11 Ocak 1999. Saç lülesinin kâğıdında da aynı gün. Gün, sonra ay.',
    ipucu3: 'Gün 11, ay Ocak. Dört hane: önce günün iki hanesi, sonra ayın iki hanesi.',
    acilinca: 'Kadran yerine oturuyor. Kapak, sanki yıllardır bunu bekliyormuş gibi kolayca kalkıyor.',
    yanlis: 'Kadran boşa dönüyor. Yanlış.',
  },
  bodrum_kapisi: {
    kod: '0203',
    baslik: 'Bodrum Asma Kilidi',
    altyazi: 'Dört haneli çevirmeli asma kilit. Dışarıdan takılmış.',
    ipucu: 'Bu kilit 11 Ocak değil — o tarih zaten evin her yerinde, saklamaya değmez. Anneannem başka bir gün seçmiş: yılda iki kez zarf yazdığı öteki gün. Gün, sonra ay.',
    ipucu2: 'Anneannenin odasındaki iade mektuplara bak. Kırk zarf, iki ayrı tarih. Biri 11 Ocak. Diğerini arıyorsun.',
    ipucu3: 'Aradığın gün, evraklardaki çocuğun doğum günü. UMUT — 02.03.1993. Gün, sonra ay.',
    acilinca: 'Kilit açılıyor. Elimde ağır ve soğuk duruyor. Bu tarihi onun seçmiş olması bir şey anlatıyor ama henüz ne olduğunu bilmiyorum.',
    yanlis: 'Klik. Açılmadı.',
  },
};

/* ═══════════════════════ GERİ SAYIM VE ÜÇÜNCÜ SON ══════════════════════ */

const GERISAYIM = {
  sure: 480,                         // saniye — evrak kutusu açılınca başlar
  olaylar: [
    { kalan: 470, metin: 'Telefon titredi. Açmıyorum. Açmama gerek yok — kırk bir saniyelik nefes sesini zaten dinledim.' },
    { kalan: 300, metin: 'Dışarıda bir araba. Farlar perdeden içeri vurdu, sonra söndü. Motor susmadı.' },
    { kalan: 170, metin: 'Motor sustu. Bahçe kapısı. Adımlar. Bu evde yirmi beş yıldır duyulmayan bir ses: birinin gelişi.' },
    { kalan:  75, metin: 'Anahtar. Kilit dönüyor. Annemin bu evin anahtarını hâlâ taşıdığını bilmiyordum.' },
    { kalan:  20, metin: 'İçeride. Adımı sesleniyor. Yanlış adımla.' },
  ],
};

FINAL.sonlar.yetisemedin = {
  baslik: 'SON — "Yetişemedin"',
  paragraflar: [
    'Merdivenin başında beni buluyor. Elimde bir metal kutu, içinde iki nüfus kaydı ve tanımadığım bir çocuğun fotoğrafı var.',
    'Kutuyu elimden alıyor. Zorla değil — uzatıyor elini, ben veriyorum. Otuz üç yıldır ona bir şey uzatıldığında almayı öğrenmişim.',
    '"Bunlar anneannenin saçmalıkları," diyor. Sesi çok sakin. "O kadın yıllarca uydurdu bunları. Sana hep söyledim."',
    'Ve ben, bir an için, ona inanıyorum. En kötüsü bu: inanmak hâlâ daha kolay.',
    'Ev üç ay sonra satıldı. Bodruma hiç inmedim. Sarnıcın üstündeki taşı hiç görmedim.',
    'Bazen 2 Mart\'ta uyanıyorum ve sebebini bilmiyorum. Sadece o gün, bütün gün, birinin beni beklediğini hissediyorum.',
  ],
};

/* Varlık yakaladığında gösterilen satırlar */
const YAKALANDI = [
  'Karanlık. Bir el değil — sadece soğuk. Gözümü açtığımda bir önceki odadayım ve nefesim yetişmiyor.',
  'Bir şey yanımdan geçti. Geçmedi de: içimden geçti. Nerede olduğumu bir an unuttum.',
  'Kalp atışım kulağımda. Geri çekilmişim. Ne zaman, hatırlamıyorum.',
];

const VARLIK_FISILTI = [
  'Üst kattan bir tahta gıcırdadı. Yukarıda kimse yok.',
  'Koridorun ucunda bir şey duruyordu. Feneri çevirdiğimde yoktu.',
  'Adımlar. Benimkilerden küçük.',
  'Fener titredi. Pil değil bu.',
];

/* ═════════════════════════════ ARA SAHNELER ═════════════════════════════
   Kamera evin içinde gezer; her plan bir çekim. Koordinatlar ev
   düzlemine göre (x: 0–15 batı→doğu, z: 0–12 kuzey→güney).
   ═════════════════════════════════════════════════════════════════════════ */

const SAHNELER = {
  acilis: [
    { baslangic: [7.9, 1.72, 10.6], bitis: [7.0, 1.80, 9.9],
      bak: [5.70, 1.95, 9.60], sure: 6.0, fener: 6.5, seslendir: false,
      yazi: 'Anneannem üç hafta önce öldü. Bu saat, onu bulduklarından çok daha önce durmuş.' },

    { baslangic: [13.9, 1.55, 4.1], bitis: [12.7, 1.20, 3.1],
      bak: [11.60, 0.62, 2.50], sure: 6.0, fener: 7.0,
      yazi: 'Onu koltuğunda buldular. Üç gün sonra. Kapıyı komşu kırmış.' },

    { baslangic: [8.9, 1.60, 7.6], bitis: [8.1, 1.70, 6.1],
      bak: [6.40, 1.20, 5.20], bakBitis: [6.40, 2.60, 2.60], sure: 6.5, fener: 8.0,
      yazi: 'Evi bana bıraktı. Sadece bana. Annem ve dayım avukatı üç kez aradı, sonuç değişmedi.' },

    { baslangic: [7.5, 1.68, 11.75], bitis: [7.5, 1.68, 10.90],
      bak: [7.5, 1.55, 8.0], sure: 5.0, fener: 9.0,
      yazi: 'Kavaklı Sokak No. 7. Çocukluğumun evi. Elimde bir envanter defteri var ve tek işim içerideki her şeyi yazmak.' },
  ],

  /* Finaller — sarnıç odasında başlar (bodrum kotu y = −2.6) */
  son_yaz: [
    { baslangic: [7.2, -0.75, 6.4], bitis: [7.2, -1.55, 5.15],
      bak: [7.20, -2.45, 4.30], sure: 5.5, fener: 8.5,
      yazi: 'Kalemi tutuyorum. İlk harfte elim duruyor — otuz üç yıllık bir kas hafızası D yazmak istiyor.' },
    { baslangic: [7.2, -1.55, 5.15], bitis: [7.2, -1.30, 4.95],
      bak: [7.20, -2.45, 4.30], sure: 4.5, fener: 10.0,
      yazi: 'U — M — U — T.' },
    { baslangic: [7.2, -1.30, 4.95], bitis: [7.2, -0.60, 5.60],
      bak: [7.20, -2.45, 4.30], bakBitis: [7.20, -0.50, 2.20], sure: 6.0, fener: 7.0,
      yazi: 'Sarnıcın taşını açtırdım. İçi boştu. Zaten yıllardır boştu. Ama artık kapalı da değil.' },
    { baslangic: [4.4, -1.05, 5.60], bitis: [1.9, -1.05, 5.30],
      bak: [1.80, -1.85, 5.20], sure: 6.0, fener: 5.5, ton: 'soguk',
      yazi: 'Annem kapıda bekledi. İçeri girmedi. Kırk dakika sonra arabaya bindi ve gitti; bir kez bile arkasına bakmadı.' },
    { baslangic: [7.5, 1.68, 10.2], bitis: [7.5, 1.68, 11.5],
      bak: [7.50, 1.55, 12.0], sure: 7.0, fener: 4.0, ton: 'kirilgan',
      yazi: 'Mezar taşına iki isim yazdırdım. Üstte benimki değil. Otuz üç yıl sonra ilk kez, bir çocuğun adı yazılı bir yer var bu dünyada.' },
  ],

  son_imzala: [
    { baslangic: [7.2, -1.35, 5.10], bitis: [7.2, -1.10, 5.90],
      bak: [7.20, -2.45, 4.30], sure: 5.0, fener: 8.0,
      yazi: 'Formun altına imzamı atıyorum. D E N İ Z  A Y D I N.' },
    { baslangic: [6.4, -1.10, 6.10], bitis: [3.6, -1.05, 5.60],
      bak: [5.50, -1.60, 4.60], bakBitis: [1.90, -1.90, 5.20], sure: 6.5, fener: 6.5,
      yazi: 'Kutuyu kapatıyorum. Sandığı yerine koyuyorum. Merdiveni çıkarken arkama bakmıyorum.' },
    { baslangic: [7.5, 1.68, 9.6], bitis: [7.5, 1.68, 11.4],
      bak: [7.50, 1.60, 12.0], sure: 5.5, fener: 5.0,
      yazi: 'Ev üç ay sonra satıldı. Alıcı bahçeyi düzledi, sarnıcın üstüne beton döktü.' },
    { baslangic: [11.6, 1.62, 2.5], bitis: [10.2, 1.62, 2.5],
      bak: [7.10, 1.30, 4.50], sure: 6.0, fener: 4.5, ton: 'soguk',
      yazi: 'Annem her pazar arıyor. Konuşuyoruz. Hava, iş, trafik. Yirmi dakika, hiç aksatmadan, bir daha hiçbir şey sormadan.' },
    { baslangic: [7.5, 4.82, 5.0], bitis: [7.5, 4.82, 3.2],
      bak: [9.40, 4.90, 3.05], sure: 7.0, fener: 3.5, ton: 'kirilgan',
      yazi: 'Bazen gece uyanıyorum ve adımı hatırlamak için birkaç saniye düşünmem gerekiyor. Sonra hatırlıyorum. Sonra tekrar uyuyorum.' },
  ],

  son_yetisemedin: [
    { baslangic: [6.6, 4.55, 2.6], bitis: [6.6, 4.35, 3.4],
      bak: [7.00, 1.40, 8.40], sure: 5.5, fener: 6.0,
      yazi: 'Merdivenin başındayım. Aşağıda ışık yok ama biri var.' },
    { baslangic: [6.6, 4.35, 3.4], bitis: [6.5, 3.10, 5.4],
      bak: [7.30, 0.90, 8.60], sure: 6.0, fener: 7.5,
      yazi: 'Elimde bir metal kutu, içinde iki nüfus kaydı ve tanımadığım bir çocuğun fotoğrafı var.',
      baslarken: () => Sinema.siluet(7.4, 0, 9.2, 1.30, Math.PI) },
    { baslangic: [6.5, 2.30, 6.6], bitis: [6.9, 1.85, 7.9],
      bak: [7.40, 0.95, 9.20], sure: 6.0, fener: 8.5,
      yazi: 'Elini uzatıyor. Ben veriyorum. Otuz üç yıldır bana bir şey uzatıldığında almayı öğrenmişim — ve verilmesi gerektiğinde vermeyi.' },
    { baslangic: [7.6, 1.70, 9.8], bitis: [7.9, 1.70, 11.0],
      bak: [7.60, 1.55, 11.9], sure: 6.0, fener: 2.5, ton: 'endiseli',
      yazi: 'Kapıyı o kapattı. Ben çıkarken elimde hiçbir şey yoktu. Bir soru bile.',
      baslarken: () => Sinema.siluet(7.5, 0, 10.4, 1.34, 0) },
    { baslangic: [7.5, 1.66, 11.2], bitis: [7.5, 1.66, 10.4],
      bak: [5.70, 1.90, 9.60], sure: 7.0, fener: 3.0, ton: 'soguk',
      yazi: 'Saat hâlâ 11:01. Kimse kurmadı. Kimse kurmayacak. Ve ben o gece ne bulduğumu ertesi sabah unutmuştum.' },
  ],
};

/* ═════════════════════════ EK EŞYALAR (v2) ══════════════════════════════
   Boş kalan odaları dolduran ve hikâyeyi derinleştiren yedi kayıt.
   ═════════════════════════════════════════════════════════════════════════ */

Object.assign(ESYALAR, {

  ecza_dolabi: {
    ad: 'Ecza Dolabı',
    oda: 'Banyo',
    katalog: 'Aynalı dolabın içi. Beş ilaç kutusu, üçü boş. İki reçete etiketi hâlâ okunuyor.',
    beats: [
      { t:'gozlem', s:'İki şurup kutusu. İkisinde de aynı isim yazıyor: DENİZ AYDIN.' },
      { t:'kupur', s:'ETİKET 1 — düzenleme 04.11.1997 · hasta doğum tarihi 14.03.1993 · veli: SEVİL AYDIN' },
      { t:'kupur', s:'ETİKET 2 — düzenleme 22.01.2001 · hasta doğum tarihi 02.03.1993 · veli: NESRİN AYDIN' },
      { t:'celiski', s:'Aynı isim, aynı çocuk, iki farklı doğum tarihi. Eczacı hatası değil — ikisi de bir hekimin kaydından geliyor. Ve ikincisini yazdıran anneannem.' },
      { t:'ses', s:'Beni doktora götürdüğünde ona bu tarihi kim söyledi? Ve o, nereden biliyordu?' },
    ],
    panel: true, tut: [0, 1, 2, 3], bayrak: 'f_ecza',
    yanki: 'Baştan beri biliyordu. İlk günden. Doktorun kaydına yazdırdığı tarih, yirmi üç yıl sonra zarfların üstüne yazacağı tarihin aynısı.',
  },

  hesap_defteri: {
    ad: 'Kareli Hesap Defteri',
    oda: 'Sandık Odası',
    katalog: 'Raf üstünde kareli hesap defteri. Dayımın el yazısı. Kırk sayfanın otuz dokuzu boş.',
    beats: [
      { t:'gozlem', s:'Tek dolu sayfa. Üstünde tarih aralığı var: Eylül–Kasım 1999. Altında kalemle yazılmış bir masraf listesi.' },
      { t:'kupur', s:'Bolu — yol ve konaklama (3 kez)\nSosyal Hizmetler — dosya sureti\nNüfus Md. — kayıt düzeltme\nAvukat B. — danışma, 2 saat\nMatbu evrak, harç, vesikalık\n──────────────\nTOPLAM' },
      { t:'celiski', s:'Kalemler bir tadilat listesi gibi yazılmış. Sıradan, sabırlı, düzenli. Bir çocuğun yerine başka bir çocuk koymanın da bir maliyeti varmış — ve dayım onu kuruşuna kadar yazmış.' },
      { t:'ses', s:'Son satırın altında tek not: "S. ödedi. Kapandı."' },
    ],
    panel: true, tut: [0, 1, 2], bayrak: 'f_hesap',
  },

  takvim: {
    ad: '1999 Duvar Takvimi',
    oda: 'Mutfak',
    katalog: 'Mutfak kapısının arkasında asılı takvim. Yılı: 1999. Sayfaları yırtılmamış — biri hariç.',
    kisa: 'Duvarda hâlâ 1999 takvimi asılı. Ocak sayfası koparılmış; kalan on bir ay bomboş.',
    beats: [
      { t:'gozlem', s:'Ocak sayfası yok. Koparılmış; kâğıt payı hâlâ telde duruyor.' },
      { t:'gozlem', s:'Şubat\'tan Aralık\'a kadar bütün sayfalar yerinde ve hepsi bomboş. Tek bir randevu, tek bir doğum günü, tek bir çizik yok.' },
      { t:'celiski', s:'Bir takvim üstüne hiçbir şey yazılmadığında da bir şey anlatır: o yıl bu evde kimse ileriye dair hiçbir şey planlamamış.' },
      { t:'ses', s:'Ve 2000\'de değiştirilmemiş. Yirmi altı yıldır bu duvarda aynı yıl asılı duruyor.' },
    ],
  },

  bayram_fotografi: {
    ad: 'Bayram Fotoğrafı, 2000',
    oda: 'Salon',
    katalog: 'Vitrinin üstünde ayaklı çerçeve. Renkli baskı, rengi dönmüş. Arka kapakta kurşun kalemle tek kelime.',
    beats: [
      { t:'ani', s:'Bunu hatırlıyorum. Bayram sabahı, herkes toplanmıştı, ben en öndeydim.' },
      { t:'gozlem', s:'Sekiz kişi var. Yedisi birbirine yaslanmış, kollar omuzlarda, aralarında boşluk yok. Bir tanesi — çocuk olan — yarım adım geride duruyor ve kimseye değmiyor.' },
      { t:'gozlem', s:'Anneannem karede yok. Fotoğrafı çeken o.' },
      { t:'celiski', s:'Arka kapakta, onun el yazısıyla, tek kelime: "misafir".' },
    ],
    panel: true, tut: [1, 2, 3], bayrak: 'f_bayram',
    yanki: 'Bana bir ad vermeyi reddetti ama yalan da söylemedi. O evde beni tarif eden tek dürüst kelime, o fotoğrafın arkasındaydı.',
  },

  sokulmus_karyola: {
    ad: 'Sökülmüş Çocuk Karyolası',
    oda: 'Bodrum',
    katalog: 'Duvara dayalı, sökülmüş bir çocuk karyolasının parçaları. Vidalar ayrı bir bez torbada, numaralandırılmış.',
    beats: [
      { t:'gozlem', s:'Vidalar torbada duruyor, her biri kâğıda numarayla iliştirilmiş. Kim bir karyolayı sökerken vidalarını numaralandırır?' },
      { t:'gozlem', s:'Yan tahtanın iç yüzünde kurşun kalemle bir not var — pervazdaki el, pervazdaki kalem. Ve bir tarih: 13.01.1999.' },
      { t:'celiski', s:'On üç Ocak. Cenazeden bir gün sonra. Birisi o gün aşağı indi, bu yatağı söktü, vidalarını numaraladı ve sakladı. Atmadı — bir gün geri kurulabilsin diye.' },
    ],
    panel: true, tut: [0, 1, 2], bayrak: 'f_karyola',
  },

  asi_karti: {
    ad: 'Aşı Kartı',
    tarihNotu: 'Aşı kartı: DENİZ AYDIN — Doğum 14.03.1993. İlk kayıt Kasım 1999.',
    oda: 'Tavan Arası',
    katalog: 'Plastik kılıf içinde sararmış aşı kartı. Ad hanesi doldurulmuş, tarih hanelerinin ilk yarısı boş.',
    kisa: 'Aşı kartındaki ilk kayıt Kasım 1999 — altı yaşında. Öncesindeki bütün yıllar boş.',
    beats: [
      { t:'kupur', s:'DENİZ AYDIN — Doğum: 14.03.1993' },
      { t:'gozlem', s:'İlk aşı kaydının tarihi: Kasım 1999. Sonrasında hepsi arka arkaya, birkaç ay içinde tamamlanmış.' },
      { t:'celiski', s:'Bir çocuğun aşı kartı doğduğu hafta açılır. Bunda ilk altı yıl bomboş. Sanki o çocuk altı yaşında doğmuş gibi.' },
      { t:'ses', s:'Kartın arkasında, farklı bir kalemle tek satır: "önceki kayıt bulunamadı".' },
    ],
  },

  /* ── GİZLİ: yalnızca duvar kâğıdı ve ayı incelendikten sonra görünür ── */
  gizli_bolme: {
    ad: 'Gevşek Döşeme Tahtası',
    oda: 'Çocuk Odası',
    katalog: 'Karyolanın altında, döşemede oynayan bir tahta. Ucundaki çivi bir kere sökülmüş ve bir daha çakılmamış.',
    gizli: ['f_duvar', 'f_pamuk'],
    beats: [
      { t:'gozlem', s:'Tahtayı kaldırıyorum. Altında teneke bir bisküvi kutusu var. Kapağı pas yapmış ama kolayca açılıyor — çok açılmış.' },
      { t:'gozlem', s:'İçinde: dört cam bilye, kurumuş bir yaprak, bir otobüs bileti (Bolu–Mudurnu, 1999), ve dörde katlanmış bir resim.' },
      { t:'gozlem', s:'Resimde üç figür var. Bir büyük, bir orta, bir küçük. Küçüğün elini gri saçlı olan tutuyor.' },
      { t:'celiski', s:'Çizim ikinci elin: sert baskı, kapalı çizgiler, imzasız. Yani bunu ben çizmişim. Ve çizdiğim tek şey, resim defterine hiç koymadığım şeymiş — ona tutunan bir el.' },
      { t:'ses', s:'Sonra kaldırıp yerin altına saklamışım. Altı yaşındaki bir çocuk bir şeyi neden saklar? Çünkü görülürse elinden alınacağını bilir.' },
    ],
    panel: true, tut: [0, 1, 2, 3], bayrak: 'f_gizli',
    yanki: 'O kutu yirmi beş yıl orada kaldı. Anneannem tahtanın çivisini bir daha hiç çakmadı.',
  },
});

/* ── Gizli bulgu, kapanışa fazladan bir paragraf ekler ─────────────────── */
FINAL.gizliEk = 'Bisküvi kutusunu yanıma aldım. İçindekiler bir çocuğun bütün serveti: dört bilye, bir yaprak, bir bilet ve tutulan bir el. Otuz üç yıl sonra hâlâ aynı serveti taşıyorum, sadece kutusu değişti.';

/* ── Hedef göstergesi: oyuncu ne yapacağını bilsin ─────────────────────── */
const HEDEFLER = [
  { kosul: d => !d.anahtarVar('key_kiler'),
    metin: 'Anneannenin oturma odasına bak — kilerin anahtarı orada bir yerde.' },
  { kosul: d => !d.ustKat,
    metin: 'Zemin katı gez, sonra sofadaki merdivenden üst kata çık.' },
  { kosul: d => !d.anahtarVar('key_tavan'),
    metin: 'Anneannenin odasındaki tuvalet masasına bak.' },
  { kosul: d => !(Ev.kapilar.sandikodasi && Ev.kapilar.sandikodasi.acik),
    metin: 'Üst kattaki kilitli odayı aç — tavan arası oradan çıkıyor.' },
  { kosul: d => !d.kilitAcildi.evraklar,
    metin: 'Tavan arasındaki evrak kutusu dört haneli. Evdeki tarihleri hatırla.' },
  { kosul: d => !d.kilitAcildi.bodrum_kapisi,
    metin: 'Kilerdeki bodrum kilidi de dört haneli. Anneannemin seçtiği bir gün.' },
  { kosul: d => !d.bayrak.f_sandik,
    metin: 'Bodruma in ve çinko sandığı aç.' },
  { kosul: d => true,
    metin: 'Taş kemerin ardındaki sarnıca git.' },
];
