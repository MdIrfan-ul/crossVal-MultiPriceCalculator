import { Module } from '@nestjs/common';
import { User, UserSchema } from './schema/user.schema';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';
@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])]
})
export class UsersModule { }
