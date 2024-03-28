import { Module } from '@nestjs/common';
import { StoragesService } from './storages.service';
import { StoragesController } from './storages.controller';
import { StorageRepository } from './storages.repository';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { LikesModule } from 'src/likes/likes.module';

@Module({
  imports: [UsersModule, LikesModule],
  controllers: [StoragesController],
  providers: [StoragesService, StorageRepository],
  exports: [StoragesService],
})
export class StoragesModule {}
