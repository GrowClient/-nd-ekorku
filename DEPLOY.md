# Google Cloud'a Kurulum — Cloud Run + Cloud SQL

barkERP'i Google Cloud üzerinde çalıştırmak için baştan sona adımlar.
Komutları sırayla çalıştırabilirsiniz; her adımın ne yaptığı açıklanmıştır.

> **Not:** Bu dosyadaki komutlar bilgisayarınızda `gcloud` ile çalıştırılır.
> Hiçbir gizli bilgi repoya yazılmaz; şifreler Secret Manager'da saklanır.

---

## 0) Değişkenleri belirle

Aşağıdaki değerleri kendinize göre değiştirip terminalde tanımlayın.
Sonraki tüm komutlar bunları kullanır.

```bash
export PROJE_ID="barkerp-prod"              # Google Cloud proje kimliği
export BOLGE="europe-west1"                 # Belçika. Alternatif: europe-west3 (Frankfurt)
export SERVIS="barkerp"                     # Cloud Run servis adı
export SQL_ORNEK="barkerp-db"               # Cloud SQL örnek adı
export DB_ADI="barkerp"                     # Veritabanı adı
export DB_KULLANICI="barkerp_app"           # Uygulamanın kullandığı DB kullanıcısı
export REPO="barkerp-repo"                  # Artifact Registry deposu

gcloud config set project "$PROJE_ID"
```

Bağlantı adı (`PROJE:BOLGE:ORNEK`) sık kullanılacak:

```bash
export SQL_BAGLANTI="${PROJE_ID}:${BOLGE}:${SQL_ORNEK}"
```

---

## 1) Ön koşullar

```bash
# gcloud kurulu değilse: https://cloud.google.com/sdk/docs/install
gcloud auth login
gcloud projects create "$PROJE_ID"          # proje yoksa
# Faturalandırma hesabını projeye bağlayın (konsoldan da yapılabilir):
gcloud billing accounts list
gcloud billing projects link "$PROJE_ID" --billing-account=FATURA_HESABI_ID
```

### Gerekli API'leri aç

```bash
gcloud services enable \
  run.googleapis.com \
  sqladmin.googleapis.com \
  secretmanager.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com
```

---

## 2) Cloud SQL for PostgreSQL örneğini oluştur

```bash
# Geliştirme/küçük üretim için ekonomik bir başlangıç
gcloud sql instances create "$SQL_ORNEK" \
  --database-version=POSTGRES_16 \
  --tier=db-f1-micro \
  --region="$BOLGE" \
  --storage-size=10GB \
  --storage-auto-increase \
  --backup-start-time=02:00 \
  --availability-type=ZONAL
```

> Gerçek üretim yükü için `--tier=db-custom-1-3840` ve
> `--availability-type=REGIONAL` (yüksek erişilebilirlik) önerilir.
> Örneği sonradan büyütebilirsiniz.

### Veritabanı ve uygulama kullanıcısı

```bash
gcloud sql databases create "$DB_ADI" --instance="$SQL_ORNEK"

# Güçlü bir şifre üretin ve saklayın
export DB_SIFRE="$(openssl rand -base64 24)"
gcloud sql users create "$DB_KULLANICI" \
  --instance="$SQL_ORNEK" \
  --password="$DB_SIFRE"

echo "DB şifresi (bir kere görünür, Secret Manager'a yazılacak): $DB_SIFRE"
```

> **Genel IP gerekmez.** Cloud Run, Cloud SQL'e Unix soketi üzerinden bağlanır.
> Örneğin genel IP'sini kapatarak saldırı yüzeyini küçültebilirsiniz:
> `gcloud sql instances patch "$SQL_ORNEK" --no-assign-ip`
> (Bu durumda migration için Cloud SQL Auth Proxy kullanın — bkz. Adım 6.)

---

## 3) Gizli bilgileri Secret Manager'a yaz

```bash
# Auth.js oturum anahtarı
openssl rand -base64 32 | gcloud secrets create barkerp-auth-secret \
  --replication-policy=automatic --data-file=-

# Veritabanı bağlantı adresi (Cloud Run için Unix soketi biçimi)
printf 'postgresql://%s:%s@localhost/%s?host=/cloudsql/%s&schema=public&connection_limit=5' \
  "$DB_KULLANICI" "$DB_SIFRE" "$DB_ADI" "$SQL_BAGLANTI" \
  | gcloud secrets create barkerp-database-url \
      --replication-policy=automatic --data-file=-
```

> `connection_limit=5`: Cloud Run birçok kopya açabilir. Her kopya sınırsız
> bağlantı isterse Cloud SQL'in bağlantı limiti dolar. 5 makul bir başlangıçtır.

### Cloud Run servis hesabına okuma izni ver

