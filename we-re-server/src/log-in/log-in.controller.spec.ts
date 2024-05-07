import { Test, TestingModule } from '@nestjs/testing';
import { LogInController } from './log-in.controller';
import { LogInService } from './log-in.service';

describe('LogInController', () => {
  let controller: LogInController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogInController],
      providers: [LogInService],
    }).compile();

    controller = module.get<LogInController>(LogInController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
