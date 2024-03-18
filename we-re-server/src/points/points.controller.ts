import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PointsService } from './points.service';
import { CreatePointDto } from './dto/create-point.dto';
import { UpdatePointDto } from './dto/update-point.dto';

@Controller('points')
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @Get('history/:id')
  findHistoryById(@Param('id') id: string) {
    return this.pointsService.findHistoryById(+id);
  }

  @Get(':id')
  findSumById(@Param('id') id: string) {
    return this.pointsService.findSumById(+id);
  }
}
