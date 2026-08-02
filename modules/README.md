# Modüller

Bu klasör, ERP'nin bağımsız sektör modülleri için ayrılmıştır. **1. aşamada
(v0.1.0-auth) burada kod bulunmaz.**

Planlanan modüller:

- `cafe-restaurant/` — Kafe ve restoran
- `textile/` — Triko ve tekstil
- `inventory/` — Stok
- `sales/` — Satış
- `accounting/` — Muhasebe

## Modül eklerken uyulacak kurallar

1. **Çekirdeğe dokunma.** Modül; `core/auth`, `core/database` ve
   `core/tenancy` altındaki hazır yapıları kullanır, onları değiştirmez.
2. **Kiracı izolasyonu zorunlu.** Modülün oluşturduğu her Prisma modeli
   `organizationId` alanı taşır ve her sorgu bu alanla filtrelenir. Aktif
   firmanın kimliği `core/tenancy/context.ts` içindeki
   `requireOrganizationContext()` ile alınır.
3. **Kendi kendine yeten klasör.** Bir modülün sayfaları, bileşenleri,
   şema parçası ve iş mantığı kendi klasöründe durur:
   ```
   modules/inventory/
     manifest.ts      → modül kimliği, adı, gerekli rol
     components/
     actions/
     schema.prisma    → çekirdek şemaya eklenecek modeller
   ```
4. **Açılıp kapanabilir olmalı.** Modül kaydı `manifest.ts` üzerinden yapılır;
   firma bazında etkinleştirme sonraki aşamada `OrganizationModule` tablosu
   ile eklenecektir.
5. **Mikroservis, event bus veya benzeri soyutlama kullanılmaz.** Uygulama tek
   Next.js projesi olarak çalışmaya devam eder.
