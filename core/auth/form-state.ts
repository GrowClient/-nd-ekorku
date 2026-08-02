/**
 * Server action'ların döndürdüğü ortak form durumu.
 *
 * Bu tanımlar ayrı bir dosyada tutulur: "use server" işaretli dosyalar
 * yalnızca async fonksiyon dışa aktarabilir.
 */
export type FormState = {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Record<string, string>;
  /** Yalnızca geliştirme ortamında: e-posta sağlayıcısı yokken ekranda gösterilen bağlantı. */
  devResetUrl?: string;
};

export const initialFormState: FormState = { status: "idle" };
