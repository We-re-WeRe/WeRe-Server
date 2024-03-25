import { Module } from '@nestjs/common';
import { WebtoonsService } from './webtoons.service';
import { WebtoonsController } from './webtoons.controller';
import { WebtoonRepository } from './webtoons.repository';
import { StoragesModule } from 'src/storages/storages.module';

@Module({
  imports: [StoragesModule],
  controllers: [WebtoonsController],
  providers: [WebtoonsService, WebtoonRepository],
})
export class WebtoonsModule {}
