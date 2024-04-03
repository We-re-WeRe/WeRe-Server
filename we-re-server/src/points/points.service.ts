import { Injectable } from '@nestjs/common';
import { CreatePointDto } from './dto/create-point.dto';
import { UpdatePointDto } from './dto/update-point.dto';
import { PointRepository } from './points.repository';
import { ReadPointHistoryDto, ReadPointSumDto } from './dto/read-point.dto';
import { plainToInstance } from 'class-transformer';

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
}
