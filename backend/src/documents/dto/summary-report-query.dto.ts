// documents/dto/summary-report-query.dto.ts
import { IsDateString, IsOptional, IsEnum, ValidateIf } from 'class-validator';
import { DocumentStatus } from './create-document.dto';

export enum ReportPeriod {
    TODAY = 'today',
    WEEKLY = 'weekly',
    MONTHLY = 'monthly',
    YEARLY = 'yearly',
    CUSTOM = 'custom',
}

export class SummaryReportQueryDto {
    @IsOptional()
    @IsEnum(ReportPeriod, { message: 'period must be one of today, weekly, monthly, yearly, custom' })
    period?: ReportPeriod = ReportPeriod.TODAY;

    // Required only when period === 'custom'
    @ValidateIf((o) => o.period === ReportPeriod.CUSTOM)
    @IsDateString({}, { message: 'from must be a valid date string (e.g. YYYY-MM-DD) and is required for a custom period' })
    from?: string;

    @ValidateIf((o) => o.period === ReportPeriod.CUSTOM)
    @IsDateString({}, { message: 'to must be a valid date string (e.g. YYYY-MM-DD) and is required for a custom period' })
    to?: string;

    @IsOptional()
    @IsEnum(DocumentStatus, { message: 'status must be either "draft" or "finalized"' })
    status?: DocumentStatus;
}