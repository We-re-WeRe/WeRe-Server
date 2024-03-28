import { Module } from '@nestjs/common';
import { WebtoonsService } from './webtoons.service';
import { WebtoonsController } from './webtoons.controller';
import { WebtoonRepository } from './webtoons.repository';
import { StoragesModule } from 'src/storages/storages.module';
import { LikesModule } from 'src/likes/likes.module';

@Module({
  imports: [StoragesModule, LikesModule],
  controllers: [WebtoonsController],
  providers: [WebtoonsService, WebtoonRepository],
})
export class WebtoonsModule {}