```bash
export PROJE_NO="$(gcloud projects describe "$PROJE_ID" --format='value(projectNumber)')"
export SA="${PROJE_NO}-compute@developer.gserviceaccount.com"

for GIZLI in barkerp-auth-secret barkerp-database-url; do
  gcloud secrets add-iam-policy-binding "$GIZLI" \
    --member="serviceAccount:${SA}" \
    --role="roles/secretmanager.secretAccessor"
done

# Cloud SQL'e bağlanma izni
gcloud projects add-iam-policy-binding "$PROJE_ID" \
  --member="serviceAccount:${SA}" \
  --role="roles/cloudsql.client"
```

---

## 4) İmajı derle ve Artifact Registry'ye yükle

```bash
gcloud artifacts repositories create "$REPO" \
  --repository-format=docker --location="$BOLGE"

export IMAJ="${BOLGE}-docker.pkg.dev/${PROJE_ID}/${REPO}/${SERVIS}"

# Proje kökünde çalıştırın (Dockerfile burada)
gcloud builds submit --tag "$IMAJ:v0.1.0-auth"
```

Depodaki `Dockerfile` çok aşamalı çalışır: bağımlılıklar → derleme →
yalnızca çalıştırma dosyalarını içeren küçük bir Alpine imajı. Next.js
`standalone` çıktısı ve Prisma sorgu motoru imaja dahil edilir.

---

## 5) Cloud Run'a dağıt

```bash
gcloud run deploy "$SERVIS" \
  --image="$IMAJ:v0.1.0-auth" \
  --region="$BOLGE" \
  --platform=managed \
  --allow-unauthenticated \
  --port=8080 \
  --add-cloudsql-instances="$SQL_BAGLANTI" \
  --set-secrets="DATABASE_URL=barkerp-database-url:latest,AUTH_SECRET=barkerp-auth-secret:latest" \
  --min-instances=0 \
  --max-instances=10 \
  --cpu=1 --memory=512Mi \
  --timeout=60
```

Dağıtım bitince servis adresi yazdırılır, örn.
`https://barkerp-xxxxxxxx-ew.a.run.app`.

### Uygulama adresini ortam değişkeni olarak ver

Auth.js'in doğru yönlendirme ve **güvenli çerez** üretmesi için adres
gereklidir. İlk dağıtımdan sonra:

```bash
export SERVIS_URL="$(gcloud run services describe "$SERVIS" --region="$BOLGE" --format='value(status.url)')"

gcloud run services update "$SERVIS" --region="$BOLGE" \
  --set-env-vars="AUTH_URL=${SERVIS_URL},NEXT_PUBLIC_APP_URL=${SERVIS_URL}"
```

> `AUTH_URL` **https** ile başladığı için oturum çerezleri otomatik olarak
> `Secure` işaretlenir. Özel alan adı bağlarsanız bu değerleri güncelleyin.

---

## 6) Veritabanı şemasını uygula (migration)

Migration'lar uygulama açılışında **otomatik çalışmaz** — bilinçli bir
tercihtir; birden fazla kopya aynı anda şema değiştirmeye çalışmasın diye.
Şemayı elle uygularsınız:

```bash
# 1) Cloud SQL Auth Proxy'yi indirin (bir kere)
#    https://cloud.google.com/sql/docs/postgres/sql-proxy
cloud-sql-proxy "$SQL_BAGLANTI" --port 5433 &

# 2) Migration'ları uygulayın
DATABASE_URL="postgresql://${DB_KULLANICI}:${DB_SIFRE}@127.0.0.1:5433/${DB_ADI}?schema=public" \
  npx prisma migrate deploy

# 3) Proxy'yi kapatın
kill %1
```

`migrate deploy` yalnızca `prisma/migrations/` altındaki hazır dosyaları
uygular; şema üretmez, veri silmez. Yeni bir aşamada şema değişirse önce
yerelde `npm run db:migrate` ile migration üretip repoya ekleyin, sonra
üretimde `migrate deploy` çalıştırın.

---

## 7) Google OAuth'u üretime aç

<https://console.cloud.google.com/apis/credentials> → OAuth 2.0 istemciniz →
**Yetkili yönlendirme URI'leri** listesine ekleyin:

```
https://SERVIS-ADRESINIZ/api/auth/callback/google
```

Ardından anahtarları servise verin:

```bash
echo -n "ISTEMCI_KIMLIGI.apps.googleusercontent.com" | \
  gcloud secrets create barkerp-google-id --replication-policy=automatic --data-file=-
echo -n "ISTEMCI_GIZLI_ANAHTARI" | \
  gcloud secrets create barkerp-google-secret --replication-policy=automatic --data-file=-

for GIZLI in barkerp-google-id barkerp-google-secret; do
  gcloud secrets add-iam-policy-binding "$GIZLI" \
    --member="serviceAccount:${SA}" --role="roles/secretmanager.secretAccessor"
done

gcloud run services update "$SERVIS" --region="$BOLGE" \
  --update-secrets="AUTH_GOOGLE_ID=barkerp-google-id:latest,AUTH_GOOGLE_SECRET=barkerp-google-secret:latest"
```

