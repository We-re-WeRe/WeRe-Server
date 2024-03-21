import { Module } from '@nestjs/common';
import { WebtoonsService } from './webtoons.service';
import { WebtoonsController } from './webtoons.controller';

@Module({
  controllers: [WebtoonsController],
  providers: [WebtoonsService]
})
export class WebtoonsModule {}
