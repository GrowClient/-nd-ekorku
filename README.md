# MİRAS

**Kavaklı Sokak No. 7 — Mudurnu, Bolu · Temmuz 2026**

Tek mekânda geçen, birinci şahıs, yavaş yanan bir psikolojik korku oyunu.
Anneannenden kalan evi satış için kataloglamaya gelirsin. Elindeki tek şey bir
envanter defteridir. Aldığın her eşya bir anı tetikler — ama anılar evle
uyuşmaz. Korku burada bir yaratıktan değil, **anlatıcının güvenilmezliğinin
mekâna yayılmasından** gelir.

Tarayıcıda çalışır. Kurulum yok, indirme yok, internet gerekmez.

---

## Nasıl oynanır

**En kolay yol:** `index.html` dosyasına çift tıkla. Hepsi bu.

Yerel sunucu tercih edersen:

```bash
python3 -m http.server 8000
# sonra: http://localhost:8000
```

### Kontroller

| Tuş | İşlev |
|---|---|
| `W A S D` | yürü |
| Fare | bak (tıklayınca imleç kilitlenir) |
| `Shift` | koş |
| `E` | incele / kapı aç |
| `Boşluk` | anı metnini ilerlet |
| `F` | el feneri |
| `Tab` | envanter defteri (bir satıra tıkla → o eşyanın tam kaydı) |
| `M` | Türkçe seslendirmeyi aç/kapat |
| `Esc` | imleci bırak |

---

## Oyunun içinde ne var

- **Gerçek 3B ev** — dört kat: bodrum, zemin, üst kat, tavan arası. On üç
  mekân, çalışan merdivenler, kilitli kapılar, anahtar ilerleyişi.
- **29 kataloglanabilir eşya.** Her biri üç katmanlı: kuru bir *eksper notu*,
  senin *anın*, ve ikisi arasındaki *çelişki*.
- **Okuma zorlamaz.** Çoğu eşya oyunu durdurmaz — ekranın altında tek satır
  geçer. Yalnızca hikâyenin omurgasındaki 11 eşya tam ekran açar. Tam
  metinler envanter defterinden istendiği zaman okunur.
- **Evde bir şey var.** Belli bir noktadan sonra bakılmadığı sürece yaklaşan
  bir varlık. Feneri üstüne tutarsan donar, sonra çekilir. Yakalarsa
  öldürmez — ekran kararır, birkaç saniye önceki yerinde uyanırsın.
- **Geri sayım.** Gerçeği öğrendiğin an annen yola çıkar. Sekiz dakikan var.
- **İki şifreli kilit.** Kod verilmez; evdeki tarihlerden çıkarılır.
- **Türkçe seslendirme.** Annenin sesli mesajları tarayıcının konuşma
  motoruyla okunur (tr-TR). Türkçe ses yoksa sessizce yazıya düşer.
- **Değişen anılar.** Gerçeğin bir kısmını öğrendikten sonra aynı eşyaya
  tekrar bakarsan anı değişir — "yankı" bloğu açılır. Oyunun ana mekaniği bu.
- **Annenin sesli mesajları** — ilerledikçe tonu değişen bir karşı anlatıcı.
- **Belirsiz doğaüstü.** Ev sessizce değişir: koridorda bir çerçeve daha
  boşalır, koltuk döner, ampuller söner, üst kattan bir ninni duyulur.
  Hiçbiri kanıtlanmaz; hepsi hafıza bozulmasıyla da açıklanabilir.
- **Ara sahneler.** Açılış ve üç finalin her biri motor içi kamera
  yolculuğu: siyah bantlar, altyazı, evin içinde yavaş çekimler. Video
  dosyası yok — kamera gerçekten evin içinde geziyor. BOŞLUK ile geçilir.
- **Üç final** — ikisi seçimle, biri yetişemezsen.

Kabaca **25–40 dakikalık** bir demo.

Ölüm yok, oyun bitmez, hiçbir şey kaybetmezsin — ama ilk yarıdaki
sessizlik ikinci yarıda bozuluyor.

---

## Teknik

- **Bağımlılık:** yalnızca three.js r160 (`vendor/three.min.js` içinde gelir).
- **Hiç dış varlık dosyası yok.** Bütün dokular `<canvas>` üzerinde
  prosedürel çizilir (ahşap döşeme, duvar kâğıdı, sıva, taş, karo, halı,
  eski fotoğraf). Bütün sesler WebAudio ile sentezlenir — adım, gıcırtı,
  su damlası, kalp atışı, telefon titreşimi ve mırıldanılan ninni dâhil.
- **Son işlem katmanı** (`postfx.js`): ACES ton eşleme, film greni, vinyet,
  kenar renk sapması, gerilime bağlı doygunluk düşüşü — hepsi tek geçişte.
- Işık: el feneri (gölge veren tek ışık), ay ışığı, titreyen ampuller.
- Çarpışma: eksen hizalı kutular; kat geçişi bir yükseklik-alanı ile
  (rampalar + bölgeler) çözülür, böylece merdivenler ve üst üste binen katlar
  aynı XZ düzleminde sorunsuz çalışır.

### Dosyalar

```
index.html
css/style.css
vendor/three.min.js       three.js r160 (UMD)
js/
  data.js                 bütün metinler: eşyalar, anılar, mesajlar, finaller
  state.js                oyun durumu, bayraklar, senaryo olayları
  textures.js             prosedürel dokular
  props.js                malzemeler + mobilya üreticileri
  house.js                evin geometrisi, çarpışma, kat sistemi, yerleşim
  varlik.js               evde dolaşan şey: doğuş, yaklaşma, donma, yakalama
  sinema.js               motor içi ara sahneler (kamera yolculuğu + altyazı)
  audio.js                WebAudio ses sentezi + Türkçe seslendirme
  ui.js                   HUD, anı paneli, envanter defteri, final
  player.js               kontroller, çarpışma, el feneri
  postfx.js               son işlem şaderi
  main.js                 kurulum, oyun döngüsü, etkileşim
```

Hikâyeye dokunmadan metinleri değiştirmek istersen tek dosya yeterli:
`js/data.js`. Motor o dosyayı yalnızca okur.

---

## Uyarı

Oyun çocuk ölümü, yas, hafıza manipülasyonu ve aile içi istismar temalarını
işler. Şiddet gösterilmez; her şey eşyalar ve belgeler üzerinden anlatılır.

**Sürprizi bozmak istemiyorsan `HIKAYE.md` dosyasını açma.**
