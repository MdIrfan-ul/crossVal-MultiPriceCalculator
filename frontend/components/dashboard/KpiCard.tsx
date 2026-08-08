"use client";

import type { LucideIcon } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  iconClassName?: string;
  isLoading?: boolean;
}

export function KpiCard({
  label,
  value,
  icon: Icon,
  iconClassName,
  isLoading,
}: KpiCardProps) {
  return (
    <div className="flex h-32 flex-col justify-between rounded-lg border border-outline-variant bg-surface-container-lowest p-md transition-shadow hover:shadow-overlay">
      <div className="flex items-start justify-between">
        <span className="font-label-bold text-label-bold uppercase text-on-surface-variant">
          {label}
        </span>
        <Icon className={`h-5 w-5 ${iconClassName ?? "text-primary"}`} />
      </div>
      <div>
        {isLoading ? (
          <div className="h-8 w-24 animate-pulse rounded bg-surface-container-highest" />
        ) : (
          <div className="font-headline-xl text-headline-xl tabular-nums text-on-surface">
            {value}
          </div>
        )}
      </div>
    </div>
  );
}
