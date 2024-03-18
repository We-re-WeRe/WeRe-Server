import { Module } from '@nestjs/common';
import { PointsService } from './points.service';
import { PointsController } from './points.controller';
import { PointRepository } from './points.repository';

@Module({
  controllers: [PointsController],
  providers: [PointsService, PointRepository],
})
export class PointsModule {}
