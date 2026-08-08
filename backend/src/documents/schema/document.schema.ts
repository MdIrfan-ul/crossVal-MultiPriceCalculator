// documents/schemas/document.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document as MongooseDocument, Types } from 'mongoose';

// ---------- Line Item Discount (sub-schema) ----------

export type DiscountType = 'fixed' | 'percent';

@Schema({ _id: false })
export class LineItemDiscount {
    @Prop({ type: String, enum: ['fixed', 'percent'], required: true })
    type!: DiscountType;

    @Prop({
        type: Number,
        required: true,
        min: [0, 'Discount value must be 0 or greater'],
    })
    value!: number;
}

export const LineItemDiscountSchema = SchemaFactory.createForClass(LineItemDiscount);

// Percent discount can't exceed 100 — fixed discounts aren't capped here
// since that depends on the line subtotal, which isn't stored.
(LineItemDiscountSchema as any).pre('validate', function (this: any, next?: (err?: Error) => void) {
    if (this.type === 'percent' && this.value > 100) {
        this.invalidate('value', 'Percent discount cannot exceed 100');
    }
    next?.();
});

// ---------- Line Item (sub-schema) ----------

@Schema({ _id: false })
export class LineItem {
    @Prop({ type: String, required: false, trim: true })
    description?: string;

    @Prop({
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1'],
    })
    quantity!: number;

    @Prop({
        type: Number,
        required: true,
        min: [0, 'Unit price must be 0 or greater'],
    })
    unit_price!: number;

    @Prop({ type: LineItemDiscountSchema, required: false })
    discount?: LineItemDiscount;

    @Prop({
        type: Number,
        required: false,
        min: [0, 'Tax percent must be 0 or greater'],
        max: [100, 'Tax percent cannot exceed 100'],
    })
    tax_percent?: number;

    @Prop({ type: Number }) line_subtotal?: number;
    @Prop({ type: Number }) discount_amount?: number;
    @Prop({ type: Number }) discounted_amount?: number;
    @Prop({ type: Number }) tax_amount?: number;
    @Prop({ type: Number }) line_total?: number;
}

export const LineItemSchema = SchemaFactory.createForClass(LineItem);

// ---------- Document ----------

export type DocumentStatus = 'draft' | 'finalized';

export type DocumentDocument = InvoiceDocument & MongooseDocument;

@Schema({
    collection: 'documents',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class InvoiceDocument {
    @Prop({ type: String, required: true, trim: true })
    title!: string;

    @Prop({ type: String, required: true, trim: true })
    customer_name!: string;

    @Prop({ type: Date, required: true })
    issue_date!: Date;

    @Prop({
        type: String,
        enum: ['draft', 'finalized'],
        default: 'draft',
        required: true,
    })
    status!: DocumentStatus;

    @Prop({ type: [LineItemSchema], default: [] })
    line_items!: LineItem[];

    @Prop({ type: Number, default: 0 }) subtotal!: number;
    @Prop({ type: Number, default: 0 }) total_discount!: number;
    @Prop({ type: Number, default: 0 }) total_tax!: number;
    @Prop({ type: Number, default: 0 }) grand_total!: number;

    @Prop({ type: Types.ObjectId, ref: 'Users', required: false })
    created_by?: Types.ObjectId;

    // Soft-delete field, consistent with user.schema.ts
    @Prop({ type: Date, default: null })
    deleted_at?: Date | null;
}

export const DocumentSchema = SchemaFactory.createForClass(InvoiceDocument);

// Require at least one line item before a document can be finalized.
// Remove this if drafts with zero items should be finalizable.
(DocumentSchema as any).pre('validate', function (this: any) {
    if (this.status === 'finalized' && (!this.line_items || this.line_items.length === 0)) {
        this.invalidate('line_items', 'A finalized document must have at least one line item');
    }
});

// Exclude soft-deleted docs by default, matching user.schema.ts convention
function excludeDeleted(this: any) {
    if (this.getQuery().deleted_at === undefined) {
        this.where({ deleted_at: null });
    }
}

(DocumentSchema as any).pre(['find', 'findOne', 'countDocuments'], excludeDeleted);