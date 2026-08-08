"use client";

import type { ReportPeriod } from "@/lib/summary-report";

interface SummaryPeriodTabsProps {
  active: ReportPeriod;
  onChange: (period: ReportPeriod) => void;
}

const PERIODS: { id: ReportPeriod; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
  { id: "yearly", label: "Yearly" },
  { id: "custom", label: "Custom" },
];

export function SummaryPeriodTabs({ active, onChange }: SummaryPeriodTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Report period"
      className="inline-flex flex-wrap gap-sm rounded border border-outline-variant bg-surface-container-lowest p-xs"
    >
      {PERIODS.map((p) => {
        const isActive = p.id === active;
        return (
          <button
            key={p.id}
            type="button"
            role="tab"
            suppressHydrationWarning
            aria-selected={isActive}
            onClick={() => onChange(p.id)}
            className={`rounded px-sm py-xs font-label-bold text-label-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${isActive
                ? "bg-primary text-on-primary"
                : "border border-primary text-primary hover:bg-surface-container"
              }`}
          >
            {p.label}
          </button>
        );
      })}
    </div>
  );
}
