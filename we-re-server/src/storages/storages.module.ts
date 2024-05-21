import { Module } from '@nestjs/common';
import { StoragesService } from './storages.service';
import { StoragesController } from './storages.controller';
import { StorageRepository } from './storages.repository';
import { UsersModule } from 'src/users/users.module';
import { LikesModule } from 'src/likes/likes.module';
import { TagsModule } from 'src/tags/tags.module';

@Module({
  imports: [UsersModule, LikesModule, TagsModule],
  controllers: [StoragesController],
  providers: [StoragesService, StorageRepository],
  exports: [StoragesService],
})
export class StoragesModule {}
