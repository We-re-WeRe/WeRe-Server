import { Injectable } from '@nestjs/common';
import { CreatePointDto } from './dto/create-point.dto';
import { UpdatePointDto } from './dto/update-point.dto';
import { PointRepository } from './points.repository';

@Injectable()
export class PointsService {
  constructor(private readonly pointRepository: PointRepository) {}
  async findHistoryById(id: number) {
    return await this.pointRepository.findHistoryById(id);
  }

  async findSumById(id: number) {
    return await this.pointRepository.findSumById(id);
  }
}
