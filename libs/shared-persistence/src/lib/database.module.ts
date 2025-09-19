import { DynamicModule, Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepository } from './repository/user/user.repository';
import { UserSchema } from './mongo/user.schema';

@Global()
@Module({})
export class DatabaseModule {
  static forRoot(): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        MongooseModule.forRoot(
          process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/geane', // Default to local MongoDB if no URI is provided
          {
            user: process.env.MONGO_USER,
            pass: process.env.MONGO_PASSWORD,
            dbName: process.env.MONGO_DB_NAME || 'test',
          },
        ),
        MongooseModule.forFeature([
          { name: 'User', schema: UserSchema },
        ]),
      ],
      providers: [UserRepository],
      exports: [UserRepository],
    };
  }
}
