"use client";

import { useState } from "react";
import { ViewHeader } from "@/components/ViewHeader";
import { TaskList } from "@/components/TaskList";
import { EmptyState } from "@/components/EmptyState";
import { InboxIcon } from "@/components/icons";
import { useTasksContext } from "@/context/TasksProvider";
import { useSheetContext } from "@/context/SheetProvider";
import { Priority, Task } from "@/lib/types";
import { t, pluralizeUk } from "@/lib/i18n";

type Filter = "all" | Priority;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: t.inbox.filterAll },
  { value: "high", label: t.inbox.filterHigh },
  { value: "medium", label: t.inbox.filterMedium },
  { value: "low", label: t.inbox.filterLow },
];

export default function InboxPage() {
  const { tasks, completeTask, uncompleteTask, deleteTask } = useTasksContext();
  const { openComposer } = useSheetContext();
  const [filter, setFilter] = useState<Filter>("all");

  const inboxTasks = tasks.filter((task) => task.status === "inbox");
  const visibleTasks =
    filter === "all" ? inboxTasks : inboxTasks.filter((task) => task.priority === filter);

  const handleToggle = (task: Task) => {
    if (task.status === "completed") uncompleteTask(task.id);
    else completeTask(task.id);
  };

  const countLabel = pluralizeUk(inboxTasks.length, t.common.taskOne, t.common.taskFew, t.common.taskMany);

  return (
    <>
      <ViewHeader
        title={t.nav.inbox}
        subtitle={inboxTasks.length > 0 ? `${inboxTasks.length} ${countLabel}` : undefined}
      />

      {inboxTasks.length > 0 && (
        <div className="mb-1 flex gap-2 overflow-x-auto px-5 pb-1">
          {FILTERS.map((option) => {
            const active = option.value === filter;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setFilter(option.value)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                  active ? "bg-accent text-dark-surface" : "bg-black/[0.04] text-muted"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}

      <TaskList
        tasks={visibleTasks}
        onToggleComplete={handleToggle}
        onOpen={(task) => openComposer(task.id)}
        onDelete={(task) => deleteTask(task.id)}
        emptyState={
          filter === "all" ? (
            <EmptyState
              icon={<InboxIcon className="h-6 w-6" />}
              title={t.inbox.emptyTitle}
              message={t.inbox.emptyMessage}
            />
          ) : (
            <p className="px-10 pt-16 text-center text-[14px] text-muted">
              {t.inbox.filterEmptyMessage}
            </p>
          )
        }
      />
    </>
  );
}
