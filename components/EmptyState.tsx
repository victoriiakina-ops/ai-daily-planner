import { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  message,
  action,
}: {
  icon: ReactNode;
  title: string;
  message: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-10 pb-24 pt-20 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft text-accent">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface">
          {icon}
        </div>
      </div>
      <p className="text-[17px] font-semibold tracking-tight text-foreground">
        {title}
      </p>
      <p className="mt-1.5 max-w-[230px] text-[14px] leading-relaxed text-muted">
        {message}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
