import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';
import { User, UserSchema } from 'src/users/schema/user.schema';
import { DocumentSchema, InvoiceDocument } from './schema/document.schema';
import { DocumentService } from './documents.service';
import { DocumentController } from './documents.controller';
@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: InvoiceDocument.name, schema: DocumentSchema }
        ])],
    controllers: [DocumentController],
    providers: [DocumentService],
})
export class DocumentsModule { }
