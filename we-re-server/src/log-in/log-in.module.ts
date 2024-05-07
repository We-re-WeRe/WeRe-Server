import { Module } from '@nestjs/common';
import { LogInService } from './log-in.service';
import { LogInController } from './log-in.controller';

@Module({
  controllers: [LogInController],
  providers: [LogInService]
})
export class LogInModule {}
