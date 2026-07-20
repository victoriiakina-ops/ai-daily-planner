type IconProps = {
  className?: string;
  filled?: boolean;
};

export function TodayIcon({ className, filled }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true" focusable="false">
      <circle
        cx="12"
        cy="12"
        r="7.25"
        stroke="currentColor"
        strokeWidth="1.8"
        fill={filled ? "currentColor" : "none"}
        fillOpacity={filled ? 0.15 : 0}
      />
      <path
        d="M12 8.5V12L14.2 13.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function InboxIcon({ className, filled }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true" focusable="false">
      <path
        d="M4 12.5V17a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 20 17v-4.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 12.5h4.2a.5.5 0 0 1 .45.28l.7 1.44a.5.5 0 0 0 .45.28h4.4a.5.5 0 0 0 .45-.28l.7-1.44a.5.5 0 0 1 .45-.28H20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={filled ? "currentColor" : "none"}
        fillOpacity={filled ? 0.12 : 0}
      />
      <path
        d="M7 12.5 8.2 6.7A1.5 1.5 0 0 1 9.67 5.5h4.66a1.5 1.5 0 0 1 1.47 1.2L17 12.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CompletedIcon({ className, filled }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true" focusable="false">
      <circle
        cx="12"
        cy="12"
        r="7.25"
        stroke="currentColor"
        strokeWidth="1.8"
        fill={filled ? "currentColor" : "none"}
        fillOpacity={filled ? 0.15 : 0}
      />
      <path
        d="M9 12.2 11 14.2 15.2 9.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PlusIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true" focusable="false">
      <path
        d="M12 5.5v13M5.5 12h13"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ChevronRightIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true" focusable="false">
      <path
        d="M9 6.5 15 12l-6 5.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true" focusable="false">
      <path
        d="M6.5 6.5l11 11M17.5 6.5l-11 11"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function TrashIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true" focusable="false">
      <path
        d="M5.5 7h13M9.5 7V5.5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1V7M7.5 7l.6 11.2a1.5 1.5 0 0 0 1.5 1.4h4.8a1.5 1.5 0 0 0 1.5-1.4L16.5 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowMoveIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true" focusable="false">
      <path
        d="M8 7 5 12l3 5M16 7l3 5-3 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
