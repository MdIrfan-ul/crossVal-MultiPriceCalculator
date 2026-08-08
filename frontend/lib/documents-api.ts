import { authedFetch } from "./authed-fetch";
import type { DiscountType } from "./document-calculations";

export type DocumentStatus = "draft" | "finalized";

export interface LineItemPayload {
  description: string;
  quantity: number;
  unit_price: number;
  discount?: { type: DiscountType; value: number };
  tax_percent?: number;
}

export interface CreateDocumentPayload {
  title: string;
  customer_name: string;
  issue_date: string;
  status: DocumentStatus;
  line_items: LineItemPayload[];
  notes?: string;
}

export interface DocumentApiResult {
  _id: string;
  title: string;
  customer_name: string;
  issue_date: string;
  status: DocumentStatus;
  line_items: (LineItemPayload & {
    line_subtotal: number;
    discount_amount: number;
    discounted_amount: number;
    tax_amount: number;
    line_total: number;
  })[];
  subtotal: number;
  total_discount: number;
  total_tax: number;
  grand_total: number;
  notes?: string;
}

export interface DocumentApiResponse {
  status: number;
  errorMessage: string;
  result?: DocumentApiResult;
}

export async function createDocument(
  payload: CreateDocumentPayload,
): Promise<DocumentApiResponse> {
  const res = await authedFetch("/api/documents", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function updateDocument(
  id: string,
  payload: Partial<CreateDocumentPayload>,
): Promise<DocumentApiResponse> {
  const res = await authedFetch(`/api/documents/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export interface DocumentListItem {

}
export async function listDocuments() {
  const res = await authedFetch(`/api/documents/`)
}
