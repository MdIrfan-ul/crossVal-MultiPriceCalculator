// documents/dto/line-item.dto.ts
import { Type } from 'class-transformer';
import {
    IsString,
    IsNotEmpty,
    IsInt,
    IsNumber,
    Min,
    Max,
    IsOptional,
    ValidateNested,
} from 'class-validator';
import { LineItemDiscountDto } from './line-item-discount.dto';

export class LineItemDto {
    @IsString()
    @IsNotEmpty({ message: 'Line item description is required' })
    description!: string;

    @IsInt({ message: 'Quantity must be a whole number' })
    @Min(1, { message: 'Quantity must be at least 1' })
    quantity!: number;

    @IsNumber({}, { message: 'Unit price must be a number' })
    @Min(0, { message: 'Unit price must be 0 or greater' })
    unit_price!: number;

    @IsOptional()
    @ValidateNested()
    @Type(() => LineItemDiscountDto)
    discount?: LineItemDiscountDto;

    @IsOptional()
    @IsNumber({}, { message: 'Tax percent must be a number' })
    @Min(0, { message: 'Tax percent must be 0 or greater' })
    @Max(100, { message: 'Tax percent cannot exceed 100' })
    tax_percent?: number;
}