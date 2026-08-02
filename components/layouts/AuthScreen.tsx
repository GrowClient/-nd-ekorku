import { DesktopAuthLayout } from "./DesktopAuthLayout";
import { MobileAuthLayout } from "./MobileAuthLayout";

export type AuthVariant = "desktop" | "mobile";

/**
 * Ekran genişliğine göre doğru düzeni seçer.
 *
 * Seçim CSS ile yapılır (`lg` kırılımı). Böylece sunucu tarafı render ile
 * istemci render'ı birebir aynı olur, ilk açılışta titreme/atlama yaşanmaz.
 * Masaüstü ve mobil düzenler ayrı bileşenlerdir; form ve doğrulama mantığı
 * ortaktır.
 */
export function AuthScreen({
  title,
  description,
  renderForm,
  renderFooter,
}: {
  title: string;
  description: string;
  renderForm: (variant: AuthVariant) => React.ReactNode;
  renderFooter?: (variant: AuthVariant) => React.ReactNode;
}) {
  return (
    <>
      <div className="hidden lg:block">
        <DesktopAuthLayout
          title={title}
          description={description}
          footer={renderFooter?.("desktop")}
        >
          {renderForm("desktop")}
        </DesktopAuthLayout>
      </div>

      <div className="lg:hidden">
        <MobileAuthLayout
          title={title}
          description={description}
          footer={renderFooter?.("mobile")}
        >
          {renderForm("mobile")}
        </MobileAuthLayout>
      </div>
    </>
  );
}
