# barkERP — Modüler SaaS ERP Çekirdeği

Çok kiracılı (multi-tenant) çalışan, sektör modülleri sonradan eklenebilen bir
ERP altyapısı.

> **Bu sürüm: `v0.1.0-auth`**
> Yalnızca **çekirdek mimari + kimlik doğrulama** içerir. Kafe/restoran,
> triko/tekstil, stok, satış ve muhasebe modülleri sonraki aşamalarda
> eklenecektir.

---

## İçindekiler

- [Teknoloji](#teknoloji)
- [Hızlı başlangıç](#hızlı-başlangıç)
- [Ortam değişkenleri](#ortam-değişkenleri)
- [PostgreSQL bağlantısı](#postgresql-bağlantısı)
- [Prisma migration](#prisma-migration)
- [Google OAuth ayarları](#google-oauth-ayarları)
- [Test kullanıcısı oluşturma](#test-kullanıcısı-oluşturma)
- [Üretim: Google Cloud SQL](#üretim-google-cloud-sql)
- [Klasör yapısı](#klasör-yapısı)
- [Güvenlik notları](#güvenlik-notları)
- [Sonraki aşamalar](#sonraki-aşamalar)

---

## Teknoloji

| Katman | Seçim |
| --- | --- |
| Çatı | Next.js 15 (App Router) |
| Dil | TypeScript |
| Arayüz | Tailwind CSS v4 |
| Sunucu işlemleri | Server Actions + Route Handler |
| Veritabanı | PostgreSQL (Google Cloud SQL uyumlu) |
| ORM | Prisma 6 |
| Kimlik doğrulama | Auth.js v5 (next-auth) |
| Şifre saklama | bcrypt (cost 12) |
| Form doğrulama | Zod |

Tarayıcı hiçbir zaman doğrudan veritabanına bağlanmaz; tüm sorgular sunucu
tarafında çalışır.

---

## Hızlı başlangıç

```bash
# 1) Bağımlılıklar
npm install

# 2) Ortam değişkenleri
cp .env.example .env
#    .env içindeki DATABASE_URL ve AUTH_SECRET alanlarını doldurun.
#    AUTH_SECRET üretmek için:
openssl rand -base64 32

# 3) Veritabanı şemasını uygula
npx prisma migrate dev

# 4) Geliştirme sunucusu
npm run dev
```

Uygulama <http://localhost:3000> adresinde açılır. İlk ekran `/login`'dir;
hesabınız yoksa `/register` üzerinden firmanızı oluşturabilirsiniz.

### Kullanılabilir komutlar

| Komut | Açıklama |
| --- | --- |
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` | Prisma client üretir + üretim derlemesi yapar |
| `npm run start` | Üretim sunucusu (önce `build`) |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript tip kontrolü |
| `npm run db:migrate` | Yeni migration oluşturur ve uygular (geliştirme) |
| `npm run db:deploy` | Mevcut migration'ları uygular (üretim) |
| `npm run db:studio` | Prisma Studio |

---

## Ortam değişkenleri

Tümü `.env` dosyasında tutulur. **Gerçek anahtarlar asla repoya yazılmaz**;
örnek şablon için `.env.example` dosyasına bakın.

| Değişken | Zorunlu | Açıklama |
| --- | --- | --- |
| `DATABASE_URL` | ✅ | PostgreSQL bağlantı adresi |
| `AUTH_SECRET` | ✅ | Oturum jetonlarını imzalayan gizli anahtar (`openssl rand -base64 32`) |
| `AUTH_URL` | Üretimde ✅ | Uygulamanın dışarıdan erişilen adresi. `https://` ile başlarsa oturum çerezleri `Secure` işaretlenir. |
| `NEXT_PUBLIC_APP_URL` | ➖ | Şifre yenileme bağlantılarında kullanılan adres (varsayılan: `AUTH_URL`) |
| `AUTH_GOOGLE_ID` | ➖ | Google OAuth istemci kimliği |
| `AUTH_GOOGLE_SECRET` | ➖ | Google OAuth istemci gizli anahtarı |

> Google değişkenleri boş bırakılırsa "Google ile giriş" butonu **görünmez**;
> uygulama e-posta + şifre ile sorunsuz çalışmaya devam eder.

---

## PostgreSQL bağlantısı

### Yerel geliştirme

```bash
# Örnek: yerel PostgreSQL'de veritabanı oluşturma
createdb barkerp
```

`.env`:

```env
DATABASE_URL="postgresql://postgres:SIFRE@localhost:5432/barkerp?schema=public"
```

Docker ile hızlı kurulum:

```bash
docker run --name barkerp-db -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=barkerp -p 5432:5432 -d postgres:16
```

---

## Prisma migration

```bash
# Şemayı değiştirdikten sonra yeni migration üretir ve uygular
npm run db:migrate

# Yalnızca Prisma client'ı yeniden üretir
npm run db:generate

# Üretim ortamında mevcut migration'ları uygular (şema değişikliği üretmez)
npm run db:deploy
```

İlk migration `prisma/migrations/` altında hazır gelir ve şu tabloları
oluşturur: `users`, `organizations`, `organization_memberships`, `accounts`,
`sessions`, `verification_tokens`, `password_reset_tokens`.

---

## Google OAuth ayarları

1. <https://console.cloud.google.com/apis/credentials> adresine gidin.
2. **Kimlik Bilgileri Oluştur → OAuth istemci kimliği → Web uygulaması** seçin.
3. **Yetkili yönlendirme URI'leri** alanına şunları ekleyin:
   - Geliştirme: `http://localhost:3000/api/auth/callback/google`
   - Üretim: `https://ALAN-ADINIZ/api/auth/callback/google`
4. Oluşan **İstemci Kimliği** ve **İstemci Gizli Anahtarı** değerlerini `.env`
   dosyasına yazın:

```env
AUTH_GOOGLE_ID="....apps.googleusercontent.com"
AUTH_GOOGLE_SECRET="...."
```

5. Sunucuyu yeniden başlatın. Giriş ve kayıt ekranlarında Google butonu
   otomatik olarak görünür.

**Not:** Aynı e-posta ile önce şifreyle kayıt olup sonra Google ile girmeye
çalışan kullanıcıya "Bu e-posta adresi daha önce şifreyle kayıt olmuş" uyarısı
gösterilir. Hesap ele geçirme riskine karşı otomatik hesap birleştirme
(`allowDangerousEmailAccountLinking`) kapalıdır.

---

## Test kullanıcısı oluşturma

Ayrı bir seed betiği yoktur; kullanıcılar arayüzden oluşturulur:

1. `npm run dev` ile sunucuyu başlatın.
2. <http://localhost:3000/register> adresini açın.
3. Ad, soyad, firma adı, e-posta ve şifreyi girin.
   Şifre kuralları: en az 8 karakter, en az bir büyük harf, bir küçük harf ve
   bir rakam. (Örnek: `Deneme1234`)
4. Kayıt tamamlandığında kullanıcı otomatik giriş yapar; firma oluşturulur ve
   kullanıcı bu firmaya `OWNER` rolüyle bağlanır.

### Şifre yenilemeyi yerelde deneme

Bu aşamada e-posta gönderimi yapılandırılmamıştır. **Geliştirme ortamında**
`/forgot-password` ekranı, üretilen yenileme bağlantısını doğrudan ekranda ve
sunucu günlüğünde gösterir. Üretimde bu bağlantı asla ekrana yazılmaz — o
aşamada `core/auth/mailer.ts` içine gerçek bir e-posta sağlayıcısı bağlanmalıdır.

---

## Üretim: Google Cloud SQL

> **Baştan sona kurulum rehberi için [DEPLOY.md](./DEPLOY.md) dosyasına bakın.**
> Orada Cloud SQL örneği oluşturma, Secret Manager, imaj derleme, Cloud Run
> dağıtımı, migration ve Google OAuth adımları komut komut anlatılmıştır.

### 1) Cloud Run / App Engine — Unix soketi (önerilen)

Cloud SQL örneğini servise bağladıktan sonra:

```env
DATABASE_URL="postgresql://KULLANICI:SIFRE@localhost/VERITABANI?host=/cloudsql/PROJE:BOLGE:ORNEK&schema=public"
```

Cloud Run dağıtımında bağlantıyı eklemeyi unutmayın:

```bash
gcloud run deploy barkerp \
  --add-cloudsql-instances PROJE:BOLGE:ORNEK \
  --set-env-vars "AUTH_URL=https://ALAN-ADINIZ" \
  --set-secrets "DATABASE_URL=barkerp-db-url:latest,AUTH_SECRET=barkerp-auth-secret:latest"
```

### 2) Cloud SQL Auth Proxy ile yerelden bağlanma

```bash
cloud-sql-proxy PROJE:BOLGE:ORNEK --port 5432
```

```env
DATABASE_URL="postgresql://KULLANICI:SIFRE@127.0.0.1:5432/VERITABANI?schema=public"
```

### 3) Genel IP + zorunlu SSL

```env
DATABASE_URL="postgresql://KULLANICI:SIFRE@IP:5432/VERITABANI?schema=public&sslmode=require"
```

### Üretim kontrol listesi

- [ ] `AUTH_SECRET` Secret Manager üzerinden verilir, koda yazılmaz.
- [ ] `AUTH_URL` **https** ile tanımlanır (güvenli çerezler buna bağlıdır).
- [ ] Migration'lar `npm run db:deploy` ile uygulanır.
- [ ] Google OAuth yönlendirme URI'sine üretim alan adı eklenir.
- [ ] Birden fazla sunucu örneği çalışacaksa hız sınırlayıcı ortak bir depoya
      (Redis / Memorystore) taşınır — bkz. `lib/rate-limit.ts`.
- [ ] E-posta sağlayıcısı `core/auth/mailer.ts` içine bağlanır.

---

## Klasör yapısı

```
app/
  (auth)/login | register | forgot-password | reset-password | terms
  (app)/dashboard
  api/auth/[...nextauth]/route.ts   → Auth.js uç noktaları
components/
  auth/       → form ve doğrulama bileşenleri (masaüstü + mobil ortak)
  layouts/    → DesktopAuthLayout, MobileAuthLayout, AuthScreen,
                DesktopAppLayout, MobileAppLayout
  ui/         → Button, TextField, Checkbox, Alert, Logo
core/
  auth/       → Auth.js kurulumu, server action'lar, şifre, jeton, doğrulama
  database/   → Prisma istemcisi
  tenancy/    → firma (kiracı) yardımcıları, roller, aktif kiracı bağlamı
lib/          → env, hız sınırlama, yönlendirme güvenliği, yardımcılar
modules/      → ileride eklenecek ERP modülleri (şimdilik yalnızca README)
prisma/       → schema.prisma + migrations
types/        → Auth.js tip genişletmeleri
middleware.ts → rota koruması ve yönlendirmeler
```

### Masaüstü / mobil arayüz

Masaüstü ve mobil **ayrı bileşenlerdir**, aynı ekranın küçültülmüş hâli
değildir:

- `DesktopAuthLayout` — solda marka/tanıtım paneli, sağda form.
- `MobileAuthLayout` — tek kolon, tanıtım alanı yok, dokunmaya uygun büyük
  alanlar (buton yüksekliği 52px), 16px yazı boyutuyla iOS yakınlaştırma
  engellenir, içerik dikeyde akar ki klavye açıldığında form kullanılabilir
  kalsın.
- `AuthScreen` doğru düzeni `lg` kırılımıyla seçer. Seçim CSS ile yapıldığı
  için sunucu ve istemci render'ı aynıdır; ilk açılışta titreme olmaz.

Form ve doğrulama mantığı ikisinde de ortaktır (`components/auth/*`,
`core/auth/validation.ts`).

---

## Güvenlik notları

- Şifreler bcrypt (cost 12) ile saklanır; düz metin hiçbir yerde tutulmaz.
- Kullanıcı bulunmasa bile sahte bir bcrypt karşılaştırması yapılarak yanıt
  süresi eşitlenir (kullanıcı sayımı / enumeration koruması).
- Giriş hatalarında tek tip mesaj gösterilir: "E-posta veya şifre hatalı."
- `/forgot-password` her durumda aynı bilgilendirmeyi döner.
- Şifre sıfırlama jetonlarının yalnızca SHA-256 özeti saklanır; jeton tek
  kullanımlıktır ve 1 saat geçerlidir.
- Oturum çerezleri `httpOnly` + `sameSite=Lax`; `AUTH_URL` https ise `Secure`.
- "Beni hatırla" işaretlenmezse oturumun mutlak ömrü 12 saate düşer.
- Tüm girdiler sunucuda Zod ile yeniden doğrulanır; istemci doğrulaması
  yalnızca kullanıcı deneyimi içindir.
- Prisma parametreli sorgu kullanır (SQL injection koruması); React çıktıları
  kaçışlar (XSS); `sanitizeRedirectPath` açık yönlendirmeyi engeller.
- Giriş, kayıt ve şifre sıfırlama uçlarında bellek içi hız sınırlama vardır
  (`lib/rate-limit.ts`).
- Güvenlik başlıkları (`CSP`, `X-Frame-Options`, `Referrer-Policy` vb.)
  `next.config.ts` içinde tanımlıdır.
- Hata mesajlarında sistem detayı gösterilmez; ayrıntı yalnızca sunucu
  günlüğüne yazılır.

---

## Sonraki aşamalar

`modules/README.md` dosyası, modül eklerken uyulacak kuralları tanımlar.
Özetle: her modül kendi klasöründe durur, çekirdeği değiştirmez ve tüm
sorgularını `organizationId` ile filtreler.
