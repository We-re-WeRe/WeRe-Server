import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { PointsService } from './points.service';
import { CreatePointDto } from './dto/create-point.dto';
import { UpdatePointDto } from './dto/update-point.dto';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
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
    @Param('userId') userId: number,
  ): Promise<ReadPointHistoryDto[]> {
    return this.pointsService.findHistoryById(userId);
  }

  @ApiOperation({ summary: "get user's total point API" })
  @ApiOkResponse({ description: 'Request Success', type: ReadPointSumDto })
  @Get('sum/:userId')
  async findSumById(@Param('userId') userId: number): Promise<ReadPointSumDto> {
    return await this.pointsService.findSumById(userId);
  }

  @ApiOperation({ summary: 'create Point object' })
  @ApiCreatedResponse({ description: 'Request Success' })
  @Post()
  async createPoint(@Body() createdPointDto: CreatePointDto) {
    return await this.pointsService.createPoint(createdPointDto);
  }

  @ApiOperation({ summary: 'Delete Point object' })
  @ApiNoContentResponse({ description: 'Request Success' })
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this.pointsService.delete(id);
  }

  @ApiOperation({ summary: 'Delete Point object by user Id' })
  @ApiNoContentResponse({ description: 'Request Success' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('user/:userId')
  async deleteByUserId(@Param('userId') userId: number) {
    return await this.pointsService.deleteByUserId(userId);
  }
}
