// documents/dto/update-document.dto.ts
import { PartialType } from '@nestjs/mapped-types';
// If this project uses GraphQL (as seen in your other resolvers),
// prefer '@nestjs/graphql' PartialType instead so InputType metadata carries over:
// import { PartialType } from '@nestjs/graphql';
import { CreateDocumentDto } from './create-document.dto';
import { IsOptional, IsMongoId } from 'class-validator';

export class UpdateDocumentDto extends PartialType(CreateDocumentDto) {
    @IsOptional()
    @IsMongoId({ message: 'id must be a valid Mongo ObjectId' })
    id?: string;
}