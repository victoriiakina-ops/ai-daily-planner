import type { Metadata, Viewport } from "next";
import { Onest, Commissioner } from "next/font/google";
import "./globals.css";
import { TasksProvider } from "@/context/TasksProvider";
import { SheetProvider } from "@/context/SheetProvider";
import { TaskComposerSheet } from "@/components/TaskComposerSheet";

const onest = Onest({
  subsets: ["latin", "cyrillic"],
  variable: "--font-onest",
});

const commissioner = Commissioner({
  subsets: ["latin", "cyrillic"],
  variable: "--font-commissioner",
});

export const metadata: Metadata = {
  title: "Focus",
  description: "AI-powered daily planner — turn messy thoughts into a calm, realistic plan for today.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#f2f2f4",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="uk"
      className={`h-full antialiased ${onest.variable} ${commissioner.variable}`}
    >
      <body className="min-h-full bg-background font-sans text-foreground">
        <TasksProvider>
          <SheetProvider>
            <div className="mx-auto flex min-h-full max-w-md flex-col">
              {children}
            </div>
            <TaskComposerSheet />
          </SheetProvider>
        </TasksProvider>
      </body>
    </html>
  );
}
