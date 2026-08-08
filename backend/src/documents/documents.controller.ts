import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { DocumentService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { JwtAuthGuard } from 'src/auth/guards';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { ParseObjectIdPipe } from '@nestjs/mongoose';


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

    @Patch('/:id')
    @UseGuards(JwtAuthGuard)
    async update(
        @Param('id', ParseObjectIdPipe) id: string,
        @Body() updateDocumentDto: UpdateDocumentDto,
        @Req() req: AuthRequest
    ) {
        return this.documentService.update(id, updateDocumentDto, req.user.userId);
    }
}
