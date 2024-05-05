import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { ReviewRepository } from './reviews.repository';
import { TagsModule } from 'src/tags/tags.module';

@Module({
  imports: [TagsModule],
  controllers: [ReviewsController],
  providers: [ReviewsService, ReviewRepository],
  exports: [ReviewsService],
})
export class ReviewsModule {}
