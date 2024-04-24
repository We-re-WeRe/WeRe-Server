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
import { CustomBadTypeRequestException } from 'src/utils/custom_exceptions';
import { UsersService } from 'src/users/users.service';

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
    try {
      if (!userId) throw new CustomBadTypeRequestException('userId', userId);
      return this.pointsService.findHistoryById(userId);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: "get user's total point API" })
  @ApiOkResponse({ description: 'Request Success', type: ReadPointSumDto })
  @Get('sum/:userId')
  async findSumById(@Param('userId') userId: number): Promise<ReadPointSumDto> {
    try {
      if (!userId) throw new CustomBadTypeRequestException('userId', userId);
      const result = await this.pointsService.findSumById(userId);
      return result;
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'create Point object' })
  @ApiCreatedResponse({ description: 'Request Success' })
  @Post()
  async createPoint(@Body() createdPointDto: CreatePointDto) {
    try {
      return await this.pointsService.createPoint(createdPointDto);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Delete Point object' })
  @ApiNoContentResponse({ description: 'Request Success' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
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
  @Delete('user/:userId')
  async deleteByUserId(@Param('userId') userId: number) {
    try {
      if (!userId) throw new CustomBadTypeRequestException('userId', userId);
      return await this.pointsService.deleteByUserId(userId);
    } catch (error) {
      throw error;
    }
  }
}
