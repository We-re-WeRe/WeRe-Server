import { Test, TestingModule } from '@nestjs/testing';
import { LogInService } from './log-in.service';

describe('LogInService', () => {
  let service: LogInService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogInService],
    }).compile();

    service = module.get<LogInService>(LogInService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
