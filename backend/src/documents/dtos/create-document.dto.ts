// documents/dto/create-document.dto.ts
import { Type } from 'class-transformer';
import {
    IsString,
    IsNotEmpty,
    IsDateString,
    IsEnum,
    IsOptional,
    IsArray,
    ValidateNested,
    ArrayMinSize,
} from 'class-validator';
import { LineItemDto } from './line-item.dto';

export enum DocumentStatus {
    DRAFT = 'draft',
    FINALIZED = 'finalized',
}

export class CreateDocumentDto {
    @IsString()
    @IsNotEmpty({ message: 'Title is required' })
    title!: string;

    @IsString()
    @IsNotEmpty({ message: 'Customer name is required' })
    customer_name!: string;

    @IsDateString({}, { message: 'issue_date must be a valid date string (e.g. YYYY-MM-DD)' })
    issue_date!: string;

    @IsOptional()
    @IsEnum(DocumentStatus, { message: 'status must be either "draft" or "finalized"' })
    status?: DocumentStatus = DocumentStatus.DRAFT;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => LineItemDto)
    line_items!: LineItemDto[];
}