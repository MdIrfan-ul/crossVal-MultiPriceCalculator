"use client";

import { Search, Bell, HelpCircle } from "lucide-react";

export function Topbar() {
  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-outline-variant bg-surface-container-lowest px-lg">
      <div className="font-headline-sm text-headline-sm font-bold text-primary">
        Precision Ledger
      </div>

      <div className="relative mx-lg hidden max-w-md flex-1 items-center md:flex">
        <Search className="absolute left-sm h-4 w-4 text-outline" />
        <input
          type="text"
          placeholder="Search documents…"
          className="w-full rounded border border-outline-variant bg-surface-container-low py-xs pl-[36px] pr-sm font-body-sm text-body-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div className="flex items-center gap-sm">
        <button
          type="button"
          suppressHydrationWarning
          aria-label="Notifications"
          className="rounded p-xs text-on-surface-variant transition-colors hover:bg-surface-container"
        >
          <Bell className="h-5 w-5" />
        </button>
        <button
          type="button"
          suppressHydrationWarning
          aria-label="Help"
          className="rounded p-xs text-on-surface-variant transition-colors hover:bg-surface-container"
        >
          <HelpCircle className="h-5 w-5" />
        </button>
        <div className="ml-sm h-8 w-8 overflow-hidden rounded-full border border-outline-variant bg-surface-container-highest" />
      </div>
    </header>
  );
}
