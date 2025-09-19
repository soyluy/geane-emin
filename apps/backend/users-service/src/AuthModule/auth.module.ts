import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalAuthModule } from '../LocalAuthModule/local-auth.module';

@Module({
  imports: [LocalAuthModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
