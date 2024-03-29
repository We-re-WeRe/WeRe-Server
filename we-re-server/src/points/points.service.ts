import { Injectable } from '@nestjs/common';
import { CreatePointDto } from './dto/create-point.dto';
import { UpdatePointDto } from './dto/update-point.dto';
import { PointRepository } from './points.repository';

@Injectable()
export class PointsService {
  constructor(private readonly pointRepository: PointRepository) {}
  async findHistoryById(user_id: number) {
    return await this.pointRepository.findHistoryById(user_id);
  }

  async findSumById(user_id: number) {
    return await this.pointRepository.findSumById(user_id);
  }
}
