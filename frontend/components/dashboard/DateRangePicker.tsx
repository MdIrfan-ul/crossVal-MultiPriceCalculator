"use client";

import { Calendar } from "lucide-react";

interface DateRangePickerProps {
  from: string;
  to: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
}

export function DateRangePicker({
  from,
  to,
  onFromChange,
  onToChange,
}: DateRangePickerProps) {
  return (
    <div className="flex items-center rounded border border-outline-variant bg-surface-container-lowest p-xs">
      <div className="flex items-center gap-xs px-sm">
        <Calendar className="h-[18px] w-[18px] text-on-surface-variant" />
        <input
          type="date"
          value={from}
          max={to || undefined}
          onChange={(e) => onFromChange(e.target.value)}
          aria-label="From date"
          className="border-none bg-transparent p-0 font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-0"
        />
      </div>
      <span className="text-on-surface-variant">–</span>
      <div className="flex items-center gap-xs px-sm">
        <input
          type="date"
          value={to}
          min={from || undefined}
          onChange={(e) => onToChange(e.target.value)}
          aria-label="To date"
          className="border-none bg-transparent p-0 font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-0"
        />
      </div>
    </div>
  );
}
