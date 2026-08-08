// documents/utils/report-period.util.ts

import { ReportPeriod } from "src/documents/dto/summary-report-query.dto";

export interface DateRange {
    from: Date;
    to: Date;
}

/**
 * Resolves a report period + optional custom from/to into a concrete
 * [start, end] Date range, both clamped to the full day
 * (00:00:00.000 to 23:59:59.999).
 *
 * Weekly = last 7 days including today.
 * Monthly = last 30 days including today (calendar-month alternative noted below).
 * Yearly = last 365 days including today.
 * These are ROLLING windows, not calendar-aligned (e.g. "monthly" is not
 * "1st to today of this calendar month") — see note below if calendar-aligned
 * periods are wanted instead.
 */
export function resolveReportDateRange(
    period: ReportPeriod = ReportPeriod.TODAY,
    customFrom?: string,
    customTo?: string,
): DateRange {
    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    switch (period) {
        case ReportPeriod.TODAY: {
            return { from: startOfToday, to: endOfToday };
        }

        case ReportPeriod.WEEKLY: {
            const from = new Date(startOfToday);
            from.setDate(from.getDate() - 6); // last 7 days inclusive of today
            return { from, to: endOfToday };
        }

        case ReportPeriod.MONTHLY: {
            const from = new Date(startOfToday);
            from.setDate(from.getDate() - 29); // last 30 days inclusive of today
            return { from, to: endOfToday };
        }

        case ReportPeriod.YEARLY: {
            const from = new Date(startOfToday);
            from.setDate(from.getDate() - 364); // last 365 days inclusive of today
            return { from, to: endOfToday };
        }

        case ReportPeriod.CUSTOM: {
            if (!customFrom || !customTo) {
                throw new Error('from and to are required for a custom period');
            }
            const from = new Date(customFrom);
            from.setHours(0, 0, 0, 0);
            const to = new Date(customTo);
            to.setHours(23, 59, 59, 999);
            return { from, to };
        }

        default: {
            return { from: startOfToday, to: endOfToday };
        }
    }
}