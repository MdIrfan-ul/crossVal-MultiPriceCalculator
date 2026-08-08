// documents/dto/line-item-discount.dto.ts
import { Type } from 'class-transformer';
import {
    IsEnum,
    IsNumber,
    Min,
    Max,
    ValidateIf,
} from 'class-validator';

export enum DiscountType {
    FIXED = 'fixed',
    PERCENT = 'percent',
}

export class LineItemDiscountDto {
    @IsEnum(DiscountType, { message: 'type must be either "fixed" or "percent"' })
    type!: DiscountType;

    @IsNumber({}, { message: 'value must be a number' })
    @Min(0, { message: 'Discount value must be 0 or greater' })
    @ValidateIf((o) => o.type === DiscountType.PERCENT)
    @Max(100, { message: 'Percent discount cannot exceed 100' })
    value!: number;
}