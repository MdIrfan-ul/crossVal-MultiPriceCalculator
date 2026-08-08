import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { DocumentService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { JwtAuthGuard } from 'src/auth/guards';


interface AuthRequest extends Request {
    user: { userId: string; email: string };
}
@Controller('document')
export class DocumentController {
    constructor(private readonly documentService: DocumentService) { }

    @Post('/')
    @UseGuards(JwtAuthGuard)
    async create(
        @Body() createDocumentInput: CreateDocumentDto,
        @Req() req: AuthRequest,
    ) {
        return this.documentService.create(createDocumentInput, req.user?.userId);
    }
}
