import { Controller, Get } from '@nestjs/common';
import { DocumentService } from './documents.service';

@Controller('document')
export class DocumentController {
    constructor(private readonly appService: DocumentService) { }

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }
}
