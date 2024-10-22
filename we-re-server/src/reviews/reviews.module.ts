import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { ReviewRepository } from './reviews.repository';
import { LikesModule } from 'src/likes/likes.module';
import { TagsModule } from 'src/tags/tags.module';

@Module({
  imports: [LikesModule, TagsModule],
  controllers: [ReviewsController],
  providers: [ReviewsService, ReviewRepository],
  exports: [ReviewsService],
})
export class ReviewsModule {}
