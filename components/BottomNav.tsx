"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { t } from "@/lib/i18n";
import { CaptureIcon, CompletedIcon, InboxIcon, TodayIcon } from "@/components/icons";

const navItems = [
  { href: "/capture", label: t.nav.capture, Icon: CaptureIcon },
  { href: "/inbox", label: t.nav.inbox, Icon: InboxIcon },
  { href: "/today", label: t.nav.today, Icon: TodayIcon },
  { href: "/completed", label: t.nav.completed, Icon: CompletedIcon },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-dark-surface"
      style={{ paddingBottom: "var(--safe-bottom)" }}
    >
      <div className="mx-auto grid max-w-md grid-cols-4 items-center px-1">
        {navItems.map((item) => (
          <NavLink key={item.href} item={item} active={pathname === item.href} />
        ))}
      </div>
    </nav>
  );
}

function NavLink({
  item,
  active,
}: {
  item: { href: string; label: string; Icon: typeof TodayIcon };
  active: boolean;
}) {
  const { Icon } = item;
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className="flex min-h-[52px] flex-col items-center justify-center gap-0.5 py-2 transition-opacity active:opacity-50"
    >
      <Icon
        filled={active}
        className={`h-[22px] w-[22px] transition-colors duration-150 ${
          active ? "text-accent" : "text-dark-surface-muted"
        }`}
      />
      <span
        className={`text-[10.5px] transition-colors duration-150 ${
          active ? "font-semibold text-accent" : "font-medium text-dark-surface-muted"
        }`}
      >
        {item.label}
      </span>
    </Link>
  );
}
