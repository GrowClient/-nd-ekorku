"use client";

import { googleSignInAction } from "@/core/auth/actions";
import { SubmitButton } from "@/components/ui/Button";

/**
 * Google ile giriş. Ayrı bir form olarak render edilir; ana giriş/kayıt
 * formunun içine yerleştirilmez (iç içe form HTML'de geçersizdir).
 */
export function GoogleButton({
  label,
  callbackUrl = "/dashboard",
  size = "md",
}: {
  label: string;
  callbackUrl?: string;
  size?: "md" | "lg";
}) {
  return (
    <form action={googleSignInAction}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <SubmitButton
        variant="secondary"
        buttonSize={size}
        pendingLabel="Google'a yönlendiriliyor…"
      >
        <GoogleIcon />
        {label}
      </SubmitButton>
    </form>
  );
}

function GoogleIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-4.5 w-4.5">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.46a5.52 5.52 0 0 1-2.4 3.62v3.01h3.88c2.27-2.09 3.58-5.17 3.58-8.82Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.08 7.94-2.91l-3.88-3.01c-1.08.72-2.45 1.15-4.06 1.15-3.12 0-5.76-2.11-6.71-4.94H1.29v3.1A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.29 14.29a7.2 7.2 0 0 1 0-4.58v-3.1H1.29a12 12 0 0 0 0 10.78l4-3.1Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.76 0 3.34.61 4.59 1.8l3.44-3.44C17.95 1.13 15.24 0 12 0A12 12 0 0 0 1.29 6.61l4 3.1C6.24 6.87 8.88 4.75 12 4.75Z"
      />
    </svg>
  );
}
