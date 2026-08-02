import { PASSWORD_RULES } from "@/core/auth/validation";

/** Şifre kurallarını kullanıcıya açıkça gösterir. */
export function PasswordRules({ className }: { className?: string }) {
  return (
    <div className={className}>
      <p className="text-xs font-medium text-slate-600">Şifre kuralları</p>
      <ul className="mt-1.5 grid gap-1 text-xs text-slate-500 sm:grid-cols-2">
        {PASSWORD_RULES.map((rule) => (
          <li key={rule} className="flex items-center gap-1.5">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-slate-300" />
            {rule}
          </li>
        ))}
      </ul>
    </div>
  );
}
