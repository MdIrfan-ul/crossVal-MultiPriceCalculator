export type DiscountType = "fixed" | "percent";

export interface DiscountInput {
  type: DiscountType;
  value: number;
}

export interface LineItemInput {
  description: string;
  quantity: number;
  unit_price: number;
  discount?: DiscountInput;
  tax_percent?: number;
}

export interface LineItemCalculation {
  line_subtotal: number;
  discount_amount: number;
  discounted_amount: number;
  tax_amount: number;
  line_total: number;
}

export interface DocumentTotals {
  subtotal: number;
  total_discount: number;
  total_tax: number;
  grand_total: number;
}

export function roundCurrency(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * Same rounding + ordering policy as the backend:
 * 1. line_subtotal = qty * unit_price
 * 2. discount applied (fixed or percent, not both)
 * 3. tax applied on the discounted amount
 * 4. line_total = discounted amount + tax
 * A fixed discount that exceeds the line subtotal is clamped here (preview
 * only) rather than rejected — the server rejects it for real on submit.
 */
export function calculateLineItem(item: LineItemInput): LineItemCalculation {
  const quantity = Number.isFinite(item.quantity) ? item.quantity : 0;
  const unitPrice = Number.isFinite(item.unit_price) ? item.unit_price : 0;
  const line_subtotal = roundCurrency(quantity * unitPrice);

  let discount_amount = 0;
  if (item.discount && Number.isFinite(item.discount.value)) {
    discount_amount =
      item.discount.type === "fixed"
        ? roundCurrency(item.discount.value)
        : roundCurrency((line_subtotal * item.discount.value) / 100);
    discount_amount = Math.min(Math.max(discount_amount, 0), line_subtotal);
  }

  const discounted_amount = roundCurrency(line_subtotal - discount_amount);

  const taxPercent = Number.isFinite(item.tax_percent) ? (item.tax_percent as number) : 0;
  const tax_amount = taxPercent
    ? roundCurrency((discounted_amount * taxPercent) / 100)
    : 0;

  const line_total = roundCurrency(discounted_amount + tax_amount);

  return { line_subtotal, discount_amount, discounted_amount, tax_amount, line_total };
}

export function calculateDocumentTotals(lineItems: LineItemInput[]): {
  lines: LineItemCalculation[];
  totals: DocumentTotals;
} {
  const lines = lineItems.map(calculateLineItem);

  const totals = lines.reduce<DocumentTotals>(
    (acc, line) => ({
      subtotal: roundCurrency(acc.subtotal + line.line_subtotal),
      total_discount: roundCurrency(acc.total_discount + line.discount_amount),
      total_tax: roundCurrency(acc.total_tax + line.tax_amount),
      grand_total: roundCurrency(acc.grand_total + line.line_total),
    }),
    { subtotal: 0, total_discount: 0, total_tax: 0, grand_total: 0 },
  );

  return { lines, totals };
}
