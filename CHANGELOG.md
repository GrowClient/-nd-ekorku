# Değişiklik Günlüğü

Bu proje [Semantic Versioning](https://semver.org/lang/tr/) kurallarını izler.

---

## [v0.1.0-auth] — 2026-08-02

İlk çalışan sürüm. **Yalnızca çekirdek mimari ve kimlik doğrulama.**
ERP modülleri (kafe/restoran, triko/tekstil, stok, satış, muhasebe) bu sürümde
yer almaz.

### Eklendi

**Kimlik doğrulama**
- E-posta ve şifre ile giriş (Auth.js Credentials sağlayıcısı).
- Google hesabıyla giriş (ortam değişkenleri tanımlıysa otomatik etkinleşir).
- Yeni kullanıcı + firma kaydı; kullanıcı firmaya `OWNER` rolüyle bağlanır.
- "Şifremi unuttum" ekranı ve tek kullanımlık, 1 saat geçerli yenileme jetonu.
- "Şifre yenileme" ekranı.
- Oturum kapatma.
- "Beni hatırla" seçeneği (işaretlenmezse oturum ömrü 12 saat, işaretlenirse
  30 gün).

**SaaS / çok kiracılı yapı**
- Prisma modelleri: `User`, `Organization`, `OrganizationMembership`,
  `Account`, `Session`, `VerificationToken`, `PasswordResetToken`.
- `OrganizationRole` enum'u: `OWNER`, `ADMIN`, `MEMBER` (genişletilebilir).
- Tüm tablolarda `id`, `createdAt`, `updatedAt` ortak alanları.
- Kiracıya bağlı tablolar için `organizationId` deseni ve
  `core/tenancy/context.ts` içinde `requireOrganizationContext()` yardımcısı.
- İlk migration: `prisma/migrations/.../init_auth_and_tenancy`.

**Arayüz**
- Rotalar: `/login`, `/register`, `/forgot-password`, `/reset-password`,
  `/dashboard`, `/terms`.
- Masaüstü ve mobil için **ayrı** düzen bileşenleri: `DesktopAuthLayout`,
  `MobileAuthLayout`, `DesktopAppLayout`, `MobileAppLayout`; ortak form ve
  doğrulama mantığı.
- Ekran genişliğine göre düzen seçimi (`AuthScreen`, `lg` kırılımı).
- Türkçe arayüz ve hata mesajları; şifre kuralları kullanıcıya gösterilir.
- Gönderim sırasında buton yüklenme durumu ve çift gönderim engeli.
- Sade karşılama paneli: kullanıcı adı, firma adı, rol, oturum kapatma ve
  "Modüller sonraki aşamalarda eklenecek" bilgi alanı.

**Güvenlik**
- bcrypt (cost 12) ile şifre saklama; düz metin yok.
- Kullanıcı var/yok bilgisini sızdırmayan tek tip hata mesajları ve sabit
  süreli şifre karşılaştırması.
- Şifre sıfırlama jetonlarının yalnızca SHA-256 özeti saklanır.
- `httpOnly` + `sameSite=Lax` oturum çerezleri; https altında `Secure`.
- Sunucu tarafında Zod ile tam doğrulama.
- Açık yönlendirme koruması (`lib/safe-redirect.ts`).
- Giriş / kayıt / şifre sıfırlama için bellek içi hız sınırlama
  (`lib/rate-limit.ts`).
- Güvenlik başlıkları: CSP, `X-Frame-Options`, `X-Content-Type-Options`,
  `Referrer-Policy`, `Permissions-Policy`.

**Altyapı**
- Next.js 15 App Router, TypeScript, Tailwind CSS v4, Prisma 6, Auth.js v5.
- `middleware.ts` ile rota koruması: oturumsuz kullanıcı `/dashboard`'a
  erişemez; oturum açmış kullanıcı `/login` ve `/register` sayfalarından
  `/dashboard`'a yönlendirilir.
- `.env.example`, `.gitignore`, `README.md` ve bu değişiklik günlüğü.
- `modules/` klasörü ve modül geliştirme kuralları.

### Bilinen sınırlar

- E-posta gönderimi yapılandırılmamıştır. Şifre yenileme bağlantısı yalnızca
  geliştirme ortamında ekranda/günlükte gösterilir; üretimde
  `core/auth/mailer.ts` içine gerçek sağlayıcı bağlanmalıdır.
- Hız sınırlayıcı bellek içidir; çok örnekli dağıtımda ortak bir depoya
  (Redis / Memorystore) taşınmalıdır.
- `Session` tablosu şemada hazır bulunur ancak JWT oturum stratejisi
  kullanıldığı için doldurulmaz.
- Bir kullanıcı şu anda tek firmaya bağlıdır; firma değiştirme arayüzü sonraki
  aşamada eklenecektir.
