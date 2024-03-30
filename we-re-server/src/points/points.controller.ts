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
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ReadPointHistoryDto, ReadPointSumDto } from './dto/read-point.dto';

@ApiTags('Points')
@Controller('points')
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @ApiOperation({ summary: 'get point history API' })
  @ApiOkResponse({
    description: 'Request Success',
    type: [ReadPointHistoryDto],
  })
  @Get('history/:userId')
  findHistoryById(
    @Param('userId') user_id: number,
  ): Promise<ReadPointHistoryDto[]> {
    return this.pointsService.findHistoryById(user_id);
  }

  @ApiOperation({ summary: "get user's total point API" })
  @ApiOkResponse({ description: 'Request Success', type: ReadPointSumDto })
  @Get('sum/:userId')
  async findSumById(
    @Param('userId') user_id: number,
  ): Promise<ReadPointSumDto> {
    return await this.pointsService.findSumById(user_id);
  }
}
