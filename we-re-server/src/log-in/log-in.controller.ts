import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LogInService } from './log-in.service';
import { CreateLogInDto } from './dto/create-log-in.dto';
import { UpdateLogInDto } from './dto/update-log-in.dto';

@Controller('log-in')
export class LogInController {
  constructor(private readonly logInService: LogInService) {}

  @Post()
  create(@Body() createLogInDto: CreateLogInDto) {
    return this.logInService.create(createLogInDto);
  }

  @Get()
  findAll() {
    return this.logInService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.logInService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLogInDto: UpdateLogInDto) {
    return this.logInService.update(+id, updateLogInDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.logInService.remove(+id);
  }
}
