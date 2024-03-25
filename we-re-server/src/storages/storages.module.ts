import { Module } from '@nestjs/common';
import { StoragesService } from './storages.service';
import { StoragesController } from './storages.controller';
import { StorageRepository } from './storages.repository';

@Module({
  controllers: [StoragesController],
  providers: [StoragesService, StorageRepository],
  exports: [StoragesService],
})
export class StoragesModule {}
