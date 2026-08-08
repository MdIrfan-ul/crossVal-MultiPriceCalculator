"use client";

import { useEffect, useState, useCallback } from "react";
import { FolderOpen, Wallet, Landmark, Tag } from "lucide-react";
import { SummaryPeriodTabs } from "@/components/dashboard/SummaryPeriodTabs";
import { DateRangePicker } from "@/components/dashboard/DateRangePicker";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { AlertBanner } from "@/components/auth/AlertBanner";
import {
  fetchSummaryReport,
  type ReportPeriod,
  type SummaryReportResult,
} from "@/lib/summary-report";
import { formatCount, formatCurrencyCompact } from "@/lib/format";

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function DashboardPage() {
  const [period, setPeriod] = useState<ReportPeriod>("today");
  const [customFrom, setCustomFrom] = useState(todayStr());
  const [customTo, setCustomTo] = useState(todayStr());

  const [summary, setSummary] = useState<SummaryReportResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSummary = useCallback(async () => {
    // Custom period needs both dates before it's worth calling the API.
    if (period === "custom" && (!customFrom || !customTo)) return;

    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchSummaryReport({
        period,
        from: period === "custom" ? customFrom : undefined,
        to: period === "custom" ? customTo : undefined,
      });

      if (res.statusCode !== 200 || !res.data) {
        setError(res.message || "Could not load summary report");
        return;
      }
      setSummary(res.data);
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [period, customFrom, customTo]);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  return (
    <>
      <header className="mb-lg flex flex-col justify-between gap-md md:flex-row md:items-end">
        <div>
          <h2 className="font-headline-xl text-headline-xl text-on-surface">
            Dashboard Overview
          </h2>
          <p className="mt-xs font-body-md text-on-surface-variant">
            Summary totals for the selected period.
          </p>
        </div>

        <div className="flex flex-col items-start gap-sm md:items-end">
          <SummaryPeriodTabs active={period} onChange={setPeriod} />
          {period === "custom" ? (
            <DateRangePicker
              from={customFrom}
              to={customTo}
              onFromChange={setCustomFrom}
              onToChange={setCustomTo}
            />
          ) : null}
        </div>
      </header>

      {error ? <AlertBanner message={error} /> : null}

      <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2 md:grid-cols-4">
        <KpiCard
          label="Number of Documents"
          value={summary ? formatCount(summary.document_count) : "—"}
          icon={FolderOpen}
          iconClassName="text-primary"
          isLoading={isLoading}
        />
        <KpiCard
          label="Sum of Grand Totals"
          value={summary ? formatCurrencyCompact(summary.sum_grand_total) : "—"}
          icon={Wallet}
          iconClassName="text-primary"
          isLoading={isLoading}
        />
        <KpiCard
          label="Sum of Total Tax"
          value={summary ? formatCurrencyCompact(summary.sum_total_tax) : "—"}
          icon={Landmark}
          iconClassName="text-secondary"
          isLoading={isLoading}
        />
        <KpiCard
          label="Sum of Total Discount"
          value={summary ? formatCurrencyCompact(summary.sum_total_discount) : "—"}
          icon={Tag}
          iconClassName="text-tertiary-container"
          isLoading={isLoading}
        />
      </div>

      {summary ? (
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Showing {summary.from} – {summary.to}
        </p>
      ) : null}
    </>
  );
}
