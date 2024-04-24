import { Injectable, Logger } from '@nestjs/common';
import { CreatePointDto } from './dto/create-point.dto';
import { UpdatePointDto } from './dto/update-point.dto';
import { PointRepository } from './points.repository';
import { ReadPointHistoryDto, ReadPointSumDto } from './dto/read-point.dto';
import { plainToClass, plainToInstance } from 'class-transformer';
import { getPointMountByReason } from 'src/entities/point.entity';
import {
  CustomDataBaseException,
  CustomNotFoundException,
} from 'src/utils/custom_exceptions';
import { UserRepository } from 'src/users/users.repository';

@Injectable()
export class PointsService {
  constructor(
    private readonly pointRepository: PointRepository,
    private readonly userRepository: UserRepository,
  ) {}
  /**
   * get point history.
   * @param {number} userId user ID
   * @returns {ReadPointHistoryDto[]}
   */
  async findHistoryById(userId: number): Promise<ReadPointHistoryDto[]> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new CustomNotFoundException('userId');
    const queryResult = await this.pointRepository.findHistoryById(userId);
    const result: ReadPointHistoryDto[] = plainToInstance(
      ReadPointHistoryDto,
      queryResult,
    );
    return result;
  }

  /**
   * get total point sum
   * @param {number} userId user ID
   * @returns {ReadPointSumDto}
   */
  async findSumById(userId: number): Promise<ReadPointSumDto> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new CustomNotFoundException('userId');
    const queryResult = await this.pointRepository.findSumById(user.id);
    const result: ReadPointSumDto = new ReadPointSumDto(queryResult, user.id);
    return result;
  }
  async createPoint(createdPointDto: CreatePointDto) {
    // dto 값 정합성 체크.
    if (!createdPointDto.mount)
      createdPointDto.mount = getPointMountByReason(createdPointDto.reason);
    const queryResult = await this.pointRepository.createPoint(createdPointDto);
    const id = queryResult.identifiers[0].id;
    if (!id) {
      throw new CustomDataBaseException('create is not worked.');
    }
    const result = await this.pointRepository.findOneBy(id);
    return result;
  }

  async delete(id: number): Promise<void> {
    const queryResult = await this.pointRepository.delete(id);
    if (!queryResult.affected) throw new CustomNotFoundException('id');
    return;
  }

  async deleteByUserId(userId: number) {
    const queryResult = await this.pointRepository.deleteByUserId(userId);
    return;
  }
}
