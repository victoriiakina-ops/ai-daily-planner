import type { Metadata, Viewport } from "next";
import "./globals.css";
import { TasksProvider } from "@/context/TasksProvider";
import { SheetProvider } from "@/context/SheetProvider";
import { BottomNav } from "@/components/BottomNav";
import { AddTaskSheet } from "@/components/AddTaskSheet";
import { TaskDetailSheet } from "@/components/TaskDetailSheet";

export const metadata: Metadata = {
  title: "Planner",
  description: "A calm, mobile-first daily task planner.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#fafafa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-background text-foreground">
        <TasksProvider>
          <SheetProvider>
            <div className="mx-auto flex min-h-full max-w-md flex-col pb-[calc(76px+var(--safe-bottom))]">
              {children}
            </div>
            <BottomNav />
            <AddTaskSheet />
            <TaskDetailSheet />
          </SheetProvider>
        </TasksProvider>
      </body>
    </html>
  );
}
