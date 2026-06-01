"use client";

import { BottomNav } from "./bottom-nav";
import { SaveStatusIndicator } from "./save-status-indicator";

export function AppShell({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col pb-24">
      <header className="sticky top-0 z-40 border-b border-green-200 bg-green-700 px-4 py-3 text-white dark:border-green-900">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-2">
          <h1 className="text-lg font-bold truncate">{title}</h1>
          <div className="flex shrink-0 items-center gap-2">
            <SaveStatusIndicator />
            {action}
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-4">{children}</main>
      <BottomNav />
    </div>
  );
}
