import {
    ArgumentsHost,
    BadRequestException,
    Catch,
    ConflictException,
    ExceptionFilter,
    HttpException,
    InternalServerErrorException,
    Logger,
} from "@nestjs/common"
import { Response } from "express"
import { MongoServerError } from "mongodb"
import { LineItemCalculationError } from "src/utils/document-calculations.util"

function isMongoDuplicateKeyError(error: unknown): error is MongoServerError {
    return (
        error instanceof Error &&
        error.name === "MongoServerError" &&
        (error as any).code === 11000
    )
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name)

    catch(error: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse<Response>()

        if (isMongoDuplicateKeyError(error)) {
            const conflict = new ConflictException(this.buildUniqueConstraintMessage(error))
            const status = conflict.getStatus()
            const body = conflict.getResponse()
            this.logger.warn(`${status} - ${JSON.stringify(body)}`)
            return response.status(status).json(body)
        }

        const exception =
            error instanceof HttpException
                ? error
                : new InternalServerErrorException("Something went wrong. Please try again later.")

        const status = exception.getStatus()
        const body = exception.getResponse()

        if (error instanceof HttpException) {
            this.logger.warn(`${status} - ${JSON.stringify(body)}`)
        } else if (error instanceof LineItemCalculationError) {
            throw new BadRequestException(error.message);
        }
        else {
            this.logger.error(
                "Unhandled error",
                error instanceof Error ? error.stack : String(error),
            )
        }

        response.status(status).json(body)
    }

    private buildUniqueConstraintMessage(error: MongoServerError): string {
        // keyPattern looks like: { email: 1 } or { email: 1, tenant_id: 1 } for compound indexes
        const fields = error.keyPattern ? Object.keys(error.keyPattern) : []

        if (fields.length === 0) {
            return "This record already exists"
        }

        if (fields.length === 1) {
            const field = this.toReadableField(fields[0])
            return `${field} already in use`
        }

        // Composite unique index (multiple fields)
        const readableFields = fields.map((f) => this.toReadableField(f)).join(', ')
        return `${readableFields} combination already in use`
    }

    private toReadableField(field: string): string {
        // snake_case -> Title Case, e.g. "email" -> "Email", "user_name" -> "User name"
        return field
            .replace(/_/g, ' ')
            .replace(/^./, (char) => char.toUpperCase())
    }
}