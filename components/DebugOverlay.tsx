"use client";

/**
 * TEMPORARY diagnostic overlay — remove once the Today/Inbox/Completed
 * duplication bug is root-caused. Renders the live task state directly on
 * screen (no devtools needed) so it can be inspected on a real device.
 */

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useTasksContext } from "@/context/TasksProvider";

export function DebugOverlay() {
  const { tasks, isLoaded, instanceId, mountedAt, mountNumber } = useTasksContext();
  const pathname = usePathname();
  const [open, setOpen] = useState(true);

  // Also logs every render to the console, in case a real device's console is reachable.
  useEffect(() => {
    console.log(
      `DEBUG render path=${pathname} instance=${instanceId} mount#=${mountNumber} tasks=${JSON.stringify(
        tasks.map((t) => ({ id: t.id.slice(0, 6), title: t.title, status: t.status }))
      )}`
    );
  });

  const byTitle = new Map<string, typeof tasks>();
  for (const task of tasks) {
    const list = byTitle.get(task.title) ?? [];
    list.push(task);
    byTitle.set(task.title, list);
  }
  const duplicateTitles = Array.from(byTitle.entries()).filter(([, list]) => list.length > 1);

  const idCounts = new Map<string, number>();
  for (const task of tasks) {
    idCounts.set(task.id, (idCounts.get(task.id) ?? 0) + 1);
  }
  const duplicateIds = Array.from(idCounts.entries()).filter(([, count]) => count > 1);

  const hasAnomaly = duplicateTitles.length > 0 || duplicateIds.length > 0;

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{
          position: "fixed",
          top: 4,
          right: 4,
          zIndex: 99999,
          background: hasAnomaly ? "#ff3b30" : "#000",
          color: "#fff",
          fontSize: 10,
          padding: "3px 6px",
          borderRadius: 6,
          fontFamily: "monospace",
        }}
      >
        DBG{hasAnomaly ? " !" : ""}
      </button>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 99999,
        background: hasAnomaly ? "#ff3b30" : "rgba(0,0,0,0.88)",
        color: "#fff",
        fontSize: 10,
        fontFamily: "monospace",
        padding: "4px 6px",
        maxHeight: "42vh",
        overflowY: "auto",
        whiteSpace: "pre-wrap",
        wordBreak: "break-all",
        lineHeight: 1.4,
      }}
    >
      <button
        type="button"
        onClick={() => setOpen(false)}
        style={{
          float: "right",
          background: "rgba(255,255,255,0.2)",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          padding: "1px 6px",
        }}
      >
        x
      </button>
      <div>
        path={pathname} loaded={String(isLoaded)} instance={instanceId} mount#={mountNumber}{" "}
        mountedAt={mountedAt} count={tasks.length}
      </div>
      {duplicateTitles.length > 0 && (
        <div>
          !! DUPLICATE TITLES:{" "}
          {duplicateTitles
            .map(([title, list]) => `"${title}" x${list.length} statuses=[${list.map((t) => t.status).join(",")}]`)
            .join(" | ")}
        </div>
      )}
      {duplicateIds.length > 0 && (
        <div>!! DUPLICATE IDS: {duplicateIds.map(([id]) => id).join(", ")}</div>
      )}
      <div>
        {tasks
          .map(
            (t) =>
              `${t.id.slice(0, 8)} [${t.status}] "${t.title}"${t.previousStatus ? ` (prev=${t.previousStatus})` : ""}`
          )
          .join("\n")}
      </div>
    </div>
  );
}
