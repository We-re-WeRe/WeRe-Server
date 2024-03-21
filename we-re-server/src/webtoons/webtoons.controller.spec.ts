import { Test, TestingModule } from '@nestjs/testing';
import { WebtoonsController } from './webtoons.controller';
import { WebtoonsService } from './webtoons.service';

describe('WebtoonsController', () => {
  let controller: WebtoonsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebtoonsController],
      providers: [WebtoonsService],
    }).compile();

    controller = module.get<WebtoonsController>(WebtoonsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