Servis yeniden başladığında "Google ile giriş" butonu kendiliğinden görünür.
Anahtarlar tanımlı değilse buton gizlenir ve uygulama şifreyle çalışmaya
devam eder.

**OAuth onay ekranı:** Yalnızca kendi kurumunuz kullanacaksa
"Dahili (Internal)", herkese açacaksanız "Harici (External)" seçin. Harici
seçimde Google doğrulaması gerekebilir.

---

## 8) Özel alan adı (isteğe bağlı)

```bash
gcloud beta run domain-mappings create \
  --service="$SERVIS" --domain=erp.alanadiniz.com --region="$BOLGE"
```

Çıktıdaki DNS kayıtlarını alan adı sağlayıcınıza ekleyin. Sertifika Google
tarafından otomatik verilir. Sonrasında:

```bash
gcloud run services update "$SERVIS" --region="$BOLGE" \
  --set-env-vars="AUTH_URL=https://erp.alanadiniz.com,NEXT_PUBLIC_APP_URL=https://erp.alanadiniz.com"
```

Google OAuth yönlendirme URI'sini de yeni alan adıyla güncellemeyi unutmayın.

---

## 9) Yeni sürüm yayınlama

```bash
gcloud builds submit --tag "$IMAJ:v0.2.0"
gcloud run deploy "$SERVIS" --image="$IMAJ:v0.2.0" --region="$BOLGE"
```

Şema değiştiyse önce Adım 6'daki `migrate deploy` komutunu çalıştırın.
Cloud Run eski sürümü hemen kapatmaz; sorun olursa geri dönebilirsiniz:

```bash
gcloud run revisions list --service="$SERVIS" --region="$BOLGE"
gcloud run services update-traffic "$SERVIS" --region="$BOLGE" --to-revisions=ESKI_REVIZYON=100
```

---

## Kontrol listesi

- [ ] `AUTH_SECRET` ve `DATABASE_URL` Secret Manager'da, koda yazılmadı
- [ ] `AUTH_URL` **https** ile tanımlı (güvenli çerezler buna bağlı)
- [ ] Cloud Run servisine `--add-cloudsql-instances` verildi
- [ ] Servis hesabında `roles/cloudsql.client` ve `secretAccessor` var
- [ ] `prisma migrate deploy` çalıştırıldı
- [ ] Google OAuth yönlendirme URI'si üretim adresini içeriyor
- [ ] Cloud SQL genel IP kapalı (veya yetkili ağlar sınırlı)
- [ ] Cloud SQL yedeklemesi açık
- [ ] Çok kopyalı çalışacaksa hız sınırlayıcı Redis/Memorystore'a taşındı
      (bkz. `lib/rate-limit.ts`)
- [ ] E-posta sağlayıcısı `core/auth/mailer.ts` içine bağlandı

---

## Maliyet notları

- **Cloud Run**: `--min-instances=0` ile kullanılmadığında ücret çıkmaz, ama
  ilk istek soğuk başlangıç yaşar (~1-2 sn). Sürekli kullanılan bir ERP için
  `--min-instances=1` daha iyi bir deneyim verir.
- **Cloud SQL**: Örnek durdurulmadıkça 7/24 ücretlendirilir. Test ortamında
  `gcloud sql instances patch "$SQL_ORNEK" --activation-policy=NEVER` ile
  durdurabilirsiniz.

---

## Sorun giderme

| Belirti | Olası neden ve çözüm |
| --- | --- |
| `Can't reach database server` | `--add-cloudsql-instances` verilmemiş ya da `DATABASE_URL` içindeki `host=/cloudsql/...` yolu yanlış. |
| Girişten sonra tekrar giriş ekranına dönüyor | `AUTH_URL` https değil ya da tanımsız → çerez `Secure` işaretlenmiyor/eşleşmiyor. |
| `redirect_uri_mismatch` | Google Console'daki URI ile servis adresi birebir aynı olmalı (sondaki `/` dahil dikkat). |
| `Configuration` hatası | `AUTH_SECRET` eksik. |
| `too many connections` | `DATABASE_URL` içine `connection_limit=5` ekleyin, `--max-instances` değerini düşürün. |
| Derleme sırasında Prisma hatası | `npm run build` betiği `prisma generate` çalıştırır; `prisma/schema.prisma` imaja kopyalanıyor olmalı (`.dockerignore` kontrol edin). |
