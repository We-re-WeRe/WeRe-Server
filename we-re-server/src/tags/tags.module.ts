import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { TagRepository } from './tags.repository';

@Module({
  controllers: [TagsController],
  providers: [TagsService, TagRepository],
})
export class TagsModule {}
