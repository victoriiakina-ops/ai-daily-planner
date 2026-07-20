export function SheetHeaderButton({
  label,
  onClick,
  type = "button",
  form,
  variant = "default",
  disabled = false,
}: {
  label: string;
  onClick?: () => void;
  type?: "button" | "submit";
  form?: string;
  variant?: "default" | "prominent" | "destructive";
  disabled?: boolean;
}) {
  const color =
    variant === "destructive"
      ? "text-destructive"
      : variant === "prominent"
      ? "text-accent"
      : "text-muted";
  const weight = variant === "prominent" ? "font-semibold" : "font-normal";

  return (
    <button
      type={type}
      form={form}
      onClick={onClick}
      disabled={disabled}
      className={`flex h-11 min-w-[44px] items-center justify-center rounded-full px-2.5 text-[16px] transition-opacity active:opacity-50 disabled:opacity-35 ${color} ${weight}`}
    >
      {label}
    </button>
  );
}
