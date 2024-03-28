import { Module } from '@nestjs/common';
import { StoragesService } from './storages.service';
import { StoragesController } from './storages.controller';
import { StorageRepository } from './storages.repository';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [StoragesController],
  providers: [StoragesService, StorageRepository],
  exports: [StoragesService],
})
export class StoragesModule {}
