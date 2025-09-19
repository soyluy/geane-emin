import { Injectable } from '@nestjs/common';
import { CreateUserShape, User } from '@geane/shared-types';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../base-repository';

@Injectable()
export class UserRepository extends BaseRepository<User>{
    constructor(
        @InjectModel('User') private readonly userModel : Model<User>
    ) {
        super(userModel);
    }

    override async create(document: CreateUserShape): Promise<User> {
        this.model.create(document);
        const createdDocument = (await new this.model(document).save()).toObject();
        createdDocument.userId = createdDocument._id.toString();
        return createdDocument as User;
    }

    async findIncludePasswordHash(filter: Partial<User>): Promise<User | null> {
        const user = await this.userModel
            .findOne(filter)
            .select('+passwordHash')
            .lean()
            .exec();
        if(user)    // TODO: Try to find an alternative to this
            user.userId = user._id.toString();
        return user;
    }
}
