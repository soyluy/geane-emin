import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import type { User } from '@geane/shared-types';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class UserDocument extends Document<Types.ObjectId> implements User {
    
    get userId(): string {
        return this._id.toHexString();
    }

    @Prop({
        type: String,
        required: true,
        unique: true,
        index: true,
    })
    email!: string;

    @Prop({
        type: String,
        required: true,
        unique: true,
        index: true,
    })
    username!: string;

    @Prop({
        required: false,
        select: false,
    })
    passwordHash?: string;

    @Prop({
        type: String,
        required: false,
    })
    firstName?: string;

    @Prop({
        type: String,
        required: false,
    })
    lastName?: string;

    @Prop({
        type: Date,
        required: false,
        validate: {
            validator: (value: Date) => {
                return value instanceof Date && !isNaN(value.getTime());
            }
        },
        message: 'Birthdate must be a valid date.'
    })
    birthdate?: Date;

    @Prop({
        type: String,
        required: false,
        default: undefined,
        validate: {
            validator: (value: string | undefined) => {
                if (!value) return true; // Allow undefined
                const urlPattern = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w- ./?%&=]*)?$/;
                return urlPattern.test(value);
            },
            message: 'Profile picture URL must be a valid URL.'
        }
    })
    profilePictureUrl?: string | undefined;

    @Prop({
        // TODO: define an enum for roles
        // roles: ['admin', 'user', 'guest']
        type: [String],
        required: true,
        default: [],
        validate: {
            validator: (value: string[]) => {
                return Array.isArray(value) && value.every(role => typeof role === 'string');
            },
            message: 'Roles must be an array of strings.'
        }
    })
    roles!: string[];

    @Prop({
        type: Boolean,
        default: false,
        required: true,
    })
    isActive!: boolean;
    @Prop({
        type: Boolean,
        default: false,
        required: true,
    })
    isVerified!: boolean;

    @Prop()
    createdAt!: Date;

    @Prop()
    updatedAt!: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);