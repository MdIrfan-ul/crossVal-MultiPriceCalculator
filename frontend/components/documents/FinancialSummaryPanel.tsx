"use client";

import { Info, CheckCircle2 } from "lucide-react";
import { formatCurrencyFull } from "@/lib/format";
import type { DocumentTotals } from "@/lib/document-calculations";
import type { DocumentStatus } from "@/lib/documents-api";

interface FinancialSummaryPanelProps {
  totals: DocumentTotals;
  status: DocumentStatus;
}

export function FinancialSummaryPanel({
  totals,
  status,
}: FinancialSummaryPanelProps) {
  const isFinalized = status === "finalized";

  return (
    <aside className="w-full flex-shrink-0 md:w-80">
      <div className="sticky top-[104px] overflow-hidden rounded border border-outline-variant bg-surface-container-lowest shadow-overlay">
        <div className="border-b border-outline-variant bg-surface-container-low p-lg">
          <h2 className="font-headline-sm text-headline-sm text-on-surface">
            Financial Summary
          </h2>
        </div>

        <div className="flex flex-col gap-md p-lg">
          <div className="flex items-center justify-between font-body-md text-on-surface">
            <span className="text-on-surface-variant">Subtotal</span>
            <span className="tabular-nums">
              {formatCurrencyFull(totals.subtotal)}
            </span>
          </div>
          <div className="flex items-center justify-between font-body-md text-on-surface">
            <span className="text-on-surface-variant">Total Discount</span>
            <span className="tabular-nums text-error">
              {totals.total_discount > 0 ? "-" : ""}
              {formatCurrencyFull(totals.total_discount)}
            </span>
          </div>
          <div className="flex items-center justify-between font-body-md text-on-surface">
            <span className="text-on-surface-variant">Total Tax</span>
            <span className="tabular-nums">
              {formatCurrencyFull(totals.total_tax)}
            </span>
          </div>

          <hr className="my-xs border-outline-variant" />

          <div className="flex items-end justify-between">
            <span className="font-label-bold text-label-bold uppercase tracking-wider text-on-surface-variant">
              Grand Total
            </span>
            <span className="font-headline-md text-headline-md font-bold tabular-nums text-on-surface">
              {formatCurrencyFull(totals.grand_total)}
            </span>
          </div>
          <p className="text-right font-body-sm text-body-sm text-on-surface-variant">
            USD - United States Dollar
          </p>
        </div>

        <div className="flex items-start gap-sm border-t border-outline-variant bg-surface-container p-md">
          {isFinalized ? (
            <>
              <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Document has been finalized and cannot be edited.
              </p>
            </>
          ) : (
            <>
              <Info className="h-5 w-5 flex-shrink-0 text-outline" />
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Document is currently in draft mode. Unsaved changes will be
                lost.
              </p>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
