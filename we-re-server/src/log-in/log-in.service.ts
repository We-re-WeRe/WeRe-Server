import { Injectable } from '@nestjs/common';
import { CreateLogInDto } from './dto/create-log-in.dto';
import { UpdateLogInDto } from './dto/update-log-in.dto';

@Injectable()
export class LogInService {
  create(createLogInDto: CreateLogInDto) {
    return 'This action adds a new logIn';
  }

  findAll() {
    return `This action returns all logIn`;
  }

  findOne(id: number) {
    return `This action returns a #${id} logIn`;
  }

  update(id: number, updateLogInDto: UpdateLogInDto) {
    return `This action updates a #${id} logIn`;
  }

  remove(id: number) {
    return `This action removes a #${id} logIn`;
  }
}
