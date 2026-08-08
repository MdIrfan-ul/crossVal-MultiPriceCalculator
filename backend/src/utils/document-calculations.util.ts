// documents/utils/document-calculations.util.ts

export interface DiscountInput {
    type: 'fixed' | 'percent';
    value: number;
}

export interface LineItemInput {
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
    return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function calculateLineItem(item: LineItemInput): LineItemCalculation {
    const line_subtotal = roundCurrency(item.quantity * item.unit_price);

    let discount_amount = 0;
    if (item.discount) {
        discount_amount =
            item.discount.type === 'fixed'
                ? roundCurrency(item.discount.value)
                : roundCurrency((line_subtotal * item.discount.value) / 100);
        discount_amount = Math.min(discount_amount, line_subtotal);
    }

    const discounted_amount = roundCurrency(line_subtotal - discount_amount);

    const tax_amount = item.tax_percent
        ? roundCurrency((discounted_amount * item.tax_percent) / 100)
        : 0;

    const line_total = roundCurrency(discounted_amount + tax_amount);

    return {
        line_subtotal,
        discount_amount,
        discounted_amount,
        tax_amount,
        line_total,
    };
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