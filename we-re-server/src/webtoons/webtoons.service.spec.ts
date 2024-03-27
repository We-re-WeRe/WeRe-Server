import { Test, TestingModule } from '@nestjs/testing';
import { WebtoonsService } from './webtoons.service';

describe('WebtoonsService', () => {
  let service: WebtoonsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebtoonsService],
    }).compile();

    service = module.get<WebtoonsService>(WebtoonsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
