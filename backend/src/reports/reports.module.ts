import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';
import { DocumentSchema, InvoiceDocument } from 'src/documents/schema/document.schema';
import { User, UserSchema } from 'src/users/schema/user.schema';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { DocumentsModule } from 'src/documents/documents.module';
@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: InvoiceDocument.name, schema: DocumentSchema }
        ]),
        DocumentsModule
    ],
    controllers: [ReportsController],
    providers: [ReportsService],
})
export class ReportsModule { }
