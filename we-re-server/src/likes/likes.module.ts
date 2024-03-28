import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesRepository } from './likes.repository';

@Module({
  providers: [LikesService, LikesRepository],
  exports: [LikesService],
})
export class LikesModule {}
