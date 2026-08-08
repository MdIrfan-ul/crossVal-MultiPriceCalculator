import { authedFetch } from "./authed-fetch";

export type ReportPeriod = "today" | "weekly" | "monthly" | "yearly" | "custom";

export interface SummaryReportResult {
  document_count: number;
  sum_grand_total: number;
  sum_total_tax: number;
  sum_total_discount: number;
  period: ReportPeriod;
  from: string;
  to: string;
}

export interface SummaryReportResponse {
  success: string;
  statusCode: number;
  message: string;
  data?: SummaryReportResult;
}

export async function fetchSummaryReport(params: {
  period: ReportPeriod;
  from?: string;
  to?: string;
}): Promise<SummaryReportResponse> {
  const query = new URLSearchParams({ period: params.period });
  if (params.period === "custom") {
    if (params.from) query.set("from", params.from);
    if (params.to) query.set("to", params.to);
  }

  const res = await authedFetch(
    `/api/documents/summary-report?${query.toString()}`,
    { method: "GET" },
  );

  return res.json();
}