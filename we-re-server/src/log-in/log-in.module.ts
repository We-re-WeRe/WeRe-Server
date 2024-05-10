import { Module } from '@nestjs/common';
import { LogInService } from './log-in.service';
import { LogInController } from './log-in.controller';
import { LogInRepository } from './log-in.repository';

@Module({
  controllers: [LogInController],
  providers: [LogInService, LogInRepository],
  exports: [LogInService],
})
export class LogInModule {}
