import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { InvoiceDocument } from './schema/document.schema';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { calculateDocumentTotals } from 'src/utils/document-calculations.util';

@Injectable()
export class DocumentService {
    constructor(
        @InjectModel(InvoiceDocument.name) private readonly documentModel: Model<InvoiceDocument>,
    ) { }

    async create(createDocumentInput: CreateDocumentDto, userId: string) {
        if (!createDocumentInput.line_items.length) {
            throw new BadRequestException('line_items needed to create a document.')
        }
        const { lines, totals } = calculateDocumentTotals(createDocumentInput.line_items);

        // Merge computed per-line amounts back onto each line item so
        // they're stored alongside the raw inputs (useful for display/export
        // without recalculating every read).
        const line_items = createDocumentInput.line_items.map((item, i) => ({
            ...item,
            ...lines[i],
        }));
        return await this.documentModel.create({
            title: createDocumentInput.title,
            customer_name: createDocumentInput.customer_name,
            issue_date: new Date(createDocumentInput.issue_date),
            status: createDocumentInput.status ?? 'draft',
            line_items,
            subtotal: totals.subtotal,
            total_discount: totals.total_discount,
            total_tax: totals.total_tax,
            grand_total: totals.grand_total,
            created_by: userId,
        });
    }

    async update(id: string, updateDocumentInput: UpdateDocumentDto, userId: string) {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('Invalid document id');
        }
        const existing = await this.documentModel.findOne({
            _id: id,
            deleted_at: null,
        });

        if (!existing) {
            throw new NotFoundException('Document not found')
        }

        // Prevent editing a finalized document — adjust/remove if not a real rule
        if (existing.status === 'finalized') {
            throw new BadRequestException('Finalized documents cannot be edited')
        }
        if (updateDocumentInput?.title !== undefined) {
            existing.title = updateDocumentInput.title;
        }
        if (updateDocumentInput?.customer_name !== undefined) {
            existing.customer_name = updateDocumentInput.customer_name;
        }
        if (updateDocumentInput?.issue_date !== undefined) {
            existing.issue_date = new Date(updateDocumentInput.issue_date);
        }
        if (updateDocumentInput?.status !== undefined) {
            existing.status = updateDocumentInput.status;
        }
        if (updateDocumentInput?.line_items !== undefined) {
            const { lines, totals } = calculateDocumentTotals(updateDocumentInput.line_items);
            existing.line_items = updateDocumentInput.line_items.map((item, i) => ({
                ...item,
                ...lines[i],
            })) as any;
            existing.subtotal = totals.subtotal;
            existing.total_discount = totals.total_discount;
            existing.total_tax = totals.total_tax;
            existing.grand_total = totals.grand_total;
        }
        await existing.save();
        return existing;
    }
}
