export interface SummaryReportResult {
    document_count: number;
    sum_grand_total: number;
    sum_total_tax: number;
    sum_total_discount: number;
    from: string;
    to: string;
}