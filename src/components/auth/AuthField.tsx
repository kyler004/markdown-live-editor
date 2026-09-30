import type { AuthTheme } from "../../pages/auth-themes";

interface AuthFieldProps {
  theme: AuthTheme;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  required?: boolean;
  placeholder?: string;
  hint?: string;
  minLength?: number;
}

export default function AuthField({
  theme: t,
  label,
  type,
  value,
  onChange,
  autoComplete,
  required,
  placeholder,
  hint,
  minLength,
}: AuthFieldProps) {
  return (
    <label className="block">
      <span
        className={`font-mono text-[10px] md:text-[11px] ${t.subtext} tracking-[0.2em] uppercase mb-2 block`}
      >
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        required={required}
        placeholder={placeholder}
        minLength={minLength}
        className={`w-full ${t.inputBg} border ${t.inputBorder} ${t.text} rounded-sm py-3 px-4 font-mono text-sm outline-none transition-shadow ${t.inputFocus}`}
      />
      {hint && (
        <span className={`text-xs ${t.subtext} mt-1.5 block font-mono`}>
          {hint}
        </span>
      )}
    </label>
  );
}
