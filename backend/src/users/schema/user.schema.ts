import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { Document } from 'mongoose';
import { hashPassword } from 'src/utils/password.util';

export type UserDocument = User & Document;

@Schema({
    collection: 'users',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class User {
    @Prop({ type: String, default: () => randomUUID() })
    _id!: string;

    @Prop({ type: String, required: true })
    name!: string;

    @Prop({ type: String, required: true, unique: true })
    email!: string;

    @Prop({ type: String, required: true })
    password!: string;

    @Prop({ type: String, required: false })
    profile?: string;

    @Prop({ type: Boolean, required: false })
    is_user_verified?: boolean;

    // Soft-delete field (paranoid: true equivalent)
    @Prop({ type: Date, default: null })
    deleted_at?: Date | null;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Equivalent of @BeforeCreate hashPasswordHook
(UserSchema as any).pre('save', async function (this: UserDocument, next: (err?: Error) => void) {
    // Only hash if password is new or has been modified
    if (this.isModified('password') && this.password) {
        this.password = await hashPassword(this.password);
    }
    next();
});

// Optional: exclude soft-deleted docs by default on find queries
// (Mongoose has no built-in "paranoid" mode like Sequelize, so this
// middleware mimics it for common query methods)
function excludeDeleted(this: any, next: () => void) {
    if (this.getQuery().deleted_at === undefined) {
        this.where({ deleted_at: null });
    }
    next();
}

(UserSchema as any).pre('find', excludeDeleted);
(UserSchema as any).pre('findOne', excludeDeleted);
(UserSchema as any).pre('countDocuments', excludeDeleted);