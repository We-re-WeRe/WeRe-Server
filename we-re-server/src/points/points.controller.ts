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
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Points')
@Controller('points')
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @ApiOperation({ summary: 'get point history API' })
  @Get('history/:userId')
  findHistoryById(@Param('userId') user_id: string) {
    return this.pointsService.findHistoryById(+user_id);
  }

  @ApiOperation({ summary: "get user's total point API" })
  @Get('sum/:userId')
  findSumById(@Param('userId') user_id: string) {
    return this.pointsService.findSumById(+user_id);
  }
}
