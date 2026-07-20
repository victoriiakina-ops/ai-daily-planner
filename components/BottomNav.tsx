"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSheetContext } from "@/context/SheetProvider";
import {
  CompletedIcon,
  InboxIcon,
  PlusIcon,
  TodayIcon,
} from "@/components/icons";

const navItems = [
  { href: "/today", label: "Today", Icon: TodayIcon },
  { href: "/inbox", label: "Inbox", Icon: InboxIcon },
] as const;

const finalItem = { href: "/completed", label: "Completed", Icon: CompletedIcon } as const;

export function BottomNav() {
  const pathname = usePathname();
  const { openAddSheet } = useSheetContext();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-divider bg-surface/90 backdrop-blur-xl"
      style={{ paddingBottom: "var(--safe-bottom)" }}
    >
      <div className="mx-auto grid max-w-md grid-cols-4 items-center px-1">
        {navItems.map((item) => (
          <NavLink key={item.href} item={item} active={pathname === item.href} />
        ))}

        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={openAddSheet}
            aria-label="Add task"
            className="flex h-[52px] w-[52px] -translate-y-4 items-center justify-center rounded-full bg-accent text-white shadow-[0_6px_16px_rgba(91,95,232,0.35)] transition-transform duration-150 active:scale-90"
          >
            <PlusIcon className="h-6 w-6" />
          </button>
        </div>

        <NavLink item={finalItem} active={pathname === finalItem.href} />
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
      className="flex min-h-[44px] flex-col items-center justify-center gap-0.5 py-2 transition-opacity active:opacity-50"
    >
      <Icon
        filled={active}
        className={`h-[23px] w-[23px] transition-colors duration-150 ${
          active ? "text-accent" : "text-muted"
        }`}
      />
      <span
        className={`text-[10.5px] transition-colors duration-150 ${
          active ? "font-semibold text-accent" : "font-medium text-muted"
        }`}
      >
        {item.label}
      </span>
    </Link>
  );
}
