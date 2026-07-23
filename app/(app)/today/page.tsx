"use client";

import { TaskList } from "@/components/TaskList";
import { EmptyState } from "@/components/EmptyState";
import { TodayIcon } from "@/components/icons";
import { useTasksContext } from "@/context/TasksProvider";
import { useSheetContext } from "@/context/SheetProvider";
import { Task } from "@/lib/types";
import { t, pluralizeUk } from "@/lib/i18n";

function formatDuration(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes} хв`;
  if (minutes === 0) return `${hours} год`;
  return `${hours} год ${minutes} хв`;
}

export default function TodayPage() {
  const { tasks, completeTask, uncompleteTask, deleteTask } = useTasksContext();
  const { openComposer } = useSheetContext();

  // The `!task.completedAt` check is a second, independent guard beyond the status
  // check: a task that has ever been completed must never render here again.
  const todayTasks = tasks
    .filter((task) => task.status === "today" && !task.completedAt)
    .sort((a, b) => (a.time ?? "").localeCompare(b.time ?? ""));
  const priorityTasks = todayTasks.filter((task) => task.priority === "high");
  const totalMinutes = todayTasks.reduce((sum, task) => sum + (task.durationMinutes ?? 0), 0);

  const handleToggle = (task: Task) => {
    if (task.status === "completed") uncompleteTask(task.id);
    else completeTask(task.id);
  };
  const handleOpen = (task: Task) => openComposer(task.id);
  const handleDelete = (task: Task) => deleteTask(task.id);

  const taskCountLabel = pluralizeUk(
    todayTasks.length,
    t.common.taskOne,
    t.common.taskFew,
    t.common.taskMany
  );

  return (
    <div className="flex flex-col gap-6 pb-6">
      <header className="px-5" style={{ paddingTop: "calc(var(--safe-top) + 20px)" }}>
        <p className="text-[15px] font-medium text-muted">{t.today.greeting}</p>
        <h1 className="mt-1 text-[28px] font-bold leading-tight tracking-tight text-foreground">
          {t.nav.today}
        </h1>
        <p className="mt-1.5 text-[13px] font-medium text-muted">
          {todayTasks.length > 0
            ? `${todayTasks.length} ${taskCountLabel}${
                totalMinutes > 0 ? ` • ${formatDuration(totalMinutes)}` : ""
              }`
            : " "}
        </p>
      </header>

      {todayTasks.length === 0 ? (
        <EmptyState
          icon={<TodayIcon className="h-6 w-6" />}
          title={t.today.emptyTitle}
          message={t.today.emptyMessage}
        />
      ) : (
        <>
          {priorityTasks.length > 0 && (
            <section className="flex flex-col gap-2">
              <h2 className="px-5 text-[12px] font-semibold uppercase tracking-wide text-muted">
                {t.today.prioritySection}
              </h2>
              <TaskList
                tasks={priorityTasks}
                onToggleComplete={handleToggle}
                onOpen={handleOpen}
                onDelete={handleDelete}
                emptyState={null}
              />
            </section>
          )}

          <section className="flex flex-col gap-2">
            <h2 className="px-5 text-[12px] font-semibold uppercase tracking-wide text-muted">
              {t.today.allTasksSection}
            </h2>
            <TaskList
              tasks={todayTasks}
              onToggleComplete={handleToggle}
              onOpen={handleOpen}
              onDelete={handleDelete}
              emptyState={null}
            />
          </section>
        </>
      )}
    </div>
  );
}
