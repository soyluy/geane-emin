import { Module } from '@nestjs/common';
import { LocalAuthService } from './local-auth.service';
import { LocalAuthController } from './local-auth.controller';

@Module({
  providers: [LocalAuthService],
  controllers: [LocalAuthController],
})
export class LocalAuthModule {}
