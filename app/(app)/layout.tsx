import { BottomNav } from "@/components/BottomNav";

/** Chrome shared by the nav-bearing screens (Inbox/Today/Completed) — reserves space for BottomNav. */
export default function AppSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex flex-1 flex-col pb-[calc(76px+var(--safe-bottom))]">
        {children}
      </div>
      <BottomNav />
    </>
  );
}
