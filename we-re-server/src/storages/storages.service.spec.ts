import { Test, TestingModule } from '@nestjs/testing';
import { StoragesService } from './storages.service';

describe('StoragesService', () => {
  let service: StoragesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StoragesService],
    }).compile();

    service = module.get<StoragesService>(StoragesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
