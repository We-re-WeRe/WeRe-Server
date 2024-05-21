import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  Query,
} from '@nestjs/common';
import { PointsService } from './points.service';
import { CreatePointDto } from './dto/create-point.dto';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ReadPointHistoryDto, ReadPointSumDto } from './dto/read-point.dto';
import { CustomBadTypeRequestException } from 'src/utils/custom_exceptions';
import { UserId } from 'src/utils/custom_decorators';

@ApiTags('Points')
@Controller('points')
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @ApiOperation({ summary: 'get point history API' })
  @ApiOkResponse({
    description: 'Request Success',
    type: [ReadPointHistoryDto],
  })
  @Get('history')
  findHistoryById(@UserId() userId: number): Promise<ReadPointHistoryDto[]> {
    try {
      return this.pointsService.findHistoryById(userId);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: "get user's total point API" })
  @ApiOkResponse({ description: 'Request Success', type: ReadPointSumDto })
  @Get('sum')
  async findSumById(@UserId() userId: number): Promise<ReadPointSumDto> {
    try {
      const result = await this.pointsService.findSumById(userId);
      return result;
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'create Point object' })
  @ApiCreatedResponse({ description: 'Request Success' })
  @Post()
  async createPoint(
    @UserId() userId: number,
    @Body() createdPointDto: CreatePointDto,
  ) {
    try {
      return await this.pointsService.createPoint(userId, createdPointDto);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Delete Point object' })
  @ApiNoContentResponse({ description: 'Request Success' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  async delete(@Query('id') id: number): Promise<void> {
    try {
      if (!id) throw new CustomBadTypeRequestException('id', id);
      return await this.pointsService.delete(id);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Delete Point object by user Id' })
  @ApiNoContentResponse({ description: 'Request Success' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('user')
  async deleteByUserId(@UserId() userId: number) {
    try {
      return await this.pointsService.deleteByUserId(userId);
    } catch (error) {
      throw error;
    }
  }
}
