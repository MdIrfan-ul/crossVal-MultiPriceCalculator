"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  FileText,
  LayoutDashboard,
  FileStack,
  BarChart3,
  Settings,
  Plus,
  LifeBuoy,
  LogOut,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Documents", icon: FileStack, href: "/documents" },
  { label: "Reports", icon: BarChart3, href: "/reports" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="fixed left-0 top-0 hidden h-screen w-64 flex-col border-r border-outline-variant bg-surface-container-low p-md md:flex">
      <div className="mb-lg flex items-center gap-sm">
        <div className="flex h-10 w-10 items-center justify-center rounded bg-surface-container-lowest text-primary">
          <FileText className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-headline-sm text-headline-sm text-on-surface">
            Precision Ledger
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Management Portal
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => router.push("/documents/new")}
        className="mb-lg flex items-center justify-center gap-sm rounded bg-primary py-sm px-md font-label-bold text-label-bold text-on-primary transition-colors hover:bg-primary-container hover:text-on-primary-container"
      >
        <Plus className="h-[18px] w-[18px]" />
        New Document
      </button>

      <ul className="flex flex-1 flex-col gap-xs font-label-bold text-label-bold">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          // Match the nav item whose href is the current path or a parent
          // of it (e.g. "/documents" stays active on "/documents/new").
          const isActive =
            pathname === item.href || pathname?.startsWith(`${item.href}/`);

          return (
            <li key={item.label}>
              <a
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-sm rounded px-md py-sm transition-colors ${isActive
                    ? "border-r-4 border-primary bg-secondary-container/20 font-bold text-primary"
                    : "text-on-surface-variant hover:bg-surface-container-highest"
                  }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>

      <ul className="mt-auto flex flex-col gap-xs border-t border-outline-variant pt-md font-label-bold text-label-bold">
        <li>
          <a
            href="/support"
            className="flex items-center gap-sm rounded px-md py-sm text-on-surface-variant transition-colors hover:bg-surface-container-highest"
          >
            <LifeBuoy className="h-5 w-5" />
            Support
          </a>
        </li>
        <li>
          <button
            type="button"
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              window.location.href = "/login";
            }}
            className="flex w-full items-center gap-sm rounded px-md py-sm text-left text-on-surface-variant transition-colors hover:bg-surface-container-highest"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </li>
      </ul>
    </nav>
  );
}