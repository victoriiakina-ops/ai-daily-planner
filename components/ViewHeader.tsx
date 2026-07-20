export function ViewHeader({
  title,
  count,
}: {
  title: string;
  count?: number;
}) {
  return (
    <header
      className="px-5 pb-3"
      style={{ paddingTop: "calc(var(--safe-top) + 20px)" }}
    >
      <h1 className="text-[30px] font-bold leading-tight tracking-tight text-foreground">
        {title}
      </h1>
      <p className="mt-1 text-[13px] font-medium text-muted">
        {typeof count === "number" && count > 0
          ? `${count} ${count === 1 ? "task" : "tasks"}`
          : "\u00A0"}
      </p>
    </header>
  );
}
