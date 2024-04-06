import { Injectable } from '@nestjs/common';
import { CreatePointDto } from './dto/create-point.dto';
import { UpdatePointDto } from './dto/update-point.dto';
import { PointRepository } from './points.repository';
import { ReadPointHistoryDto, ReadPointSumDto } from './dto/read-point.dto';
import { plainToInstance } from 'class-transformer';
import { getPointMountByReason } from 'src/entities/point.entity';

@Injectable()
export class PointsService {
  constructor(private readonly pointRepository: PointRepository) {}
  /**
   * get point history.
   * @param {number} user_id user ID
   * @returns {ReadPointHistoryDto[]}
   */
  async findHistoryById(user_id: number): Promise<ReadPointHistoryDto[]> {
    const queryResult = await this.pointRepository.findHistoryById(user_id);
    const result: ReadPointHistoryDto[] = plainToInstance(
      ReadPointHistoryDto,
      queryResult,
    );
    return result;
  }

  /**
   * get total point sum
   * @param {number} user_id user ID
   * @returns {ReadPointSumDto}
   */
  async findSumById(user_id: number): Promise<ReadPointSumDto> {
    const queryResult = await this.pointRepository.findSumById(user_id);
    const result: ReadPointSumDto = plainToInstance(
      ReadPointSumDto,
      queryResult,
    );
    return result;
  }
  async createPoint(createdPointDto: CreatePointDto) {
    if (!createdPointDto.mount)
      createdPointDto.mount = getPointMountByReason(createdPointDto.reason);
    const result = await this.pointRepository.createPoint(createdPointDto);
    return result;
  }

  async delete(id: number) {
    const result = await this.pointRepository.delete(id);
    return result;
  }

  async deleteByUserId(userId: number) {
    const result = await this.pointRepository.deleteByUserId(userId);
    return result;
  }
}
